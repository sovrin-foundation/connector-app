import React, { PureComponent } from "react";
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
      style={[icons.icon, icons.avatar, icons.circle]}
      source={require("../invitation/inviter.jpeg")}
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
    paddingBottom: 20
  },
  icon: {
    flex: 1
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60
  },
  circle: {
    width: 100,
    height: 100,
    borderRadius: 100/2
  }
});

export default ActionsIcons;
