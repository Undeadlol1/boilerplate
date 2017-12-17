import cls from 'classnames'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import store from 'browser/redux/store'
import Dialog from 'material-ui/Dialog'
import { stringify } from 'query-string'
import React, { Component } from 'react'
import FlatButton from 'material-ui/FlatButton'
import { TextField } from 'redux-form-material-ui'
import { Form, Field, reduxForm } from 'redux-form'
import RaisedButton from 'material-ui/RaisedButton'
import { translate } from 'browser/containers/Translator'
import { Grid, Row, Col } from 'react-styled-flexboxgrid'
import ContentAdd from 'material-ui/svg-icons/content/add'
import browserHistory from 'react-router/lib/browserHistory'
import { actions } from 'browser/redux/actions/GlobalActions'
import { parseJSON } from'browser/redux/actions/actionHelpers'
import { insertThread } from 'browser/redux/forum/ForumActions'
import FloatingActionButton from 'material-ui/FloatingActionButton'

export class CreateThreadForm extends Component {
	render() {
		const { props } = this
		const { valid, insertThread, handleSubmit, dialogIsOpen, isValid, asyncValidating, className } = props
		const classNames = cls(className, "CreateThreadForm")
		const isDisabled = props.asyncValidating == 'name' || props.submitting
	    return 	<Row>
					<Col xs={12}>
						<form onSubmit={handleSubmit(insertThread)}>
							<Field
								fullWidth
								autoFocus
								name="name"
								component={TextField}
								hidden={asyncValidating}
								hintText={translate("add_something")}
							/>
							<Field
								rows={2}
								fullWidth
								name="text"
								multiLine={true}
								component={TextField}
								hidden={asyncValidating}
								hintText={translate("description")}
							/>
							<center>
								<RaisedButton
									type="submit"
									primary={true}
									label={translate('submit')}
									disabled={!valid} />
							</center>
						</form>
					</Col>
				</Row>

	}
}

CreateThreadForm.propTypes = {
	parentId: PropTypes.string.isRequired,
}

// TODO reorganize this for better testing
export default reduxForm({
	form: 'CreateThreadForm',
	validate(values) {
		let errors = {}
		const user = store.getState().user.get('id')

		if (!user) errors.name = translate('please_login')
		if (!values.name) errors.name = translate('name_cant_be_empty')
		if (!values.text) errors.text = translate('cant_be_empty')

		return errors
	},
	// onSubmit(values, dispatch, props) {
	// 		function insertSucces(slug) {
	// 			ownProps.reset()
	// 			browserHistory.push('/mood/' + slug);
	// 		}
    //         // dispatch(insertThread(values, insertSucces))
	// }
})
(connect(
	(state, ownProps) => ({
		...ownProps,
		dialogIsOpen: state.mood.get('dialogIsOpen'),
	}),
    (dispatch, ownProps) => ({
        insertThread(values) {
			console.log('insertThread')
			values.parentId = ownProps.parentId
			
			function insertSucces(slug) {
				ownProps.reset()
				browserHistory.push('/threads/' + slug);
			}
            // dispatch(toggleDialog())
            dispatch(insertThread(values, insertSucces))
		}
    })
)(CreateThreadForm))