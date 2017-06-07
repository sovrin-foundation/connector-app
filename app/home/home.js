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
import { getUserInfo, getConnections, invitationReceived } from '../store'
import invitationData from '../invitation/data/invitation-data'
import { setItem, getItem } from '../services/secure-storage'
import { getKeyPairFromSeed, randomSeed } from '../services/keys'
import { isContainsDefined } from '../services/utils'
import bs58 from 'bs58'
import { Enroll, Poll } from './home-store'

class HomeScreenDrawer extends Component {
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
    OneSignal.addEventListener('ids', this.onIds)
    console.log('Home componentWillMount')
    this.props.loadUserInfo()
    this.props.loadConnections()
    // ensure that it runs only once, and not every time component is rendered
    Promise.all([
      getItem('identifier'),
      getItem('phone'),
      getItem('seed'),
    ]).then(
      values => {
        if (!isContainsDefined(values)) {
          this.enroll()
        } else {
          this.poll(values[0])
        }
      },
      error => {
        console.log(error)
      }
    )
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
      if (this.state.currentRoute !== 'Connections') {
        this.saveKey('newCurrentRoute', 'Connections')
        this.props.navigation.navigate('Connections')
      }
    })
  }

  onIds = device => {
    setItem('pushComMethod', device.userId)
  }

  poll = identifier => {
    this.props.poll(identifier)
    this.props.home.pollApi
      .then(res => {
        if (res.status == 200) {
          return res.json()
        } else {
          throw new Error('Bad Request')
        }
      })
      .then(resData => {
        if (resData.status === 'NO_RESPONSE_YET') {
          this.props.invitationReceived()
          this.resetKey('newCurrentRoute')
          this.saveKey('newCurrentRoute', 'Connections')
          this.props.navigation.navigate('Connections')
        } else {
          window.setTimeout(() => {
            this.poll(identifier)
          }, 4000)
        }
      })
      .catch(error =>
        window.setTimeout(() => {
          this.poll(identifier)
        }, 4000)
      )
  }

  enroll = () => {
    let phoneNumber = (Math.random() * 1000000000000000000)
      .toString()
      .substring(0, 10)
    let id = randomSeed(32).substring(0, 22)
    let seed = randomSeed(32).substring(0, 32)
    let { publicKey: verKey, secretKey: signingKey } = getKeyPairFromSeed(seed)

    verKey = bs58.encode(verKey)
    getItem('pushComMethod')
      .then(pushComMethod => {
        if (pushComMethod) {
          this.props.enroll({
            phoneNumber,
            id,
            verKey,
            pushComMethod,
          })
          this.props.home.enrollApi
            .then(res => {
              if (res.status == 200) {
                setItem('phone', phoneNumber)
                setItem('identifier', id)
                setItem('seed', seed)
              } else {
                throw new Error('Bad Request')
              }
            })
            .catch(console.log)
        } else {
          console.error('Device PushComMethod not present')
        }
      })
      .catch(console.log)
    this.poll(id)
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
  home: state.home,
})

const mapDispatchToProps = dispatch => ({
  loadUserInfo: () => dispatch(getUserInfo()),
  loadConnections: () => dispatch(getConnections()),
  invitationReceived: () => dispatch(invitationReceived(invitationData)),
  enroll: device => dispatch(Enroll(device)),
  poll: identifier => dispatch(Poll(identifier)),
})

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreenDrawer)
