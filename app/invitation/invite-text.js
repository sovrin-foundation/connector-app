import React from 'react'
import { StyleSheet } from 'react-native'
import { Text } from 'react-native-elements'
import { View } from 'react-native-animatable'
import Avatars from './avatars'

const InviteText = ({ invitation: { invitation, invitee } }) => {
  return (
    <View style={styles.container} useNativeDriver>
      <View
        style={styles.inviteTextContainer}
        animation="bounceInDown"
        duration={1500}
        delay={100}
      >
        <Text h4 style={{ color: 'white' }}>{invitation.title}</Text>
        <Text h5 style={{ color: 'white' }}>
          {invitation.text}
        </Text>
      </View>
      <View
        animation="bounceInUp"
        delay={300}
        duration={1500}
        style={styles.avatarsContainer}
      >
        <Avatars invitee={invitee} inviter={invitation.inviter} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    backgroundColor: '#3F4140',
  },
  inviteTextContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarsContainer: {
    flex: 2,
    flexDirection: 'row',
    alignSelf: 'flex-start',
  },
})

export default InviteText
