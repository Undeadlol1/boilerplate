import PropTypes from 'prop-types'
import isEmpty from 'lodash/isEmpty'
import { connect } from 'react-redux'
import React, { Component } from 'react'
import isEmail from 'validator/lib/isEmail'
import contains from 'validator/lib/contains'
import { TextField } from 'redux-form-material-ui'
import { Row, Col } from 'react-styled-flexboxgrid'
import { Field, Form, reduxForm } from 'redux-form'
import RaisedButton from 'material-ui/RaisedButton'
import { translate as t } from 'browser/containers/Translator'
import { loginUser, createUser } from 'browser/redux/actions/UserActions'
import { checkStatus, parseJSON } from'browser/redux/actions/actionHelpers'

export class LoginOrSignUpForm extends Component {
	render() {
		// TODO
		const { isLogin, valid, onSubmit, handleSubmit, asyncValidating } = this.props
		const buttonStyle = {paddingTop: '1rem'}
	    return  <Form
					onSubmit={handleSubmit(onSubmit)}
					className="LoginOrSignUpForm"
				>
					<Row>
						<Col xs={12}>
							{/* TODO check why is this not async validating */}
							{
								isLogin
								? null
								: <Field name="email" type="email" component={TextField} hidden={asyncValidating} hintText={t('email')} fullWidth />
							}
							<Field name="username" type="text" component={TextField} hidden={asyncValidating} hintText={t('username')} fullWidth />
							<Field name="password" type="password" component={TextField} hidden={asyncValidating} hintText={t('password')} fullWidth />
							<center><RaisedButton style={buttonStyle} disabled={!valid} label={t('submit')} type="submit" /></center>
						</Col>
					</Row>
				</Form>
	}
}

LoginOrSignUpForm.defaultProps = {
	isLogin: true,
}

LoginOrSignUpForm.PropTypes = {
	isLogin: PropTypes.bool.isRequired,
	onSubmit: PropTypes.func.isRequired,
	handleSubmit: PropTypes.func.isRequired,
	asyncValidating: PropTypes.bool.isRequired,
}

export const dispatchToProps = (dispatch, ownProps) => ({
	onSubmit(values) {
		return dispatch(
			ownProps.isLogin
			? loginUser(values, ownProps.reset)
			: createUser(values, ownProps.reset)
		)
	}
})

// TODO reorganize this for better testing
export default reduxForm({
	form: 'LoginOrSignUpForm',
	asyncValidate(values, dispatch, {isLogin}) {
		return fetch('/api/auth/validate/' + values.username)
			.then(checkStatus)
			.then(parseJSON)
			.then(user => {
				if (isLogin && isEmpty(user)) throw {username: t('user_does_not_exists')}
				else if (!isLogin && !isEmpty(user)) throw {
					// TODO add better errors so user will know about email + username constraint
					email: t('user_already_exists'),
					username: t('user_already_exists'),
				}
				return
			})
    },
	asyncBlurFields: ['email', 'username'],
	validate({username = '', password = '', email = ''}, ownProps) {
		let errors = {}

		if (!username) errors.username = t('must_not_be_empty')
		if (contains((username), ' ')) errors.username = t('no_whitespace_allowed')
		if (!password) errors.password = t('must_not_be_empty')
		if (contains((password), ' ')) errors.password = t('no_whitespace_allowed')
		if (!ownProps.isLogin) {
			if (!email) errors.email = t('must_not_be_empty')
			if (contains((email), ' ')) errors.email = t('no_whitespace_allowed')
			if (!isEmail(email)) errors.email = t('email_not_valid')
		}

		return errors
	},
})
(connect(
	(state, ownProps) => ({...ownProps}),
	dispatchToProps
)(LoginOrSignUpForm))