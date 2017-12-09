import React from 'react'
import sinon from 'sinon'
import { shallow } from 'enzyme'
import chaiEnzyme from 'chai-enzyme'
import chai, { expect, assert } from 'chai'
import { translate as t } from 'browser/containers/Translator'
import { CreateThreadForm } from 'browser/components/CreateThreadForm'
chai.should()
chai.use(chaiEnzyme())

describe('<CreateThreadForm />', () => {

  const props = {}
  // const wrapper = shallow(<CreateThreadForm {...props} />)

  // it('has <Row>', () => {
  //   const el = wrapper.find('Styled(Row)')
  //   expect(el).to.have.length(1)
  //   expect(el).to.have.className('CreateThreadForm')
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