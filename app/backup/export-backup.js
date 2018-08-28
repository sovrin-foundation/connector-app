// @flow

import React, { PureComponent } from 'react'
import { Image, Dimensions } from 'react-native'
import { createStackNavigator } from 'react-navigation'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {
  Container,
  CustomView,
  CustomText,
  Icon,
  CustomButton,
  CustomHeader,
} from '../components'
import CustomActivityIndicator from '../components/custom-activity-indicator/custom-activity-indicator'

import {
  exportBackupFileRoute,
  backupCompleteRoute,
  backupErrorRoute,
} from '../common'
import { SHORT_DEVICE, VERY_SHORT_DEVICE } from '../common/styles'
import { color } from '../common/styles/constant'
import type { ExportBackupFileProps } from './type-backup'
import styles from './styles'
import { exportBackup } from './backup-store'
import type { Store } from '../store/type-store'
import {
  EXPORT_BACKUP_BACK_TEST_ID,
  EXPORT_BACKUP_CLOSE_TEST_ID,
  EXPORT_BACKUP_SUBMIT_BUTTON_TEST_ID,
  EXPORT_BACKUP_BUTTON_TITLE,
} from './backup-constants'
import { BACKUP_STORE_STATUS } from './type-backup'
import { getBackupStatus, getBackupWalletPath } from '../store/store-selector'

const { height } = Dimensions.get('window')
const transparentBands = require('../images/transparentBands.png')
const backImage = require('../images/icon_backArrow_white.png')
const closeImage = require('../images/iconClose.png')
const encryptedFile = require('../images/encryptedFile.png')

export class ExportBackupFile extends PureComponent<
  ExportBackupFileProps,
  void
> {
  parseFilePath = (path: string) => {
    const beginning = path.lastIndexOf('/') + 1
    const end = path.length

    return path.slice(beginning, end)
  }

  componentDidUpdate(prevProps: ExportBackupFileProps) {
    const { navigation: { navigate, state, goBack }, backupStatus } = this.props
    if (
      prevProps.backupStatus !== BACKUP_STORE_STATUS.BACKUP_COMPLETE &&
      backupStatus === BACKUP_STORE_STATUS.BACKUP_COMPLETE
    ) {
      goBack(null)
      navigate(backupCompleteRoute, {
        initialRoute: state.params.initialRoute,
      })
    } else if (
      prevProps.backupStatus !== BACKUP_STORE_STATUS.EXPORT_BACKUP_FAILURE &&
      backupStatus === BACKUP_STORE_STATUS.EXPORT_BACKUP_FAILURE
    ) {
      goBack(null)
      navigate(backupErrorRoute, {
        initialRoute: state.params.initialRoute,
      })
    }
  }

  encryptAndBackup = () => {
    this.props.exportBackup()
  }

  BackupPath = (path: string) => {
    if (path) {
      return (
        <CustomView center>
          <CustomText center transparentBg style={[styles.exportBackupFile]}>
            {this.parseFilePath(path)}
          </CustomText>
        </CustomView>
      )
    }

    return null
  }

  ExportImage = (status: string) => {
    if (
      status === BACKUP_STORE_STATUS.EXPORT_BACKUP_LOADING ||
      status === BACKUP_STORE_STATUS.GENERATE_BACKUP_FILE_LOADING
    ) {
      return (
        <CustomView doubleVerticalSpace>
          <CustomActivityIndicator tintColor={color.actions.none} />
        </CustomView>
      )
    }

    return (
      <CustomView center style={[styles.lockIconImage]}>
        <Image source={encryptedFile} style={[styles.imageIcon]} />
      </CustomView>
    )
  }

  static navigationOptions = ({ navigation: { goBack, navigate, state } }) => ({
    header: (
      <CustomHeader
        flatHeader
        largeHeader
        backgroundColor={color.bg.thirteenth.color}
      >
        <CustomView style={[styles.headerSpacer]}>
          <Icon
            medium
            onPress={() => goBack(null)}
            testID={EXPORT_BACKUP_BACK_TEST_ID}
            iconStyle={[styles.headerBackIcon]}
            src={backImage}
          />
        </CustomView>

        <CustomView style={[styles.headerSpacer]}>
          <Icon
            medium
            onPress={() => navigate(state.params.initialRoute)}
            testID={EXPORT_BACKUP_CLOSE_TEST_ID}
            iconStyle={[styles.headerIcon]}
            src={closeImage}
          />
        </CustomView>
      </CustomHeader>
    ),
    gesturesEnabled: true,
  })

  render() {
    const { backupPath, backupStatus } = this.props
    const disableButton =
      backupStatus === BACKUP_STORE_STATUS.GENERATE_BACKUP_FILE_LOADING
        ? true
        : false

    return (
      <Container style={[styles.exportBackup]} safeArea>
        <Image source={transparentBands} style={[styles.backgroundImage]} />
        <Container style={[styles.wrapper]}>
          <CustomView center>
            <CustomText transparentBg center style={[styles.exportBackupTitle]}>
              Export Your Encrypted Backup File
            </CustomText>
          </CustomView>
          <CustomView center>
            <CustomText
              center
              transparentBg
              style={[styles.exportBackupMainText]}
            >
              You will need your recovery phrase to unlock this backup file.
            </CustomText>
          </CustomView>
          <CustomView
            center
            verticalSpace={height > VERY_SHORT_DEVICE ? true : false}
          >
            <CustomText
              center
              transparentBg
              style={[styles.exportBackupMainText]}
            >
              Don’t worry, only you can decrypt the backup with your recovery
              phrase.
            </CustomText>
          </CustomView>

          {this.ExportImage(backupStatus)}
          {this.BackupPath(backupPath)}
        </Container>

        <CustomView verticalSpace>
          <CustomView center>
            <CustomText
              center
              transparentBg
              bold
              style={[styles.exportBackupSmallMessage]}
            >
              This backup contains all your data in Connect.Me. Store it
              somewhere safe.
            </CustomText>
          </CustomView>
          <CustomButton
            large={height > SHORT_DEVICE ? true : false}
            disabled={disableButton}
            onPress={this.encryptAndBackup}
            testID={EXPORT_BACKUP_SUBMIT_BUTTON_TEST_ID}
            style={[styles.submitButton]}
            customColor={{
              color: color.bg.thirteenth.color,
              fontWeight: '600',
              fontSize: 18,
            }}
            title={EXPORT_BACKUP_BUTTON_TITLE}
          />
        </CustomView>
      </Container>
    )
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators({ exportBackup }, dispatch)

const mapStateToProps = (state: Store) => {
  return {
    backupStatus: getBackupStatus(state),
    backupPath: getBackupWalletPath(state),
  }
}

export default createStackNavigator({
  [exportBackupFileRoute]: {
    screen: connect(mapStateToProps, mapDispatchToProps)(ExportBackupFile),
  },
})
