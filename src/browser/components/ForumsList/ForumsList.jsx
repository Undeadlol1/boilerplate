import cls from 'classnames'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import React, { Component } from 'react'
import Link from 'react-router/lib/Link'
import {List, ListItem} from 'material-ui/List'
import { Row, Col } from 'react-styled-flexboxgrid'
import { translate as t } from 'browser/containers/Translator'

class ForumsList extends Component {
	render() {
		const {props} = this
		const className = cls(props.className, "ForumsList")
		const forums = props.forums.get('values')
		return 	<Row className={className}>
					<Col xs={12}>
						<List>
							{
								forums.size
								? forums.map(
									forum => 	<Link
													key={forum.get('id')}
													to={'forums/' + forum.get('slug')}
												>
													<ListItem
														primaryText={forum.get('name')}
													/>
												</Link>
								)
								// TODO
								: <ListItem primaryText={t('list_is_empty')} />
							}
						</List>
					</Col>
				</Row>
	}
}

ForumsList.defaultProps = {
}

ForumsList.PropTypes = {
	forums: PropTypes.object.isRequired,
	
}

export { ForumsList }
export default connect(
	// stateToProps
	(state, ownProps) => ({
		forums: state.forum.get('forums')
	}),
	// dispatchToProps
    (dispatch, ownProps) => ({})
)(ForumsList)