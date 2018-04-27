import cls from 'classnames'
import gql from 'graphql-tag'
import { fromJS } from 'immutable'
import { object } from 'prop-types'
import { connect } from 'react-redux'
import React, { Component } from 'react'
import Link from 'react-router/lib/Link'
import { getForums } from '../../graphql'
import { graphql, Query } from 'react-apollo'
import {List, ListItem} from 'material-ui/List'
import { Row, Col } from 'react-styled-flexboxgrid'
import { graphQLResultHasError } from 'apollo-utilities'
import { translate as t } from 'browser/containers/Translator'
/**
 * Simple component to display list of forums.
 * WIP.
 * @exports
 */
class ForumsList extends Component {
	// Apollo request data.
	static propTypes = { data: object.isRequired }
	render() {
		const {props} = this
		const forums = fromJS(props.data.forums)
		const className = cls(props.className, "ForumsList")
		return 	<Row className={className}>
					<Col xs={12}>
						<List>
							{
								forums && forums.size
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
/**
 * Wrap component with data fetching container.
 * @param {Object} ownProps
 */
const withQuery = (ownProps) => (
	<Query query={getForums}>
		{response => <ForumsList {...ownProps} {...response} />}
	</Query>
)
/**
 * Export presentational component for testing.
 */
export { ForumsList }
/**
 * Export component with containers.
 */
export default withQuery