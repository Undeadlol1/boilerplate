import cls from 'classnames'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import React, { Component } from 'react'
import { Row, Col } from 'react-styled-flexboxgrid'
import CircularProgress from 'material-ui/CircularProgress'
import { translate as t } from 'browser/containers/Translator'

const indicatorStyles = {
	top: '50%',
	left: '50%',
	width: '100%',
	height: '100%',
	zIndex: '10000',
	position: 'fixed',
}

const containerStyles = {
	top: '0px',
	left: '0px',
	opacity: '1',
	zIndex: '1200',
	width: '100%',
	height: '100%',
	position: 'fixed',
	willChange: 'opacity',
	pointerEvents: 'auto',
	transform: 'translateZ(0px)',
	backgroundColor: 'rgba(0, 0, 0, 0.54)',
    transition: 'left 0ms cubic-bezier(0.23, 1, 0.32, 1) 0ms, opacity 400ms cubic - bezier(0.23, 1, 0.32, 1) 0ms',
}

const imageStyles = {
	transform: 'translate(-50%, -50%)',
}
/**
 * This component displays full page loading indicator.
 * NOTE: when user first sees the page after SSR React scripts will not be avalaible for a few moments.
 * This means animated loading indicator will not work.
 * So, instead we must show appliacation logo image as a loading indicator.
 */
class PageLoading extends Component {
	render() {
		const {props} = this
		const isBrowser = process.env.BROWSER
		const className = cls(props.className, "PageLoading")
		if (!props.loading) return null
		return 	<div className={className} style={containerStyles}>
					<div className="PageLoading__indicator-container" style={indicatorStyles}>
						{
							isBrowser
							? <CircularProgress className="PageLoading__indicator" />
							: <img src="/android-chrome-192x192.png" style={imageStyles} />
						}
					</div>
				</div>
	}
}

PageLoading.PropTypes = {
	loading: PropTypes.bool.isRequired
}

export { PageLoading }
export default connect(
	// stateToProps
	({ui}, ownProps) => ({
		...ownProps,
		loading: ui.get('loading'),
	 }),
	// dispatchToProps
    (dispatch, ownProps) => ({})
)(PageLoading)