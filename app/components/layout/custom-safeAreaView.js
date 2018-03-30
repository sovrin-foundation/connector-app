import React from 'react'
import { SafeAreaView, StyleSheet } from 'react-native'
import { CustomView } from './custom-view'
import style from './layout-style'

//Use this component to adjust the content within
//IphoneX spacing guidelines
export const CustomSafeAreaView = props => {
  const { primary, secondary, tertiary, quaternary, fifth } = props
  const passedStyle = props.style || {}
  const styles = StyleSheet.flatten([
    primary ? style.primaryBg : null,
    secondary ? style.secondaryBg : null,
    tertiary ? style.tertiaryBg : null,
    quaternary ? style.quaternaryBg : null,
    fifth ? style.fifthBg : null,
    ...passedStyle,
  ])
  return <SafeAreaView style={styles}>{props.children}</SafeAreaView>
}
