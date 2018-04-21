import cls from 'classnames'
import gql from 'graphql-tag'
import PropTypes from 'prop-types'
import { fromJS } from 'immutable'
import { connect } from 'react-redux'
import { graphql } from 'react-apollo'
import React, { Component } from 'react'
import Link from 'react-router/lib/Link'
import {List, ListItem} from 'material-ui/List'
import { Row, Col } from 'react-styled-flexboxgrid'
import { translate as t } from 'browser/containers/Translator'
import { graphQLResultHasError } from 'apollo-utilities';

class ForumsList extends Component {
	render() {
		const {props} = this
		const className = cls(props.className, "ForumsList")
		const forums = fromJS(props.data.forums)
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

ForumsList.defaultProps = {
}

ForumsList.PropTypes = {
	forums: PropTypes.object.isRequired,

}

export { ForumsList }

export const query = gql`
  query getForums {
    forums {
      id
      name
	  slug
    }
  }
`

export default graphql(query)(ForumsList)

// export default connect(
// 	// stateToProps
// 	(state, ownProps) => ({
// 		forums: state.forum.get('forums')
// 	}),
// 	// dispatchToProps
//     (dispatch, ownProps) => ({})
// )(ForumsList)