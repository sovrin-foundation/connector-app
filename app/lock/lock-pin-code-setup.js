// @flow
import React, { PureComponent } from 'react'
import {
  StyleSheet,
  Image,
  TouchableHighlight,
  InteractionManager,
} from 'react-native'
import { StackNavigator } from 'react-navigation'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  Container,
  CustomText,
  CustomButton,
  CustomView,
  PinCodeBox,
} from '../components'
import {
  lockSelectionRoute,
  lockPinSetupHomeRoute,
  lockSetupSuccessRoute,
  settingsTabRoute,
  lockEnterPinRoute,
} from '../common'
import {
  color,
  OFFSET_1X,
  OFFSET_2X,
  OFFSET_6X,
  OFFSET_7X,
} from '../common/styles'
import { setPinAction, enableTouchIdAction } from './lock-store'
import type { LockPinSetupState } from './type-lock'
import { PIN_SETUP_STATE } from './type-lock'
import LinearGradient from 'react-native-linear-gradient'

const styles = StyleSheet.create({
  header: {
    backgroundColor: color.bg.tertiary.color,
    borderBottomWidth: 0,
    height: 64,
    padding: 0,
    paddingHorizontal: OFFSET_2X,
    shadowColor: 'transparent',
    shadowOpacity: 0,
    shadowOffset: {
      height: 0,
    },
    shadowRadius: 0,
  },
  headerLeft: {
    width: OFFSET_2X,
  },
  title: {
    marginTop: OFFSET_6X,
    marginBottom: OFFSET_7X,
  },
  titleText: {
    lineHeight: 28,
    letterSpacing: 0.5,
    paddingHorizontal: OFFSET_1X,
  },
  linearGradient: {
    height: OFFSET_1X,
  },
})

const ReEnterPinFailText = (
  <CustomText style={[styles.titleText]} center h4 bg="tertiary" tertiary thick>
    Your pass codes do not match, please start over.
  </CustomText>
)

export class LockPinSetup extends PureComponent {
  state: LockPinSetupState = {
    pinSetupState: PIN_SETUP_STATE.INITIAL,
    interactionsDone: false,
    enteredPin: null,
  }

  pinCodeBox = null

  static navigationOptions = ({ navigation }) => ({
    headerLeft: (
      <CustomView>
        <TouchableHighlight
          testID={'back-button'}
          onPress={() =>
            navigation.state.params &&
            navigation.state.params.existingPin === true
              ? navigation.navigate(settingsTabRoute)
              : navigation.navigate(lockSelectionRoute)}
        >
          <Image
            testID={'back-arrow'}
            style={styles.headerLeft}
            source={require('../images/icon_backArrow.png')}
            resizeMode="contain"
            onPress={() =>
              navigation.state.params &&
              navigation.state.params.existingPin === true
                ? navigation.navigate(settingsTabRoute)
                : navigation.navigate(lockSelectionRoute)}
          />
        </TouchableHighlight>
      </CustomView>
    ),
    headerTitle: (
      <CustomText bg="tertiary" tertiary transparentBg semiBold>
        App Security
      </CustomText>
    ),
    headerStyle: styles.header,
  })

  setPinSetupStateToInitial = () => {
    this.setState({ pinSetupState: PIN_SETUP_STATE.INITIAL })
  }

  setPinSetupStateToInitialDelayed = () => {
    setTimeout(this.setPinSetupStateToInitial, 1000)
  }

  onPinSetup = (pin: string) => {
    this.props.setPinAction(pin)
    this.props.navigation.state.params &&
    this.props.navigation.state.params.existingPin === true
      ? this.props.navigation.navigate(lockSetupSuccessRoute, {
          changePin: true,
        })
      : this.props.navigation.navigate(lockSetupSuccessRoute)
  }

  onTouchIdSetup = () => {
    this.props.enableTouchIdAction()
  }

  onPinReEnterFail = () => {
    this.setState({
      pinSetupState: PIN_SETUP_STATE.REENTER_FAIL,
      enteredPin: null,
    })
    this.pinCodeBox && this.pinCodeBox.clear()
    this.setPinSetupStateToInitialDelayed()
  }

  onPinReEnterSuccess = (pin: string) => {
    this.setState({
      pinSetupState: PIN_SETUP_STATE.REENTER_SUCCESS,
    })
    this.onPinSetup(pin)
  }

  onFirstPinEnter = (enteredPin: string) => {
    this.setState({
      pinSetupState: PIN_SETUP_STATE.REENTER,
      enteredPin,
    })
    this.pinCodeBox && this.pinCodeBox.clear()
  }

  onPinComplete = (pin: string) => {
    if (this.state.enteredPin) {
      // if we found a entered pin, that means user is re-entering pin
      if (this.state.enteredPin === pin) {
        this.onPinReEnterSuccess(pin)
      } else {
        this.onPinReEnterFail()
      }
    } else {
      // this is the first time user has entered pin
      this.onFirstPinEnter(pin)
    }
  }

  componentDidMount() {
    if (
      this.props.navigation.state.params &&
      this.props.navigation.state.params.touchIDActive === true
    ) {
      this.onTouchIdSetup()
    }

    InteractionManager.runAfterInteractions(() => {
      this.setState({ interactionsDone: true })
    })
  }

  render() {
    const { pinSetupState, interactionsDone } = this.state

    const passCodeSetupText =
      this.props.navigation.state &&
      this.props.navigation.state.params &&
      this.props.navigation.state.params.touchIDActive === true
        ? 'Set up a pass code in case TouchID/FaceID fails'
        : 'Set up a pass code'
    const EnterPinText = (
      <CustomText
        style={[styles.titleText]}
        center
        h4
        bg="tertiary"
        tertiary
        thick
      >
        {this.props.navigation.state &&
        this.props.navigation.state.params &&
        this.props.navigation.state.params.existingPin === true
          ? 'Set up a new pass code'
          : passCodeSetupText}
      </CustomText>
    )
    const ReEnterPinText = (
      <CustomText
        style={[styles.titleText]}
        center
        h4
        bg="tertiary"
        tertiary
        thick
      >
        {this.props.navigation.state.params &&
        this.props.navigation.state.params.existingPin === true
          ? 'Re-enter new pass code'
          : 'Re-enter pass code'}
      </CustomText>
    )
    return (
      <Container tertiary>
        <LinearGradient
          style={[styles.linearGradient]}
          locations={[0.08, 1]}
          colors={['#EAEAEA', 'rgba(240,240,240,0)']}
        />
        <CustomView style={[styles.title]}>
          {pinSetupState === PIN_SETUP_STATE.INITIAL && EnterPinText}
          {pinSetupState === PIN_SETUP_STATE.REENTER && ReEnterPinText}
          {pinSetupState === PIN_SETUP_STATE.REENTER_FAIL && ReEnterPinFailText}
        </CustomView>
        <CustomView center>
          {interactionsDone && (
            <PinCodeBox
              ref={pinCodeBox => {
                this.pinCodeBox = pinCodeBox
              }}
              onPinComplete={this.onPinComplete}
            />
          )}
        </CustomView>
      </Container>
    )
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      setPinAction,
      enableTouchIdAction,
    },
    dispatch
  )

export default StackNavigator({
  [lockPinSetupHomeRoute]: {
    screen: connect(null, mapDispatchToProps)(LockPinSetup),
  },
})
