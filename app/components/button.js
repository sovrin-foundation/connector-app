import React from 'react'
import { StyleSheet } from 'react-native'
import { Button } from 'react-native-elements'
import { color, font } from '../common/styles/constant'
import empty from '../common/empty'

const getButtonProps = type => ({
  backgroundColor: color.actions[type],
  color: color.actions.font[type],
  textAlign: 'center',
})

const CustomButton = props => {
  const {
    primary,
    secondary,
    tertiary,
    quaternary,
    fifth,
    dangerous,
    medium,
    customColor,
    disabled,
  } = props
  const buttonStyles = props.style || empty
  const style = [
    styles.button,
    medium ? styles.mediumVerticalPadding : null,
    disabled ? styles.disabled : null,
    ...buttonStyles,
  ]

  const buttonType = primary
    ? 'primary'
    : secondary
      ? 'secondary'
      : tertiary
        ? 'tertiary'
        : quaternary ? 'quaternary' : dangerous ? 'dangerous' : 'fifth'
  const buttonProps = customColor ? customColor : getButtonProps(buttonType)
  return (
    <Button
      {...props}
      {...buttonProps}
      buttonStyle={style}
      textStyle={styles.text}
    />
  )
}

export default CustomButton

const styles = StyleSheet.create({
  button: {
    marginRight: 0,
    marginLeft: 0,
  },
  mediumVerticalPadding: {
    paddingVertical: 17,
  },
  disabled: {
    opacity: 0.2,
    backgroundColor: color.actions.none,
  },
  text: {
    fontWeight: '600',
    fontSize: font.size.M,
  },
})
