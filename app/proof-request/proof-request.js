// @flow
import React, { PureComponent } from 'react'
import { StyleSheet, Image, FlatList, Alert, TextInput } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view'
import debounce from 'lodash.debounce'
import Swiper from 'react-native-swiper'

import {
  Container,
  CustomView,
  CustomButton,
  CustomText,
  Avatar,
  Icon,
  ConnectionTheme,
  ClaimProofHeader,
  Separator,
  FooterActions,
  UserAvatar,
  headerStyles,
} from '../components'
import { homeRoute } from '../common/'
import {
  OFFSET_2X,
  OFFSET_1X,
  color,
  OFFSET_3X,
  OFFSET_4X,
  OFFSET_5X,
  OFFSET_9X,
  isiPhone5,
} from '../common/styles'
import type { Attribute } from '../push-notification/type-push-notification'
import type { Store } from '../store/type-store'
import type {
  ProofRequestProps,
  AdditionalProofDataPayload,
  ProofRequestAttributeListState,
  MissingAttributes,
  ProofRequestState,
  ProofRequestAttributeListProp,
  SelfAttestedAttributes,
} from './type-proof-request'
import ProofModal from './proof-modal'
import {
  rejectProofRequest,
  acceptProofRequest,
  ignoreProofRequest,
  proofRequestShown,
} from '../store'
import {
  getConnectionLogoUrl,
  getUserAvatarSource,
} from '../store/store-selector'
import { ERROR_CODE_MISSING_ATTRIBUTE } from '../proof/type-proof'
import type {
  GenericObject,
  CustomError,
  GenericStringObject,
} from '../common/type-common'
import {
  PRIMARY_ACTION_SEND,
  PRIMARY_ACTION_GENERATE_PROOF,
  SECONDARY_ACTION_IGNORE,
  MESSAGE_MISSING_ATTRIBUTES_DESCRIPTION,
  MESSAGE_MISSING_ATTRIBUTES_TITLE,
  MESSAGE_ERROR_PROOF_GENERATION_TITLE,
  MESSAGE_ERROR_PROOF_GENERATION_DESCRIPTION,
} from './type-proof-request'
import {
  userSelfAttestedAttributes,
  updateAttributeClaim,
  getProof,
} from '../proof/proof-store'
import type { ImageSource } from '../common/type-common'

export function generateStateForMissingAttributes(
  missingAttributes: MissingAttributes | {}
) {
  return Object.keys(missingAttributes).reduce(
    (acc, attributeName) => ({
      ...acc,
      [attributeName]: '',
    }),
    {}
  )
}

export function isInvalidValues(
  missingAttributes: MissingAttributes | {},
  userFilledValues: GenericObject
): boolean {
  return Object.keys(missingAttributes).some(attributeName => {
    const userFilledValue = userFilledValues[attributeName]

    if (!userFilledValue) {
      return true
    }

    const adjustedUserFilledValue = userFilledValue.trim()

    if (!adjustedUserFilledValue) {
      return true
    }

    return false
  })
}

class ProofRequestAttributeList extends PureComponent<
  ProofRequestAttributeListProp,
  ProofRequestAttributeListState
> {
  constructor(props: ProofRequestAttributeListProp) {
    super(props)
    this.canEnableGenerateProof = debounce(
      this.canEnableGenerateProof.bind(this),
      250
    )
  }

  componentWillReceiveProps(nextProps: ProofRequestAttributeListProp) {
    if (this.props.missingAttributes !== nextProps.missingAttributes) {
      // once we know that there are missing attributes
      // then we generate state variable for each of them
      // because we will show user some input boxes and need to capture values
      // that user fills in them, also we need to enable generate proof button
      // once all the missing attributes are filled in by user
      this.setState(
        generateStateForMissingAttributes(nextProps.missingAttributes)
      )
    }
  }

  // this form is needed to fix flow error
  // because methods of a class are by default covariant
  // so we need an invariance to tell method signature
  canEnableGenerateProof = function() {
    const isInvalid = isInvalidValues(this.props.missingAttributes, this.state)
    this.props.canEnablePrimaryAction(!isInvalid, this.state)
  }

  onTextChange = (e, name: string) => {
    const { text } = e.nativeEvent
    this.setState(
      {
        [name]: text,
      },
      this.canEnableGenerateProof
    )
  }

  onSwipe = (item: Attribute) => {
    this.props.updateSelectedClaims(item)
  }

  keyExtractor = ({ label }: Attribute, index: number) => `${label}${index}`

  renderItem = ({ item, index }) => {
    // convert item to array of item
    let items = item
    if (!Array.isArray(items)) {
      items = [items]
    }

    return (
      <Swiper
        showsButtons={false}
        showsPagination={false}
        height={69}
        onIndexChanged={swipeIndex => this.onSwipe(items[swipeIndex])}
      >
        {items.map((item, itemIndex) => {
          const adjustedLabel = item.label.toLocaleLowerCase()
          const testID = 'proof-request-attribute-item'
          const logoUrl = item.data
            ? item.claimUuid &&
              this.props.claimMap &&
              this.props.claimMap[item.claimUuid] &&
              this.props.claimMap[item.claimUuid].logoUrl
              ? { uri: this.props.claimMap[item.claimUuid].logoUrl }
              : this.props.userAvatarSource ||
                require('../images/UserAvatar.png')
            : null
          const showInputBox =
            adjustedLabel in this.props.missingAttributes && !item.data

          return (
            <Container key={itemIndex}>
              <Container
                fifth
                style={[styles.attributeItem]}
                testID={`${testID}-${index}`}
                accessible={true}
                accessibilityLabel={`${testID}-${index}`}
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
                    {showInputBox ? (
                      <TextInput
                        autoCorrect={false}
                        blurOnSubmit={true}
                        clearButtonMode="always"
                        numberOfLines={3}
                        name={adjustedLabel}
                        multiline={true}
                        maxLength={200}
                        maxHeight={50}
                        placeholder={`enter ${item.label}`}
                        returnKeyType="done"
                        testID={`${testID}-input-${adjustedLabel}`}
                        accessible={true}
                        accessibilityLabel={`${testID}-input-${adjustedLabel}`}
                        onChange={e => this.onTextChange(e, adjustedLabel)}
                        editable={!this.props.disableUserInputs}
                        underlineColorAndroid="transparent"
                      />
                    ) : (
                      <CustomText h6 demiBold bg="tertiary" transparentBg>
                        {item.data}
                      </CustomText>
                    )}
                  </CustomView>
                </Container>
                <Icon
                  center
                  medium
                  round
                  resizeMode="cover"
                  src={logoUrl}
                  testID={`proof-requester-logo-${index}`}
                  accessible={true}
                  accessibilityLabel={`proof-requester-logo-${index}`}
                />
              </Container>
            </Container>
          )
        })}
      </Swiper>
    )
  }

  render() {
    const attributes: Array<Attribute> = this.props.list

    return (
      <Container fifth style={[styles.proofRequestData]}>
        <KeyboardAwareFlatList
          data={attributes}
          keyExtractor={this.keyExtractor}
          ItemSeparatorComponent={Separator}
          ListFooterComponent={Separator}
          renderItem={this.renderItem}
          extraData={this.props}
          extraHeight={235}
          enableResetScrollToCoords={false}
        />
      </Container>
    )
  }
}

export function convertUserFilledValuesToSelfAttested(
  userFilledValues: GenericStringObject,
  missingAttributes: MissingAttributes | {}
): SelfAttestedAttributes {
  return Object.keys(missingAttributes).reduce((acc, name) => {
    return {
      ...acc,
      [name]: {
        name,
        data: userFilledValues[name],
        key: missingAttributes[name].key,
      },
    }
  }, {})
}

export function getPrimaryActionText(
  missingAttributes: MissingAttributes | {},
  generateProofClicked: boolean
) {
  if (generateProofClicked) {
    return PRIMARY_ACTION_SEND
  }

  return Object.keys(missingAttributes).length > 0
    ? PRIMARY_ACTION_GENERATE_PROOF
    : PRIMARY_ACTION_SEND
}

export const isPropEmpty = (prop: string) => (
  data: GenericObject | Array<Attribute>
) => {
  if (Array.isArray(data)) {
    return data.some(missingData)
  }
  return !data[prop]
}

export const missingData = isPropEmpty('data')

export function enablePrimaryAction(
  missingAttributes: MissingAttributes | {},
  generateProofClicked: boolean,
  allMissingAttributesFilled: boolean,
  error: ?CustomError,
  requestedAttributes: Attribute[]
) {
  // we need to decide on whether to enable Send/Generate-Proof button

  if (error) {
    return false
  }

  const missingCount = Object.keys(missingAttributes).length
  if (missingCount > 0) {
    if (allMissingAttributesFilled === false) {
      return false
    }

    if (generateProofClicked === false) {
      return true
    }
  }

  const isMissingData = requestedAttributes.some(missingData)
  if (isMissingData) {
    return false
  }

  return true
}

export function hasMissingAttributes(
  missingAttributes: MissingAttributes | {}
) {
  return Object.keys(missingAttributes).length > 0
}

export function getMissingAttributeNames(
  missingAttributes: MissingAttributes | {}
) {
  return Object.keys(missingAttributes).join(', ')
}

export class ProofRequest extends PureComponent<
  ProofRequestProps,
  ProofRequestState
> {
  state = {
    allMissingAttributesFilled: false,
    generateProofClicked: false,
    selfAttestedAttributes: {},
    disableUserInputs: false,
    selectedClaims: {},
    disableSendButton: false,
  }

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
    if (
      this.state.generateProofClicked ||
      !hasMissingAttributes(this.props.missingAttributes)
    ) {
      // if we don't find any missing attributes then
      // user will never see generate proof button and we don't need to wait for
      // generate proof button to be clicked after all attributes are filled
      // this.props.getProof(this.props.uid)
      this.setState({
        disableSendButton: true,
      })
      this.props.updateAttributeClaim(this.state.selectedClaims)
    } else {
      // we need to change the text to send once we know that generate proof is clicked
      // also, we need to disable user inputs once user has submitted those fields
      // because user can't change them now
      this.setState({
        generateProofClicked: true,
        disableUserInputs: true,
        disableSendButton: false,
      })
      this.props.userSelfAttestedAttributes(
        convertUserFilledValuesToSelfAttested(
          this.state.selfAttestedAttributes,
          this.props.missingAttributes
        ),
        this.props.uid
      )
    }
  }

  canEnablePrimaryAction = (
    canEnable: boolean,
    selfAttestedAttributes: GenericStringObject
  ) => {
    this.setState({
      allMissingAttributesFilled: canEnable,
      selfAttestedAttributes,
    })
  }

  componentDidMount() {
    this.props.proofRequestShown(this.props.uid)
    this.props.getProof(this.props.uid)
  }

  componentWillReceiveProps(nextProps: ProofRequestProps) {
    if (
      this.props.missingAttributes !== nextProps.missingAttributes &&
      hasMissingAttributes(nextProps.missingAttributes)
    ) {
      Alert.alert(
        MESSAGE_MISSING_ATTRIBUTES_TITLE,
        MESSAGE_MISSING_ATTRIBUTES_DESCRIPTION(
          getMissingAttributeNames(nextProps.missingAttributes)
        )
      )
    }

    if (
      this.props.proofGenerationError !== nextProps.proofGenerationError &&
      nextProps.proofGenerationError
    ) {
      Alert.alert(
        MESSAGE_ERROR_PROOF_GENERATION_TITLE,
        MESSAGE_ERROR_PROOF_GENERATION_DESCRIPTION
      )
    }

    if (
      this.props.data &&
      this.props.data.requestedAttributes !== nextProps.data.requestedAttributes
    ) {
      const selectedClaims = nextProps.data.requestedAttributes.reduce(
        (acc, item) => {
          const items = { ...acc }
          if (item[0].claimUuid) {
            items[`${item[0].key}`] = [item[0].claimUuid, true]
          }
          return items
        },
        {}
      )
      this.setState({ selectedClaims })
    }
  }

  updateSelectedClaims = (item: Attribute) => {
    if (this.state.selectedClaims && item && item.key) {
      const selectedClaims = {
        ...this.state.selectedClaims,
        [`${item.key}`]: [item.claimUuid, true],
      }
      this.setState({ selectedClaims })
    }
  }

  renderAvatarWithSource = (avatarSource: number | ImageSource) => (
    <Icon
      center
      halo
      extraLarge
      resizeMode="cover"
      src={avatarSource}
      style={[styles.verifierLogo]}
      iconStyle={[styles.verifierLogoIcon]}
      haloStyle={styles.logoHaloStyle}
      testID="proof-request-verifier-logo"
      accessible={true}
      accessibilityLabel="proof-request-verifier-logo"
    />
  )

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
      missingAttributes,
      proofGenerationError,
    } = this.props
    const testID = 'proof-request'
    const { name: title, requestedAttributes } = data
    const logoUri = logoUrl
      ? { uri: logoUrl }
      : require('../images/cb_evernym.png')

    const primaryActionText = getPrimaryActionText(
      missingAttributes,
      this.state.generateProofClicked
    )
    const enablePrimaryActionStatus = enablePrimaryAction(
      missingAttributes,
      this.state.generateProofClicked,
      this.state.allMissingAttributesFilled,
      proofGenerationError,
      requestedAttributes
    )

    if (!isValid) {
      return (
        <Container>
          <Container fifth center>
            <CustomText h5 bg="fifth">
              Invalid proof request. Please ignore.
            </CustomText>
          </Container>
          <FooterActions
            onDecline={this.onReject}
            denyTitle="Ignore"
            testID={testID}
            accessible={true}
            accessibilityLabel={testID}
          />
        </Container>
      )
    }

    return (
      <Container fifth>
        <ClaimProofHeader
          message={`${name} would like you to share:`}
          title={title}
          onClose={this.onIgnore}
          logoUrl={logoUrl}
          testID={testID}
          accessible={true}
          accessibilityLabel={testID}
        >
          <Icon
            absolute="TopRight"
            src={require('../images/close.png')}
            small
            testID={`${testID}-icon-close`}
            accessible={true}
            accessibilityLabel={`${testID}-icon-close`}
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
              accessible={true}
              accessibilityLabel={`${testID}-text-avatars-container`}
            >
              <UserAvatar>{this.renderAvatarWithSource}</UserAvatar>
              <Image
                style={[styles.checkMark]}
                source={require('../images/icon_rightArrow.png')}
                testID={`${testID}-check-mark`}
                accessible={true}
                accessibilityLabel={`${testID}-check-mark`}
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
                accessible={true}
                accessibilityLabel={`${testID}-verifier-logo`}
              />
            </CustomView>
          </CustomView>
        </ClaimProofHeader>

        <ProofRequestAttributeList
          list={requestedAttributes}
          claimMap={claimMap}
          missingAttributes={missingAttributes}
          canEnablePrimaryAction={this.canEnablePrimaryAction}
          disableUserInputs={this.state.disableUserInputs}
          userAvatarSource={this.props.userAvatarSource}
          updateSelectedClaims={this.updateSelectedClaims}
        />
        <FooterActions
          logoUrl={logoUrl}
          onAccept={this.onSend}
          onDecline={this.onReject}
          denyTitle="Ignore"
          acceptTitle={primaryActionText}
          disableAccept={
            !enablePrimaryActionStatus || this.state.disableSendButton
          }
          testID={testID}
          accessible={true}
          accessibilityLabel={testID}
        />
        <ProofModal
          proofStatus={proofStatus}
          title={title}
          name={name}
          onContinue={this.close}
          logoUrl={logoUrl}
        />
      </Container>
    )
  }
}

// we need to navigate to this screen only by passing "proofRequestId"  in the props like below.
// this.props.navigation.navigate(proofRequestRoute,{'proofRequestId': 'CRM2M28')
const mapStateToProps = (state: Store, props) => {
  const { proofRequest } = state
  const { uid } = props.navigation.state.params
  const proofRequestData = proofRequest[uid] || {}
  const {
    data,
    requester = {},
    proofStatus,
    remotePairwiseDID,
    missingAttributes = {},
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
    missingAttributes,
    userAvatarSource: getUserAvatarSource(state.user.avatarName),
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      proofRequestShown,
      acceptProofRequest,
      ignoreProofRequest,
      rejectProofRequest,
      updateAttributeClaim,
      getProof,
      userSelfAttestedAttributes,
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
    zIndex: 1,
  },
  verifierLogoIcon: {
    borderRadius: 35,
  },
  logoHaloStyle: {
    width: 87,
    height: 87,
  },
  proofRequestData: {
    zIndex: -1,
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
    height: OFFSET_9X,
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
