import React from 'react'
import LinearGradient from 'react-native-linear-gradient'
import {
  HeaderContainer,
  InfoText,
} from '../styled-components/connection-styled'

export default props => (
  <LinearGradient colors={['#2A5270', '#132A3F']}>
    <HeaderContainer>
      <InfoText
        fontWeight={500}
        fontSize={28}
        fontStyle={'italic'}
        marginBottom={20}
      >
        Suncoast
      </InfoText>
      <InfoText fontSize={16}>
        Currently Talking With
      </InfoText>
      <InfoText fontWeight={500} fontSize={30}>
        JOHN BEST
      </InfoText>
      <InfoText fontSize={13}>
        CUSTOMER SERVICE SPECIALIST
      </InfoText>
    </HeaderContainer>
  </LinearGradient>
)
