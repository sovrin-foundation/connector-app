import React from 'react'
import { View, Text } from 'react-native'
import UserIcon from './user-icon'
import UserInfoItems from './user-info'

// TODO: Add reselect to avoid rerenders in functional components
const User = props => (
  <View>
    <UserIcon
      changeServerEnvironmentToDemo={props.changeServerEnvironmentToDemo}
      changeServerEnvironmentToSandbox={props.changeServerEnvironmentToSandbox}
    />
    <UserInfoItems {...props} />
  </View>
)
export default User
