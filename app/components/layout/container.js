// @flow
import React from 'react'
import { CustomView } from './custom-view'
import style from './layout-style'
import type { GenericObject } from '../../common/type-common'

const empty = []

// Use -
// When a View is supposed to take all space available to it
// When used as <Container> siblings, they all take space in equal ratio
export const Container = (props: GenericObject) => {
  const passedStyles = props.style ? props.style : empty
  let allProps = props
  if (props.testID) {
    allProps.accessible = true
    allProps.accessibilityLabel = props.testID
  }
  return (
    <CustomView {...allProps} style={[...passedStyles, style.container]}>
      {allProps.children}
    </CustomView>
  )
}
