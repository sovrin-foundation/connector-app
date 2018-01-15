// @flow
import React, { PureComponent } from 'react'
import { TouchId } from '../components/touch-id/touch-id'
import { Container } from '../components'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { captureError } from '../services/error/error-handler'
import type { Store } from '../store/type-store'
import { Alert } from 'react-native'

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
import { StyleSheet } from 'react-native'

export class LockFingerprintSetup extends PureComponent {
  goToSettingsScreen = () => {
    if (this.props.touchIdActive) {
      this.props.disableTouchIdAction()
      Alert.alert(
        `You'll need to use your pass code to unlock this app from now on`,
        null,
        [
          {
            text: 'OK',
            onPress: () => this.props.navigation.navigate(settingsTabRoute),
          },
        ]
      )
    } else {
      this.props.enableTouchIdAction()
      this.props.navigation.navigate(settingsTabRoute)
    }
  }
  goToPinSetupScreen = () => {
    this.props.enableTouchIdAction()
    this.props.navigation.navigate(lockPinSetupRoute, { touchIdActive: true })
  }

  touchIdHandler = () => {
    TouchId.authenticate('', this.touchIdHandler)
      .then(success => {
        this.props.fromSettings
          ? this.goToSettingsScreen()
          : this.goToPinSetupScreen()
      })
      .catch(error => {
        captureError(error)
        if (
          error.name === 'LAErrorAuthenticationFailed' ||
          error.name === 'LAErrorUserCancel'
        ) {
          this.props.fromSettings
            ? this.props.navigation.navigate(settingsTabRoute)
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
