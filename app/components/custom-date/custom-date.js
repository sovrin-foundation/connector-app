// @flow
import React, { PureComponent } from 'react'
import { Text } from 'react-native'
import moment from 'moment'

import { CustomText } from '../index'
import type { CustomDateProps } from './type-custom-date'

export default class CustomDate extends PureComponent<CustomDateProps, void> {
  render() {
    const { format = 'MM/DD/YYYY | h:mm A', children } = this.props
    const customDate = moment(children).format(format)
    return <CustomText {...this.props}>{customDate}</CustomText>
  }
}
