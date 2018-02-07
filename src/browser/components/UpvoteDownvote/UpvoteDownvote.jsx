import cls from 'classnames'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Icon from 'browser/components/Icon'
import { Row, Col } from 'react-styled-flexboxgrid'
import { translate as t } from 'browser/containers/Translator'
/**
 * Display upvote and downvote icon buttons.
 * When user clicks one of them request is being send to votes API.
 * Then color of icon is changed.
 */
class UpvoteDownvote extends Component {
	static PropTypes = {
		vote: PropTypes.objec,
		parentId: PropTypes.string.isRequired,
	}
	/**
	 * make upsert request to votes api
	 * @param {boolean} value vote.value to upsert
	 */
	vote(value) {

	}
	render() {
		const {props} = this
		const classNames = cls(
			"UpvoteDownvote", // namespace
			props.className, // inherited className
		)
		return 	<div className={classNames}>
					<Icon
						name="thumbs-up"
						title={t('i_like_it')}
						hoverIcon='thumbs-o-up'
						className="UpvoteDownvote__upvote"
						onClick={this.vote.bind(this, true)}
						// color={decisionVote && 'rgb(0, 151, 167)'}
					/>
					<Icon
						name="thumbs-down"
						hoverIcon='thumbs-o-down'
						className="UpvoteDownvote__downvote"
						onClick={this.vote.bind(this, false)}
						title={t('dont_like_it_dont_show_again')}
						// color={decisionVote === false || 0 ? 'rgb(255, 64, 129)' : undefined}
					/>
				</div>
	}
}

export { UpvoteDownvote }
export default UpvoteDownvote