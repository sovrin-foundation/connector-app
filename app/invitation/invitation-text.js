import React from 'react'
import { View, StyleSheet } from 'react-native'
import { View as AnimationView } from 'react-native-animatable'
import { StyledText } from '../styled-components/common-styled'
import { CustomView, CustomText, Container } from '../components'

import InvitationAvatars from './invitation-avatars'
import invitation from '../invitation/invitation-store'

const InvitationText = ({
  invitation: { data: { offerMsgTitle, offerMsgText }, invitee },
  tapAvatar,
}) => (
  <Container useNativeDriver testID={'invitation-text-container'}>
    <Container bottom testID={'invitation-text-message-container'}>
      <AnimationView
        testID={'invitation-text-container-animation'}
        animation="bounceInDown"
        duration={1500}
        delay={100}
      >
        <CustomView
          center
          style={[styles.invitationTextContainer]}
          testID={'invitation-text-container-message-title'}
        >
          <CustomText
            testID={'invitation-text-title'}
            h1
            bg={'primary'}
            style={[styles.invitationTitle]}
            testID={'invitation-text-container-title'}
            onPress={tapAvatar}
          >
            {offerMsgTitle}
          </CustomText>
          <CustomText h3 testID={'invitation-text-container-message'}>
            {offerMsgText}
          </CustomText>
        </CustomView>
      </AnimationView>
    </Container>
    <Container testID={'invitation-text-container-avatars'}>
      <AnimationView
        animation="bounceInUp"
        delay={300}
        duration={1500}
        testID={'invitation-text-container-avatars-animation'}
      >
        <InvitationAvatars />
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
