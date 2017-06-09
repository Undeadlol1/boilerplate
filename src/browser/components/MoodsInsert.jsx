import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { browserHistory } from 'react-router'
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { Row, Col } from 'react-styled-flexboxgrid'
import { insertMood } from '../redux/actions/MoodActions'
import { TextField } from 'redux-form-material-ui'
import { parseJSON } from'../redux/actions/actionHelpers'
import slugify from 'slug'
import store from '../redux/store'
import { FormattedMessage } from 'react-intl';
import { translate } from '../containers/Translator'

@reduxForm({
	form: 'MoodsInsert',
	asyncValidate(values) { // TODO find a way to not use this thing!
		return fetch('/api/moods/mood/' + slugify(values.name))
				.then(parseJSON)
				.then(result => {
					if (result) throw { name: translate('this_mood_already_exists') } 
					else return
				})
    },
	validate(values) {
		let errors = {}
		const user = store.getState().user.get('id')

		if (!user) errors.name = translate('please_login')
		if (!values.name) errors.name = translate('name_cant_be_empty')
		
		return errors
	},
	asyncBlurFields: [ 'name' ]
})
@connect(
	(state, ownProps) => ({...ownProps}),
    (dispatch, ownProps) => ({
        insertMood({name}) {
			function insertSucces(slug) {
				ownProps.reset()				
				browserHistory.push('/mood/' + slug);
			}
            dispatch(insertMood(name, insertSucces))
        }
    })
)
export default class MoodsInsert extends Component {
	render() {
		const { insertMood, handleSubmit, asyncValidating } = this.props
	    return  <form onSubmit={handleSubmit(insertMood)}>
					<Row>
						<Col xs={12}>
							<Field name="name" component={TextField} hidden={asyncValidating} hintText={<FormattedMessage id="add_your_own_mood" />} fullWidth />
						</Col>
					</Row>
		        </form>

	}
}
