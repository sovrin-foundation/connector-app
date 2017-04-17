/**
 * @flow
 */

import React from 'react';
import {View, StyleSheet} from 'react-native';

const Divider = ({ left, right, containerStyle }) => (
  <View style={[styles.container, styles.divider, containerStyle]}>
    <View style={[styles.container, styles.left]}>
      <View>
        {left && left}
      </View>
    </View>
    <View style={[styles.container, styles.right]}>
      <View>
        {right && right}
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  divider: {
    flexDirection: "row",
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#EBEBEA'
  },
  left: {
    alignItems: 'flex-start'
  },
  right: {
    alignItems: 'flex-end'
  }
});

export default Divider;
