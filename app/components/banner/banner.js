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
import {
  getBackupShowBanner,
  getLastSuccessfulBackupTimeStamp,
} from '../../store/store-selector'
import {
  LAST_SUCCESSFUL_BACKUP,
  FIRST_BACKUP_SUBTEXT,
  FIRST_BACKUP_TITLE,
  SUBSEQUENT_BACKUP_SUBTEXT,
  SUBSEQUENT_BACKUP_TITLE,
} from '../../common'

class Banner extends PureComponent<BannerProps, void> {
  render() {
    const { showBanner, navigation, lastSuccessfulBackupTimeStamp } = this.props
    let title = FIRST_BACKUP_TITLE
    let subtext = FIRST_BACKUP_SUBTEXT
    if (lastSuccessfulBackupTimeStamp !== '') {
      title = SUBSEQUENT_BACKUP_TITLE
      subtext = SUBSEQUENT_BACKUP_SUBTEXT
    }
    if (showBanner) {
      return (
        <CustomView>
          <BackupWallet
            navigation={navigation}
            render={(status, backupWallet) => (
              <DangerBanner
                onPress={backupWallet}
                testID={BACKUP_BANNER_TEST_ID}
                bannerTitle={title}
                bannerSubtext={subtext}
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
    lastSuccessfulBackupTimeStamp: getLastSuccessfulBackupTimeStamp(state),
  }
}

export default connect(mapStateToProps)(Banner)
