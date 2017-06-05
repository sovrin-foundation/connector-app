import React from 'react'
import { StyleSheet, StatusBar, Platform, View } from 'react-native'

export const AppStatusBar = _ => (
  <View style={styles.statusBar}>
    <StatusBar barStyle="light-content" />
  </View>
)

const height = Platform.OS === 'ios' ? 20 : 0

const styles = StyleSheet.create({
  statusBar: {
    height,
  },
})

export default AppStatusBar
