// @flow

import React, { PureComponent } from 'react'
import { Platform, Image, Dimensions } from 'react-native'
import { StackNavigator } from 'react-navigation'
import {
  Container,
  CustomView,
  CustomText,
  Icon,
  CustomButton,
} from '../components'
import { backupCompleteRoute } from '../common'
import { SHORT_DEVICE } from '../common/styles'
import { color } from '../common/styles/constant'
import type { BackupCompleteProps, BackupCompleteState } from './type-backup'
import styles from './styles'

const { height } = Dimensions.get('window')
const transparentBands = require('../images/transparentBands.png')
const closeImage = require('../images/iconClose.png')

export class BackupComplete extends PureComponent<BackupCompleteProps, void> {
  doNothing = () => {}

  backupComplete = () => {
    //this.props.navigation.navigate(exportBackupFileRoute)
  }

  static navigationOptions = ({ navigation }) => ({
    headerRight: (
      <CustomView style={[styles.headerSpacer]}>
        <Icon
          medium
          // TODO: change to go back 3 routes??
          onPress={() => navigation.goBack(null)}
          testID="backup-complete-close-image"
          iconStyle={[styles.headerIcon]}
          src={closeImage}
        />
      </CustomView>
    ),
    headerStyle: {
      backgroundColor: color.bg.fourteenth.color,
      shadowOpacity: 0,
      shadowOffset: {
        height: 0,
      },
      shadowRadius: 0,
      elevation: 0,
    },
    gesturesEnabled: true,
  })

  render() {
    return (
      <Container style={[styles.backupComplete]}>
        <Image source={transparentBands} style={[styles.backgroundImage]} />
        <Container style={[styles.wrapper]}>
          <CustomView center>
            <CustomText transparentBg center style={[styles.title]}>
              Backup Complete
            </CustomText>
          </CustomView>
          <CustomButton
            large={height > SHORT_DEVICE ? true : false}
            onPress={this.backupComplete}
            testID="backup-complete-submit-button"
            style={[styles.submitButton]}
            customColor={{
              color: color.bg.fourteenth.color,
              fontWeight: '600',
              fontSize: 18,
            }}
            title="Done"
          />
        </Container>
      </Container>
    )
  }
}

export default StackNavigator({
  [backupCompleteRoute]: {
    screen: BackupComplete,
  },
})
