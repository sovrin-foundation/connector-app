import React, { PureComponent } from 'react'
import { View, Image, StyleSheet } from 'react-native'
import Modal from 'react-native-modal'
import {
  color,
  HAIRLINE_WIDTH,
  OFFSET_1X,
  OFFSET_3X,
  isiPhone5,
} from '../common/styles'
import { CustomView, CustomButton } from '../components'

export default class CustomModal extends PureComponent {
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
            onPress={onPress}
            title={buttonText}
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
    borderBottomColor: color.bg.fifth.font.tertiary,
    borderBottomWidth: HAIRLINE_WIDTH,
    paddingVertical: OFFSET_1X,
  },
  disabledStyle: {
    backgroundColor: 'transparent',
  },
})
