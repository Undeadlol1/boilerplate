import React from 'react'
import sinon from 'sinon'
import { shallow } from 'enzyme'
import chaiEnzyme from 'chai-enzyme'
import Drawer from 'material-ui/Drawer'
import chai, { expect, assert } from 'chai'
import configureStore from 'redux-mock-store'
import { translate } from 'browser/containers/Translator'
import { Sidebar, dispatchToProps } from 'browser/components/Sidebar'

chai.should()
chai.use(chaiEnzyme())

describe('<Sidebar />', () => {
  const props = {
    toggleSidebar: sinon.spy()
  }
  const wrapper = shallow(<Sidebar {...props} />)

  it('has `.Sidebar` and <header>', () => {
    assert(wrapper.hasClass('Sidebar'))
    expect(wrapper.type()).to.eq(Drawer)
  })

  describe('if user not logged component', () => {
    it('has 1 menu item', () => {
      const menuItems = wrapper.find('MenuItem')
      expect(menuItems).to.have.length(1)
      expect(menuItems.props().children.props.onClick).to.be.a('function')
    })

    it('has "search" link', () => {
      const link = wrapper.find('Link')
      expect(link).to.have.length(1)
      expect(link.props().to).to.eq('search')
      expect(link.props().onClick).to.be.a('function')
      expect(link.props().children).to.eq(translate('search'))
    })
  })

  describe('if user is logged in component', () => {
    const props = {
      UserId: 12345,
      toggleSidebar: sinon.spy(),
    }
    const wrapper = shallow(<Sidebar {...props} />)

    it('has 3 menu items', () => {
      const menuItems = wrapper.find('MenuItem')
      expect(menuItems).to.have.length(3)
    })

    it('has <div>', () => {
      expect(wrapper.find('div')).to.have.length(1)
    })

    it('has <LoginLogoutButton>', () => {
      const button = wrapper.find('Connect(LoginLogoutButton)')
      expect(button).to.have.length(1)
      expect(button.props().inline).to.be.true
    })

    it('has "profile" link', () => {
      const link = wrapper.find('.Sidebar__profile-link');
      expect(link).to.have.length(1)
      expect(link.props().children).to.eq(translate("search"))
      expect(link.props().onClick).to.be.a('function')
    })

  })

  // it('dispatches actions', () => {
  //     const store = configureStore()()
  //     const functions = dispatchToProps(store.dispatch)
  //     const toggleSidebar = sinon.spy(functions.toggleSidebar)
  //     toggleSidebar()
  //     assert(toggleSidebar.calledOnce, 'called toggleSidebar()')
  // })

});