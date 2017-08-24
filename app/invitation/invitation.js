import React, { PureComponent } from 'react'
import { View, Text, Image } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { resetInvitationStatus, sendUserInvitationResponse } from '../store'
import InvitationText from './invitation-text'
import InvitationActions from './invitation-actions'
import { Container, CustomModal } from '../components'

class Invitation extends PureComponent {
  state = {
    tapCount: 0,
    isModalVisible: false,
  }

  _tapAvatar = () => {
    this.setState({ tapCount: this.state.tapCount + 1 })
  }

  _resetTapCount = () => {
    this.setState({ tapCount: 0 })
  }

  _toggleModal = (isModalVisible, route) => {
    this.setState({ isModalVisible })
    if (route) {
      this.props.navigation.navigate(route)
    }
  }

  render() {
    const { data } = this.props.invitation
    return (
      <Container>
        <Container primary>
          {data &&
            <InvitationText {...this.props} tapAvatar={this._tapAvatar} />}
        </Container>
        <View>
          <InvitationActions
            {...this.props}
            tapCount={this.state.tapCount}
            resetTapCount={this._resetTapCount}
            toggleModal={this._toggleModal}
          />
        </View>
      </Container>
    )
  }
}

const mapStateToProps = ({
  invitation,
  config,
  deepLink,
  pushNotification,
  connections,
}) => ({
  invitation,
  config,
  deepLink,
  pushNotification,
  connections,
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      resetInvitationStatus,
      sendUserInvitationResponse,
    },
    dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(Invitation)
