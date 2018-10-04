// @flow
import React, { PureComponent } from 'react'
import { Alert, StyleSheet, Platform } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { TouchId } from '../components/touch-id/touch-id'
import { Container } from '../components'
import { captureError } from '../services/error/error-handler'
import type { Store } from '../store/type-store'

import {
  lockPinSetupRoute,
  lockSelectionRoute,
  settingsTabRoute,
  settingsRoute,
} from '../common'

import {
  OFFSET_2X,
  OFFSET_3X,
  OFFSET_6X,
  isiPhone5,
} from '../common/styles/constant'
import { disableTouchIdAction, enableTouchIdAction } from '../lock/lock-store'
import {
  AllowedFallbackToucheIDErrors,
  LAErrorTouchIDTooManyAttempts,
  LAErrorTouchIDNotSupported,
  touchIDAlerts,
  touchIDNotSupportAlertAndroid,
} from './type-lock'
import type { LockFingerprintSetupProps } from './type-lock'
import { AsyncStorage } from 'react-native'
import { safeSet } from '../services/storage'
import { getBiometricError } from '../bridge/react-native-cxs/RNCxs'

export class LockFingerprintSetup extends PureComponent<
  LockFingerprintSetupProps,
  void
> {
  goToSettingsScreen = () => {
    if (this.props.touchIdActive) {
      this.props.disableTouchIdAction()
      Alert.alert(
        null,
        touchIDAlerts.usePasscodeAlert,
        [
          {
            text: 'OK',
            onPress: () => this.props.navigation.goBack(null),
          },
        ],
        { cancelable: false }
      )
    } else {
      this.props.enableTouchIdAction()
      this.props.navigation.goBack(null)
    }
  }
  goToPinSetupScreen = () => {
    this.props.enableTouchIdAction()
    this.props.navigation.navigate(lockPinSetupRoute, { touchIdActive: true })
  }

  popUpNativeAlert = (message: string) => {
    Alert.alert(
      null,
      message,
      [
        {
          text: 'Ok',
          onPress: () => {
            this.props.fromSettings
              ? this.props.navigation.goBack(null)
              : this.props.navigation.navigate(lockSelectionRoute)
          },
        },
      ],
      { cancelable: false }
    )
  }

  touchIdHandler = () => {
    if (
      !this.props.fromSettings ||
      (this.props.fromSettings && this.props.currentScreen === settingsRoute)
    )
      TouchId.isSupported()
        .then(success => {
          TouchId.authenticate('', this.touchIdHandler)
            .then(success => {
              this.props.fromSettings
                ? this.goToSettingsScreen()
                : this.goToPinSetupScreen()
            })
            .catch(error => {
              // captureError(error)
              if (AllowedFallbackToucheIDErrors.indexOf(error.name) >= 0) {
                if (error.code === LAErrorTouchIDTooManyAttempts) {
                  this.popUpNativeAlert(touchIDAlerts.biometricsExceedAlert)
                } else {
                  this.props.fromSettings
                    ? this.props.navigation.goBack(null)
                    : this.props.navigation.navigate(lockSelectionRoute)
                }
              }
            })
        })
        .catch(error => {
          captureError(error)
          if (AllowedFallbackToucheIDErrors.indexOf(error.name) >= 0) {
            let alertMessage = touchIDAlerts.notSupportedBiometrics
            if (Platform.OS === 'android') {
              if (touchIDNotSupportAlertAndroid.indexOf(error.code) < 0) {
                alertMessage = touchIDAlerts.enableBiometrics
              }
              this.popUpNativeAlert(alertMessage)
            } else {
              getBiometricError()
                .then()
                .catch(err => {
                  if (err.code === 'BiometricsLockOut') {
                    alertMessage = touchIDAlerts.biometricsExceedAlert
                  } else if (err.code === 'BiometricsNotEnrolled') {
                    alertMessage = touchIDAlerts.enableBiometrics
                  } else {
                    alertMessage = touchIDAlerts.notSupportedBiometrics
                  }
                  this.popUpNativeAlert(alertMessage)
                })
            }
          }
        })
  }

  componentDidMount() {
    this.touchIdHandler()
  }

  render() {
    return <Container tertiary style={[style.pinSelectionContainer]} />
  }
}

const mapStateToProps = (state: Store, props) => ({
  touchIdActive: state.lock.isTouchIdEnabled,
  currentScreen: state.route.currentScreen,
  fromSettings:
    props.navigation.state.params !== undefined
      ? props.navigation.state.params.fromSettings
      : false,
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      disableTouchIdAction,
      enableTouchIdAction,
    },
    dispatch
  )

const style = StyleSheet.create({
  pinSelectionContainer: {
    paddingTop: OFFSET_3X,
    paddingBottom: isiPhone5 ? OFFSET_2X : OFFSET_6X,
    paddingHorizontal: OFFSET_2X,
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(
  LockFingerprintSetup
)
