import React from 'react'
import sinon from 'sinon'
import { shallow } from 'enzyme'
import chaiEnzyme from 'chai-enzyme'
import chai, { expect, assert } from 'chai'
import { translate as t } from 'browser/containers/Translator'
import { YoutubeSearch } from 'browser/components/YoutubeSearch'
chai.should()
chai.use(chaiEnzyme())
chai.use(require('chai-properties'))

describe('<YoutubeSearch />', () => {
  const props = {
    youtubeSearch: () => {},
  }
  const wrapper = shallow(<YoutubeSearch {...props} />)

  it('has <div>', () => {
    const el = wrapper.find('div')
    expect(el).to.have.length(1)
    expect(el).to.have.className('YoutubeSearch')
  })

  it('has <Row>, <Col>', () => {
    const row = wrapper.find('Styled(Row)')
    const col = wrapper.find('Styled(Col)')
    expect(row).to.have.length(1)
    expect(col).to.have.length(1)
  })

  it('has <form>', () => {
    const form = wrapper.find('form')
    expect(form).to.have.length(1)
    expect(form.props().onSubmit).to.be.a('function')
  })

  it('has <YoutubeVideos>', () => {
    const el = wrapper.find('Connect(YoutubeVideos)')
    expect(el).to.have.length(1)
  })

  describe('<TextField>', function() {

    it('has props <TextField> and <button> structure', () => {
      const textField = wrapper.find('TextField')
      const button = wrapper.find('button')
      const fieldProps = textField.props()
      // button
      expect(button).to.have.length(1)
      expect(button.props()).to.have.properties({
        hidden: true,
        type: 'submit',
      })
      // text field
      expect(textField).to.have.length(1)
      expect(fieldProps).to.have.properties({
        value: "",
        errorText: "",
        autoFocus: true,
        fullWidth: true,
        hintText: t('search_for_video'),
      })
      expect(fieldProps.onChange).to.be.a('function')
    })

    it('show "please login" error on submit', () => {
      wrapper.find('form').simulate('submit')
      const updatedField = wrapper.find('TextField')
      expect(updatedField.props().errorText).to.eq(t('please_login'))
    })

    it('calls youtubeSearch() on submit', () => {
      const props = {
        UserId: 'penises123',
        youtubeSearch: sinon.spy(),
      }
      const wrapper = shallow(<YoutubeSearch {...props} />)
      wrapper.find('form').simulate('submit')
      assert(props.youtubeSearch.calledOnce, 'called youtubeSearch')
    })
  })

})