// @flow
import React, { PureComponent } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import branch from 'react-native-branch'
import { deepLinkData, deepLinkEmpty, deepLinkError } from './deep-link-store'
import type { DeepLinkProps, DeepLinkBundle } from './type-deep-link'

export class DeepLink extends PureComponent<DeepLinkProps, void> {
  onDeepLinkData = (bundle: DeepLinkBundle) => {
    if (bundle.error) {
      this.props.deepLinkError(bundle.error)
    } else if (bundle.params) {
      if (bundle.params['+clicked_branch_link'] === true) {
        // update store with deep link params
        this.props.deepLinkData(bundle.params.t)
      } else {
        // update store that deep link was not clicked
        Object.keys(this.props.tokens).length === 0 &&
          this.props.deepLinkEmpty()
      }
    } else {
      Object.keys(this.props.tokens).length === 0 && this.props.deepLinkEmpty()
    }
  }

  componentDidMount() {
    branch.subscribe(this.onDeepLinkData)
  }

  render() {
    return null
  }
}

const mapStateToProps = state => ({
  tokens: state.deepLink.tokens,
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      deepLinkData,
      deepLinkEmpty,
      deepLinkError,
    },
    dispatch
  )

const DeepLinkConnected = connect(mapStateToProps, mapDispatchToProps)(DeepLink)

export default DeepLinkConnected
