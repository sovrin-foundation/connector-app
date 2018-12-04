// @flow
import React, { Component } from 'react'
import { StyleSheet, Keyboard, Platform } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { createStackNavigator, NavigationActions } from 'react-navigation'
import { scale } from 'react-native-size-matters'
import {
  Container,
  CustomText,
  CustomView,
  CustomButton,
  CustomHeader,
  Icon,
  Loader,
} from '../components'
import { primaryHeaderStyles } from '../components/layout/header-styles'
import {
  OFFSET_1X,
  OFFSET_2X,
  OFFSET_3X,
  OFFSET_6X,
  OFFSET_7X,
  color,
  HAIRLINE_WIDTH,
  whiteSmokeSecondary,
} from '../common/styles/constant'
import ControlInput from '../components/input-control/input-control'
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
  FONT_SIZE_MAPPING,
} from './wallet-constants'
import { sendTokens } from '../wallet/wallet-store'
import { getWalletAddresses, getTokenAmount } from '../store/store-selector'
import type { Store } from '../store/type-store'
import { STORE_STATUS } from './type-wallet'
import { CREDENTIAL_OFFER_MODAL_STATUS } from '../claim-offer/type-claim-offer'
import Modal from 'react-native-modal'
import PaymentFailureModal from './payment-failure-modal'
import CredentialOfferModal from './credential-offer-modal'

export class WalletTabSendDetails extends Component<
  WalletTabSendDetailsProps,
  WalletTabSendDetailsState
> {
  static navigationOptions = ({ navigation, screenProps }) => ({
    header: (
      <CustomHeader flatHeader backgroundColor={whiteSmokeSecondary}>
        <Icon
          testID={'back-arrow'}
          iconStyle={[styles.headerLeft]}
          src={require('../images/icon_backArrow.png')}
          resizeMode="contain"
          onPress={() => navigation.goBack(null)}
          small
        />

        <CustomText
          style={[{ color: color.bg.seventh.font.sixth }]}
          transparentBg
          h5
        >
          Pay Tokens
        </CustomText>

        <CustomText
          uppercase
          bold
          quinaryText
          transparentBg
          h5
          style={[navigation.state.params.isValid ? {} : styles.disabledText]}
          testID={SEND_TOKENS_TO_PAYMENT_ADDRESS}
          onPress={() => navigation.state.params.onSendTokens()}
        >
          Send
        </CustomText>
      </CustomHeader>
    ),
  })

  state = {
    showPaymentAddress: false,
    isPaymentAddressValid: 'IDLE',
    credentialOfferModalStatus: CREDENTIAL_OFFER_MODAL_STATUS.NONE,
  }

  paymentData: WalletSendPaymentData = {
    paymentTo: '',
    paymentFor: '',
  }

  componentDidUpdate(prevProps: WalletTabSendDetailsProps) {
    if (this.props.tokenSentStatus !== prevProps.tokenSentStatus) {
      if (this.props.tokenSentStatus === STORE_STATUS.SUCCESS) {
        /*
          So, we have one operation to go back to tabs stack, and then another one to change tab to receiveTabRoute.

          Since we're using createTabNavigator inside inside of createStackNavigator
          and are then going to a different createStackNavigator, we use the goBack method and then the navigate method.

          For this to work, we are also passing navigator of tabs via state params and then navigating tabs stack as well.
        */
        this.props.navigation.goBack(null)
        this.props.navigation.state &&
          this.props.navigation.state.params.navigate(receiveTabRoute)
      } else if (this.props.tokenSentStatus === STORE_STATUS.ERROR) {
        this.setState({
          credentialOfferModalStatus:
            CREDENTIAL_OFFER_MODAL_STATUS.TOKEN_SENT_FAIL,
        })
      }
    }
  }

  componentDidMount() {
    this.props.navigation.setParams({
      onSendTokens: this.onSendTokens,
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
    this.setState({
      credentialOfferModalStatus: CREDENTIAL_OFFER_MODAL_STATUS.NONE,
    })
  }

  throttledAsyncValidationFunction = () => {
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

  onShowTransactionFeesModal() {
    this.setState({
      credentialOfferModalStatus: CREDENTIAL_OFFER_MODAL_STATUS.LEDGER_FEES,
    })
  }

  onHideTransactionFeesModal = () => {
    this.setState({
      credentialOfferModalStatus: CREDENTIAL_OFFER_MODAL_STATUS.NONE,
    })
  }

  onStartTransfer = () => {
    this.onHideTransactionFeesModal()
    this.props.sendTokens(this.props.tokenAmount, this.paymentData.paymentTo)
  }

  onSendTokens = () => {
    this.onTokenSentFailedClose()
    if (this.state.isPaymentAddressValid === 'SUCCESS') {
      this.onShowTransactionFeesModal()
    }
  }

  render() {
    const testID = 'wallet-tab-send-details'
    const fontSize = scale(FONT_SIZE_MAPPING(this.props.tokenAmount.length))

    return (
      <Container safeArea fifth onPress={Keyboard.dismiss} testID={testID}>
        <ControlInput
          label="To"
          name="paymentTo"
          placeholder="Enter Payee wallet address"
          validation={this.throttledAsyncValidationFunction}
          onChangeText={this.onTextChange}
          isValid={this.state.isPaymentAddressValid}
          maxLength={100}
          autoCorrect={false}
          autoCapitalize="none"
          autoFocus={true}
        />
        <ControlInput
          label="For"
          name="paymentFor"
          multiline
          maxLength={80}
          placeholder="credential, gift, etc."
          onChangeText={this.onTextChange}
        />
        {this.props.tokenSentStatus === STORE_STATUS.IN_PROGRESS && (
          <CustomView center style={[styles.loaderContainer]}>
            <Loader showMessage={false} />
          </CustomView>
        )}
        <CustomView row center style={[{ width: '100%' }]} horizontalSpace>
          <CustomText
            quinaryText
            formatNumber
            transparentBg
            center
            style={[
              styles.tokenAmountText,
              {
                fontSize,
              },
            ]}
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
        <CustomView center style={[{ marginTop: 36 }]}>
          <CustomView center style={[{ width: '65%' }]}>
            <CustomText transparentBg style={[styles.walletContextText]}>
              You are sending{' '}
              <CustomText transparentBg quinaryText>
                {formatNumbers(this.props.tokenAmount)}
              </CustomText>{' '}
              tokens to this wallet address:
            </CustomText>
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
              {this.paymentData.paymentTo}
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

        <CredentialOfferModal
          connectionName={this.paymentData.paymentTo}
          credentialOfferModalStatus={this.state.credentialOfferModalStatus}
          testID={`${testID}-payment-failure-modal`}
          onClose={this.onTokenSentFailedClose}
          onRetry={this.onSendTokens}
          onYes={this.onStartTransfer}
          onNo={this.onHideTransactionFeesModal}
          transferAmount={this.props.tokenAmount}
        />
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
    marginTop: 19,
  },
  disabledText: {
    color: color.bg.eighth.disabled,
  },
  loaderContainer: {
    height: 40,
  },
})

const mapStateToProps = (state: Store) => ({
  tokenAmount: getTokenAmount(state),
  tokenSentStatus: state.wallet.payment.status,
})

const mapDispatchToProps = dispatch =>
  bindActionCreators({ sendTokens }, dispatch)

export default createStackNavigator({
  WalletTabSendDetails: {
    screen: connect(mapStateToProps, mapDispatchToProps)(WalletTabSendDetails),
  },
})
