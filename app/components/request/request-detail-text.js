// @flow
import React, { PureComponent } from 'react'
import { StyleSheet } from 'react-native'
import { View as AnimatedView } from 'react-native-animatable'
import { CustomText, CustomView } from '../../components'
import { OFFSET_1X, OFFSET_3X } from '../../common/styles'
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
            style={[styles.textTitle]}
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
            style={[styles.textMessage]}
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
  textMessage: {
    margin: OFFSET_1X,
  },
  textTitle: {
    marginVertical: OFFSET_1X,
    marginHorizontal: OFFSET_3X,
    lineHeight: OFFSET_3X,
  },
})
