import cls from 'classnames'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import React, { Component } from 'react'
import { Row, Col } from 'react-styled-flexboxgrid'
import { translate as t } from 'browser/containers/Translator'

class Feedback extends Component {
	componentDidMount() {
		// vk api should not be loaded while SSR is going
		// their api is broken on any port but :80
		if (process.env.BROWSER && process.env.NODE_ENV == 'production') {
			VK.init({
				onlyWidgets: true,
				apiId: process.env.VK_ID,
			})
			console.log('process.env.VK_GROUP_ID: ', process.env.VK_GROUP_ID);
			VK.Widgets.CommunityMessages(
				"vk_community_messages",
				process.env.VK_GROUP_ID,
				{
					widgetPosition: 'left',
					disableButtonTooltip: 1,
					tooltipButtonText: t('feedback'),
					onCanNotWrite: reason => console.log(reason),
				}
			)
		}
	}
	render() {
		const {props} = this
		const className = cls(props.className, "Feedback")
		return 	<div id="vk_community_messages" className={className} />
	}
}

Feedback.PropTypes = {}

export { Feedback }
export default connect(
	// stateToProps
	(state, ownProps) => ({ ...ownProps }),
	// dispatchToProps
    (dispatch, ownProps) => ({})
)(Feedback)