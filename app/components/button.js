import React, { PureComponent } from 'react'
import { StyleSheet } from 'react-native'
import { Button } from 'react-native-elements'
import { color, font } from '../common/styles/constant'
import empty from '../common/empty'
import debounce from 'lodash.debounce'

const getButtonProps = type => ({
  backgroundColor: color.actions[type],
  color: color.actions.font[type],
  textAlign: 'center',
})

export default class CustomButton extends PureComponent {
  constructor(props) {
    super(props)
    this.deboucedButton = debounce(
      event => {
        if (this.props.onPress) {
          this.props.onPress(event)
        }
      },
      500,
      { leading: true, trailing: false }
    )
  }
  render() {
    const {
      primary,
      secondary,
      tertiary,
      quaternary,
      fifth,
      dangerous,
      medium,
      customColor = {},
      disabled,
    } = this.props
    const buttonStyles = this.props.style || empty
    const style = [
      medium ? styles.mediumVerticalPadding : null,
      ...buttonStyles,
    ]

    const buttonType = primary
      ? 'sixth'
      : secondary
        ? 'secondary'
        : tertiary
          ? 'tertiary'
          : quaternary ? 'quaternary' : dangerous ? 'dangerous' : 'fifth'
    const buttonProps = { ...getButtonProps(buttonType), ...customColor }
    // when button is disabled, we want to apply same color that is
    // generated while picking up the color from image
    const disabledStyles = [
      { backgroundColor: customColor.backgroundColor || color.actions.none },
      styles.disabled,
    ]

    return (
      <Button
        {...this.props}
        onPress={this.deboucedButton}
        {...buttonProps}
        buttonStyle={style}
        containerViewStyle={styles.buttonContainer}
        disabledStyle={disabledStyles}
      />
    )
  }
}

const styles = StyleSheet.create({
  buttonContainer: {
    marginRight: 0,
    marginLeft: 0,
  },
  mediumVerticalPadding: {
    paddingVertical: 17,
  },
  disabled: {
    opacity: 0.4,
  },
  text: {
    fontWeight: '600',
    fontSize: font.size.M,
  },
})
