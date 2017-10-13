import React, { PureComponent } from 'react'
import { StyleSheet } from 'react-native'
import { Container, Avatar, Icon } from '../components'

export default props => (
  <Container row pad hCenter bottom>
    <Container left>
      <Icon
        onPress={props.changeServerEnvironmentToDemo}
        iconStyle={[styles.iconStyle, styles.iconStyleMenu]}
        src={require('../images/mainMenu.png')}
      />
    </Container>
    <Container center>
      <Avatar large round src={require('../images/invitee.png')} />
    </Container>
    <Container right>
      <Icon
        onPress={props.changeServerEnvironmentToSandbox}
        iconStyle={[styles.iconStyle, styles.iconStyleAdd]}
        src={require('../images/icon_addConnection.jpg')}
      />
    </Container>
  </Container>
)

const styles = StyleSheet.create({
  start: {
    justifyContent: 'flex-start',
  },
  end: {
    alignSelf: 'flex-end',
  },
  iconStyle: {
    marginBottom: 20,
  },
  iconStyleMenu: {
    width: 24,
    height: 24,
  },
  iconStyleAdd: {
    width: 30,
    height: 30,
  },
})
