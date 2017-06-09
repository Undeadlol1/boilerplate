import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import NotFound from '../../pages/NotFound';
import { translate } from '../../containers/Translator'

describe('<NotFound />', () => {
  const wrapper = shallow(<NotFound />);  
  it('has `.NotFound` class', () => {
    expect(wrapper.find('.NotFound')).to.have.length(1);
  });

  it('has <h1>', () => {
    expect(wrapper.find('h1')).to.have.length(1);
  });

  it('has text in header', () => {
    const text = wrapper.find('.NotFound').text()
    expect(text).to.be.equal(translate('page_not_found') + '!');
  });
});