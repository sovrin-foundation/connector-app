import React, { Component } from "react";
import { View, StyleSheet, AsyncStorage } from "react-native";
import { Avatar, Text, Icon, Button } from "react-native-elements";

import InvitationText from "./invite-text";
import InvitationActions from "./invitation-actions";

export default class InvitationScreen extends Component {
  constructor() {
    super();
    this.state = {
      currentRoute: "Connections"
    };
  }

  async saveKey(key, value) {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.log("Error saving newCurrentRoute" + error);
    }
  }

  async getRoute() {
    try {
      const currentRoute = await AsyncStorage.getItem("newCurrentRoute");
      this.setState({ currentRoute });
    } catch (error) {
      console.log("Error retrieving newCurrentRoute" + error);
    }
  }

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
          <InvitationActions {...this.props} />
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
