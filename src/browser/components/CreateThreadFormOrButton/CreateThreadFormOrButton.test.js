import React from 'react'
import sinon from 'sinon'
import { shallow } from 'enzyme'
import chaiEnzyme from 'chai-enzyme'
import chai, { expect, assert } from 'chai'
import { translate as t } from 'browser/containers/Translator'
import CreateThreadFormOrButton from 'browser/components/CreateThreadFormOrButton'
chai.should()
chai.use(chaiEnzyme())

// code is self explanatory.
// read "desribe" and "it" labels
// also read comments in

describe('<CreateThreadFormOrButton />', () => {

  const props = {
    className: 'test1',
    label: 'test label',
  }
  const wrapper = shallow(<CreateThreadFormOrButton {...props} />)

  describe('returns button by default by having', () => {
      it('<Row>', () => {
        const el = wrapper.find('Styled(Row)')
        expect(el).to.exist
        expect(el).to.have.className('CreateThreadFormOrButton', props.className)
      })

      it('<Col>', () => {
        const el = wrapper.find('Styled(Col)')
        expect(el).to.exist
        expect(el).to.have.prop('xs', 12)
      })

      it('<RaisedButton />', () => {
        const el = wrapper.find('RaisedButton')
        expect(el).to.exist
        expect(el.props().onClick).to.be.a('function')
        expect(el).to.have.prop('label', props.label)
        expect(el).to.have.className('CreateThreadFormOrButton__button')
      })

      it('default state', () => {
        expect(wrapper).to.have.state('showButton', true)
      })

      it('default props', () => {
        expect(CreateThreadFormOrButton.defaultProps)
        .to
        .deep
        .eq({label: t('create_thread')})
      })
  })

  describe('after click on button', () => {
    it('returns <CreateThreadForm />', () => {
      // click button
      wrapper
      .find('RaisedButton')
      .simulate('click')
      // find animation and form components
      const form = wrapper.find('ReduxForm')
      const animation = wrapper.find('Fade')
      expect(form).to.exist
      expect(animation).to.exist
      // make sure props inheritance works
      expect(form).to.have.className(props.className)
    })
  })

})