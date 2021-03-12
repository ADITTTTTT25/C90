import React from 'react';
import { createDrawerNavigator } from "react-navigation-drawer";
import CustomSidebarMenu from "./CustomSidebarMenu";
import { AppTabNavigator } from "./AppTabNavigator";
import SettingScreen from "../screens/SettingScreen";
import MyDonationScreen from "../screens/MyDonationScreen";
import {RFValue} from 'react-native-responsive-fontsize';
import NotificationScreen from "../screens/NotificationScreen";
import MyReceivedBooksScreen from '../screens/MyReceivedBooksScreen'
import { Icon } from "react-native-elements";
import {Image} from 'react-native';
export const AppDrawerNavigator = createDrawerNavigator(
  {
    Home: {
      screen: AppTabNavigator,
      navigationOptions: {
        drawerIcon: <Icon name="home" type="fontawesome5" />,
      },
    },
    MyDonation: {
      screen: MyDonationScreen,
      navigationOptions: {
        drawerIcon: <Icon name="gift" type="font-awesome" />,
        drawerLabel:"My Donations"
      },
    },
    NotificationScreen: {
      screen: NotificationScreen,
      navigationOptions: {
        drawerIcon: <Icon name="bell" type="font-awesome" />,
        drawerLabel:"Notifications"
      },
    },
    MyReceivedBooks: {
      screen: MyReceivedBooksScreen,
      navigationOptions: {
        drawerIcon: <Icon name="gift" type="font-awesome" />,
        drawerLabel: "My Received Books",
      },
    },
    Settings: {
      screen: SettingScreen,
      navigationOptions: {
        drawerIcon: <Icon name="settings" type="fontawesome5" />,
        drawerLabel:"Settings"
      },
    },
  },
  { contentComponent: CustomSidebarMenu },
  { initialRouteName: "Home" }
);
