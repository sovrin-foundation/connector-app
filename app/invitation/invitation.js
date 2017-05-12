import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import { Avatar, Text, Icon, Button } from 'react-native-elements'
import { connect } from 'react-redux'

import { invitationAccepted, invitationRejected } from './invitation-store'
import InvitationText from './invite-text'
import InvitationActions from './invitation-actions'

const Invitation = props => {
  const { invitation, onAllow, onDeny } = props
  return (
    <View style={styles.container}>
      <View style={styles.inviteContainer}>
        <InvitationText invitation={invitation} {...props} />
      </View>
      <View>
        <InvitationActions onAllow={onAllow} onDeny={onDeny} {...props} />
      </View>
    </View>
  )
}

const mapStateToProps = ({ invitation }) => ({
  invitation,
})

const mapDispatchToProps = dispatch => ({
  onAllow: () => dispatch(invitationAccepted()),
  onDeny: () => dispatch(invitationRejected()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Invitation)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  inviteContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
