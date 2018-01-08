import React from 'react'
import sinon from 'sinon'
import { shallow } from 'enzyme'
import chaiEnzyme from 'chai-enzyme'
import chai, { expect, assert } from 'chai'
import { translate as t } from 'browser/containers/Translator'
import { SocialLike } from 'browser/components/SocialLike'
chai.should()
chai.use(chaiEnzyme())

describe('<SocialLike />', () => {

  const props = {}
  const wrapper = shallow(<SocialLike {...props} />)

  it('has #vk_like', () => {
    const el = wrapper.find('#vk_like')
    expect(el).to.exist
    expect(el).to.have.className('SocialLike')
  })

})