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
					<MenuItem onClick={toggleSidebar}><LoginLogoutButton inline /></MenuItem>
					{
						UserId
						?	<div>
								<Link
									to={`users/${UserId}`}
									onClick={toggleSidebar}
									className="Sidebar__profile-link"
								>
									<MenuItem>{translate("profile")}</MenuItem>
								</Link>
							</div>
						: 	null
					}
					<Link
						to="search"
						onClick={toggleSidebar}
						className="Sidebar__search-link"
					>
						<MenuItem>{translate("search")}</MenuItem>
					</Link>
					<Link
						to="forum"
						onClick={toggleSidebar}
						className="Sidebar__forum-link"
					>
						<MenuItem>{translate("forum")}</MenuItem>
					</Link>
					{/* <Link
						to="about"
						onClick={toggleSidebar}
						className="Sidebar__about-link"
					>
						<MenuItem>{translate("about")}</MenuItem>
					</Link> */}
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

export const stateToProps = ({ user, global }, ownProps) => ({
	...ownProps,
	UserId: user.get('id'),
	sidebarIsOpen: global.get('sidebarIsOpen'),
})

export const dispatchToProps = dispatch => ({
	toggleSidebar: () => dispatch(actions.toggleSidebar())
})

export default connect(stateToProps, dispatchToProps)(Sidebar)