import React from 'react'
import { shallow } from 'enzyme'
import chaiEnzyme from 'chai-enzyme'
import chai, { expect, assert } from 'chai'
import ShareButton from 'browser/components/ShareButton'
chai.should()
chai.use(chaiEnzyme())

describe('<ShareButton />', () => {
  const props = {}
  const wrapper = shallow(<ShareButton {...props} />)
  const button = wrapper.find('FloatingActionButton')
  const iconMenu = button.find('IconMenu')
  const iconButton = iconMenu.find('IconButton')

  // it('has <FloatingActionButton />', () => {
  //   expect(button).to.have.length(1)
  //   expect(button).to.have.className('ShareButton')
  // })

  // it('has <IconMenu />', () => {
  //   expect(iconMenu).to.have.length(1)
  //   // expect(iconMenu.find('SocialShare')).to.have.length(1)
  // })

  // it('has <iconButton />', () => {
  //   expect(iconMenu).to.have.length(1)
  //   // expect(iconMenu.find('SocialShare')).to.have.length(1)
  // })
  // it('has <title>', () => {
  //   const title = wrapper.find('title')
  //   expect(title).to.have.length(1)
  //   expect(title.text()).to.eq(process.env.APP_NAME)
  // })

  // it('has proper defaultProps', () => {
  //   const actual = ShareButton.defaultProps
  //   const expected = {
  //     appUrl: process.env.URL,
  //     title: process.env.APP_NAME,
  //   }
  //   expect(actual).to.deep.eq(expected)
  // })

})