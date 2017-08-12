import React, { Component } from 'react'
import clx from 'classnames'
import PropTypes from 'prop-types'
import YouTube from 'react-youtube'
import { connect } from 'react-redux'
import { fetchNode, nextVideo } from 'browser/redux/actions/NodeActions'
import { actions } from 'browser/redux/actions/GlobalActions'

class Video extends Component {
	// to avoid long loading of iframe on mobile devices
	// we hide them till they are ready
	// TODO move this to redux
	state = { playerLoaded: false }

	timeout = null

	watchMouseMove = () => {
		clearTimeout(this.timeout)
		this.timeout = setTimeout(() => {
			this.props.closeControls()
		}, 3000)
	}

	onReady = event => {
		// TODO this is what can help
		{/*https://android.stackexchange.com/a/109715*/}
		if(process.env.SERVER) return
		// this.setState({playerLoaded: true})
		// auto play does not work on IOS and Android
		// https://developers.google.com/youtube/iframe_api_reference#Events
		var embedCode = event.target.getVideoEmbedCode();
		if(this.props.autoPlay) event.target.playVideo();
		if (document.getElementById('embed-code')) {
			document.getElementById('embed-code').innerHTML = embedCode;
		}
		// on android iframe after playVideo() loads <video> tag
		// window.getElementsByTagName("video")[0].play()
	}

	onChange = ({target, data}) => {
		if(data == 0) target.playVideo()
	}

	render() {
		const 	{controlsAreShown, nextVideo, contentId, nodes, className, ...rest} = this.props,
				{props, state} = this,
				opts = {
					width: props.width,
					height: props.height,
					// https://developers.google.com/youtube/player_parameters
					playerVars: {
						fs: 0, // hide fullscreen button
						rel: 0,
						controls: 1,
						autoplay: props.autoPlay ? 1 : 0,
						playlist: [nodes.map(node => node.contentId)]
					}
				}

		return 	<section
					// && !state.playerLoaded
					hidden={props.loading}
					className={clx("Video", className)}
					// TODO add comments about iframe!!!
					onMouseMove={this.watchMouseMove}
					onMouseLeave={props.closeControls}
					onMouseOver={props.openControls}
				>
					{contentId && <YouTube
						opts={opts}
						videoId={contentId}
						onEnd={nextVideo} // TODO add rating?
						onError={nextVideo}
						// TODO move this to redux
						onStateChange={this.onChange}
						onReady={this.onReady}
						/>}
					<div
						hidden={controlsAreShown}
						className="Video__controls"
						style={{
							// this prevents controls to be shown while InsertNode modal is open
							pointerEvents: controlsAreShown ? "auto" : "none"
						}}
					>
						<div hidden={!controlsAreShown}>{props.children}</div>
					</div>
				</section>
	}
}

Video.defaultProps = {
	width: '100%',
	height: '100%',
	autoPlay: true,
}

Video.propTypes = {
	width: PropTypes.string,
	height: PropTypes.string,
	autoPlay: PropTypes.bool,
	nodes: PropTypes.array,
	loading: PropTypes.bool,
	contentId: PropTypes.string,
	controlsAreShown: PropTypes.bool,
	// functions
	nextVideo: PropTypes.func,
	openControls: PropTypes.func,
	closeControls: PropTypes.func,
}

export { Video }

export default connect(
	({node, global}, ownProps) => {
		return ({
			nodes: node.get('nodes').toJS(),
			loading: node.get('loading'),
			contentId: node.get('contentId'),
			controlsAreShown: global.get('controlsAreShown'),
			...ownProps,
		})
	},
	(dispatch, ownProps) => ({
		nextVideo() {
			dispatch(nextVideo())
		},
		openControls() {
			dispatch(actions.toggleControls(true))
		},
		closeControls() {
			dispatch(actions.toggleControls(false))
		}
    })
)(Video)