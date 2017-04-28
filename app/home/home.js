/**
 * @flow
 */

import React, { Component } from "react";
import { ScrollView, View, Text, StyleSheet, Animated } from "react-native";
import { DrawerNavigator } from "react-navigation";
import { Icon, Avatar } from "react-native-elements";
import { View as AnimatableView } from "react-native-animatable";
import OneSignal from "react-native-onesignal";

import Bubbles from "./bubbles";
import HomeScreenActions from "./actions";

class HomeScreenDrawer extends Component {
  static navigationOptions = {
    title: "Home"
  };

  constructor(props) {
    super(props);

    this.state = {
      currentRoute: "Home",
      scrollY: new Animated.Value(0)
    };
  }

  componentWillMount() {
    OneSignal.addEventListener("opened", this.onOpened);
  }

  componentWillUnmount() {
    OneSignal.removeEventListener("opened", this.onOpened);
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

      if (this.state.currentRoute !== "Connections") {
        this.saveKey("newCurrentRoute", "Connections");
        this.props.navigation.navigate("Connections");
      }
    });
  };

  render() {
    const bubblesHeight = this.state.scrollY.interpolate({
      inputRange: [0, 5],
      outputRange: [0, -5],
      extrapolate: "clamp"
    });

    return (
      <View style={{ flex: 1 }}>
        <Animated.ScrollView
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }],
            { useNativeDriver: true }
          )}
          style={{ backgroundColor: "#3F4140" }}
        >
          <Bubbles height={bubblesHeight} />
          <AnimatableView style={{ marginTop: 420 }}>
            <HomeScreenActions />
          </AnimatableView>
        </Animated.ScrollView>

      </View>
    );
  }
}

export default HomeScreenDrawer;
