// @flow

import React, { PureComponent } from 'react'
import { Image, StyleSheet, Dimensions } from 'react-native'
import { Container, CustomView, CustomText, Icon } from '../components'
import { VERY_SHORT_DEVICE, darkGray } from '../common/styles/constant'

const { height } = Dimensions.get('window')

export class RestoreWaitScreen extends PureComponent<*, void> {
  render() {
    return (
      <Container fifth safeArea center>
        <CustomView>
          <Image
            source={require('../images/bkgCurve.png')}
            style={[styles.backgroundImage]}
          />

          <CustomView center>
            <CustomView style={[styles.strip]} />

            <Icon
              extraLarge
              style={[styles.iconStyle]}
              src={require('../images/dataRestore.png')}
            />
          </CustomView>

          <CustomView center>
            <CustomText
              bold
              center
              transparentBg
              style={[styles.textContainer]}
              heavy
            >
              Please wait while your data is restored.
            </CustomText>
          </CustomView>
        </CustomView>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  textContainer: {
    marginBottom: '6%',
    marginTop: '20%',
    paddingHorizontal: '5%',
    color: darkGray,
    fontSize: 23,
  },
  backgroundImage: {
    position: 'absolute',
    zIndex: -1,
  },

  iconStyle: {
    borderRadius: 80,
    borderColor: darkGray,
    borderWidth: 30,
    backgroundColor: darkGray,
  },
  strip: {
    position: 'absolute',
    width: '100%',
    height: 8,
    backgroundColor: darkGray,
  },
})
