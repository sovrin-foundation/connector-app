import React, { PureComponent } from 'react'
import { Animated, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Container, CustomView, Icon } from '../components'
import Bubbles from './bubbles'
import { barStyleDark, OFFSET_3X } from '../common/styles'
import { getConnections } from '../store'
import { CLAIM_OFFER_STATUS } from '../claim-offer/type-claim-offer'

export class DashboardScreen extends PureComponent {
  state = {
    scrollY: new Animated.Value(0),
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
  connections: state.connections,
})

export default connect(mapStateToProps, null)(DashboardScreen)

const styles = StyleSheet.create({
  userAvatarContainer: {
    marginVertical: OFFSET_3X,
  },
})
