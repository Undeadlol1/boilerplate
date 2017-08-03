import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { connect } from 'react-redux'
import RaisedButton from 'material-ui/RaisedButton'
import extend from 'lodash/assignIn'
import { translate } from 'browser/containers/Translator'
import { toggleLoginDialog, logoutCurrentUser } from 'browser/redux/actions/UserActions'
/**
 * conditionally render 'login' or 'logout' button
 */
export class LoginLogoutButton extends Component {
	render() {
		const { userId, className, logout, toggleDialog, inline, ...rest } = this.props
		const label = translate(userId ? "logout" : "login")
		const inlineStyles = {display: 'block', textAlign: "center"}

		const properties = extend(
			{
				onClick: userId ? logout : toggleDialog,
				className: classNames('LoginLogoutButton', className),
			},
			// use <RaisedButton /> or <span> if 'inline' is specified
			// span needs special styles and RaisedButton needs 'label'
			inline ? {style: inlineStyles} : { label },
			rest
		)

		if (inline) return <span {...properties}>{label}</span>
		return <RaisedButton {...properties} />
	}
}

LoginLogoutButton.propTypes = {
	inline: PropTypes.bool,
	userId: PropTypes.number,
	logout: PropTypes.func.isRequired,
	toggleDialog: PropTypes.func.isRequired,
}

export const dispatchToProps = (dispatch, ownProps) => ({
	logout: () => dispatch(logoutCurrentUser()),
	toggleDialog: () => dispatch(toggleLoginDialog()),
})

export default connect(
	({ user }, ownProps) => ({
		userId: user.get('id'), ...ownProps
	}),
	dispatchToProps
)(LoginLogoutButton)