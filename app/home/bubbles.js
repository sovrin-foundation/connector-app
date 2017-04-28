/**
 * @flow
 */

import React, { Component } from "react";
import {
  View,
  Animated,
  Image,
  InteractionManager,
  Platform,
  Dimensions
} from "react-native";
import { View as AnimatableView } from "react-native-animatable";
import { Avatar } from "react-native-elements";
import styles from "./bubbles.styles";

const size = {
  XS: 40,
  S: 60,
  M: 80,
  L: 100,
  XL: 120,
  XXL: 140
};

const bubbles = [
  { name: "bh", image: require("../images/cbEDCU@3x.png"), size: size.L },
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
  {
    name: "suncoast",
    image: require("../images/cbSuncoast.png"),
    size: size.XL
  },
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
    const { width } = Dimensions.get("window");
    let deviceClass = "";

    if (Platform.OS === "ios") {
      deviceClass = width === 320
        ? "Iphone5"
        : width === 414 ? "IphonePlus" : "ios";
    }

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
            style={[
              styles.avatar,
              styles[name],
              styles[`${name}${deviceClass}`]
            ]}
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
