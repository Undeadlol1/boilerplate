import React from 'react'
import sinon from 'sinon'
import faker from 'faker'
import chaiEnzyme from 'chai-enzyme'
import chai, { expect, assert } from 'chai'
import { shallow, mount, render } from 'enzyme'
import { ThreadPage } from 'browser/pages/ThreadPage'
import { translate } from 'browser/containers/Translator'
chai.should()
chai.use(chaiEnzyme())

describe('<ThreadPage />', () => {
  const props = {
                  loading: false,
                  location: {pathname: 'some'},
                  name: 'someName',
                  text: 'some text',
                  username: 'userName',
                  userImage: faker.image.imageUrl()
                }
  const wrapper = shallow(<ThreadPage {...props} />)

  it('has className and tagName', () => {
    expect(wrapper).to.have.className('ThreadPage')
    expect(wrapper.type().name).to.eq('PageWrapper')
  })

  describe('header', () => {
    const header = wrapper.find('.ThreadPage__header')

    it('has <Row> and <Col>', () => {
      expect(header.find('Styled(Row)')).to.exist
      expect(header.find('Styled(Col)')).to.exist
      expect(header.find('Styled(Col)').props().xs).to.eq(12)
    })

    it('has title', () => {
      const el = header.find('h1')
      expect(el).to.exist
      expect(el).to.have.text(props.name)
      expect(el).to.have.className('ThreadPage__title')
    })

    it('has text', () => {
      const el = header.find('p')
      expect(el).to.exist
      expect(el).to.have.text(props.text)
      expect(el).to.have.className('ThreadPage__text')
    })

    it('has <Chip> and <Avatar>', () => {
      const chip = header.find('Chip')
      const avatar = chip.find('Avatar')
      expect(chip).to.exist
      expect(chip.props().children[1]).to.eq(props.username)
      expect(avatar).to.exist
      expect(avatar.props().src).to.eq(props.userImage)
    })
  })

  it('has <CommentsList>', () => {
    expect(wrapper.find('Connect(CommentsList)')).to.exist
  })

})