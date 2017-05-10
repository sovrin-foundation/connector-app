import React from 'react'
import { View, StyleSheet, Image } from 'react-native'
import { Avatar, Icon } from 'react-native-elements'

const avatars = ({ inviter, invitee }) => (
  <View style={styles.avatars}>
    <Avatar
      containerStyle={styles.avatar}
      large
      rounded
      source={require('./images/invitee.png')}
    />
    <Image
      style={styles.arrow}
      source={require('./images/arrow-forward.png')}
    />
    <Avatar
      containerStyle={styles.avatar}
      large
      rounded
      source={require('./images/inviter.jpeg')}
    />
  </View>
)

const styles = StyleSheet.create({
  avatars: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'flex-start',
  },
  avatar: {
    width: 75,
    height: 75,
  },
  arrow: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
})

export default avatars
