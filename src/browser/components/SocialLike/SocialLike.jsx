import cls from 'classnames'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import React, { Component } from 'react'
import { Row, Col } from 'react-styled-flexboxgrid'
import { translate as t } from 'browser/containers/Translator'

class SocialLike extends Component {
	componentDidMount() {
		if (process.env.BROWSER) {
			VK.init({
				onlyWidgets: true,
				apiId: process.env.VK_ID,
			})
			VK.Widgets.Like('vk_like')
		}
	}
	render() {
		const {props} = this
		const className = cls(props.className, "SocialLike")
		return 	<div id="vk_like" className={className} />
	}
}

SocialLike.PropTypes = {}

export { SocialLike }
export default connect(
	// stateToProps
	(state, ownProps) => ({ ...ownProps }),
	// dispatchToProps
    (dispatch, ownProps) => ({})
)(SocialLike)