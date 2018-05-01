import React from 'react'
import { Dimensions } from 'react-native'
import { TabBarTop, TabNavigator } from 'react-navigation'
import { CustomView } from '../components'
import {
  RECEIVE_TAB,
  SEND_TAB,
  HISTORY_TAB,
  RECEIVE_TAB_TEST_ID,
  SEND_TAB_TEST_ID,
  HISTORY_TAB_TEST_ID,
} from './wallet-constants'
import { color, font } from '../common/styles/constant'
import styles from './styles'
import { receiveTabRoute, sendTabRoute, historyTabRoute } from '../common/'

const { width } = Dimensions.get('window')

const Tabs = TabNavigator(
  {
    [receiveTabRoute]: {
      screen: CustomView,
      navigationOptions: {
        tabBarLabel: RECEIVE_TAB,
        tabBarTestIDProps: {
          testID: RECEIVE_TAB_TEST_ID,
        },
      },
    },
    [sendTabRoute]: {
      screen: CustomView,
      navigationOptions: {
        tabBarLabel: SEND_TAB,
        tabBarTestIDProps: {
          testID: SEND_TAB_TEST_ID,
        },
      },
    },
    [historyTabRoute]: {
      screen: CustomView,
      navigationOptions: {
        tabBarLabel: HISTORY_TAB,
        tabBarTestIDProps: {
          testID: HISTORY_TAB_TEST_ID,
        },
      },
    },
  },
  {
    animationEnabled: true,
    swipeEnabled: true,
    lazy: true,
    initialRouteName: sendTabRoute,
    order: [receiveTabRoute, sendTabRoute, historyTabRoute],
    initialLayout: {
      height: 52,
      width,
    },
    tabBarComponent: TabBarTop,
    tabBarPosition: 'top',
    tabBarOptions: {
      allowFontScaling: false,
      activeTintColor: color.actions.font.seventh,
      inactiveTintColor: color.bg.tertiary.font.primary,
      indicatorStyle: {
        backgroundColor: color.actions.font.seventh,
        height: 3,
      },
      style: {
        backgroundColor: color.bg.tertiary.color,
        borderBottomWidth: 1,
        borderBottomColor: color.border.primary,
      },
      labelStyle: {
        fontSize: font.size.S,
        fontWeight: 'bold',
      },
    },
  }
)

export default Tabs
