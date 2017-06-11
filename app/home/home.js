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
import { DrawerNavigator } from 'react-navigation'
import { Icon, Avatar } from 'react-native-elements'
import { View as AnimationView } from 'react-native-animatable'
import OneSignal from 'react-native-onesignal'

import Bubbles from './bubbles'
import User from './user'
import { getUserInfo, getConnections, invitationReceived } from '../store'
import invitationData from '../invitation/data/invitation-data'
import { setItem, getItem } from '../services/secure-storage'
import { PNPermission } from '../store/pn-store'
import {
  connectionDetailRoute,
  invitationRoute,
} from '../common/route-constants'
import EnrollUser from '../components/user-enroll'

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

class HomeScreenDrawer extends Component {
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
      currentRoute: 'Home',
      scrollY: new Animated.Value(0),
      isSwiping: false,
    }
  }

  componentWillMount() {
    // push notification events
    OneSignal.addEventListener('opened', this.onOpened)
    OneSignal.addEventListener('ids', this.onIds)

    // load data for home screen
    this.props.loadUserInfo()
    this.props.loadConnections()
  }

  componentWillUnmount() {
    OneSignal.removeEventListener('opened', this.onOpened)
    OneSignal.removeEventListener('ids', this.onIds)
  }

  handleSwipe = isSwiping => {
    this.setState({ isSwiping })
  }

  async saveKey(key, value) {
    try {
      await AsyncStorage.setItem(key, value)
    } catch (error) {
      console.log('Error saving newCurrentRoute' + error)
    }
  }

  async getRoute() {
    try {
      const currentRoute = await AsyncStorage.getItem('newCurrentRoute')
      this.setState({ currentRoute })
    } catch (error) {
      console.log('Error retrieving newCurrentRoute' + error)
    }
  }

  async resetKey(key) {
    try {
      await AsyncStorage.removeItem(key)
    } catch (error) {
      console.log('Error saving newCurrentRoute' + error)
    }
  }

  onOpened = openResult => {
    this.props.invitationReceived()
    this.getRoute().then(() => {
      if (this.state.currentRoute !== invitationRoute) {
        this.saveKey('newCurrentRoute', invitationRoute)
        this.props.navigation.navigate(invitationRoute)
      }
    })
  }

  onIds = device => {
    setItem('pushComMethod', device.userId)
      .then(() => {
        this.props.pnPermission(true)
      })
      .catch(function(error) {
        console.log('LOG: onIds setItem error, ', error)
      })
  }

  enrollSuccess() {
    setItem('phone', phoneNumber)
    setItem('identifier', id)
    setItem('seed', seed)
  }

  pollSuccess() {
    this.props.invitationReceived()
    this.saveKey('newCurrentRoute', invitationRoute)
    this.props.navigation.navigate(invitationRoute)
  }

  render() {
    const bubblesHeight = this.state.scrollY.interpolate({
      inputRange: [0, 5],
      outputRange: [0, -5],
      extrapolate: 'clamp',
    })

    const { user, connections } = this.props

    const { enrollRes, pollRes } = this.props.home
    if (enrollRes && enrollRes.data && enrollRes.data.status === 200) {
      this.enrollSuccess()
    }
    if (
      pollRes &&
      pollRes.data &&
      pollRes.data &&
      pollRes.data.status === 'NO_RESPONSE_YET'
    ) {
      this.pollSuccess()
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
})

const mapDispatchToProps = dispatch => ({
  loadUserInfo: () => dispatch(getUserInfo()),
  loadConnections: () => dispatch(getConnections()),
  invitationReceived: () => dispatch(invitationReceived(invitationData)),
  pnPermission: isAllowed => dispatch(PNPermission(isAllowed)),
})

const mapsStateDispatch = connect(mapStateToProps, mapDispatchToProps)(
  HomeScreenDrawer
)

export default StackNavigator({
  Home: {
    screen: mapsStateDispatch,
  },
})
