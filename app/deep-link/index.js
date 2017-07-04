import React, { PureComponent } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import branch from 'react-native-branch'
import { deepLinkData, deepLinkEmpty, deepLinkError } from '../store'

class DeepLink extends PureComponent {
  componentDidMount() {
    branch.subscribe(bundle => {
      if (bundle) {
        if (bundle.error) {
          this.props.deepLinkError(bundle.error)
        } else if (bundle.params) {
          if (bundle.params['+clicked_branch_link'] === true) {
            // update store with deep link params
            this.props.deepLinkData(bundle.params.t)
          } else {
            // update store that deep link was not clicked
            this.props.deepLinkEmpty()
          }
        } else {
          this.props.deepLinkEmpty()
        }
      } else {
        this.props.deepLinkEmpty()
      }
    })
  }

  render() {
    return null
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      deepLinkData,
      deepLinkEmpty,
      deepLinkError,
    },
    dispatch
  )

const DeepLinkConnected = connect(null, mapDispatchToProps)(DeepLink)

export default DeepLinkConnected
