import React, { PureComponent } from 'react'
import { View, Text, Image } from 'react-native'
import { connect } from 'react-redux'

import { invitationAccepted, invitationRejected } from './invitation-store'
import InvitationText from './invitation-text'
import InvitationActions from './invitation-actions'
import { Container, CustomText } from '../components'
import { sendUserInvitationResponse } from './invitation-store'

class Invitation extends PureComponent {
  render() {
    const { invitation, onAllow, onDeny } = this.props

    return (
      <Container>
        <Container primary>
          <InvitationText invitation={invitation} {...this.props} />
        </Container>
        <View>
          <InvitationActions
            onAllow={onAllow}
            onDeny={onDeny}
            {...this.props}
          />
        </View>
      </Container>
    )
  }
}

const mapStateToProps = ({ invitation }) => ({
  invitation,
})

const mapDispatchToProps = dispatch => ({
  onAllow: () => dispatch(invitationAccepted()),
  onDeny: () => dispatch(invitationRejected()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Invitation)
