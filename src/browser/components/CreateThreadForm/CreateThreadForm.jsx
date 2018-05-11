import cls from 'classnames'
import PropTypes from 'prop-types'
import extend from 'lodash/assignIn'
import Paper from 'material-ui/Paper'
import { connect } from 'react-redux'
import store from 'browser/redux/store'
import React, { Component } from 'react'
import { Field, reduxForm } from 'redux-form'
import { TextField } from 'redux-form-material-ui'
import RaisedButton from 'material-ui/RaisedButton'
import { Row, Col } from 'react-styled-flexboxgrid'
import { translate } from 'browser/containers/Translator'
import browserHistory from 'react-router/lib/browserHistory'
import { insertThread } from 'browser/redux/forum/ForumActions'

export class CreateThreadForm extends Component {
	render() {
		const { props } = this
		const classNames = cls(props.className, "CreateThreadForm")
		const { insertThread, handleSubmit, asyncValidating } = props
	    return 	<Row className={classNames}>
					<Col xs={12}>
						<Paper zDepth={5} className="CreateThreadForm__paper">
							<form onSubmit={handleSubmit(insertThread)}>
								<Field
									fullWidth
									name="name"
									component={TextField}
									hidden={asyncValidating}
									floatingLabelText={props.title || translate('create_thread')}
								/>
								<Field
									rows={2}
									fullWidth
									name="text"
									multiLine={true}
									component={TextField}
									hidden={asyncValidating}
									floatingLabelText={translate("description")}
								/>
								<center>
									<RaisedButton
										type="submit"
										primary={true}
										label={translate('submit')}
										disabled={!props.valid || props.submitting} />
								</center>
							</form>
						</Paper>
					</Col>
				</Row>

	}
}

CreateThreadForm.propTypes = {
	// hint to display in "name" input
	title: PropTypes.string,
	parentId: PropTypes.string.isRequired,
}

// Connect to redux-form to validate form input.
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
})
// Connect to Redux.
(connect(
	(state, ownProps) => ({...ownProps}),
    (dispatch, {parentId, reset}) => ({
        insertThread(values) {
			// Provide "parentId" to payload data.
			const payload = extend(values, {parentId})
			// Reset form and change url on succes.
			function insertSucces(thread) {
				reset()
				browserHistory.push('/threads/' + thread.slug);
			}
			// Call function.
            dispatch(insertThread(payload, insertSucces))
		}
    })
)(CreateThreadForm))