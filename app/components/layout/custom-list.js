import React, { PureComponent } from 'react'
import { FlatList, Text, View, Image } from 'react-native'
import Avatar from '../avatar/avatar'
import { Container } from './container'
import { CustomView } from './custom-view'
import styles from './layout-style'

const Item = ({ item: { left, right }, itemStyle }) => (
  <Container vCenter row style={[styles.listItem]}>
    {left &&
      <Container left>
        {left}
      </Container>}
    {right &&
      <CustomView right>
        {right}
      </CustomView>}
  </Container>
)

export default function CustomList(props) {
  const { data } = props
  const style = props.style || {}
  const itemList = data.map(item => (
    <Item key={item.id} item={item} itemStyle={style.itemStyle} />
  ))

  return (
    <View style={[styles.list, style.listStyle]}>
      {itemList}
    </View>
  )
}
