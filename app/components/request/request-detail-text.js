// @flow
import React, { PureComponent } from 'react'
import { StyleSheet } from 'react-native'
import { View as AnimatedView } from 'react-native-animatable'
import { CustomText, CustomView } from '../../components'
import { OFFSET_2X } from '../../common/styles'
import { noop } from '../../common'
import type { RequestDetailTextProps } from './type-request'

export default class RequestDetailText
  extends PureComponent<void, RequestDetailTextProps, void> {
  render() {
    return (
      <AnimatedView
        testID={'invitation-text-container-animation'}
        animation="bounceInDown"
        duration={1500}
        delay={100}
      >
        <CustomView center testID={'invitation-text-container-message-title'}>
          <CustomText
            testID={'invitation-text-title'}
            h1
            bg={'primary'}
            style={[styles.title]}
            testID={'invitation-text-container-title'}
            onPress={this.props.onTitlePress}
          >
            {this.props.title}
          </CustomText>
          <CustomText h3 testID={'invitation-text-container-message'}>
            {this.props.message}
          </CustomText>
        </CustomView>
      </AnimatedView>
    )
  }
}

const styles = StyleSheet.create({
  title: {
    marginBottom: OFFSET_2X,
  },
})
