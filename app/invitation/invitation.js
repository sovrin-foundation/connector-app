import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import { Avatar, Text, Icon, Button } from "react-native-elements";
import OneSignal from "react-native-onesignal";

import InvitationText from "./invite-text";
import InvitationActions from "./invitation-actions";

export default class InvitationScreen extends Component {
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

  onOpened(openResult) {
    console.log("Message: ", openResult.notification.payload.body);
    console.log("Data: ", openResult.notification.payload.additionalData);
    console.log("isActive: ", openResult.notification.isAppInFocus);
    console.log("openResult: ", openResult);
  }

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
