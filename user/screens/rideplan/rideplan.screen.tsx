import { View, Text, KeyboardAvoidingView, Platform, TouchableOpacity, Dimensions, TextInput, Pressable, ScrollView, Image } from 'react-native'
import styles from './styles'
import { useCallback, useEffect, useState } from 'react'
import { external } from '@/styles/external.style'
import { fontSizes, windowHeight, windowWidth } from '@/themes/app.constant'
import MapView, { Marker } from "react-native-maps"
import MapViewDirections from "react-native-maps-directions"
import { style } from '../verification/styles'
import { router } from 'expo-router'
import moment from 'moment'
import { Clock, LeftArrow, PickLocation,PickUpLocation} from '@/utils/icons'
import color from '@/themes/app.colors'
import DownArrow from '@/assets/icons/downArrow'
import PlaceHolder from '@/assets/icons/placeHolder'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import _ from 'lodash';
import * as Location from "expo-location";
import axios from "axios";
import 'react-native-get-random-values';
import { Toast } from 'react-native-toast-notifications'
import { parseDuration } from '@/utils/time/parse.duration'
import Button from '@/components/common/button'



export default function RidePlanScreen() {

    const [places, setPlaces] = useState<any>([])
    const [query, setQuery] = useState("")
    const [region, setRegion] = useState<any>({
        latitude: 9.4071,
        longitude: -0.8539,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
    })
    const [marker, setMarker] = useState<any>(null)
    const [currentLocation, setCurrentLocation] = useState<any>(null)
    const [distance, setDistance] = useState<any>(null)
    const [locationSelected, setLocationSelected] = useState(false)
    const [selectedVehicle, setSelectedVehicle] = useState("car")
    const [travelTimes, setTravelTimes] = useState({
        driving: null,
        walking: null,
        bicycle : null,
        transit: null,
    })
    const [keyboardAvoidingHeight, setKeyboardAvoidingHeight] = useState(false)


  const fetchTravelTimes = async (origin: any, destination: any) => {
    const modes = ["driving", "walking", "bicycling", "transit"];
    let travelTimes = {
      driving: null,
      walking: null,
      bicycling: null,
      transit: null,
    } as any;

    for (const mode of modes) {
      let params = {
        origins: `${origin.latitude},${origin.longitude}`,
        destinations: `${destination.latitude},${destination.longitude}`,
        key: process.env.EXPO_PUBLIC_GOOGLE_CLOUD_API_KEY!,
        mode: mode,
      } as any;

      if (mode === "driving") {
        params.departure_time = "now";
      }

      try {
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/distancematrix/json`,
          { params }
        );

        const elements = response.data.rows[0].elements[0];
        if (elements.status === "OK") {
          travelTimes[mode] = elements.duration.text;
        }
      } catch (error) {
        console.log(error);
      }
    }

    setTravelTimes(travelTimes);
  };

    const handlePlaceSelect = async (placeId: any) => {
        try {
          const response = await axios.get(
            `https://maps.googleapis.com/maps/api/place/details/json`,
            {
              params: {
                place_id: placeId,
                key: process.env.EXPO_PUBLIC_GOOGLE_CLOUD_API_KEY,
              },
            }
          );
          const { lat, lng } = response.data.result.geometry.location;
    
          const selectedDestination = { latitude: lat, longitude: lng };
          setRegion({
            ...region,
            latitude: lat,
            longitude: lng,
          });
          setMarker({
            latitude: lat,
            longitude: lng,
          });
          setPlaces([]);
          // requestNearbyDrivers();
          setLocationSelected(true);
          setKeyboardAvoidingHeight(false);
          if (currentLocation) {
            await fetchTravelTimes(currentLocation, selectedDestination);
          }
        } catch (error) {
          console.log(error);
        }
      };

      useEffect(() => {
        (async () =>{
          let { status } = await Location.requestForegroundPermissionsAsync();
          if(status !== 'granted') {
            Toast.show('Please approve your location permission to use this feature', 
               {
              type: 'danger',
              placement: 'bottom',
          }
        )
        }
        let location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        const { latitude, longitude } = location.coords;
        setCurrentLocation({
          latitude,
          longitude,
        });
        setRegion({
          latitude,
          longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      })()
      }, [])

      const fetchPlaces = async (input: any) => {
        try {
          const response = await axios.get(`https://maps.googleapis.com/maps/api/place/autocomplete/json`,
            {
            params :{
              input,
              key : process.env.EXPO_PUBLIC_GOOGLE_CLOUD_API_KEY,
              language : "en",
            }
          }
        )
        setPlaces(response.data.predictions)
        } catch (error) {
          console.log(error);
        }
      }

      const debouncedFetchPlaces = useCallback(_.debounce(fetchPlaces, 100), [])

      useEffect(() =>{
        if(query.length > 2){
          debouncedFetchPlaces(query)
        } else {
          setPlaces([])
        }
      }, [query, debouncedFetchPlaces])
  
    const handleInputChange = (text: any) =>{
        setQuery(text);
    }
    const calculateDistance = (lat1: any, lon1: any, lat2: any, lon2: any) => {
      var p = 0.017453292519943295; // Math.PI / 180
      var c = Math.cos;
      var a =
        0.5 -
        c((lat2 - lat1) * p) / 2 +
        (c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p))) / 2;

      return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
    };

    const getEstimatedArrivalTime = (travelTime: any) => {
    const now = moment();
    const travelMinutes = parseDuration(travelTime);
    const arrivalTime = now.add(travelMinutes, "minutes");
    return arrivalTime.format("hh:mm A");
  };

    useEffect(() => {
    if (marker && currentLocation) {
      const dist = calculateDistance(
        currentLocation.latitude,
        currentLocation.longitude,
        marker.latitude,
        marker.longitude
      );
      setDistance(dist);
    }
  }, [marker, currentLocation]);


  return (
    <KeyboardAvoidingView
    style={[external.fx_1]}
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
        <View>
            <View 
                style={{ height: windowHeight(!keyboardAvoidingHeight ? 500 : 300) }}
            >
                <MapView
                style={{flex:1}}
                region={region}
                onRegionChangeComplete={(region) => setRegion(region)}
                >

                {marker && <Marker coordinate={marker}/>}
                {currentLocation && <Marker coordinate={currentLocation}/>}
                {currentLocation && marker && (
                    <MapViewDirections
                    origin ={ currentLocation}
                    destination={marker}
                    apikey={process.env.EXPO_PUBLIC_GOOGLE_CLOUD_API_KEY!}
                    strokeWidth={4}
                    strokeColor="blue "
                    />
                )}
                </MapView>
            </View>
        </View>
        <View style={styles.contentContainer}>
            <View style={styles.container}>
              {
                locationSelected ? (
                  <View>
                    <ScrollView
                    style={{paddingBottom:windowHeight(20),height: windowHeight(280) }}
                    >
                      <View
                      style={{
                        borderBottomWidth: 1,
                        borderBottomColor: "#b5b5b5",
                        paddingBottom: windowHeight(10),
                        flexDirection: "row",
                      }}
                      >
                        <Pressable
                        onPress={() => setLocationSelected(false)}
                        >
                          <LeftArrow />
                        </Pressable>
                        <Text
                        style={{
                          margin:"auto",
                          fontSize :20,
                          fontWeight: "600",
                        }}
                        >
                          Gathering options
                        </Text>
                      </View>
                      <View style={{padding:windowWidth(10)}}>
                        <Pressable
                        style={{
                          width:windowWidth(420),
                          borderWidth:selectedVehicle === "car" ? 2 : 1,
                          borderRadius: 10,
                          padding: 10,
                          marginVertical: 5,
                        }}
                        onPress={() => setSelectedVehicle("car")}
                        >
                          <View
                          style={{margin : "auto"}}
                          >
                            <Image
                            source={require('@/assets/images/vehicles/car.png')}
                            style ={{width:90, height: 80}}
                            />
                          </View>
                          <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between"
                          }}
                          >
                            <View>
                            <Text style={{fontSize:20,fontWeight:"600"}}>
                              Tichema X
                            </Text> 
                            <Text style={{fontSize : 16}}>
                              {/* 20 mins dropoff */}
                              {getEstimatedArrivalTime(travelTimes.driving)} dropoff
                            </Text> 
                            </View>
                            <Text
                            style={{fontSize: windowWidth(20),fontWeight:"600"}}
                            >
                              GHC {(distance.toFixed(2) * 5 ).toFixed(2)}
                            </Text>
                          </View>
                        </Pressable>
                        <View>
                          <Button
                          backgroundColor={"#000"}
                          textColor="#fff"
                          title={`Confirm Booking`}
                          />
                        </View>
                      </View>
                    </ScrollView>
                  </View>
                ) : (
                  <>
                    <View style={{flexDirection:"row", alignContent:"center"}}>
                    <TouchableOpacity
                    onPress={() => router.back()}
                    >
                        <LeftArrow/>
                    </TouchableOpacity>
                    <Text 
                    style={{
                        margin :"auto",
                        fontSize: windowHeight(25),
                        fontWeight : "600",
                    }}>
                        Plan Your Ride
                    </Text>
                </View>
                {/**Picking up time*/}
                <View 
                style={{
                    width: windowWidth(200),
                    height: windowHeight(28),
                    borderRadius : 20,
                    backgroundColor : color.lightGray,
                    alignItems : "center",
                    justifyContent : "center",
                    marginVertical : windowHeight(10)
                }}
                >
                    <View style={{flexDirection:"row", alignItems : "center"}}>
                        <Clock/>
                        <Text 
                        style ={{fontSize : windowHeight(12),
                            fontWeight : "600",
                            paddingHorizontal :8
                        }}
                        >
                            Pick-Up Now
                        </Text>
                        <DownArrow/>
                    </View>
                </View>
                {/**Picking Up Location */}
                <View
                style={{
                    borderWidth: 2,
                    borderColor: "#000",
                    borderRadius : 15,
                    marginBottom : windowHeight(15),
                    paddingHorizontal : windowWidth(15),
                    paddingVertical : windowHeight(5),
                }}
                >
                    <View 
                    style={{flexDirection : "row"}}
                    >
                        <PickLocation/>
                    <View 
                    style={{
                        width : Dimensions.get("window").width * 1 -110,
                        borderBottomWidth : 1,
                        borderBottomColor : "#999",
                        marginLeft : 5,
                        height : windowHeight(20),
                    }}
                    >
                        <Text
                        style={{
                            color: "#2371F0",
                            fontSize: 18,
                            paddingLeft: 5
                        }}
                        >
                            Current Location
                        </Text>
                    </View>
                    </View>
                    <View
                        style={{
                            flexDirection:"row",
                            padding : 12
                        }}
                    >
                    <PlaceHolder/>
                    <View
                    style={{
                      marginLeft: 5,
                      width: Dimensions.get("window").width * 1 - 110,
                    }}
                  >
                    <GooglePlacesAutocomplete
                      placeholder="Where to?"
                      onPress={(data, details = null) => {
                        setKeyboardAvoidingHeight(true);
                        setPlaces([
                          {
                            description: data.description,
                            place_id: data.place_id,
                          },
                        ]);
                      }}
                      query={{
                        key: `${process.env.EXPO_PUBLIC_GOOGLE_CLOUD_API_KEY!}`,
                        language: "en",
                      }}
                      styles={{
                        textInputContainer: {
                          width: "100%",
                        },
                        textInput: {
                          height: 38,
                          color: "#000",
                          fontSize: 16,
                        },
                        predefinedPlacesDescription: {
                          color: "#000",
                        },
                      }}
                      textInputProps={{
                        onChangeText: (text) => handleInputChange(text),
                        value: query,
                        onFocus: () => setKeyboardAvoidingHeight(true),
                      }}
                      onFail={(error) => console.log(error)}
                      fetchDetails={true}
                      debounce={200}
                    />
                  </View>
                    </View>
                </View>
                {/* Last sessions */}
              {places.map((place: any, index: number) => (
                <Pressable
                  key={index}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: windowHeight(20),
                  }}
                  onPress={() => handlePlaceSelect(place.place_id)}
                >
                  <PickUpLocation />
                  <Text style={{ paddingLeft: 15, fontSize: 18 }}>
                    {place.description}
                  </Text>
                </Pressable>
              ))}
              </>
                )
              }
                </View>
            </View>
    </KeyboardAvoidingView>
  )
}