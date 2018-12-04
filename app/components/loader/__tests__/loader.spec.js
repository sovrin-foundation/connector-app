// @flow
import 'react-native'
import React from 'react'
import renderer from 'react-test-renderer'
import Loader from '../loader'

describe('<Loader />', () => {
  it('should render properly and match the snapshot', () => {
    const component = renderer.create(<Loader delay={0} message="test" />)
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('should check that delay works', () => {
    const component = renderer.create(<Loader delay={1000} message="test" />)
    const tree = component.toJSON()

    expect(tree).toBe(null)
  })

  xit('should check that interval works', () => {
    // const component = renderer.create(<Loader />)
    // const tree = component.toJSON()
    // expect(tree).toMatchSnapshot()
  })
  xit('should check that timeout works', () => {
    // const component = renderer.create(<Loader />)
    // const tree = component.toJSON()
    // expect(tree).toMatchSnapshot()
  })

  it('should check that custom message works', () => {
    const component = renderer.create(<Loader message="sovrin is cool" />)
    const tree = component.toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('should check that showMessage works as expected when true', () => {
    const component = renderer.create(<Loader showMessage message="show me" />)
    const tree = component.toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('should check that showMessage works as expected when false', () => {
    const component = renderer.create(
      <Loader showMessage={false} message="don't show me" />
    )
    const tree = component.toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('should check that light type works', () => {
    const component = renderer.create(
      <Loader type="light" showMessage={false} />
    )
    const tree = component.toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('should check that dark type works', () => {
    const component = renderer.create(
      <Loader type="dark" showMessage={false} />
    )
    const tree = component.toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('should check that size works', () => {
    const component = renderer.create(<Loader size={48} showMessage={false} />)
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
