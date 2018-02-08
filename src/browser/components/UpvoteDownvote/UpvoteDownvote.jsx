import cls from 'classnames'
import selectn from 'selectn'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
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
	// make vote an object to avoid doing "vote && vote.value"
	static defaultProps = { vote: {} }
	static propTypes = {
		vote: PropTypes.objec, // fetched document from api
		UserId: PropTypes.number, // data to determine if icon should be colored
		parentId: PropTypes.string.isRequired, // this will become vote.parentId
	}
	// state is used to set vote value after request to votes API
	state = { value: undefined }
	/**
	 * make upsert request to votes api
	 * @param {boolean} value vote.value to upsert
	 */
	voteRequest(value) {
		const { parentId } = this.props
		return fetch(
			'/api/votes',
			headersAndBody({value, parentId})
		)
		// if error occurs this function will activate toast with error message
		// NOTE: function does not return, '.then' will run anyway
		.then(checkStatus)
		// set value to change icon color
		.then(({status}) => {
			if (status == 200) this.setState({value})
		})
	}
	render() {
		const {props, state} = this
		const { vote } = props
		const classNames = cls(
			"UpvoteDownvote", // namespace
			props.className, // inherited className
		)
		const isMine = vote.UserId == props.UserId
		const voteValue = vote.value || state.value
		return 	<div className={classNames}>
					<Icon
						name="thumbs-up"
						title={t('i_like_it')}
						hoverIcon='thumbs-o-up'
						className="UpvoteDownvote__upvote"
						onClick={this.voteRequest.bind(this, true)}
						color={isMine && voteValue && 'rgb(0, 151, 167)'}
					/>
					{vote.upvotes}
					<Icon
						name="thumbs-down"
						hoverIcon='thumbs-o-down'
						className="UpvoteDownvote__downvote"
						onClick={this.voteRequest.bind(this, false)}
						title={t('dont_like_it_dont_show_again')} // FIXME: change i18n
						color={isMine && (voteValue === false || 0) && 'rgb(255, 64, 129)'}
					/>
					{vote.downvotes}
				</div>
	}
}

export { UpvoteDownvote }
export default connect(
	(state, ownProps) => ({
		...ownProps,
		UserId: state.user.get('id')
	})
)(UpvoteDownvote)