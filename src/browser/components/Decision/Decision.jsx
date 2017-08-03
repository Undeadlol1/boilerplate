import selectn from 'selectn'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { connect } from 'react-redux'
import React, { PureComponent } from 'react'
import Icon from 'browser/components/Icon'
import { vote, fetchNode, nextVideo } from 'browser/redux/actions/NodeActions'

// TODO change name to 'controls'?
export class Decision extends PureComponent {
	static propTypes = {
		decisionVote: PropTypes.number,
		vote: PropTypes.func.isRequired,
		nextVideo: PropTypes.func.isRequired,
	}
	render() {
		const { decisionVote, className, vote, nextVideo, ...rest } = this.props
		return 	<div className={'Decision ' + className}>
					<Icon
						name="thumbs-up"
						hoverIcon='thumbs-o-up'
						color={decisionVote ? 'rgb(0, 151, 167)' : undefined}
						onClick={vote.bind(this, true)} />
					<Icon
						onClick={nextVideo}
						name="step-forward" />
					<Icon
						name="thumbs-down"
						hoverIcon='thumbs-o-down'
						color={decisionVote === false || 0 ? 'rgb(255, 64, 129)' : undefined}
						onClick={vote.bind(this, false)} />
				</div>
	}
}

export default connect(
	// state to props
	({ node }, ownProps) => {
		console.log('decision', node.get('Decision').toJS());
		return {
			decisionVote: node.getIn(['Decision', 'vote']),
			...ownProps
		}
	},
	// dispatch to props
	(dispatch) => ({
		nextVideo() {
			dispatch(nextVideo())
		},
		vote(boolean) {
			dispatch(vote(boolean))
		}
    })
)(Decision)