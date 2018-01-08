import cls from 'classnames'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import React, { Component } from 'react'
import { Row, Col } from 'react-styled-flexboxgrid'
import { translate as t } from 'browser/containers/Translator'

class SocialLike extends Component {
	PropTypes = {
		// ovveride id to use multiple widgets on same page
		id: PropTypes.string,
		// ability to rewrite widgets options
		options: PropTypes.object,
	}
	componentDidMount() {
		if (process.env.BROWSER) {
			VK.init({
				onlyWidgets: true,
				apiId: process.env.VK_ID,
			})
			VK.Widgets.Like(
				'vk_like', // html element id
				this.props.options,
				this.props.id || window.location.href,

			)
		}
	}
	render() {
		const {props} = this
		const className = cls(props.className, "SocialLike")
		return 	<div id="vk_like" className={className} />
	}
}

export { SocialLike }
export default connect(
	// stateToProps
	(state, ownProps) => ({ ...ownProps }),
	// dispatchToProps
    (dispatch, ownProps) => ({})
)(SocialLike)