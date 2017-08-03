import React, { Component } from 'react'
import selectn from 'selectn'
import PropTypes from 'prop-types'
import Link from 'react-router/lib/Link'
import { connect } from 'react-redux'
import { Grid, Row, Col } from 'react-styled-flexboxgrid'
import { translate } from 'browser/containers/Translator'
import { Card, CardMedia, CardTitle } from 'material-ui/Card'
import { insertNode } from 'browser/redux/actions/NodeActions'

@connect(
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
)
class YoutubeVideos extends Component {
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
		const { searchedVideos, MoodId, className, submitVideo } = this.props
		const videos = searchedVideos.toJS()
		if(videos.length) {
			return videos.map(video => {
					const { videoId } = video.id
					const { title } = video.snippet
					const titleStyle = {fontSize: '16px', lineHeight: 'inherit'}
					return	<Col className="YoutubeVideos__item" xs={12} sm={6} key={videoId}>
								<Card onClick={submitVideo.bind(this, videoId, MoodId)}>
									<CardMedia overlay={<CardTitle titleStyle={titleStyle} title={title} />}>
										<img src={`http://img.youtube.com/vi/${videoId}/0.jpg`} />
									</CardMedia>
								</Card>
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

export default YoutubeVideos
