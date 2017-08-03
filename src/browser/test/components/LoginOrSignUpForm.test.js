// TODO
import React from 'react'
import chai, { expect } from 'chai'
import chaiEnzyme from 'chai-enzyme'
// import Dialog from 'material-ui/Dialog'
import store from 'browser/redux/store'
import { shallow, mount } from 'enzyme'
// TODO remove material-ui things
import FlatButton from 'material-ui/FlatButton'
import { Provider as ReduxProvider } from 'react-redux'
import { LoginOrSignUpForm } from 'browser/components/LoginOrSignUpForm'
import { Field } from 'redux-form';
import { translate as t } from 'browser/containers/Translator'

chai.should()
chai.use(chaiEnzyme())

describe('<LoginOrSignUpForm />', () => {
  const props = {
    // dialogIsOpen: true,
    // moodSlug: 'penises',
    // TODO change handleSubmit to fix this shit
    onSubmit: () => {},
    handleSubmit: () => {},
    asyncValidating: false,
  }

  // const wrapper = shallow(<LoginOrSignUpForm {...props} />)

  // function testInput(position, name, type, text) {
  //     const field = wrapper.find('Field').nodes[position]
  //     const props = field.props
  //     expect(field.type).to.eq(Field)
  //     expect(props.name).to.eq(name)
  //     expect(props.type).to.eq(type)
  //     expect(props.hintText).to.eq(text)
  //     expect(props.fullWidth).to.be.true
  // }

  // it('has `.LoginOrSignUpForm` class and <form>', () => {
  //   expect(wrapper).to.have.className('LoginOrSignUpForm')
  //   expect(wrapper.type()).to.eq('form')
  // })

  // it('has <Row> and <Col>', () => {
  //   expect(wrapper.find('Styled(Row)')).to.have.length(1)
  //   expect(wrapper.find('Styled(Col)')).to.have.length(1)
  // })

  // it('has "email" input', () => {
  //   // testInput(0, 'email', 'email', t('email'))
  // })

  // it('has "username" input', () => {
  //   testInput(1, 'username', 'text', t('username'))
  // })

  // it('has "password" input', () => {
  //   testInput(2, 'password', 'password', t('password'))
  // })

  // it('has <RaisedButton', () => {
  //     const button = wrapper.find('RaisedButton')
  //     const props = button.props()
  //     expect(wrapper.find('center')).to.have.length(1)
  //     expect(button).to.have.length(1)
  //     expect(props.label).to.eq(t('submit'))
  //     expect(props.type).to.eq('submit')
  // })

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