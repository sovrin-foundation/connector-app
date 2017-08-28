// @flow
import React, { PureComponent } from 'react'
import { StyleSheet } from 'react-native'
import { StackNavigator } from 'react-navigation'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Container, CustomText, CustomButton } from '../components'
import { lockPinSetupHomeRoute, lockSetupSuccessRoute } from '../common'
import { color } from '../common/styles'
import { setPinAction } from './lock-store'

const styles = StyleSheet.create({
  header: {
    backgroundColor: color.bg.primary.color,
    borderBottomWidth: 0,
    height: 50,
    padding: 0,
    shadowOpacity: 0,
  },
})

export class LockPinSetup extends PureComponent {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: <CustomText>App Security</CustomText>,
    headerStyle: styles.header,
  })

  onPinSetup = () => {
    this.props.setPinAction('123456')
    this.props.navigation.navigate(lockSetupSuccessRoute)
  }

  render() {
    return (
      <Container primary center>
        <CustomButton
          primary
          title={'Set Pin Code'}
          onPress={this.onPinSetup}
        />
      </Container>
    )
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      setPinAction,
    },
    dispatch
  )

export default StackNavigator({
  [lockPinSetupHomeRoute]: {
    screen: connect(null, mapDispatchToProps)(LockPinSetup),
  },
})
