import selectn from 'selectn'
import PropTypes from 'prop-types'
import isEmpty from 'lodash/isEmpty'
import { connect } from 'react-redux'
import store from 'browser/redux/store'
import Link from 'react-router/lib/Link'
import React, { Component } from 'react'
import Video from 'browser/components/Video'
import RaisedButton from 'material-ui/RaisedButton'
import { Grid, Row, Col } from 'react-styled-flexboxgrid'
import { translate } from 'browser/containers/Translator'
import { Card, CardMedia, CardTitle } from 'material-ui/Card'
import { insertNode } from 'browser/redux/actions/NodeActions'
import { parseJSON, checkStatus } from 'browser/redux/actions/actionHelpers'

class YoutubeVideos extends Component {

	state = {
		validating: false,
		duplicateVideos: [],
		error: translate('this_video_already_exists_please_no_duplicates'),
	}

	handleClick = videoId => {
		this.toggleValidating()
		return fetch(`/api/nodes/validate`
				+ `/${store.getState().mood.get('id')}`
				+ `/${videoId}`
			)
			.then(parseJSON)
			.then(node => {
				if (!isEmpty(node)) {
					this.state.duplicateVideos.push(videoId)
					this.toggleValidating()
				}
				else {
					this.toggleValidating()
					this.props.submitVideo(videoId, this.props.MoodId)
				}
			})

	}

	toggleValidating = () => {
		this.setState({validating: !this.state.validating})
	}
	/*
		In material-ui's Dialog only way to update height and position
		is to call 'resize' event
	*/
	componentWillUpdate() {
		if (process.env.BROWSER) {
			setTimeout(() => {
				window.dispatchEvent(new Event('resize'))
			}, 250)
		}
	}

	renderItems = () => {
		const { state, props } = this
		const { searchedVideos, MoodId, className, submitVideo } = this.props
		const videos = searchedVideos.toJS()
		if(videos.length) {
			return videos.map(video => {
					const { videoId } = video.id
					const { title } = video.snippet
					const titleStyle = {fontSize: '16px', lineHeight: 'inherit'}
					const isDuplicate = state.duplicateVideos.includes(videoId)
					return	<Col className="YoutubeVideos__item" xs={12} sm={6} key={videoId}>
								<center>
									<RaisedButton
										primary={true}
										label={translate('add_this_video')}
										className="YoutubeVideos__add-button"
										disabled={state.validating || isDuplicate}
										onClick={this.handleClick.bind(this, videoId)}
									/>
								</center>
								<Video
									width="100%"
									height="350px"
									autoPlay={false}
									contentId={videoId}
								/>
								{
									isDuplicate
									? <h1>{state.error}</h1>
									: null
								}

								{/* <Card onClick={submitVideo.bind(this, videoId, MoodId)}>
									<CardMedia overlay={<CardTitle titleStyle={titleStyle} title={title} />}>
										<img src={`http://img.youtube.com/vi/${videoId}/0.jpg`} />
									</CardMedia>
								</Card> */}
							</Col>
			})
		}
		else return	<div className={(className || 'col s12 YoutubeVideos')}> {/* TODO rework this for proper responsivness */}
						<ul className="collection">
							<li className="collection-item center-align">
								<b>
									<i>{translate('list_is_empty')}...</i>
								</b>
							</li>
						</ul>
					</div>
	}

	render() {
		if (!this.props.searchedVideos.size) return null
		return  <Row className="YoutubeVideos">
					{this.renderItems()}
				</Row>
	}
}

// TODO add propTypes
// YoutubeVideos.propTypes = {
//   videos: PropTypes.object.isRequired,
//   totalPages: PropTypes.number,
//   currentPage: PropTypes.number,
// }

// YoutubeVideos.defaultProps = {
// 	totalPages: 0,
// 	currentPage: 0,
// }

export { YoutubeVideos }

export default
connect(
	// stateToProps
	(state, ownProps) => {
		const MoodId = state.mood.get('id')
		const searchedVideos = state.node.get('searchedVideos')
		return {searchedVideos, MoodId, ...ownProps}
	},
	// dispatchToProps
    (dispatch, ownProps) => ({
		submitVideo(contentId, MoodId) {
			const payload = {
								MoodId,
								contentId,
								type: 'video',
								provider: 'youtube',
							}
			dispatch(insertNode(payload))
		}
    })
)(YoutubeVideos)
