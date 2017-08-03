import React from 'react'
import { shallow } from 'enzyme'
import chaiEnzyme from 'chai-enzyme'
import chai, { expect, assert } from 'chai'
import PageWrapper from 'browser/components/PageWrapper'
chai.should()
chai.use(chaiEnzyme())

describe('<PageWrapper />', () => {
  const props = {
    loading: true,
    preset: 'pop',
    location: {pathname: 'some'}
  }
  const wrapper = shallow(<PageWrapper {...props} />);

  // after(() => {
  //     // TODO does this breaks anything else in code?
  //     process.env = JSON.stringify({BROWSER: true});
  // });

  // it('has <RouteTransition />', () => {
  //   const transitionProps = wrapper.find('RouteTransition').props()
  //   expect(wrapper.find('RouteTransition')).to.have.length(1);
  //   expect(wrapper.find('.PageWrapper')).to.have.length(1);
  //   expect(transitionProps).to.have.property('pathname', props.location.pathname)
  // });

  it('inherits classNames properly', () => {
    const className = 'test'
    wrapper.setProps({className})
    expect(wrapper.hasClass(className)).to.equal(true);
  });

  // it('has <Loading />', () => {
  //   const loading = wrapper.find('Loading')
  //   expect(loading).to.have.length(1);
  // });

  it('has <MetaData>', () => {
    const el = wrapper.find('withRouter(MetaData)')
    expect(el).to.have.length(1)
  })

  // it('returns children in SSR', () => {
  //   process.env = JSON.stringify({BROWSER: false});
  //   const wrapper = shallow(<PageWrapper {...props}><section /></PageWrapper>)

  //   expect(wrapper.type()).to.eq('div')
  //   expect(wrapper).to.have.className('PageWrapper')
  //   expect(wrapper.find('section')).to.have.length(1)
  // });

});