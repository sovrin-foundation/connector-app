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
} from '../components'
import { homeRoute } from '../common/'
import {
  OFFSET_2X,
  OFFSET_1X,
  color,
  OFFSET_3X,
  OFFSET_5X,
} from '../common/styles'
import type { ClaimOfferPayload, Attribute } from './type-claim-offer'
import type { Store } from '../store/type-store'
import ClaimRequestModal from './claim-request-modal'

class ClaimOfferHeader extends PureComponent {
  render() {
    const { issuer, claimOffer }: ClaimOfferPayload = this.props.payload
    const logoUrl = issuer.logoUrl
      ? { uri: issuer.logoUrl }
      : require('../images/cb_evernym.png')

    return (
      <CustomView fifth style={[styles.header]}>
        <CustomView fifth center style={[styles.headerStripLogoContainer]}>
          <Icon
            absolute="TopRight"
            src={require('../images/close.png')}
            small
            testID="claim-offer-icon-close"
            onPress={this.props.onClose}
            iconStyle={[styles.headerCloseIcon]}
            style={[styles.headerCloseIconContainer]}
          />
          <ConnectionTheme logoUrl={issuer.logoUrl} style={[styles.strip]} />
          <Icon
            center
            halo
            extraLarge
            resizeMode="cover"
            src={logoUrl}
            style={[styles.issuerLogo]}
            iconStyle={[styles.issuerLogoIcon]}
            testID="claim-offer-issuer-logo"
          />
        </CustomView>
        <CustomView fifth center style={[styles.issuerDetail]}>
          <CustomText h5 demiBold bg="fifth">
            {issuer.name} is offering you
          </CustomText>
          <CustomText h4 thick bg="fifth" style={[styles.claimOfferName]}>
            {claimOffer.name}
          </CustomText>
        </CustomView>
        <ImageColorPicker imageUrl={issuer.logoUrl} />
      </CustomView>
    )
  }
}

class Separator extends PureComponent {
  render() {
    return <CustomView style={[styles.separator]} />
  }
}

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
      <FlatList
        data={attributes}
        ItemSeparatorComponent={Separator}
        keyExtractor={this.keyExtractor}
        ListFooterComponent={Separator}
        renderItem={this.renderItem}
      />
    )
  }
}

export class ClaimOffer extends PureComponent {
  close = () => {
    this.props.navigation.goBack()
  }

  onIgnore = () => {
    this.props.claimOfferIgnored()
    this.close()
  }

  onReject = () => {
    this.props.claimOfferRejected()
    this.close()
  }

  onAccept = () => {
    this.props.acceptClaimOffer()
  }

  componentDidMount() {
    // update store that offer is shown to user
    this.props.claimOfferShown()
  }

  render() {
    const { payload, claimRequestStatus } = this.props.claimOffer
    const isValid =
      payload &&
      payload.claimOffer &&
      payload.issuer &&
      payload.claimOffer.revealedAttributes

    const { issuer: { logoUrl } }: ClaimOfferPayload = payload

    return (
      <Container fifth>
        {isValid && (
          <ClaimOfferHeader payload={payload} onClose={this.onIgnore} />
        )}
        {isValid ? (
          <Container fifth style={[styles.claimOfferData]}>
            <ClaimOfferAttributeList
              list={payload.claimOffer.revealedAttributes}
            />
          </Container>
        ) : (
          <Container fifth center>
            <CustomText h5 bg="fifth">
              Invalid claim offer. Please ignore.
            </CustomText>
          </Container>
        )}
        <CustomView row>
          <Container>
            <ConnectionTheme logoUrl={logoUrl} secondary>
              <CustomButton
                primary
                medium
                raised
                title="Ignore"
                onPress={this.onReject}
              />
            </ConnectionTheme>
          </Container>
          <Container>
            <ConnectionTheme logoUrl={logoUrl}>
              <CustomButton
                primary
                medium
                raised
                title="Accept"
                onPress={this.onAccept}
              />
            </ConnectionTheme>
          </Container>
        </CustomView>
        {isValid && (
          <ClaimRequestModal
            claimRequestStatus={claimRequestStatus}
            payload={payload}
            onContinue={this.close}
          />
        )}
      </Container>
    )
  }
}

const mapStateToProps = ({ claimOffer }: Store) => ({
  claimOffer,
})

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
  header: {
    paddingTop: (Platform.OS === 'ios' ? OFFSET_2X : 0) + 14,
    shadowColor: color.bg.secondary.color,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    zIndex: 4,
  },
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
  issuerDetail: {
    marginTop: OFFSET_1X / 2,
    paddingBottom: OFFSET_5X / 2,
  },
  claimOfferName: {
    marginTop: OFFSET_1X / 2,
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
  separator: {
    height: 2,
    backgroundColor: color.bg.secondary.font.tertiary,
  },
})
