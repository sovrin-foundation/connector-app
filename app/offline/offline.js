// @flow

import React, { PureComponent } from 'react'
import { View, StyleSheet, NetInfo } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { offline } from './offline-store'
import type { OfflineProps } from './type-offline'
import type { Store } from '../store/type-store'
import { getOfflineStatus } from '../store/store-selector'
import { Container } from '../components'
import VectorIcon from '../components/vector-icon/vector-icon'

export class Offline extends PureComponent<OfflineProps> {
  connectivityChecker: number

  componentDidMount() {
    NetInfo.isConnected.addEventListener(
      'connectionChange',
      this.handleConnectivityChange
    )
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener(
      'connectionChange',
      this.handleConnectivityChange
    )
    this.clearInternetCheck()
  }

  clearInternetCheck() {
    this.connectivityChecker && clearInterval(this.connectivityChecker)
  }

  handleConnectivityChange = (isConnected: boolean) => {
    if (!isConnected) {
      // NetInfo does not reliably change status to connected
      // however, it works pretty well to change status to offline
      if (!this.connectivityChecker) {
        // once we know that we are offline, then we start checking for online
        // and does not solely rely on NetInfo module
        this.connectivityChecker = setInterval(this.checkConnectivity, 5000)
      }
    } else {
      this.clearInternetCheck()
    }
    this.props.offline(!isConnected)
  }

  checkConnectivity = () => {
    fetch('https://www.google.com/', {
      method: 'HEAD',
    })
      .then(response => {
        if (response.status < 500) {
          this.handleConnectivityChange(true)
          this.clearInternetCheck()
        } else {
          this.handleConnectivityChange(false)
        }
      })
      .catch(error => {
        this.handleConnectivityChange(false)
      })
  }

  render() {
    const { isOffline, overlay, render } = this.props
    // Will only render if it's passed the banner prop. This allows us to add the component
    // to the app root so that it's the only one setting/removing the connectionChange event listener

    if (isOffline && !overlay && render) {
      return render(!isOffline)
    }

    if (isOffline && overlay) {
      return (
        <View style={styles.overlay}>
          <Container vCenter hCenter>
            <VectorIcon icon="offline" width={64} height={64} />
          </Container>
        </View>
      )
    }

    return null
  }
}

const mapStateToProps = (state: Store) => ({
  isOffline: getOfflineStatus(state),
})

const mapDispatchToProps = dispatch => bindActionCreators({ offline }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Offline)

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
})
