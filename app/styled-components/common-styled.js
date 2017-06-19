import React from 'react'
import { View, Text, Image, Button, Animated, ScrollView } from 'react-native'
import styled from 'styled-components/native'

import {
  imageWidth,
  imageHeight,
  borderRadius,
  flexDirection,
  justifyContent,
  alignItems,
  alignSelf,
} from './styled-utility'

export const CenterContainer = styled.View`
  justify-content: center;
  background-color: #3F4140;
`

export const StyledText = styled.Text`
  color: ${props => (props.color ? props.color : '#FFFFFF')};
`

export const RoundedImage = styled.Image`
  width: ${props => imageWidth};
  height: ${props => imageHeight};
  border-radius: ${props => borderRadius};
  margin: ${props => (props.margin ? props.margin : 0)};
`

export const StyledImage = styled.Image`
  flex-direction: ${props => flexDirection};
  justify-content: ${props => justifyContent};
  width: ${props => imageWidth};
  height: ${props => imageHeight};
  margin: ${props => (props.margin ? props.margin : 0)};
`

export const StyledButton = styled.Button`
  color: #fff;
  background-color: #43a047;
`

export const ListItemLabel = styled.Text`
  color: #535353;
  font-size: 12;
  margin-bottom: 5;
`

export const ListItemValue = styled.Text`
  color: #3f4140;
  font-size: 15;
  font-weight: bold;
`

export const ItemDividerLabel = styled.Text`
  color: #242B2D;
`

export const SwipeRightItem = styled.TouchableOpacity`
  flex: 1;
  padding-left: 20;
  justify-content: center;
  background-color: ${props => (props.background ? props.background : '#FFFFFF')};
`

export const SwipeRightText = styled.Text`
  color: #FFFFFF;
  font-weight: bold;
`

export const SwipeLeftItem = styled.TouchableOpacity`
  flex: 1;
  align-items: flex-end;
  flex-wrap: wrap;
  justify-content: center;
  background-color: #85BF43;
`
export const SwipeLeftText = styled.Text`
  color: #FFFFFF;
  font-weight: bold;
  justifyContent: center;
  alignItems: center;
  width: 140;
  paddingLeft: 10;
`
