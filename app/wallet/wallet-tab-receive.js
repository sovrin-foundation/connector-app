// @flow

// component to render inside token screen, receive tab
// we have to design this tab content by assuming that
// we would get a list of payment addresses and for now we would take first item out of it
// and that first item would be displayed
import React, { PureComponent } from 'react'
import { StyleSheet, Clipboard, ScrollView } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Container } from '../components/layout/container'
import { CustomView } from '../components/layout/custom-view'
import CustomText from '../components/text'
import CustomButton from '../components/button'
import type {
  WalletTabReceiveProps,
  WalletTabReceiveState,
} from './type-wallet'
import type { Store } from '../store/type-store'
import customStyles from './styles'
import { getWalletAddresses } from '../store/store-selector'
import { promptBackupBanner, refreshWalletAddresses } from './wallet-store'

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
        copyButtonText: 'Copied !',
      })
      setTimeout(() => {
        this.setState({
          copyButtonText: 'Copy Address To Clipboard',
        })
      }, 2000)
    }
  }

  // TODO handle IN_PROGRESS, success and error state
  render() {
    const { walletAddresses } = this.props
    return (
      <Container>
        <Container>
          <CustomView style={[styles.container]}>
            <ScrollView scrollEnabled={walletAddresses.length > 1}>
              <CustomText
                h6
                bold
                center
                proText
                transparentBg
                quinaryText
                style={[styles.heading]}
              >
                YOUR SOVRIN TOKEN PAYMENT ADDRESS IS:
              </CustomText>
              {walletAddresses.map((walletAddress, index) => {
                return (
                  <CustomText
                    proText
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
        <CustomView safeArea style={[styles.alignItemsCenter]}>
          <CustomButton
            onPress={this.copyToClipboard}
            testID="token-copy-to-clipboard-label"
            style={[customStyles.ctaButton]}
            primary
            title={this.state.copyButtonText}
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
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators({ promptBackupBanner, refreshWalletAddresses }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(WalletTabReceive)
