// @flow

import React, { PureComponent } from 'react'
import { Image, StyleSheet, Dimensions } from 'react-native'
import { createStackNavigator } from 'react-navigation'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {
  Container,
  CustomView,
  CustomText,
  CustomButton,
  Icon,
  CustomHeader,
} from '../components'
import {
  SHORT_DEVICE,
  grey,
  venetianRed,
  white,
} from '../common/styles/constant'
import { updateStatusBarTheme } from '../store/connections-store'
import { generateBackupFile } from '../backup/backup-store'
import { backupErrorRoute, exportBackupFileRoute } from '../common'
import type { BackupErrorProps } from './type-backup'
import headerStyles from './styles'
import {
  BACKUP_ERROR_BACK_TEST_ID,
  BACKUP_ERROR_CLOSE_TEST_ID,
} from './backup-constants'

const { height } = Dimensions.get('window')

const backImage = require('../images/icon_backArrow_white.png')
const closeImage = require('../images/iconClose.png')
export class BackupErrorScreen extends PureComponent<BackupErrorProps, void> {
  static navigationOptions = ({ navigation: { goBack, navigate, state } }) => ({
    header: (
      <CustomHeader backgroundColor={venetianRed} largeHeader flatHeader>
        <CustomView style={[headerStyles.headerSpacer]}>
          <Icon
            medium
            onPress={() => goBack(null)}
            testID={BACKUP_ERROR_BACK_TEST_ID}
            iconStyle={[headerStyles.headerBackIcon]}
            src={backImage}
          />
        </CustomView>

        <CustomView style={[headerStyles.headerSpacer]}>
          <Icon
            medium
            onPress={() => navigate(state.params.initialRoute)}
            testID={BACKUP_ERROR_CLOSE_TEST_ID}
            iconStyle={[headerStyles.headerIcon]}
            src={closeImage}
          />
        </CustomView>
      </CustomHeader>
    ),
    gesturesEnabled: true,
  })

  tryAgain = () => {
    const { initialRoute } = this.props.navigation.state.params
    this.props.generateBackupFile()
    this.props.navigation.navigate(exportBackupFileRoute, {
      initialRoute,
    })
  }

  render() {
    return (
      <Container
        safeArea
        testID={'restore-container'}
        style={[styles.backupErrorContainer]}
      >
        <Image
          source={require('../images/transparentBands2.png')}
          style={[styles.backgroundWaveImage]}
        />
        <Container testID={'restore-innercontainer'}>
          <CustomView center>
            <Image
              source={require('../images/alertRed.png')}
              style={[styles.errorImageContainer]}
            />
          </CustomView>

          <CustomView center pad>
            <CustomText
              transparentBg
              style={[styles.errorText]}
              center
              medium
              h4a
              center
            >
              There was a problem exporting your Connect.Me backup file. Please
              try again.
            </CustomText>
          </CustomView>
        </Container>
        <Container bottom pad>
          <CustomView pad>
            <CustomButton
              large={height > SHORT_DEVICE ? true : false}
              style={[styles.customButton, styles.buttonShadow]}
              title={'Try Again'}
              onPress={this.tryAgain}
              testID={'try-again'}
              customColor={{
                color: venetianRed,
                fontWeight: '600',
              }}
            />
          </CustomView>
        </Container>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  backupErrorContainer: {
    backgroundColor: venetianRed,
  },
  backgroundWaveImage: {
    position: 'absolute',
    top: height > SHORT_DEVICE ? '30%' : '20%',
    left: 0,
    right: 0,
    resizeMode: 'stretch',
    width: '100%',
  },
  customButton: {
    width: '100%',
    height: height > SHORT_DEVICE ? 57 : 43,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonShadow: {
    shadowColor: grey,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowRadius: 5,
    shadowOpacity: 0.3,
    elevation: 4,
  },
  errorImageContainer: {
    marginTop: '5%',
    zIndex: -1,
  },
  errorText: {
    color: white,
  },
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      updateStatusBarTheme,
      generateBackupFile,
    },
    dispatch
  )

export default createStackNavigator({
  [backupErrorRoute]: {
    screen: connect(null, mapDispatchToProps)(BackupErrorScreen),
  },
})
