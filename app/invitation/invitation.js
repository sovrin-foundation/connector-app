import React, { Component } from "react";
import { View, StyleSheet, AsyncStorage } from "react-native";
import { Avatar, Text, Icon, Button } from "react-native-elements";
import OneSignal from "react-native-onesignal";

import InvitationText from "./invite-text";
import InvitationActions from "./invitation-actions";

export default class InvitationScreen extends Component {
  constructor() {
    super();
    this.state = {
      currentRoute: "Home"
    };
  }

  componentWillMount() {
    OneSignal.addEventListener("received", this.onReceived);
    OneSignal.addEventListener("opened", this.onOpened);
    OneSignal.addEventListener("registered", this.onRegistered);
    OneSignal.addEventListener("ids", this.onIds);
  }

  componentWillUnmount() {
    OneSignal.removeEventListener("received", this.onReceived);
    OneSignal.removeEventListener("opened", this.onOpened);
    OneSignal.removeEventListener("registered", this.onRegistered);
    OneSignal.removeEventListener("ids", this.onIds);
  }

  onReceived(notification) {
    console.log("Notification received: ", notification);
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

  onOpened = openResult => {
    this.getRoute().then(() => {
      this.saveKey(
        "PN_username",
        openResult.notification.payload.additionalData.userName
      );

      if (this.state.currentRoute !== "Home") {
        this.saveKey("newCurrentRoute", "Home");
        this.props.navigation.navigate("Home");
      }
    });
  };

  onRegistered(notifData) {
    console.log(
      "Device had been registered for push notifications!",
      notifData
    );
  }

  onIds(device) {
    console.log("Device info: ", device);
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
