// @flow
import React, { PureComponent } from 'react'
import { View, StyleSheet, Image } from 'react-native'
import { Button } from 'react-native-elements'
import Modal from 'react-native-modal'
import {
  CustomView,
  CustomText,
  Avatar,
  TextStyles,
  CustomButton,
} from '../components'
import { color, OFFSET_1X, OFFSET_2X, font } from '../common/styles'
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
    const { claimRequestStatus, payload: { issuer, claimOffer } } = this.props
    const logoUrl = issuer.logoUrl
      ? { uri: issuer.logoUrl }
      : require('../images/cb_evernym.png')

    return (
      <Modal
        backdropColor={color.bg.tertiary.color}
        backdropOpacity={0.7}
        isVisible={this.state.isVisible}
      >
        <CustomView fifth shadow style={[styles.container]}>
          <CustomView hCenter style={[styles.innerContainer]}>
            <CustomView
              row
              vCenter
              spaceBetween
              style={[styles.avatarsContainer]}
            >
              <Avatar
                medium
                shadow
                src={require('../images/invitee.png')}
                testID={'claim-request-avatars-invitee'}
              />
              {claimRequestStatus ===
                CLAIM_REQUEST_STATUS.SENDING_CLAIM_REQUEST && (
                <Image
                  style={styles.checkMark}
                  source={require('../images/connectArrows.png')}
                />
              )}
              {claimRequestStatus ===
                CLAIM_REQUEST_STATUS.CLAIM_REQUEST_SUCCESS && (
                <Image
                  style={styles.checkMark}
                  source={require('../images/checkMark.png')}
                />
              )}
              <Avatar
                medium
                shadow
                src={logoUrl}
                testID={'claim-request-avatars-inviter'}
              />
            </CustomView>
            <CustomText
              bg="fifth"
              h5
              semiBold
              center
              style={[styles.textContent]}
              testID={'claim-request-issuer-waiting'}
            >
              {claimRequestStatus ===
                CLAIM_REQUEST_STATUS.SENDING_CLAIM_REQUEST &&
                `Waiting for ${issuer.name} to issue`}
              {claimRequestStatus ===
                CLAIM_REQUEST_STATUS.CLAIM_REQUEST_SUCCESS &&
                'Successfully issued'}
            </CustomText>
            <CustomText
              bg="fifth"
              h5
              bold
              center
              testID="claim-request-claim-name"
            >
              {claimOffer.name}
            </CustomText>
          </CustomView>
          <CustomButton
            disabled={
              claimRequestStatus !== CLAIM_REQUEST_STATUS.CLAIM_REQUEST_SUCCESS
            }
            fifth
            onPress={this.onContinue}
            title="Continue"
            accessibilityLabel="Continue to home screen"
            testID="claim-request-success-continue"
          />
        </CustomView>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: OFFSET_1X,
  },
  innerContainer: {
    borderBottomColor: color.bg.fifth.font.tertiary,
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingVertical: OFFSET_1X,
  },
  avatarsContainer: {
    marginHorizontal: OFFSET_2X,
    marginVertical: OFFSET_1X,
  },
  textContent: {
    margin: OFFSET_1X,
    color: color.bg.tertiary.font.secondary,
  },
  checkMark: {
    width: 30,
    height: 22,
  },
})
