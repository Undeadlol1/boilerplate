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

  describe('always', () => {
    it('has 2 menu items', () => {
      const links = wrapper.find('Link')
      expect(wrapper.find('Link')).to.have.length(2)
      links.nodes.forEach(link => {
        expect(link.props.onClick).to.be.a('function')
      })
    })

    it('has "search" link', () => {
      const link = wrapper.find('.Sidebar__search-link')
      expect(link).to.have.length(1)
      expect(link.props().to).to.eq('search')
      assert(link.hasClass('Sidebar__search-link'))
      expect(link.props().onClick).to.be.a('function')
      expect(link.props().children.props.children).to.eq(translate('search'))
    })

    it('has "forum" link', () => {
      const link = wrapper.find('.Sidebar__forum-link');
      expect(link).to.have.length(1)
      expect(link.props().onClick).to.be.a('function')
      expect(link.props().children.props.children).to.eq(translate("forum"))
    })

    // it('has "about" link', () => {
    //   const link = wrapper.find('.Sidebar__about-link')
    //   const menuItem = link.find('MenuItem')
    //   expect(link).to.exist
    //   expect(menuItem).to.exist
    //   expect(link).to.have.prop('to', 'about')
    //   expect(link.props().onClick).to.be.a('function')
    //   expect(menuItem).to.have.prop('children', translate('about'))
    // })
  })

  describe('if user is logged in component', () => {
    const props = {
      UserId: 12345,
      toggleSidebar: sinon.spy(),
    }
    const wrapper = shallow(<Sidebar {...props} />)

    it('has 4 menu items', () => {
      const menuItems = wrapper.find('MenuItem')
      expect(menuItems).to.have.length(4)
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
      expect(link.props().onClick).to.be.a('function')
      expect(link.props().children.props.children).to.eq(translate("profile"))
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