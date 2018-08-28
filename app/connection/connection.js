// @flow
import React, { PureComponent } from 'react'
import {
  View,
  ScrollView,
  Image,
  TouchableHighlight,
  StyleSheet,
} from 'react-native'
import { createStackNavigator } from 'react-navigation'
import { Icon } from 'react-native-elements'
import { Badge, InfoSectionList, CustomView } from '../components'
import ConnectionStatus from './connection-status'
import ConnectionInfo from './connection-info'
import { homeRoute, connectionRoute } from '../common/route-constants'
import { veniceBlue } from '../common/styles/constant'

const styles = StyleSheet.create({
  left: {
    width: 24,
    height: 24,
    marginLeft: 15,
  },
  right: {
    width: 22,
    height: 22,
    marginRight: 15,
  },
  title: {
    width: 160,
  },
})

const headerLeft = (
  <Image
    style={[styles.left]}
    source={require('../images/icon_Chat.png')}
    resizeMode="contain"
  />
)

const headerTitle = (
  <Image
    style={[styles.title]}
    source={require('../images/SovrinSecuredConnection.png')}
    resizeMode="contain"
  />
)
//Note: This page is not in use. [ND 23/08/2018]
export class ConnectionHome extends PureComponent<void, void> {
  static navigationOptions = ({ navigation }) => ({
    headerLeft: headerLeft,
    headerTitle: headerTitle,
    headerRight: (
      <CustomView>
        <TouchableHighlight
          onPress={() => navigation.navigate(homeRoute)}
          testID={'connection-header-close'}
          underlayColor={veniceBlue}
        >
          <Image
            testID="connection-header-close-image"
            accessible={true}
            accessibilityLabel={'connection-header-close-image'}
            style={[styles.right]}
            source={require('../images/icon_close.png')}
            onPress={() => navigation.navigate(homeRoute)}
          />
        </TouchableHighlight>
      </CustomView>
    ),
    headerStyle: {
      backgroundColor: veniceBlue,
      height: 50,
    },
  })

  render() {
    return (
      <ScrollView>
        <ConnectionStatus />
        <InfoSectionList>
          <ConnectionInfo />
        </InfoSectionList>
      </ScrollView>
    )
  }
}

export default createStackNavigator({
  [connectionRoute]: {
    screen: ConnectionHome,
  },
})
