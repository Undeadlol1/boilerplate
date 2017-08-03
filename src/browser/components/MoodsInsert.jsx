import React, { Component } from 'react'
import PropTypes from 'prop-types';
import browserHistory from 'react-router/lib/browserHistory'
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { Row, Col } from 'react-styled-flexboxgrid'
import { insertMood } from '../redux/actions/MoodActions'
import { TextField } from 'redux-form-material-ui'
import { parseJSON } from'../redux/actions/actionHelpers'
import store from 'browser/redux/store'
import { translate } from 'browser/containers/Translator'
import { stringify } from 'query-string'

export class MoodsInsert extends Component {
	render() {
		const { insertMood, handleSubmit, asyncValidating } = this.props
	    return  <form onSubmit={handleSubmit(insertMood)}>
					<Row>
						<Col xs={12}>
							<Field name="name" component={TextField} hidden={asyncValidating} hintText={translate("add_your_own_mood")} fullWidth />
						</Col>
					</Row>
		        </form>

	}
}
// TODO reorganize this for better testing
export default reduxForm({
	form: 'MoodsInsert',
	asyncValidate({name}) {
		return fetch('/api/moods/mood/' + '?' + stringify({name}))
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
(connect(
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
)(MoodsInsert))