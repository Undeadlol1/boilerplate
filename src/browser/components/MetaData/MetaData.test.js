import React from 'react'
import { shallow } from 'enzyme'
import chaiEnzyme from 'chai-enzyme'
import chai, { expect, assert } from 'chai'
import { MetaData } from 'browser/components/MetaData'
chai.should()
chai.use(chaiEnzyme())

describe('<MetaData />', () => {
  const props = {location: {pathname: 'somepath'}}
  const wrapper = shallow(<MetaData {...props} />)

  it('has <Helmet />', () => {
    const helmet = wrapper.find('HelmetWrapper')
    expect(helmet).to.have.length(1);
  })

  it('has <title>', () => {
    const title = wrapper.find('title')
    expect(title).to.have.length(1)
    expect(title.text()).to.eq('MooD - музыка твоего настроения')
  })

  it('has proper defaultProps', () => {
    const actual = MetaData.defaultProps
    const expected = {
      appUrl: process.env.URL,
      title: 'MooD - музыка твоего настроения',
      appName: process.env.APP_NAME,
      description: 'MooD - музыка твоего настроения',
      image: process.env.URL + "android-chrome-192x192.png",
    }
    expect(actual).to.deep.eq(expected)
  })

})