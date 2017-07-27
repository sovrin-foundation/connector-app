import React from 'react'
import LinearGradient from 'react-native-linear-gradient'
import {
  HeaderContainer,
  InfoText,
} from '../styled-components/connection-styled'
import { StyleSheet, Image } from 'react-native'

export default props => (
  <LinearGradient colors={['#295373', '#12293F']}>
    <HeaderContainer>
      <Image
        style={[styles.image]}
        source={require('../images/cbSunCoast.png')}
      />
      <InfoText fontSize={16} marginBottom={7}>
        Currently Talking With
      </InfoText>
      <InfoText fontWeight={500} fontSize={30} marginBottom={11}>
        JOHN BEST
      </InfoText>
      <InfoText fontSize={13}>
        CUSTOMER SERVICE SPECIALIST
      </InfoText>
    </HeaderContainer>
  </LinearGradient>
)

const styles = StyleSheet.create({
  image: {
    marginBottom: 22,
    width: 104,
    height: 104,
  },
})
