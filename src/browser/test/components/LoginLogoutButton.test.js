import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';
import LoginLogoutButtton from '../../components/LoginLogoutButton';

// describe('<LoginLogoutButtton />', () => {
//   it('has <RaisedButton />', () => {
//     const wrapper = mount(<LoginLogoutButtton />);
//     expect(wrapper.find(RaisedButton)).to.have.length(1);
//   });

//   it('has `.LoginLogoutButtton` class', () => {
//     const wrapper = mount(<LoginLogoutButtton />);
//     expect(wrapper.find('.LoginLogoutButtton')).to.have.length(1);
//   });

//   it('ADD INLINE TEST HERE', () => {
//     // const wrapper = shallow(<LoginLogoutButtton />);
//     // expect(wrapper.find('.LoginLogoutButtton')).to.have.length(1);
//   });
// });