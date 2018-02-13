// @flow
/**
 * Intend to verify user actions
 * we will ask authorize user for some actions in app
 * either by asking for TouchId or asking user to enter pin code
 * we will ask for authorization while accepting invitation
 * accepting claim offer, sharing proof for now
 */
import React, { PureComponent } from 'react'
import { TouchableHighlight, Image, StyleSheet } from 'react-native'
import LockEnter from './lock-enter'
import type { LockAuthorizationProps } from './type-lock'
import { CustomView } from '../components'
import { hitSlop } from '../common/styles/constant'
import { OFFSET_2X } from '../common/styles'
import { tertiaryHeaderStyles } from '../components/layout/header-styles'
import { lockAuthorizationHomeRoute } from '../common'
import { StackNavigator } from 'react-navigation'
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
    headerLeft: (
      <CustomView>
        <TouchableHighlight
          testID={'back-button'}
          onPress={() => {
            navigation.goBack(null)
            if (navigation.state && navigation.state.params.onAvoid) {
              navigation.state.params.onAvoid()
            }
          }}
          hitSlop={hitSlop}
        >
          <Image
            testID={'back-arrow'}
            style={styles.headerLeft}
            source={require('../images/icon_backArrow.png')}
            resizeMode="contain"
          />
        </TouchableHighlight>
      </CustomView>
    ),
    headerStyle: tertiaryHeaderStyles.header,
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

export default StackNavigator({
  [lockAuthorizationHomeRoute]: {
    screen: LockAuthorization,
  },
})
