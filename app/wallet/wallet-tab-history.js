// @flow
import React, { Component } from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import { List, ListItem } from 'react-native-elements'

import {
  Container,
  CustomView,
  Icon,
  CustomText,
  CustomDate,
} from '../components'
import { color, OFFSET_1X, OFFSET_3X } from '../common/styles/constant'
import type { Store } from '../store/type-store'
import type { WalletHistoryProps, WalletHistoryEvent } from './type-wallet'
import CustomActivityIndicator from '../components/custom-activity-indicator/custom-activity-indicator'
import { getWalletHistory } from '../store/store-selector'
import { refreshWalletHistory } from './wallet-store'
import { bindActionCreators } from 'redux'
import { STORE_STATUS } from './type-wallet'

const HistoryItem = ({
  senderName,
  senderAddress,
  action,
  tokenAmount,
  timeStamp,
}: WalletHistoryEvent) => {
  return (
    <CustomView row vCenter columnBottom>
      <CustomView style={[styles.listItemBody]}>
        <CustomView>
          <CustomText bg="fifth" style={[styles.listItemTitle]}>
            {senderName || senderAddress}
          </CustomText>
        </CustomView>

        <CustomView>
          <CustomText bg="tertiary" style={[styles.listItemSubTitle]}>
            {action}
          </CustomText>
        </CustomView>
        <CustomDate uppercase bg="tertiary" style={[styles.listItemSubTitle]}>
          {timeStamp}
        </CustomDate>
      </CustomView>

      <CustomView row>
        <CustomText bold bg="tertiary" style={[styles.itemWalletSign]}>
          {action.toLowerCase() === 'withdraw' ? '-' : '+'}
        </CustomText>
        <CustomText
          bold
          bg="tertiary"
          formatNumber
          style={[styles.listItemWallet]}
        >
          {tokenAmount}
        </CustomText>
      </CustomView>
    </CustomView>
  )
}

const historyIcons = {
  ['WITHDRAW']: require('../images/sent.png'),
  ['PURCHASE']: require('../images/received.png'),
  ['RECEIVED']: require('../images/received.png'),
}

export class WalletTabHistory extends Component<WalletHistoryProps, void> {
  componentDidMount() {
    this.props.refreshWalletHistory()
  }

  getHistoryIcons = (action: string) => {
    return (
      <Icon
        src={historyIcons[action.toUpperCase()]}
        iconStyle={[{ tintColor: color.bg.fifth.font.fifth }]}
        small
      />
    )
  }

  render() {
    const { transactions, status } = this.props.walletHistory
    const walletHistory = transactions.map(transaction => {
      let itemProps = {
        key: transaction.id,
        avatar: this.getHistoryIcons(transaction.action),
        hideChevron: true,
        subtitle: <HistoryItem {...transaction} />,
        avatarStyle: styles.avatarStyle,
        avatarOverlayContainerStyle: styles.avatarOverlayContainerStyle,
        containerStyle: styles.listItemContainer,
      }
      return <ListItem {...itemProps} />
    })

    return (
      <Container>
        {status === STORE_STATUS.IN_PROGRESS && <CustomActivityIndicator />}
        {transactions.length < 1 &&
          status !== STORE_STATUS.SUCCESS && (
            <Container center>
              <CustomText h5 bg="tertiary" style={[styles.noHistory]}>
                No history to show
              </CustomText>
            </Container>
          )}
        {transactions.length > 0 && (
          <ScrollView>
            <List containerStyle={styles.listContainer}>{walletHistory}</List>
          </ScrollView>
        )}
      </Container>
    )
  }
}

const mapStateToProps = (state: Store) => {
  return {
    walletHistory: getWalletHistory(state) || {
      transactions: [],
      error: '',
      status: STORE_STATUS.IDLE,
    },
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators({ refreshWalletHistory }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(WalletTabHistory)

const styles = StyleSheet.create({
  listContainer: {
    marginTop: -1,
    borderBottomWidth: 0,
  },
  listItemContainer: {
    borderBottomWidth: 1,
    borderBottomColor: color.border.primary,
  },
  avatarStyle: {
    width: 16,
    height: 20,
    marginVertical: OFFSET_1X,
    resizeMode: 'contain',
  },
  avatarOverlayContainerStyle: {
    backgroundColor: 'transparent',
  },
  listItemTitle: {
    color: color.bg.tertiary.font.sixth,
    fontSize: 16,
  },
  listItemBody: {
    marginHorizontal: OFFSET_3X / 2,
    flex: 1,
  },
  listItemSubTitle: {
    fontSize: 14,
    color: color.bg.tertiary.font.fifth,
  },
  noHistory: {
    color: color.bg.tertiary.font.fifth,
    marginVertical: OFFSET_1X,
  },
  itemWalletSign: {
    fontSize: 18,
    color: color.bg.tertiary.font.quaternary,
  },
  listItemWallet: {
    fontSize: 18,
    paddingRight: OFFSET_1X,
    color: color.bg.tertiary.font.quaternary,
  },
})
