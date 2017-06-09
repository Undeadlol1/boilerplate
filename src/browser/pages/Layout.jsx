import { Grid } from 'react-styled-flexboxgrid';
import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import { Link } from 'react-router';
import NavBar from '../components/NavBar'
import { fetchCurrentUser, logoutCurrentUser } from '../redux/actions/UserActions'
import Sidebar from '../components/Sidebar'
import LoginDialog from '../components/LoginDialog'
import LoginLogoutButton from '../components/LoginLogoutButton'
import selectn from 'selectn'

let timeout = null

@connect(
	({ user, global }, ownProps) => ({
		user,
		...ownProps,
		loginIsOpen: global.loginIsOpen,
		headerIsShown: global.headerIsShown
	}),
	(dispatch, ownProps) => ({
		fetchCurrentUser() { // fetch user data on load
			dispatch(fetchCurrentUser())
		},
		logout(event) {
			event.preventDefault()
			dispatch(logoutCurrentUser())
		}
    })
)
export default class Layout extends React.Component {
	static propTypes = {
		// main: PropTypes.node.isRequired,
		// nav: PropTypes.node
	}

	state = {
		hidden: false,
		// hidden: true,
	}

	static contextTypes = {
		router: PropTypes.object.isRequired
	}

	// componentDidMount() {
	// 	$('body').css('background-color', 'rgb(48, 48, 48)')
	// 	$('input[type=url]:focus:not([readonly])').css('box-shadow', 'none !important')
	// }
	
	componentDidMount() {
		this.props.fetchCurrentUser()
	}

	showChildren = () => {
		clearInterval(timeout)
		// $('.Decision').show()
		this.setState({ hidden: false })
		timeout = setTimeout(() => {
			this.hideChildren()
		}, 2500);
	}

	hideChildren = () => {
		// $('.Decision').hide()
		this.setState({ hidden: true })
	}

	render() {
		const { logout, loginIsOpen, headerIsShown, ...rest } = this.props

		const currentPath = this.context.router.getCurrentPathname && this.context.router.getCurrentPathname()
		const location = selectn('router.location.pathname', this.context)
		const isMoodPage = location.includes('/mood/')
		
		// styles
		const 	baseStyles = 	{
									height: '100vh',
									minHeight: '100vh',
									backgroundColor: 'rgb(48, 48, 48)',
									color: 'white'
								},
				headerStyles = 	{ // this is moved to navbar.scss
									// position: 'fixed',
									zIndex: '1',
									width: '100%'
								}
								
		return <div
					className='Layout'
					style={baseStyles}
					//onMouseOver={this.showChildren}
					//onMouseLeave={this.hideChildren}
					//onMouseMove={this.showChildren}
					//onTouchEnd={this.hideWhenIdle}
					//onMouseStop={this.checker} // this useed to be here already commented out
				>
					{!isMoodPage && <NavBar />}
					<main>
						{this.props.children}
					</main>
					<Sidebar />
					<LoginDialog />
				</div>
	}
}
