import React, { PureComponent } from 'react'
import { View } from 'react-native'
import Divider from '../divider'
import { ItemDividerLabel } from '../../styled-components/common-styled'
import {
  addButtonText,
  UserInfoSectionList,
} from './user-info-common-components'

const identifyingDividerLeft = (
  <ItemDividerLabel>IDENTIFYING INFO</ItemDividerLabel>
)

export default class IdentifyingInfoSection extends PureComponent {
  render() {
    return (
      <View>
        <Divider left={identifyingDividerLeft} right={addButtonText} />
        <UserInfoSectionList infoList={this.props.infos} />
      </View>
    )
  }
}
