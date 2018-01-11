import React from 'react'
import sinon from 'sinon'
import { shallow } from 'enzyme'
import chaiEnzyme from 'chai-enzyme'
import chai, { expect, assert } from 'chai'
import { translate as t } from 'browser/containers/Translator'
import { CreateForumForm } from 'browser/components/CreateForumForm'
chai.should()
chai.use(chaiEnzyme())

describe('<CreateForumForm />', () => {

  const props = {
    handleSubmit: () => {},
    UserId: process.env.ADMIN_ID,    
  }
  const wrapper = shallow(<CreateForumForm {...props} />)

  it('has <Row>', () => {
    const el = wrapper.find('Styled(Row)')
    expect(el).to.exist
    expect(el).to.have.className('CreateForumForm')
  })

  it('has <Col>', () => {
    const el = wrapper.find('Styled(Col)')
    expect(el).to.exist
    expect(el.props().xs).to.eq(12)
  })


  it('must return nothing if UserId is not admin', () => {
    const props = {
      handleSubmit: () => {},
      UserId: "something random",
    }
    const wrapper = shallow(<CreateForumForm {...props} />)
    expect(wrapper).to.be.empty
  })

})