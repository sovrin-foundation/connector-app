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
import { getKeyPairFromSeed, randomSeed } from '../services/keys'
import bs58 from 'bs58'
import { connectionDetailRoute } from '../common/route-constants'

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

    // TODO: Move it to the redux store and use sagas to load data
    // ensure that it runs only once, and not every time component is rendered
    Promise.all([
      getItem('identifier'),
      getItem('phone'),
      getItem('seed'),
    ]).then(
      values => {
        if (values.length == 0) {
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
      if (this.state.currentRoute !== invitationRoute) {
        this.saveKey('newCurrentRoute', invitationRoute)
        this.props.navigation.navigate(invitationRoute)
      }
    })
  }

  onIds = device => {
    setItem('pushComMethod', device.userId)
  }

  poll = identifier => {
    // TODO:KS Add signature
    fetch(`https://agency.evernym.com/agent/id/${identifier}/auth`, {
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
          this.props.invitationReceived()
          this.saveKey('newCurrentRoute', invitationRoute)
          this.props.navigation.navigate(invitationRoute)
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
      .then(function(pushComMethod) {
        if (pushComMethod) {
          // TODO:KS Add signature
          fetch(`https://callcenter.evernym.com/agent/enroll`, {
            method: 'POST',
            mode: 'cors',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              phoneNumber,
              id,
              verKey,
              pushComMethod,
            }),
          })
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
      </Animated.ScrollView>
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
  invitationReceived: () => dispatch(invitationReceived(invitationData)),
})

const mapsStateDispatch = connect(mapStateToProps, mapDispatchToProps)(
  HomeScreenDrawer
)

export default StackNavigator({
  Home: {
    screen: mapsStateDispatch,
  },
})
