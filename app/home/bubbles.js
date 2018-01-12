// @flow
import React, { PureComponent } from 'react'
import {
  Animated,
  InteractionManager,
  Platform,
  Dimensions,
  StyleSheet,
} from 'react-native'
import { View as AnimationView } from 'react-native-animatable'
import { Avatar } from '../components'
import { bubbleSize } from '../common/styles'
import { connectionHistoryRoute } from '../common/route-constants'
import { StackNavigator } from 'react-navigation'

export class Bubble extends PureComponent {
  state = {
    failed: false,
  }

  _onLoad = () => {
    this.setState({ failed: false })
  }

  _onError = () => {
    this.setState({ failed: true })
  }

  goHistoryView = (senderName: string, image: string, senderDID: string) => {
    this.props.navigation.navigate(connectionHistoryRoute, {
      senderName,
      image,
      senderDID,
    })
  }

  render() {
    let { size, image, testID, senderName, senderDID } = this.props
    let source
    if (this.state.failed || Number.isInteger(image) || !image) {
      source = require('../images/cb_evernym.png')
    }

    if (typeof image === 'string') {
      source = { uri: image }
    }

    return (
      <Avatar
        large
        shadow
        src={source}
        onLoad={this._onLoad}
        onError={this._onError}
        testID={testID}
        onPress={() => this.goHistoryView(senderName, image, senderDID)}
      />
    )
  }
}

export default class ConnectionBubbles extends PureComponent {
  render() {
    const { width } = Dimensions.get('window')
    let deviceClass = ''

    if (Platform.OS === 'ios') {
      deviceClass =
        width === 320 ? 'Iphone5' : width === 414 ? 'IphonePlus' : 'ios'
    }
    const enterprises = [
      'evernym',
      'ebay',
      'verizon',
      'suncoast',
      'dell',
      'bh',
      'dillard',
      'edcu',
      'agency',
    ]
    const connections = this.props.connections.map((connection, index) => ({
      ...connection,
      name: enterprises[index] || 'verizon',
    }))
    return (
      <Animated.View
        style={[
          styles.bubbleContainer,
          { transform: [{ translateY: this.props.height }] },
        ]}
      >
        {connections.map(
          ({ identifier, name, logoUrl, size, senderName, senderDID }) => (
            <AnimationView
              animation="zoomIn"
              duration={600}
              delay={200}
              style={[
                styles.avatar,
                styles[name.toLowerCase()],
                styles[`${name.toLowerCase()}${deviceClass}`],
              ]}
              key={identifier}
            >
              <Bubble
                size={size}
                image={logoUrl}
                testID={`bubble-${identifier}`}
                senderName={senderName}
                senderDID={senderDID}
                navigation={this.props.navigation}
              />
            </AnimationView>
          )
        )}
      </Animated.View>
    )
  }
}

const styles = StyleSheet.create({
  bubbleContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
    // TODO this height should be calculated automatically
    // these styles are in absolute position due to early stage design
    // of home screen, we used to scroll on this screen,
    // and this height was being animated as we scroll on page
    // now we don't need to scroll and we can directly use <Container />
    // for bubbles, for now fixing the height, but we need to fix this component
    height: 380,
  },
  avatar: {
    position: 'absolute',
  },
  avatarImage: {
    resizeMode: 'contain',
  },
  bh: {
    top: 70,
    left: 2,
  },
  dell: {
    top: 5,
    left: 115,
  },
  ebay: {
    top: 30,
    left: 250,
  },
  target: {
    top: 90,
    right: 2,
  },
  centuryLink: {
    top: 180,
    left: 5,
  },
  starbucks: {
    top: 110,
    left: 120,
  },
  suncoast: {
    top: 180,
    right: 0,
  },
  amazon: {
    top: 260,
    left: 5,
  },
  dillard: {
    top: 130,
    left: 150,
  },
  verizon: {
    top: 255,
    left: 150,
  },
  dellIphone5: {
    top: 20,
    left: 115,
  },
  targetIphone5: {
    top: 100,
    right: 2,
  },
  starbucksIphone5: {
    top: 110,
    left: 100,
  },
  suncoastIphone5: {
    top: 180,
    right: 2,
  },
  dillardIphone5: {
    top: 130,
    left: 150,
  },
  starbucksIphonePlus: {
    top: 110,
    left: 150,
  },
  dillardIphonePlus: {
    top: 130,
    left: 150,
  },

  // multiple connections specific styles
  evernym: {
    top: 180,
    left: 15,
  },
  evernymIphone5: {
    top: 180,
    left: 15,
  },
  edcu: {
    top: 30,
    left: 50,
  },
  edcuIphone5: {
    top: 30,
    left: 50,
  },
  agency: {
    top: 30,
    left: 100,
  },
})
