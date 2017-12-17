import React from 'react'
import sinon from 'sinon'
import generateUuid from 'uuid/v4'
import chaiEnzyme from 'chai-enzyme'
import chai, { expect, assert } from 'chai'
import { shallow, mount, render } from 'enzyme'
import { ForumPage } from 'browser/pages/ForumPage'
import { translate } from 'browser/containers/Translator'
chai.should()
chai.use(chaiEnzyme())

describe('<ForumPage />', () => {
  const props = {
    name: 'Test forum',
    ForumId: generateUuid(),
  }
  const wrapper = shallow(<ForumPage {...props} />)

  it('has className and tagName', () => {
    expect(wrapper).to.have.className('ForumPage')
    expect(wrapper.type().name).to.eq('PageWrapper')
  })

  describe('header', () => {
    const header = wrapper.find('.ForumPage__header')

    it('has <Row> and <Col>', () => {
      expect(header.find('Styled(Row)')).to.exist
      expect(header.find('Styled(Col)')).to.exist
      expect(header.find('Styled(Col)').props().xs).to.eq(12)
    })

    it('has <h1>', () => {
      const el = header.find('h1')
      expect(el).to.exist
      expect(el).to.have.text(props.name)
      expect(el).to.have.className('ForumPage__title')
    })
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