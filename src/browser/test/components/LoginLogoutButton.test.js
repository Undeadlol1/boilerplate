import React from 'react'
import sinon from 'sinon'
import { shallow } from 'enzyme'
import chaiEnzyme from 'chai-enzyme'
import store from 'browser/redux/store'
import chai, { expect, assert } from 'chai'
import configureStore from 'redux-mock-store'
import { translate } from 'browser/containers/Translator'
import connectedButton, { LoginLogoutButton, dispatchToProps } from 'browser/components/LoginLogoutButton'
chai.should()
chai.use(chaiEnzyme())

describe('<LoginLogoutButton />', () => {

    function createWrapper(modifiers) {
        const props =   {
                            logout: () => {},
                            toggleDialog: () => {},
                        }
        const newProps = {...props, ...modifiers}
        return shallow(<LoginLogoutButton {...newProps} />)
    }

    describe('default behaviour', () => {
        const onClick = sinon.spy()
        const wrapper = createWrapper({onClick})
        it('has <RaisedButton />', () => {
            const props = wrapper.props()
            assert(wrapper.type(), 'is <RaisedButton />')
            assert(props.label == translate('login'), 'has label')
            assert(typeof props.onClick == 'function', 'has onClick')
            assert(wrapper.hasClass('LoginLogoutButton'), 'has className')
        });

        it('simulates click', () => {
            wrapper.simulate('click')
            assert(onClick.calledOnce, 'calls toggleDialog()')
        });
    })

    describe('inline behaviour', () => {
        const onClick = sinon.spy()
        const wrapper = createWrapper({inline: true, onClick})
        const props = wrapper.props()
        it('has <span>', () => {
            assert(wrapper.type(), 'is <span>')
            assert(typeof props.style == 'object', 'has style')
            assert(wrapper.text() == translate('login'), 'has text')
            assert(typeof props.onClick == 'function', 'has onClick')
            assert(wrapper.hasClass('LoginLogoutButton'), 'has className')
        });

        it('simulates click', () => {
            wrapper.simulate('click')
            assert(onClick.calledOnce, 'calls toggleDialog()')
        });
    })

    describe('user logged in behaviour', () => {
        const wrapper = createWrapper({userId: 123})
        it('has proper text', () => {
            assert(wrapper.props().label == translate('logout'), 'has text')
        });
    })

    it('dispatches actions', () => {
        const functions = dispatchToProps(store.dispatch)
        const logout = sinon.spy(functions.logout)
        const toggleDialog = sinon.spy(functions.toggleDialog)
        // logout() // TODO commented out currently due to url errors
        toggleDialog()
        // assert(logout.calledOnce, 'called logout()')
        assert(toggleDialog.calledOnce, 'called toggleDialog()')
    })

});