/**
 * @flow
 */

import React, { Component } from "react";
import {
  View,
  Animated,
  StyleSheet,
  Image,
  InteractionManager,
  Text
} from "react-native";
import { View as AnimatableView } from "react-native-animatable";
import { Avatar } from "react-native-elements";

const size = {
  XS: 40,
  S: 60,
  M: 80,
  L: 100,
  XL: 120,
  XXL: 140
};

const bubbles = [
  { name: "bh", image: require("../images/cbBiggerHips@3x.png"), size: size.L },
  { name: "dell", image: require("../images/cbDell@1x.png"), size: size.S },
  { name: "ebay", image: require("../images/cbEbay@1x.png"), size: size.M },
  { name: "target", image: require("../images/cbTarget.png"), size: size.M },
  {
    name: "centuryLink",
    image: require("../images/cbCenturyLink.png"),
    size: size.S
  },
  {
    name: "starbucks",
    image: require("../images/cbStarbucks.png"),
    size: size.XL
  },
  { name: "edcu", image: require("../images/cbEDCU.png"), size: size.XXL },
  { name: "amazon", image: require("../images/Amazon.png"), size: size.XL },
  { name: "dillard", image: require("../images/cbDillards.png"), size: size.M },
  { name: "verizon", image: require("../images/Verizon.png"), size: size.M }
];

export default class ConnectionBubbles extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showBubble: false
    };
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({ showBubble: true });
    });
  }

  render() {
    return (
      <Animated.View
        style={[
          styles.bubbleContainer,
          { transform: [{ translateY: this.props.height }] }
        ]}
      >
        {bubbles.map(({ name, image, size }) => (
          <AnimatableView
            animation="zoomIn"
            duration={600}
            delay={200}
            style={[styles.avatar, styles[name]]}
            key={name}
          >
            <Image
              source={image}
              style={{ width: size, height: size }}
              resizeMode={Image.resizeMode.contain}
            />
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
    height: 420
  },
  avatar: {
    position: "absolute"
  },
  avatarImage: {
    resizeMode: "contain"
  },
  bh: {
    top: 80,
    left: -10
  },
  dell: {
    top: 60,
    left: 130
  },
  ebay: {
    top: 80,
    left: 210
  },
  target: {
    top: 120,
    left: 290
  },
  centuryLink: {
    top: 210,
    left: 20
  },
  starbucks: {
    top: 150,
    left: 120
  },
  edcu: {
    top: 210,
    left: 230
  },
  amazon: {
    top: 280,
    left: 10
  },
  dillard: {
    top: 270,
    left: 140
  },
  verizon: {
    top: 340,
    left: 210
  }
});
