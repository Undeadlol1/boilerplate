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
							<p className="ThreadPage__text">{props.text}</p>
						</Col>
					</Row>
					<CommentsList />
				</PageWrapper>
    }
}

ThreadPage.propTypes = {
	name: PropTypes.string.isRequired,
	text: PropTypes.string.isRequired,
	username: PropTypes.string.isRequired,
	userImage: PropTypes.string.isRequired,
}

export { ThreadPage }

export default
connect(
	(state, ownProps) => {
		const thread = state.forum.get('thread')
		const user = thread.get('User')
		return {
			...ownProps,
			name: thread.get('name'),
			text: thread.get('text'),
			userImage: user.get('image'),
			username: user.get('displayName'),
	}},
)(ThreadPage)