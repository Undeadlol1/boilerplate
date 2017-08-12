import React from 'react'
import sinon from 'sinon'
import { shallow } from 'enzyme'
import chaiEnzyme from 'chai-enzyme'
import { Map, List } from 'immutable'
import chai, { expect, assert } from 'chai'
import { MoodTabs } from 'browser/components/MoodTabs'
import { translate as t } from 'browser/containers/Translator'
chai.should()
chai.use(chaiEnzyme())

describe('<MoodTabs />', () => {
  const moods = Map({
    moods: List(),
    totalPages: 0,
    currentPage: 0,
  })
  const props = {
    new: moods,
    random: moods,
    popular: moods,
  }
  const wrapper = shallow(<MoodTabs {...props} />)

  it('has <Tabs>', () => {
    expect(wrapper.find('Tabs'))
      .to.have.length(1)
      .and.className('MoodTabs')
  })

  function testTab(label) {
    const tab = wrapper.find(`[label="${t(label)}"]`)
    expect(tab).to.have.length(1)
    expect(tab.find('Connect(MoodsList)')).to.have.length(1)
  }

  it('has 3 <Tab> elements', () => {
    ['popular', 'new', 'random']
      .forEach(tab => testTab(tab))
  })

})