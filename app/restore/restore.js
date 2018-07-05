// @flow

import React, { PureComponent } from 'react'
import { Image, StyleSheet, Dimensions, Platform } from 'react-native'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Container, CustomView, CustomText, CustomButton } from '../components'
import {
  SHORT_DEVICE,
  grey,
  venetianRed,
  cornFlowerBlue,
  white,
} from '../common/styles/constant'
import {
  lockSelectionRoute,
  restorePassphraseRoute,
  restoreRoute,
} from '../common'
import { DocumentPicker } from 'react-native-document-picker'
import RNFetchBlob from 'react-native-fetch-blob'
import { updateStatusBarTheme } from '../store/connections-store'
import type { RestoreProps } from './type-restore'

import { saveFileToAppDirectory } from './restore-store'
import { NavigationActions } from 'react-navigation'
import type { Store } from '../store/type-store'
import { RestoreStatus } from './type-restore'

const { height } = Dimensions.get('window')

export class RestoreStartScreen extends PureComponent<RestoreProps, void> {
  restoreBackup = () => {
    DocumentPicker.show(
      {
        filetype: [
          Platform.OS === 'android' ? 'application/zip' : 'public.zip-archive',
        ],
      },
      (error, res) => {
        if (res) {
          this.props.saveFileToAppDirectory(res)
        } else {
          //TODO handle else
          console.log('err', error)
        }
      }
    )
  }

  startFresh = () => {
    this.props.navigation.navigate(lockSelectionRoute)
  }

  componentDidUpdate(prevProps: RestoreProps) {
    if (
      this.props.restore.status !== prevProps.restore.status &&
      this.props.restore.status === RestoreStatus.fileSaved &&
      this.props.route === restoreRoute
    ) {
      this.props.navigation.navigate(restorePassphraseRoute)
    }
    let statusBarColor =
      this.props.restore.error && this.props.route === restoreRoute
        ? venetianRed
        : white
    this.props.updateStatusBarTheme(statusBarColor)
  }

  componentDidMount() {
    if (!this.props.restore.error) {
      this.props.updateStatusBarTheme(white)
    } else {
      this.props.updateStatusBarTheme(venetianRed)
    }
  }

  render() {
    //TODO set error to display screen in error mode
    const error =
      this.props.restore.status === RestoreStatus.failedStatus ||
      (this.props.restore.status === RestoreStatus.FILE_SAVE_ERROR &&
        this.props.restore.error)
    let restoreIcon = require('../images/logo_connectme.png')
    let restoreBackground = require('../images/wave2.png')
    let restoreButtonTitle = 'Restore From A Backup'
    let restoreButtonColor = cornFlowerBlue

    if (error) {
      restoreIcon = require('../images/alertRed.png')
      restoreBackground = require('../images/transparentBands2.png')
      restoreButtonTitle = 'Select A Different File'
      restoreButtonColor = venetianRed
    }
    return (
      <Container
        safeArea
        testID={'restore-container'}
        style={[
          error ? styles.restoreErrorContainer : styles.restoreMainContainer,
        ]}
      >
        <Image
          source={restoreBackground}
          style={[styles.backgroundWaveImage]}
        />
        <Container testID={'restore-innercontainer'}>
          <CustomView center>
            <Image
              source={restoreIcon}
              style={[
                error ? styles.errorImageContainer : styles.imageContainer,
              ]}
            />
          </CustomView>

          {error ? (
            <CustomView center pad>
              <CustomText
                transparentBg
                style={[styles.errorText]}
                center
                medium
                h4a
                center
              >
                Either your passphrase was incorrect or the backup file you
                chose is corrupt or not a Connect.Me backup file. Please try
                again or start fresh.
              </CustomText>
            </CustomView>
          ) : null}
        </Container>
        <CustomView verticalSpace>
          {!error ? (
            <CustomView
              center
              doubleVerticalSpace
              style={[styles.textContainer]}
            >
              <CustomText
                transparentBg
                style={[styles.secondText, styles.textBox]}
                medium
                center
                h4a
              >
                Thanks for installing connect.me.
              </CustomText>
              <CustomText
                center
                transparentBg
                style={[styles.marginHorizontal, styles.textBox]}
                medium
                h4a
              >
                You can restore from a backup or start with a brand new install.
              </CustomText>
              <CustomText transparentBg style={[styles.textBox]} h4a medium>
                How would you like to proceed?
              </CustomText>
            </CustomView>
          ) : null}
          <CustomView pad>
            <CustomButton
              large={height > SHORT_DEVICE ? true : false}
              style={[styles.customButton, styles.buttonShadow]}
              title={restoreButtonTitle}
              onPress={this.restoreBackup}
              testID={'restore-from-backup'}
              customColor={{
                color: restoreButtonColor,
                fontWeight: '600',
              }}
            />
            <CustomButton
              large={height > SHORT_DEVICE ? true : false}
              style={[styles.customButton, styles.buttonShadow]}
              title={'Start Fresh'}
              onPress={this.startFresh}
              testID={'start-fresh'}
              customColor={{
                color: restoreButtonColor,
                fontWeight: '600',
              }}
            />
          </CustomView>
        </CustomView>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  restoreMainContainer: {
    backgroundColor: white,
  },
  restoreErrorContainer: {
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
  imageContainer: {
    marginTop: height > SHORT_DEVICE ? '30%' : '20%',
    zIndex: -1,
  },
  errorImageContainer: {
    marginTop: '5%',
    zIndex: -1,
  },
  textContainer: {
    marginBottom: '10%',
  },
  secondText: {
    marginBottom: '6%',
  },
  errorText: {
    color: white,
    paddingLeft: '5%',
    paddingRight: '5%',
  },
  marginHorizontal: {
    marginLeft: '6%',
    marginRight: '6%',
    marginBottom: '6%',
  },
  textBox: {
    color: '#717171',
  },
})

const mapStateToProps = (state: Store) => {
  return {
    restore: state.restore,
    route: state.route.currentScreen,
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators({ saveFileToAppDirectory, updateStatusBarTheme }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(RestoreStartScreen)
