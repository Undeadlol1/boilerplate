import React from 'react'
import sinon from 'sinon'
import { shallow } from 'enzyme'
import chaiEnzyme from 'chai-enzyme'
import Icon from 'browser/components/Icon'
import chai, { expect, assert } from 'chai'
import configureStore from 'redux-mock-store'
import { translate } from 'browser/containers/Translator'
import { LoginDialog, dispatchToProps } from 'browser/components/LoginDialog'

chai.should()
chai.use(chaiEnzyme())

describe('<LoginDialog />', () => {
  const toggleDialog = sinon.spy()
  const props = { toggleDialog }
  const wrapper = shallow(<LoginDialog {...props} />)
  const dialog = wrapper.find('Dialog')
  const row = wrapper.find('Styled(Row)')
  const buttons = wrapper.find('RaisedButton')

  it('has `.LoginDialog`', () => {
    assert(wrapper.hasClass('LoginDialog'))
  })

  it('has <Dialog>', () => {
      const props = dialog.props()
      expect(dialog).to.have.length(1)
      expect(props.open).to.be.not.true
      expect(props.className).to.eq('LoginDialog')
      expect(props.title).to.eq(translate('please_login'))
      expect(typeof props.onRequestClose).to.eq('function')
      expect(props.titleStyle).to.deep.eq({textAlign: 'center'})
      expect(props.children).to.be.not.empty
  })

// temporary disabled
//   it('has <LoginForm>', () => {
//       expect(wrapper.find('LoginForm')).to.have.length(1)
//   })

//   it('has <Divider>', () => {
//       expect(wrapper.find('Divider')).to.have.length(1)
//   })

  it('has <Row>', () => {
      const props = row.props()
      expect(row).to.have.length(1)
      expect(props.className).to.eq('LoginDialog__icons')
      expect(props.children).to.have.length(2)
      expect(row.find('RaisedButton')).to.have.length(2)
  })

  it('has vk <Icon>', () => {
      const props = buttons.nodes[0].props
      const icon = props.icon
      expect(props.label).to.eq('vk.com')
      expect(props.href).to.eq('/api/auth/vkontakte')
      expect(props.className).to.eq('LoginDialog__icon')
      expect(props.icon.props.name).to.eq('vk')
  })

  it('has twitter <Icon>', () => {
      const props = buttons.nodes[1].props
      expect(props.label).to.eq('twitter.com')
      expect(props.href).to.eq('/api/auth/twitter')
      expect(props.className).to.eq('LoginDialog__icon')
      expect(props.icon.props.name).to.eq('twitter')
  })

    // TODO test actions (modal opens and closes)

//   it('dispatches actions', () => {
//       const store = configureStore()()
//       const functions = dispatchToProps(store.dispatch)
//       console.log('functions: ', functions);

//       const toggleDialog = sinon.spy(functions.toggleDialog)
//       toggleDialog()
//       assert(toggleDialog.calledOnce, 'called toggleDialog()')
//   })

});