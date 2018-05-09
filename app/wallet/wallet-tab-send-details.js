// @flow

// this file would satisfy 1322
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

import React, { Component } from 'react'
import { StyleSheet, Keyboard } from 'react-native'
import { connect } from 'react-redux'
import { StackNavigator } from 'react-navigation'
import { Container, CustomText, CustomView } from '../components'
import { primaryHeaderStyles } from '../components/layout/header-styles'
import Icon from '../components/icon'
import {
  OFFSET_1X,
  OFFSET_2X,
  OFFSET_6X,
  OFFSET_7X,
  color,
} from '../common/styles/constant'
import ControlInput from '../components/input-control/input-control'
import { Text } from 'react-native-elements'
import type {
  WalletSendPaymentData,
  WalletTabSendDetailsProps,
  WalletTabSendDetailsState,
} from './type-wallet'
import { formatNumbers } from '../components/text'
import { walletRoute } from '../common'

// TODO: Add type for the props and state
export class WalletTabSendDetails extends Component<
  WalletTabSendDetailsProps,
  WalletTabSendDetailsState
> {
  static navigationOptions = ({ navigation }) => ({
    headerLeft: (
      <CustomView horizontalSpace>
        <Icon
          testID={'back-arrow'}
          iconStyle={[styles.headerLeft]}
          src={require('../images/icon_backArrow.png')}
          resizeMode="contain"
          onPress={() => navigation.goBack(null)}
        />
      </CustomView>
    ),
    headerTitle: (
      <CustomText
        style={[
          {
            color: color.bg.seventh.font.sixth,
          },
        ]}
        proText
        transparentBg
        h5
        center
        fullWidth
      >
        Pay Tokens
      </CustomText>
    ),
    headerRight: (
      <CustomView horizontalSpace>
        <CustomText uppercase proText bold quinaryText transparentBg h5>
          Send
        </CustomText>
      </CustomView>
    ),
    headerStyle: primaryHeaderStyles.header,
  })

  state = {
    showPaymentAddress: false,
    isPaymentAddressValid: false,
  }

  paymentData: WalletSendPaymentData = {
    paymentTo: '',
    paymentFor: '',
  }

  onTextChange = (text: string, name: string) => {
    this.paymentData[name] = text
    if (this.paymentData['paymentTo'].length) {
      this.setState({
        showPaymentAddress: true,
      })
    } else {
      this.setState({
        showPaymentAddress: false,
      })
    }
  }
  throttledAsyncValidationFunction = () => {
    // the validationFunction will be running here

    // the isPaymentAddressValid state need to be changed to true if the payment address validation is success and vice-versa
    this.setState({
      isPaymentAddressValid: true,
    })
  }
  render() {
    return (
      <Container safeArea fifth onPress={Keyboard.dismiss}>
        <ControlInput
          label="To"
          name="paymentTo"
          placeholder="Enter Payee wallet address"
          validation={this.throttledAsyncValidationFunction}
          onChangeText={this.onTextChange}
          isValid={this.state.isPaymentAddressValid}
        />
        <ControlInput
          label="For"
          name="paymentFor"
          multiline
          placeholder="credential, gift, etc."
          onChangeText={this.onTextChange}
        />
        <CustomView row center style={[{ width: '100%' }]} horizontalSpace>
          <CustomText
            quinaryText
            formatNumber
            proText
            transparentBg
            center
            style={[styles.tokenAmountText]}
            fullWidth
          >
            {this.props.tokenAmount}
          </CustomText>
        </CustomView>
        <CustomView center>
          <CustomText proText transparentBg style={[styles.textSovrinTokens]}>
            SOVRIN TOKENS
          </CustomText>
        </CustomView>
        <CustomView center style={[{ marginTop: 36 }]}>
          <CustomView center style={[{ width: '65%' }]}>
            <Text style={[styles.walletContextText]}>
              You are sending{' '}
              <Text style={{ color: color.bg.eighth.color }}>
                {formatNumbers(this.props.tokenAmount)}
              </Text>{' '}
              tokens to this wallet address:
            </Text>
          </CustomView>
        </CustomView>
        {this.state.showPaymentAddress ? (
          <CustomView center>
            <CustomText
              center
              transparentBg
              primary
              style={[
                { marginTop: 10 },
                this.state.isPaymentAddressValid
                  ? styles.validTextColor
                  : styles.invalidTextColor,
              ]}
            >
              {this.paymentData['paymentTo']}
            </CustomText>
          </CustomView>
        ) : (
          <CustomView center>
            <CustomText
              center
              transparentBg
              quinaryText
              proText
              style={[styles.walletAddressText]}
            >
              Enter wallet address above
            </CustomText>
          </CustomView>
        )}
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  headerLeft: {
    width: OFFSET_2X,
  },
  title: {
    marginTop: OFFSET_6X,
    marginBottom: OFFSET_7X,
  },
  titleText: {
    lineHeight: 28,
    letterSpacing: 0.5,
    paddingHorizontal: OFFSET_1X,
  },
  invalidTextColor: {
    color: color.bg.tenth.font.color,
  },
  validTextColor: {
    color: color.bg.eighth.color,
  },
  walletAddressText: {
    fontSize: 14,
    flexWrap: 'wrap',
    lineHeight: 16,
    marginTop: 11,
    marginBottom: 15,
  },
  walletContextText: {
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 18,
    color: color.bg.seventh.font.sixth,
    letterSpacing: -0.35,
  },
  textSovrinTokens: {
    fontSize: 18,
    color: color.bg.seventh.font.seventh,
  },
  tokenAmountText: {
    fontSize: 75,
    letterSpacing: -1.87,
    marginTop: 19,
    lineHeight: 89,
  },
})

const mapStateToProps = (state: WalletTabSendDetailsProps) => {
  return {
    tokenAmount: '5656',
  }
}

export default StackNavigator({
  WalletTabSendDetails: {
    screen: connect(mapStateToProps, null)(WalletTabSendDetails),
  },
})
