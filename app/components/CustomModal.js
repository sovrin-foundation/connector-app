// @flow
import React, { PureComponent } from 'react'
import { View, Image, StyleSheet, Platform } from 'react-native'
import Modal from 'react-native-modal'
import {
  color,
  HAIRLINE_WIDTH,
  OFFSET_1X,
  OFFSET_3X,
  isiPhone5,
} from '../common/styles'
import { CustomView, CustomButton } from '../components'
import debounce from 'lodash.debounce'
import { noop } from '../common'

type CustomModalProps = {
  onPress?: (event: any) => void,
  children?: any,
  disabled?: boolean,
  buttonText?: string,
  testID: string,
  isVisible: boolean,
  accessibilityLabel?: string,
  backdropOpacity?: number,
  animationIn: string,
  animationOut: string,
  animationOutTiming: number,
  onModalHide?: () => void,
  fullScreen?: boolean,
}

export default class CustomModal extends PureComponent<CustomModalProps, void> {
  static defaultProps = {
    backdropOpacity: 1,
    animationIn: 'zoomIn',
    animationOut: 'zoomOut',
    animationOutTiming: 100,
  }

  onPressDebounce = debounce(
    event => {
      if (this.props.onPress) {
        this.props.onPress(event)
      }
    },
    600,
    { leading: true, trailing: false }
  )

  render() {
    const {
      disabled,
      onPress,
      buttonText,
      testID,
      isVisible,
      accessibilityLabel = 'Continue to see your new connection',
      backdropOpacity,
      animationIn,
      animationOut,
      animationOutTiming,
      fullScreen,
      onModalHide = noop,
    } = this.props
    return (
      <Modal
        backdropColor={color.bg.tertiary.color}
        backdropOpacity={backdropOpacity}
        isVisible={isVisible}
        animationIn={animationIn}
        animationOut={animationOut}
        animationOutTiming={animationOutTiming}
        onModalHide={onModalHide}
        useNativeDriver={true}
        hideModalContentWhileAnimating={true}
      >
        {fullScreen ? (
          <CustomView fifth>
            <CustomView>{this.props.children}</CustomView>
          </CustomView>
        ) : (
          <CustomView fifth shadow style={[styles.container]}>
            <CustomView style={[styles.innerContainer]}>
              {this.props.children}
            </CustomView>
            {onPress && (
              <CustomButton
                fifth
                disabled={disabled}
                disabledStyle={[styles.disabledStyle]}
                onPress={this.onPressDebounce}
                title={buttonText}
                testID={`${testID}-success-continue`}
                textStyle={{ fontWeight: 'bold' }}
              />
            )}
          </CustomView>
        )}
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: isiPhone5 ? OFFSET_1X : OFFSET_3X,
  },
  innerContainer: {
    ...Platform.select({
      ios: {
        borderBottomColor: color.bg.fifth.font.tertiary,
        borderBottomWidth: HAIRLINE_WIDTH,
      },
      android: {
        borderBottomColor: color.bg.fifth.font.secondary,
        borderBottomWidth: 1,
      },
    }),
    paddingVertical: OFFSET_1X,
  },
  disabledStyle: {
    backgroundColor: 'transparent',
  },
})
