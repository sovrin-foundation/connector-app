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
      this.props.restore.status === RestoreStatus.RESTORE_DATA_STORE_SUCCESS &&
      this.props.route === restoreWaitRoute
    ) {
      // TODO: the params have to be removed when the lockEnterPinRoute design is changed in according with the recovery screen.
      this.props.navigation.navigate(lockEnterPinRoute, {
        fromScreen: 'recovery',
      })
    }

    if (
      this.props.restore.error !== prevProps.restore.error &&
      this.props.route === restoreWaitRoute
    ) {
      //the navigation stack here is like Restore Start-> Restore Wait->Restore Start
      // So before going to Restore Start goBack two times and remove the routes from the stack
      this.props.navigation.goBack(null)
      this.props.navigation.goBack(null)
      this.props.navigation.navigate(restoreRoute)
    }
  }

  render() {
    return (
      <Container fifth safeArea center>
        <CustomView style={[styles.mainContainer]}>
          <Image
            source={require('../images/bkgCurve.png')}
            style={[styles.backgroundImage]}
          />

          <CustomView center>
            <CustomView style={[styles.strip]} />

            <Icon
              xxLarge
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
  mainContainer: {
    marginTop: '-20%',
  },
  textContainer: {
    marginBottom: '6%',
    marginTop: '15%',
    paddingHorizontal: '5%',
    color: darkGray,
    fontSize: 23,
  },
  backgroundImage: {
    position: 'absolute',
    marginTop: '-58%',
    width: '100%',
    zIndex: -1,
  },

  iconStyle: {
    borderRadius: 80,
    padding: 15,
    backgroundColor: darkGray,
  },
  strip: {
    position: 'absolute',
    width: '110%',
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
