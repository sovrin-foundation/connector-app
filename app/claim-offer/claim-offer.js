// @flow
import React, { PureComponent } from 'react'
import {
  StyleSheet,
  Platform,
  FlatList,
  View,
  StatusBar,
  Alert,
} from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  claimOfferShown,
  acceptClaimOffer,
  claimOfferRejected,
  claimOfferIgnored,
  claimOfferShowStart,
  resetClaimRequestStatus,
} from './claim-offer-store'
import {
  Container,
  CustomView,
  CustomButton,
  CustomText,
  Icon,
  ConnectionTheme,
  ClaimProofHeader,
  Separator,
  FooterActions,
  CustomSafeAreaView,
  headerStyles,
} from '../components'
import { homeRoute } from '../common/'
import {
  OFFSET_2X,
  OFFSET_1X,
  color,
  OFFSET_3X,
  OFFSET_5X,
} from '../common/styles'
import type {
  AdditionalDataPayload,
  Attribute,
} from '../push-notification/type-push-notification'
import type {
  ClaimOfferProps,
  ClaimOfferPayload,
  ClaimOfferAttributeListProps,
  ClaimOfferState,
} from './type-claim-offer'
import {
  CLAIM_REQUEST_STATUS,
  CREDENTIAL_OFFER_MODAL_STATUS,
} from './type-claim-offer'
import type { Store } from '../store/type-store'
import { ClaimRequestStatusModal } from './claim-request-modal'
import {
  getConnectionLogoUrl,
  getConnectionTheme,
} from '../store/store-selector'

import type { ReactNavigation } from '../common/type-common'
import { updateStatusBarTheme } from '../../app/store/connections-store'
import { CustomModal } from '../components'
import PaymentFailureModal from '../wallet/payment-failure-modal'
import CredentialOfferModal from '../wallet/credential-offer-modal'
import { LedgerFeesModal } from '../components/ledger-fees-modal/ledger-fees-modal'
import { getStatusBarStyle } from '../components/custom-header/custom-header'

class ClaimOfferAttributeList extends PureComponent<
  ClaimOfferAttributeListProps,
  void
> {
  keyExtractor = ({ label }: Attribute, index: number) => `${label}${index}`

  renderItem = ({ item }: { item: Attribute }) => {
    return (
      <CustomView fifth row horizontalSpace doubleVerticalSpace>
        <CustomView fifth right style={[styles.attributeListLabel]}>
          <CustomText
            h7
            uppercase
            semiBold
            bg="tertiary"
            transparentBg
            style={[styles.attributeListLabelText]}
          >
            {item.label}
          </CustomText>
        </CustomView>
        <CustomView fifth left style={[styles.attributeListValue]}>
          <CustomText h6 demiBold bg="tertiary" transparentBg>
            {item.data}
          </CustomText>
        </CustomView>
      </CustomView>
    )
  }

  render() {
    const attributes: Array<Attribute> = this.props.list
    return (
      <Container fifth style={[styles.claimOfferData]}>
        <FlatList
          data={attributes}
          keyExtractor={this.keyExtractor}
          ItemSeparatorComponent={Separator}
          ListFooterComponent={Separator}
          renderItem={this.renderItem}
        />
      </Container>
    )
  }
}

export class ClaimOffer extends PureComponent<
  ClaimOfferProps,
  ClaimOfferState
> {
  constructor(props: ClaimOfferProps) {
    super(props)
    if (props.navigation.state) {
      props.claimOfferShowStart(props.navigation.state.params.uid)
    }
  }

  state = {
    disableAcceptButton: false,
    credentialOfferModalStatus: CREDENTIAL_OFFER_MODAL_STATUS.NONE,
  }

  close = () => {
    if (
      this.state.credentialOfferModalStatus !==
      CREDENTIAL_OFFER_MODAL_STATUS.INSUFFICIENT_BALANCE
    ) {
      this.setState({
        credentialOfferModalStatus: CREDENTIAL_OFFER_MODAL_STATUS.NONE,
      })
    }

    this.props.navigation.goBack()
  }

  hideInsufficientBalanceModal = () => {
    // the reason why we can't just use close method is our CustomModal
    // somehow on some Android devices, if we open claim offer screen again
    // modal component flashes for a second and then goes away
    // however, props to the component are updated ones and does not satisfy
    // condition to show modal, but Modal still shows up
    // We have tried using this format as well isValid ? <Modal /> : null
    // However, in this format, Modal freezes the screen with Modal's background
    // and user can't tap anywhere on screen and app seems to be frozen
    // then only workaround is to kill the app and run again
    // So we can't go back to ternary based null rendering as well
    this.props.resetClaimRequestStatus(this.props.uid)
  }

  onIgnore = () => {
    this.props.claimOfferIgnored(this.props.uid)
    this.close()
  }

  onReject = () => {
    this.props.claimOfferRejected(this.props.uid)
    this.close()
  }

  onProceedPaidCredTransaction = () => {
    this.setState({
      credentialOfferModalStatus: CREDENTIAL_OFFER_MODAL_STATUS.NONE,
    })
    this.props.acceptClaimOffer(this.props.uid)
  }

  onRejectPaidCredTransaction = () => {
    this.setState({
      credentialOfferModalStatus: CREDENTIAL_OFFER_MODAL_STATUS.NONE,
      disableAcceptButton: false,
    })
  }

  onAccept = () => {
    this.setState({
      disableAcceptButton: true,
    })
    if (this.props.claimOfferData.payTokenValue) {
      this.setState({
        credentialOfferModalStatus: CREDENTIAL_OFFER_MODAL_STATUS.LEDGER_FEES,
      })
    } else {
      this.props.acceptClaimOffer(this.props.uid)
    }
  }

  componentDidMount() {
    // update store that offer is shown to user
    this.props.claimOfferShown(this.props.uid)
    this.props.updateStatusBarTheme(this.props.claimThemePrimary)
  }

  onCredentialOfferModalHide = () => {
    console.log('onCredentialModalHide clicked')
    console.log(this.props)
    const { claimOfferData } = this.props
    const { claimRequestStatus }: ClaimOfferPayload = claimOfferData
    console.log(claimRequestStatus)
    if (
      claimRequestStatus === CLAIM_REQUEST_STATUS.INSUFFICIENT_BALANCE &&
      this.state.credentialOfferModalStatus !==
        CREDENTIAL_OFFER_MODAL_STATUS.INSUFFICIENT_BALANCE
    ) {
      this.setState({
        credentialOfferModalStatus:
          CREDENTIAL_OFFER_MODAL_STATUS.INSUFFICIENT_BALANCE,
      })
    }
    if (
      claimRequestStatus === CLAIM_REQUEST_STATUS.SEND_CLAIM_REQUEST_FAIL ||
      claimRequestStatus === CLAIM_REQUEST_STATUS.CLAIM_REQUEST_FAIL
    ) {
      if (this.state.disableAcceptButton === true) {
        this.setState({
          disableAcceptButton: false,
          credentialOfferModalStatus:
            CREDENTIAL_OFFER_MODAL_STATUS.CREDENTIAL_REQUEST_FAIL,
        })
      }
    }
    if (
      claimRequestStatus ===
        CLAIM_REQUEST_STATUS.PAID_CREDENTIAL_REQUEST_FAIL &&
      this.state.credentialOfferModalStatus !==
        CREDENTIAL_OFFER_MODAL_STATUS.SEND_PAID_CREDENTIAL_REQUEST_FAIL
    ) {
      this.setState({
        credentialOfferModalStatus:
          CREDENTIAL_OFFER_MODAL_STATUS.SEND_PAID_CREDENTIAL_REQUEST_FAIL,
      })
    }
  }
  render() {
    const {
      claimOfferData,
      isValid,
      logoUrl,
      claimThemePrimary,
      claimThemeSecondary,
    } = this.props
    const {
      claimRequestStatus,
      issuer,
      data,
      payTokenValue,
    }: ClaimOfferPayload = claimOfferData
    const logoUri = logoUrl
      ? { uri: logoUrl }
      : require('../images/cb_evernym.png')
    const testID = 'claim-offer'
    let acceptButtonText = payTokenValue ? 'Accept & Pay' : 'Accept'

    return (
      <Container style={[{ backgroundColor: claimThemePrimary }]}>
        <StatusBar
          backgroundColor={claimThemePrimary}
          barStyle={getStatusBarStyle(claimThemePrimary)}
        />
        {isValid && (
          <ClaimProofHeader
            message={`${issuer.name} is offering you`}
            title={data.name}
            onClose={this.onIgnore}
            logoUrl={logoUrl}
            testID={testID}
            payTokenValue={payTokenValue}
            containerStyle={{
              backgroundColor: claimThemePrimary,
              borderBottomColor: claimThemePrimary,
            }}
            textContainerStyle={[headerStyles.clearBg]}
            messageStyle={[headerStyles.clearBg, styles.messageStyle]}
            titleStyle={[styles.titleStyles]}
          >
            <CustomView
              fifth
              hCenter
              style={[headerStyles.headerLogoContainer, headerStyles.clearBg]}
            >
              <Icon
                absolute="TopRight"
                src={require('../images/iconClose.png')}
                medium
                testID={`${testID}-icon-close`}
                onPress={this.close}
                iconStyle={[styles.headerCloseIcon]}
                style={[styles.headerCloseIconContainer]}
              />
              <Icon
                center
                halo
                extraLarge
                resizeMode="cover"
                src={logoUri}
                style={[styles.issuerLogo]}
                iconStyle={[styles.issuerLogoIcon]}
                testID={`${testID}-issuer-logo`}
                backgroundRoundWhite
              />
            </CustomView>
          </ClaimProofHeader>
        )}
        {isValid ? (
          <ClaimOfferAttributeList list={data.revealedAttributes} />
        ) : (
          <Container fifth center>
            <CustomText h5 bg="fifth">
              Invalid claim offer. Please ignore.
            </CustomText>
          </Container>
        )}
        <FooterActions
          logoUrl={logoUrl}
          onAccept={this.onAccept}
          onDecline={this.onReject}
          denyTitle="Ignore"
          acceptTitle={acceptButtonText}
          testID={`${testID}-footer`}
          disableAccept={this.state.disableAcceptButton}
        />

        <CredentialOfferModal
          isValid={isValid}
          claimRequestStatus={claimRequestStatus}
          onModalHide={this.onCredentialOfferModalHide}
          claimOfferData={claimOfferData}
          onClose={this.close}
          senderLogoUrl={logoUrl}
          payTokenValue={payTokenValue}
          credentialOfferModalStatus={this.state.credentialOfferModalStatus}
          testID={`${testID}-payment-failure-modal`}
          onRetry={this.onAccept}
          onNo={this.onRejectPaidCredTransaction}
          onYes={this.onProceedPaidCredTransaction}
        />
      </Container>
    )
  }
}

const mapStateToProps = (state: Store, props: ReactNavigation) => {
  const { claimOffer } = state
  const { uid } =
    props.navigation.state && props.navigation.state.params
      ? props.navigation.state.params
      : { uid: '' }
  const claimOfferData = claimOffer[uid]
  const logoUrl = getConnectionLogoUrl(state, claimOfferData.remotePairwiseDID)
  const themeForLogo = getConnectionTheme(state, logoUrl)
  const isValid =
    claimOfferData &&
    claimOfferData.data &&
    claimOfferData.issuer &&
    claimOfferData.data.revealedAttributes

  return {
    claimThemePrimary: themeForLogo.primary,
    claimThemeSecondary: themeForLogo.secondary,
    uid,
    claimOfferData,
    isValid,
    logoUrl,
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      claimOfferShown,
      acceptClaimOffer,
      claimOfferRejected,
      claimOfferIgnored,
      updateStatusBarTheme,
      claimOfferShowStart,
      resetClaimRequestStatus,
    },
    dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(ClaimOffer)

const styles = StyleSheet.create({
  headerCloseIcon: {
    marginRight: 15,
  },
  headerCloseIconContainer: {
    zIndex: 2,
  },
  strip: {
    height: 20,
    width: '100%',
    backgroundColor: color.actions.secondary,
    zIndex: -1,
  },
  issuerLogo: {
    ...StyleSheet.absoluteFillObject,
    alignSelf: 'center',
    zIndex: 1,
  },
  issuerLogoIcon: {
    borderRadius: 40,
  },
  claimOfferData: {
    zIndex: -1,
  },
  attributeListLabel: {
    flex: 4,
    paddingRight: OFFSET_3X / 2,
  },
  attributeListLabelText: {
    lineHeight: 19,
  },
  attributeListValue: {
    flex: 6,
  },
  messageStyle: {
    color: color.bg.primary.font.primary,
  },
  titleStyles: {
    backgroundColor: 'transparent',
    color: color.bg.primary.font.primary,
  },
})
