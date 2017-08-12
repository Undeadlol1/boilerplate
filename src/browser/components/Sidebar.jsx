import PropTypes from 'prop-types'
import Link from 'react-router/lib/Link'
import { connect } from 'react-redux'
import Drawer from 'material-ui/Drawer'
import React, { Component } from 'react'
import MenuItem from 'material-ui/MenuItem'
import { textColor } from 'browser/theme'
import { translate } from 'browser/containers/Translator'
import { actions } from 'browser/redux/actions/GlobalActions'
import LoginLogoutButton from 'browser/components/LoginLogoutButton'

const styles = {
	color: textColor,
	display: 'block',
	textAlign: 'center',
}

export class Sidebar extends Component {
	render() {
		const { UserId, sidebarIsOpen, toggleSidebar } = this.props
		return 	<Drawer
					docked={false}
					style={styles}
					className="Sidebar"
					open={sidebarIsOpen}
					onRequestChange={toggleSidebar}
				>
					{
						UserId
						?	<div>
								<MenuItem onClick={toggleSidebar}><LoginLogoutButton inline /></MenuItem>
								<MenuItem>
									<Link onClick={toggleSidebar} to={`users/${UserId}`}>{translate("profile")}</Link>
								</MenuItem>
							</div>
						: 	null
					}
					<MenuItem><Link className="Sidebar__profile-link" onClick={toggleSidebar} to="search">{translate("search")}</Link></MenuItem>
					{/*<MenuItem><Link onClick={toggleSidebar} to="about">{translate("about")}</Link></MenuItem>*/}
				</Drawer>
	}
}

Sidebar.defaultProps = {
	sidebarIsOpen: false,
}

Sidebar.propTypes = {
	UserId: PropTypes.number,
	sidebarIsOpen: PropTypes.bool,
	toggleSidebar: PropTypes.func.isRequired,
}

export const dispatchToProps = dispatch => ({
	toggleSidebar: () => dispatch(actions.toggleSidebar())
})

export default connect(
	({ user, global }, ownProps) => ({
		...ownProps,
		UserId: user.get('id'),
		sidebarIsOpen: global.get('sidebarIsOpen'),
	}),
	dispatchToProps
)(Sidebar)