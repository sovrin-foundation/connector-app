import React from 'react'
import { CustomView } from './custom-view'
import style from './layout-style'

const empty = {}

// Use -
// When a View is supposed to take all space available to it
// When used as <Container> siblings, they all take space in equal ratio
export const Container = props => {
  const passedStyles = props.style ? props.style : empty

  return (
    <CustomView {...props} style={[...passedStyles, style.container]}>
      {props.children}
    </CustomView>
  )
}
