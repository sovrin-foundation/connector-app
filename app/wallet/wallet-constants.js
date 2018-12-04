// @flow

export const RECEIVE_TAB = 'receive'
export const SEND_TAB = 'send'
export const HISTORY_TAB = 'history'
export const RECEIVE_TAB_TEST_ID = 'wallet-tab-receive'
export const SEND_TAB_TEST_ID = 'wallet-tab-send'
export const HISTORY_TAB_TEST_ID = 'wallet-tab-history'
export const SEND_TOKEN_BUTTON = 'wallet-send-token-button'
export const SEND_TOKENS_TO_PAYMENT_ADDRESS = 'wallet-send-tokens-to-address'
export const TO_SEND_DETAILS_TEST_ID = 'to-send-details-test-id'
export const FOR_SEND_DETAILS_TEST_ID = 'for-send-details-test-id'

export const FONT_SIZE_MAPPING = (length: number) => {
  switch (true) {
    case length < 5:
      return 60
    case length < 7:
      return 60
    case length < 10:
      return 50
    case length < 12:
      return 40
    default:
      return 30
  }
}
