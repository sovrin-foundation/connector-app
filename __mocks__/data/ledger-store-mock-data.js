// @flow
import { STORE_STATUS } from '../../app/common/type-common'

export const transferFees = {
  transfer: '0.00001',
}

export const ledgerStoreWithTransferFees = {
  fees: {
    data: transferFees,
    status: STORE_STATUS.SUCCESS,
    error: null,
  },
}
