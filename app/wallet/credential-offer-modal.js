// @flow
import React, { PureComponent } from 'react'
import { StyleSheet, Platform } from 'react-native'
import {
  CustomView,
  Icon,
  CustomText,
  CustomButton,
  Container,
} from '../components'
import {
  OFFSET_1X,
  OFFSET_2X,
  OFFSET_3X,
  OFFSET_6X,
  OFFSET_7X,
  color,
  HAIRLINE_WIDTH,
  whiteSmoke,
} from '../common/styles/constant'
import Modal from 'react-native-modal'
import PaymentFailureModal from './payment-failure-modal'
import {
  CLAIM_REQUEST_STATUS,
  CREDENTIAL_OFFER_MODAL_STATUS,
} from '../claim-offer/type-claim-offer'
import type {
  CredentialOfferModalProps,
  CredentialOfferModalState,
  ClaimRequestStatusModalProps,
  ClaimRequestStatus,
} from '../claim-offer/type-claim-offer'
import { ClaimRequestStatusModal } from '../claim-offer/claim-request-modal'
import { LedgerFeesModal } from '../components/ledger-fees-modal/ledger-fees-modal'

export default class CredentialOfferModal extends PureComponent<
  CredentialOfferModalProps,
  CredentialOfferModalState
> {
  state = {
    isVisible: false,
  }

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

  componentDidMount() {
    // if modal is opened when it was unmounted or freshly mounted
    if (
      this.noInitialStatesVisible.indexOf(this.props.claimRequestStatus) < 0 &&
      this.props.claimRequestStatus != null
    ) {
      this.toggleModal(this.props.claimRequestStatus)
    } else {
      this.hideModal()
    }
  }

  componentDidUpdate(prevProps: CredentialOfferModalProps) {
    if (
      this.props.claimRequestStatus !== prevProps.claimRequestStatus &&
      this.props.claimRequestStatus != null
    ) {
      // if component was not unmounted, and claim request status updates
      this.toggleModal(this.props.claimRequestStatus)
    }
  }
  onContinue = () => {
    this.hideModal()
    this.props.onClose()
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

  render() {
    const {
      testID,
      onClose,
      claimRequestStatus,
      onRetry,
      claimOfferData,
      isValid,
      logoUrl,
      payTokenValue,
      credentialOfferModalStatus,
      transferAmount,
      connectionName,
    } = this.props
    return (
      <Modal
        backdropOpacity={0.7}
        backdropColor={whiteSmoke}
        isVisible={
          this.state.isVisible ||
          credentialOfferModalStatus !== CREDENTIAL_OFFER_MODAL_STATUS.NONE
        }
        animationIn="zoomIn"
        animationOut="zoomOut"
        animationOutTiming={100}
        useNativeDriver={true}
        hideModalContentWhileAnimating={true}
        onBackButtonPress={this.props.onClose}
        onBackdropPress={this.props.onClose}
        onModalHide={this.props.onModalHide}
      >
        {isValid &&
          credentialOfferModalStatus ===
            CREDENTIAL_OFFER_MODAL_STATUS.INSUFFICIENT_BALANCE &&
          payTokenValue && (
            <CustomView
              center
              doubleVerticalSpace
              fifth
              shadow
              style={[styles.container]}
            >
              <Icon src={require('../images/alertInfo.png')} />
              <CustomText transparentBg primary center bold>
                You do not have enough tokens to purchase this credential
              </CustomText>
              <CustomButton
                fifth
                onPress={this.props.onClose}
                title={'OK'}
                textStyle={{ fontWeight: 'bold' }}
              />
            </CustomView>
          )}

        {isValid &&
          credentialOfferModalStatus ===
            CREDENTIAL_OFFER_MODAL_STATUS.CREDENTIAL_REQUEST_FAIL && (
            <CustomView
              center
              horizontalSpace
              doubleVerticalSpace
              fifth
              shadow
              style={[styles.container]}
            >
              <Icon src={require('../images/alertInfo.png')} />
              <CustomText transparentBg primary center bold>
                Error accepting credential. Please try again.
              </CustomText>
              <CustomButton
                fifth
                onPress={this.props.onClose}
                title={'OK'}
                textStyle={{ fontWeight: 'bold' }}
              />
            </CustomView>
          )}
        {this.state.isVisible &&
          claimRequestStatus &&
          claimOfferData &&
          isValid && (
            <ClaimRequestStatusModal
              claimRequestStatus={claimRequestStatus}
              payload={claimOfferData}
              onContinue={this.props.onClose}
              senderLogoUrl={logoUrl}
              payTokenValue={payTokenValue}
              message1={payTokenValue ? 'You paid' : 'You accepted'}
              message3={payTokenValue ? '' : 'from'}
              message6={
                payTokenValue ? 'They will issue it to you shortly.' : ''
              }
              isPending={
                claimRequestStatus ===
                CLAIM_REQUEST_STATUS.SENDING_PAID_CREDENTIAL_REQUEST
              }
            />
          )}

        {credentialOfferModalStatus ===
          CREDENTIAL_OFFER_MODAL_STATUS.SEND_PAID_CREDENTIAL_REQUEST_FAIL ||
        credentialOfferModalStatus ===
          CREDENTIAL_OFFER_MODAL_STATUS.TOKEN_SENT_FAIL ? (
          <PaymentFailureModal
            connectionName={
              connectionName ||
              (claimOfferData != null && claimOfferData.issuer != null
                ? claimOfferData.issuer.name
                : '')
            }
            testID={`${testID}-payment-failure-modal`}
            onClose={this.props.onClose}
            onRetry={this.props.onRetry}
          />
        ) : null}

        {(payTokenValue || transferAmount) &&
        credentialOfferModalStatus ===
          CREDENTIAL_OFFER_MODAL_STATUS.LEDGER_FEES ? (
          <LedgerFeesModal
            onNo={this.props.onNo}
            onYes={this.props.onYes}
            transferAmount={transferAmount}
            renderFeesText={this.props.renderFeesText}
          />
        ) : null}
      </Modal>
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
})
