// dependencies
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import React, { PureComponent } from 'react'
import { Grid, Row, Col } from 'react-styled-flexboxgrid'
// project files
import PageWrapper from 'browser/components/PageWrapper'
import { translate as t } from 'browser/containers/Translator'

class AdminPage extends PureComponent {
    render() {
		const { props } = this
		return 	<PageWrapper
					className='AdminPage'
					loading={props.loading}
				>
					<Grid fluid>
						<Row>
							<Col xs={12}>
								
							</Col>
						</Row>
					</Grid>
				</PageWrapper>
    }
}

AdminPage.propTypes = {
	// prop: PropTypes.object,
}

export { AdminPage }

export default
connect(
	(state, ownProps) => ({
		// prop: state.mood.get('moods'),
		...ownProps
	}),
)(AdminPage)