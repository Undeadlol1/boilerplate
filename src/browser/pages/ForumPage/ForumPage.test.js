import React from 'react'
import sinon from 'sinon'
import chaiEnzyme from 'chai-enzyme'
import chai, { expect, assert } from 'chai'
import { shallow, mount, render } from 'enzyme'
import { ForumPage } from 'browser/pages/ForumPage'
import { translate } from 'browser/containers/Translator'
chai.should()
chai.use(chaiEnzyme())

describe('<ForumPage />', () => {
  const props = {ForumId: '123'}
  const wrapper = shallow(<ForumPage {...props} />)

  it('has className and tagName', () => {
    expect(wrapper).to.have.className('ForumPage')
    expect(wrapper.type().name).to.eq('PageWrapper')
  })

  it('has <Grid>', () => {
    expect(wrapper.find('Styled(Grid)')).to.exist
  })

  it('has <ThreadsList>', () => {
    const el = wrapper.find('Connect(ThreadsList)')
    expect(el).to.exist
  })

  it('has <CreateThreadForm>', () => {
    const el = wrapper.find('ReduxForm')
    expect(el).to.exist
    expect(el.props().parentId).to.eq(props.ForumId)
  })
})