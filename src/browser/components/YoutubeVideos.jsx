import React, { Component } from 'react'
import selectn from 'selectn'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { Row, Col } from 'react-styled-flexboxgrid'
import { translate } from 'browser/containers/Translator'
import { Card, CardMedia, CardTitle } from 'material-ui/Card'
import { insertNode } from 'browser/redux/actions/NodeActions'

@connect(
	// stateToProps
	(state, ownProps) => {
		const {searchedVideos} = state.node
		const MoodId = state.mood.get('id')
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
	renderItems = () => {
		const { searchedVideos, MoodId, className, submitVideo } = this.props
		if(searchedVideos) {
			return searchedVideos.map( video => {
					const { videoId } = video.id
					const { title } = video.snippet
					return	<Col className="YoutubeVideos__item" xs={12} sm={6} md={4} lg={3} key={videoId}>
								<Card onClick={submitVideo.bind(this, videoId, MoodId)}>
									<CardMedia overlay={<CardTitle title={title} />}>
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
		return  <section className="YoutubeVideos">
					<Row>
						{this.renderItems()}
					</Row>
				</section>
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
