import React, { PureComponent } from 'react'
import TouchID from 'react-native-touch-id'
import { Container } from '../components'
import { connect } from 'react-redux'
import { captureError } from '../services/error/error-handler'

import {
  lockPinSetupHomeRoute,
  lockPinSetupRoute,
  lockSelectionRoute,
} from '../common'

import {
  OFFSET_2X,
  OFFSET_3X,
  OFFSET_6X,
  isiPhone5,
} from '../common/styles/constant'

import { StyleSheet } from 'react-native'

export class LockFingerprintSetup extends PureComponent {
  touchIdHandler = () => {
    TouchID.authenticate('')
      .then(success => {
        this.props.navigation.navigate(lockPinSetupRoute, {
          touchIDActive: true,
        })
      })
      .catch(error => {
        captureError(error)
        this.props.navigation.navigate(lockSelectionRoute)
      })
  }

  componentDidMount() {
    this.touchIdHandler()
  }

  render() {
    return <Container tertiary style={[style.pinSelectionContainer]} />
  }
}

const style = StyleSheet.create({
  pinSelectionContainer: {
    paddingTop: OFFSET_3X,
    paddingBottom: isiPhone5 ? OFFSET_2X : OFFSET_6X,
    paddingHorizontal: OFFSET_2X,
  },
})

export default connect()(LockFingerprintSetup)
