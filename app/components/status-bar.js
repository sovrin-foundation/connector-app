import React from 'react'
import { StyleSheet, StatusBar, Platform, View } from 'react-native'

export const AppStatusBar = props => (
  <View style={styles.statusBar}>
    <StatusBar {...props} />
  </View>
)

const styles = StyleSheet.create({
  statusBar: {
    height: 0,
  },
})

export default AppStatusBar
