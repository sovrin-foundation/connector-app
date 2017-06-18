import React from 'react'
import { View, Text } from 'react-native'
import UserIcon from './user-icon'
import UserInfo from './user-info'

// TODO: Add reselect to avoid rerenders in functional components
const User = ({ user, isSwiping }) => (
  <View>
    <UserIcon />
    <UserInfo user={user} isSwiping={isSwiping} />
  </View>
)

export default User
