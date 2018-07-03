// @flow
import React, { Component, PureComponent } from 'react'
import EnterPassphrase from '../components/backup-restore-passphrase/backup-restore-passphrase'
import { StackNavigator } from 'react-navigation'
import { color } from '../common/styles/constant'
import { restorePassphraseRoute, restoreWaitRoute } from '../common'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { submitPassphrase } from './restore-store'
import type { RestorePassphraseProps } from './type-restore'
import type { Store } from '../store/type-store'

export class RestorePassphrase extends Component<RestorePassphraseProps, void> {
  static navigationOptions = {
    headerStyle: {
      backgroundColor: color.bg.twelfth.color,
      borderBottomWidth: 0,
      elevation: 0,
    },
    gesturesEnabled: false,
  }

  submitPhrase = (event: any) => {
    this.props.submitPassphrase(event.nativeEvent.text)
    this.props.navigation.goBack(null)
    this.props.navigation.navigate(restoreWaitRoute)
  }

  render() {
    const filename = this.props.restore.restoreFile.fileName

    return (
      <EnterPassphrase
        testID={'restore-encrypt-phrase'}
        onSubmit={this.submitPhrase}
        placeholder={'Enter recovery phrase here'}
        filename={filename}
      />
    )
  }
}

const mapStateToProps = (state: Store) => {
  return {
    restore: state.restore,
    route: state.route.currentScreen,
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators({ submitPassphrase }, dispatch)

export default StackNavigator({
  [restorePassphraseRoute]: {
    screen: connect(mapStateToProps, mapDispatchToProps)(RestorePassphrase),
  },
})
