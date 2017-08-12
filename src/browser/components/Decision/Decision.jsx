import selectn from 'selectn'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { connect } from 'react-redux'
import Icon from 'browser/components/Icon'
import React, { PureComponent } from 'react'
import { translate as t } from 'browser/containers/Translator'
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
						title={t('i_like_it')}
						hoverIcon='thumbs-o-up'
						color={decisionVote ? 'rgb(0, 151, 167)' : undefined}
						onClick={vote.bind(this, true)} />
					<Icon
						title={t('skip')}
						onClick={nextVideo}
						name="step-forward" />
					<Icon
						title={t('dont_like_it_dont_show_again')}
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