import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  ScrollView,
  Image,
  Animated,
  AsyncStorage,
  StatusBar,
} from 'react-native'
import { StackNavigator } from 'react-navigation'
import { Icon, Avatar } from 'react-native-elements'
import { View as AnimationView } from 'react-native-animatable'
import FCM, { FCMEvent } from 'react-native-fcm'

import Bubbles from './bubbles'
import User from './user'
import { setItem, getItem } from '../services/secure-storage'
import UserEnroll from '../components/user-enroll'
import {
  enroll,
  getUserInfo,
  getConnections,
  pushNotificationPermissionAction,
  avatarTapped,
  resetAvatarTapCount,
  sendUserInfo,
  changeServerEnvironmentToDemo,
  changeServerEnvironmentToSandbox,
} from '../store'
import {
  connectionDetailRoute,
  invitationRoute,
  homeRoute,
} from '../common/route-constants'
import {
  PUSH_COM_METHOD,
  IDENTIFIER,
  PHONE,
  SEED,
} from '../common/secure-storage-constants'
import { authenticationRequest } from '../invitation/invitation-store'

const headerTitle = (
  <Image source={require('../images/icon_connectorLogo.png')} />
)

export class HomeScreenDrawer extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: headerTitle,
    headerStyle: {
      backgroundColor: '#3F4140',
      borderBottomWidth: 0,
      height: 50,
      padding: 0,
    },
  })

  constructor(props) {
    super(props)
    this.state = {
      currentRoute: homeRoute,
      scrollY: new Animated.Value(0),
      isSwiping: false,
    }
  }

  componentWillMount() {
    // push notification events
    FCM.requestPermissions() // for iOS
    FCM.getFCMToken().then(token => {
      this.saveDeviceToken(token)
    })

    this.saveKey('newCurrentRoute', homeRoute)

    this.notificationListener = FCM.on(
      FCMEvent.Notification,
      async pushNotificationData => {
        this.handlePushNotification(pushNotificationData)
      }
    )

    FCM.getInitialNotification().then(pushNotificationData => {
      this.handlePushNotification(pushNotificationData)
    })

    this.refreshTokenListener = FCM.on(FCMEvent.RefreshToken, token => {
      this.saveDeviceToken(token)
    })

    // load data for home screen
    this.props.loadUserInfo()
    this.props.loadConnections()
  }

  handlePushNotification(notif) {
    if (pushNotificationData && pushNotificationData.type === 'auth-req') {
      this.props.authenticationRequest(pushNotificationData)
      this.getRoute().then(() => {
        if (this.state.currentRoute !== invitationRoute) {
          this.saveKey('newCurrentRoute', invitationRoute)
          this.props.navigation.navigate(invitationRoute)
        }
      })
    }
  }

  saveDeviceToken(token) {
    if (token) {
      setItem(PUSH_COM_METHOD, token)
        .then(() => {
          this.props.pushNotificationPermissionAction(true)
        })
        .catch(function(error) {
          console.log('LOG: error saveDeviceToken setItem, ', error)
        })
    }
  }

  componentWillUnmount() {
    // stop listening for events
    this.notificationListener.remove()
    this.refreshTokenListener.remove()
  }

  handleSwipe = isSwiping => {
    this.setState({ isSwiping })
  }

  async saveKey(key, value) {
    try {
      await AsyncStorage.setItem(key, value)
    } catch (error) {
      console.log('LOG: Error saving newCurrentRoute' + error)
    }
  }

  async getRoute() {
    try {
      const currentRoute = await AsyncStorage.getItem('newCurrentRoute')
      this.setState({ currentRoute })
    } catch (error) {
      console.log('LOG: Error retrieving newCurrentRoute' + error)
    }
  }

  render() {
    const bubblesHeight = this.state.scrollY.interpolate({
      inputRange: [0, 5],
      outputRange: [0, -5],
      extrapolate: 'clamp',
    })

    const { user, connections } = this.props

    return (
      <Animated.ScrollView
        scrollEnabled={!this.state.isSwiping}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }],
          { useNativeDriver: true }
        )}
        style={{ backgroundColor: '#3F4140' }}
      >
        <Bubbles height={bubblesHeight} connections={connections} />
        <AnimationView style={{ marginTop: 420 }}>
          <User user={user} isSwiping={this.handleSwipe} {...this.props} />
        </AnimationView>
        {this.props.pushNotification.isAllowed &&
          <UserEnroll
            enrollAction={this.props.enroll}
            config={this.props.config}
          />}
      </Animated.ScrollView>
    )
  }
}

const mapStateToProps = state => ({
  user: state.user,
  connections: state.connections,
  pushNotification: state.pushNotification,
  avatarTapCount: state.home.avatarTapCount,
  config: state.config,
})

const mapDispatchToProps = dispatch => ({
  enroll: (device, config) => dispatch(enroll(device, config)),
  loadUserInfo: () => dispatch(getUserInfo()),
  loadConnections: () => dispatch(getConnections()),
  changeServerEnvironmentToDemo: () =>
    dispatch(changeServerEnvironmentToDemo()),
  changeServerEnvironmentToSandbox: () =>
    dispatch(changeServerEnvironmentToSandbox()),
  pushNotificationPermissionAction: isAllowed =>
    dispatch(pushNotificationPermissionAction(isAllowed)),
  avatarTapped: () => dispatch(avatarTapped()),
  resetAvatarTapCount: () => dispatch(resetAvatarTapCount()),
  sendUserInfo: (context, config) => dispatch(sendUserInfo(context, config)),
})

const mapsStateDispatch = connect(mapStateToProps, mapDispatchToProps)(
  HomeScreenDrawer
)

export default StackNavigator({
  Home: {
    screen: mapsStateDispatch,
  },
})
