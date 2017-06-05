import React, { Component } from 'react'
import {
  View,
  Animated,
  InteractionManager,
  Platform,
  Dimensions,
  StyleSheet,
} from 'react-native'
import { View as AnimationView } from 'react-native-animatable'
import { StyledImage } from '../styled-components/common-styled'

const size = {
  XS: 40,
  S: 60,
  M: 80,
  L: 100,
  XL: 120,
  XXL: 140,
}

const bubbles = [
  { name: 'bh', image: require('../images/cbEDCU@3x.png'), size: size.L },
  { name: 'dell', image: require('../images/cbDell@1x.png'), size: size.S },
  { name: 'ebay', image: require('../images/cbEbay@1x.png'), size: size.M },
  { name: 'target', image: require('../images/cbTarget.png'), size: size.M },
  {
    name: 'centuryLink',
    image: require('../images/cbCenturyLink.png'),
    size: size.S,
  },
  {
    name: 'starbucks',
    image: require('../images/cbStarbucks.png'),
    size: size.XL,
  },
  {
    name: 'suncoast',
    image: require('../images/cbSuncoast.png'),
    size: size.XL,
  },
  { name: 'amazon', image: require('../images/Amazon.png'), size: size.XL },
  { name: 'dillard', image: require('../images/cbDillards.png'), size: size.M },
  { name: 'verizon', image: require('../images/Verizon.png'), size: size.M },
]

export default class ConnectionBubbles extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showBubble: false,
    }
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({ showBubble: true })
    })
  }

  render() {
    const { width } = Dimensions.get('window')
    let deviceClass = ''

    if (Platform.OS === 'ios') {
      deviceClass = width === 320
        ? 'Iphone5'
        : width === 414 ? 'IphonePlus' : 'ios'
    }

    return (
      <Animated.View
        style={[
          styles.bubbleContainer,
          { transform: [{ translateY: this.props.height }] },
        ]}
      >
        {bubbles.map(({ name, image, size }) => (
          <AnimationView
            animation="zoomIn"
            duration={600}
            delay={200}
            style={[
              styles.avatar,
              styles[name],
              styles[`${name}${deviceClass}`],
            ]}
            key={name}
          >
            <StyledImage
              size={[size, size]}
              source={image}
              resizeMode={'contain'}
            />
          </AnimationView>
        ))}
      </Animated.View>
    )
  }
}

const styles = (styles = StyleSheet.create({
  bubbleContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
    height: 420,
  },
  avatar: {
    position: 'absolute',
  },
  avatarImage: {
    resizeMode: 'contain',
  },
  bh: {
    top: 100,
    left: 2,
  },
  dell: {
    top: 50,
    left: 125,
  },
  ebay: {
    top: 60,
    left: 210,
  },
  target: {
    top: 120,
    right: 2,
  },
  centuryLink: {
    top: 210,
    left: 5,
  },
  starbucks: {
    top: 140,
    left: 120,
  },
  suncoast: {
    top: 210,
    right: 0,
  },
  amazon: {
    top: 290,
    left: 5,
  },
  dillard: {
    top: 290,
    left: 150,
  },
  verizon: {
    top: 340,
    right: 30,
  },
  dellIphone5: {
    top: 50,
    left: 115,
  },
  targetIphone5: {
    top: 130,
    right: 2,
  },
  starbucksIphone5: {
    top: 140,
    left: 100,
  },
  suncoastIphone5: {
    top: 210,
    right: 2,
  },
  dillardIphone5: {
    top: 290,
    left: 120,
  },
  starbucksIphonePlus: {
    top: 140,
    left: 150,
  },
  dillardIphonePlus: {
    top: 290,
    left: 160,
  },
}))
