import React, { PureComponent } from 'react'
import { View, Text, Image } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { resetInvitationStatus, sendUserInvitationResponse } from '../store'
import InvitationText from './invitation-text'
import InvitationActions from './invitation-actions'
import { Container, CustomText } from '../components'

class Invitation extends PureComponent {
  render() {
    return (
      <Container>
        <Container primary>
          <InvitationText {...this.props} />
        </Container>
        <View>
          <InvitationActions {...this.props} />
        </View>
      </Container>
    )
  }
}

const mapStateToProps = ({ invitation, config, deepLink }) => ({
  invitation,
  config,
  deepLink,
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
