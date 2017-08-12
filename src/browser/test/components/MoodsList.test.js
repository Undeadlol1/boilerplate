import React from 'react'
import chai, { expect } from 'chai'
import chaiEnzyme from 'chai-enzyme'
// import Dialog from 'material-ui/Dialog'
import { shallow, mount } from 'enzyme'
// TODO remove material-ui things
import FlatButton from 'material-ui/FlatButton'
import { Provider as ReduxProvider } from 'react-redux'
import { MoodsList } from 'browser/components/MoodsList'
import FloatingActionButton from 'material-ui/FloatingActionButton'

chai.should()
chai.use(chaiEnzyme())

describe('<MoodsList />', () => {

  const wrapper = shallow(<MoodsList />)

  it('has className and tagName', () => {
    expect(wrapper).to.have.tagName('section')
    expect(wrapper).to.have.className('MoodsList')
  });

  it('has 2 rows', () => {
    expect(wrapper.find('Styled(Row)')).to.have.length(2)
  });

  it('has pagination wrapper', () => {
    const div = wrapper
                  .find('Styled(Row)')
                  .last()
                  .find('div')
    expect(div).to.have.className('MoodsList__pagination-wrapper')
  });

  it('displays pagination if needed', () => {
    const withPages = shallow(<MoodsList />).find('.MoodsList__pagination')
    const withoutPages = shallow(<MoodsList totalPages={2} />).find('.MoodsList__pagination')
    expect(withPages.exists()).to.be.false
    expect(withoutPages.exists()).to.be.true
  });

  it('displays <Loading /> if needed', () => {
    const element = shallow(<MoodsList loading={true} />)
    expect(element).to.have.length(1)
  })

  // TODO write this two tests
  // TODO refactor MoodsList
  // (move Pagination into component and create MoodsListItem)
  // it('displays list', () => {
  // });

  // it('displays message on empty list', () => {
  // });

});