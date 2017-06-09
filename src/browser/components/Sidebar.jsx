import { Link } from 'react-router'
import { connect } from 'react-redux';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import React, { Component } from 'react'
import LoginLogoutButton from './LoginLogoutButton'
import { toggleSidebar } from '../redux/actions/GlobalActions'
import { FormattedMessage } from 'react-intl';

@connect(
	({ user, global: { sidebarIsOpen } }, ownProps) => ({ user, sidebarIsOpen, ...ownProps }),
    (dispatch, ownProps) => ({
        toggleSidebar() {
            dispatch(toggleSidebar())
        }
    })
)
export default class Sidebar extends Component {
	render() {
		const { user, sidebarIsOpen, toggleSidebar } = this.props
		const username = user.get('username')
		return 	<Drawer className="Sidebar" docked={false} open={sidebarIsOpen} onRequestChange={toggleSidebar}>
					{username &&
						<MenuItem>
							<Link onClick={toggleSidebar} to={`users/${username}`}><FormattedMessage id="profile" /></Link>
						</MenuItem>
					}
					<MenuItem onClick={toggleSidebar}><LoginLogoutButton inline fullWidth /></MenuItem>
					<MenuItem><Link onClick={toggleSidebar} to="search"><FormattedMessage id="search" /></Link></MenuItem>
					{/*<MenuItem><Link onClick={toggleSidebar} to="about"><FormattedMessage id="about" /></Link></MenuItem>*/}
				</Drawer>
	}
}
