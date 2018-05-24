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

export default class CustomModal extends PureComponent {
  constructor(props) {
    super(props)
    this.onPressDebounce = debounce(
      event => {
        if (this.props.onPress) {
          this.props.onPress(event)
        }
      },
      300,
      { leading: true, trailing: false }
    )
  }
  render() {
    const {
      disabled,
      onPress,
      buttonText,
      testID,
      isVisible,
      accessibilityLabel = 'Continue to see your new connection',
    } = this.props
    return (
      <Modal
        backdropColor={color.bg.tertiary.color}
        backdropOpacity={1}
        isVisible={isVisible}
        animationIn="zoomIn"
        animationOut="zoomOut"
        animationOutTiming={100}
      >
        <CustomView fifth shadow style={[styles.container]}>
          <CustomView spaceBetween style={[styles.innerContainer]}>
            {this.props.children}
          </CustomView>
          <CustomButton
            fifth
            disabled={disabled}
            disabledStyle={[styles.disabledStyle]}
            onPress={this.onPressDebounce}
            title={buttonText}
            accessible={true}
            accessibilityLabel={accessibilityLabel}
            testID={`${testID}-success-continue`}
            textStyle={{ fontWeight: 'bold' }}
          />
        </CustomView>
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
