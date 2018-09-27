// @flow
import React, { PureComponent } from 'react'
import { View, StyleSheet, Image } from 'react-native'
import { Button } from 'react-native-elements'
import Modal from 'react-native-modal'
import { CustomModal, AvatarsPair, CustomText } from '../components'
import { color, font, OFFSET_1X } from '../common/styles'
import { CLAIM_REQUEST_STATUS } from './type-claim-offer'
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
  state = {
    isVisible: false,
  }

  // only states for which claim request modal will be visible
  visibleStates = [
    CLAIM_REQUEST_STATUS.SENDING_CLAIM_REQUEST,
    CLAIM_REQUEST_STATUS.CLAIM_REQUEST_SUCCESS,
    CLAIM_REQUEST_STATUS.SENDING_PAID_CREDENTIAL_REQUEST,
    CLAIM_REQUEST_STATUS.PAID_CREDENTIAL_REQUEST_SUCCESS,
    CLAIM_REQUEST_STATUS.SEND_CLAIM_REQUEST_SUCCESS,
  ]

  noInitialStatesVisible = [
    CLAIM_REQUEST_STATUS.SENDING_CLAIM_REQUEST,
    CLAIM_REQUEST_STATUS.SENDING_PAID_CREDENTIAL_REQUEST,
  ]

  onContinue = () => {
    this.hideModal()
    this.props.onContinue()
  }

  showModal() {
    this.setState({ isVisible: true })
  }

  hideModal() {
    this.setState({ isVisible: false })
  }

  toggleModal(claimRequestStatus: ClaimRequestStatus) {
    if (this.visibleStates.indexOf(claimRequestStatus) > -1) {
      this.showModal()
    } else {
      this.hideModal()
    }
  }

  componentDidMount() {
    // if modal is opened when it was unmounted or freshly mounted
    if (
      this.noInitialStatesVisible.indexOf(this.props.claimRequestStatus) < 0
    ) {
      this.toggleModal(this.props.claimRequestStatus)
    } else {
      this.hideModal()
    }
  }

  componentDidUpdate(prevProps: ClaimRequestStatusModalProps) {
    if (this.props.claimRequestStatus !== prevProps.claimRequestStatus) {
      // if component was not unmounted, and claim request status updates
      this.toggleModal(this.props.claimRequestStatus)
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
      : require('../images/cb_evernym.png')
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

    return (
      <CustomModal
        onPress={this.onContinue}
        buttonText="Continue"
        testID={'claim-request'}
        isVisible={this.state.isVisible}
        onModalHide={this.props.onModalHide}
        disabled={isSending}
      >
        <AvatarsPair
          middleImage={middleImage}
          middleImageStyle={middleImageStyle}
          avatarRight={avatarRight}
          testID={'claim-request'}
        />
        {!isSending && (
          <ClaimRequestModalText>{message1}</ClaimRequestModalText>
        )}

        {payTokenValue && !isSendingPaidCredentialRequest ? (
          <ClaimRequestModalText bold>
            {`${formatNumbers(payTokenValue)} tokens`}
          </ClaimRequestModalText>
        ) : null}

        <ClaimRequestModalText bold>
          {isSendingPaidCredentialRequest
            ? 'Paying...'
            : isSendingCredentialRequest ? 'Accepting...' : message2}
        </ClaimRequestModalText>

        {!isSending && message3 ? (
          <ClaimRequestModalText>{message3}</ClaimRequestModalText>
        ) : null}

        {!isSending && !payTokenValue ? (
          <ClaimRequestModalText bold>{message4}</ClaimRequestModalText>
        ) : null}

        {conditionalMessage &&
          !isSending && (
            <ClaimRequestModalText>{conditionalMessage}</ClaimRequestModalText>
          )}
      </CustomModal>
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
})
