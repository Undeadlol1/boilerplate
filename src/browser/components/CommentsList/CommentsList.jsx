import cls from 'classnames'
import PropTypes from 'prop-types'
import Paper from 'material-ui/Paper'
import { connect } from 'react-redux'
import React, { Component } from 'react'
import { Row, Col } from 'react-styled-flexboxgrid'
import { translate as t } from 'browser/containers/Translator'

class CommentsList extends Component {
	componentDidMount() {
		if (process.env.BROWSER) {
			VK.init({
				onlyWidgets: true,
				apiId: process.env.VK_ID,
			})
			VK.Widgets.Comments(
				'vk_comments',
				{pageUrl: window.location.href},
				window.location.href
			)
		}
	}
	render() {
		const {props} = this
		const className = cls(props.className, "CommentsList")
		return 	<Row className={className}>
					<Col xs={12}>
						<Paper zDepth={3}>
							<div id="vk_comments" />
						</Paper>
					</Col>
				</Row>
	}
}

CommentsList.PropTypes = {}

export { CommentsList }
export default connect(
	// stateToProps
	(state, ownProps) => ({ ...ownProps }),
	// dispatchToProps
    (dispatch, ownProps) => ({})
)(CommentsList)