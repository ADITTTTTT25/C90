import React from "react"
import LottieView from "lottie-react-native";
export default class SantaClaus extends React.Component{
    render(){
        return(
            
          <LottieView
            source={require('../assets/Santa.json')}
          style={{width:"40%"}}
          autoPlay loop
          />
        )
    }
}