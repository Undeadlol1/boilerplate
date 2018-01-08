// dependencies
import PropTypes from 'prop-types'
import { fromJS } from 'immutable'
import Chip from 'material-ui/Chip'
import { connect } from 'react-redux'
import Avatar from 'material-ui/Avatar'
import React, { PureComponent } from 'react'
import { Grid, Row, Col } from 'react-styled-flexboxgrid'
// project files
import PageWrapper from 'browser/components/PageWrapper'
import CommentsList from 'browser/components/CommentsList'
import { translate as t } from 'browser/containers/Translator'

class ThreadPage extends PureComponent {
    render() {
		const { props } = this
		return 	<PageWrapper
					className='ThreadPage'
					loading={props.loading}
				>
					<Row className="ThreadPage__header">
						<Col xs={12}>
							{/* onClick={handleClick} */}
							<Chip>
								<Avatar src={props.userImage} />
								{props.username}
							</Chip>
							<h1 className="ThreadPage__title">{props.name}</h1>
						</Col>
					</Row>
					<CommentsList />
				</PageWrapper>
    }
}

ThreadPage.propTypes = {
	name: PropTypes.string.isRequired,
	username: PropTypes.string.isRequired,
	userImage: PropTypes.string.isRequired,
}

export { ThreadPage }

export default
connect(
	(state, ownProps) => {
		const thread = state.forum.get('thread')
		const user = thread.get('User')
		console.log('user: ', user.toJS());
		console.log('thread: ', thread.toJS());
		return {
			...ownProps,
			name: thread.get('name'),
			username: user.get('displayName'),
			userImage: user.get('image'),
	}},
)(ThreadPage)