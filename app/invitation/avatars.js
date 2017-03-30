import React from "react";
import { View, StyleSheet } from "react-native";
import { Avatar, Icon } from "react-native-elements";

const avatars = () => (
  <View style={styles.avatars}>
    <Avatar
      containerStyle={styles.avatar}
      large
      rounded
      source={require("./invitee.jpg")}
    />
    <Icon name="arrow-forward" containerStyle={{
      marginTop: 30
    }} />
    <Avatar
      containerStyle={styles.avatar}
      large
      rounded
      source={require("./inviter.jpg")}
    />
  </View>
);

const styles = StyleSheet.create({
  avatars: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-around",
    alignItems: "flex-start"
  },
  avatar: {
    width: 75,
    height: 75
  },
  arrow: {
    justifyContent: "center",
    alignItems: "center"
  }
});

export default avatars;
