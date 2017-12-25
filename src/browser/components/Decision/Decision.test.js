import React from 'react'
import sinon from 'sinon'
import { shallow } from 'enzyme'
import chaiEnzyme from 'chai-enzyme'
import chai, { expect, assert } from 'chai'
import { Decision } from 'browser/components/Decision'
chai.should()
chai.use(chaiEnzyme())

describe('<Decision />', () => {
  const props = {
    decisionVote: 0,
    vote: sinon.spy(),
    nextVideo: sinon.spy(),
  }
  const wrapper = shallow(<Decision {...props} />)

  it('has <div>', () => {
    const div = wrapper.find('div')
    expect(div)
            .to.have.length(1)
            .and.className('Decision')
  })

  it('has thumbs up icon', () => {
    const icon = wrapper.find('[name="thumbs-up"]')
    expect(icon).to.have.length(1)
                .and.prop('hoverIcon', 'thumbs-o-up')
    icon.simulate('click')
    // icon.update()
    assert(props.vote.calledOnce)
    // expect(icon).to.have.prop('color', 'rgb(0, 151, 167)')
  })

  it('has skip icon', () => {
    const icon = wrapper.find('[name="step-forward"]')
    icon.simulate('click')
    expect(icon).to.have.length(1)
    assert(props.nextVideo.calledOnce)
  })

  it('has thumbs up icon', () => {
    const icon = wrapper.find('[name="thumbs-down"]')
    expect(icon).to.have.length(1)
                .and.prop('hoverIcon', 'thumbs-o-down')
    icon.simulate('click')
    // icon.update()
    assert(props.vote.calledTwice)
    // expect(icon).to.have.prop('color', 'rgb(255, 64, 129)')
  })

})