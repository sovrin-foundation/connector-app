// @flow
/**
 * Intend to verify user actions
 * we will ask authorize user for some actions in app
 * either by asking for TouchId or asking user to enter pin code
 * we will ask for authorization while accepting invitation
 * accepting claim offer, sharing proof for now
 */
import React, { PureComponent } from 'react'
import { StyleSheet } from 'react-native'
import LockEnter from './lock-enter'
import type { LockAuthorizationProps } from './type-lock'
import { Icon } from '../components'
import { CustomView, CustomHeader } from '../components'
import { OFFSET_2X, color } from '../common/styles'
import { tertiaryHeaderStyles } from '../components/layout/header-styles'
import { lockAuthorizationHomeRoute } from '../common'
import { createStackNavigator } from 'react-navigation'
import type { ReactNavigation } from '../common/type-common'

const styles = StyleSheet.create({
  headerLeft: {
    width: OFFSET_2X,
  },
})

export class LockAuthorization extends PureComponent<
  LockAuthorizationProps,
  void
> {
  static navigationOptions = ({ navigation }: ReactNavigation) => ({
    header: (
      <CustomHeader flatHeader backgroundColor={color.bg.tertiary.color}>
        <CustomView>
          <Icon
            small
            testID={'back-arrow'}
            iconStyle={[styles.headerLeft]}
            src={require('../images/icon_backArrow.png')}
            resizeMode="contain"
            onPress={() => {
              navigation.goBack(null)
              if (navigation.state && navigation.state.params.onAvoid) {
                navigation.state.params.onAvoid()
              }
            }}
          />
        </CustomView>
      </CustomHeader>
    ),
  })

  onSuccess = () => {
    this.props.navigation.goBack(null)
    setTimeout(() => {
      this.props.navigation.state &&
        this.props.navigation.state.params.onSuccess()
    })
  }

  onClose = () => {
    this.props.navigation.goBack(null)
    setTimeout(() => {
      this.props.navigation.state &&
        this.props.navigation.state.params.onAvoid()
    })
  }

  render() {
    return <LockEnter onSuccess={this.onSuccess} />
  }
}

export default createStackNavigator({
  [lockAuthorizationHomeRoute]: {
    screen: LockAuthorization,
  },
})
