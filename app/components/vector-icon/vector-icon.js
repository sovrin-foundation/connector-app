// @flow

import React, { PureComponent } from 'react'
import Svg, { Path } from 'react-native-svg'
import { ICON_PATHS } from './type-vector-icon'
import type { VectorIconProps } from './type-vector-icon'
import { color } from '../../common/styles/constant'

export default class VectorIcon extends PureComponent<VectorIconProps, void> {
  static defaultProps = {
    fill: color.actions.font.primary,
    width: 25,
    height: 25,
  }

  render() {
    const { width, height, icon, fill } = this.props

    return (
      <Svg width={width} height={height} viewBox="0 0 1200 1200">
        <Path d={ICON_PATHS[icon]} fill={fill} />
      </Svg>
    )
  }
}
