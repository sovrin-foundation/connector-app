// @flow
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Container } from '../components'
import type { ReactNavigation } from '../common/type-common'
import type { Store } from '../store/type-store'
import { ClaimRequestStatusModal } from '../claim-offer/claim-request-modal'
import { CLAIM_REQUEST_STATUS } from '../claim-offer/type-claim-offer'

type ConnectionHistoryPendingProps = {} & ReactNavigation

export class ConnectionHistoryPending extends PureComponent<
  ConnectionHistoryPendingProps,
  void
> {
  close = () => {
    this.props.navigation.goBack()
  }

  render() {
    const { payload } = this.props.navigation.state
      ? this.props.navigation.state.params
      : {}

    return (
      <Container fifth>
        <ClaimRequestStatusModal
          fromConnectionHistory
          claimRequestStatus={CLAIM_REQUEST_STATUS.SEND_CLAIM_REQUEST_SUCCESS}
          payload={payload}
          onContinue={this.close}
          senderLogoUrl={payload.senderLogoUrl}
          isPending={true}
          message1="As soon as"
          message3="signs and issues the credential"
          message5="to you, it will appear here."
        />
      </Container>
    )
  }
}
