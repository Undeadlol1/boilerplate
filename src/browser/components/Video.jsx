import React, { Component } from 'react'
import YouTube from 'react-youtube'
import { connect } from 'react-redux'
import { fetchNode } from 'browser/redux/actions/NodeActions'
import { toggleControls, openControls, closeControls } from 'browser/redux/actions/GlobalActions'

@connect(
	({node, global}, ownProps) => {
		const {contentId} = node,
			  {controlsAreShown} = global
		return ({contentId, controlsAreShown, ...ownProps})
	},
	(dispatch, ownProps) => ({
		openControls() {
			dispatch(openControls())
		},
		closeControls() {
			dispatch(closeControls())
		},
		// TODO remove this? 💀
		toggleControls(boolean) {
			dispatch(toggleControls(boolean))
		},
		requestNewVideo(params) {
			dispatch(fetchNode(ownProps.moodSlug))
		}
    })
)
export default class Video extends Component {
	timeout = null
	watchMouseMove = () => {
		clearTimeout(this.timeout)
		this.timeout = setTimeout(() => {
			this.props.closeControls()
		}, 3000)
	}

	render() {
		const 	{controlsAreShown, requestNewVideo, className, ...rest} = this.props,
				{props, state} = this,
				opts = {
					height: '100%',
					width: '100%',
					// https://developers.google.com/youtube/player_parameters
					playerVars: {autoplay: 1, controls: 1}
				}

		return 	<section
					className={"Video " + className}
					// TODO add comments about iframe!!!
					onMouseMove={this.watchMouseMove}
					onMouseLeave={props.closeControls}
					onMouseOver={props.openControls}
				>
					<YouTube
						opts={opts}
						videoId={props.contentId}
						onEnd={requestNewVideo} // TODO add rating?
						onError={requestNewVideo}
						/>
					<div
						hidden={controlsAreShown}
						className="Video__controls"
					>
						<div hidden={!controlsAreShown}>{props.children}</div>
					</div>
				</section>
	}
}
