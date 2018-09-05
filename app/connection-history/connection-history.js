// @flow
import React, { Component } from 'react'
import RadialGradient from 'react-native-radial-gradient'
import {
  Alert,
  ScrollView,
  StyleSheet,
  Dimensions,
  View,
  StatusBar,
} from 'react-native'
import { connect } from 'react-redux'
import { List, ListItem } from 'react-native-elements'
import moment from 'moment'
import groupBy from 'lodash.groupby'
import { bindActionCreators } from 'redux'
import { updateStatusBarTheme } from '../../app/store/connections-store'
import {
  InfoSectionList,
  ClaimProofHeader,
  Container,
  ConnectionTheme,
  CustomView,
  Icon,
  CustomText,
  Separator,
  CustomDate,
  headerStyles,
} from '../components'
import { dimGray, OFFSET_9X } from '../../app/common/styles'
import {
  homeRoute,
  connectionHistoryRoute,
  connectionHistoryDetailsRoute,
  connectionHistoryPendingRoute,
} from '../common/route-constants'
import {
  color,
  OFFSET_1X,
  OFFSET_3X,
  alertCancel,
} from '../common/styles/constant'
import type { Store } from '../store/type-store'
import type {
  ConnectionHistoryItem,
  ConnectionHistoryProps,
  ConnectionHistoryEvent,
} from './type-connection-history'
import {
  HISTORY_EVENT_STATUS,
  HISTORY_EVENT_OCCURRED,
} from './type-connection-history'
import type { ReactNavigation } from '../common/type-common'
import showDID from '../components/show-pairwise-info'
import {
  SEND_CLAIM_REQUEST,
  CLAIM_REQUEST_STATUS,
  SEND_CLAIM_REQUEST_SUCCESS,
} from '../claim-offer/type-claim-offer'
import { deleteConnectionAction } from '../store/connections-store'
import { getConnection, getConnectionTheme } from '../store/store-selector'
import { Dot as BadgeDot } from '../components/badges-dot'

import debounce from 'lodash.debounce'
import { getUnseenMessages } from '../store/store-selector'
import { goToUIScreen } from '../push-notification/push-notification-store'
import Color from 'color'

const statusMsg = {
  ['PENDING']: 'Pending',
  ['CONNECTED']: 'Established on',
  ['RECEIVED']: 'Accepted on',
  ['ACCEPTED & SAVED']: 'Accepted on',
  ['SHARED']: 'Sent on',
  ['PROOF RECEIVED']: 'New request to share',
  ['CLAIM OFFER RECEIVED']: 'New credential offer',
}

const historyIcons = {
  ['PENDING']: require('../images/received.png'),
  ['CONNECTED']: require('../images/linked.png'),
  ['RECEIVED']: require('../images/received.png'),
  ['CLAIM OFFER RECEIVED']: require('../images/received.png'),
  ['PROOF RECEIVED']: require('../images/received.png'),
  ['ACCEPTED & SAVED']: require('../images/received.png'),
  ['SHARED']: require('../images/sent.png'),
}

const historyShowUI = ['CLAIM OFFER RECEIVED', 'PROOF RECEIVED']

const HistoryTitle = ({ action, name, theme }) => (
  <CustomView>
    <CustomView>
      <CustomText
        h5
        semiBold
        uppercase
        bg="fifth"
        style={[styles.listItemAction, { color: theme }]}
      >
        {action && historyShowUI.indexOf(action) > -1
          ? statusMsg[action]
          : action}
      </CustomText>
    </CustomView>
    <CustomView>
      {name && (
        <CustomText
          h5
          semiBold
          bg="fifth"
          style={[styles.listItemTitleEvent, styles.listItemAction]}
        >
          {name}
        </CustomText>
      )}
    </CustomView>
  </CustomView>
)

const HistoryBody = ({ action, timestamp }) => {
  return (
    <CustomView row>
      <CustomDate h7 uppercase bg="fifth" style={[styles.listItemBody]}>
        {timestamp}
      </CustomDate>
    </CustomView>
  )
}

export class ConnectionHistory extends Component<ConnectionHistoryProps, void> {
  connectionDetailHandlerDebounce = debounce(
    ({ h, activeConnectionThemePrimary, senderName, image, senderDID }) => {
      this.connectionDetailHandler({
        h,
        activeConnectionThemePrimary,
        senderName,
        image,
        senderDID,
      })
    },
    300,
    { leading: false, trailing: true }
  )

  closeDebounce = debounce(
    () => {
      const { navigation } = this.props

      navigation.goBack(null)
    },
    300,
    { leading: true, trailing: false }
  )

  componentDidMount() {
    this.props.updateStatusBarTheme(this.props.activeConnectionThemePrimary)
  }

  connectionDetailHandler = (history: any) => {
    if (history.h.action === HISTORY_EVENT_STATUS[SEND_CLAIM_REQUEST_SUCCESS]) {
      this.props.navigation.navigate(connectionHistoryPendingRoute, {
        payload: history.h.originalPayload.payload,
      })
    } else {
      this.props.navigation.navigate(connectionHistoryDetailsRoute, {
        ...history.h,
        theme: history.activeConnectionThemePrimary,
        senderName: history.senderName,
        image: history.image,
        senderDID: history.senderDID,
        claimMap: this.props.claimMap,
      })
    }
  }

  getHistoryIcons = (action: string, showBadge?: boolean) => {
    return (
      <CustomView center>
        {}
        {showBadge && (
          <View style={[styles.badgeDotStyle]}>
            <BadgeDot size="small" />
          </View>
        )}
        <Icon
          src={historyIcons[action]}
          iconStyle={[{ tintColor: this.props.activeConnectionThemePrimary }]}
          small
        />
      </CustomView>
    )
  }

  handleRedirectionScreens(
    h: ConnectionHistoryEvent,
    activeConnectionThemePrimary: string,
    senderName: string,
    image: string,
    senderDID: string
  ) {
    if (h.showBadge || historyShowUI.indexOf(h.action) != -1) {
      this.props.goToUIScreen(
        h.originalPayload.type,
        h.originalPayload.payloadInfo.uid,
        this.props.navigation
      )
    } else {
      this.connectionDetailHandlerDebounce({
        h,
        activeConnectionThemePrimary,
        senderName,
        image,
        senderDID,
      })
    }
  }

  onDeleteConnection = (senderName: string, senderDID: string) => {
    Alert.alert(
      `Delete ${senderName}?`,
      `Are you sure you want to delete ${senderName} as a connection?
      You will still keep the information they have given you, but you will not
      be able to contact them without re-establishing a new connection. Proceed?`,
      [alertCancel, { text: 'Delete', onPress: () => this.delete(senderDID) }]
    )
  }
  delete = (senderDID: string) => {
    this.props.deleteConnectionAction(senderDID)
    this.closeDebounce()
  }

  render() {
    const { width } = Dimensions.get('window')
    if (this.props.navigation.state) {
      const {
        senderName,
        image,
        senderDID,
        identifier,
      } = this.props.navigation.state.params
      const { activeConnectionThemePrimary, connectionHistory } = this.props
      const testID = 'connection-history'
      const logoUri = image
        ? { uri: image }
        : require('../images/cb_evernym.png')

      const barStyle = activeConnectionThemePrimary => {
        if (Color(activeConnectionThemePrimary).isLight) {
          return 'light-content'
        } else {
          return 'dark-content'
        }
      }

      const historySenderDIDs = Object.keys(connectionHistory)
      const historyList = historySenderDIDs.map((sdid, i) => {
        const historyItems = connectionHistory[sdid].map((h, i) => {
          const itemProps = {
            avatar: this.getHistoryIcons(h.action, h.showBadge),
            key: h.id,
            title: <HistoryTitle {...h} theme={activeConnectionThemePrimary} />,
            subtitle: <HistoryBody {...h} />,
            chevronColor: color.bg.fifth.font.fifth,
            avatarStyle: styles.avatarStyle,
            avatarOverlayContainerStyle: styles.avatarOverlayContainerStyle,
            containerStyle: styles.listItemContainer,
            hideChevron: false,
            rightIcon:
              h.action === HISTORY_EVENT_STATUS[SEND_CLAIM_REQUEST_SUCCESS] ? (
                <Icon src={require('../images/e15c.1.png')} small />
              ) : (
                {
                  name: 'chevron-right',
                  color: dimGray,
                }
              ),
            onPress: () => {
              this.handleRedirectionScreens(
                h,
                activeConnectionThemePrimary,
                senderName,
                image,
                senderDID
              )
            },
          }

          if (h.action === 'CONNECTED') {
            itemProps.hideChevron = true
            delete itemProps.onPress
          }

          return <ListItem {...itemProps} />
        })
        const history = (
          <CustomView key={i}>
            <CustomText
              h4
              semiBold
              bg="septenary"
              style={[styles.listItemLabel]}
            >
              {sdid}
            </CustomText>
            {historyItems}
          </CustomView>
        )
        return history
      })

      return (
        <Container fifth>
          <StatusBar
            backgroundColor={this.props.activeConnectionThemePrimary}
            barStyle={barStyle(this.props.activeConnectionThemePrimary)}
          />
          <RadialGradient
            colors={[
              this.props.activeConnectionThemePrimary,
              this.props.activeConnectionThemeSecondary,
            ]}
            stops={[0.1, 0.4]}
            center={[width / 2, OFFSET_9X / 2]}
            radius={width * 3}
          >
            <ClaimProofHeader
              message={senderName}
              onClose={this.closeDebounce}
              logoUrl={image}
              testID={testID}
              containerStyle={{ backgroundColor: 'transparent' }}
              textContainerStyle={[
                styles.textContainerStyle,
                { backgroundColor: 'transparent' },
              ]}
              messageStyle={[
                styles.senderName,
                { backgroundColor: 'transparent' },
              ]}
              accessibilityLabel="connection-history"
              accessible={true}
            >
              <CustomView
                fifth
                hCenter
                style={[
                  headerStyles.headerLogoContainer,
                  { backgroundColor: 'transparent' },
                ]}
              >
                <Icon
                  absolute="TopRight"
                  src={require('../images/close_white.png')}
                  small
                  testID={`${testID}-icon-close`}
                  onPress={this.closeDebounce}
                  iconStyle={[styles.headerCloseIcon]}
                  style={[styles.headerIconContainer]}
                />
                <Icon
                  center
                  halo
                  extraLarge
                  resizeMode="cover"
                  src={logoUri}
                  style={[styles.issuerLogo]}
                  iconStyle={[styles.issuerLogoIcon]}
                  testID={`${testID}-issuer-logo`}
                  onLongPress={() => showDID(senderDID, identifier)}
                />
                <Icon
                  absolute="TopLeft"
                  src={require('../images/delete.png')}
                  small
                  iconStyle={[styles.headerDeleteIcon]}
                  style={[styles.headerIconContainer]}
                  resizeMode="contain"
                  testID={`${testID}-icon-delete`}
                  onPress={() => {
                    this.onDeleteConnection(senderName, senderDID)
                  }}
                />
              </CustomView>
            </ClaimProofHeader>
          </RadialGradient>

          <ScrollView>
            <List containerStyle={styles.listContainer}>{historyList}</List>
          </ScrollView>
        </Container>
      )
    }
  }
}

const mapStateToProps = (state: Store, props: ReactNavigation) => {
  let connectionHistory: ConnectionHistoryEvent[] =
    state.history.data && props.navigation.state
      ? state.history.data[props.navigation.state.params.senderDID]
      : []

  if (connectionHistory) {
    connectionHistory = connectionHistory.filter(history => {
      if (statusMsg[history.action]) {
        return history
      }
    })
  }

  const unSeenMessages = getUnseenMessages(state)
  if (connectionHistory) {
    connectionHistory = connectionHistory.map(history => {
      if (
        history.originalPayload &&
        history.originalPayload.payloadInfo &&
        history.originalPayload.payloadInfo.uid &&
        unSeenMessages[history.remoteDid] &&
        unSeenMessages[history.remoteDid].length > 0 &&
        unSeenMessages[history.remoteDid].indexOf(
          history.originalPayload.payloadInfo.uid
        ) >= 0
      ) {
        history.showBadge = true
      } else {
        history.showBadge = false
      }
      return history
    })
  }

  const themeForLogo = getConnectionTheme(
    state,
    props.navigation.state ? props.navigation.state.params.image : ''
  )

  return {
    activeConnectionThemePrimary: themeForLogo.primary,
    activeConnectionThemeSecondary: themeForLogo.secondary,
    connectionHistory: groupBy(
      connectionHistory.sort((a, b) => {
        return new Date(b.timestamp) - new Date(a.timestamp)
      }),
      history => moment(history.timestamp).format('MMMM YYYY')
    ),
    claimMap: state.claim.claimMap,
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    { deleteConnectionAction, updateStatusBarTheme, goToUIScreen },
    dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(ConnectionHistory)

const styles = StyleSheet.create({
  headerCloseIcon: {
    marginRight: 15,
  },
  headerIconContainer: {
    zIndex: 2,
  },
  headerDeleteIcon: {
    marginLeft: 15,
  },
  issuerLogo: {
    ...StyleSheet.absoluteFillObject,
    alignSelf: 'center',
    zIndex: 1,
  },
  textContainerStyle: {
    paddingBottom: 0,
    marginBottom: OFFSET_3X / 2,
  },
  senderName: {
    marginTop: OFFSET_1X / 2,
    color: color.bg.primary.font.primary,
  },
  issuerLogoIcon: {
    borderRadius: 40,
  },
  listContainer: {
    marginTop: 0,
    borderBottomWidth: 0,
  },
  listItemLabel: {
    paddingLeft: OFFSET_3X / 2,
    paddingVertical: OFFSET_1X,
  },
  listItemContainer: {
    borderBottomWidth: 1,
  },
  listItemAction: {
    marginLeft: OFFSET_1X,
    marginBottom: OFFSET_1X / 2,
  },
  listItemTitleEvent: {
    color: color.bg.fifth.font.fifth,
  },
  listItemBody: {
    marginLeft: OFFSET_1X,
  },
  avatarStyle: {
    width: 17,
    height: 17,
    marginVertical: OFFSET_1X,
    resizeMode: 'contain',
  },
  avatarOverlayContainerStyle: { backgroundColor: 'transparent' },
  badgeDotStyle: {
    marginBottom: 5,
  },
})
