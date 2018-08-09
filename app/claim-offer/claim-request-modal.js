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

// TODO: Remove the default export and use the named export
export default class ClaimRequestStatusModal extends PureComponent<
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
    this.toggleModal(this.props.claimRequestStatus)
  }

  componentWillReceiveProps(nextProps: ClaimRequestStatusModalProps) {
    // if component was not unmounted, and claim request status updates
    this.toggleModal(nextProps.claimRequestStatus)
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
    if (isPending) {
      message2 = issuer.name
      message4 = `"${data.name}"`
    }
    const avatarRight = senderLogoUrl
      ? { uri: senderLogoUrl }
      : require('../images/cb_evernym.png')
    const { middleImage, middleImageStyle } = isPending
      ? {
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
        disabled={
          claimRequestStatus ===
          CLAIM_REQUEST_STATUS.SENDING_PAID_CREDENTIAL_REQUEST
        }
      >
        <AvatarsPair
          middleImage={middleImage}
          middleImageStyle={middleImageStyle}
          avatarRight={avatarRight}
          testID={'claim-request'}
        />
        <CustomText
          h5
          center
          tertiary
          bg="tertiary"
          transparentBg
          style={[styles.message]}
          testID={`claim-request-message`}
        >
          {claimRequestStatus ===
          CLAIM_REQUEST_STATUS.SENDING_PAID_CREDENTIAL_REQUEST
            ? ''
            : message1}
        </CustomText>
        <CustomText
          h5
          bold
          center
          tertiary
          bg="tertiary"
          transparentBg
          style={[styles.message]}
          testID={`claim-request-message`}
        >
          {claimRequestStatus ===
          CLAIM_REQUEST_STATUS.SENDING_PAID_CREDENTIAL_REQUEST
            ? 'In Progress'
            : message2}
        </CustomText>
        <CustomText
          h5
          center
          tertiary
          bg="tertiary"
          transparentBg
          style={[styles.message]}
          testID={`claim-request-message`}
        >
          {claimRequestStatus ===
          CLAIM_REQUEST_STATUS.SENDING_PAID_CREDENTIAL_REQUEST
            ? ''
            : message3}{' '}
        </CustomText>
        <CustomText
          h5
          bold
          center
          tertiary
          bg="tertiary"
          transparentBg
          style={[styles.message]}
          testID={`claim-request-message`}
        >
          {claimRequestStatus ===
          CLAIM_REQUEST_STATUS.SENDING_PAID_CREDENTIAL_REQUEST
            ? ''
            : message4}
        </CustomText>

        <CustomText
          h5
          center
          tertiary
          bg="tertiary"
          transparentBg
          style={[styles.message]}
          testID={`claim-request-message`}
        >
          {claimRequestStatus ===
          CLAIM_REQUEST_STATUS.SENDING_PAID_CREDENTIAL_REQUEST
            ? ''
            : conditionalMessage}
        </CustomText>

        {payTokenValue &&
        claimRequestStatus !==
          CLAIM_REQUEST_STATUS.SENDING_PAID_CREDENTIAL_REQUEST ? (
          <CustomText
            h5
            bold
            center
            tertiary
            bg="tertiary"
            transparentBg
            style={[styles.message]}
            testID={`claim-request-message`}
          >
            {`${formatNumbers(payTokenValue)} tokens`}
          </CustomText>
        ) : null}
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
  message: {
    marginBottom: OFFSET_1X / 2,
  },
  title: {
    marginBottom: OFFSET_1X,
  },
})
