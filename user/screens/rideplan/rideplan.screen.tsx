import { View, Text, KeyboardAvoidingView, Platform, TouchableOpacity, Dimensions, TextInput } from 'react-native'
import styles from './styles'
import { useState } from 'react'
import { external } from '@/styles/external.style'
import { fontSizes, windowHeight, windowWidth } from '@/themes/app.constant'
import MapView, { Marker } from "react-native-maps"
import MapViewDirections from "react-native-maps-directions"
import { style } from '../verification/styles'
import { router } from 'expo-router'
import { Clock, LeftArrow, PickLocation } from '@/utils/icons'
import color from '@/themes/app.colors'
import DownArrow from '@/assets/icons/downArrow'
import PlaceHolder from '@/assets/icons/placeHolder'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'

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
    const [locationSelected, setLocationSelected] = useState(false)
    const [travelTimes, setTravelTimes] = useState({
        driving: null,
        walking: null,
        bicycle : null,
        transit: null,
    })

    const [keyboardAvoidingHeight, setKeyboardAvoidingHeight] = useState(false)

    const handleInputChange = (text: any) =>{
        setQuery(text);
    }
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
                </View>
            </View>
    </KeyboardAvoidingView>
  )
}