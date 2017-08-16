import React, { PureComponent } from 'react'
import { View, Text, Image } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { resetInvitationStatus, sendUserInvitationResponse } from '../store'
import InvitationText from './invitation-text'
import InvitationActions from './invitation-actions'
import { Container } from '../components'

class Invitation extends PureComponent {
  state = {
    tapCount: 0,
  }

  _tapAvatar = () => {
    this.setState({ tapCount: this.state.tapCount + 1 })
  }

  _resetTapCount = () => {
    this.setState({ tapCount: 0 })
  }

  render() {
    return (
      <Container>
        <Container primary>
          <InvitationText {...this.props} tapAvatar={this._tapAvatar} />
        </Container>
        <View>
          <InvitationActions
            {...this.props}
            tapCount={this.state.tapCount}
            resetTapCount={this._resetTapCount}
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
}) => ({
  invitation,
  config,
  deepLink,
  pushNotification,
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
