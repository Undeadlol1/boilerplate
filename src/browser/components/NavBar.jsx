import LoginLogoutButton from 'browser/components/LoginLogoutButton'
import { actions } from 'browser/redux/actions/GlobalActions'
import { translate } from 'browser/containers/Translator'
import { alternateTextColor } from 'browser/theme'
import Loading from 'browser/components/Loading'
import React, { Component } from 'react'
import Link from 'react-router/lib/Link'
import AppBar from 'material-ui/AppBar'
import Avatar from 'material-ui/Avatar'
import { connect } from 'react-redux'
import classNames from 'classnames'
import PropTypes from 'prop-types'
// Styles.
const LoadingStyles = { marginTop: '1.5px' }
const titleStyles = { color: alternateTextColor }
const LoginLogoutButtonStyles = { marginTop: '5.5px' }
/**
 * Component which displays top navigation bar.
 * @export
 */
export class NavBar extends Component {
    render() {
        const { displayName, UserId, image, loading, className, children, toggleSidebar, ...rest } = this.props
        const src = `https://api.adorable.io/avatars/100/${UserId}.png`

        let loginOrAvatar
        // show loading animation if user is being fetched
        if (!UserId && loading) loginOrAvatar = <Loading style={LoadingStyles} color="rgb(48, 48, 48)" condition={true} />
        // else show avatar or login button
        else {
            loginOrAvatar = UserId
                            ? <Link className="Navbar__profile-link" to={`/users/${UserId}`}>
                                <Avatar
                                    src={image || src}
                                    className="NavBar__avatar"
                                    alt={translate('your_avatar')}
                                />
                              </Link>
                            : <LoginLogoutButton style={LoginLogoutButtonStyles} />
        }
        // Home link.
        const titleLink = <Link
            to="/"
            style={titleStyles}
            className="NavBar__home-link"
        >
            {process.env.APP_NAME}
        </Link>

        return  <header className={classNames('NavBar ', className)} {...rest}>
                    <AppBar
                        {...rest}
                        title={titleLink}
                        iconElementRight={loginOrAvatar}
                        onLeftIconButtonTouchTap={toggleSidebar}
                    />
                    {children}
                </header>
    }
}

NavBar.propTypes = {
    UserId: PropTypes.number,
    toggleSidebar: PropTypes.func.isRequired,
}

export const stateToProps = ({ user, global }, ownProps) => {
    const UserId = user.get('id')
    const image = user.get('image')
    const loading = user.get('loading')
    const displayName = user.get('displayName')
    return { UserId, displayName, image, loading, ...ownProps }
}

export const dispatchToProps = dispatch => ({
    toggleSidebar: () => dispatch(actions.toggleSidebar())
})

export default connect(stateToProps, dispatchToProps)(NavBar)