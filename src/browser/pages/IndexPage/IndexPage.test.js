import { IndexPage } from 'browser/pages/IndexPage';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';
import React from 'react';
chai.should()
chai.use(chaiEnzyme())

describe('<IndexPage />', () => {
  const props = {
    loading: false,
    location: { pathname: 'some' },
  }
  const wrapper = shallow(<IndexPage {...props} />)

  it('has className and tagName', () => {
    expect(wrapper).to.have.className('IndexPage')
    expect(wrapper.type().name).to.eq('PageWrapper')
  })

  it('has <WelcomeCard>', () => {
    expect(wrapper.find('withCookies(ReactComponent)')).to.exist
  })

  it('has <ForumsList />', () => {
    expect(wrapper.find('withQuery')).to.exist
  })

  it('has <CreateForumForm />', () => {
    expect(wrapper.find('ReduxForm')).to.exist
  })
})