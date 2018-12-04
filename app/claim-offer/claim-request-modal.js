// @flow
import React, { PureComponent } from 'react'
import { View, StyleSheet, Image, Platform } from 'react-native'
import { Button } from 'react-native-elements'
import Modal from 'react-native-modal'
import {
  CustomModal,
  CustomView,
  AvatarsPair,
  CustomText,
  Loader,
  Container,
  CustomButton,
} from '../components'
import {
  OFFSET_3X,
  OFFSET_4X,
  OFFSET_6X,
  OFFSET_7X,
  HAIRLINE_WIDTH,
  whiteSmoke,
  isiPhone5,
  white,
} from '../common/styles/constant'
import { color, font, OFFSET_1X, OFFSET_2X } from '../common/styles'
import {
  CLAIM_REQUEST_STATUS,
  ACCEPTING_TEXT,
  PAYING_TEXT,
} from './type-claim-offer'
import type { GenericObject } from '../common/type-common'
import type {
  ClaimRequestStatusModalProps,
  ClaimRequestStatusModalState,
  ClaimRequestStatus,
} from './type-claim-offer'
import { formatNumbers } from '../components/text'

const ClaimRequestModalText = (props: { children: string, bold?: boolean }) => (
  <CustomText
    h5
    center
    tertiary
    bg="tertiary"
    transparentBg
    style={[styles.message]}
    testID={`claim-request-message`}
    bold={props.bold}
  >
    {props.children}
  </CustomText>
)

export class ClaimRequestStatusModal extends PureComponent<
  ClaimRequestStatusModalProps,
  ClaimRequestStatusModalState
> {
  // modalText: string
  state = {
    modalText: '',
  }

  // only states for which claim request modal will be visible
  visibleStates = [
    CLAIM_REQUEST_STATUS.SENDING_CLAIM_REQUEST,
    CLAIM_REQUEST_STATUS.SENDING_PAID_CREDENTIAL_REQUEST,
  ]

  successStates = [
    CLAIM_REQUEST_STATUS.CLAIM_REQUEST_SUCCESS,
    CLAIM_REQUEST_STATUS.PAID_CREDENTIAL_REQUEST_SUCCESS,
    CLAIM_REQUEST_STATUS.SEND_CLAIM_REQUEST_SUCCESS,
  ]

  onContinue = () => {
    setTimeout(() => {
      this.props.onContinue()
    }, 1)
  }

  componentDidMount() {
    if (
      this.props.claimRequestStatus ===
      CLAIM_REQUEST_STATUS.SENDING_PAID_CREDENTIAL_REQUEST
    ) {
      this.setState({
        modalText: PAYING_TEXT,
      })
    } else if (
      this.props.claimRequestStatus ===
        CLAIM_REQUEST_STATUS.SENDING_CLAIM_REQUEST &&
      this.state.modalText !== ACCEPTING_TEXT
    ) {
      this.setState({
        modalText: ACCEPTING_TEXT,
      })
    } else {
    }
  }

  componentDidUpdate(
    prevProps: ClaimRequestStatusModalProps,
    prevState: ClaimRequestStatusModalState
  ) {
    if (
      prevProps.claimRequestStatus !== this.props.claimRequestStatus &&
      this.visibleStates.indexOf(this.props.claimRequestStatus) < 0
    ) {
      this.props.onModalHide && this.props.onModalHide()
    }
  }

  render() {
    const {
      claimRequestStatus,
      payload: { issuer, data },
      senderLogoUrl,
      isPending = false,
      message1,
      message3,
      message5,
      message6, //message6 is for payTokenValue related usage
      payTokenValue,
      fromConnectionHistory = false,
    }: ClaimRequestStatusModalProps = this.props
    let message2 = data.name
    let message4 = issuer.name
    if (isPending || payTokenValue) {
      message2 = issuer.name
      message4 = `"${data.name}"`
    }

    if (payTokenValue) {
      message2 = `for ${data.name}`
      message4 = ''
    }

    const isSendingPaidCredentialRequest =
      claimRequestStatus ===
      CLAIM_REQUEST_STATUS.SENDING_PAID_CREDENTIAL_REQUEST
    const isSendingCredentialRequest =
      claimRequestStatus === CLAIM_REQUEST_STATUS.SENDING_CLAIM_REQUEST
    const isSending =
      isSendingPaidCredentialRequest || isSendingCredentialRequest
    const avatarRight = senderLogoUrl
      ? { uri: senderLogoUrl }
      : require('../images/logo_sovrin.png')
    const { middleImage, middleImageStyle } =
      isPending || isSending
        ? payTokenValue || isSending
          ? {
              middleImage: require('../images/connectArrowsRight.png'),
              middleImageStyle: styles.connectedArrowRight,
            }
          : {
              middleImage: require('../images/connectArrows.png'),
              middleImageStyle: styles.connectedArrow,
            }
        : {
            middleImage: require('../images/checkMark.png'),
            middleImageStyle: null,
          }
    const conditionalMessage =
      message6 !== undefined ? (payTokenValue ? message6 : null) : message5

    const modalProps =
      isPending && !isSending
        ? {
            onPress: this.onContinue,
            buttonText: 'Continue',
          }
        : {
            fullScreen: true,
          }
    return (
      <Container center={!(isPending && !fromConnectionHistory)}>
        {isPending && !fromConnectionHistory ? (
          <Container center fifth>
            <CustomView center style={[styles.loaderHeading]}>
              <CustomText
                h5
                center
                tertiary
                bg="tertiary"
                transparentBg
                style={[{ marginBottom: OFFSET_1X / 2 }]}
                bold
              >
                {isPending && fromConnectionHistory
                  ? message2
                  : this.state.modalText}
              </CustomText>
              {isPending && !fromConnectionHistory && <Loader />}
            </CustomView>
          </Container>
        ) : (
          <CustomView
            center
            shadow
            style={[styles.container, styles.backgroundColor]}
          >
            <CustomView style={[styles.innerContainer]} center verticalSpace>
              {isPending &&
                fromConnectionHistory && (
                  <AvatarsPair
                    middleImage={middleImage}
                    middleImageStyle={middleImageStyle}
                    avatarRight={avatarRight}
                    testID={'claim-request'}
                  />
                )}
              {isPending &&
                !isSending && (
                  <ClaimRequestModalText>{message1}</ClaimRequestModalText>
                )}

              {isPending && payTokenValue && !isSendingPaidCredentialRequest ? (
                <ClaimRequestModalText bold>
                  {`${formatNumbers(payTokenValue)} tokens`}
                </ClaimRequestModalText>
              ) : null}

              <ClaimRequestModalText bold>
                {isPending && fromConnectionHistory
                  ? message2
                  : this.state.modalText}
              </ClaimRequestModalText>

              {isPending && !isSending && message3 ? (
                <ClaimRequestModalText>{message3}</ClaimRequestModalText>
              ) : null}

              {isPending && !isSending && !payTokenValue ? (
                <ClaimRequestModalText bold>{message4}</ClaimRequestModalText>
              ) : null}

              {isPending &&
                conditionalMessage &&
                fromConnectionHistory &&
                !isSending && (
                  <ClaimRequestModalText>
                    {conditionalMessage}
                  </ClaimRequestModalText>
                )}
            </CustomView>
            <CustomButton
              fifth
              onPress={this.onContinue}
              title={'Continue'}
              textStyle={{ fontWeight: 'bold', color: '#85BF43' }}
            />
          </CustomView>
        )}
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  connectedArrow: {
    height: 20,
    width: 80,
    zIndex: -1,
    right: 7,
  },
  connectedArrowRight: {
    height: 20,
    width: 80,
    zIndex: -1,
  },
  message: {
    marginBottom: OFFSET_1X / 2,
  },
  title: {
    marginBottom: OFFSET_1X,
  },
  fullScreen: {
    flex: 1,
  },
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
  backgroundColor: {
    backgroundColor: white,
  },
  loaderHeading: { height: '84%' },
})
