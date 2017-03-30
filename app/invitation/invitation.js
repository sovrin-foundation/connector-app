import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import { Avatar, Text, Icon, Button } from "react-native-elements";
import InvitationText from "./invite-text";
import InvitationActions from "./invitation-actions";

export default class InvitationScreen extends Component {
  static navigationOptions = {
    title: "Accept invitation"
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.inviteContainer}>
          <InvitationText />
        </View>
        <View>
          <InvitationActions />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between"
  },
  inviteContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});
