import React from 'react'
import sinon from 'sinon'
import chaiEnzyme from 'chai-enzyme'
import chai, { expect, assert } from 'chai'
import { shallow, mount, render } from 'enzyme'
import { ForumsPage } from 'browser/pages/ForumsPage'
import { translate } from 'browser/containers/Translator'
chai.should()
chai.use(chaiEnzyme())

describe('<ForumsPage />', () => {
  const props = {
                  loading: false,
                  location: {pathname: 'some'},
                }
  const wrapper = shallow(<ForumsPage {...props} />)

  it('has className and tagName', () => {
    expect(wrapper).to.have.className('ForumsPage')
    expect(wrapper.type().name).to.eq('PageWrapper')
  })

  it('has <Grid>', () => {
    expect(wrapper.find('Styled(Grid)')).to.have.length(1);
  })

  it('has <ForumsList>', () => {
    expect(wrapper.find('Connect(ForumsList)')).to.have.length(1);
  })

  it('has <CreateForumForm>', () => {
    expect(wrapper.find('ReduxForm')).to.have.length(1);
  })

})