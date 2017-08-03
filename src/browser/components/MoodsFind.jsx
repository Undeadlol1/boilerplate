import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import React, { Component } from 'react'
import { Field, reduxForm } from 'redux-form'
import { TextField } from 'redux-form-material-ui'
import { Row, Col } from 'react-styled-flexboxgrid'
import { findMoods } from 'browser/redux/actions/MoodActions'
import { translate as t } from 'browser/containers/Translator'
import { checkStatus, parseJSON } from'browser/redux/actions/actionHelpers'


@reduxForm({
	form: 'MoodsFind',
	validate(values) {
		const errors = {}
		if (!values.name) errors.name = 'Name is required!'
		return errors
	},
})
@connect(
	(state, ownProps) => ({...ownProps}),
    (dispatch, ownProps) => ({
        findMoods({name}) {
            dispatch(findMoods(name))
        }
    })
)
export default class MoodsFind extends Component {
	render() {
		const { findMoods, handleSubmit } = this.props
	    return  <form onSubmit={handleSubmit(findMoods)}>
					<Row>
						<Col xs={12}>
							<Field name="name" component={TextField} hintText={t('whats_on_your_mind')} fullWidth />
						</Col>
					</Row>
		        </form>

	}
}
