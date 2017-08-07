import React from 'react'
import { StyleSheet, Image } from 'react-native'
import { CustomView } from './layout'
import empty from '../common/empty'

export default props => {
  const { src, small, medium, large, iconStyle = empty, testID } = props
  const size = small ? 'small' : medium ? 'medium' : 'large'

  return (
    <CustomView clearBg {...props}>
      <Image
        source={src}
        style={[styles[size], ...iconStyle]}
        resizeMode="contain"
        testID={testID}
      />
    </CustomView>
  )
}

const size = {
  small: 20,
  medium: 30,
  large: 50,
}

const styles = StyleSheet.create({
  small: {
    width: size.small,
    height: size.small,
  },
  medium: {
    width: size.medium,
    height: size.medium,
  },
  large: {
    width: size.large,
    height: size.large,
  },
})
