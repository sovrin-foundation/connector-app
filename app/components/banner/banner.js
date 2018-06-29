// @flow

/*
  This component relies on the `showBanner` value in the wallet store.
  That decides whether or not it will render anything.
  If you want to trigger it to render then you need to call the method `promptBackupBanner` from the /wallet-store and pass it a truthy boolean.
  Right now it's being turned on from the connection saga & then turned off once a backup successful.
*/
import React, { PureComponent } from 'react'
import { StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import type { Store } from '../../store/type-store'
import { CustomView, CustomText, Icon } from '../../components'
import { color } from '../../common/styles'
import BackupWallet from '../../settings/backup-wallet'
import {
  IMAGE_WIDTH,
  IMAGE_HEIGHT,
  BACKUP_BANNER_TEST_ID,
  BANNER_HEIGHT,
} from './banner-constants'
import type { BannerProps } from './type-banner'
import DangerBanner from './banner-danger'
import { getBackupShowBanner } from '../../store/store-selector'

class Banner extends PureComponent<BannerProps, void> {
  render() {
    const { showBanner, navigation } = this.props

    if (showBanner) {
      return (
        <CustomView>
          <BackupWallet
            navigation={navigation}
            render={(status, backupWallet) => (
              <DangerBanner
                onPress={backupWallet}
                testID={BACKUP_BANNER_TEST_ID}
                bannerTitle={'Setup Data Recovery Now!'}
                bannerSubtitle={'2 easy steps, takes 3 minutes.'}
              />
            )}
          />
        </CustomView>
      )
    }
    return null
  }
}

const mapStateToProps = (state: Store) => {
  return {
    showBanner: getBackupShowBanner(state),
  }
}

export default connect(mapStateToProps)(Banner)
