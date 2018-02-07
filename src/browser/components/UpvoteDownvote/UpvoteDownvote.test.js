import React from 'react'
import sinon from 'sinon'
import { shallow } from 'enzyme'
import generateUuid from 'uuid/v4'
import chaiEnzyme from 'chai-enzyme'
import chai, { expect, assert } from 'chai'
import { translate as t } from 'browser/containers/Translator'
import { UpvoteDownvote } from 'browser/components/UpvoteDownvote'
chai.should()
chai.use(chaiEnzyme())

describe('<UpvoteDownvote />', () => {

  const props = {
    UserId: 1234,
    vote: () => {},
    parentId: generateUuid(),
  }
  const wrapper = shallow(<UpvoteDownvote {...props} />)

  it('has <div> container', () => {
    const el = wrapper.find('.UpvoteDownvote')
    expect(el).to.exist
    expect(el).to.be.type('div')
  })

  it('has upvote <Icon>', () => {
    const el = wrapper.find('.UpvoteDownvote__upvote')
    expect(el).to.exist
    expect(el.type().name).to.eq('Icon')
    expect(el).to.have.props({
      name: "thumbs-up",
      title: t("i_like_it"),
      hoverIcon: 'thumbs-o-up',
    })
  })

  it('has downvote <Icon>', () => {
    const el = wrapper.find('.UpvoteDownvote__downvote')
    expect(el).to.exist
    expect(el.type().name).to.eq('Icon')
    expect(el).to.have.props({
      name: "thumbs-down",
      hoverIcon: 'thumbs-o-down',
      title: t("dont_like_it_dont_show_again"),
    })
  })

})