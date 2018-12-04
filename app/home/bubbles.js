// @flow
import React, { PureComponent, Component } from 'react'
import {
  Animated,
  InteractionManager,
  Platform,
  Dimensions,
  StyleSheet,
  View,
} from 'react-native'
import { View as AnimationView } from 'react-native-animatable'
import { Avatar, CustomView } from '../components'
import { connectionHistoryRoute } from '../common/route-constants'
import showDID from '../components/show-pairwise-info'
import type {
  BubbleState,
  BubbleProps,
  BubblesProps,
  ConnectionBubblesState,
} from './type-home'
import { Dot as BadgeDot } from '../components/badges-dot'
import { checkIfAnimationToUse } from '../bridge/react-native-cxs/RNCxs'

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

  goHistoryView = (
    senderName: string,
    image: ?string,
    senderDID: string,
    identifier: string
  ) => {
    this.props.disableTopView()
    if (!this.props.disableTaps) {
      this.props.navigation.navigate(connectionHistoryRoute, {
        senderName,
        image,
        senderDID,
        identifier,
      })
    }
  }
  showHistory = () => {
    const {
      image,

      senderName,
      senderDID,
      identifier,
      allowInteractions,
    } = this.props
    if (allowInteractions) {
      this.goHistoryView(senderName, image, senderDID, identifier)
    }
  }
  render() {
    const {
      image,
      testID,
      senderName,
      senderDID,
      identifier,
      allowInteractions,
    } = this.props
    let source

    if (this.state.failed || Number.isInteger(image) || !image) {
      source = require('../images/logo_sovrin.png')
    }

    if (typeof this.props.image === 'string') {
      source = { uri: image }
    }

    return (
      <CustomView row>
        <View style={[badgeDotStyles.avatarBack]}>
          <Avatar
            radius={this.props.radius}
            src={source}
            onLoad={this._onLoad}
            onError={this._onError}
            testID={testID}
            onLongPress={() => showDID(senderDID, identifier)}
            onPress={this.showHistory}
          />
        </View>
        {/* TODO: the badge has to be put on a condition when there is any unread cred is pending inside this connection */}
        {this.props.showBadge ? (
          <CustomView style={[badgeDotStyles.badge]}>
            <BadgeDot size="medium" />
          </CustomView>
        ) : null}
      </CustomView>
    )
  }
}

const badgeDotStyles = StyleSheet.create({
  badge: {
    marginLeft: -20,
    zIndex: 1,
  },
  avatarBack: {
    zIndex: 0,
  },
})

export default class ConnectionBubbles extends PureComponent<
  BubblesProps,
  ConnectionBubblesState
> {
  state = {
    disableTaps: false,
    interactionsDone: false,
  }
  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({ interactionsDone: true })
    })
  }
  getBubblePosition = (
    bubbleIndex: number,
    deviceWidth: number,
    deviceHeight: number
  ) => {
    //returns top and left position of the connection bubble
    //based on the bubbleIndex the position is calculated

    //top position for 0th bubble
    let verticalOffset = deviceHeight * 0.58
    //left position for 0th bubble should be somewhere around the mid of the device
    //we are subtracting bubble radius to adjust the bubble width in the offset
    //so that center of bubble comes in mid
    let horizontalOffset = deviceWidth / 2 - deviceHeight / 16

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
    //such that atleast 4 bubbles get adjusted
    //so if deviceHeight is 568 and
    //bubble container is having height 511(90%of deviceHeight)
    //bubbleAdjustedHeight will be 94
    const bubbleAdjustedHeight = deviceHeight / 6

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
      top: Math.floor(verticalOffset - verticalRowIndex * bubbleAdjustedHeight),
      left: Math.floor(horizontalOffset),
    }
  }

  getBubbleContainerHeight = (deviceHeight: number) => {
    return {
      height: 90 * deviceHeight / 100,
    }
  }

  disableViewTaps = () => {
    this.setState({
      disableTaps: true,
    })
    setTimeout(() => {
      this.setState({
        disableTaps: false,
      })
    }, 500)
  }

  render() {
    let { width, height } = Dimensions.get('window')
    //Adjusting height in android due to navigational bar
    height = Platform.OS === 'ios' ? height : height - 44
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
    const connections = this.props.connections.map((connection, index) => {
      let showBadge =
        this.props.unSeenMessages[connection.senderDID] &&
        this.props.unSeenMessages[connection.senderDID].length > 0
          ? true
          : false
      return {
        ...connection,
        name: enterprises[index] || 'verizon',
        index,
        showBadge,
      }
    })

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
            showBadge,
          }) => (
            <AnimationView
              animation="zoomIn"
              // TODO: SC, need to change to duration={600} delay={200} and for lower end devices have to change the duration accordingly
              duration={checkIfAnimationToUse() ? 20 : 200}
              delay={checkIfAnimationToUse() ? 60 : 600}
              style={[
                styles.avatar,
                this.getBubblePosition(index, width, height),
              ]}
              key={identifier}
            >
              <Bubble
                radius={Math.floor(height / 16)}
                size={size}
                image={logoUrl}
                testID={`bubble-${identifier}`}
                senderName={senderName}
                senderDID={senderDID}
                identifier={identifier}
                navigation={this.props.navigation}
                disableTopView={this.disableViewTaps}
                disableTaps={this.state.disableTaps}
                allowInteractions={this.state.interactionsDone}
                showBadge={showBadge}
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
    top: -70,
    left: 0,
    right: 0,
    overflow: 'hidden',
    zIndex: -1,
  },
  avatar: {
    position: 'absolute',
  },
  avatarImage: {
    resizeMode: 'contain',
  },
})
