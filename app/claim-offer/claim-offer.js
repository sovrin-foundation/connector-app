// @flow
import React, { PureComponent } from 'react'
import { StyleSheet, Platform, FlatList, View } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  claimOfferShown,
  acceptClaimOffer,
  claimOfferRejected,
  claimOfferIgnored,
} from '../store'
import {
  Container,
  CustomView,
  CustomButton,
  CustomText,
  Icon,
  ImageColorPicker,
  ConnectionTheme,
  ClaimProofHeader,
  Separator,
  FooterActions,
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
import type { ClaimOfferProps, ClaimOfferPayload } from './type-claim-offer'
import type { Store } from '../store/type-store'
import ClaimRequestModal from './claim-request-modal'

class ClaimOfferAttributeList extends PureComponent {
  keyExtractor = (_, index: number) => index

  renderItem = ({ item }: { item: Attribute }) => {
    return (
      <CustomView
        fifth
        row
        horizontalSpace
        doubleVerticalSpace
        style={[styles.attributeListItem]}
      >
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
          ItemSeparatorComponent={Separator}
          keyExtractor={this.keyExtractor}
          ListFooterComponent={Separator}
          renderItem={this.renderItem}
        />
      </Container>
    )
  }
}

export class ClaimOffer extends PureComponent<void, ClaimOfferProps, void> {
  close = () => {
    this.props.navigation.goBack()
  }

  onIgnore = () => {
    this.props.claimOfferIgnored(this.props.uid)
    this.close()
  }

  onReject = () => {
    this.props.claimOfferRejected(this.props.uid)
    this.close()
  }

  onAccept = () => {
    this.props.acceptClaimOffer(this.props.uid)
  }

  componentDidMount() {
    // update store that offer is shown to user
    this.props.claimOfferShown(this.props.uid)
  }

  render() {
    const { claimOfferData, isValid } = this.props

    const {
      claimRequestStatus,
      senderLogoUrl: logoUrl,
      issuer,
      data,
    }: ClaimOfferPayload = claimOfferData
    const logoUri = logoUrl
      ? { uri: logoUrl }
      : require('../images/cb_evernym.png')
    const testID = 'claim-offer'
    return (
      <Container fifth>
        {isValid && (
          <ClaimProofHeader
            message={`${issuer.name} is offering you`}
            title={data.name}
            onClose={this.onIgnore}
            logoUrl={logoUrl}
            testID={testID}
          >
            <CustomView fifth hCenter style={[styles.headerStripLogoContainer]}>
              <Icon
                absolute="TopRight"
                src={require('../images/close.png')}
                small
                testID={`${testID}-icon-close`}
                onPress={this.close}
                iconStyle={[styles.headerCloseIcon]}
                style={[styles.headerCloseIconContainer]}
              />
              <ConnectionTheme logoUrl={logoUrl} style={[styles.strip]} />
              <Icon
                center
                halo
                extraLarge
                resizeMode="cover"
                src={logoUri}
                style={[styles.issuerLogo]}
                iconStyle={[styles.issuerLogoIcon]}
                testID={`${testID}-issuer-logo`}
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
          acceptTitle="Accept"
          testID={`${testID}-footer`}
        />
        {isValid && (
          <ClaimRequestModal
            claimRequestStatus={claimRequestStatus}
            payload={claimOfferData}
            onContinue={this.close}
          />
        )}
      </Container>
    )
  }
}

const mapStateToProps = ({ claimOffer }: Store, props: ClaimOfferProps) => {
  const { uid } = props.navigation.state.params
  const claimOfferData = claimOffer[uid]

  const isValid =
    claimOfferData &&
    claimOfferData.data &&
    claimOfferData.issuer &&
    claimOfferData.data.revealedAttributes

  return {
    uid,
    claimOfferData,
    isValid,
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      claimOfferShown,
      acceptClaimOffer,
      claimOfferRejected,
      claimOfferIgnored,
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
  headerStripLogoContainer: {
    height: 90,
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
    height: 80,
    zIndex: 1,
  },
  issuerLogoIcon: {
    borderRadius: 40,
  },
  claimOfferData: {
    zIndex: 3,
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
})
