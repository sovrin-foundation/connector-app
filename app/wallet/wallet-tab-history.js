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
import type { WalletHistoryProps, WalletHistoryItem } from './type-wallet'

const HistoryItem = ({
  senderName,
  senderAddress,
  action,
  tokenAmount,
  timestamp,
}: WalletHistoryItem) => {
  return (
    <CustomView row vCenter columnBottom>
      <CustomView style={[styles.listItemBody]}>
        <CustomView>
          <CustomText
            bg="fifth"
            numberOfLines={1}
            style={[styles.listItemTitle]}
          >
            {senderName || senderAddress}
          </CustomText>
        </CustomView>

        <CustomView>
          <CustomText bg="seventh" style={[styles.listItemSubTitle]}>
            {action}
          </CustomText>
        </CustomView>
        <CustomDate uppercase bg="seventh" style={[styles.listItemSubTitle]}>
          {timestamp}
        </CustomDate>
      </CustomView>

      <CustomView>
        <CustomText bold bg="fifth" style={[styles.listItemWallet]}>
          {action.toLowerCase() === 'withdraw' ? '-' : '+'}
          {tokenAmount.toLocaleString('en-US')}
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
    const walletHistory = this.props.walletHistory.map(item => {
      let itemProps = {
        key: item.id,
        avatar: this.getHistoryIcons(item.action),
        hideChevron: true,
        subtitle: <HistoryItem {...item} />,
        avatarStyle: styles.avatarStyle,
        avatarOverlayContainerStyle: styles.avatarOverlayContainerStyle,
        containerStyle: styles.listItemContainer,
      }
      return <ListItem {...itemProps} />
    })

    return (
      <Container>
        {this.props.walletHistory.length < 1 && (
          <Container hCenter vCenter>
            <CustomText h5 bg="seventh" style={[styles.noHistory]}>
              No history to show
            </CustomText>
          </Container>
        )}
        {this.props.walletHistory.length > 0 && (
          <ScrollView>
            <List containerStyle={styles.listContainer}>{walletHistory}</List>
          </ScrollView>
        )}
      </Container>
    )
  }
}

const mapStateToProps = (state: Store) => ({
  walletHistory: [
    {
      id: 'asd',
      senderAddress:
        'sov:ksudgyi8f98gsih7655hgifuyg79s89s98ydf98fg7gks8fjhkss8f030',
      action: 'Withdraw',
      tokenAmount: 5656,
      timestamp: 'Tue, 04 Aug 2015 12:38:41 GMT',
    },
    {
      id: 'kld',
      senderName: 'Sovrin Foundation',
      senderAddress:
        'sov:ksudgyi8f98gsih7655hgifuyg79s89s98ydf98fg7gks8fjhkss8f030',
      action: 'Purchase',
      tokenAmount: 10000,
      timestamp: 'Tue, 04 Aug 2015 14:38:41 GMT',
    },
  ],
})

export default connect(mapStateToProps, null)(WalletTabHistory)

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
    color: color.bg.seventh.font.sixth,
    fontSize: 16,
  },
  listItemBody: {
    marginHorizontal: OFFSET_3X / 2,
    flex: 1,
  },
  listItemSubTitle: {
    fontSize: 14,
    color: color.bg.seventh.font.seventh,
  },
  noHistory: {
    color: color.bg.seventh.font.seventh,
    marginVertical: OFFSET_1X,
  },
  listItemWallet: {
    fontSize: 18,
    paddingRight: OFFSET_1X,
    color: color.bg.seventh.font.fifth,
  },
})
