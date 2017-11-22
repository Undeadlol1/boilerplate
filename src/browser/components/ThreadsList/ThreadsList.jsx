import cls from 'classnames'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import React, { Component } from 'react'
import Link from 'react-router/lib/Link'
import {List, ListItem} from 'material-ui/List'
import { Row, Col } from 'react-styled-flexboxgrid'
import { translate as t } from 'browser/containers/Translator'

class ThreadsList extends Component {
	render() {
		const {props} = this
		const className = cls(props.className, "ThreadsList")
		return 	<Row className={className}>
					<Col xs={12}>
						<List>
							{
								props.threads.length
								? props.threads.map(
									thread => 	<Link
													key={thread.id}
													to={'threads/' + thread.slug}
												>
													<ListItem
														primaryText={thread.name}
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

ThreadsList.defaultProps = {
	threads: [
		{
			id: 12343,
			name: 'Penis',
			slug: 'Penis',
		},
		{
			id: 123234234243,
			name: 'Vagina',
			slug: 'Penis',
		}
	]
}

ThreadsList.PropTypes = {
	threads: PropTypes.array,
}

export { ThreadsList }
export default connect(
	// stateToProps
	(state, ownProps) => ({ ...ownProps }),
	// dispatchToProps
    (dispatch, ownProps) => ({})
)(ThreadsList)