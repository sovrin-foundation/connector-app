// @flow
import React from 'react'
import { SafeAreaView, StyleSheet } from 'react-native'
import style from './layout-style'
import type { GenericObject } from '../../common/type-common'

// TODO:KS Change prop type from GenericObject to actual props
//Use this component to adjust the content within
//IphoneX spacing guidelines
export const CustomSafeAreaView = (props: GenericObject) => {
  const { primary, secondary, tertiary, quaternary, fifth } = props
  const passedStyle = props.style || []
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
