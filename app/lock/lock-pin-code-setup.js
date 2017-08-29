// @flow
import React, { PureComponent } from 'react'
import { StyleSheet, Image } from 'react-native'
import { Icon } from 'react-native-elements'
import { StackNavigator } from 'react-navigation'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Container, CustomText, CustomButton } from '../components'
import {
  lockSelectionRoute,
  lockPinSetupHomeRoute,
  lockSetupSuccessRoute,
} from '../common'
import { color, OFFSET_2X } from '../common/styles'
import { setPinAction } from './lock-store'

const styles = StyleSheet.create({
  header: {
    backgroundColor: color.bg.primary.color,
    borderBottomWidth: 0,
    height: 50,
    padding: 0,
    paddingHorizontal: OFFSET_2X,
    shadowOpacity: 0,
  },
  headerLeft: {
    width: 20,
  },
})

const headerRight = <Icon name="help" color={color.bg.fifth.color} />

export class LockPinSetup extends PureComponent {
  static navigationOptions = ({ navigation }) => ({
    headerLeft: (
      <Image
        style={styles.headerLeft}
        source={require('../images/icon_backArrow.png')}
        resizeMode="contain"
        onPress={() => navigation.navigate(lockSelectionRoute)}
      />
    ),
    headerTitle: <CustomText semiBold>App Security</CustomText>,
    headerRight: headerRight,
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
