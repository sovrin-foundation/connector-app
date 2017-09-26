// @flow
import React, { PureComponent } from 'react'
import { StyleSheet, Platform, FlatList } from 'react-native'
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
} from '../components'
import { homeRoute } from '../common/'
import { OFFSET_2X, OFFSET_1X, color } from '../common/styles'
import type { ClaimOfferPayload, Attribute } from './type-claim-offer'
import type { Store } from '../store/type-store'

class ClaimOfferHeader extends PureComponent {
  render() {
    const { issuer, claimOffer }: ClaimOfferPayload = this.props.payload
    const logoUrl = issuer.logoUrl
      ? { uri: issuer.logoUrl }
      : require('../images/cb_evernym.png')

    return (
      <CustomView style={[styles.header]}>
        <CustomView center style={[styles.headerStripLogoContainer]}>
          <Icon
            absolute="TopRight"
            src={require('../images/icon_close.png')}
            small
            testID="claim-offer-icon-close"
            onPress={this.props.onClose}
            iconStyle={[styles.headerCloseIcon]}
            style={[styles.headerCloseIconContainer]}
          />
          <CustomView style={[styles.strip]} />
          <Icon
            center
            halo
            extraLarge
            resizeMode="cover"
            src={logoUrl}
            style={[styles.issuerLogo]}
            testID="claim-offer-issuer-logo"
          />
        </CustomView>
        <CustomView center style={[styles.issuerDetail]}>
          <CustomText h5 bg="fifth">
            {issuer.name} is offering you
          </CustomText>
          <CustomText h4 bold bg="fifth" style={[styles.claimOfferName]}>
            {claimOffer.name}
          </CustomText>
        </CustomView>
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
        row
        horizontalSpace
        doubleVerticalSpace
        style={[styles.attributeListItem]}
      >
        <CustomView right style={[styles.attributeListLabel]}>
          <CustomText
            h7
            uppercase
            bg="fifth"
            style={[styles.attributeListLabelText]}
          >
            {item.label}
          </CustomText>
        </CustomView>
        <CustomView left style={[styles.attributeListValue]}>
          <CustomText h6 bold bg="fifth">
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

    return (
      <Container>
        {payload &&
          payload.claimOffer &&
          payload.issuer && (
            <ClaimOfferHeader payload={payload} onClose={this.onIgnore} />
          )}
        {payload &&
        payload.claimOffer &&
        payload.claimOffer.revealedAttributes ? (
          <Container style={[styles.claimOfferData]}>
            <ClaimOfferAttributeList
              list={payload.claimOffer.revealedAttributes}
            />
          </Container>
        ) : (
          <Container center>
            <CustomText h5 bg="fifth">
              Invalid claim offer. Please ignore.
            </CustomText>
          </Container>
        )}
        <CustomView row>
          <Container>
            <CustomButton
              secondary
              raised
              title="Ignore"
              onPress={this.onReject}
            />
          </Container>
          <Container>
            <CustomButton
              primary
              raised
              title="Accept"
              onPress={this.onAccept}
            />
          </Container>
        </CustomView>
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
    shadowColor: color.bg.secondary.font.tertiary,
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
  issuerDetail: {
    marginTop: OFFSET_1X / 2,
    paddingBottom: OFFSET_1X,
  },
  claimOfferName: {
    marginTop: OFFSET_1X / 2,
  },
  claimOfferData: {
    zIndex: 3,
  },
  attributeListLabel: {
    flex: 1,
    paddingRight: OFFSET_1X,
  },
  attributeListLabelText: {
    lineHeight: 14,
  },
  attributeListValue: {
    flex: 2,
  },
  separator: {
    height: 1,
    backgroundColor: color.bg.secondary.font.tertiary,
  },
})
