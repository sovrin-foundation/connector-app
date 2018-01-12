import React, { PureComponent } from 'react'
import { Animated, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Container, CustomView, Icon } from '../components'
import Bubbles from './bubbles'
import { barStyleDark, OFFSET_3X } from '../common/styles'
import { getConnections, loadHistory } from '../store'
import { CLAIM_OFFER_STATUS } from '../claim-offer/type-claim-offer'
import { StackNavigator } from 'react-navigation'

export class DashboardScreen extends PureComponent {
  state = {
    scrollY: new Animated.Value(0),
  }

  componentWillMount() {
    this.props.loadHistory()
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
              <Bubbles
                navigation={this.props.navigation}
                height={bubblesHeight}
                connections={connections}
              />
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

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      loadHistory,
    },
    dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(DashboardScreen)

const styles = StyleSheet.create({
  userAvatarContainer: {
    marginVertical: OFFSET_3X,
  },
})
