// @flow
import React, { PureComponent } from 'react'
import { TextInput, StyleSheet, Platform, Keyboard } from 'react-native'
import { PIN_SETUP_STATE } from '../../lock/type-lock'
import PinCodeDigit from './pin-code-digit'
import { CustomView } from '../../components'
import type {
  PinCodeBoxProps,
  PinCodeBoxState,
  TextInputRef,
} from './type-pin-code-box'

const keyboard = Platform.OS === 'ios' ? 'number-pad' : 'numeric'

const isDigit = text => {
  if (isNaN(parseInt(text))) {
    return false
  }

  return true
}

export default class PinCodeBox extends PureComponent<
  PinCodeBoxProps,
  PinCodeBoxState
> {
  state = {
    pin: '',
  }

  keyboardDidHideListener = null

  inputBox: ?TextInputRef = null

  maxLength = 6

  componentDidMount = () => {
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this.hideKeyboard
    )
  }

  componentWillUnMount = () => {
    this.keyboardDidHideListener && this.keyboardDidHideListener.remove()
  }

  onPinChange = (pin: string) => {
    if (pin === '' || isDigit(pin.substr(pin.length - 1))) {
      this.setState({ pin }, this.onPinSet)
    }
  }

  clear = () => {
    // parent can call this to clear entered input
    // either in case pin was wrong, or we want them to enter it again
    this.inputBox && this.inputBox.clear()
    this.setState({ pin: '' })
  }

  hideKeyboard = () => {
    this.inputBox && this.inputBox.blur()
  }

  showKeyboard = () => {
    this.inputBox && this.inputBox.focus()
  }

  onPinSet = () => {
    // need to call this method after user value is set in state
    // here we can check if we got 6 digits, if yes, that means
    // we can say pin input is complete and let parent component
    // handle what to do after pin input is complete
    // while setting pin, parent can clear it and ask for pin again
    // while entering pin to unlock, parent can match pin in keychain
    if (this.state.pin.length === 6) {
      this.props.onPinComplete(this.state.pin)
    }
  }

  render() {
    // We always want to render 6 <PinCodeDigit />
    // however, they will contain a sovrin icon, only if that digit is entered
    // in text input, if user entered only 2 digits, then logic for `isEntered`
    // will return true for first 2 and false for rest of them
    // this will give an impression that we are showing all underlines and
    // filling only the ones which are typed
    let pinCodeDigits = []
    let isEntered = false
    for (let i = 0; i < this.maxLength; i++) {
      isEntered = this.state.pin[i] !== undefined
      pinCodeDigits.push(
        <PinCodeDigit
          onPress={this.showKeyboard}
          key={i}
          entered={isEntered}
          testID={`pin-code-digit-${i}`}
        />
      )
    }

    return (
      <CustomView>
        <CustomView onPress={this.showKeyboard} row>
          {pinCodeDigits}
        </CustomView>
        <TextInput
          autoCorrect={false}
          autoFocus={true}
          blurOnSubmit={false}
          enablesReturnKeyAutomatically={false}
          keyboardType={keyboard}
          keyboardAppearance="dark"
          maxLength={this.maxLength}
          onChangeText={this.onPinChange}
          ref={inputBox => {
            this.inputBox = inputBox
          }}
          style={styles.input}
          testID="pin-code-input-box"
          accessible={true}
          accessibilityLabel={`pin-code-input-box`}
          value={this.state.pin}
        />
      </CustomView>
    )
  }
}

const styles = StyleSheet.create({
  input: {
    position: 'absolute',
    right: -999,
    height: 0,
    width: 0,
  },
})
