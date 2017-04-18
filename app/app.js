import React, { Component } from "react";
import { AppRegistry, Text, View } from "react-native";
import { StackNavigator } from "react-navigation";
import InvitationScreen from "./invitation/invitation";
import HomeScreen from "./home/home";

const ConnectMeApp = StackNavigator({
  Home: {
    screen: InvitationScreen
  },
  Connections: {
    screen: HomeScreen
  }
});

AppRegistry.registerComponent("ConnectMe", () => ConnectMeApp);

