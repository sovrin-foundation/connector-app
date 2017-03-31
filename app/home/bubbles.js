/**
 * @flow
 */

import React, { Component } from "react";
import { View, Animated, StyleSheet } from "react-native";
import { View as AnimatableView } from "react-native-animatable";
import { Avatar } from "react-native-elements";

const bubbles = [
  { name: "bk", image: require("../img/logo-bk.png") },
  { name: "ebay", image: require("../img/logo-ebay.png") },
  { name: "paypal", image: require("../img/logo-paypal.png") },
  { name: "starbucks", image: require("../img/logo-starbucks.png") },
  { name: "verizon", image: require("../img/logo-verizon.png") }
];

export default class ConnectionBubbles extends Component {
  render() {
    return (
      <Animated.View
        style={[
          styles.bubbleContainer,
          { transform: [{ translateY: this.props.height } ]}
        ]}
      >
        {bubbles.map(({ name, image }) => (
          <AnimatableView
            animation="bounceIn"
            duration={2000}
            style={[styles.avatar, styles[name]]}
            key={name}
          >
            <Avatar large rounded source={image} />
          </AnimatableView>
        ))}
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  bubbleContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    overflow: "hidden",
    height: 500
  },
  avatar: {
    position: "absolute"
  },
  bk: {
    top: 0,
    left: 0
  },
  ebay: {
    top: 80,
    left: 100
  },
  paypal: {
    top: 200,
    left: 300
  },
  starbucks: {
    top: 400,
    left: 200
  },
  verizon: {
    top: 200,
    left: 100
  }
});
