import React from 'react'
import { StyleSheet, StatusBar, Platform, View } from 'react-native'

export const AppStatusBar = _ => (
  <View style={styles.statusBar}>
    <StatusBar barStyle="light-content" />
  </View>
)

const styles = StyleSheet.create({
  statusBar: {
    height: 0,
  },
})

export default AppStatusBar
