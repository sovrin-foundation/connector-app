import React from 'react'
import { View, Text } from 'react-native'
import UserIcon from './user-icon'
import UserInfo from './user-info'

// TODO: Add reselect to avoid rerenders in functional components
const User = props => (
  <View>
    <UserIcon />
    <UserInfo {...props} />
  </View>
)

export default User
