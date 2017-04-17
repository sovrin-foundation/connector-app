/**
 * badge
 */

import React, { PropTypes } from 'react';
import {View, Image, Text, StyleSheet} from 'react-native';

export default Badge = ({counter, name, badgeStyle}) => (
  <View style={[styles.badgeContainer, badgeStyle]}>
    <Image 
      style={styles.badge}
      resizeMode="contain"
      source={require("../images/ribbon.png")} />
    <Text 
      style={[styles.label, styles[name]]}>
      {counter}
    </Text>
  </View>
);

Badge.propTypes = {
  counter: PropTypes.number,
  name: PropTypes.string
};

Badge.defaultProps = {
  name: "grey"
};

const styles = StyleSheet.create({
  badge: {
    width: 20,
    height: 20 
  },
  label: {
    fontWeight: "bold",
    fontSize: 13,
    textAlign: "center"
  },
  white: {
    color: "#FFFFFF"
  },
  grey: {
    color: "#757575"
  }
});
