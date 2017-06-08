import React, { PureComponent } from 'react'
import { StyleSheet } from 'react-native'
import { Container, Avatar, Icon } from '../components'

export default props =>
  <Container row pad hCenter bottom>
    <Container left>
      <Icon
        medium
        iconStyle={[styles.historyIconStyle]}
        src={require('../invitation/images/icon_connectionHistory.jpg')}
      />
    </Container>
    <Container center>
      <Avatar large round src={require('../invitation/images/inviter.jpeg')} />
    </Container>
    <Container right>
      <Icon
        medium
        src={require('../invitation/images/icon_addConnection.jpg')}
      />
    </Container>
  </Container>

const styles = StyleSheet.create({
  start: {
    justifyContent: 'flex-start',
  },
  end: {
    alignSelf: 'flex-end',
  },
  historyIconStyle: {
    width: 35,
    height: 30,
  },
})
