// @flow

import React, { PureComponent } from 'react'
import { Image, Dimensions } from 'react-native'
import { createStackNavigator } from 'react-navigation'
import {
  Container,
  CustomView,
  CustomText,
  Icon,
  CustomButton,
  CustomHeader,
} from '../components'
import { backupCompleteRoute } from '../common'
import { SHORT_DEVICE, VERY_SHORT_DEVICE } from '../common/styles'
import { color } from '../common/styles/constant'
import type { BackupCompleteProps, BackupCompleteState } from './type-backup'
import {
  BACKUP_COMPLETE_CLOSE_TEST_ID,
  BACKUP_COMPLETE_SUBMIT_BUTTON,
  BACKUP_COMPLETE_SUBMIT_BUTTON_TITLE,
} from './backup-constants'
import styles from './styles'

const { height } = Dimensions.get('window')
const transparentBands = require('../images/transparentBands.png')
const closeImage = require('../images/iconClose.png')
// TODO: use real asset
const successCheck = require('../images/successCheck.png')

export class BackupComplete extends PureComponent<BackupCompleteProps, void> {
  backupComplete = () => {
    const { navigation: { navigate, state, goBack } } = this.props
    goBack(null)
    return navigate(state.params.initialRoute)
  }

  static navigationOptions = ({ navigation: { navigate, state } }) => ({
    header: (
      <CustomHeader
        backgroundColor={color.bg.fourteenth.color}
        largeHeader
        flatHeader
      >
        <CustomView style={[styles.headerSpacer]} />

        <CustomView style={[styles.headerSpacer]}>
          <Icon
            medium
            onPress={() => navigate(state.params.initialRoute)}
            testID={BACKUP_COMPLETE_CLOSE_TEST_ID}
            iconStyle={[styles.headerIcon]}
            src={closeImage}
          />
        </CustomView>
      </CustomHeader>
    ),
    gesturesEnabled: false,
  })

  render() {
    return (
      <Container style={[styles.backupComplete]} safeArea>
        <Image source={transparentBands} style={[styles.backgroundImage]} />
        <Container style={[styles.wrapper]}>
          <Container>
            <CustomView center>
              <CustomText transparentBg center style={[styles.title]}>
                Backup Complete
              </CustomText>
            </CustomView>
            <CustomView
              center
              doubleVerticalSpace={height > VERY_SHORT_DEVICE ? true : false}
            >
              <Image source={successCheck} />
            </CustomView>
            <CustomView horizontalSpace>
              <CustomView
                doubleVerticalSpace={height > VERY_SHORT_DEVICE ? true : false}
              >
                <CustomText
                  transparentBg
                  center
                  style={styles.backupCompleteText}
                >
                  If you ever have to start with a new installation of
                  connect.me you will need to recover from this saved backup
                  file.
                </CustomText>
              </CustomView>
              <CustomView doubleVerticalSpace>
                <CustomText
                  transparentBg
                  center
                  style={styles.backupCompleteText}
                >
                  You will be asked to enter your Recovery Phrase during setup
                  of your new Connect.Me application.
                </CustomText>
              </CustomView>
            </CustomView>
          </Container>
          <CustomButton
            large={height > SHORT_DEVICE ? true : false}
            onPress={this.backupComplete}
            testID={BACKUP_COMPLETE_SUBMIT_BUTTON}
            style={[styles.submitButton]}
            customColor={{
              color: color.bg.fourteenth.color,
              fontWeight: '600',
              fontSize: 18,
            }}
            title={BACKUP_COMPLETE_SUBMIT_BUTTON_TITLE}
          />
        </Container>
      </Container>
    )
  }
}

export default createStackNavigator({
  [backupCompleteRoute]: {
    screen: BackupComplete,
  },
})
