// @flow

import React, { PureComponent } from 'react'
import { StyleSheet, Clipboard, ScrollView } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  Container,
  CustomView,
  CustomText,
  CustomButton,
  Loader,
} from '../components'
import type {
  WalletTabReceiveProps,
  WalletTabReceiveState,
} from './type-wallet'
import type { Store } from '../store/type-store'
import customStyles from './styles'
import { getWalletAddresses } from '../store/store-selector'
import { refreshWalletAddresses } from './wallet-store'
import { promptBackupBanner } from '../backup/backup-store'
import { STORE_STATUS } from './type-wallet'

export class WalletTabReceive extends PureComponent<
  WalletTabReceiveProps,
  WalletTabReceiveState
> {
  state = {
    copyButtonText: 'Copy Address To Clipboard',
  }

  componentDidMount() {
    this.props.refreshWalletAddresses()
  }

  copyToClipboard = () => {
    const { walletAddresses, promptBackupBanner } = this.props

    if (walletAddresses.length) {
      promptBackupBanner(true)
      Clipboard.setString(walletAddresses[0])
      this.setState({
        copyButtonText: 'Copied!',
      })
      setTimeout(() => {
        this.setState({
          copyButtonText: 'Copy Address To Clipboard',
        })
      }, 2000)
    }
  }

  // TODO handle error state
  render() {
    const { walletAddresses, addressStatus } = this.props
    const isLoading =
      addressStatus === STORE_STATUS.IN_PROGRESS && walletAddresses.length === 0
    return (
      <Container>
        <Container>
          <CustomView style={[styles.container]}>
            <ScrollView scrollEnabled={walletAddresses.length > 1}>
              <CustomText
                h6
                bold
                center
                transparentBg
                quinaryText
                style={[styles.heading]}
              >
                {isLoading
                  ? 'Fetching your Sovrin token payment address'
                  : 'Your Sovrin token payment address is:'}
              </CustomText>
              {isLoading && <Loader showMessage={false} />}
              {walletAddresses.map((walletAddress: string) => {
                return (
                  <CustomText
                    center
                    transparentBg
                    borderColor
                    primary
                    key={walletAddress}
                    style={[styles.paymentAddress]}
                  >
                    {walletAddress}
                  </CustomText>
                )
              })}
            </ScrollView>
          </CustomView>
        </Container>
        <CustomView safeArea>
          <CustomButton
            onPress={this.copyToClipboard}
            testID="token-copy-to-clipboard-label"
            style={[customStyles.ctaButton]}
            primary
            title={this.state.copyButtonText}
            disabled={isLoading}
          />
        </CustomView>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 38,
  },
  heading: {
    lineHeight: 18,
    letterSpacing: -0.38,
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  paymentAddress: {
    marginTop: 5,
    paddingTop: 16,
    paddingBottom: 16,
    paddingLeft: 13,
    paddingRight: 13,
    marginLeft: 19,
    marginRight: 19,
    fontSize: 18,
    lineHeight: 24,
    letterSpacing: -0.45,
  },
  alignItemsCenter: {
    marginBottom: 6,
    marginLeft: '5%',
    marginRight: '5%',
  },
})

const mapStateToProps = (state: Store) => {
  return {
    walletAddresses: getWalletAddresses(state),
    addressStatus: state.wallet.walletAddresses.status,
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators({ promptBackupBanner, refreshWalletAddresses }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(WalletTabReceive)
