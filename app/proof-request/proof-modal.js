// @flow
import React, { PureComponent } from 'react'
import { View, StyleSheet, Image } from 'react-native'
import { Button } from 'react-native-elements'
import Modal from 'react-native-modal'
import { CustomModal, AvatarsPair, CustomText } from '../components'
import { color, font, OFFSET_1X } from '../common/styles'
import { PROOF_STATUS } from './type-proof-request'
import type {
  ProofModalProps,
  ProofModalState,
  ProofStatus,
} from './type-proof-request'

export default class ProofModal extends PureComponent<
  ProofModalProps,
  ProofModalState
> {
  state = {
    isVisible: false,
  }

  // only states for which claim request modal will be visible
  visibleStates = [PROOF_STATUS.SENDING_PROOF, PROOF_STATUS.SEND_PROOF_SUCCESS]

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

  toggleModal(proofStatus: ProofStatus) {
    if (this.visibleStates.indexOf(proofStatus) > -1) {
      this.showModal()
    } else {
      this.hideModal()
    }
  }

  componentDidMount() {
    // if modal is opened when it was unmounted or freshly mounted
    this.toggleModal(this.props.proofStatus)
  }

  componentWillReceiveProps(nextProps: ProofModalProps) {
    // if component was not unmounted, and claim request status updates
    if (this.props.proofStatus !== nextProps.proofStatus) {
      this.toggleModal(nextProps.proofStatus)
    }
  }

  render() {
    const { proofStatus, name, title, logoUrl } = this.props
    const avatarRight = logoUrl
      ? { uri: logoUrl }
      : require('../images/cb_evernym.png')
    const { middleImage, middleImageStyle } =
      proofStatus === PROOF_STATUS.SEND_PROOF_SUCCESS
        ? {
            middleImage: require('../images/checkMark.png'),
            middleImageStyle: null,
          }
        : {
            middleImage: require('../images/connectArrows.png'),
            middleImageStyle: styles.connectedArrow,
          }

    const { message, subject } =
      proofStatus === PROOF_STATUS.SENDING_PROOF
        ? { message: `Sending Proof to`, subject: name }
        : { message: 'Successfully Sent', subject: title }

    return (
      <CustomModal
        disabled={proofStatus !== PROOF_STATUS.SEND_PROOF_SUCCESS}
        onPress={this.onContinue}
        buttonText="Continue"
        testID={'send-proof'}
        isVisible={this.state.isVisible}
      >
        <AvatarsPair
          middleImage={middleImage}
          middleImageStyle={middleImageStyle}
          avatarLeft={require('../images/UserAvatar.png')}
          avatarRight={avatarRight}
          testID={'send-proof'}
        />
        <CustomText
          h6
          demiBold
          center
          tertiary
          bg="tertiary"
          transparentBg
          style={[styles.message]}
          testID={`send-proof-message`}
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
          style={[styles.subject]}
          testID={`proof-verify-name`}
        >
          {subject}
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
  subject: {
    marginBottom: OFFSET_1X,
  },
})
