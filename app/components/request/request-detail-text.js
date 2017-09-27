// @flow
import React, { PureComponent } from 'react'
import { StyleSheet } from 'react-native'
import { View as AnimatedView } from 'react-native-animatable'
import { CustomText, CustomView } from '../../components'
import { OFFSET_1X } from '../../common/styles'
import { noop } from '../../common'
import type { RequestDetailTextProps } from './type-request'

export default class RequestDetailText extends PureComponent<
  void,
  RequestDetailTextProps,
  void
> {
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
            h4
            center
            thick
            bg="fifth"
            style={[styles.textContent]}
            testID={'invitation-text-container-title'}
            onPress={this.props.onTitlePress}
          >
            {this.props.title}
          </CustomText>
          <CustomText
            h5
            center
            bold
            bg="fifth"
            style={[styles.textContent]}
            testID={'invitation-text-container-message'}
          >
            {this.props.message}
          </CustomText>
        </CustomView>
      </AnimatedView>
    )
  }
}

const styles = StyleSheet.create({
  textContent: {
    margin: OFFSET_1X,
  },
})
