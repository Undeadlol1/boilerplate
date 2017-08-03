import React from 'react'
import { shallow } from 'enzyme'
import chaiEnzyme from 'chai-enzyme'
import chai, { expect, assert } from 'chai'
import Loading from 'browser/components/Loading'
// import CircularProgress from 'material-ui/CircularProgress'
chai.should()
chai.use(chaiEnzyme())

describe('<Loading />', () => {

  const wrapper = shallow(<Loading />);

  it('has <CircularProgress />', () => {
    expect(wrapper.find('CircularProgress')).to.have.length(1);
  });

  // it('has `.Loading` class', () => {
  //   expect(wrapper.find('.Loading')).to.have.length(1);
  // });

  it('renders children conditionaly', () => {
    const loading = condition => (
      shallow(
        <Loading condition={condition}>
          <section></section>
        </Loading>
    ))
    expect(loading(false).find('section')).to.have.length(1)
    expect(loading(true).find('section')).to.has.length(0)
  });

});