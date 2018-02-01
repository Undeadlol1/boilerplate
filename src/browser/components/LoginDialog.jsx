import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Dialog from 'material-ui/Dialog'
import React, { Component } from 'react'
import Divider from 'material-ui/Divider'
import Icon from 'browser/components/Icon'
import { Row, Col } from 'react-styled-flexboxgrid'
import RaisedButton from 'material-ui/RaisedButton'
import LoginForm from 'browser/components/LoginForm'
import { translate } from 'browser/containers/Translator'
import { toggleLoginDialog } from 'browser/redux/actions/UserActions'

export class LoginDialog extends Component {

	static defaultProps = {
		open: false,
	}

	render() {
		const { open, toggleDialog } = this.props
		const iconStyle = {
			WebkitTextStrokeWidth: '0px',
			WebkitTextStrokeColor: 'white',
			color: 'rgba(255, 255, 255, 1)',
		}
		return <Dialog
					open={open}
					className="LoginDialog"
					onRequestClose={toggleDialog}
					titleStyle={{ textAlign: 'center' }}
					title={translate('please_login')}
				>
					<Row className="LoginDialog__icons">
						<Col xs={12} sm={6}>
							<RaisedButton
								primary
								fullWidth
								label="vk.com"
								href="/api/auth/vkontakte"
								className="LoginDialog__icon"
								icon={<Icon name="vk" style={iconStyle} />} />
						</Col>
						<Col xs={12} sm={6}>
							<RaisedButton
								primary
								fullWidth
								label="twitter.com"
								href="/api/auth/twitter"
								className="LoginDialog__icon"
								icon={<Icon name="twitter" style={iconStyle} />} />
						</Col>
					</Row>
					{/* login htrough email + password is disabled until email verification is fixed */}
					{/* <Divider />
					<LoginForm /> */}
				</Dialog>
	}
}

LoginDialog.PropTypes = {
	open: PropTypes.bool.isRequired,
	toggleDialog: PropTypes.func.isRequired,
}

export const dispatchToProps = (dispatch, ownProps) => ({
	toggleDialog: () => dispatch(toggleLoginDialog()),
})

export default connect(
	({ user }) => ({ open: user.get('loginIsOpen') }),
	dispatchToProps
)(LoginDialog)