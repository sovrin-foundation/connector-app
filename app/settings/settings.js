import React, { PureComponent } from 'react'
import {
  View,
  Image,
  Text,
  Switch,
  StyleSheet,
  ScrollView,
  StatusBar,
} from 'react-native'
import { StackNavigator } from 'react-navigation'
import { Avatar, CustomText } from '../components'
import { CustomList, CustomView } from '../components/layout'
import { settingsRoute } from '../common/route-constants'
import {
  white,
  mantis,
  LIST_OFFSET_1X,
  barStyleDark,
  color,
} from '../common/styles/constant'
import {
  EDIT_ICON_DIMENSIONS,
  PASS_CODE_ASTERISK_TOP_OFFSET,
  HISTORY_TEST_ID,
  PASS_CODE_ASTERISK_TEST_ID,
  PASS_CODE_TEST_ID,
  TOUCH_ID_TEST_ID,
  USERNAME_TEST_ID,
} from './settings-constant'

const style = StyleSheet.create({
  container: {
    backgroundColor: color.bg.fifth.color,
  },
  headerStyle: {
    backgroundColor: color.bg.fifth.color,
    shadowOpacity: 0,
  },
  editIcon: {
    width: EDIT_ICON_DIMENSIONS,
    height: EDIT_ICON_DIMENSIONS,
  },
  labelImage: {
    marginRight: LIST_OFFSET_1X,
  },
  labelPassCode: {
    marginTop: PASS_CODE_ASTERISK_TOP_OFFSET,
  },
})

const userAvatar = (
  <Avatar medium round src={require('./images/UserAvatar.png')} />
)
const editIcon = (
  <Image
    style={style.editIcon}
    resizeMode={'contain'}
    source={require('./images/edit.png')}
  />
)

const SettingText = props => (
  <CustomText bg="fifth" h4 semiBold {...props}>
    {props.children}
  </CustomText>
)

const userName = <SettingText testID={USERNAME_TEST_ID}>Your Name</SettingText>
const passCode = (
  <CustomView row>
    <SettingText testID={PASS_CODE_TEST_ID}>Passcode: </SettingText>
    <SettingText
      testID={PASS_CODE_ASTERISK_TEST_ID}
      style={[style.labelPassCode]}
    >
      *******
    </SettingText>
  </CustomView>
)
const touchId = (
  <CustomView row>
    <Image
      style={[style.labelImage, style.editIcon]}
      source={require('./images/biometrics.png')}
    />
    <SettingText testID={TOUCH_ID_TEST_ID}>Enable Touch ID</SettingText>
  </CustomView>
)
const toggleSwitch = (
  <Switch onTintColor={mantis} tintColor={white} value={true} />
)
const history = (
  <CustomView row>
    <Image
      style={[style.labelImage, style.editIcon]}
      source={require('./images/history.png')}
    />
    <SettingText testID={HISTORY_TEST_ID}>View History</SettingText>
  </CustomView>
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
    right: editIcon,
  },
  {
    id: 3,
    left: touchId,
    right: toggleSwitch,
  },
  {
    id: 4,
    left: history,
  },
]

export class Settings extends PureComponent {
  static navigationOptions = {
    headerTitle: <SettingText>{settingsRoute}</SettingText>,
    headerStyle: style.headerStyle,
  }

  render() {
    return (
      <ScrollView style={style.container}>
        <StatusBar barStyle={barStyleDark} />
        <CustomList
          data={itemList}
          listStyle={style.list}
          itemStyle={style.item}
        />
      </ScrollView>
    )
  }
}

export default StackNavigator({
  [settingsRoute]: {
    screen: Settings,
  },
})
