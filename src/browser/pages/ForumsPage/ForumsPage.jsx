// dependencies
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import React, { PureComponent } from 'react'
import { Grid, Row, Col } from 'react-styled-flexboxgrid'
// project files
import PageWrapper from 'browser/components/PageWrapper'
import { translate as t } from 'browser/containers/Translator'
import CreateForumForm from 'browser/components/CreateForumForm'
import ForumsList from 'browser/components/ForumsList'

class ForumsPage extends PureComponent {
    render() {
		const { props } = this
		return 	<PageWrapper
					className='ForumsPage'
					loading={props.loading}
				>
					<Grid fluid>
						<CreateForumForm />
						<ForumsList />
					</Grid>
				</PageWrapper>
    }
}

ForumsPage.propTypes = {
	// name: PropTypes.object,
}

export { ForumsPage }

export default
connect(
	(state, ownProps) => ({
		...ownProps,
		// name: state.forum.get('name'),
	}),
)(ForumsPage)