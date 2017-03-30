/**
 * @flow
 */

import React, { Component } from "react";
import { AppRegistry, Text, View } from "react-native";
import { StackNavigator } from "react-navigation";
import InvitationScreen from "./invitation/invitation";

const ConnectMeApp = StackNavigator({
  Home: {
    screen: InvitationScreen
  }
});

AppRegistry.registerComponent("ConnectMe", () => ConnectMeApp);
