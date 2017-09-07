import React, { Component } from 'react'
import {
  ScrollView,
  Image,
  Animated,
  View,
  StatusBar,
  StyleSheet,
} from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { StackNavigator } from 'react-navigation'
import { Icon, Avatar } from 'react-native-elements'

import { CustomView } from '../components/layout'
import { Container, CustomText } from '../components'
import Bubbles from './bubbles'
import User from './user'
import Footer from '../components/footer'
import { color, barStyleDark } from '../common/styles/constant'
import { settingsRoute } from '../common/route-constants'
import styles from '../components/layout/layout-style'

import {
  getUserInfo,
  pushNotificationReceived,
  changeServerEnvironmentToDemo,
  changeServerEnvironmentToSandbox,
  authenticationRequestReceived,
  getConnections,
} from '../store'
import { homeRoute } from '../common'
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

const dimGray = color.bg.tertiary.font.secondary
const whiteSmoke = color.bg.fifth.color

export class HomeScreenDrawer extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: headerTitle,
    headerStyle: {
      backgroundColor: whiteSmoke,
      borderBottomWidth: 0,
      height: 50,
      padding: 0,
      shadowOpacity: 0,
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
    this.props.getUserInfo()
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

    const { user, connections: { data } } = this.props
    const connectionsData = getConnections(data)

    if (!connectionsData || (connectionsData && connectionsData.length <= 0)) {
      return (
        <View style={[styles.container, styles.fifthBg]}>
          <StatusBar barStyle={barStyleDark} />
          <Container backgroundColor={color.bg.fifth.color}>
            <View style={[styles.container]}>
              <View style={[styles.container, styles.center]}>
                <CustomText
                  h5
                  bg={dimGray}
                  center
                  lineHeight={30}
                  testID="no-connection-text-1"
                  onPress={() => {
                    this.setState({ connectionRequestCount: 1 })
                  }}
                >
                  You don't have any
                </CustomText>
                <CustomText h5 bg={dimGray} center>
                  connections set up yet
                </CustomText>
                <CustomText h5 bg={dimGray} center>
                  Call a participating Credit
                </CustomText>
                <CustomText h5 bg={dimGray} center>
                  Union to get started
                </CustomText>
              </View>
            </View>
            <Footer navigation={this.props.navigation} />
          </Container>
        </View>
      )
    } else {
      return (
        // TODO: fix home screen with bubbles
        (
          <View style={[styles.container, styles.fifthBg]}>
            <StatusBar barStyle={barStyleDark} />
            <Container backgroundColor={color.bg.fifth.color}>
              <View style={[styles.container]}>
                <Bubbles height={bubblesHeight} connections={connectionsData} />
              </View>
              <Footer navigation={this.props.navigation} />
            </Container>
          </View>
        )
      )
    }
  }
}

const mapStateToProps = state => ({
  user: state.user,
  connections: state.connections,
  pushNotification: state.pushNotification,
  config: state.config,
  route: state.route,
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getUserInfo,
      changeServerEnvironmentToDemo,
      changeServerEnvironmentToSandbox,
      pushNotificationReceived,
      authenticationRequestReceived,
    },
    dispatch
  )

const mapsStateDispatch = connect(mapStateToProps, mapDispatchToProps)(
  HomeScreenDrawer
)

export default StackNavigator({
  Home: {
    screen: mapsStateDispatch,
  },
})
