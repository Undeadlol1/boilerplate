import React from 'react'
import sinon from 'sinon'
import chaiEnzyme from 'chai-enzyme'
import chai, { expect, assert } from 'chai'
import { shallow, mount, render } from 'enzyme'
import { IndexPage } from 'browser/pages/IndexPage'
import { translate } from 'browser/containers/Translator'
chai.should()
chai.use(chaiEnzyme())

describe('<IndexPage />', () => {
  const props = {
                  loading: false,
                  location: {pathname: 'some'},
                }
  const wrapper = shallow(<IndexPage {...props} />)

  it('has className and tagName', () => {
    expect(wrapper).to.have.className('IndexPage')
    expect(wrapper.type().name).to.eq('PageWrapper')
  });

  it('has <Grid>', () => {
    expect(wrapper.find('Styled(Grid)')).to.have.length(1);
  });

  it('has <WelcomeCard>', () => {
    expect(wrapper.find('WelcomeCard')).to.have.length(1);
  });

  it('has <MoodsInsert>', () => {
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