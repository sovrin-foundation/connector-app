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
import invitationData from '../invitation/data/invitation-data'
import { setItem, getItem } from '../services/secure-storage'
import EnrollUser from '../components/user-enroll'
import {
  getUserInfo,
  getConnections,
  invitationReceived,
  getSecureStorage,
  pnPermission,
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

const headerLeft = (
  <Image
    style={{ marginLeft: 10 }}
    source={require('../images/icon_Menu.png')}
  />
)
const headerTitle = (
  <Image source={require('../images/icon_connectorLogo.png')} />
)
const headerRight = (
  <Image
    style={{ marginRight: 10 }}
    source={require('../images/icon_Search.png')}
  />
)

export class HomeScreenDrawer extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerLeft: headerLeft,
    title: headerTitle,
    headerRight: headerRight,
    headerStyle: {
      backgroundColor: '#3F4140',
      borderBottomWidth: 0,
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
      console.log('LOG: getFCMToken', token)
    })

    this.saveKey('newCurrentRoute', homeRoute)

    this.notificationListener = FCM.on(FCMEvent.Notification, async notif => {
      this.handlePN(notif)
    })

    FCM.getInitialNotification().then(notif => {
      this.handlePN(notif)
    })

    this.refreshTokenListener = FCM.on(FCMEvent.RefreshToken, token => {
      this.saveDeviceToken(token)
    })

    // load secure storage
    this.props.loadSecureStorage()

    // load data for home screen
    this.props.loadUserInfo()
    this.props.loadConnections()
  }

  handlePN(notif) {
    if (notif && notif.type === 'auth-req') {
      this.props.invitationReceived()
      this.getRoute().then(() => {
        if (this.state.currentRoute !== invitationRoute) {
          this.saveKey('newCurrentRoute', invitationRoute)
          this.props.navigation.navigate(invitationRoute)
        }
      })
    }
  }

  saveDeviceToken(token) {
    setItem(PUSH_COM_METHOD, token)
      .then(() => {
        this.userAllowedPushNotification = true
        console.log('LOG: saveDeviceToken setItem, ', token)
      })
      .catch(function(error) {
        console.log('LOG: saveDeviceToken setItem error, ', error)
      })
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

  async resetKey(key) {
    try {
      await AsyncStorage.removeItem(key)
    } catch (error) {
      console.log('LOG: Error saving newCurrentRoute' + error)
    }
  }

  enrollSuccess() {
    setItem(PHONE, phoneNumber)
    setItem(IDENTIFIER, id)
    setItem(SEED, seed)
    this.props.loadSecureStorage()
  }

  render() {
    const bubblesHeight = this.state.scrollY.interpolate({
      inputRange: [0, 5],
      outputRange: [0, -5],
      extrapolate: 'clamp',
    })

    const { user, connections } = this.props

    const { enrollResponse, pollResponse } = this.props.home
    if (
      enrollResponse &&
      enrollResponse.data &&
      enrollResponse.data.status === 200
    ) {
      this.enrollSuccess()
    }

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
          <User user={user} isSwiping={this.handleSwipe} />
        </AnimationView>
        <EnrollUser />
      </Animated.ScrollView>
    )
  }
}

const mapStateToProps = state => ({
  user: state.user,
  connections: state.connections,
  PNStore: state.PNStore,
  home: state.home,
  secureStorageStore: state.secureStorageStore,
})

const mapDispatchToProps = dispatch => ({
  loadUserInfo: () => dispatch(getUserInfo()),
  loadConnections: () => dispatch(getConnections()),
  invitationReceived: () => dispatch(invitationReceived(invitationData)),
  pnPermission: isAllowed => dispatch(pnPermission(isAllowed)),
  loadSecureStorage: () => dispatch(getSecureStorage()),
})

const mapsStateDispatch = connect(mapStateToProps, mapDispatchToProps)(
  HomeScreenDrawer
)

export default StackNavigator({
  Home: {
    screen: mapsStateDispatch,
  },
})
