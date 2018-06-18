// @flow

import React, { PureComponent } from 'react'
import { Platform, Image, Dimensions } from 'react-native'
import { StackNavigator } from 'react-navigation'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {
  Container,
  CustomView,
  CustomText,
  Icon,
  CustomButton,
} from '../components'
import { exportBackupFileRoute, backupCompleteRoute } from '../common'
import { SHORT_DEVICE } from '../common/styles'
import { color } from '../common/styles/constant'
import type { ExportBackupFileProps } from './type-backup'
import styles from './styles'
import { walletBackup } from '../wallet/wallet-store'
import type { Store } from '../store/type-store'

const { height } = Dimensions.get('window')
const transparentBands = require('../images/transparentBands.png')
const backImage = require('../images/icon_backArrow_white.png')
const closeImage = require('../images/iconClose.png')

export class ExportBackupFile extends PureComponent<
  ExportBackupFileProps,
  void
> {
  doNothing = () => {}

  componentDidUpdate(prevProps: ExportBackupFileProps) {
    if (
      prevProps.backupStatus !== 'SUCCESS' &&
      this.props.backupStatus === 'SUCCESS'
    ) {
      this.props.navigation.navigate(backupCompleteRoute)
    }
  }

  encryptAndBackup = () => {
    this.props.walletBackup()
  }

  static navigationOptions = ({ navigation }) => ({
    headerLeft: (
      <CustomView style={[styles.headerSpacer]}>
        <Icon
          medium
          onPress={() => navigation.goBack(null)}
          testID="export-backup-back'-image"
          iconStyle={[styles.headerBackIcon]}
          src={backImage}
        />
      </CustomView>
    ),
    headerRight: (
      <CustomView style={[styles.headerSpacer]}>
        <Icon
          medium
          // TODO: change to go back 3 routes??
          onPress={() => navigation.goBack(null)}
          testID="export-backup-close-image"
          iconStyle={[styles.headerIcon]}
          src={closeImage}
        />
      </CustomView>
    ),
    headerStyle: {
      backgroundColor: color.bg.thirteenth.color,
      borderBottomWidth: 0,
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
      <Container style={[styles.exportBackup]}>
        <Image source={transparentBands} style={[styles.backgroundImage]} />
        <Container style={[styles.wrapper]}>
          <CustomView center>
            <CustomText transparentBg center style={[styles.title]}>
              Export Your Encrypted Backup File
            </CustomText>
          </CustomView>
          <CustomButton
            large={height > SHORT_DEVICE ? true : false}
            onPress={this.encryptAndBackup}
            testID="export-encrypted-backup"
            style={[styles.submitButton]}
            customColor={{
              color: color.bg.thirteenth.color,
              fontWeight: '600',
              fontSize: 18,
              fontFamily: Platform.OS === 'ios' ? 'Arial' : 'sans-serif-thin',
            }}
            title="Export Encrypted Backup"
          />
        </Container>
      </Container>
    )
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators({ walletBackup }, dispatch)

const mapStateToProps = (state: Store) => {
  return {
    backupStatus: state.wallet.backup.status,
  }
}

export default StackNavigator({
  [exportBackupFileRoute]: {
    screen: connect(mapStateToProps, mapDispatchToProps)(ExportBackupFile),
  },
})
