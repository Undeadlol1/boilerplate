import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Dialog from 'material-ui/Dialog'
import Icon from 'browser/components/Icon'
import FontAwesome from 'react-fontawesome'
import RaisedButton from 'material-ui/RaisedButton'
import { translate } from 'browser/containers/Translator'
import { toggleLoginDialog } from 'browser/redux/actions/UserActions'

@connect(
	({ user }) => ({ loginIsOpen: user.get('loginIsOpen') }),
    (dispatch, ownProps) => ({
        toggleDialog() {
            dispatch(toggleLoginDialog())
        }
    })
)
export default class LoginDialog extends Component {
	render() {
		const { loginIsOpen, toggleDialog } = this.props
		return <Dialog
					open={loginIsOpen}
					title={translate('please_login')}
					className="LoginDialog"
					onRequestClose={toggleDialog}
				>	
					<span className="LoginDialog__icons">
						<RaisedButton
							label="vk.com"
							href="/api/auth/vkontakte"
							className="LoginDialog__icon"
							icon={<Icon name="vk" />} />
						<RaisedButton
							label="twitter.com"
							href="/api/auth/twitter"
							className="LoginDialog__icon"							
							icon={<Icon name="twitter" />} />
					</span>
				</Dialog>				
	}
}
