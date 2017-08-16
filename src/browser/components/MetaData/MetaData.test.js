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
  const description = process.env.APP_NAME + ' - музыка твоего настроения'

  it('has <Helmet />', () => {
    const helmet = wrapper.find('HelmetWrapper')
    expect(helmet).to.have.length(1);
  })

  it('has <title>', () => {
    const title = wrapper.find('title')
    expect(title).to.have.length(1)
    expect(title.text()).to.eq(description)
  })

  it('has proper defaultProps', () => {
    const actual = MetaData.defaultProps
    const expected = {
      appUrl: process.env.URL,
      title: description,
      appName: process.env.APP_NAME,
      description: description,
      image: process.env.URL + "android-chrome-192x192.png",
    }
    expect(actual).to.deep.eq(expected)
  })

})