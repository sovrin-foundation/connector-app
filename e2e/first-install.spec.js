import { exec } from 'child-process-async'

describe('ConnectMe without invitation', () => {
  beforeEach(async () => {
    await device.reloadReactNative()
  })

  it('switch environment, pin code setup, show dashboard', async () => {
    const orText = element(by.id('lock-selection-or-text-touchable'))

    await orText.longPress()
    for (let i = 0; i < 10; i++) {
      await orText.tap()
    }
    if (device.getPlatform() === 'ios') {
      await element(
        by.label('OK').and(by.type('_UIAlertControllerActionView'))
      ).tap()
    } else {
      await element(by.type('android.widget.Button').and(by.text('OK'))).tap()
    }

    await element(by.id('switch-environment-dev')).tap()
    await element(by.id('switch-environment-footer-accept')).tap()

    await element(by.id('pin-code-selection-touchable')).tap()

    await element(by.id('pin-code-input-box')).replaceText('000000')
    await element(by.id('pin-code-input-box')).replaceText('000000')

    await element(by.id('close-button')).tap()

    await expect(element(by.id('user-avatar'))).toBeVisible()

    if (device.getPlatform() === 'ios') {
      await exec('xcrun simctl io booted screenshot e2e/screenshots/home.jpg')
    }
  })
})
