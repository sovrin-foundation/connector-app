import React, { PureComponent } from 'react'
import { View, Image, StyleSheet } from 'react-native'
import Modal from 'react-native-modal'

import {
  Container,
  CustomView,
  CustomText,
  CustomButton,
  Avatar,
  TextStyles,
} from '../components'
import { color, OFFSET_1X, OFFSET_2X } from '../common/styles'
import { connectionRoute } from '../common'
import { getConnectionLogo } from '../store'

export default class ConnectionSuccessModal extends PureComponent {
  _renderModalContent = ({
    name = 'Evernym',
    logoUrl,
    showConnectionSuccessModal,
  }) => {
    const connectionAvatar = getConnectionLogo(logoUrl)
    return (
      <CustomView fifth shadow style={[styles.container]}>
        <CustomView hCenter style={[styles.innerContainer]}>
          <CustomView
            row
            vCenter
            spaceBetween
            style={[styles.avatarsContainer]}
            testID={'invitation-text-avatars-container'}
          >
            <Avatar
              medium
              shadow
              src={require('../images/invitee.jpeg')}
              testID={'invitation-text-avatars-invitee'}
            />
            <Image
              style={styles.checkMark}
              source={require('../images/checkMark.png')}
            />
            <Avatar
              medium
              src={connectionAvatar}
              testID={'invitation-text-avatars-inviter'}
            />
          </CustomView>
          <CustomText
            bg="fifth"
            h5
            semiBold
            center
            style={[styles.textContent]}
            testID={'modal-body'}
          >
            You are now connected to {name}!
          </CustomText>
        </CustomView>
        <CustomButton
          fifth
          onPress={() => showConnectionSuccessModal(false, connectionRoute)}
          title="Continue"
          accessibilityLabel="Continue to see your new connection"
          testID="new-connection-success-continue"
        />
      </CustomView>
    )
  }

  render() {
    return (
      <Modal
        backdropColor={color.bg.tertiary.color}
        backdropOpacity={1}
        isVisible={this.props.isModalVisible}
      >
        {this._renderModalContent(this.props)}
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: OFFSET_1X,
  },
  innerContainer: {
    borderBottomColor: color.bg.fifth.font.tertiary,
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingVertical: OFFSET_1X,
  },
  avatarsContainer: {
    marginHorizontal: OFFSET_2X,
    marginVertical: OFFSET_1X,
  },
  textContent: {
    margin: OFFSET_1X,
    color: color.bg.tertiary.font.secondary,
  },
  checkMark: {
    width: 30,
    height: 22,
  },
})
