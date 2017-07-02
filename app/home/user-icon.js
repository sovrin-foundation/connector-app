import React, { PureComponent } from 'react'
import { StyleSheet } from 'react-native'
import { Container, Avatar, Icon } from '../components'

export default props => (
  <Container row pad hCenter bottom>
    <Container left>
      <Icon
        medium
        onPress={props.changeServerEnvironmentToDemo}
        iconStyle={[styles.iconStyle]}
        src={require('../images/mainMenu.png')}
      />
    </Container>
    <Container center>
      <Avatar large round src={require('../invitation/images/inviter.jpeg')} />
    </Container>
    <Container right>
      <Icon
        medium
        onPress={props.changeServerEnvironmentToSandbox}
        iconStyle={[styles.iconStyle]}
        src={require('../invitation/images/icon_addConnection.jpg')}
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
    width: 25,
    height: 25,
    marginBottom: 20,
    marginLeft: 15,
  },
})
