import React from 'react'
import { View, StyleSheet, Text } from 'react-native'
import Swipeable from 'react-native-swipeable'
import { ListItem } from '../info-section-list'
import Badge from '../badge'
import {
  ItemDividerLabel,
  ListItemLabel,
  ListItemValue,
  SwipeLeftItem,
  SwipeLeftText,
  SwipeRightItem,
  SwipeRightText,
} from '../../styled-components/common-styled'
import { PADDING_HORIZONTAL, color } from '../../common/styles/constant'
import empty from '../../common/empty'

const styles = StyleSheet.create({
  leftSpaced: {
    paddingLeft: PADDING_HORIZONTAL,
  },
  add: {
    color: color.bg.tertiary.font.secondary,
  },
})

export const addButtonText = <Text style={styles.add}>ADD</Text>

export const ListItemInfo = ({
  label,
  itemValue,
  noLeftSpaced,
  style = empty,
}) => {
  const itemStyle = [noLeftSpaced ? null : styles.leftSpaced, ...style]

  return (
    <View style={itemStyle}>
      <ListItemLabel>{label}</ListItemLabel>
      <ListItemValue>{itemValue}</ListItemValue>
    </View>
  )
}

export const UserInfoListItem = props => (
  <ListItem bottomMargin={props.bottomMargin}>
    {props.count && <Badge count={props.count} />}
    <ListItemInfo {...props} />
  </ListItem>
)

export const SeeAllButton = ({ text }) => (
  <SwipeLeftItem>
    <SwipeLeftText>
      {text}
    </SwipeLeftText>
  </SwipeLeftItem>
)

export const EditButton = props => (
  <SwipeRightItem background={'#A0A0A0'}>
    <SwipeRightText>Edit</SwipeRightText>
  </SwipeRightItem>
)

export const DeleteButton = props => (
  <SwipeRightItem background={'#D0021B'}>
    <SwipeRightText>Remove</SwipeRightText>
  </SwipeRightItem>
)

export const rightActionButtons = [<EditButton />, <DeleteButton />]

export const UserInfoSectionList = props => {
  const {
    isSwipeable,
    infoList,
    swipeableProps,
    noLeftSpaced = false,
    itemStyle = empty,
  } = props
  const len = infoList.length
  let bottomMargin = true

  return (
    <View>
      {infoList.map((info, i) => {
        bottomMargin = i + 1 !== len
        const listItemProp = isSwipeable ? empty : { key: info.id }
        const listItem = (
          <UserInfoListItem
            bottomMargin={bottomMargin}
            count={info.score}
            label={info.name.toUpperCase()}
            itemValue={info.data}
            noLeftSpaced={noLeftSpaced}
            style={[itemStyle]}
            {...listItemProp}
          />
        )

        if (isSwipeable) {
          return (
            <Swipeable
              {...swipeableProps}
              key={info.id}
              onSwipeStart={props.onSwipeStart}
              onSwipeRelease={props.onSwipeRelease}
            >
              {listItem}
            </Swipeable>
          )
        }

        return listItem
      })}
    </View>
  )
}
