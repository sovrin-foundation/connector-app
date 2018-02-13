// @flow
import React, { PureComponent } from 'react'
import {
  StyleSheet,
  Platform,
  Image,
  FlatList,
  View,
  Alert,
} from 'react-native'
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
import type { Attribute } from '../push-notification/type-push-notification'
import type { ProofRequestAttributeListProp } from './type-proof-request'
import type { Store } from '../store/type-store'
import type {
  ProofRequestProps,
  AdditionalProofDataPayload,
} from './type-proof-request'
import ProofModal from './proof-modal'
import {
  rejectProofRequest,
  acceptProofRequest,
  ignoreProofRequest,
  proofRequestShown,
  getProof,
} from '../store'
import { getConnectionLogoUrl } from '../store/store-selector'
import { ERROR_CODE_MISSING_ATTRIBUTE } from '../proof/type-proof'

class ProofRequestAttributeList extends PureComponent<
  ProofRequestAttributeListProp,
  void
> {
  renderItem = ({ item, index }) => {
    const logoUrl = item.data
      ? item.claimUuid &&
        this.props.claimMap &&
        this.props.claimMap[item.claimUuid] &&
        this.props.claimMap[item.claimUuid].logoUrl
        ? { uri: this.props.claimMap[item.claimUuid].logoUrl }
        : require('../images/cb_evernym.png')
      : null

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
              {item.data}
            </CustomText>
          </CustomView>
        </Container>
        <Icon
          center
          medium
          round
          resizeMode="cover"
          src={logoUrl}
          testID={`proof-requester-logo-${index}`}
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
          ListFooterComponent={Separator}
          renderItem={this.renderItem}
        />
      </Container>
    )
  }
}

export class ProofRequest extends PureComponent<ProofRequestProps, void> {
  close = () => {
    this.props.navigation.goBack()
  }

  onIgnore = () => {
    this.props.ignoreProofRequest(this.props.uid)
    this.close()
  }

  onReject = () => {
    this.props.rejectProofRequest(this.props.uid)
    this.close()
  }

  onSend = () => {
    this.props.acceptProofRequest(this.props.uid)
  }

  componentWillReceiveProps(nextProps: ProofRequestProps) {
    if (nextProps.proofGenerationError !== this.props.proofGenerationError) {
      if (
        nextProps.proofGenerationError &&
        nextProps.proofGenerationError.code === ERROR_CODE_MISSING_ATTRIBUTE
      ) {
        Alert.alert(
          'Missing information',
          nextProps.proofGenerationError.message
        )
      }
    }
  }

  componentDidMount() {
    this.props.proofRequestShown(this.props.uid)
    this.props.getProof(this.props.uid)
  }

  render() {
    const {
      data,
      name,
      uid,
      isValid,
      proofStatus,
      remotePairwiseDID,
      logoUrl,
      claimMap,
    } = this.props
    const testID = 'proof-request'
    const { name: title } = data
    const logoUri = logoUrl
      ? { uri: logoUrl }
      : require('../images/cb_evernym.png')

    return (
      <Container fifth>
        {isValid && (
          <ClaimProofHeader
            message={`${name} would like you to prove:`}
            title={title}
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
                  src={require('../images/UserAvatar.png')}
                  style={[styles.verifierLogo]}
                  iconStyle={[styles.verifierLogoIcon]}
                  haloStyle={styles.logoHaloStyle}
                  testID={`${testID}-verifier-logo`}
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
                  style={[styles.verifierLogo]}
                  iconStyle={[styles.verifierLogoIcon]}
                  testID={`${testID}-verifier-logo`}
                />
              </CustomView>
            </CustomView>
          </ClaimProofHeader>
        )}
        {isValid ? (
          <ProofRequestAttributeList
            list={data.requestedAttributes}
            claimMap={claimMap}
          />
        ) : (
          <Container fifth center>
            <CustomText h5 bg="fifth">
              Invalid proof request. Please ignore.
            </CustomText>
          </Container>
        )}
        <FooterActions
          logoUrl={logoUrl}
          onAccept={this.onSend}
          onDecline={this.onReject}
          denyTitle="Ignore"
          acceptTitle="Send"
          testID={testID}
        />
        {isValid && (
          <ProofModal
            proofStatus={proofStatus}
            title={title}
            name={name}
            onContinue={this.close}
            logoUrl={logoUrl}
          />
        )}
      </Container>
    )
  }
}

// we need to navigate to this screen only by passing "proofRequestId"  in the props like below.
// this.props.navigation.navigate(proofRequestRoute,{'proofRequestId':'CRM2M28')
const mapStateToProps = (state: Store, props) => {
  const { proofRequest } = state
  const { uid } = props.navigation.state.params
  const proofRequestData = proofRequest[uid] || {}
  const {
    data,
    requester = {},
    proofStatus,
    status,
    remotePairwiseDID,
  } = proofRequestData
  const { name } = requester
  const isValid = proofRequestData && data && data.requestedAttributes
  const proofGenerationError = state.proof[uid] ? state.proof[uid].error : null

  return {
    isValid,
    data,
    logoUrl: getConnectionLogoUrl(state, remotePairwiseDID),
    name,
    uid,
    proofStatus,
    proofGenerationError,
    claimMap: state.claim.claimMap,
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      proofRequestShown,
      acceptProofRequest,
      ignoreProofRequest,
      rejectProofRequest,
      getProof,
    },
    dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(ProofRequest)

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
  verifierLogo: {
    height: 70,
    zIndex: 1,
  },
  verifierLogoIcon: {
    borderRadius: 35,
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
