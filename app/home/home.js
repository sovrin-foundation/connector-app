import React, { Component } from 'react'
import { connect } from 'react-redux'
import { ScrollView, Image, Animated, StyleSheet } from 'react-native'
import { StackNavigator } from 'react-navigation'
import { Icon, Avatar } from 'react-native-elements'
import { View as AnimationView } from 'react-native-animatable'

import Bubbles from './bubbles'
import User from './user'
import { setItem, getItem } from '../services/secure-storage'
import UserEnroll from '../components/user-enroll'
import {
  getUserInfo,
  getConnections,
  pushNotificationReceived,
  avatarTapped,
  resetAvatarTapCount,
  sendUserInfo,
  changeServerEnvironmentToDemo,
  changeServerEnvironmentToSandbox,
  authenticationRequestReceived,
} from '../store'
import { homeRoute } from '../common/route-constants'
import {
  PUSH_COM_METHOD,
  IDENTIFIER,
  PHONE,
  SEED,
} from '../common/secure-storage-constants'
import { authenticationRequest } from '../invitation/invitation-store'
import { handlePushNotification } from '../services'

const style = StyleSheet.create({
  headerIcon: {
    width: 26,
    height: 26,
  },
})

const headerTitle = (
  <Image
    source={require('../images/launchLogo.png')}
    style={style.headerIcon}
    resizeMode="contain"
  />
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
    // load data for home screen
    this.props.loadUserInfo()
    this.props.loadConnections()
  }

  handleSwipe = isSwiping => {
    this.setState({ isSwiping })
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.pushNotification.notification !=
      this.props.pushNotification.notification
    ) {
      const { notification } = nextProps.pushNotification
      if (notification && notification.type === 'auth-req') {
        //TODO: pass nextProps in place of this.props
        handlePushNotification(this.props, notification, homeRoute)
      }
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
        <AnimationView style={{ marginTop: 402 }}>
          <User user={user} isSwiping={this.handleSwipe} {...this.props} />
        </AnimationView>
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
  route: state.route,
})

const mapDispatchToProps = dispatch => ({
  loadUserInfo: () => dispatch(getUserInfo()),
  loadConnections: () => dispatch(getConnections()),
  changeServerEnvironmentToDemo: () =>
    dispatch(changeServerEnvironmentToDemo()),
  changeServerEnvironmentToSandbox: () =>
    dispatch(changeServerEnvironmentToSandbox()),
  pushNotificationReceived: data => dispatch(pushNotificationReceived(data)),
  avatarTapped: () => dispatch(avatarTapped()),
  resetAvatarTapCount: () => dispatch(resetAvatarTapCount()),
  sendUserInfo: (context, config) => dispatch(sendUserInfo(context, config)),
  authenticationRequestReceived: data =>
    dispatch(authenticationRequestReceived(data)),
})

const mapsStateDispatch = connect(mapStateToProps, mapDispatchToProps)(
  HomeScreenDrawer
)

export default StackNavigator({
  Home: {
    screen: mapsStateDispatch,
  },
})
