import React from 'react'
import sinon from 'sinon'
import { shallow } from 'enzyme'
import cookies from 'cookies-js'
import chaiEnzyme from 'chai-enzyme'
import chai, { expect, assert } from 'chai'
import { WelcomeCard } from 'browser/components/WelcomeCard'
import { translate as t } from 'browser/containers/Translator'
chai.should()
chai.use(chaiEnzyme())

describe('<WelcomeCard />', () => {
  // component renders null if cookie is set,
  // expire it to avoid errors
  after(function() {
    cookies.expire('hideWelcomeCard')
  })

  const props = {}
  const wrapper = shallow(<WelcomeCard {...props} />)

  it('has <Row>', () => {
    const el = wrapper.find('Styled(Row)')
    expect(el).to.have.length(1)
    expect(el).to.have.className('WelcomeCard')
  })

  it('has <Col />', () => {
    const el = wrapper.find('Styled(Col)')
    const props = el.props()
    expect(el).to.have.length(1)
    expect(props).to.have.property('xs', 12)
  })

  describe('<Card>', function() {
    const paper = wrapper.find('Paper')
    const card = paper.find('Card')
    it('has proper structure', () => {
      expect(paper).to.have.length(1)
      expect(paper.props()).to.have.property('zDepth', 5)
      expect(card).to.have.length(1)
    })

    it('has <CardText>', () => {
      const cardText = card.find('CardText')
      const paragraphs = cardText.find('p')
      expect(cardText).to.have.length(1)
      expect(paragraphs).to.have.length(2)
      expect(paragraphs.first().text()).to.eq(t('welcome_to_our_awesome_boilerplate'))
      expect(paragraphs.last().text()).to.eq(t('hope_you_will_enjoy_it'))
    })

    it('has <CardActions>', () => {
      const cardActions = card.find('CardActions')
      const button = cardActions.find('FlatButton')
      const props = button.props()
      assert(cardActions.exists())
      assert(button.exists())
      expect(props.onClick).to.be.a('function')
      expect(props).to.have.property('primary', true)
      expect(props).to.have.property('label', t('ok'))
      expect(props).to.have.property('fullWidth', true)
    })

    it('handles click', () => {
      const welcomeCard = shallow(<WelcomeCard />)
      const button = welcomeCard.find('FlatButton')
      button.simulate('click')
      // wrapper.update()
      expect(welcomeCard.node).to.be.a('null')
    })

  })

})