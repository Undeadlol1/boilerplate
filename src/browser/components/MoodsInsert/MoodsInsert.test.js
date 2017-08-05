import React from 'react'
import { shallow } from 'enzyme'
import chaiEnzyme from 'chai-enzyme'
import chai, { expect, assert } from 'chai'
import { translate as t } from 'browser/containers/Translator'
import { MoodsInsert } from 'browser/components/MoodsInsert'
chai.should()
chai.use(chaiEnzyme())

describe('<MoodsInsert />', () => {

  const props = {
    handleSubmit: () => {},
    asyncValidating: false,
    dialogIsOpen: false,
  }
  const wrapper = shallow(<MoodsInsert {...props} />)

  it('has <div>', () => {
    const el = wrapper.find('div')
    expect(el)
      .to.have.length(1)
      .and.className('MoodsInsert')
  })

  it('has <form>', () => {
    const el = wrapper.find('form')
    expect(el)
      .to.have.length(1)
      // .and.prop('onSubmit')
  })

  it('has <FloatingActionButton />', () => {
    const actionButton = wrapper.find('FloatingActionButton')
    expect(wrapper).to.have.descendants('FloatingActionButton');
    expect(actionButton).to.have.descendants('ContentAdd')
  })

  it('has <Dialog />', () => {
    const dialog = wrapper.find('Dialog')
    expect(wrapper).to.have.descendants('Dialog');
    // TODO why is this not working? because of @connect?
    // expect(dialog).to.have.descendants('YoutubeSearch');
  });

  it('has <Row> and <Col>', () => {
    const row = wrapper.find('Styled(Row)')
    const col = wrapper.find('Styled(Col)')
    expect(row).to.have.length(1)
    expect(col)
      .to.have.length(1)
      .and.prop('xs', 12)
  })

  it('has <Field>', () => {
    const el = wrapper.find('Field')
    expect(el).to.have.length(1)
  })

})