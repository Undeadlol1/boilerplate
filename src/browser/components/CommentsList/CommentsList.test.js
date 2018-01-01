import React from 'react'
import sinon from 'sinon'
import { shallow } from 'enzyme'
import chaiEnzyme from 'chai-enzyme'
import chai, { expect, assert } from 'chai'
import { translate as t } from 'browser/containers/Translator'
import { CommentsList } from 'browser/components/CommentsList'
chai.should()
chai.use(chaiEnzyme())

describe('<CommentsList />', () => {

  const props = {}
  const wrapper = shallow(<CommentsList {...props} />)

  it('has <Row>', () => {
    const el = wrapper.find('Styled(Row)')
    expect(el).to.exist
    expect(el).to.have.className('CommentsList')
  })

  it('has <Col>', () => {
    const el = wrapper.find('Styled(Col)')
    expect(el).to.exist
    expect(el).to.have.prop('xs', 12)
  })

  it('has <VK>', () => {
    const el = wrapper.find('VK')
    const appId = Number(process.env.VK_ID)
    expect(el).exist
    expect(el).have.prop('apiId', appId)
  })

  it('has <Paper>', () => {
    const el = wrapper.find('Paper')
    expect(el).to.exist
    expect(el).to.have.prop('zDepth', 3)
  })

  it('has <Comments>', () => {
    const el = wrapper.find('Comments')
    expect(el).exist
  })

})