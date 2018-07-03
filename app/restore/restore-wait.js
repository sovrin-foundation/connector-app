// @flow

import React, { PureComponent } from 'react'
import { Image, StyleSheet, Dimensions } from 'react-native'
import { Container, CustomView, CustomText, Icon } from '../components'
import { VERY_SHORT_DEVICE, darkGray } from '../common/styles/constant'
import { connect } from 'react-redux'
import { restoreRoute, restoreWaitRoute, lockEnterPinRoute } from '../common'
import type { RestoreWaitScreenProps } from './type-restore'
import type { Store } from '../store/type-store'
import { RestoreStatus } from './type-restore'

const { height } = Dimensions.get('window')

export class RestoreWaitScreen extends PureComponent<
  RestoreWaitScreenProps,
  void
> {
  componentDidUpdate(prevProps: RestoreWaitScreenProps) {
    if (
      !this.props.restore.error &&
      this.props.restore.status === RestoreStatus.FILE_DECRYPT_SUCCESS &&
      this.props.route === restoreWaitRoute
    ) {
      // TODO: the params have to be removed when the lockEnterPinRoute design is changed in according with the recovery screen.
      // TODO: for testing - Remove the setTimeout, as this is only the UI flow, so as there is no functionality going on in the decrypt of the zip file,
      // so to see the restore please wait screen had to put it, when we are implementing the actual decrypt of the zip file, the setTimeout will be removed
      setTimeout(() => {
        this.props.navigation.navigate(lockEnterPinRoute, {
          fromScreen: 'recovery',
        })
      }, 1000)
    }
    if (
      this.props.restore.error !== prevProps.restore.error &&
      this.props.route === restoreWaitRoute
    ) {
      // TODO: for testing - Remove the setTimeout, as this is only the UI flow, so as there is no functionality going on in the decrypt of the zip file,
      // so to see the restore please wait screen had to put it, when we are implementing the actual decrypt of the zip file, the setTimeout will be removed
      setTimeout(() => {
        this.props.navigation.navigate(restoreRoute)
      }, 1000)
    }
  }
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

const mapStateToProps = (state: Store) => {
  return {
    restore: state.restore,
    route: state.route.currentScreen,
  }
}

export default connect(mapStateToProps, null)(RestoreWaitScreen)
