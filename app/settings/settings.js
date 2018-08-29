// @flow
import React, { PureComponent } from 'react'
import { Text, Switch, StyleSheet, Platform, ScrollView } from 'react-native'
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
  privacyTNCRoute,
} from '../common/route-constants'
import { Switch as AndroidSwitch } from 'react-native-switch'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { white, mantis, OFFSET_1X, color } from '../common/styles/constant'
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
} from './settings-constant'

import type { Store } from '../store/type-store'
import type { SettingsProps, SettingsState } from './type-settings'
import { tertiaryHeaderStyles } from '../components/layout/header-styles'
import type { ImageSource } from '../common/type-common'
import { selectUserAvatar } from '../store/user/user-store'
import { Apptentive } from 'apptentive-react-native'
//import WalletBackupSuccessModal from '../backup/wallet-backup-success-modal'
import AboutApp from '../about-app/about-app'
import PrivacyTNC from '../privacy-tnc/privacy-tnc-screen'
import Banner from '../components/banner/banner'

const style = StyleSheet.create({
  container: {
    overflow: 'scroll',
  },
  editIcon: {
    width: EDIT_ICON_DIMENSIONS,
    height: EDIT_ICON_DIMENSIONS,
  },
  labelImage: {
    marginRight: OFFSET_1X,
  },
  labelPassCode: {
    marginTop: PASS_CODE_ASTERISK_TOP_OFFSET,
  },
})

const SettingText = props => (
  <CustomText h5 bg="fifth" tertiary semiBold {...props}>
    {props.children}
  </CustomText>
)

export class Settings extends PureComponent<SettingsProps, SettingsState> {
  state = {
    walletBackupModalVisible: false,
  }
  onChangePinClick = () => {
    this.props.navigation.push(lockEnterPinRoute, {
      existingPin: true,
    })
  }

  onChangeTouchId = (switchState: boolean) => {
    // when the navigation from settings is done by touching the Switch, then the touch id enables with wiered behaviour
    // reason for the behaviour: the onChangeTouchId function is being invoked twice making to navigate twice.
    // solution: the if condition will check for the current state of the switch and compares with the actual state of the switch
    // this confirms to make the onChangeTouchId function to invoke only once at all the times
    if (this.props.touchIdActive !== switchState) {
      this.props.navigation.push(lockTouchIdSetupRoute, {
        fromSettings: true,
      })
    }
  }

  openAboutApp = () => {
    this.props.navigation.navigate(aboutAppRoute, {})
  }

  openFeedback = () => {
    Apptentive.presentMessageCenter()
  }

  static navigationOptions = {
    header: (
      <CustomHeader
        backgroundColor={color.bg.tertiary.color}
        flatHeader
        centerComponent={
          <CustomText bg="tertiary" tertiary transparentBg semiBold>
            {settingsRoute}
          </CustomText>
        }
      />
    ),
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
      nextProps.walletBackup.status !== this.props.walletBackup.status &&
      nextProps.walletBackup.status === 'SUCCESS'
    ) {
      this.setState({
        walletBackupModalVisible: true,
      })
    }
  }

  render() {
    const userAvatar = (
      <UserAvatar testID={USER_AVATAR_TEST_ID} userCanChange>
        {this.renderAvatarWithSource}
      </UserAvatar>
    )
    const editIcon = (
      <Icon
        iconStyle={[style.editIcon, { tintColor: 'grey' }]}
        resizeMode={'contain'}
        src={require('../images/edit.png')}
        onPress={this.props.selectUserAvatar}
      />
    )

    const editIconChangePin = (
      <Icon
        iconStyle={[style.editIcon, { tintColor: 'grey' }]}
        resizeMode={'contain'}
        src={require('../images/edit.png')}
        onPress={this.onChangePinClick}
      />
    )

    const userName = (
      <SettingText testID={USERNAME_TEST_ID}>Name: Anonymous</SettingText>
    )

    const passCode = (
      <CustomView row>
        <SettingText testID={PASS_CODE_TEST_ID} onPress={this.onChangePinClick}>
          Pass code:{' '}
        </SettingText>
        <SettingText
          onPress={this.onChangePinClick}
          testID={PASS_CODE_ASTERISK_TEST_ID}
          style={[style.labelPassCode]}
        >
          ******
        </SettingText>
      </CustomView>
    )
    const touchId = (
      <CustomView row>
        <Icon
          iconStyle={[style.labelImage, style.editIcon, { tintColor: mantis }]}
          src={require('../images/biometrics.png')}
        />
        <CustomView center>
          <SettingText onPress={this.onChangeTouchId} testID={TOUCH_ID_TEST_ID}>
            Enable Touch ID
          </SettingText>
        </CustomView>
      </CustomView>
    )
    const toggleSwitch =
      Platform.OS === 'ios' ? (
        <Switch
          onTintColor={mantis}
          onValueChange={this.onChangeTouchId}
          value={this.props.touchIdActive}
        />
      ) : (
        <AndroidSwitch
          onTintColor={mantis}
          tintColor={white}
          onValueChange={this.onChangeTouchId}
          value={this.props.touchIdActive}
        />
      )

    const onChat = (
      <CustomView row onPress={this.openFeedback} testID={CHAT_TEST_ID}>
        <Icon
          iconStyle={[style.labelImage, style.editIcon, { tintColor: mantis }]}
          src={require('../images/icon_feedback.png')}
        />
        <CustomView center>
          <SettingText>Chat with us</SettingText>
        </CustomView>
      </CustomView>
    )

    const onAboutApp = (
      <CustomView row onPress={this.openAboutApp} testID={ABOUT_APP_TEST_ID}>
        <Icon
          iconStyle={[style.labelImage, style.editIcon, { tintColor: mantis }]}
          src={require('../images/icon_aboutApp.png')}
        />
        <CustomView center>
          <SettingText>About This App</SettingText>
        </CustomView>
      </CustomView>
    )

    const onBackup = (
      <BackupWallet
        navigation={this.props.navigation}
        render={(status, backupWallet) => (
          <CustomView row onPress={backupWallet} testID={BACKUP_DATA_WALLET}>
            {/* TODO: change out placeholder icon */}
            <Icon
              iconStyle={[
                style.labelImage,
                style.editIcon,
                { tintColor: mantis },
              ]}
              src={require('../images/icon_backup.png')}
            />
            <CustomView center>
              <SettingText>Backup my wallet</SettingText>
            </CustomView>
          </CustomView>
        )}
      />
    )

    const itemList = [
      {
        id: 0,
        left: userAvatar,
        right: editIcon,
      },
      // We don't need Name option for now, will add it later when story comes up
      // {
      //   id: 1,
      //   left: userName,
      //   right: editIcon,
      // },
      {
        id: 2,
        left: passCode,
        right: editIconChangePin,
      },
      {
        id: 3,
        left: touchId,
        right: toggleSwitch,
      },
      {
        id: 4,
        left: onAboutApp,
      },
      {
        id: 5,
        left: onChat,
      },
      {
        id: 6,
        left: onBackup,
      },
    ]

    return (
      <Container tertiary>
        <CustomView style={[style.container]}>
          <Banner navigation={this.props.navigation} />
          <ScrollView>
            <CustomList data={itemList} />
          </ScrollView>
        </CustomView>
      </Container>
    )
  }
}

const mapStateToProps = (state: Store) => ({
  touchIdActive: state.lock.isTouchIdEnabled,
  walletBackup: state.wallet.backup,
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
