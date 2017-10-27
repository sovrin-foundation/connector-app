// @flow
import React, { PureComponent } from 'react'
import { InteractionManager, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { checkPinAction, checkPinStatusIdle } from './lock-store'
import { StackNavigator } from 'react-navigation'
import {
  Container,
  CustomText,
  CustomButton,
  PinCodeBox,
  CustomView,
} from '../components'
import { lockEnterPinRoute } from '../common'
import {
  color,
  OFFSET_1X,
  OFFSET_2X,
  OFFSET_3X,
  OFFSET_4X,
} from '../common/styles'
import { CHECK_PIN_IDLE, CHECK_PIN_SUCCESS, CHECK_PIN_FAIL } from './type-lock'
import type { Store } from '../store/type-store'
import type { LockEnterPinProps, LockEnterPinState } from './type-lock'
import { switchErrorAlerts } from '../store'
import LinearGradient from 'react-native-linear-gradient'

const styles = StyleSheet.create({
  //TODO : add animations when keyboard popups.
  text: {
    marginTop: OFFSET_4X,
    minHeight: OFFSET_3X,
    lineHeight: OFFSET_3X,
    marginBottom: OFFSET_4X,
  },
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
  linearGradient: {
    height: OFFSET_1X,
  },
})
export const WrongPinText = (
  <CustomText h4 bg="tertiary" tertiary center>
    Wrong pass code! Please try again
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

  static navigationOptions = ({ navigation }) => ({
    headerTitle: (
      <CustomText bg="tertiary" tertiary transparentBg semiBold>
        Enter Pass Code
      </CustomText>
    ),
    headerStyle: styles.header,
  })

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
        this.pinCodeBox && this.pinCodeBox.clear && this.pinCodeBox.clear()
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
      <Container tertiary>
        <LinearGradient
          style={[styles.linearGradient]}
          locations={[0.08, 1]}
          colors={['#EAEAEA', 'rgba(240,240,240,0)']}
        />
        <CustomView
          style={[styles.text]}
          onPress={this.props.switchErrorAlerts}
        >
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

export default StackNavigator({
  [lockEnterPinRoute]: {
    screen: connect(mapStateToProps, mapDispatchToProps)(LockEnterPin),
  },
})
