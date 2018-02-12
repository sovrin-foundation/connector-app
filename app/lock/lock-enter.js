// @flow
import React, { PureComponent } from 'react'
import { InteractionManager, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import LinearGradient from 'react-native-linear-gradient'

import {
  Container,
  CustomText,
  CustomButton,
  PinCodeBox,
  CustomView,
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
import { whiteSmokeRGBA, whisper } from '../common/styles/constant'

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
  linearGradient: {
    height: OFFSET_1X,
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
    // user entered 6 digits in pin box
    this.props.checkPinAction(pin)
  }

  componentWillReceiveProps(nextProps: LockEnterProps) {
    if (this.props.checkPinStatus !== nextProps.checkPinStatus) {
      if (nextProps.checkPinStatus === CHECK_PIN_SUCCESS) {
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
      <Container tertiary>
        <LinearGradient
          style={[styles.linearGradient]}
          locations={[0.08, 1]}
          colors={[whisper, whiteSmokeRGBA]}
        />
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
    )
  }
}

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
