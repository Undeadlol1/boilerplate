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
    vote: () => {},
    parentId: generateUuid(),
  }
  const wrapper = shallow(<UpvoteDownvote {...props} />)

  it('has <div> container', () => {
    const el = wrapper.find('.UpvoteDownvote__container')
    expect(el).to.exist
    expect(el).to.have.className('UpvoteDownvote')
  })

  it('has upvote <Icon>', () => {
    const el = wrapper.find('.UpvoteDownvote__upvote')
    expect(el).to.exist
    expect(el).to.be.type('Icon')
    expect(el).to.have.properties({
      name: "thumbs-up",
      title: t(""),
      // color:  // TODO:
    })
  })

})