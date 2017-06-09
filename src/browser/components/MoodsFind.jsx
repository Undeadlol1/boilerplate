import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { browserHistory } from 'react-router'
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { Row, Col } from 'react-styled-flexboxgrid'
import { findMoods } from '../redux/actions/MoodActions'
import { TextField } from 'redux-form-material-ui'
import { checkStatus, parseJSON } from'../redux/actions/actionHelpers'
import slugify from 'slug'

@reduxForm({
	form: 'MoodsFind',
	// asyncBlurFields: [ 'name' ],
	// asyncValidate(values) { // TODO find a way to not use this thing!
	// 	return fetch('/api/moods/mood/' + slugify(values.name))
	// 			.then(parseJSON)
	// 			.then(result => {
	// 				if (result) throw { name: 'This mood already exist!' } 
	// 				else return
	// 			})
    // },
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
			console.log('name', name)
			// function insertSucces(slug) {
			// 	ownProps.reset()				
			// 	browserHistory.push('/mood/' + slug);
			// }
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
							<Field name="name" component={TextField} hintText="What's on your mind?" fullWidth />
						</Col>
					</Row>
		        </form>

	}
}
