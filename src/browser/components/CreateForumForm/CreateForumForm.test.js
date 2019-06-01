import { CreateForumForm } from 'browser/components/CreateForumForm';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { shallow } from 'enzyme';
import React from 'react';
chai.should()
chai.use(chaiEnzyme())

describe('<CreateForumForm />', () => {
  const props = {
    // This "handleSubmit" must return a function on call to
    // pass typechecking of redux-forms.
    handleSubmit: () => () => { },
    createForum: () => { },
    reset: () => { },
    // Currently logged in user data fetched via apollo.
    data: { viewer: { id: Number(process.env.ADMIN_ID) } },
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
    const payload = Object.assign(props, {
      data: {},
      UserId: 23554536,
      handleSubmit: () => { },
    })
    const el = shallow(<CreateForumForm {...payload} />)
    expect(el).to.be.empty
    // had a lot of problems with 'UserId' PropType errors
    expect(props)
      .to.have.property('UserId', props.UserId)
      .a('number')
  })

})