import React, { PureComponent } from 'react'
import {
  View,
  Image,
  Text,
  Switch,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native'
import { StackNavigator } from 'react-navigation'
import { Avatar, CustomText } from '../components'
import { CustomList, CustomView, Container } from '../components/layout'
import {
  settingsRoute,
  lockEnterPinRoute,
  lockTouchIdSetupRoute,
} from '../common/route-constants'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  white,
  mantis,
  darkGrey,
  OFFSET_1X,
  barStyleDark,
  color,
} from '../common/styles/constant'
import {
  EDIT_ICON_DIMENSIONS,
  PASS_CODE_ASTERISK_TOP_OFFSET,
  PASS_CODE_ASTERISK_TEST_ID,
  PASS_CODE_TEST_ID,
  TOUCH_ID_TEST_ID,
  USERNAME_TEST_ID,
} from './settings-constant'
const style = StyleSheet.create({
  headerStyle: {
    backgroundColor: color.bg.tertiary.color,
    shadowOpacity: 0,
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

export class Settings extends PureComponent {
  onChangePinClick = () => {
    this.props.navigation.navigate(lockEnterPinRoute, {
      existingPin: true,
    })
  }

  onChangeTouchId = () => {
    this.props.navigation.navigate(lockTouchIdSetupRoute, {
      fromSettings: true,
    })
  }

  static navigationOptions = {
    headerTitle: (
      <CustomText bg="fifth" h5 semiBold tertiary>
        {' '}
        {settingsRoute}{' '}
      </CustomText>
    ),
    headerStyle: style.headerStyle,
  }

  render() {
    const userAvatar = (
      <Avatar medium round src={require('../images/UserAvatar.png')} />
    )
    const editIcon = (
      <Image
        style={[style.editIcon, { tintColor: 'grey' }]}
        resizeMode={'contain'}
        source={require('../images/edit.png')}
      />
    )

    const editIconChangePin = (
      <TouchableOpacity onPress={this.onChangePinClick}>
        <Image
          style={[style.editIcon, { tintColor: 'grey' }]}
          resizeMode={'contain'}
          source={require('../images/edit.png')}
        />
      </TouchableOpacity>
    )

    const SettingText = props => (
      <CustomText h5 bg="fifth" tertiary semiBold {...props}>
        {props.children}
      </CustomText>
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
        <Image
          style={[style.labelImage, style.editIcon, { tintColor: mantis }]}
          source={require('../images/biometrics.png')}
        />
        <CustomView center>
          <SettingText onPress={this.onChangeTouchId} testID={TOUCH_ID_TEST_ID}>
            Enable Touch ID
          </SettingText>
        </CustomView>
      </CustomView>
    )
    const toggleSwitch = (
      <Switch
        onTintColor={mantis}
        tintColor={white}
        onValueChange={this.onChangeTouchId}
        value={this.props.touchIdActive}
      />
    )
    const itemList = [
      {
        id: 0,
        left: userAvatar,
        right: editIcon,
      },
      {
        id: 1,
        left: userName,
        right: editIcon,
      },
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
    ]

    return (
      <Container tertiary>
        <ScrollView style={style.container}>
          <CustomList
            data={itemList}
            listStyle={style.list}
            itemStyle={style.item}
          />
        </ScrollView>
      </Container>
    )
  }
}

const mapStateToProps = (state: Store) => ({
  touchIdActive: state.lock.isTouchIdEnabled,
})

export default StackNavigator({
  [settingsRoute]: {
    screen: connect(mapStateToProps, null)(Settings),
  },
})
