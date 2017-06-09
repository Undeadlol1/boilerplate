import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import CircularProgress from 'material-ui/CircularProgress';
import Loading from '../../components/Loading';

describe('<Loading />', () => {
  it('has <CircularProgress />', () => {
    const wrapper = shallow(<Loading />);
    expect(wrapper.find(CircularProgress)).to.have.length(1);
  });

  it('has `.Loading` class', () => {
    const wrapper = shallow(<Loading />);
    expect(wrapper.find('.Loading')).to.have.length(1);
  });
});