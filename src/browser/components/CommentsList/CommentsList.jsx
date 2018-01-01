import cls from 'classnames'
import PropTypes from 'prop-types'
import Paper from 'material-ui/Paper'
import { connect } from 'react-redux'
import { VK, Comments } from 'react-vk'
import React, { Component } from 'react'
import { Row, Col } from 'react-styled-flexboxgrid'
import { translate as t } from 'browser/containers/Translator'

class CommentsList extends Component {
	render() {
		const {props} = this
		const className = cls(props.className, "CommentsList")
		return 	<Row className={className}>
					<Col xs={12}>
						<Paper zDepth={3}>
							<VK apiId={Number(process.env.VK_ID)}>
								<Comments />
								{/* onNewComment={() => console.log('1')}  */}
							</VK>
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