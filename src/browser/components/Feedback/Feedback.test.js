import React from 'react'
import sinon from 'sinon'
import { shallow } from 'enzyme'
import chaiEnzyme from 'chai-enzyme'
import chai, { expect, assert } from 'chai'
import { translate as t } from 'browser/containers/Translator'
import { Feedback } from 'browser/components/Feedback'
chai.should()
chai.use(chaiEnzyme())

describe('<Feedback />', () => {

  const props = {}
  const wrapper = shallow(<Feedback {...props} />)

  it('has #vk_like', () => {
    const el = wrapper.find('#vk_community_messages')
    expect(el).to.exist
    expect(el).to.have.className('Feedback')
  })


})