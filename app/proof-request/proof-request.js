// @flow
import React, { PureComponent } from 'react'
import { StyleSheet, Platform, Image, FlatList, View } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import {
  Container,
  CustomView,
  CustomButton,
  CustomText,
  Avatar,
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
  OFFSET_4X,
  OFFSET_5X,
  isiPhone5,
} from '../common/styles'
import type {
  AdditionalDataPayload,
  Attribute,
} from '../push-notification/type-push-notification'
import type { ProofRequestAttributeListProp } from './type-proof-request'
import type { Store } from '../store/type-store'
import type { ProofRequestProps } from './type-proof-request'

class ProofRequestAttributeList extends PureComponent<
  void,
  ProofRequestAttributeListProp,
  void
> {
  keyExtractor = (_, index: number) => index

  renderItem = ({ item, index }) => {
    //TODO: need to replace below hard coded string with a logic to get
    //      relevant data for the item.label and claim issuer logo from claimOffer store.
    //      need to finalise what needs to be displayed if there was no proof available for that perticular label.
    const labelData = '11509 142345nd Ave KP N'
    return (
      <Container
        fifth
        style={[styles.attributeItem]}
        testID={`proof-request-attribute-item-${index}`}
        row
      >
        <Container fifth verticalSpace style={[styles.label]}>
          <CustomView fifth style={[styles.attributeListLabel]}>
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
          <CustomView fifth style={[styles.attributeListValue]}>
            <CustomText h6 demiBold bg="tertiary" transparentBg>
              {labelData}
            </CustomText>
          </CustomView>
        </Container>
        <Icon
          center
          medium
          resizeMode="cover"
          src={require('../images/cb_evernym.png')}
          testID={`proof-request-issuer-logo-${index}`}
        />
      </Container>
    )
  }

  render() {
    const attributes: Array<Attribute> = this.props.list
    return (
      <Container fifth style={[styles.proofRequestData]}>
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

export class ProofRequest extends PureComponent<void, ProofRequestProps, void> {
  close = () => {
    this.props.navigation.goBack()
  }

  onIgnore = () => {
    this.close()
  }

  onReject = () => {
    this.close()
  }

  // TODO : need to bind store actions
  onAccept = () => {}

  // TODO : need to bind store actions
  componentDidMount() {}

  render() {
    const { data, issuerName, logoUrl, uid, isValid } = this.props
    const testID = 'proof-request'
    const logoUri = logoUrl
      ? { uri: logoUrl }
      : require('../images/cb_evernym.png')
    return (
      <Container fifth>
        {isValid && (
          <ClaimProofHeader
            message={`${issuerName} would like you to prove:`}
            title={data.name}
            onClose={this.onIgnore}
            logoUrl={logoUrl}
            testID={testID}
          >
            <Icon
              absolute="TopRight"
              src={require('../images/close.png')}
              small
              testID={`${testID}-icon-close`}
              onPress={this.close}
              iconStyle={[styles.headerCloseIcon]}
              style={[styles.headerCloseIconContainer]}
            />
            <CustomView fifth hCenter style={[styles.headerStripLogoContainer]}>
              <ConnectionTheme logoUrl={logoUrl} style={[styles.strip]} />
              <CustomView
                row
                vCenter
                spaceBetween
                style={[styles.avatarsContainer]}
                testID={`${testID}-text-avatars-container`}
              >
                <Icon
                  center
                  halo
                  extraLarge
                  resizeMode="cover"
                  src={require('../images/invitee.png')}
                  style={[styles.issuerLogo]}
                  iconStyle={[styles.issuerLogoIcon]}
                  haloStyle={styles.logoHaloStyle}
                  testID={`${testID}-issuer-logo`}
                />
                <Image
                  style={[styles.checkMark]}
                  source={require('../images/icon_rightArrow.png')}
                  testID={`${testID}-check-mark`}
                />
                <Icon
                  center
                  halo
                  extraLarge
                  resizeMode="cover"
                  src={logoUri}
                  haloStyle={styles.logoHaloStyle}
                  style={[styles.issuerLogo]}
                  iconStyle={[styles.issuerLogoIcon]}
                  testID={`${testID}-issuer-logo`}
                />
              </CustomView>
            </CustomView>
          </ClaimProofHeader>
        )}
        {isValid ? (
          <ProofRequestAttributeList list={data.revealedAttributes} />
        ) : (
          <Container fifth center>
            <CustomText h5 bg="fifth">
              Invalid proof request. Please ignore.
            </CustomText>
          </Container>
        )}
        <FooterActions
          logoUrl={logoUrl}
          onAccept={this.onAccept}
          onDecline={this.onReject}
          denyTitle="Ignore"
          acceptTitle="Accept"
          testID={testID}
        />
      </Container>
    )
  }
}
// we need to navigate to this screen only by passing "proofRequestId"  in the props like below.
// this.props.navigation.navigate(proofRequestRoute,{'proofRequestId':'CRM2M28')
const mapStateToProps = (store: Store, props) => {
  const { uid } = props.navigation.state.params

  const proofRequest = store.proofRequest[uid]
  const { senderLogoUrl: logoUrl, issuer: { name: issuerName }, data } =
    proofRequest || {}
  const isValid = proofRequest && data && data.revealedAttributes

  return {
    isValid,
    data,
    logoUrl,
    issuerName,
    uid,
  }
}

export default connect(mapStateToProps)(ProofRequest)

const styles = StyleSheet.create({
  headerStripLogoContainer: {
    height: 90,
    marginHorizontal: isiPhone5 ? OFFSET_5X / 2 : OFFSET_4X,
  },
  strip: {
    position: 'absolute',
    left: isiPhone5 ? OFFSET_3X : OFFSET_5X,
    right: isiPhone5 ? OFFSET_3X : OFFSET_5X,
    height: 30,
    backgroundColor: color.actions.secondary,
    zIndex: -1,
  },
  issuerLogo: {
    height: 70,
    zIndex: 1,
  },
  issuerLogoIcon: {
    borderRadius: 10,
    height: 70,
    width: 70,
  },
  logoHaloStyle: {
    width: 87,
    height: 87,
  },
  proofRequestData: {
    zIndex: 3,
  },
  attributeListLabel: {
    marginVertical: 2,
  },
  attributeListLabelText: {
    paddingVertical: 2,
  },
  attributeListValue: {
    marginBottom: OFFSET_1X,
  },
  headerCloseIconContainer: {
    position: 'absolute',
    top: OFFSET_3X,
    right: OFFSET_3X / 2,
    zIndex: 3,
  },
  avatarsContainer: {
    marginVertical: OFFSET_3X,
    marginHorizontal: OFFSET_1X,
  },
  checkMark: {
    width: 20,
    height: 20,
  },
  attributeItem: {
    paddingHorizontal: OFFSET_1X,
  },
  label: {
    marginLeft: OFFSET_1X / 2,
  },
})
