import React, { PureComponent } from 'react'
import { View, Image, StyleSheet } from 'react-native'
import { Icon } from '../components'
import { settingsRoute, homeRoute } from '../common/route-constants'
import layoutStyle from '../components/layout/layout-style'
import {
  CURVE_WIDTH,
  CURVE_HEIGHT,
  ICON_WIDTH,
  INNER_PADDING,
  OFFSET_1X,
  ACTIVE_ICON_WIDTH,
  ICON_BACKGROUND_WIDTH,
  INACTIVE_ICON_OPACITY,
  DISABLED_ICON_OPACITY,
} from '../common/styles/tab-constants'

export default class Tabs extends PureComponent {
  // TODO:PS
  // whole component design/implementation is not correct.
  // Fix it and make it independent of specifying left and right.
  // Each icon will define it's own click handler and
  // Tabs should figure out in animation how to move icons from left to right and vice versa.
  render() {
    const { type, leftIconClick, rightIconClick } = this.props
    const leftIconStyle = StyleSheet.flatten([
      type === homeRoute ? styles.inactive : styles.disabled,
    ])
    return (
      <Image
        source={require('../images/bkg_menu_375.png')}
        style={styles.outerContainer}
      >
        <View style={[layoutStyle.row, layoutStyle.center]}>
          <View style={styles.innerContainer}>
            <Icon
              small
              iconStyle={[styles.iconStyle, leftIconStyle]}
              src={require('../images/settings.png')}
              testID="tab-settings-icon"
              onPress={
                leftIconClick ? () => leftIconClick(settingsRoute) : undefined
              }
            />

            {type == homeRoute &&
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
                <Image
                  style={styles.activeTab}
                  testID="tab-active-avatar-icon"
                  source={require('../images/UserAvatar.png')}
                />
              </View>}

            {type == settingsRoute &&
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
                <Image
                  style={styles.activeTab}
                  testID="tab-active-settings-icon"
                  source={require('../images/settings.png')}
                />
              </View>}

            <Icon
              small
              iconStyle={[styles.iconStyle, styles.inactive]}
              testID="tab-add-connection-icon"
              src={require('../images/addConnection.png')}
              onPress={
                rightIconClick
                  ? () => rightIconClick(homeRoute, true)
                  : undefined
              }
            />

          </View>
        </View>
      </Image>
    )
  }
}

const styles = StyleSheet.create({
  outerContainer: {
    width: CURVE_WIDTH,
    resizeMode: 'contain',
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
