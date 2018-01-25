import React from 'react'
import sinon from 'sinon'
import { shallow } from 'enzyme'
import chaiEnzyme from 'chai-enzyme'
import chai, { expect, assert } from 'chai'
import { translate as t } from 'browser/containers/Translator'
import CreateThreadFormOrButton from 'browser/components/CreateThreadFormOrButton'
chai.should()
chai.use(chaiEnzyme())

// FIXME: add comments

describe('<CreateThreadFormOrButton />', () => {

  const props = {
    className: 'test1',
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
        expect(el).to.have.prop('label', t('create_thread'))
        expect(el).to.have.className('CreateThreadFormOrButton__button')
      })

      it('default state', () => {
        expect(wrapper).to.have.state('showButton', true)
      })

      it('default props', () => {
        const defaultProps = wrapper.instance().props
        expect(defaultProps.label).to.eq(t('create_thread'))
      })
  })

  describe('after click on button', () => {
    it('returns <CreateThreadForm />', () => {
      const button = wrapper.find('RaisedButton')
      expect(button).to.exist
      button.simulate('click')
      const form = wrapper.find('ReduxForm')
      expect(form).to.exist
      // make sure props inheritance works
      expect(form).to.have.className(props.className)
    })
  })

})