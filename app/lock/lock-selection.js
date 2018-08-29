// @flow
import React, { PureComponent } from 'react'
import {
  Image,
  View,
  StyleSheet,
  TouchableHighlight,
  Alert,
  Keyboard,
} from 'react-native'
import { connect } from 'react-redux'
import { select } from 'redux-saga/effects'
import { bindActionCreators } from 'redux'
import type { Store } from '../store/type-store'
import { Container, CustomText, CustomView } from '../components'
import {
  lockPinSetupRoute,
  lockTouchIdSetupRoute,
  switchEnvironmentRoute,
} from '../common/'
import type { LockSelectionProps } from './type-lock'
import {
  OFFSET_1X,
  OFFSET_2X,
  OFFSET_3X,
  OFFSET_5X,
  OFFSET_6X,
  OFFSET_7X,
  color,
  isiPhone5,
  PIN_CODE_BORDER_BOTTOM,
} from '../common/styles/constant'
import { switchErrorAlerts } from '../store/config-store'
import { disableDevMode, longPressedInLockSelectionScreen, pressedOnOrInLockSelectionScreen } from './lock-store'
import { safeToDownloadSmsInvitation } from '../sms-pending-invitation/sms-pending-invitation-store'

export class LockSelection extends PureComponent<LockSelectionProps, void> {
  constructor(props: LockSelectionProps) {
    super(props)
    Keyboard.dismiss()
  }

  goTouchIdSetup = () => {
    this.props.navigation.navigate(lockTouchIdSetupRoute)
    this.props.safeToDownloadSmsInvitation()
  }

  goPinCodeSetup = () => {
    this.props.navigation.navigate(lockPinSetupRoute)
    this.props.safeToDownloadSmsInvitation()
  }

  _onLongPressButton = () => {
    this.props.longPressedInLockSelectionScreen()
  }

  _onTextPressButton = () => {
    this.props.pressedOnOrInLockSelectionScreen()
  }

  componentWillReceiveProps(nextProps: LockSelectionProps) {
    if (nextProps.showDevMode) {
      Alert.alert(
        'Developer Mode',
        'you are enabling developer mode and it will delete all existing data. Are you sure?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => nextProps.disableDevMode(),
          },
          {
            text: 'OK',
            onPress: () =>
              nextProps.navigation.navigate(switchEnvironmentRoute),
          },
        ]
      )
    }
  }

  render() {
    return (
      <Container tertiary style={[style.pinSelectionContainer]}>
        <CustomView
          onPress={this.props.switchErrorAlerts}
          onLongPress={this._onLongPressButton}
        >
          <CustomText h5 bg="tertiary" tertiary semiBold center>
            Choose How To Unlock App
          </CustomText>
        </CustomView>
        <CustomView style={[style.messageText]}>
          <CustomText h5 bg="tertiary" tertiary bold center>
            This application must be protected by TouchID or a pin code at all
            times.
          </CustomText>
        </CustomView>
        <Container spaceAround>
          <CustomView
            center
            fifth
            shadow
            testID="touch-id-selection"
            style={[style.touchIdPinContainer]}
            onPress={this.goTouchIdSetup}
            onLongPress={this._onLongPressButton}
          >
            <Image
              style={style.fingerPrintIcon}
              source={require('../images/icon_fingerPrint.png')}
            />
            <CustomText
              h5
              semiBold
              center
              tertiary
              transparentBg
              testID="use-touch-id-text"
              onPress={this.goTouchIdSetup}
              onLongPress={this._onLongPressButton}
            >
              Use Touch ID
            </CustomText>
          </CustomView>
          <CustomView
            testID="lock-selection-or-text"
            onLongPress={this._onLongPressButton}
            onPress={this._onTextPressButton}
            debounceAction={false}
          >
            <CustomText h4 bg="tertiary" tertiary transparentBg thick center>
              or
            </CustomText>
          </CustomView>
          <CustomView
            fifth
            shadow
            testID="pin-code-selection"
            style={[style.touchIdPinContainer]}
            onPress={this.goPinCodeSetup}
            onLongPress={this._onLongPressButton}
          >
            <CustomView row center style={[style.pinContainer]}>
              <CustomView style={[style.pin]}>
                <CustomText h4 thick center bg="fifth">
                  1
                </CustomText>
              </CustomView>
              <CustomView style={[style.pin]}>
                <CustomText h4 thick center bg="fifth">
                  2
                </CustomText>
              </CustomView>
              <CustomView style={[style.pin]}>
                <CustomText h4 thick center bg="fifth">
                  3
                </CustomText>
              </CustomView>
              <CustomView style={[style.pin]}>
                <CustomText h4 thick center bg="fifth">
                  4
                </CustomText>
              </CustomView>
              <CustomView style={[style.pin]}>
                <CustomText h4 thick center bg="fifth">
                  5
                </CustomText>
              </CustomView>
              <CustomView style={[style.pin]}>
                <CustomText h4 thick center bg="fifth">
                  6
                </CustomText>
              </CustomView>
            </CustomView>
            <CustomText
              h5
              semiBold
              center
              tertiary
              transparentBg
              style={[style.usePinText]}
              onPress={this.goPinCodeSetup}
              testID="use-pass-code-text"
              onLongPress={this._onLongPressButton}
            >
              Use Pass Code
            </CustomText>
          </CustomView>
        </Container>
      </Container>
    )
  }
}

const mapStateToProps = ({ lock }: Store) => {
  return {
    showDevMode: lock.showDevMode,
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      switchErrorAlerts,
      longPressedInLockSelectionScreen,
      pressedOnOrInLockSelectionScreen,
      disableDevMode,
      safeToDownloadSmsInvitation,
    },
    dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(LockSelection)

const style = StyleSheet.create({
  pinSelectionContainer: {
    paddingTop: OFFSET_3X,
    paddingBottom: isiPhone5 ? OFFSET_2X : OFFSET_6X,
    paddingHorizontal: OFFSET_2X,
  },
  messageText: {
    paddingHorizontal: isiPhone5 ? 0 : OFFSET_5X / 2,
    paddingTop: isiPhone5 ? OFFSET_5X / 2 : OFFSET_5X,
    paddingBottom: isiPhone5 ? OFFSET_3X / 2 : OFFSET_7X / 2,
  },
  touchIdPinContainer: {
    paddingTop: OFFSET_1X / 2,
    paddingHorizontal: OFFSET_2X,
    paddingBottom: OFFSET_2X,
    borderRadius: 13,
    marginHorizontal: OFFSET_3X,
  },
  fingerPrintIcon: {
    marginVertical: OFFSET_3X / 2,
    height: 60,
    width: 60,
  },
  pinContainer: {
    marginVertical: OFFSET_3X,
    marginBottom: OFFSET_5X / 2,
  },
  pin: {
    borderBottomColor: color.bg.fifth.font.primary,
    borderBottomWidth: PIN_CODE_BORDER_BOTTOM,
    marginRight: OFFSET_1X / 2,
    paddingHorizontal: OFFSET_1X / 2,
    paddingBottom: OFFSET_1X,
  },
  usePinText: {
    lineHeight: 22,
    paddingBottom: OFFSET_1X / 2,
  },
})
