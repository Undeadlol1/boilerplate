import React from 'react'
import sinon from 'sinon'
import generateUuid from 'uuid/v4'
import chaiEnzyme from 'chai-enzyme'
import chai, { expect, assert } from 'chai'
import { shallow, mount, render } from 'enzyme'
import { AboutPage } from 'browser/pages/AboutPage'
import { translate } from 'browser/containers/Translator'
chai.should()
chai.use(chaiEnzyme())

describe('<AboutPage />', () => {
  const props = {}
  const wrapper = shallow(<AboutPage {...props} />)

  it('has className and tagName', () => {
    expect(wrapper).to.have.className('AboutPage')
    expect(wrapper.type().name).to.eq('PageWrapper')
  })

  describe('header', () => {
    const header = wrapper.find('.AboutPage__header')

    it('has <Row> and <Col>', () => {
      expect(header.find('Styled(Row)')).to.exist
      expect(header.find('Styled(Col)')).to.exist
      expect(header.find('Styled(Col)').props().xs).to.eq(12)
    })

    it('has <h1>', () => {
      const el = header.find('h1')
      expect(el).to.exist
      expect(el).to.have.text(translate('about_us'))
      expect(el).to.have.className('AboutPage__title')
    })
  })
})