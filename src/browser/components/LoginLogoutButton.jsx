import { toggleLoginDialog, logoutCurrentUser } from '../redux/actions/UserActions'
import React, { Component } from 'react'
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

// TODO add comments

@connect(
	({ user }, ownProps) => ({
		userId: user.get('id'), ...ownProps
	}),	
    (dispatch, ownProps) => ({
        toggleDialog() {
            dispatch(toggleLoginDialog())
        },
		logout() {
			dispatch(logoutCurrentUser())
		}
    })
)
class LoginLogoutButton extends Component {
	render() {
		const { userId, logout, toggleDialog, inline, fullWidth, ...rest } = this.props
		const isLoggedIn = userId
		const label = <FormattedMessage id={isLoggedIn ? "logout" : "login"} />
		const className = 'LoginLogoutButton'

		if (inline) return <span
								className={className}
								onClick={isLoggedIn ? logout : toggleDialog}
								style={{display: 'block', textAlign: "center"}}
								{...rest}
							>
								{label}
							</span>
		
		return <RaisedButton
					label={label}
					className={className}
					onClick={isLoggedIn ? logout : toggleDialog}
					{ ...rest } />
	}
}

LoginLogoutButton.propTypes = {
	fullWidth: PropTypes.bool
}

export default LoginLogoutButton