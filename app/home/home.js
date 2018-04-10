// @flow
import React, { PureComponent } from 'react'
import { Animated, StyleSheet, View } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Container, CustomView, Icon, UserAvatar } from '../components'
import Bubbles from './bubbles'
import { barStyleDark, OFFSET_3X, OFFSET_1X } from '../common/styles'
import { getConnections } from '../store'
import { CLAIM_OFFER_STATUS } from '../claim-offer/type-claim-offer'
import type { Store } from '../store/type-store'
import type { HomeProps, HomeState } from './type-home'
import { FEEDBACK_TEST_ID } from './home-constants'
import { Apptentive } from 'apptentive-react-native'

export class DashboardScreen extends PureComponent<HomeProps, HomeState> {
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
              <Bubbles
                navigation={this.props.navigation}
                height={bubblesHeight}
                connections={connections}
              />
            )}
        </Container>
        <CustomView vCenter style={[styles.userAvatarContainer]}>
          <UserAvatar />
        </CustomView>
        <View style={styles.floatIcon}>
          <Icon
            medium
            onPress={() => Apptentive.presentMessageCenter()}
            testID={FEEDBACK_TEST_ID}
            src={require('../images/icon_feedback_grey.png')}
          />
        </View>
      </Container>
    )
  }
}

const mapStateToProps = (state: Store) => ({
  connections: state.connections,
})

export default connect(mapStateToProps)(DashboardScreen)

const styles = StyleSheet.create({
  userAvatarContainer: {
    marginVertical: OFFSET_3X,
  },
  floatIcon: {
    position: 'absolute',
    right: OFFSET_1X,
    top: OFFSET_3X,
  },
})
