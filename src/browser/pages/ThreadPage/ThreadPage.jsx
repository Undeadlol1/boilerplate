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
		const thread = fromJS({
			name: 'Example',
			text: 'This is some initial text',
		})
		return 	<PageWrapper
					className='ThreadPage'
					loading={props.loading}
				>
					<Grid fluid>
						<Row>
							<Col xs={12}>
								<VK apiId={5202075}>
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
	thread: PropTypes.object.isRequired,
}

export { ThreadPage }

export default
connect(
	(state, ownProps) => ({
		...ownProps,
		thread: state.thread,
	}),
)(ThreadPage)