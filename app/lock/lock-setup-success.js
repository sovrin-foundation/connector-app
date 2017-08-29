// @flow
import React, { PureComponent } from 'react'
import { StyleSheet, Image } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Container, CustomText, CustomView, CustomButton } from '../components'
import { homeRoute } from '../common'
import { unlockApp, clearPendingRedirect } from './lock-store'
import type { Store } from '../store/type-store'
import { OFFSET_1X, OFFSET_2X, OFFSET_4X, color } from '../common/styles'
import layoutStyles from '../components/layout/layout-style'

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
      <Container senary>
        <Image
          source={require('../images/bkg_connectMe.png')}
          style={[layoutStyles.container, style.backgroundImage]}
        >
          <Container clearBg center style={[style.successContainer]}>
            <CustomText h3 semiBold center style={[style.successMessage]}>
              Your connect.me app is secured.
            </CustomText>
            <CustomText center style={[style.successInfo]}>
              From now on you'll need to use your PIN to unlock this app.
            </CustomText>
          </Container>
          <CustomView>
            <CustomButton
              primary
              testID="close-button"
              fontWeight="600"
              title="Close"
              onPress={this.onClose}
            />
          </CustomView>
        </Image>
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
  backgroundImage: {
    width: null,
    height: null,
    resizeMode: 'center',
  },
})
