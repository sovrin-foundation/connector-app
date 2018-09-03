// @flow
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { AppState } from 'react-native'
import { getUnacknowledgedMessages } from './../store/config-store'
import { getRestoreStatus } from './../store/store-selector'
import type { Store } from './../store/type-store'
import { RestoreStatus } from '../restore/type-restore'
import type { AppStatusProps, AppStatusState } from './type-app-status'

class AppStatusComponent extends PureComponent<AppStatusProps, AppStatusState> {
  state = {
    appState: AppState.currentState,
  }

  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange)
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange)
  }

  _handleAppStateChange = nextAppState => {
    if (
      this.state.appState &&
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active' &&
      (this.props.restoreStatus === RestoreStatus.none ||
        this.props.restoreStatus === RestoreStatus.RESTORE_DATA_STORE_SUCCESS)
    ) {
      this.props.getUnacknowledgedMessages()
    }
    this.setState({ appState: nextAppState })
  }

  render() {
    return null
  }
}

const mapStateToProps = (state: Store) => {
  return {
    restoreStatus: getRestoreStatus(state),
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getUnacknowledgedMessages,
    },
    dispatch
  )

const AppStatus = connect(mapStateToProps, mapDispatchToProps)(
  AppStatusComponent
)

export default AppStatus
