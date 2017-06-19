import React from 'react'
import { View, StyleSheet } from 'react-native'
import { View as AnimationView } from 'react-native-animatable'
import { StyledText } from '../styled-components/common-styled'
import { CustomView, CustomText, Container } from '../components'

import InvitationAvatars from './invitation-avatars'

const InvitationText = ({ invitation: { invitation, invitee } }) => (
  <Container useNativeDriver>
    <Container bottom>
      <AnimationView animation="bounceInDown" duration={1500} delay={100}>
        <CustomView center style={[styles.invitationTextContainer]}>
          <CustomText h1 bg={'primary'} style={[styles.invitationTitle]}>
            {invitation.title}
          </CustomText>
          <CustomText h3>
            {invitation.text}
          </CustomText>
        </CustomView>
      </AnimationView>
    </Container>
    <Container>
      <AnimationView animation="bounceInUp" delay={300} duration={1500}>
        <InvitationAvatars invitee={invitee} inviter={invitation.inviter} />
      </AnimationView>
    </Container>
  </Container>
)

export default InvitationText

const styles = StyleSheet.create({
  invitationTitle: {
    marginBottom: 20,
  },
})
