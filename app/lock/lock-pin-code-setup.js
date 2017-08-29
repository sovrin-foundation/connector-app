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
} from '../common'
import { color, OFFSET_2X } from '../common/styles'
import { setPinAction } from './lock-store'
import type { LockPinSetupState } from './type-lock'
import { PIN_SETUP_STATE } from './type-lock'

const styles = StyleSheet.create({
  header: {
    backgroundColor: color.bg.sixth.color,
    borderBottomWidth: 0,
    height: 70,
    padding: 0,
    paddingHorizontal: OFFSET_2X,
    shadowOpacity: 0,
  },
  headerLeft: {
    width: 20,
  },
  title: {
    marginTop: 50,
    marginBottom: 70,
  },
})

const EnterPinText = <CustomText center h4 bold>Setup a pin code</CustomText>
const ReEnterPinText = <CustomText center h4 bold>Re-enter pin code</CustomText>
const ReEnterPinFailText = (
  <CustomText center h4 bold>
    Your pin codes do not match. Please start over.
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
          onPress={() => navigation.navigate(lockSelectionRoute)}
        >
          <Image
            testID={'back-arrow'}
            style={styles.headerLeft}
            source={require('../images/icon_backArrow.png')}
            resizeMode="contain"
            onPress={() => navigation.navigate(lockSelectionRoute)}
          />
        </TouchableHighlight>
      </CustomView>
    ),
    headerTitle: <CustomText semiBold>App Security</CustomText>,
    headerRight: (
      <Image
        testID={'education-icon'}
        style={styles.headerLeft}
        source={require('../images/education.png')}
        resizeMode="contain"
      />
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
    this.props.navigation.navigate(lockSetupSuccessRoute)
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
    InteractionManager.runAfterInteractions(() => {
      this.setState({ interactionsDone: true })
    })
  }

  render() {
    const { pinSetupState, interactionsDone } = this.state
    return (
      <Container senary>
        <CustomView style={[styles.title]}>
          {pinSetupState === PIN_SETUP_STATE.INITIAL && EnterPinText}
          {pinSetupState === PIN_SETUP_STATE.REENTER && ReEnterPinText}
          {pinSetupState === PIN_SETUP_STATE.REENTER_FAIL && ReEnterPinFailText}
        </CustomView>
        <CustomView center>
          {interactionsDone &&
            <PinCodeBox
              ref={pinCodeBox => {
                this.pinCodeBox = pinCodeBox
              }}
              onPinComplete={this.onPinComplete}
            />}
        </CustomView>
      </Container>
    )
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      setPinAction,
    },
    dispatch
  )

export default StackNavigator({
  [lockPinSetupHomeRoute]: {
    screen: connect(null, mapDispatchToProps)(LockPinSetup),
  },
})
