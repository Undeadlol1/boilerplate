import React from 'react'
import { shallow } from 'enzyme'
import chaiEnzyme from 'chai-enzyme'
import chai, { expect, assert } from 'chai'
import PageWrapper from 'browser/components/PageWrapper'
chai.should()
chai.use(chaiEnzyme())

describe('<PageWrapper />', () => {
  const props = {
    children: <h1>test</h1>,
  }
  const wrapper = shallow(<PageWrapper {...props} />);

  it('inherits classNames properly', () => {
    const className = 'test'
    wrapper.setProps({className})
    expect(wrapper.hasClass(className)).to.equal(true)
  });

  it('has <Grid>', () => {
    const el = wrapper.find('Styled(Grid)')
    expect(el).to.exist
    // must have fluid grid by default
    expect(el).to.have.prop('fluid', true)
    // must change "grid" prop value properly
    wrapper.setProps({fluid: false})
    const afterUpdate = wrapper.find('Styled(Grid)')
    expect(afterUpdate).to.have.prop('fluid', false)
  })

  it('has <MetaData>', () => {
    const el = wrapper.find('withRouter(MetaData)')
    expect(el).to.exist
  })

  it('has children', () => {
    const el = wrapper.find('h1')
    expect(el).to.exist
    expect(el).to.have.text('test')
  })

});