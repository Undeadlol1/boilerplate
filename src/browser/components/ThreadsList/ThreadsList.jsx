import cls from 'classnames'
import { fromJS } from 'immutable'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Paper from 'material-ui/Paper'
import React, { Component } from 'react'
import Link from 'react-router/lib/Link'
import {List, ListItem} from 'material-ui/List'
import { Row, Col } from 'react-styled-flexboxgrid'
import { translate as t } from 'browser/containers/Translator'

class ThreadsList extends Component {
	render() {
		const {props} = this
		const className = cls(props.className, "ThreadsList")
		const threads = props.threads.get('values')
		return 	<Row className={className}>
					<Col xs={12}>
						<Paper zDepth={props.zDepth}>
							<List>
								{
									threads.size
									? threads.map(
										thread => 	<Link
														key={thread.get('id')}
														to={'/threads/' + thread.get('slug')}
													>
														<ListItem
															primaryText={thread.get('name')}
														/>
													</Link>
									)
									: 	<ListItem
											disabled={true}
											className="ThreadsList__empty"
											primaryText={t('list_is_empty') + '...'}
										/>
								}
							</List>
						</Paper>
					</Col>
				</Row>
	}
}

ThreadsList.defaultProps = {
	zDepth: 5,
	// TODO: rework this
	threads: fromJS({
		values: []
	})
}

ThreadsList.PropTypes = {
	title: PropTypes.string,
	zDepth: PropTypes.number,
	threads: PropTypes.object.isRequired,
}

export { ThreadsList }
export default connect(
	// stateToProps
	(state, ownProps) => ({
		threads: state.forum.get('threads'),
		// ownProps must be the last one in object to overwrite threads if they are passed through property
		...ownProps
	}),
	// dispatchToProps
    (dispatch, ownProps) => ({})
)(ThreadsList)