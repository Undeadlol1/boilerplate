import React from 'react'
import sinon from 'sinon'
import { shallow } from 'enzyme'
import chaiEnzyme from 'chai-enzyme'
import chai, { expect, assert } from 'chai'
import { translate as t } from 'browser/containers/Translator'
import { ThreadsList } from 'browser/components/ThreadsList'
chai.should()
chai.use(chaiEnzyme())

describe('<ThreadsList />', () => {

  const props = {}
  // const wrapper = shallow(<ThreadsList {...props} />)

  // it('has <Row>', () => {
  //   const el = wrapper.find('Styled(Row)')
  //   expect(el).to.have.length(1)
  //   expect(el).to.have.className('ThreadsList')
  // })

  // it('has <Col>', () => {
  //   const el = wrapper.find('Styled(Col)')
  //   expect(el).to.have.length(1)
  //   expect(el.props().xs).to.eq(12)
  // })

})