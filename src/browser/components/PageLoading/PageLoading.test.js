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

  it('has container and  <CircularProgress /> if "loading" true', () => {
    const props = { loading: true }
    const wrapper = shallow(<PageLoading {...props} />)
    expect(wrapper).to.exist
    expect(wrapper).to.have.className('PageLoading')
    const container = wrapper.find('.PageLoading__indicator-container')
    expect(container).to.exist
    const indicator = container.find('CircularProgress')
    expect(indicator).to.exist
    expect(indicator).to.have.className('PageLoading__indicator')
  })

})