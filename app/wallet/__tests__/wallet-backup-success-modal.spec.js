// @flow
import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'
import WalletBackupSuccessModal from '../wallet-backup-success-modal'
import { Clipboard } from 'react-native'
import { WALLET_ENCRYPTION_KEY } from '../../common'

const encryptionKeyMessage = 'Click here to Copy Your Wallet Encryption Key'
const copiedMessage = 'Copied !'

describe('<WalletBackupSuccessModal />', () => {
  function setup() {
    let hideWalletPopupModal = jest.fn()
    const component = renderer.create(
      <WalletBackupSuccessModal
        onContinue={hideWalletPopupModal}
        isVisible={false}
        walletEncryptionKey={WALLET_ENCRYPTION_KEY}
      />
    )
    const instance = component.root.findByType(WalletBackupSuccessModal)
      .instance
    return { component, instance }
  }
  it('should render properly and match the snapshot', () => {
    const { component } = setup()
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
  it('should call the function Clipboard.setString, and the button text to be as expected', () => {
    jest.useFakeTimers()
    const { instance } = setup()
    const copyToClipboard = jest.spyOn(Clipboard, 'setString')
    instance.copyToClipboard()
    expect(copyToClipboard).toHaveBeenCalledWith(WALLET_ENCRYPTION_KEY)
    copyToClipboard.mockReset()
    copyToClipboard.mockRestore()
    expect(instance.state.copyText).toEqual(copiedMessage)
    expect(setTimeout).toHaveBeenCalledTimes(1)
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 2000)
    jest.runOnlyPendingTimers()
    expect(instance.state.copyText).toEqual(encryptionKeyMessage)
  })
})
