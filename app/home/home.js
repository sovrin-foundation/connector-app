/**
 * @flow
 */

import React, { Component } from "react";
import { ScrollView, View, Text, StyleSheet, Animated } from "react-native";
import { DrawerNavigator } from "react-navigation";
import { Icon, Avatar } from "react-native-elements";
import { View as AnimatableView } from "react-native-animatable";

import Bubbles from "./bubbles";
import HomeScreenActions from "./actions";

class HomeScreenDrawer extends Component {
  static navigationOptions = {
    title: "Home"
  };

  constructor(props) {
    super(props);

    this.state = {
      scrollY: new Animated.Value(0)
    };
  }

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
