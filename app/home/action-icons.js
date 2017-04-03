/**
 * @flow
 */

import React, { Component } from "react";
import { View, StyleSheet, Image } from "react-native";
import { Avatar, Icon } from "react-native-elements";

const ActionsIcons = () => (
  <View style={icons.container}>
    <Icon
      containerStyle={[icons.icon]}
      name="history"
      color="#757575"
      size={40}
    />
    <Image
      style={[icons.icon, icons.avatar]}
      source={require("../invitation/invitee.jpg")}
    />
    <Icon
      containerStyle={[icons.icon]}
      name="add-circle"
      color="#757575"
      size={40}
    />
  </View>
);

const icons = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
  },
  icon: {
    flex: 1
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60
  }
});

export default ActionsIcons;
