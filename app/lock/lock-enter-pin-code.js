// @flow
import React, { PureComponent } from 'react'
import { InteractionManager, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { checkPinAction, checkPinStatusIdle } from './lock-store'
import {
  Container,
  CustomText,
  CustomButton,
  PinCodeBox,
  CustomView,
} from '../components'
import { CHECK_PIN_IDLE, CHECK_PIN_SUCCESS, CHECK_PIN_FAIL } from './type-lock'
import type { Store } from '../store/type-store'
import type { LockEnterPinProps, LockEnterPinState } from './type-lock'
import { switchErrorAlerts } from '../store'

export const TitleText = (
  <CustomText h4 center bold>
    Enter pin code to unlock app
  </CustomText>
)
export const WrongPinText = (
  <CustomText h4 center>
    Wrong pin! Please try again
  </CustomText>
)

export class LockEnterPin extends PureComponent<
  void,
  LockEnterPinProps,
  LockEnterPinState
> {
  state = {
    interactionsDone: false,
  }

  pinCodeBox = null

  onPinComplete = (pin: string) => {
    // user entered 6 digits in pin box
    this.props.checkPinAction(pin)
  }

  clearFailStatus = () => {
    this.props.checkPinStatusIdle()
  }

  clearFailStatusDelayed = () => {
    setTimeout(this.clearFailStatus, 1000)
  }

  componentWillReceiveProps(nextProps: LockEnterPinProps) {
    if (this.props.checkPinStatus !== nextProps.checkPinStatus) {
      if (nextProps.checkPinStatus === CHECK_PIN_SUCCESS) {
        if (this.props.pendingRedirection) {
          this.props.navigation.navigate(this.props.pendingRedirection)
        }
      } else if (nextProps.checkPinStatus === CHECK_PIN_FAIL) {
        this.pinCodeBox && this.pinCodeBox.clear()
        // set status back to idle so we can come to this else again
        this.clearFailStatusDelayed()
      }
    }
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({ interactionsDone: true })
    })
  }

  render() {
    const { checkPinStatus } = this.props
    return (
      <Container primary>
        <CustomView
          style={[styles.text]}
          onPress={this.props.switchErrorAlerts}
        >
          {TitleText}
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
  pendingRedirection: state.lock.pendingRedirection,
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

export default connect(mapStateToProps, mapDispatchToProps)(LockEnterPin)

const styles = StyleSheet.create({
  text: {
    marginTop: 120,
    marginBottom: 70,
  },
})
