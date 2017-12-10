import React from 'react'
import sinon from 'sinon'
import { shallow } from 'enzyme'
import chaiEnzyme from 'chai-enzyme'
import chai, { expect, assert } from 'chai'
import CircularProgress from 'material-ui/CircularProgress'
import { PageLoading } from 'browser/components/PageLoading'
import { translate as t } from 'browser/containers/Translator'
chai.should()
chai.use(chaiEnzyme())

describe('<PageLoading />', () => {

  it('should return nothing if "loading" is false', () => {
    const props = { loading: false }
    const wrapper = shallow(<PageLoading {...props} />)
    const el = wrapper.find('CircularProgress')
    expect(el.get(0)).to.be.undefined
  })

  it('has <CircularProgress /> if "loading" true', () => {
    const props = { loading: true }
    const wrapper = shallow(<PageLoading {...props} />)
    const el = wrapper.find('CircularProgress')
    expect(el).to.have.length(1)
    expect(el).to.have.className('PageLoading')
  })

})