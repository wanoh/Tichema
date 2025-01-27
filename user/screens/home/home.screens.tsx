import { View, Text, SafeAreaView } from 'react-native'
import styles from "./style"
import { commonStyles } from '@/styles/common.style'
import { external } from '@/styles/external.style'
import LocationSearchBar from '@/components/location/location.search.bar'

export default function HomeScreen() {
  return (
    <View style ={[commonStyles.flexContainer,{backgroundColor : "fff"}]}>
      <SafeAreaView style={styles.container}>
        <View style={[external.p_5, external.ph_20]}>
            <Text
                    style={{
                    fontFamily: "TT-Octosquares-Medium",
                    fontSize: 25,
                    }}
                >
                Tichema
            </Text>
            <LocationSearchBar/>
        </View>
        <View>
            
        </View>
        </SafeAreaView>
    </View>
  )
}