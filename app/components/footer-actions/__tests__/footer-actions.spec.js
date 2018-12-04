// @flow
import React from 'react'
import 'react-native'
import renderer from 'react-test-renderer'
import { Provider } from 'react-redux'
import FooterActions from '../footer-actions'
import { getStore } from '../../../../__mocks__/static-data'
import type { FooterActionsProps } from '../type-footer-actions'

describe('<FooterActions />', () => {
  function getProps(props?: * = {}) {
    return {
      testID: 'test',
      useColorPicker: true,
      ...props,
    }
  }

  function setup(override?: * = {}) {
    const store = getStore()
    const props = getProps(override)
    const wrapper = renderer.create(
      <Provider store={store}>
        <FooterActions {...props} />
      </Provider>
    )

    return { store, wrapper, props }
  }

  it('should match snapshot', () => {
    const { wrapper } = setup()

    expect(wrapper.toJSON()).toMatchSnapshot()
  })

  it('match snapshot when hidePrimary is true', () => {
    const { wrapper } = setup({ hidePrimary: true })

    expect(wrapper.toJSON()).toMatchSnapshot()
  })
})
