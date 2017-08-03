import React from 'react'
import { shallow } from 'enzyme'
import chaiEnzyme from 'chai-enzyme'
import chai, { expect, assert } from 'chai'
import { translate as t } from 'browser/containers/Translator'
import { ComponentName } from 'browser/components/ComponentName'
chai.should()
chai.use(chaiEnzyme())

describe('<ComponentName />', () => {

  const props = {}
  const wrapper = shallow(<ComponentName {...props} />)

  it('has <div>', () => {
    const el = wrapper.find('div')
    expect(el).to.have.length(1)
    expect(el).to.have.className('ComponentName')
  })

  it('failes the test', () => {
    assert(false)
  })

})