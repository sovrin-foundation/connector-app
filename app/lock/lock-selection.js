// @flow
import React, { PureComponent } from 'react'
import { Container, CustomText, CustomView } from '../components'
import { lockPinSetupRoute } from '../common/'

export default class LockSelection extends PureComponent {
  goTouchIdSetup = () => {
    this.props.navigation.navigate(lockPinSetupRoute)
  }

  goPinCodeSetup = () => {
    this.props.navigation.navigate(lockPinSetupRoute)
  }

  render() {
    return (
      <Container primary>
        <CustomView>
          <CustomText h4 center>Choose how to unlock this app</CustomText>
          <CustomText h4 center>
            This application must be protected by TouchId or a pin code at all times.
          </CustomText>
        </CustomView>
        <Container>
          <CustomView>
            <CustomText onPress={this.goTouchIdSetup}>
              Use Touch ID for "connect.me"
            </CustomText>
          </CustomView>
          <CustomText h01>
            or
          </CustomText>
          <CustomView>
            <CustomText onPress={this.goPinCodeSetup}>
              Use PIN Code for "connect.me"
            </CustomText>
          </CustomView>
        </Container>
      </Container>
    )
  }
}
