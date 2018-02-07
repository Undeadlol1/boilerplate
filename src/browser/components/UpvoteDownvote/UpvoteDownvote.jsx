import cls from 'classnames'
import selectn from 'selectn'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Icon from 'browser/components/Icon'
import { toastr } from 'react-redux-toastr'
import { Row, Col } from 'react-styled-flexboxgrid'
import { translate as t } from 'browser/containers/Translator'
import { checkStatus, headersAndBody } from'browser/redux/actions/actionHelpers'
/**
 * Display upvote and downvote icon buttons.
 * When user clicks one of them request is being send to votes API.
 * Then color of icon is changed.
 */
class UpvoteDownvote extends Component {
	static PropTypes = {
		vote: PropTypes.objec,
		UserId: PropTypes.number,
		parentId: PropTypes.string.isRequired,
	}
	// state is used to set vote value after request to votes API
	state = { value: undefined }
	/**
	 * make upsert request to votes api
	 * @param {boolean} value vote.value to upsert
	 */
	voteRequest(value) {
		const { parentId } = this.props
		fetch(
			'/api/votes',
			headersAndBody({value, parentId})
		)
		// if error occurs this function will activate toats with error message
		.then(checkStatus)
		// set value to change icon color
		.then(() => this.setState({value}))
	}
	render() {
		const {props, state} = this
		const classNames = cls(
			"UpvoteDownvote", // namespace
			props.className, // inherited className
		)
		// FIXME: UserId
		const decision = selectn('vote.value', props) || state.value
		return 	<div className={classNames}>
					<Icon
						name="thumbs-up"
						title={t('i_like_it')}
						hoverIcon='thumbs-o-up'
						className="UpvoteDownvote__upvote"
						color={decision && 'rgb(0, 151, 167)'}
						onClick={this.voteRequest.bind(this, true)}
					/>
					<Icon
						name="thumbs-down"
						hoverIcon='thumbs-o-down'
						className="UpvoteDownvote__downvote"
						onClick={this.voteRequest.bind(this, false)}
						title={t('dont_like_it_dont_show_again')} // FIXME: change i18n
						color={(decision === false || 0) && 'rgb(255, 64, 129)'}
					/>
				</div>
	}
}

export { UpvoteDownvote }
export default UpvoteDownvote