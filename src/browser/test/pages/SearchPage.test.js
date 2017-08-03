import React from 'react'
import sinon from 'sinon'
import chaiEnzyme from 'chai-enzyme'
import chai, { expect, assert } from 'chai'
import { shallow, mount, render } from 'enzyme'
import { SearchPage } from 'browser/pages/SearchPage'
import { translate } from 'browser/containers/Translator'
chai.should()
chai.use(chaiEnzyme())

describe('<SearchPage />', () => {
  const props = {
                  loading: false,
                  fetchMoods: sinon.spy(),
                  location: {patname: 'qwerty'},
                }
  sinon.spy(SearchPage.prototype, 'componentWillMount');
  const wrapper = shallow(<SearchPage {...props} />)

  it('calls componentWillMount', () => {
    assert(SearchPage.prototype.componentWillMount.calledOnce)
    assert(props.fetchMoods.calledOnce, 'called fetchMoods()')
  });

  it('has className and PageWrapper', () => {
    expect(wrapper).to.have.className('SearchPage')
    expect(wrapper.type().name).to.eq('PageWrapper')
  });

  it('has <MoodsFind>', () => {
    // TODO 'ReduxForm' does not seems right
    expect(wrapper.find('ReduxForm')).to.have.length(1);
  });

  it('has <Loading />', () => {
    expect(wrapper.find('Loading')).to.have.length(1);
  });

  it('has <MoodsList />', () => {
    expect(wrapper.find('Connect(MoodsList)')).to.have.length(1);
  });

});