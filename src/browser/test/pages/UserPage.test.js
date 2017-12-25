import React from 'react'
import sinon from 'sinon'
import faker from 'faker'
import chaiEnzyme from 'chai-enzyme'
import chai, { expect, assert } from 'chai'
import { shallow, mount, render } from 'enzyme'
import { UserPage } from 'browser/pages/UserPage'
import { translate } from 'browser/containers/Translator'
chai.should()
chai.use(chaiEnzyme())

function findAndConfirm(selector) {
  const element = wrapper.find(selector)
  assert(element.length == 1, `must have single <${selector}>`)
  return element
}

const username = 'test'
const props = {
                username,
                loading: false,
                isOwnPage: false,
                params: { username },
                image: faker.image.imageUrl(),
              }
// const wrapper = shallow(<UserPage {...props} />)

describe('<UserPage />', () => {

  // it('has PageWrapper and className', () => {
  //   const el = wrapper.first()
  //   expect(el.name()).to.eq('PageWrapper')
  //   expect(el).to.have.className('UserPage')
  //   expect(el).to.have.props({
  //     title: props.title,
  //     image: props.image,
  //     description: props.description,
  //   })
  // })

  // it('has proper dom structure', () => {
  //   findAndConfirm('PageWrapper')
  //   findAndConfirm('Styled(Grid)')
  //   findAndConfirm('div')
  // })

  // it('has <h2>', () => {
  //   const header = findAndConfirm('h2')
  //   expect(header.text()).to.eq(props.username)
  // })


  // it('has <Avatar />', () => {
  //   const {size, src} = findAndConfirm('Avatar').props()
  //   assert(size == 300, 'props.size')
  //   assert(src == `https://api.adorable.io/avatars/300/${props.username}.png`)
  // })

  // describe('has <ChangeLanguageForm>', () => {
  //   it('is not visible if not own page', () => {
  //     expect(wrapper.find('ReduxForm')).to.have.length(0)
  //   })
  //   it('is visible if own page', () => {
  //     props.isOwnPage = true
  //     const wrapper = shallow(<UserPage {...props} />)
  //     expect(wrapper.find('ReduxForm')).to.have.length(1)
  //   })
  // })

});