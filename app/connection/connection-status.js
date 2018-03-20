// @flow
import React from 'react'
import { StyleSheet, Image } from 'react-native'
import RadialGradient from 'react-native-radial-gradient'
import { Container, CustomText } from '../components'

const ConnectionStatus = () => (
  <RadialGradient colors={['#295373', '#12293F']}>
    <Container center style={[styles.headerContainer]}>
      <Image
        style={[styles.image]}
        source={require('../images/cbSunCoast.png')}
      />
      <CustomText>Currently Talking With</CustomText>
      <CustomText>JOHN BEST</CustomText>
      <CustomText>CUSTOMER SERVICE SPECIALIST</CustomText>
    </Container>
  </RadialGradient>
)

export default ConnectionStatus

const styles = StyleSheet.create({
  image: {
    marginBottom: 22,
    width: 104,
    height: 104,
  },
  headerContainer: {
    height: 270,
  },
})
