import React, { PureComponent } from 'react'
import {
  View,
  Text,
  Button,
  ScrollView,
  Image,
  AsyncStorage,
  TouchableHighlight,
} from 'react-native'
import { StackNavigator } from 'react-navigation'
import { Icon } from 'react-native-elements'

import {
  Badge,
  Divider,
  UserInfoAvatarSection,
  InfoSectionList,
  UserInfoEmailSection,
  UserInfoAddressSection,
  UserInfoPhoneSection,
  IdentifyingInfoSection,
} from '../components'
import ConnectionStatus from './connection-status'
import ConnectionInfo from './connection-info'
import user from '../store/data/user'

const headerLeft = (
  <Image
    style={{ marginLeft: 15 }}
    source={require('../images/icon_Chat.png')}
  />
)
const headerTitle = (
  <Image source={require('../images/sovrinsecuredconnection.png')} />
)

export class ConnectionHome extends PureComponent {
  static navigationOptions = ({ navigation }) => ({
    headerLeft: headerLeft,
    title: headerTitle,
    headerRight: (
      <TouchableHighlight
        onPress={() => {
          saveRoute = async value => {
            try {
              await AsyncStorage.setItem('newCurrentRoute', value)
            } catch (error) {
              console.log('Error saving newCurrentRoute' + error)
            }
          }
          this.saveRoute('Home')
          navigation.navigate('Home')
        }}
      >
        <Image
          style={{ marginRight: 16.5 }}
          source={require('../images/icon_Close.png')}
        />
      </TouchableHighlight>
    ),
    headerStyle: {
      backgroundColor: '#2A5270',
    },
  })

  render() {
    return (
      <ScrollView>
        <ConnectionStatus />
        <InfoSectionList>
          <ConnectionInfo />
          <UserInfoAvatarSection />
          <IdentifyingInfoSection infos={user.identifyingInfo} />
          <UserInfoEmailSection emails={user.emails} />
          <UserInfoAddressSection addresses={user.addresses} />
          <UserInfoPhoneSection phones={user.phones} />
        </InfoSectionList>
      </ScrollView>
    )
  }
}

export default StackNavigator(
  {
    Connections: {
      screen: ConnectionHome,
    },
  },
  {}
)
