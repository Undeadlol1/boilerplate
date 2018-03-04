import React from 'react'
import chai, { expect } from 'chai'
import chaiEnzyme from 'chai-enzyme'
import store from 'browser/redux/store'
import { shallow, mount } from 'enzyme'
import { LoginForm } from 'browser/components/LoginForm'

chai.should()
chai.use(chaiEnzyme())

describe('<LoginForm />', () => {
  const props = {
    // dialogIsOpen: true,
    // moodSlug: 'penises',
    // TODO change handleSubmit to fix this shit
    insertMood: () => {},
    handleSubmit: () => {},
    asyncValidating: false,
  }

  const wrapper = shallow(<LoginForm {...props} />);

  it('has `.LoginForm` class and <Tabs>', () => {
    expect(wrapper.type().name).to.eq('Tabs')
    expect(wrapper).to.have.className('LoginForm')
  });

  // it('has <FloatingActionButton />', () => {
  //   const actionButton = wrapper.find('FloatingActionButton')
  //   expect(wrapper).to.have.descendants('FloatingActionButton');
  //   expect(actionButton).to.have.descendants('ContentAdd')
  // });

  // it('has <Dialog />', () => {
  //   const dialog = wrapper.find('Dialog')
  //   expect(wrapper).to.have.descendants('Dialog');
  //   // TODO why is this not working? because of @connect?
  //   // expect(dialog).to.have.descendants('YoutubeSearch');
  // });

});