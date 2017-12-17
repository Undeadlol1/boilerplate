// dependencies
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import React, { PureComponent } from 'react'
import { Grid, Row, Col } from 'react-styled-flexboxgrid'
// project files
import PageWrapper from 'browser/components/PageWrapper'
import ThreadsList from 'browser/components/ThreadsList'
import { translate as t } from 'browser/containers/Translator'
import CreateThreadForm from 'browser/components/CreateThreadForm'

class ForumPage extends PureComponent {
    render() {
		const { props } = this
		return 	<PageWrapper
					className='ForumPage'
					loading={props.loading}
				>
					<Row className="ForumPage__header">
						<Col xs={12}>
							<h1 className="ForumPage__title">{props.name}</h1>
						</Col>
					</Row>
					<ThreadsList />
					<CreateThreadForm parentId={props.ForumId} />
				</PageWrapper>
    }
}

ForumPage.propTypes = {
	name: PropTypes.string.isRequired,
	ForumId: PropTypes.string.isRequired,
}

export { ForumPage }

export default
connect(
	(state, ownProps) => ({
		...ownProps,
		name: state.forum.get('name'),
		ForumId: state.forum.get('id'),
	}),
)(ForumPage)