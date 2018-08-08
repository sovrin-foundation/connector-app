// @flow

import React, { Component } from 'react'
import { StyleSheet, Keyboard, Platform } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { StackNavigator, NavigationActions } from 'react-navigation'
import { Container, CustomText, CustomView, CustomButton } from '../components'
import { primaryHeaderStyles } from '../components/layout/header-styles'
import CustomActivityIndicator from '../components/custom-activity-indicator/custom-activity-indicator'
import Icon from '../components/icon'
import {
  OFFSET_1X,
  OFFSET_2X,
  OFFSET_3X,
  OFFSET_6X,
  OFFSET_7X,
  color,
  HAIRLINE_WIDTH,
} from '../common/styles/constant'
import ControlInput from '../components/input-control/input-control'
import { Text } from 'react-native-elements'
import type {
  WalletSendPaymentData,
  WalletTabSendDetailsProps,
  WalletTabSendDetailsState,
} from './type-wallet'
import { formatNumbers } from '../components/text'
import { receiveTabRoute } from '../common'
import { walletAddresses } from '../../__mocks__/static-data'
import {
  SEND_TOKENS_TO_PAYMENT_ADDRESS,
  FOR_SEND_DETAILS_TEST_ID,
  TO_SEND_DETAILS_TEST_ID,
} from './wallet-constants'
import { sendTokens } from '../wallet/wallet-store'
import { getWalletAddresses, getTokenAmount } from '../store/store-selector'
import type { Store } from '../store/type-store'
import { STORE_STATUS } from './type-wallet'
import Modal from 'react-native-modal'

export class WalletTabSendDetails extends Component<
  WalletTabSendDetailsProps,
  WalletTabSendDetailsState
> {
  static navigationOptions = ({ navigation, screenProps }) => ({
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
        <CustomText
          uppercase
          bold
          quinaryText
          transparentBg
          h5
          style={[navigation.state.params.isValid ? {} : styles.disabledText]}
          testID={SEND_TOKENS_TO_PAYMENT_ADDRESS}
          onPress={() => {
            if (navigation.state.params.isValid) {
              const amount: string = navigation.state.params.tokenAmount
              navigation.state.params.sendTokens(
                amount,
                navigation.state.params.senderWalletAddress,
                navigation.state.params.receipientWalletAddress
              )
            }
          }}
        >
          Send
        </CustomText>
      </CustomView>
    ),
    headerStyle: primaryHeaderStyles.header,
  })

  state = {
    showPaymentAddress: false,
    isPaymentAddressValid: 'IDLE',
    tokenSentFailedVisible: false,
  }

  paymentData: WalletSendPaymentData = {
    paymentTo: '',
    paymentFor: '',
  }

  componentDidUpdate(prevProps: WalletTabSendDetailsProps) {
    if (this.props.tokenSentStatus !== prevProps.tokenSentStatus) {
      if (this.props.tokenSentStatus === STORE_STATUS.SUCCESS) {
        this.props.navigation.goBack(null)
        this.props.navigation.state &&
          this.props.navigation.state.params.navigate(receiveTabRoute)
      } else if (this.props.tokenSentStatus === STORE_STATUS.ERROR) {
        this.setState({ tokenSentFailedVisible: true })
      }
    }
  }

  componentDidMount() {
    this.props.navigation.setParams({
      ...this.props,
    })
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

  onTokenSentFailedClose = () => {
    this.setState({ tokenSentFailedVisible: false })
  }

  throttledAsyncValidationFunction = () => {
    // the validationFunction will be running here

    // the isPaymentAddressValid state need to be changed to true if the payment address validation is success and vice-versa
    let status = ''
    if (this.paymentData['paymentTo'].length > 20) {
      status = 'SUCCESS'
      this.props.navigation.setParams({ isValid: true })
    } else if (this.paymentData['paymentTo'].length <= 0) {
      status = 'IDLE'
      this.props.navigation.setParams({ isValid: false })
    } else {
      status = 'ERROR'
      this.props.navigation.setParams({ isValid: false })
    }
    this.setState({
      isPaymentAddressValid: status,
    })
  }

  render() {
    const testID = 'wallet-tab-send-details'
    return (
      <Container safeArea fifth onPress={Keyboard.dismiss} testID={testID}>
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
          maxLength={80}
          placeholder="credential, gift, etc."
          onChangeText={this.onTextChange}
        />
        <CustomView row center style={[{ width: '100%' }]} horizontalSpace>
          <CustomText
            quinaryText
            formatNumber
            transparentBg
            center
            style={[styles.tokenAmountText]}
            fullWidth
          >
            {this.props.tokenAmount}
          </CustomText>
        </CustomView>
        <CustomView center>
          <CustomText transparentBg style={[styles.textSovrinTokens]}>
            SOVRIN TOKENS
          </CustomText>
        </CustomView>
        {this.props.tokenSentStatus === STORE_STATUS.IN_PROGRESS && (
          <CustomActivityIndicator />
        )}
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
          <CustomView center horizontalSpace>
            <CustomText
              center
              transparentBg
              primary
              style={[
                { marginTop: 10 },
                this.state.isPaymentAddressValid === 'SUCCESS'
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
              style={[styles.walletAddressText]}
            >
              Enter wallet address above
            </CustomText>
          </CustomView>
        )}

        <Modal
          backdropOpacity={0.5}
          isVisible={this.state.tokenSentFailedVisible}
          animationIn="zoomIn"
          animationOut="zoomOut"
          animationOutTiming={100}
        >
          <CustomView fifth shadow style={[styles.container]}>
            <CustomView spaceBetween style={[styles.innerContainer]}>
              <Icon
                iconStyle={[{ margin: 10 }]}
                src={require('../images/alertRed.png')}
                extraLarge
                center
                resizeMode="contain"
                testID={`${testID}-modal-header-icon`}
              />
              <CustomText
                h5
                center
                tertiary
                bg="tertiary"
                transparentBg
                style={[styles.message]}
                demiBold
                testID={`${testID}-modal-title`}
              >
                {'Payment failure'}
              </CustomText>
              <CustomText
                h5
                center
                tertiary
                bg="tertiary"
                transparentBg
                style={[styles.message]}
                demiBold
                testID={`${testID}-modal-content`}
              >
                {`Something went wrong trying to pay ${
                  this.paymentData.paymentTo
                }. Please try again.`}
              </CustomText>
            </CustomView>
            <CustomView row spaceAround>
              <CustomButton
                fifth
                onPress={this.onTokenSentFailedClose}
                title={'Cancel'}
                testID={`${testID}-modal-cancel`}
                textStyle={{ fontWeight: 'bold' }}
              />
              <CustomButton
                fifth
                onPress={this.onTokenSentFailedClose}
                title={'Retry'}
                testID={`${testID}-modal-retry`}
                textStyle={{ fontWeight: 'bold' }}
              />
            </CustomView>
          </CustomView>
        </Modal>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: OFFSET_3X,
  },
  innerContainer: {
    ...Platform.select({
      ios: {
        borderBottomColor: color.bg.fifth.font.tertiary,
        borderBottomWidth: HAIRLINE_WIDTH,
      },
      android: {
        borderBottomColor: color.bg.fifth.font.secondary,
        borderBottomWidth: 1,
      },
    }),
    padding: OFFSET_2X,
  },
  message: {
    marginBottom: OFFSET_1X / 2,
  },
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
  disabledText: {
    color: color.bg.eighth.disabled,
  },
})

const mapStateToProps = (state: Store) => {
  return {
    tokenAmount: getTokenAmount(state),
    senderWalletAddress: getWalletAddresses(state)[0],
    receipientWalletAddress: getWalletAddresses(state)[0],
    tokenSentStatus: state.wallet.payment.status,
  }
}
const mapDispatchToProps = dispatch =>
  bindActionCreators({ sendTokens }, dispatch)

export default StackNavigator({
  WalletTabSendDetails: {
    screen: connect(mapStateToProps, mapDispatchToProps)(WalletTabSendDetails),
  },
})
