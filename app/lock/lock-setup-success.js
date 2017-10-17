// @flow
import React, { PureComponent } from 'react'
import { StyleSheet, Image } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  Container,
  CustomText,
  CustomView,
  CustomButton,
  Icon,
} from '../components'
import { homeRoute } from '../common'
import { unlockApp, clearPendingRedirect } from './lock-store'
import type { Store } from '../store/type-store'
import { OFFSET_1X, OFFSET_2X, OFFSET_4X, color } from '../common/styles'

export class LockSetupSuccess extends PureComponent {
  onClose = () => {
    this.props.unlockApp()
    if (this.props.pendingRedirection) {
      // if there is a redirection pending, then redirect and clear it
      this.props.navigation.navigate(this.props.pendingRedirection)
      this.props.clearPendingRedirect()
    }
  }

  render() {
    return (
      <Container tertiary>
        <Container clearBg center style={[style.successContainer]}>
          <Icon
            extraLarge
            resizeMode="cover"
            src={require('../images/lock.png')}
            testID="lock-success-lock-logo"
          />
          <CustomText
            h4
            bg="tertiary"
            tertiary
            thick
            center
            style={[style.successMessage]}
          >
            Your connect.me app is now secured
          </CustomText>
        </Container>
        <CustomView>
          <CustomButton
            tertiary
            raised
            medium
            testID="close-button"
            fontWeight="600"
            title="Close"
            onPress={this.onClose}
          />
        </CustomView>
      </Container>
    )
  }
}

const mapStateToProps = (state: Store) => ({
  pendingRedirection: state.lock.pendingRedirection,
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      clearPendingRedirect,
      unlockApp,
    },
    dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(LockSetupSuccess)

const style = StyleSheet.create({
  successContainer: {
    paddingHorizontal: OFFSET_2X,
  },
  successMessage: {
    paddingVertical: OFFSET_4X,
  },
  successInfo: {
    paddingHorizontal: OFFSET_1X,
  },
})
