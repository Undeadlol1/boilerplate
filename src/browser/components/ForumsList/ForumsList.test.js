import React from 'react'
import sinon from 'sinon'
import { shallow } from 'enzyme'
import chaiEnzyme from 'chai-enzyme'
import chai, { expect, assert } from 'chai'
import { translate as t } from 'browser/containers/Translator'
import { ForumsList } from 'browser/components/ForumsList'
chai.should()
chai.use(chaiEnzyme())

describe('<ForumsList />', () => {

  const props = {}
  // const wrapper = shallow(<ForumsList {...props} />)

  // it('has <Row>', () => {
  //   const el = wrapper.find('Styled(Row)')
  //   expect(el).to.have.length(1)
  //   expect(el).to.have.className('ForumsList')
  // })

  // it('has <Col>', () => {
  //   const el = wrapper.find('Styled(Col)')
  //   expect(el).to.have.length(1)
  //   expect(el.props().xs).to.eq(12)
  // })

  // it('failes the test', () => {
  //   assert(false)
  // })

})