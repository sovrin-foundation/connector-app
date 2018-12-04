// @flow
import React from 'react'
import { Image, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native'
import { CustomView } from './layout/custom-view'
import { color, font } from '../common/styles/constant'
import empty from '../common/empty'

// We need both type of ribbon and it is better to load them once
const whiteRibbon = require('../images/ribbon_white.png')
const grayRibbon = require('../images/ribbon.png')

// TODO:KS Add props, this component is not being used right now
// so it is not that important to add types here
export const BadgeLabel = (props: *) => {
  const textColor = props.secondary ? styles.secondary : styles.primary
  const center = props.center ? styles.center : null

  return (
    <Text {...props} style={[styles.label, textColor, center, props.style]}>
      {props.text}
    </Text>
  )
}

const Badge = ({ count, secondary, badgeStyle, shadow, onPress }: *) => {
  const badgeColor = secondary
    ? color.bg.primary.font.primary
    : color.bg.secondary.font.primary
  const ribbon = secondary ? whiteRibbon : grayRibbon
  const style = shadow ? styles.shadow : null

  return (
    <CustomView clearBg style={[badgeStyle, style]}>
      <TouchableWithoutFeedback onPress={onPress}>
        <Image
          resizeMode="contain"
          source={ribbon}
          style={styles.image}
          onPress={onPress}
        />
      </TouchableWithoutFeedback>
      <BadgeLabel center secondary={secondary} text={count} style={empty} />
    </CustomView>
  )
}

const styles = StyleSheet.create({
  image: {
    width: 22,
    height: 26,
  },
  shadow: {
    shadowColor: color.bg.primary.color,
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowRadius: 4,
    shadowOpacity: 0.9,
  },
  label: {
    fontSize: font.size.XS,
    fontWeight: 'bold',
  },
  primary: {
    color: color.bg.secondary.font.tertiary,
  },
  secondary: {
    color: color.bg.primary.font.primary,
  },
  center: {
    textAlign: 'center',
    textAlignVertical: 'center',
  },
})

export default Badge
