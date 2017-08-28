// @flow
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { checkPinAction } from './lock-store'
import { Container, CustomText, CustomButton } from '../components'
import { CHECK_PIN_IDLE, CHECK_PIN_SUCCESS, CHECK_PIN_FAIL } from './type-lock'
import type { Store } from '../store/type-store'
import type { LockEnterPinProps } from './type-lock'

export class LockEnterPin extends PureComponent<void, LockEnterPinProps, void> {
  onPinSubmit = () => {
    this.props.checkPinAction('123456')
  }

  componentWillReceiveProps(nextProps: LockEnterPinProps) {
    if (this.props.checkPinStatus !== nextProps.checkPinStatus) {
      if (nextProps.checkPinStatus === CHECK_PIN_SUCCESS) {
        if (this.props.pendingRedirection) {
          this.props.navigation.navigate(this.props.pendingRedirection)
        }
      }
    }
  }

  render() {
    return (
      <Container primary center>
        <CustomText h3>Enter pin code to unlock app</CustomText>
        <CustomButton primary title="Enter pin" onPress={this.onPinSubmit} />
      </Container>
    )
  }
}

const mapStateToProps = (state: Store) => ({
  checkPinStatus: state.lock.checkPinStatus,
  pendingRedirection: state.lock.pendingRedirection,
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      checkPinAction,
    },
    dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(LockEnterPin)
