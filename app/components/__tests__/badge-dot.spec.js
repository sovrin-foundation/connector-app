// @flow
import React from 'react'
import 'react-native'
import { Dot } from '../badges-dot'
import renderer from 'react-test-renderer'

describe('<Dot />', () => {
  it('should render with small Dot', () => {
    const dotComponent = renderer.create(<Dot size={'small'} />).toJSON()
    expect(dotComponent).toMatchSnapshot()
  })
  it('should render with medium Dot', () => {
    const dotComponent = renderer.create(<Dot size={'medium'} />).toJSON()
    expect(dotComponent).toMatchSnapshot()
  })
  it('should render with large Dot', () => {
    const dotComponent = renderer.create(<Dot size={'large'} />).toJSON()
    expect(dotComponent).toMatchSnapshot()
  })
})
