import React from 'react'
import { View } from 'react-native'
import { color } from '../../common/styles/constant'

export { Container } from './container'

// this container will always have a padding top that is equal
// to the height of status bar at the top for IOS
// and for Android it will not have that top padding,
// all screen top level component should always use this component
export const ScreenContainer = () => {}

export const Row = () => {}

export const Column = () => {}

export { CustomView } from './custom-view'
