// @flow
import React, { PureComponent } from 'react'
import { Alert, StyleSheet } from 'react-native'
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
} from '../common'

import {
  OFFSET_2X,
  OFFSET_3X,
  OFFSET_6X,
  isiPhone5,
} from '../common/styles/constant'
import { disableTouchIdAction, enableTouchIdAction } from '../lock/lock-store'
import { AllowedFallbackToucheIDErrors } from './type-lock'
import type { LockFingerprintSetupProps } from './type-lock'

export class LockFingerprintSetup extends PureComponent<
  LockFingerprintSetupProps,
  void
> {
  goToSettingsScreen = () => {
    if (this.props.touchIdActive) {
      this.props.disableTouchIdAction()
      Alert.alert(
        `You'll need to use your pass code to unlock this app from now on`,
        null,
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

  touchIdHandler = () => {
    TouchId.isSupported()
      .then(success => {
        TouchId.authenticate('', this.touchIdHandler)
          .then(success => {
            this.props.fromSettings
              ? this.goToSettingsScreen()
              : this.goToPinSetupScreen()
          })
          .catch(error => {
            captureError(error)
            if (AllowedFallbackToucheIDErrors.indexOf(error.name) >= 0) {
              this.props.fromSettings
                ? this.props.navigation.goBack(null)
                : this.props.navigation.navigate(lockSelectionRoute)
            }
          })
      })
      .catch(error => {
        captureError(error)
        if (AllowedFallbackToucheIDErrors.indexOf(error.name) >= 0) {
          this.props.fromSettings
            ? this.props.navigation.goBack(null)
            : this.props.navigation.navigate(lockSelectionRoute)
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
