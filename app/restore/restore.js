// @flow

import React, { PureComponent } from 'react'
import { Image, StyleSheet, Dimensions, Platform } from 'react-native'
import { Container, CustomView, CustomText, CustomButton } from '../components'
import { SHORT_DEVICE, grey } from '../common/styles/constant'
import { lockSelectionRoute, restorePassphraseRoute } from '../common'
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
          let filename = ''

          if (Platform.OS === 'android') {
            filename = name.split('%2F').pop()
          } else {
            filename = name
          }

          const inbox = split.pop()
          const realPath = `${inbox}/${name}`

          const documentDirectory = RNFetchBlob.fs.dirs.DocumentDir
          saveFileDocumentsDirectory(realPath, documentDirectory, 'restore.zip')
          this.props.navigation.navigate(restorePassphraseRoute, {
            filename,
          })
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
        <Image
          source={require('../images/wave2.png')}
          style={[styles.backgroundWaveImage]}
        />
        <Container testID={'restore-innercontainer'}>
          <CustomView center>
            <Image
              source={require('../images/logo_connectme.png')}
              style={[styles.imageContainer]}
            />
          </CustomView>
        </Container>
        <CustomView
          horizontalSpace
          doubleVerticalSpace
          testID={'restore-buttons-view'}
        >
          <CustomView center style={[styles.textContainer]}>
            <CustomText
              transparentBg
              style={[styles.secondText, styles.textBox]}
            >
              Thanks for installing connect.me.
            </CustomText>
            <CustomText
              center
              transparentBg
              style={[styles.marginHorizontal, styles.textBox]}
            >
              You can restore from a backup or start with a brand new install.
            </CustomText>
            <CustomText transparentBg style={[styles.textBox]}>
              How would you like to proceed?
            </CustomText>
          </CustomView>
          <CustomButton
            large={height > SHORT_DEVICE ? true : false}
            style={[styles.customButton, styles.buttonShadow]}
            title={'Restore From A Backup'}
            onPress={this.restoreBackup}
            testID={'restore-from-backup'}
            customColor={{
              color: 'rgba(74,143,227,1)',
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
              color: 'rgba(74,143,227,1)',
              fontWeight: '600',
            }}
          />
        </CustomView>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
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
  textContainer: {
    marginBottom: '10%',
  },
  secondText: {
    marginBottom: '6%',
  },
  marginHorizontal: {
    marginLeft: '6%',
    marginRight: '6%',
    marginBottom: '6%',
  },
  textBox: {
    fontWeight: '500',
    color: 'rgba(112,112,112,1)',
    fontSize: 18,
    lineHeight: 22,
    fontFamily: 'Lato',
  },
})
