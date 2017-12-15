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

  it('has <Grid>', () => {
    expect(wrapper.find('Styled(Grid)')).to.have.length(1);
  })

  describe('header', () => {
    const header = wrapper.find('.ThreadPage__header')

    it('has <Row> and <Col>', () => {
      expect(header.find('Styled(Row)')).to.exist
      expect(header.find('Styled(Col)')).to.exist
      expect(header.find('Styled(Col)').props().xs).to.eq(12)
    })

    it('has <h1>', () => {
      const el = header.find('h1')
      expect(el).to.exist
      expect(el).to.have.text(props.name)
      expect(el).to.have.className('ThreadPage__title')
    })
  })

  it('has <Comments>', () => {
    expect(wrapper.find('Comments')).to.have.length(1);
})

})