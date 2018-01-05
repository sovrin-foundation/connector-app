// @flow
import React, { PureComponent } from 'react'
import { View, StyleSheet, Image } from 'react-native'
import { Button } from 'react-native-elements'
import Modal from 'react-native-modal'
import { CustomModal, AvatarsPair, CustomText } from '../components'
import { color, font, OFFSET_1X } from '../common/styles'
import { CLAIM_REQUEST_STATUS } from './type-claim-offer'
import type {
  ClaimRequestStatusModalProps,
  ClaimRequestStatusModalState,
  ClaimRequestStatus,
} from './type-claim-offer'

export default class ClaimRequestStatusModal extends PureComponent<
  void,
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
    }: ClaimRequestStatusModalProps = this.props
    const avatarRight = senderLogoUrl
      ? { uri: senderLogoUrl }
      : require('../images/cb_evernym.png')
    const { middleImage, middleImageStyle } =
      claimRequestStatus === CLAIM_REQUEST_STATUS.CLAIM_REQUEST_SUCCESS
        ? {
            middleImage: require('../images/checkMark.png'),
            middleImageStyle: null,
          }
        : {
            middleImage: require('../images/connectArrows.png'),
            middleImageStyle: styles.connectedArrow,
          }
    const message =
      claimRequestStatus === CLAIM_REQUEST_STATUS.SENDING_CLAIM_REQUEST
        ? `Waiting for ${issuer.name} to issue`
        : 'Successfully issued'

    return (
      <CustomModal
        disabled={
          claimRequestStatus !== CLAIM_REQUEST_STATUS.CLAIM_REQUEST_SUCCESS
        }
        onPress={this.onContinue}
        buttonText="Continue"
        testID={'claim-request'}
        isVisible={this.state.isVisible}
      >
        <AvatarsPair
          middleImage={middleImage}
          middleImageStyle={middleImageStyle}
          avatarLeft={require('../images/UserAvatar.png')}
          avatarRight={avatarRight}
          testID={'claim-request'}
        />
        <CustomText
          h6
          demiBold
          center
          tertiary
          bg="tertiary"
          transparentBg
          style={[styles.message]}
          testID={`claim-request-message`}
        >
          {message}
        </CustomText>
        <CustomText
          h5
          bold
          center
          tertiary
          bg="tertiary"
          transparentBg
          style={[styles.title]}
          testID={`claim-request-claim-name`}
        >
          {data.name}
        </CustomText>
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
    paddingTop: OFFSET_1X,
    marginBottom: OFFSET_1X / 2,
  },
  title: {
    marginBottom: OFFSET_1X,
  },
})
