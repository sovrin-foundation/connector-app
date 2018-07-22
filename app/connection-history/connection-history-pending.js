// @flow
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { Container } from '../components'
import type { ReactNavigation } from '../common/type-common'
import type { Store } from '../store/type-store'
import ClaimRequestModal from '../claim-offer/claim-request-modal'
import { CLAIM_REQUEST_STATUS } from '../claim-offer/type-claim-offer'

// TODO: Need to Add prop types
export class ConnectionHistoryPending extends PureComponent<void, void> {
  close = () => {
    this.props && this.props.navigation ? this.props.navigation.goBack() : ''
  }

  render() {
    const { payload } = this.props ? this.props : {}

    return (
      <Container fifth>
        <ClaimRequestModal
          claimRequestStatus={CLAIM_REQUEST_STATUS.SENDING_CLAIM_REQUEST}
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

//TODO: - fix - it should not be connected component
const mapStateToProps = (state: Store, props: ReactNavigation) => {
  const { payload } =
    props.navigation.state && props.navigation.state.params
      ? props.navigation.state.params
      : {}

  return {
    payload,
  }
}

export default connect(mapStateToProps)(ConnectionHistoryPending)
