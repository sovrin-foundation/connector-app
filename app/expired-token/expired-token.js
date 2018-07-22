// @flow
import React, { PureComponent } from 'react'
import { View, Image, StyleSheet } from 'react-native'
import { Container, CustomView, CustomText } from '../components'

export default class ExpiredToken extends PureComponent<void, void> {
  render() {
    return (
      <Container center fifth>
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
})
