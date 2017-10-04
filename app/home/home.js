import React, { PureComponent } from 'react'
import { Animated, StatusBar, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Container, CustomView, Icon } from '../components'
import Bubbles from './bubbles'
import { barStyleDark, OFFSET_3X } from '../common/styles'
import {
  getUserInfo,
  pushNotificationReceived,
  authenticationRequestReceived,
  getConnections,
} from '../store'
import { homeTabRoute, claimOfferRoute } from '../common'
import handlePushNotification from '../services/router'
import { CLAIM_OFFER_STATUS } from '../claim-offer/type-claim-offer'

export class DashboardScreen extends PureComponent {
  state = {
    scrollY: new Animated.Value(0),
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.pushNotification.notification &&
      nextProps.pushNotification.notification !=
        this.props.pushNotification.notification
    ) {
      const { notification } = nextProps.pushNotification
      handlePushNotification(nextProps, notification, homeTabRoute)
    }
  }

  componentDidMount() {
    // load data for home screen
    this.props.getUserInfo()

    // check if we have a claim offer with status as received
    if (this.props.claimOfferStatus === CLAIM_OFFER_STATUS.RECEIVED) {
      setTimeout(() => {
        // once user has entered the pin code to unlock app
        // user might have received push notification for claim offer
        // we did not open claim offer view from lock screen
        // because claim offer opens as a pop up modal which
        // slides in from bottom and then slides back down once closed
        // so, if we have pending claim offer to show
        // load it after a second dashboard is loaded
        this.props.navigation.navigate(claimOfferRoute)
      }, 1000)
    }
  }

  render() {
    const bubblesHeight = this.state.scrollY.interpolate({
      inputRange: [0, 5],
      outputRange: [0, -5],
      extrapolate: 'clamp',
    })

    const { connections: { data } } = this.props
    const connections = getConnections(data)

    return (
      <Container tertiary>
        <StatusBar barStyle={barStyleDark} />
        <Container tertiary>
          {connections &&
            connections.length > 0 && (
              <Bubbles height={bubblesHeight} connections={connections} />
            )}
        </Container>
        <CustomView vCenter style={[styles.userAvatarContainer]}>
          <Icon src={require('../images/UserAvatar.png')} extraLarge />
        </CustomView>
      </Container>
    )
  }
}

const mapStateToProps = state => ({
  user: state.user,
  connections: state.connections,
  pushNotification: state.pushNotification,
  route: state.route,
  claimOfferStatus: state.claimOffer.status,
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getUserInfo,
      pushNotificationReceived,
      authenticationRequestReceived,
    },
    dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(DashboardScreen)

const styles = StyleSheet.create({
  userAvatarContainer: {
    marginVertical: OFFSET_3X,
  },
})
