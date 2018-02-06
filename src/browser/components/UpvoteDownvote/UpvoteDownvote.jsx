import cls from 'classnames'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
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
	render() {
		const {props} = this
		const classNames = cls(
			"UpvoteDownvote", // namespace
			props.className, // inherited className
			"UpvoteDownvote__container" // container className
		)
		return 	<div className={classNames}>
					<Icon
						name="thumbs-up"
						title={t('i_like_it')}
						hoverIcon='thumbs-o-up'
						onClick={vote.bind(this, true)}
						color={decisionVote ? 'rgb(0, 151, 167)' : undefined}
					/>
				</div>
	}
}

UpvoteDownvote.PropTypes = {
	vote: PropTypes.func.isRequired,
	parentId: PropTypes.string.isRequired,
}

export { UpvoteDownvote }
export default connect(
	// stateToProps
	(state, ownProps) => ({ ...ownProps }),
	// dispatchToProps
    (dispatch, ownProps) => ({})
)(UpvoteDownvote)

// // TODO change name to 'controls'?
// export class Decision extends PureComponent {
// 	static propTypes = {
// 		decisionVote: PropTypes.number,
// 		vote: PropTypes.func.isRequired,
// 		nextVideo: PropTypes.func.isRequired,
// 	}
// 	render() {
// 		const { decisionVote, className, vote, nextVideo, ...rest } = this.props
// 		return 	<div className={'Decision ' + className}>
					// <Icon
					// 	name="thumbs-up"
					// 	title={t('i_like_it')}
					// 	hoverIcon='thumbs-o-up'
					// 	color={decisionVote ? 'rgb(0, 151, 167)' : undefined}
					// 	onClick={vote.bind(this, true)} />
					// <Icon
// 						title={t('skip')}
// 						onClick={nextVideo}
// 						name="step-forward" />
// 					<Icon
// 						title={t('dont_like_it_dont_show_again')}
// 						name="thumbs-down"
// 						hoverIcon='thumbs-o-down'
// 						color={decisionVote === false || 0 ? 'rgb(255, 64, 129)' : undefined}
// 						onClick={vote.bind(this, false)} />
// 				</div>
// 	}
// }

// export default connect(
// 	// state to props
// 	({ node }, ownProps) => {
// 		return {
// 			decisionVote: node.getIn(['Decision', 'vote']),
// 			...ownProps
// 		}
// 	},
// 	// dispatch to props
// 	(dispatch) => ({
// 		nextVideo() {
// 			dispatch(nextVideo())
// 		},
// 		vote(boolean) {
// 			dispatch(vote(boolean))
// 		}
//     })
// )(Decision)

// class Vote extends Component {
//   vote(value) { // , event
//       //event.preventDefault()
//       // gather data for method call
//       const data = { value, parent: this.props.parent }
//       // if user chooses same thing, means he wants to undo his choice
//       if (this.props.choice === value) data.choice = null
//       if (!Meteor.userId()) FlowRouter.go('/sign-in')
//       else Meteor.call('votes.choose', data,
// 			(err)=> { if (err) console.log(err) }
// 		)
//   }
//   render() {
// 	const { props } = this
//     const greenIcon = classNames('material-icons', {
//       'green-text accent-3': props.choice === true
//     })
//     const redIcon = classNames('material-icons', {
//       'deep-orange-text': props.choice === false
//     })
//     return (
//       <span {...props} className="right" style={{color: props.color, cursor: 'pointer'}}>
//         <span>
//           {props.likes}
//           <i onClick={this.vote.bind(this, true)}
//             className={greenIcon}>
//             thumb_up
//           </i>
//         </span>
//         <span>
//           <i onClick={this.vote.bind(this, false)}
//             className={redIcon}>
//             thumb_down
//           </i>
//           {props.dislikes}
//         </span>
//       </span>
//     )
//   }
// }
// Vote.defaultProps = {
//   color: 'white'
// }
// Vote.propTypes = {
//   likes: PropTypes.number.isRequired,
//   dislikes: PropTypes.number.isRequired,
//   choice: PropTypes.bool, // choice may be null so it s not required
//   color: PropTypes.string,
//   parent: PropTypes.string.isRequired // needed for Meteor.call
// }

// export default Vote
