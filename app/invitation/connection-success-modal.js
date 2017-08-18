import React, { PureComponent } from 'react'
import { View, StyleSheet } from 'react-native'
import { Button } from 'react-native-elements'
import Modal from 'react-native-modal'

import { CustomView, CustomText, Avatar, TextStyles } from '../components'
import { color, OFFSET_1X, OFFSET_2X, font } from '../common/styles'
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
      <CustomView secondary>
        <View center style={[styles.container]}>
          <CustomView center style={[styles.innerContent]}>
            <CustomText
              tertiary
              h4
              semiBold
              center
              style={[styles.textContent]}
              testID={'modal-title'}
            >
              Successful Connection
            </CustomText>

            <CustomView row center>
              <Avatar
                medium
                src={require('../images/invitee.jpeg')}
                style={[styles.avatarImage]}
              />
              <CustomView primary style={[styles.connectorIcon]} />
              <Avatar
                medium
                src={connectionAvatar}
                style={[styles.avatarImage]}
              />
            </CustomView>

            <CustomText
              tertiary
              h5
              semiBold
              center
              style={[styles.textContent]}
              testID={'modal-body'}
            >
              You are now connected to {name}!
            </CustomText>
          </CustomView>
        </View>

        <Button
          large
          textStyle={styles.continueButton}
          backgroundColor={'transparent'}
          fontWeight={'bold'}
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
      <Modal isVisible={this.props.isModalVisible}>
        {this._renderModalContent(this.props)}
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    borderBottomColor: color.bg.primary.color,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  innerContent: {
    padding: OFFSET_1X,
  },
  textContent: {
    paddingVertical: OFFSET_2X,
    color: color.bg.tertiary.font.secondary,
  },
  connectorIcon: {
    height: 8,
    width: 50,
  },
  avatarImage: {
    borderRadius: 45,
    borderColor: color.bg.primary.color,
    borderWidth: 5,
  },
  continueButton: {
    fontSize: font.size.M,
    color: color.bg.secondary.font.quaternary,
  },
})
