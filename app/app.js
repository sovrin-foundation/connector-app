import React, { Component } from "react";
import { AppRegistry, Text, View } from "react-native";
import { StackNavigator } from "react-navigation";
import InvitationScreen from "./invitation/invitation";
import HomeScreen from "./home/home";
import CallCenterHome from "./callcenter/callcenter";

const ConnectMeApp = StackNavigator(
  {
    Home: {
      screen: HomeScreen
    },
    Connections: {
      screen: InvitationScreen
    },
    CallCenter: {
      screen: CallCenterHome
    }
  },
  {
    headerMode: "none"
  }
);

AppRegistry.registerComponent("ConnectMe", () => ConnectMeApp);
