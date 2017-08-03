import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {Tabs, Tab} from 'material-ui/Tabs'
import { Field, reduxForm } from 'redux-form';
import { translate as t } from 'browser/containers/Translator'
import LoginOrSignUpForm from 'browser/components/LoginOrSignUpForm'

export class LoginForm extends Component {
	render() {
	    return  <Tabs className="LoginForm">
					<Tab label={t('login')}>
						{/*
							'form' prop is set to avoid breaking redux-form
							with multiple instances of same form
						 */}
						<LoginOrSignUpForm form='Login' isLogin />
					</Tab>
					<Tab label={t('sign_up')}>
						<LoginOrSignUpForm form='SignUp' isLogin={false} />
					</Tab>
				</Tabs>

	}
}

LoginForm.PropTypes = {}

export default LoginForm