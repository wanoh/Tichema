import { View, Text,Image } from 'react-native'
import React, { useState } from 'react'
import AuthContainer from '@/utils/container/auth-container'
import { windowHeight } from '@/themes/app.constant'
import styles from './styles'
import Images from '@/utils/images'
import { external } from '@/styles/external.style'
import SignInText from '@/components/login/signin.text'
import PhoneNumberInput from '@/components/login/phone-number.input'
import Button from '@/components/common/button'
import {  useToast } from 'react-native-toast-notifications' 
import axios from "axios"
import { router } from 'expo-router'


export default function LoginScreen() {

  const [phone_number, setPhone_number] = useState('')
  const [countryCode, setCountryCode] = useState('+233')
  const toast = useToast();

  const handleSubmit = async () => {
    if(phone_number === "" || countryCode === ""){
      toast.show("Please fill the fields!", {
        placement : "bottom"
      })
    } else {
      // console.log(phone_number, countryCode) 

      const phoneNumber = `${countryCode}${phone_number}`

      await axios.post(`${process.env.EXPO_PUBLIC_SERVER_URI}/registration`,{
        phone_number : phoneNumber
      }).then ((res)=>{
        console.log(res);
      })
      .catch((error) => {
        console.log(error)
      })
    }
  }
  

  return (
    <AuthContainer
    topSpace={windowHeight(150)}
    imageShow ={true}
    container={
     <View>
      <View>
        <View>
          <Image style={styles.transformLine} source={Images.line}/>
          <SignInText/>
          <View style={[external.mt_25, external.Pb_10]}>
            <PhoneNumberInput
            phone_number = {phone_number}
            setPhone_number ={setPhone_number}
            countryCode = {countryCode}
            setCountryCode = {setCountryCode}
            />
            <View style={[external.mt_25, external.Pb_15]}>
              <Button
              title="Get OTP"
              // onPress={()=> handleSubmit()}
              onPress={()=> router.push("/(routes)/otp-verification")}
              />
            </View>
          </View>
        </View>
      </View>

    </View>}  
    />
  )
}