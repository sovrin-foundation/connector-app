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
import { connectionHistoryRoute } from '../common/route-constants'
import type { BubbleState, BubbleProps, BubblesProps } from './type-home'

export class Bubble extends PureComponent<BubbleProps, BubbleState> {
  state = {
    failed: false,
  }

  _onLoad = () => {
    this.setState({ failed: false })
  }

  _onError = () => {
    this.setState({ failed: true })
  }

  goHistoryView = (senderName: string, image: ?string, senderDID: string) => {
    this.props.navigation.navigate(connectionHistoryRoute, {
      senderName,
      image,
      senderDID,
    })
  }

  render() {
    const { image, testID, senderName, senderDID } = this.props
    let source

    if (this.state.failed || Number.isInteger(image) || !image) {
      source = require('../images/cb_evernym.png')
    }

    if (typeof this.props.image === 'string') {
      source = { uri: image }
    }

    return (
      <Avatar
        medium
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

export default class ConnectionBubbles extends PureComponent<
  BubblesProps,
  void
> {
  getBubblePosition = (
    bubbleIndex: number,
    deviceWidth: number,
    deviceHeight: number
  ) => {
    //returns top and left position of the connection bubble
    //based on the bubbleIndex the position is calculated

    //top position for 0th bubble
    let verticalOffset = deviceHeight / 2
    //left position for 0th bubble should be somewhere around the mid of the device
    //we are subtracting 30 to adjust the bubble width in the offset
    //so that center of bubble comes in mid
    let horizontalOffset = deviceWidth / 2 - 30

    // we adjust the width and height of bubble just to calculate position
    // we need to adjust width because there will be only 3 bubbles in a row
    // but that row will also contain space between bubbles
    // and will also have margin on both side of screen horizontally
    // so, we assume that each bubble adjusted (margin+spacing+gutter space)
    // will be calculated by dividing device width in 3 columns
    // along with .5 as adjustment for (margin+spacing+gutter space)
    // so, suppose a bubble width is 80, and whole screen width would be 320 (iphone5)
    // then, considering space, margin, bubble width, adjustments would be
    // ~92
    const bubbleAdjustedWidth = deviceWidth / 3.5

    //we need to adjust bubbles in a column with some space in between
    //such that atleast 3 bubbles get adjusted
    //so if deviceHeight is 568 and
    //bubble container is having height 426(75%of deviceHeight)
    //bubbleAdjustedHeight will be 113
    const bubbleAdjustedHeight = deviceHeight / 5

    //add some more vertical offset to the columns on the left and right
    //since their top value is more than the middle column
    const edgeVerticalOffset = 50

    //calculate position of the bubble in its column
    let verticalRowIndex = Math.floor(bubbleIndex / 3)

    if (bubbleIndex % 3 === 2) {
      //calculating offsets for right hand side column
      horizontalOffset = horizontalOffset + bubbleAdjustedWidth
      verticalOffset = verticalOffset + edgeVerticalOffset
    } else if (bubbleIndex % 3 === 1) {
      //calculating offsets for left hand side column
      horizontalOffset = horizontalOffset - bubbleAdjustedWidth
      verticalOffset = verticalOffset + edgeVerticalOffset
    }

    return {
      //note that based on the verticalRowIndex we need to
      //adjust the top of the bubble
      top: verticalOffset - verticalRowIndex * bubbleAdjustedHeight,
      left: horizontalOffset,
    }
  }

  getBubbleContainerHeight = (deviceHeight: number) => {
    return {
      height: 75 * deviceHeight / 100,
    }
  }

  render() {
    const { width, height } = Dimensions.get('window')
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
      index,
    }))

    return (
      <Animated.View
        style={[
          styles.bubbleContainer,
          this.getBubbleContainerHeight(height),
          { transform: [{ translateY: this.props.height }] },
        ]}
      >
        {connections.map(
          ({
            identifier,
            name,
            logoUrl,
            size,
            senderName,
            senderDID,
            index,
          }) => (
            <AnimationView
              animation="zoomIn"
              duration={600}
              delay={200}
              style={[
                styles.avatar,
                this.getBubblePosition(index, width, height),
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
  },
  avatar: {
    position: 'absolute',
  },
  avatarImage: {
    resizeMode: 'contain',
  },
})
