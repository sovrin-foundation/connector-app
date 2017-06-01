import React, { PureComponent } from 'react'
import { View, Animated, Text } from 'react-native'
import Divider from '../divider'
import { ItemDividerLabel } from '../../styled-components/common-styled'
import {
  addButtonText,
  SeeAllButton,
  rightActionButtons,
  UserInfoSectionList,
} from './user-info-common-components'

const addressesDividerLeft = <ItemDividerLabel>ADDRESSES</ItemDividerLabel>

const swipeableProps = {
  leftButtonWidth: 140,
  leftActionReleaseAnimationFn: Animated.spring,
  leftButtons: [<SeeAllButton text={'SEE ALL CERTIFICATIONS'} />],
  rightButtons: rightActionButtons,
}

export default class UserInfoAddressSection extends PureComponent {
  render() {
    return (
      <View>
        <Divider left={addressesDividerLeft} right={addButtonText} />
        <UserInfoSectionList
          infoList={this.props.addresses}
          swipeableProps={swipeableProps}
          onSwipeStart={this.props.onSwipeStart}
          onSwipeRelease={this.props.onSwipeRelease}
          isSwipeable
        />
      </View>
    )
  }
}
