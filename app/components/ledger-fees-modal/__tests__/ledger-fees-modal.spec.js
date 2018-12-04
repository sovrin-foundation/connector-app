// @flow

import React from 'react'
import 'react-native'
import renderer from 'react-test-renderer'
import { STORE_STATUS } from '../../../common/type-common'
import type { GenericObject } from '../../../common/type-common'
import {
  LedgerFeesModalComponent,
  LedgerFeesModalStatus,
  LedgerFeesDescriptionText,
} from '../ledger-fees-modal'
import type { LedgerFeesModalProps } from '../ledger-fees-modal'
import { ERROR_GET_LEDGER_FEES } from '../../../store/ledger/type-ledger-store'
import type { LedgerFees } from '../../../store/ledger/type-ledger-store'

describe('<LedgerFeesModalComponent />', () => {
  const ledgerFees: LedgerFees = {
    data: {
      transfer: '0',
    },
    status: STORE_STATUS.IDLE,
    error: null,
  }

  function getCommonProps(
    props: LedgerFeesModalProps | GenericObject
  ): LedgerFeesModalProps {
    return {
      onYes: jest.fn(),
      onNo: jest.fn(),
      getLedgerFees: jest.fn(),
      resetLedgerFees: jest.fn(),
      isVisible: true,
      ledgerFees,
      walletBalance: '0',
      ...props,
    }
  }

  function setup(extraProps) {
    const props = getCommonProps(extraProps)
    const wrapper = renderer.create(<LedgerFeesModalComponent {...props} />)
    const instance = wrapper.root.findByType(LedgerFeesModalComponent).instance

    return { props, wrapper, instance }
  }

  it('trigger getLedgerFees to start fetching ledger fees', () => {
    const { wrapper, props } = setup({})
    expect(wrapper.toJSON()).toMatchSnapshot()
    expect(props.getLedgerFees).toHaveBeenCalled()
  })

  it('show loader, loading text, no buttons, if fetching fees', () => {
    const feesWithInProgress = {
      data: {
        transfer: '0',
      },
      status: STORE_STATUS.IN_PROGRESS,
      error: null,
    }
    const { wrapper } = setup({ ledgerFees: feesWithInProgress })
    expect(wrapper.toJSON()).toMatchSnapshot()
  })

  it('show error if fetching fees failed, show retry and cancel buttons', () => {
    const feesWithError = {
      data: {
        transfer: '0',
      },
      status: STORE_STATUS.ERROR,
      error: ERROR_GET_LEDGER_FEES('Test error'),
    }
    const { wrapper } = setup({ ledgerFees: feesWithError })
    expect(wrapper.toJSON()).toMatchSnapshot()
  })

  it('show transfer fees, Yes & No buttons, if fees is fetched', () => {
    const fees = {
      data: {
        transfer: '0.01',
      },
      status: STORE_STATUS.SUCCESS,
      error: null,
    }
    const { wrapper } = setup({ ledgerFees: fees, walletBalance: '1' })
    expect(wrapper.toJSON()).toMatchSnapshot()
  })

  it('show text passed by consumer of component, if renderFeesText is passed', () => {
    const fees = {
      data: {
        transfer: '0.01',
      },
      status: STORE_STATUS.SUCCESS,
      error: null,
    }
    const renderFeesText = (fees: string, status: string) => {
      switch (status) {
        case LedgerFeesModalStatus.TRANSFER_POSSIBLE_WITH_FEES:
          return (
            <LedgerFeesDescriptionText>
              Passed message {fees}
            </LedgerFeesDescriptionText>
          )
        default:
          return null
      }
    }
    const { wrapper } = setup({
      ledgerFees: fees,
      walletBalance: '1',
      renderFeesText,
    })
    expect(wrapper.toJSON()).toMatchSnapshot()
  })
})
