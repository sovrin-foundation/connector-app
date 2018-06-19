// @flow

import React, { PureComponent } from 'react'
import { Image, StyleSheet, Dimensions, Platform } from 'react-native'
import { Container, CustomView, CustomText, CustomButton } from '../components'
import { SHORT_DEVICE, grey } from '../common/styles/constant'
import { lockSelectionRoute } from '../common'
import { DocumentPicker } from 'react-native-document-picker'
import { saveFileDocumentsDirectory } from '../bridge/react-native-cxs/RNCxs'
import RNFetchBlob from 'react-native-fetch-blob'

const { height } = Dimensions.get('window')

export class RestoreScreen extends PureComponent<*, void> {
  restoreBackup = () => {
    DocumentPicker.show(
      {
        filetype: [
          Platform.OS === 'android' ? 'application/zip' : 'public.zip-archive',
        ],
      },
      (error, res) => {
        if (res) {
          const split = res.uri.split('/')
          const name = split.pop()
          const inbox = split.pop()
          const realPath = `${inbox}/${name}`

          const documentDirectory = RNFetchBlob.fs.dirs.DocumentDir
          saveFileDocumentsDirectory(realPath, documentDirectory, 'restore.zip')
        } else {
          console.log('err', error)
        }
      }
    )
  }

  startFresh = () => {
    this.props.navigation.navigate(lockSelectionRoute)
  }
  render() {
    return (
      <Container safeArea fifth testID={'restore-container'}>
        <Container center>
          <Image
            source={require('../images/logo_connectme.png')}
            style={[styles.imageContainer]}
          />
          <CustomText center transparentBg tertiary h5>
            Identity Wallet
          </CustomText>
          <CustomText transparentBg tertiary h5 style={[styles.secondText]}>
            Thanks for installing connect.me.
          </CustomText>
          <CustomText
            center
            transparentBg
            tertiary
            h5
            style={[styles.marginHorizontal]}
          >
            You can restore from a backup or start with a brand new install.
          </CustomText>
          <CustomText transparentBg tertiary h5>
            How would you like to proceed?
          </CustomText>
        </Container>
        <CustomView
          horizontalSpace
          doubleVerticalSpace
          testID={'restore-buttons-view'}
        >
          <CustomButton
            large={height > SHORT_DEVICE ? true : false}
            style={[styles.customButton, styles.buttonShadow]}
            fifth
            title={'Restore From A Backup'}
            onPress={this.restoreBackup}
            testID={'restore-from-backup'}
          />
          <CustomButton
            large={height > SHORT_DEVICE ? true : false}
            style={[styles.customButton, styles.buttonShadow]}
            fifth
            title={'Start Fresh'}
            onPress={this.startFresh}
            testID={'start-fresh'}
          />
        </CustomView>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  customButton: {
    width: '100%',
    height: height > SHORT_DEVICE ? 57 : 43,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonShadow: {
    shadowColor: grey,
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowRadius: 5,
    shadowOpacity: 0.3,
    elevation: 4,
  },
  imageContainer: {
    marginBottom: '8%',
    marginTop: '15%',
  },
  secondText: {
    marginTop: '30%',
    marginBottom: 15,
  },
  marginHorizontal: {
    marginLeft: '13%',
    marginRight: '13%',
    marginBottom: 15,
  },
})
