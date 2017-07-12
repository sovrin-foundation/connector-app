import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  View,
  ScrollView,
  Image,
  TouchableHighlight,
  StyleSheet,
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
import { homeRoute, connectionRoute } from '../common/route-constants'
import {
  authenticationRequestReceived,
  pushNotificationReceived,
} from '../store'
import { handlePushNotification } from '../services'

const styles = StyleSheet.create({
  left: {
    marginLeft: 15,
    marginTop: 0,
  },
  right: {
    marginRight: 16.5,
    marginTop: 0,
  },
  title: {
    marginLeft: 34,
    marginRight: 24,
  },
})

const headerLeft = (
  <Image style={[styles.left]} source={require('../images/icon_Chat.png')} />
)

const headerTitle = (
  <Image
    style={[styles.title]}
    source={require('../images/sovrinsecuredconnection.png')}
  />
)

export class ConnectionHome extends PureComponent {
  static navigationOptions = ({ navigation }) => ({
    headerLeft: headerLeft,
    headerTitle: headerTitle,
    headerRight: (
      <TouchableHighlight onPress={() => navigation.navigate(homeRoute)}>
        <Image
          style={[styles.right]}
          source={require('../images/icon_Close.png')}
        />
      </TouchableHighlight>
    ),
    headerStyle: {
      backgroundColor: '#2A5270',
      height: 50,
    },
  })

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.pushNotification.notification !=
      this.props.pushNotification.notification
    ) {
      const { notification } = nextProps.pushNotification
      if (notification && notification.type === 'auth-req') {
        handlePushNotification(this.props, connectionRoute)
      }
    }
  }

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

const mapStateToProps = ({ route, pushNotification }) => ({
  route,
  pushNotification,
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      authenticationRequestReceived,
      pushNotificationReceived,
    },
    dispatch
  )

const ConnectedConnection = connect(mapStateToProps, mapDispatchToProps)(
  ConnectionHome
)

export default StackNavigator({
  [connectionRoute]: {
    screen: ConnectedConnection,
  },
})
