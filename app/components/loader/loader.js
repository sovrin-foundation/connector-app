// @flow

import React, { Component } from 'react'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import LoadingIndicator from './loading-indicator'
import type { LoaderProps, LoaderState } from './type-loader'
import { DARK } from './type-loader'
import { color, font, OFFSET_2X } from '../../common/styles'
import { Container, CustomText } from '..'

const LOADING_MESSAGES = ['Please wait…', 'Hold on…', 'Loading…', 'Working…']

const LONG_LOADING_MESSAGES = [
  'Taking longer than usual',
  'Still working',
  'Sorry for the wait',
  'Ok, this is taking longer than normal',
  'Really sorry about this',
  'Thanks for being patient',
  'Taking longer than usual',
]

export default class Loader extends Component<LoaderProps, LoaderState> {
  timers: Array<number>
  interval: any

  static defaultProps = {
    interval: 15000,
    timeout: 90000,
    delay: 0,
    type: DARK,
    showMessage: true,
    size: 30,
  }

  constructor(props: LoaderProps) {
    super(props)

    const { delay, interval, timeout, message } = props
    this.timers = []
    this.interval = interval

    this.timers.push(
      this.createTimer(
        'show',
        () => {
          // if a specific message isn't provided, then start using the random messages
          if (!message) {
            this.startInterval(interval)
          }

          return true
        },
        delay
      )
    )

    // This block will only run once the timeout value has been given and reached. Default is 90 seconds
    if (timeout) {
      this.timers.push(
        this.createTimer(
          'message',
          () => {
            this.clearTimers()

            return this.getRandomMessages(LONG_LOADING_MESSAGES)
          },
          timeout + delay
        )
      )
    }

    this.state = {
      message: message || this.getRandomMessages(LOADING_MESSAGES),
      show: delay === 0,
    }
  }

  // To prevent leaking timers
  componentWillUnmount() {
    this.clearTimers()
  }

  getRandomMessages(arr: Array<string>) {
    return arr[Math.floor(Math.random() * arr.length)]
  }

  startInterval(time: number) {
    const interval = setInterval(() => {
      this.setState({
        message: this.getRandomMessages(LOADING_MESSAGES),
      })
    }, time)

    this.interval = interval
  }

  clearTimers() {
    this.timers.forEach(id => {
      clearTimeout(id)
    })
    if (this.interval) {
      clearInterval(this.interval)
    }
  }

  createTimer(key: string, value: () => mixed, timeout: number = 0) {
    return setTimeout(() => {
      this.setState({
        [key]: value(),
      })
    }, timeout)
  }

  render() {
    const { type, showMessage, size } = this.props
    const { show, message } = this.state
    const textColor =
      type === DARK ? color.textColor.charcoal : color.actions.font.primary

    if (show) {
      return (
        <Container center style={[styles.loading]}>
          <LoadingIndicator type={type} size={size} />
          {showMessage && (
            <CustomText
              center
              transparentBg
              style={[{ color: textColor }, styles.loadingText]}
            >
              {message}
            </CustomText>
          )}
        </Container>
      )
    }

    return null
  }
}

const styles = StyleSheet.create({
  loading: {
    padding: OFFSET_2X,
  },
  loadingText: {
    fontSize: font.size.M,
    fontWeight: '500',
    lineHeight: 21,
    letterSpacing: -0.42,
    marginTop: OFFSET_2X,
  },
})
