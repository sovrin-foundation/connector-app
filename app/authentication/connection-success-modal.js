// @flow
import React, { PureComponent } from 'react'
import { View, Image, StyleSheet } from 'react-native'

import { CustomModal, AvatarsPair, CustomText } from '../components'
import { color, OFFSET_1X, OFFSET_2X } from '../common/styles'
import { connectionRoute } from '../common'
import { getConnectionLogo } from '../store/connections-store'

// TODO:KS Move these props to type-* file
// we will move this file as well to components directory
// and create tests, type and component in separate folder
// Trying to avoid as many conflicts as possible
export type ConnectionSuccessModalProps = {
  name: string,
  logoUrl: ?string,
  showConnectionSuccessModal: (boolean, string) => void,
  isModalVisible: boolean,
}

export default class ConnectionSuccessModal extends PureComponent<
  ConnectionSuccessModalProps,
  void
> {
  render() {
    const {
      name = 'Sovrin',
      logoUrl,
      showConnectionSuccessModal,
      isModalVisible,
    } = this.props
    const connectionAvatar = getConnectionLogo(logoUrl)

    return (
      <CustomModal
        onPress={() => showConnectionSuccessModal(false, connectionRoute)}
        buttonText="Continue"
        testID={'invitation'}
        isVisible={isModalVisible}
      >
        <AvatarsPair
          middleImage={require('../images/checkMark.png')}
          avatarRight={connectionAvatar}
          testID={'invitation'}
        />
        <CustomText
          bg="tertiary"
          h5
          tertiary
          demiBold
          center
          style={[styles.message]}
          transparentBg
          testID={`invitation-message`}
        >
          {`You are now connected to ${name}!`}
        </CustomText>
      </CustomModal>
    )
  }
}

const styles = StyleSheet.create({
  message: {
    paddingTop: OFFSET_1X,
    marginBottom: OFFSET_1X,
    marginHorizontal: OFFSET_1X / 2,
  },
})
