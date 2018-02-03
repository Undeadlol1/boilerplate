import React from 'react'
import sinon from 'sinon'
import { shallow } from 'enzyme'
import chaiEnzyme from 'chai-enzyme'
import chai, { expect, assert } from 'chai'
import { translate as t } from 'browser/containers/Translator'
import { Wysiwyg } from 'browser/components/Wysiwyg'
chai.should()
chai.use(chaiEnzyme())

describe('<Wysiwyg />', () => {

  const props = {}
  // const wrapper = shallow(<Wysiwyg {...props} />)

  // it('has <Row>', () => {
  //   const el = wrapper.find('Styled(Row)')
  //   expect(el).to.exist
  //   expect(el).to.have.className('Wysiwyg')
  // })

  // it('has <Col>', () => {
  //   const el = wrapper.find('Styled(Col)')
  //   expect(el).to.exist
  //   expect(el).to.have.prop('xs', 12)
  // })

  // it('failes the test', () => {
  //   assert(false)
  // })

})