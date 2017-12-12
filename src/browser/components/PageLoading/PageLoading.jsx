import cls from 'classnames'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import React, { Component } from 'react'
import { Row, Col } from 'react-styled-flexboxgrid'
import CircularProgress from 'material-ui/CircularProgress'
import { translate as t } from 'browser/containers/Translator'

class PageLoading extends Component {
	render() {
		const {props} = this
		const className = cls(props.className, "PageLoading")
		console.log('props.loading: ', props.loading);
		if (!props.loading) return null
		return 	<div className={className}>
					<CircularProgress className="PageLoading__indicator" />
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