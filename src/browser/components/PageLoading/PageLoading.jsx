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
		if (!props.loading) return null
		return 	<CircularProgress className={className} />
	}
}

PageLoading.PropTypes = {}

export { PageLoading }
export default connect(
	// stateToProps
	(state, ownProps) => ({ ...ownProps }),
	// dispatchToProps
    (dispatch, ownProps) => ({})
)(PageLoading)