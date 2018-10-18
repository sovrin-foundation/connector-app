// @flow
import React, { PureComponent } from 'react'
import { View, StyleSheet, Image } from 'react-native'
import { Button } from 'react-native-elements'
import Modal from 'react-native-modal'
import {
  CustomModal,
  AvatarsPair,
  CustomView,
  CustomText,
  Loader,
} from '../components'
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

  successStates = [PROOF_STATUS.SEND_PROOF_SUCCESS]

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
    if (this.successStates.indexOf(proofStatus) > -1) {
      return this.onContinue()
    }

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
    const message = 'Sending...'

    return (
      <CustomModal
        testID={'send-proof'}
        isVisible={this.state.isVisible}
        fullScreen
      >
        <CustomView center style={[styles.container]}>
          <CustomText
            h5
            center
            tertiary
            bg="tertiary"
            transparentBg
            style={[styles.message]}
            testID={`send-proof-message`}
            bold
          >
            {message}
          </CustomText>
          <Loader />
        </CustomView>
      </CustomModal>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    height: '90%',
  },
  message: {
    paddingTop: OFFSET_1X,
    marginBottom: OFFSET_1X / 2,
  },
})
