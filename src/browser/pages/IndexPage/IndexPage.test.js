import React from 'react'
import sinon from 'sinon'
import chaiEnzyme from 'chai-enzyme'
import chai, { expect, assert } from 'chai'
import { shallow, mount, render } from 'enzyme'
import { IndexPage } from 'browser/pages/IndexPage'
import { translate } from 'browser/containers/Translator'
chai.should()
chai.use(chaiEnzyme())

describe('<IndexPage />', () => {
  const props = {
                  loading: false,
                  location: {pathname: 'some'},
                }
  const wrapper = shallow(<IndexPage {...props} />)

  it('has className and tagName', () => {
    expect(wrapper).to.have.className('IndexPage')
    expect(wrapper.type().name).to.eq('PageWrapper')
  })

  it('has <WelcomeCard>', () => {
    expect(wrapper.find('withCookies(WelcomeCard)')).to.exist
  })

  it('has <ForumsList />', () => {
    expect(wrapper.find('withQuery')).to.exist
  })

  it('has <CreateForumForm />', () => {
    expect(wrapper.find('ReduxForm')).to.exist
  })
})