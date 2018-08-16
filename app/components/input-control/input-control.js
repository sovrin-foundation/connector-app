// @flow

// the component in which user can enter payment address, validation on address, error and how the text input would expand on the basis of how much text user has typed
// and other things would be combined into a component which could be used as
// <ControlInput validation={this.throttledAsyncValidationFunction} name="payment address" label="To" />
// <ControlInput label="For" />
// if validation prop is not specified then validation will not be applied
// if validation prop is specified, then we would throttle the function calls and assumes that validation function is async
// we should also be canceling the previous validation function calls, because ordering in async results are not guaranteed
// we could use saga to throttle and cancel previous calls if a new call is made during the progress of previous call
// we could use throttle and takeLatest combined to make this happen
// This input control does not need to over designed whatever can satisfy our requirements for now
// when and if we would new features, we would add those later

import React, { PureComponent } from 'react'
import { View, ListView, StyleSheet } from 'react-native'
import { CustomView } from '../layout/custom-view'
import { CustomList } from '../custom-list/custom-list'
import { TextInput } from 'react-native'
import { CustomText, Container, Icon } from '../index'
import throttle from 'lodash.throttle'
import { color } from '../../common/styles/constant'
import type { InputControlProps } from './type-input-control'

export default class ControlInput extends PureComponent<
  InputControlProps,
  void
> {
  throttledValidate = throttle(
    () => {
      if (this.props.validation) {
        this.props.validation()
      }
    },
    300,
    { leading: true }
  )

  onTextChange = (event: string) => {
    this.props.onChangeText(event, this.props.name)
    if (this.props.validation) {
      this.throttledValidate()
    }
  }

  render() {
    // Here we should call out any special props we need, otherwise any native props that <TextInput /> uses will be assigned to textInputProps
    const {
      label,
      multiline,
      isValid,
      onChangeText,
      validation,
      name,
      ...textInputProps
    } = this.props
    return (
      <CustomView
        style={[styles.container]}
        testID={`${label}-mainview-wallet-send-details`}
      >
        <CustomView
          fifth
          center
          row
          horizontalSpace
          testID={`${label}-subview-wallet-send-details`}
        >
          <CustomView fifth right style={[{ width: 35, paddingVertical: 25 }]}>
            <CustomText
              h5
              semiBold
              bg="tertiary"
              transparentBg
              quinaryText
              style={[{ lineHeight: 20 }]}
            >
              {`${label}:`}
            </CustomText>
          </CustomView>
          <CustomView
            fifth
            left
            horizontalSpace
            style={[
              {
                width: '83%',
              },
            ]}
            testID={`${label}-textinput-wallet-send-details`}
          >
            <TextInput
              testID={`${label}-token-send-details-label`}
              accessible={true}
              accessibilityLabel={`${label}-token-send-details-label`}
              style={[styles.textInput]}
              underlineColorAndroid="transparent"
              multiline={multiline ? true : false}
              onChangeText={this.onTextChange}
              {...textInputProps}
            />
          </CustomView>
          {this.props.validation && isValid === 'SUCCESS' ? (
            <SuccessIcon />
          ) : isValid === 'ERROR' ? (
            <ErrorIcon />
          ) : (
            <CustomView />
          )}
        </CustomView>
        {/* for validation */}
        {this.props.validation && isValid === 'ERROR' ? (
          <ErrorCustomInput>Invalid Payment Address</ErrorCustomInput>
        ) : null}
      </CustomView>
    )
  }
}

const ErrorCustomInput = props => {
  return (
    <CustomView column style={[{ paddingVertical: 5 }, styles.invalidBgColor]}>
      <CustomText
        center
        transparentBg
        primary
        style={[styles.errorCustomText, styles.invalidTextColor]}
      >
        {props.children}
      </CustomText>
    </CustomView>
  )
}

const SuccessIcon = () => {
  return (
    <CustomView>
      <Icon small src={require('../../images/Success.png')} />
    </CustomView>
  )
}

const ErrorIcon = () => {
  return (
    <CustomView style={[styles.errorIconView]} hCenter>
      <CustomText
        style={[
          {
            color: color.bg.tenth.font.color,
            fontSize: 13,
          },
        ]}
        center
        transparentBg
      >
        !
      </CustomText>
    </CustomView>
  )
}

const styles = StyleSheet.create({
  container: { borderBottomWidth: 1, borderBottomColor: color.border.primary },
  invalidBgColor: {
    backgroundColor: color.bg.tenth.color,
  },
  invalidTextColor: {
    color: color.bg.tenth.font.color,
  },
  errorIconView: {
    borderWidth: 2,
    borderColor: color.bg.tenth.font.color,
    borderRadius: 100,
    padding: 1,
    width: 22,
    height: 22,
  },
  errorCustomText: {
    fontSize: 14,
    lineHeight: 16,
    letterSpacing: -0.35,
  },
  textInput: {
    width: '100%',
    fontStyle: 'italic',
    fontSize: 17,
    lineHeight: 20,
  },
})
