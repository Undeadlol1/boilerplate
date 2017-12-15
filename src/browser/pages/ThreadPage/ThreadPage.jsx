// dependencies
import PropTypes from 'prop-types'
import { fromJS } from 'immutable'
import { connect } from 'react-redux'
import {VK, Comments} from 'react-vk'
import React, { PureComponent } from 'react'
import { Grid, Row, Col } from 'react-styled-flexboxgrid'
// project files
import PageWrapper from 'browser/components/PageWrapper'
import { translate as t } from 'browser/containers/Translator'

class ThreadPage extends PureComponent {
    render() {
		const { props } = this
		return 	<PageWrapper
					className='ThreadPage'
					loading={props.loading}
				>
					<Grid fluid>
						<Row className="ThreadPage__header">
							<Col xs={12}>
								<h1 className="ThreadPage__title">{props.name}</h1>
							</Col>
						</Row>
						<Row>
							<Col xs={12}>
								<VK apiId={Number(process.env.VK_ID)}>
									<Comments />
									{/* onNewComment={handleNewComment} */}
								</VK>
							</Col>
						</Row>
					</Grid>
				</PageWrapper>
    }
}

ThreadPage.propTypes = {
	name: PropTypes.string.isRequired,
}

export { ThreadPage }

export default
connect(
	(state, ownProps) => {
		const thread = state.forum.get('thread')
		return {
			...ownProps,
			name: thread.get('name'),
	}},
)(ThreadPage)