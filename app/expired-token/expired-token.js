// @flow
import React, { PureComponent } from 'react'
import { View, Image, StyleSheet } from 'react-native'
import { Container, CustomView, CustomText, CustomButton } from '../components'
import { isBiggerThanShortDevice, grey, color } from '../common/styles'
import { homeRoute } from '../common'
import type { ReactNavigation } from '../common/type-common'

export default class ExpiredToken extends PureComponent<ReactNavigation, void> {
  okClicked = false

  onOk = () => {
    if (!this.okClicked) {
      this.props.navigation.navigate(homeRoute)
      this.okClicked = true
    }
  }

  render() {
    return (
      <Container fifth>
        <Container center>
          <CustomView vCenter>
            <Image
              style={styles.connectMeLogo}
              source={require('../images/logo_connectme.png')}
              resizeMode="contain"
            />
          </CustomView>
          <CustomView vCenter style={[styles.textContainer]}>
            <CustomText transparentBg primary h1 style={[styles.sorryText]}>
              Sorry!
            </CustomText>
            <CustomText transparentBg primary h3 bold center>
              This invitation has expired!
            </CustomText>
          </CustomView>
        </Container>
        <CustomView safeArea style={[styles.okButtonContainer]}>
          <CustomButton
            testID="expired-token-ok"
            title="Ok"
            primary
            medium
            fontWeight="600"
            large={isBiggerThanShortDevice ? true : false}
            onPress={this.onOk}
            style={[styles.okButton]}
          />
        </CustomView>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  expiredTokenContainer: {
    paddingTop: 30,
  },
  sovrinLogo: {
    width: 90,
    height: 90,
  },
  connectMeLogo: {
    width: 200,
  },
  textContainer: {
    paddingTop: 30,
  },
  sorryText: {
    paddingBottom: 20,
  },
  okButtonContainer: {
    marginBottom: 15,
    marginLeft: '5%',
    marginRight: '5%',
  },
  okButton: {
    borderRadius: 5,
    height: isBiggerThanShortDevice ? 53 : 43,
  },
})
