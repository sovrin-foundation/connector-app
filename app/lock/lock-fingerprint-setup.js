// @flow
import React, { PureComponent } from 'react'
import TouchID from 'react-native-touch-id'
import { Container } from '../components'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { captureError } from '../services/error/error-handler'
import type { Store } from '../store/type-store'

import {
  lockPinSetupHomeRoute,
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
  onTouchToggle = (route: string) => {
    if (this.props.touchIdActive) {
      this.props.disableTouchIdAction()
    } else {
      this.props.enableTouchIdAction()
    }
    this.props.navigation.navigate(route)
  }

  touchIdHandler = () => {
    TouchID.authenticate('')
      .then(success => {
        this.props.fromSettings
          ? this.onTouchToggle(settingsTabRoute)
          : this.onTouchToggle(lockPinSetupRoute)
      })
      .catch(error => {
        captureError(error)
        this.props.fromSettings
          ? this.props.navigation.navigate(settingsTabRoute)
          : this.props.navigation.navigate(lockSelectionRoute)
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
