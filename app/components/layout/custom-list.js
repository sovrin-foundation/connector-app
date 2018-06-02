// @flow
import React, { PureComponent } from 'react'
import { View } from 'react-native'
import { Container } from './container'
import { CustomView } from './custom-view'
import styles from './layout-style'
import type { GenericObject } from '../../common/type-common'

const Item = ({ item: { left, right }, itemStyle }) => (
  <Container vCenter row style={[styles.listItem]}>
    {left && <Container left>{left}</Container>}
    {right && <CustomView right>{right}</CustomView>}
  </Container>
)

export default function CustomList(props: CustomListProps) {
  const { data } = props
  const style = props.style || {}
  const itemList = data.map(item => (
    <Item key={item.id} item={item} itemStyle={style.itemStyle} />
  ))

  return <View style={[styles.list, style.listStyle]}>{itemList}</View>
}

type CustomListItem = {
  id: string | number,
  left?: any,
  right?: any,
}

type CustomListProps = {
  data: Array<CustomListItem>,
  style?: GenericObject,
}
