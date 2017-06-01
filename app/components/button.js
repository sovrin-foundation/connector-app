import React from 'react'
import { StyleSheet } from 'react-native'
import { Button } from 'react-native-elements'
import { color } from '../common/styles/constant'
import empty from '../common/empty'

const type = {
  primary: {
    backgroundColor: color.actions.primary,
  },
  secondary: {
    backgroundColor: color.actions.secondary,
  },
  tertiary: {
    backgroundColor: color.actions.tertiary,
  },
  dangerous: {
    backgroundColor: color.actions.dangerous,
  },
}

const CustomButton = props => {
  const { primary, secondary, tertiary, dangerous } = props
  const buttonStyles = props.style || empty
  const style = [styles.button, ...buttonStyles]

  const buttonType = primary
    ? 'primary'
    : secondary ? 'secondary' : tertiary ? 'tertiary' : 'dangerous'
  const buttonProps = type[buttonType]

  return <Button {...props} {...buttonProps} buttonStyle={style} />
}

export default CustomButton

const styles = StyleSheet.create({
  button: {
    marginRight: 0,
    marginLeft: 0,
  },
})
