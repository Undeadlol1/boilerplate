import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { AppBar, Avatar } from 'material-ui'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import LoginLogoutButton from './LoginLogoutButton'
import { toggleSidebar, toggleControls } from '../redux/actions/GlobalActions'
// import classnames from 'classnames'

// import { gql, graphql } from 'react-apollo';
// @graphql(gql`query current_user { id }`)
@connect(
    ({ user, global  }, ownProps) => {
        const { controlsAreShown, headerIsShown } = global
        const username = user.get('username') && user.get('username').toLowerCase()
        return { controlsAreShown, headerIsShown, username, ...ownProps }
    },
    (dispatch, ownProps) => ({
        toggleSidebar() {
            dispatch(toggleSidebar())
        }
    })
)
class NavBar extends Component {
    render() {
        const { username, headerIsShown, controlsAreShown, className, toggleSidebar, children, ...rest } = this.props
        const titleLink = <Link to="/" className="NavBar__home-link">MooD</Link>
        const loginButton = username
                            ? <Link to={`/users/${username}`}>
                                <Avatar className="NavBar__avatar" src={`https://api.adorable.io/avatars/100/${username}.png`} />
                              </Link>
                            : <LoginLogoutButton />

        return  <header className={'NavBar ' + className} {...rest}>
                    <AppBar
                        title={titleLink}
                        iconElementRight={loginButton}
                        onLeftIconButtonTouchTap={toggleSidebar}
                        {...rest} />
                        {children}
                </header>
    }
}

NavBar.propTypes = {
    // user: PropTypes.object.isRequired,
    // toggleSidebar: PropTypes.func.isRequired
}

export default NavBar