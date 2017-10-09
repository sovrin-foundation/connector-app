// @flow
import React, { PureComponent } from 'react'
import { Image, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Container, CustomText, CustomView } from '../components'
import { lockPinSetupRoute } from '../common/'
import {
  OFFSET_1X,
  OFFSET_2X,
  OFFSET_5X,
  color,
  PIN_CODE_BORDER_BOTTOM,
} from '../common/styles/constant'
import { switchErrorAlerts } from '../store'

export class LockSelection extends PureComponent {
  goTouchIdSetup = () => {
    //TODO:PS: not in use, will use later
    // this.props.navigation.navigate(lockPinSetupRoute)
  }

  goPinCodeSetup = () => {
    this.props.navigation.navigate(lockPinSetupRoute)
  }

  render() {
    return (
      <Container senary style={[style.pinSelectionContainer]}>
        <CustomView verticalSpace onPress={this.props.switchErrorAlerts}>
          <CustomText h4 bold center>
            Choose how to unlock this app
          </CustomText>
        </CustomView>
        <CustomView verticalSpace>
          <CustomText h5 semiBold center>
            This application must be protected by TouchId or a pin code at all
            times.
          </CustomText>
        </CustomView>
        <Container>
          <CustomView
            center
            tertiary
            testID="touch-id-selection"
            style={[style.touchIdPinContainer]}
            onPress={this.goTouchIdSetup}
          >
            <Image
              style={style.fingerPrintIcon}
              source={require('../images/icon_fingerPrint.png')}
            />
            <CustomText
              h5
              semiBold
              center
              bg="fifth"
              onPress={this.goTouchIdSetup}
            >
              Use Touch ID for "connect.me"
            </CustomText>
          </CustomView>
          <CustomView>
            <CustomText h4 bold center>
              or
            </CustomText>
          </CustomView>
          <CustomView
            tertiary
            testID="pin-code-selection"
            style={[style.touchIdPinContainer]}
            onPress={this.goPinCodeSetup}
          >
            <CustomView row center style={[style.pinContainer]}>
              <CustomView style={[style.pin]}>
                <CustomText h3 semiBold center bg="fifth">
                  *
                </CustomText>
              </CustomView>
              <CustomView style={[style.pin]}>
                <CustomText h3 semiBold center bg="fifth">
                  *
                </CustomText>
              </CustomView>
              <CustomView style={[style.pin]}>
                <CustomText h3 semiBold center bg="fifth">
                  *
                </CustomText>
              </CustomView>
              <CustomView style={[style.pin]}>
                <CustomText h3 semiBold center bg="fifth">
                  *
                </CustomText>
              </CustomView>
              <CustomView style={[style.pin]}>
                <CustomText h3 semiBold center bg="fifth">
                  *
                </CustomText>
              </CustomView>
              <CustomView style={[style.pin]}>
                <CustomText h3 semiBold center bg="fifth">
                  *
                </CustomText>
              </CustomView>
            </CustomView>
            <CustomText
              h5
              semiBold
              center
              bg="fifth"
              onPress={this.goPinCodeSetup}
            >
              Use PIN Code for "connect.me"
            </CustomText>
          </CustomView>
        </Container>
      </Container>
    )
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      switchErrorAlerts,
    },
    dispatch
  )

export default connect(null, mapDispatchToProps)(LockSelection)

const style = StyleSheet.create({
  pinSelectionContainer: {
    paddingVertical: OFFSET_5X,
    paddingHorizontal: OFFSET_2X,
  },
  touchIdPinContainer: {
    minHeight: 130,
    margin: OFFSET_1X,
    paddingTop: OFFSET_1X,
    paddingHorizontal: OFFSET_2X,
    borderRadius: 13,
  },
  fingerPrintIcon: {
    marginVertical: OFFSET_1X,
  },
  pinContainer: {
    marginVertical: OFFSET_2X,
  },
  pin: {
    borderBottomColor: color.bg.fifth.font.primary,
    borderBottomWidth: PIN_CODE_BORDER_BOTTOM,
    marginRight: OFFSET_1X / 2,
    paddingHorizontal: OFFSET_1X / 2,
  },
})
