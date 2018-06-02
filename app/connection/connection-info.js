// @flow
import React from 'react'
import { View, Text } from 'react-native'
import { CustomView } from '../components'

const labelSuncoastInfo = <Text>SUNCOAST INFO</Text>

// TODO:KS Move it to redux action
const connectionInfo = [
  {
    id: 'info1',
    name: 'SUNCOAST MEMBER NUMBER',
    data: '25269755',
  },
  {
    id: 'info2',
    name: 'MEMBER SINCE',
    data: '2009',
  },
  {
    id: 'info3',
    name: 'PAYER SCORE',
    data: '86',
  },
]

export default () => <CustomView />
