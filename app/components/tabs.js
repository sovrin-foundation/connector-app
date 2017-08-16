import React, { PureComponent } from 'react'
import { View, Image, StyleSheet } from 'react-native'
import { Icon } from '../components'
import {
  settingsRoute,
  homeRoute,
  qrCodeScannerRoute,
} from '../common/route-constants'
import layoutStyle from '../components/layout/layout-style'
import {
  CURVE_WIDTH,
  CURVE_HEIGHT,
  ICON_WIDTH,
  INNER_PADDING,
  ACTIVE_ICON_WIDTH,
  ICON_BACKGROUND_WIDTH,
  INACTIVE_ICON_OPACITY,
  DISABLED_ICON_OPACITY,
} from '../common/styles/tab-constants'

import { OFFSET_1X } from '../common/styles/constant'

const AddConnectionImage = require('../images/addConnection.png')
const UserAvatarImage = require('../images/UserAvatar.png')

class SettingsIcon extends PureComponent {
  onClick = () => {
    !this.props.settingsDisabled && this.props.onClick(settingsRoute)
  }

  render() {
    if (this.props.isActive) {
      return (
        <Image
          style={styles.activeTab}
          testID="tab-active-settings-icon"
          source={require('../images/settings.png')}
        />
      )
    }

    return (
      <Icon
        small
        iconStyle={[styles.iconStyle, this.props.style]}
        src={require('../images/settings.png')}
        testID="tab-settings-icon"
        onPress={this.onClick}
      />
    )
  }
}

class AvatarIcon extends PureComponent {
  onClick = () => {
    this.props.onClick(homeRoute)
  }

  render() {
    if (this.props.isActive) {
      return (
        <Image
          style={styles.activeTab}
          testID="tab-active-avatar-icon"
          source={require('../images/UserAvatar.png')}
        />
      )
    }

    return (
      <Icon
        small
        iconStyle={[styles.iconStyle, styles.inactive]}
        src={require('../images/UserAvatar.png')}
        testID="tab-avatar-icon"
        onPress={this.onClick}
      />
    )
  }
}

class AddConnectionIcon extends PureComponent {
  onClick = () => {
    const { type } = this.props
    const toRoute = type === homeRoute
      ? qrCodeScannerRoute
      : type === settingsRoute ? homeRoute : null

    // call onClick only if there is a route to redirect
    // this will disable the click on qr code scanner screen
    toRoute && this.props.onClick(toRoute)
  }

  render() {
    if (this.props.isActive) {
      return (
        <Image
          style={styles.activeTab}
          testID="tab-active-add-connection-icon"
          source={AddConnectionImage}
        />
      )
    }

    return (
      <Icon
        small
        iconStyle={[
          styles.iconStyle,
          this.props.disabled ? styles.disabled : styles.inactive,
        ]}
        testID="tab-add-connection-icon"
        src={
          this.props.type === settingsRoute
            ? UserAvatarImage
            : AddConnectionImage
        }
        onPress={this.onClick}
      />
    )
  }
}

export default class Tabs extends PureComponent {
  onClick = route => {
    this.props.onTabClick(route)
  }

  // TODO:PS
  // whole component design/implementation is not correct.
  // Fix it and make it independent of specifying left and right.
  // Each icon will define it's own click handler and
  // Tabs should figure out in animation how to move icons from left to right and vice versa.
  render() {
    const { type } = this.props
    const leftIconStyle = type !== settingsRoute
      ? styles.inactive
      : styles.disabled

    const settingsDisabled = type === settingsRoute

    return (
      <Image
        source={require('../images/bkg_menu_375.png')}
        style={styles.outerContainer}
      >
        <View style={[layoutStyle.row, layoutStyle.center]}>
          <View style={styles.innerContainer}>

            {type === qrCodeScannerRoute
              ? <AvatarIcon onClick={this.onClick} />
              : <SettingsIcon
                  style={leftIconStyle}
                  settingsDisabled={settingsDisabled}
                  onClick={this.onClick}
                />}

            <View
              style={[
                layoutStyle.container,
                layoutStyle.row,
                layoutStyle.hCenter,
                styles.centerContainer,
              ]}
            >
              <Image
                style={styles.activeTabContainer}
                source={require('../images/bkg_navicon.png')}
              />
              {type == settingsRoute
                ? <SettingsIcon isActive />
                : type === homeRoute
                    ? <AvatarIcon isActive />
                    : <AddConnectionIcon isActive />}
            </View>

            {type !== qrCodeScannerRoute
              ? <AddConnectionIcon onClick={this.onClick} type={type} />
              : <AddConnectionIcon disabled />}

          </View>
        </View>
      </Image>
    )
  }
}

const styles = StyleSheet.create({
  outerContainer: {
    width: CURVE_WIDTH,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
    paddingBottom: OFFSET_1X,
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: INNER_PADDING,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  iconStyle: {
    width: ICON_WIDTH,
    height: ICON_WIDTH,
  },
  centerContainer: {
    paddingBottom: OFFSET_1X,
  },
  activeTabContainer: {
    width: ICON_BACKGROUND_WIDTH,
    height: ICON_BACKGROUND_WIDTH,
    marginTop: -20,
    resizeMode: 'contain',
    position: 'absolute',
  },
  activeTab: {
    width: ACTIVE_ICON_WIDTH,
    height: ACTIVE_ICON_WIDTH,
  },
  inactive: {
    opacity: INACTIVE_ICON_OPACITY,
  },
  disabled: {
    opacity: DISABLED_ICON_OPACITY,
  },
})
