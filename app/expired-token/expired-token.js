import React, { PureComponent } from 'react'
import { View, Image, StyleSheet } from 'react-native'
import { Container, CustomView, CustomText } from '../components'

export default class ExpiredToken extends PureComponent {
  render() {
    return (
      <Container primary style={[styles.expiredTokenContainer]}>
        <CustomView vCenter>
          <Image
            source={require('../images/App%20Icon.png')}
            style={styles.sovrinLogo}
            resizeMode="contain"
          />
        </CustomView>
        <CustomView vCenter>
          <Image
            style={styles.connectMeLogo}
            source={require('../images/launchConnectMe.png')}
            resizeMode="contain"
          />
        </CustomView>
        <CustomView vCenter style={[styles.textContainer]}>
          <CustomText h1 style={[styles.sorryText]}>Sorry!</CustomText>
          <CustomText h3 secondary bold center>
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
