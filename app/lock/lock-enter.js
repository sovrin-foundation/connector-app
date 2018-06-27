// @flow
import React, { PureComponent } from 'react'
import {
  InteractionManager,
  StyleSheet,
  Platform,
  Dimensions,
  Image,
} from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import {
  Container,
  CustomText,
  PinCodeBox,
  CustomView,
  Icon,
} from '../components'
import {
  color,
  OFFSET_1X,
  OFFSET_2X,
  OFFSET_3X,
  OFFSET_4X,
} from '../common/styles'
import { CHECK_PIN_IDLE, CHECK_PIN_SUCCESS, CHECK_PIN_FAIL } from './type-lock'
import type {
  LockEnterPinProps,
  LockEnterState,
  CheckPinStatus,
  LockEnterProps,
} from './type-lock'
import { checkPinAction, checkPinStatusIdle } from './lock-store'
import { switchErrorAlerts } from '../store/config-store'
import type { Store } from '../store/type-store'
import { ENTER_YOUR_PASS_CODE_MESSAGE } from '../common/message-constants'
import {
  whiteSmokeRGBA,
  whisper,
  SHORT_DEVICE,
  grey,
  matterhornSecondary,
} from '../common/styles/constant'

const lockImage = require('../images/lockCombo.png')
const backgroundImg = require('../images/wave1.png')

const { height } = Dimensions.get('window')

const styles = StyleSheet.create({
  //TODO : add animations when keyboard popups.
  text: {
    marginTop: OFFSET_4X,
    minHeight: OFFSET_3X,
    marginBottom: OFFSET_4X,
  },
  titleText: {
    lineHeight: 28,
    letterSpacing: 0.5,
  },
})

export const WrongPinText = (
  <CustomText h4 bg="tertiary" tertiary center>
    Wrong pass code! Please try again
  </CustomText>
)

export class LockEnter extends PureComponent<LockEnterProps, LockEnterState> {
  state = {
    interactionsDone: false,
  }

  pinCodeBox = null

  clearFailStatus = () => {
    this.props.checkPinStatusIdle()
  }

  clearFailStatusDelayed = () => {
    setTimeout(this.clearFailStatus, 1000)
  }

  onPinComplete = (pin: string) => {
    this.props.checkPinAction(pin)
  }

  componentWillReceiveProps(nextProps: LockEnterProps) {
    if (this.props.checkPinStatus !== nextProps.checkPinStatus) {
      if (nextProps.checkPinStatus === CHECK_PIN_SUCCESS) {
        this.pinCodeBox && this.pinCodeBox.hideKeyboard()
        this.props.onSuccess()
      } else if (nextProps.checkPinStatus === CHECK_PIN_FAIL) {
        this.pinCodeBox && this.pinCodeBox.clear && this.pinCodeBox.clear()
        // set status back to idle so we can come to this else again
        this.clearFailStatusDelayed()
      }
    }
  }

  componentDidMount() {
    if (this.props.checkPinStatus === CHECK_PIN_SUCCESS) {
      this.clearFailStatus()
    }

    InteractionManager.runAfterInteractions(() => {
      this.setState({ interactionsDone: true })
    })
  }

  render() {
    const {
      checkPinStatus,
      message = ENTER_YOUR_PASS_CODE_MESSAGE,
    } = this.props

    const EnterPinText = (
      <CustomText
        style={[styles.titleText]}
        center
        h4
        bg="tertiary"
        tertiary
        thick
        testID="pass-code-input-text"
      >
        {message}
      </CustomText>
    )

    return (
      <Container>
        {this.props.fromRecovery ? (
          <Container safeArea fifth>
            <Image
              source={backgroundImg}
              style={[stylesRecovery.backgroundImg]}
            />
            <CustomView
              center
              transparentBg
              style={[stylesRecovery.topLockIcon]}
            >
              <CustomView style={[stylesRecovery.blackStrip]} />
              <CustomView style={[stylesRecovery.lockIconWrapper]}>
                <Icon extraLarge halo src={lockImage} />
              </CustomView>
            </CustomView>
            <CustomView center verticalSpace>
              <CustomText
                center
                transparentBg
                style={[stylesRecovery.lockHeading]}
                heavy
                charcoal
              >
                Please Enter Your Current Connect.Me Pass Code!
              </CustomText>
            </CustomView>
            <CustomView center>
              {this.state.interactionsDone && (
                <PinCodeBox
                  ref={pinCodeBox => {
                    this.pinCodeBox = pinCodeBox
                  }}
                  onPinComplete={this.onPinComplete}
                />
              )}
            </CustomView>
            <CustomView center doubleVerticalSpace>
              <CustomText
                transparentBg
                center
                h6
                heavy
                secondaryColor
                style={[stylesRecovery.newPasscodeText]}
                onPress={this.props.setupNewPassCode}
                testID={'set-up-new-passcode-recovery'}
              >
                Or setup new Pass Code
              </CustomText>
            </CustomView>
          </Container>
        ) : (
          <Container tertiary>
            <CustomView
              style={[styles.text]}
              center
              onPress={this.props.switchErrorAlerts}
              testID="pin-code-input-boxes"
            >
              {checkPinStatus === CHECK_PIN_IDLE && EnterPinText}
              {checkPinStatus === CHECK_PIN_SUCCESS && EnterPinText}
              {checkPinStatus === CHECK_PIN_FAIL && WrongPinText}
            </CustomView>
            <CustomView center>
              {this.state.interactionsDone && (
                <PinCodeBox
                  ref={pinCodeBox => {
                    this.pinCodeBox = pinCodeBox
                  }}
                  onPinComplete={this.onPinComplete}
                />
              )}
            </CustomView>
          </Container>
        )}
      </Container>
    )
  }
}

const stylesRecovery = StyleSheet.create({
  backgroundImg: {
    position: 'absolute',
    transform: [{ rotate: '-180deg' }],
    marginTop: '-92%',
    width: '100%',
  },
  topLockIcon: {
    ...Platform.select({
      ios: {
        marginTop: height > SHORT_DEVICE ? '18%' : '12%',
      },
      android: {
        marginTop: height > SHORT_DEVICE ? '12%' : '8%',
      },
    }),
  },
  blackStrip: {
    position: 'absolute',
    height: 8,
    backgroundColor: matterhornSecondary,
    width: '100%',
  },
  lockIconWrapper: {
    backgroundColor: matterhornSecondary,
    borderRadius: 50,
  },
  lockHeading: {
    fontSize: height > SHORT_DEVICE ? 23 : 16,
    width: '80%',
    ...Platform.select({
      ios: {
        marginTop: height > SHORT_DEVICE ? '8%' : '2%',
      },
      android: {
        marginTop: height > SHORT_DEVICE ? '2%' : 0,
      },
    }),
  },
  newPasscodeText: {
    ...Platform.select({
      ios: {
        marginTop: height > SHORT_DEVICE ? '6.1%' : '2%',
      },
      android: {
        marginTop: height > SHORT_DEVICE ? '2%' : 0,
      },
    }),
  },
})

const mapStateToProps = (state: Store) => ({
  checkPinStatus: state.lock.checkPinStatus,
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      checkPinAction,
      checkPinStatusIdle,
      switchErrorAlerts,
    },
    dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(LockEnter)
