import { View, Text, TextInput } from "react-native";
import { commonStyles } from "@/styles/common.style";
import { windowHeight, windowWidth } from "@/themes/app.constant";
import { external } from "@/styles/external.style";
import styles from "@/screens/login/styles";
import color from "@/themes/app.colors";
import SelectInput from "../common/select-input";
import { useState } from "react";
import { countryItems } from "@/configs/country-list";


 interface props {
  width? : number ;
  phone_number : string;
  setPhone_number : (phone_number : string) => void ;
  countryCode : string;
  setCountryCode : (countryCode : string) => void ;
}

export default function PhoneNumberInput({ width, phone_number, setPhone_number, countryCode,setCountryCode}: props) {

  const countryWithKeys = countryItems.map((item, index) => ({
    ...item,
    key: `${item.value}_${index}`, // Unique key based on value and index
  }));
 
  return (
    <View>
      <Text
        style={[commonStyles.mediumTextBlack, { marginTop: windowHeight(8) }]}
      >
        Phone Number
      </Text>
      <View
        style={[
          external.fd_row,
          external.ai_center,
          external.mt_5,
          { flexDirection: "row" },
        ]}
      >
        <View
          style={[
            styles.countryCodeContainer,
            {
              borderColor: color.border,
            },
          ]}
        >
       <SelectInput
       title= "+233"
       placeholder="Select Your Country"
       value={countryCode}
       onValueChange= {(text)=> setCountryCode(text)}
       showWarning={false}
       warning={'Please Choose Your Country Code!'}
       items={countryWithKeys}
       />
        </View>
        <View
          style={[
            styles.phoneNumberInput,
            {
              width: width || windowWidth(326),
              borderColor: color.border,
            },
          ]}
        >
          <TextInput
            style={[commonStyles.regularText]}
            placeholderTextColor={color.subtitle}
            placeholder={"Enter your number"}
            keyboardType="numeric"
            value={phone_number}
            onChangeText={setPhone_number}
            maxLength={10}
          />
        </View>
      </View>
    </View>
  );
}
