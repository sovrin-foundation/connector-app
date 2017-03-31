/**
 * @flow
 */

import React, { Component } from "react";
import { ScrollView, View, Text, StyleSheet, Animated } from "react-native";
import { DrawerNavigator } from "react-navigation";
import { Icon, Avatar } from "react-native-elements";
import { View as AnimatableView } from "react-native-animatable";

import Bubbles from "./bubbles";

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
      inputRange: [0, 500],
      outputRange: [0, -500],
      extrapolate: "clamp"
    });

    const texts = [];
    for (var index = 0; index < 200; index++) {
      texts.push(index);
    }

    return (
      <View style={{ flex: 1 }}>
        <Animated.ScrollView
          scrollEventThrottle={16}
          onScroll={Animated.event([
            { nativeEvent: { contentOffset: { y: this.state.scrollY } } }
          ],
          {useNativeDriver: true})}
          style={{ backgroundColor: "#e0e0e0"}}
        >
          <AnimatableView style={{marginTop: 500}}>
            {texts.map(text => <Text key={text}>{`Hello-${text}`}</Text>)}
          </AnimatableView>
        </Animated.ScrollView>
        <Bubbles height={bubblesHeight} />
      </View>
    );
  }
}

export default HomeScreenDrawer;
