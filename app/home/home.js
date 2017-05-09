import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Animated,
  AsyncStorage,
} from 'react-native'
import { DrawerNavigator } from 'react-navigation'
import { Icon, Avatar } from 'react-native-elements'
import { View as AnimatableView } from 'react-native-animatable'
import OneSignal from 'react-native-onesignal'

import Bubbles from './bubbles'
import HomeScreenActions from './actions'

import { getUserInfo, getConnections } from '../store'

class HomeScreenDrawer extends Component {
  static navigationOptions = {
    title: 'Home',
  }

  constructor(props) {
    super(props)

    this.state = {
      currentRoute: 'Home',
      scrollY: new Animated.Value(0),
      isSwiping: false,
    }
  }

  componentWillMount() {
    OneSignal.addEventListener('opened', this.onOpened)
    console.log('Home componentWillMount')
    this.props.loadUserInfo()
    this.props.loadConnections()
    // ensure that it runs only once, and not every time component is rendered
    this.poll('testdemo1')
  }

  componentWillUnmount() {
    OneSignal.removeEventListener('opened', this.onOpened)
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
    this.getRoute().then(() => {
      this.saveKey(
        'PN_username',
        openResult.notification.payload.additionalData.userName
      )

      if (this.state.currentRoute !== 'Connections') {
        this.saveKey('newCurrentRoute', 'Connections')
        this.props.navigation.navigate('Connections')
      }
    })
  }

  poll = username => {
    fetch(`https://agency.evernym.com/callcenter/user/${username}/auth`, {
      mode: 'cors',
    })
      .then(res => {
        if (res.status == 200) {
          return res.json()
        } else {
          throw new Error('Bad Request')
        }
      })
      .then(resData => {
        if (resData.status === 'NO_RESPONSE_YET') {
          this.resetKey('newCurrentRoute')
          this.saveKey('PN_username', username)
          this.props.navigation.navigate('Connections')
        } else {
          window.setTimeout(() => {
            this.poll('testdemo1')
          }, 4000)
        }
      })
      .catch(error => console.log(error))
  }

  render() {
    const bubblesHeight = this.state.scrollY.interpolate({
      inputRange: [0, 5],
      outputRange: [0, -5],
      extrapolate: 'clamp',
    })

    const { user, connections } = this.props

    return (
      <View style={{ flex: 1 }}>
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
          <AnimatableView style={{ marginTop: 420 }}>
            <HomeScreenActions user={user} isSwiping={this.handleSwipe} />
          </AnimatableView>
        </Animated.ScrollView>
      </View>
    )
  }
}

const mapStateToProps = state => ({
  user: state.user,
  connections: state.connections,
})

const mapDispatchToProps = dispatch => ({
  loadUserInfo: () => dispatch(getUserInfo()),
  loadConnections: () => dispatch(getConnections()),
})

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreenDrawer)
