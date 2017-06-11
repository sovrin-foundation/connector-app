import React from 'react'
import styled from 'styled-components/native'

export const HeaderContainer = styled.View`
  height: 200;
  justify-content: center;
  align-items: center;
`

export const InfoText = styled.Text`
  color: ${props => (props.color ? props.color : '#FFFFFF')};
  backgroundColor: transparent;
  fontWeight: ${props => (props.fontWeight ? props.fontWeight : 'normal')};
  fontSize: ${props => (props.fontSize ? props.fontSize : 12)};
  fontStyle: ${props => (props.fontStyle ? props.fontStyle : 'normal')};
  margin: 3;    
  margin-bottom: ${props => (props.marginBottom ? props.marginBottom : 3)};
`
