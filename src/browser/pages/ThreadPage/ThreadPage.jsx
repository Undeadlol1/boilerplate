// dependencies
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
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
						<Row>
							<Col xs={12}>
								{
									props.comments.map(com => <li key={com.id}>{com.text}</li>)
								}
							</Col>
						</Row>
					</Grid>
				</PageWrapper>
    }
}

ThreadPage.defaultProps = {
	comments: [
		{
			id: 1,
			UserId: 123,
			text: "Hey Guys!11",
		},
		{
			id: 2,
			UserId: 123,
			text: "Hi dude.",
		},
		{
			id: 3,
			UserId: 123,
			text: "What's up?",
		}
	]
}

ThreadPage.propTypes = {
	comments: PropTypes.array,
}

export { ThreadPage }

export default
connect(
	(state, ownProps) => ({
		// prop: state.mood.get('moods'),
		...ownProps
	}),
)(ThreadPage)