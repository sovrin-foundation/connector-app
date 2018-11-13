// @flow
import React, { PureComponent } from 'react'
import {
  Text,
  Switch,
  StyleSheet,
  Platform,
  ScrollView,
  FlatList,
} from 'react-native'
import { createStackNavigator } from 'react-navigation'
import BackupWallet from './backup-wallet'
import {
  UserAvatar,
  CustomText,
  Icon,
  Avatar,
  CustomHeader,
} from '../components'
import { CustomList, CustomView, Container } from '../components/layout'
import {
  settingsRoute,
  lockEnterPinRoute,
  lockTouchIdSetupRoute,
  aboutAppRoute,
  onfidoRoute,
  privacyTNCRoute,
  genRecoveryPhraseRoute,
} from '../common/route-constants'
import ToggleSwitch from 'react-native-flip-toggle-button'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  white,
  mantis,
  OFFSET_1X,
  color,
  grey,
  isIphoneX,
  responsiveHorizontalPadding,
  isBiggerThanVeryShortDevice,
  HAIRLINE_WIDTH,
  font,
  lightDarkGray,
  lightWhite,
} from '../common/styles/constant'
import {
  EDIT_ICON_DIMENSIONS,
  PASS_CODE_ASTERISK_TOP_OFFSET,
  PASS_CODE_ASTERISK_TEST_ID,
  PASS_CODE_TEST_ID,
  TOUCH_ID_TEST_ID,
  USERNAME_TEST_ID,
  CHAT_TEST_ID,
  USER_AVATAR_TEST_ID,
  BACKUP_DATA_WALLET,
  ABOUT_APP_TEST_ID,
  ONFIDO_TEST_ID,
} from './settings-constant'

import type { Store } from '../store/type-store'
import type { SettingsProps, SettingsState } from './type-settings'
import { tertiaryHeaderStyles } from '../components/layout/header-styles'
import type { ImageSource } from '../common/type-common'
import { selectUserAvatar } from '../store/user/user-store'
import { Apptentive } from 'apptentive-react-native'
//import WalletBackupSuccessModal from '../backup/wallet-backup-success-modal'
import AboutApp from '../about-app/about-app'
import Onfido from '../onfido/onfido'
import PrivacyTNC from '../privacy-tnc/privacy-tnc-screen'
import Banner from '../components/banner/banner'
import { WalletBalance } from '../wallet/wallet-balance'
import { size } from '../components/icon'
import { isBiggerThanShortDevice } from '../common/styles/constant'
import { Dimensions } from 'react-native'
import { scale } from 'react-native-size-matters'
import { darkGray } from '../common/styles/constant'
import { List, ListItem } from 'react-native-elements'
import {
  SOVRINTOKEN_AMOUNT_TEST_ID,
  SOVRINTOKEN_TEST_ID,
} from '../home/home-constants'
import get from 'lodash.get'
import SvgCustomIcon from '../components/svg-custom-icon'
import { getWalletBalance } from '../store/store-selector'
import CustomDate from '../components/custom-date/custom-date'
import { matterhornSecondary } from '../common/styles/constant'
import { tokenAmountSize } from '../home/home'
const { width, height } = Dimensions.get('window')

const style = StyleSheet.create({
  mainContainer: {
    backgroundColor: lightDarkGray,
  },
  userAvatarContainer: {
    paddingTop: '10%',
    paddingBottom: 0,
  },
  listContainer: {
    borderBottomWidth: 0,
    borderTopWidth: 0,
    backgroundColor: lightDarkGray,
  },
  listItemContainer: {
    borderBottomWidth: HAIRLINE_WIDTH,
    borderTopWidth: 0,
    paddingTop: 11,
    paddingBottom: 11,
  },
  titleStyle: {
    fontSize: font.size.M,
    fontWeight: '500',
  },
  subtitleStyle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: matterhornSecondary,
  },
  avatarStyle: { backgroundColor: lightDarkGray, padding: 5 },
  username: {
    fontSize: font.size.ML1,
    padding: '3%',
  },
  tokenText: {
    fontSize: font.size.XS,
    paddingTop: 5,
    paddingBottom: 5,
  },
  editIcon: {
    width: EDIT_ICON_DIMENSIONS,
    height: EDIT_ICON_DIMENSIONS,
  },
  labelImage: {
    marginRight: OFFSET_1X,
  },
  floatTokenAmount: {
    color: darkGray,
    paddingHorizontal: 8,
  },
  backupTimeSubtitleStyle: {
    marginLeft: 10,
    color: matterhornSecondary,
  },
  subtitleColor: {
    color: matterhornSecondary,
  },
})

const SettingText = props => (
  <CustomText h5 bg="fifth" tertiary bold {...props}>
    {props.children}
  </CustomText>
)

export class Settings extends PureComponent<SettingsProps, SettingsState> {
  state = {
    walletBackupModalVisible: false,
    disableTouchIdSwitch: false,
  }
  onChangePinClick = () => {
    if (this.props.navigation.isFocused()) {
      this.props.navigation.push(lockEnterPinRoute, {
        existingPin: true,
      })
    }
  }

  onChangeTouchId = (switchState: boolean) => {
    // when the navigation from settings is done by touching the Switch, then the touch id enables with wiered behaviour
    // reason for the behaviour: the onChangeTouchId function is being invoked twice making to navigate twice.
    // solution: the if condition will check for the current state of the switch and compares with the actual state of the switch
    // this confirms to make the onChangeTouchId function to invoke only once at all the times
    if (
      this.props.touchIdActive !== switchState &&
      this.props.navigation.isFocused()
    ) {
      this.props.navigation.push(lockTouchIdSetupRoute, {
        fromSettings: true,
      })
    }
  }

  onBackup = () => {
    const { navigation: { navigate, state, goBack } } = this.props
    // If no there is no route, then default to Settings
    const initialRoute = get(state, 'routeName', settingsRoute)
    navigate(genRecoveryPhraseRoute, {
      initialRoute,
    })
  }

  openAboutApp = () => {
    if (this.props.navigation.isFocused()) {
      this.props.navigation.navigate(aboutAppRoute, {})
    }
  }

  openOnfido = () => {
    this.props.navigation.navigate(onfidoRoute, {})
  }

  openFeedback = () => {
    Apptentive.presentMessageCenter()
  }

  static navigationOptions = {
    header: null,
  }

  renderAvatarWithSource = (avatarSource: number | ImageSource) => (
    <Avatar medium round src={avatarSource} />
  )

  hideWalletPopupModal = () => {
    this.setState({
      walletBackupModalVisible: false,
    })
  }

  componentWillReceiveProps(nextProps: SettingsProps) {
    if (
      this.props.currentScreen === nextProps.currentScreen &&
      nextProps.currentScreen === settingsRoute &&
      this.props.timeStamp !== nextProps.timeStamp
    ) {
      this.setState({ disableTouchIdSwitch: false })
    } else if (
      nextProps.currentScreen === lockTouchIdSetupRoute &&
      this.props.currentScreen === settingsRoute
    ) {
      // if user has left settings screen and navigated to lockTouchIdSetup screen
      this.setState({ disableTouchIdSwitch: true })
    }
    if (
      nextProps.walletBackup.status !== this.props.walletBackup.status &&
      nextProps.walletBackup.status === 'SUCCESS'
    ) {
      this.setState({
        walletBackupModalVisible: true,
      })
    }
  }

  getLastBackupTime() {
    return this.props.lastSuccessfulBackup !== '' ? (
      <CustomText transparentBg h7 bold style={[style.backupTimeSubtitleStyle]}>
        Last backup was{' '}
        <CustomDate transparentBg h7 bold style={[style.subtitleColor]}>
          {this.props.lastSuccessfulBackup}
        </CustomDate>
      </CustomText>
    ) : (
      ''
    )
  }

  render() {
    const { walletBalance } = this.props
    const userAvatar = (
      <CustomView center style={[style.userAvatarContainer]}>
        <CustomView verticalSpace>
          <UserAvatar testID={USER_AVATAR_TEST_ID} userCanChange>
            {this.renderAvatarWithSource}
          </UserAvatar>
        </CustomView>
        {/* <SettingText testID={USERNAME_TEST_ID} style={[style.username]}>
          Anonymous
        </SettingText> */}
        <CustomView row center testID={SOVRINTOKEN_AMOUNT_TEST_ID}>
          <Icon
            small
            testID={SOVRINTOKEN_TEST_ID}
            src={require('../images/sovrinTokenOrange.png')}
          />
          <CustomText
            h5
            demiBold
            center
            style={[
              style.floatTokenAmount,
              {
                fontSize: tokenAmountSize(
                  walletBalance ? walletBalance.length : 0
                ),
              },
            ]}
            transparentBg
            testID={SOVRINTOKEN_AMOUNT_TEST_ID}
            formatNumber
          >
            {walletBalance}
          </CustomText>
        </CustomView>
        <CustomView>
          <CustomText transparentBg bold darkgray style={[style.tokenText]}>
            TOKENS
          </CustomText>
        </CustomView>
      </CustomView>
    )

    const userName = (
      <SettingText testID={USERNAME_TEST_ID}>Name: Anonymous</SettingText>
    )

    const toggleSwitch =
      Platform.OS === 'ios' ? (
        <Switch
          disabled={this.state.disableTouchIdSwitch}
          onTintColor={mantis}
          onValueChange={this.onChangeTouchId}
          value={this.props.touchIdActive}
        />
      ) : (
        <ToggleSwitch
          onToggle={this.onChangeTouchId}
          value={this.props.touchIdActive}
          buttonWidth={55}
          buttonHeight={30}
          buttonRadius={30}
          sliderWidth={28}
          sliderHeight={28}
          sliderRadius={58}
          buttonOnColor={mantis}
          buttonOffColor={lightWhite}
          sliderOnColor={white}
          sliderOffColor={white}
        />
      )

    const settingsItemList = [
      {
        id: 1,
        title: 'Backup Data',
        subtitle: this.getLastBackupTime(),
        avatar: <SvgCustomIcon name="Backup" />,
        rightIcon: '',
        onPress: this.onBackup,
      },
      {
        id: 2,
        title: 'Biometrics',
        subtitle: 'Use your finger or face to secure app',
        avatar: <SvgCustomIcon name="Biometrics" />,
        rightIcon: toggleSwitch,
        onPress: this.onChangeTouchId,
      },
      {
        id: 3,
        title: 'Passcode',
        subtitle: 'Change the code to unlock this app',
        avatar: <SvgCustomIcon name="Passcode" />,
        rightIcon: '',
        onPress: this.onChangePinClick,
      },
      {
        id: 4,
        title: 'Chat With Us',
        subtitle: 'Tell us what you think of Connect.Me',
        avatar: <SvgCustomIcon name="Chat" />,
        rightIcon: '',
        onPress: this.openFeedback,
      },
      {
        id: 5,
        title: 'About',
        subtitle: 'Legal, Version, and Network Information',
        avatar: <SvgCustomIcon name="About" />,
        rightIcon: '',
        onPress: this.openAboutApp,
      },
      {
        id: 6,
        title: 'Onfido',
        subtitle: '',
        avatar: <Icon src={require('../images/onfido_colour.png')} />,
        rightIcon: '',
        onPress: this.openOnfido,
      },
    ]
    return (
      <Container style={[style.mainContainer]}>
        <CustomView tertiary>
          <Banner navigation={this.props.navigation} />
          <ScrollView>
            {userAvatar}
            <List containerStyle={[style.mainContainer, style.listContainer]}>
              {settingsItemList.map((item, index) => {
                return (
                  <ListItem
                    containerStyle={[style.listItemContainer]}
                    titleStyle={[style.titleStyle]}
                    subtitleStyle={[style.subtitleStyle]}
                    key={index}
                    title={item.title}
                    subtitle={item.subtitle}
                    avatarStyle={[style.avatarStyle]}
                    avatar={item.avatar}
                    rightIcon={
                      item.rightIcon !== ''
                        ? item.rightIcon
                        : { name: 'chevron-right' }
                    }
                    hideChevron={item.rightIcon === ''}
                    onPress={item.onPress}
                  />
                )
              })}
            </List>
          </ScrollView>
        </CustomView>
      </Container>
    )
  }
}

const mapStateToProps = (state: Store) => ({
  touchIdActive: state.lock.isTouchIdEnabled,
  walletBackup: state.wallet.backup,
  currentScreen: state.route.currentScreen,
  timeStamp: state.route.timeStamp,
  lastSuccessfulBackup: state.backup.lastSuccessfulBackup,
  walletBalance: getWalletBalance(state),
})

const mapDispatchToProps = dispatch =>
  bindActionCreators({ selectUserAvatar }, dispatch)

export const SettingStack = createStackNavigator({
  [settingsRoute]: {
    screen: connect(mapStateToProps, mapDispatchToProps)(Settings),
  },
  [aboutAppRoute]: {
    screen: AboutApp,
  },
  [onfidoRoute]: {
    screen: Onfido,
  },
  [privacyTNCRoute]: {
    screen: PrivacyTNC,
  },
})

SettingStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true
  let swipeEnabled = true
  if (navigation.state.index > 0) {
    tabBarVisible = false
    swipeEnabled = false
  }
  return {
    tabBarVisible,
    swipeEnabled,
  }
}

export default SettingStack
