// @flow
import React, { PureComponent } from 'react'
import { StyleSheet, Image, TouchableHighlight } from 'react-native'
import { StackNavigator } from 'react-navigation'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Container, CustomText, CustomButton, CustomView } from '../components'
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

export class LockPinSetup extends PureComponent {
  static navigationOptions = ({ navigation }) => ({
    headerLeft: (
      <CustomView>
        <TouchableHighlight
          testID={'back-button'}
          onPress={() => navigation.navigate(lockSelectionRoute)}
        >
          <Image
            testID={'back-arrow'}
            style={styles.headerLeft}
            source={require('../images/icon_backArrow.png')}
            resizeMode="contain"
            onPress={() => navigation.navigate(lockSelectionRoute)}
          />
        </TouchableHighlight>
      </CustomView>
    ),
    headerTitle: <CustomText semiBold>App Security</CustomText>,
    headerRight: (
      <Image
        testID={'education-icon'}
        style={styles.headerLeft}
        source={require('../images/education.png')}
        resizeMode="contain"
      />
    ),
    headerStyle: styles.header,
  })

  onPinSetup = () => {
    this.props.setPinAction('123456')
    this.props.navigation.navigate(lockSetupSuccessRoute)
  }

  render() {
    return (
      <Container senary center>
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
