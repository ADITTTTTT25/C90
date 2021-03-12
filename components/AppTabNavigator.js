import React from 'react';
import BookDonateScreen from "../screens/BookDonateScreen";
import BookRequestScreen from "../screens/BookRequestScreen";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { AppStackNavigator } from "./AppStackNavigator";
import {RFValue} from 'react-native-responsive-fontsize';
import { Image } from "react-native";

export const AppTabNavigator = createBottomTabNavigator({
  DonateBooks: {
    screen: AppStackNavigator,
    navigationOptions: {
      tabBarIcon: (
        <Image
          style={{ width: 20, height: 20 }}
          source={require("../Images/request-list.png")}
        />
      ),
      tabBarLabel: "Donate Books",
    },
  },
  RequestBooks: {
    screen: BookRequestScreen,
    navigationOptions: {
      tabBarIcon: (
        <Image
          style={{ width: 20, height: 20 }}
          source={require("../Images/request-book.png")}
        />
      ),
      tabBarLabel: "Request Books",
    },
  },
});
