import selectn from 'selectn'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import React, { Component } from 'react'
import Video from 'browser/components/Video'
import NavBar from 'browser/components/NavBar'
import Loading from 'browser/components/Loading'
import Decision from 'browser/components/Decision'
import PageWrapper from 'browser/components/PageWrapper'
import ShareButton from 'browser/components/ShareButton'
import { Grid, Row, Col } from 'react-styled-flexboxgrid'
import YoutubeSearch from 'browser/components/YoutubeSearch'
import { translate as t } from 'browser/containers/Translator'
import { parseJSON } from 'browser/redux/actions/actionHelpers'
import NodesInsert from 'browser/containers/NodesInsertContainer'
import { actions as nodeActions } from 'browser/redux/actions/NodeActions'
import { recieveMood, unloadMood } from 'browser/redux/actions/MoodActions'
import { actions as globalActions } from 'browser/redux/actions/GlobalActions'

export class MoodPage extends Component {

	componentWillMount() {
		this.props.toggleHeader(false)
	}

	componentWillUnmount() {
		this.props.unloadMood()
		this.props.unloadNode()
		this.props.toggleHeader(true)
	}

	render() {
		const { props } = this
		const { dialogIsOpen, contentNotFound, isLoading, params, ...rest } = this.props
		const moodName = selectn('moodName', props)
		const title = moodName && 'Мое настроение: ' + moodName
		const contentId = selectn('videoId', props)
		const image = contentId && `http://img.youtube.com/vi/${contentId}/hqdefault.jpg`
		// TODO https://stackoverflow.com/a/42956044/4380989 might get you better preview images
		return 	<PageWrapper
					loading={isLoading}
					className="MoodPage"
					title={title}
					image={image}
				>
					{/* TODO remove h1 (use css instead) */}
					{
						!dialogIsOpen
						&& contentNotFound
						&& <h1 className="MoodPage__header">{t("currently_zero_content_here")}</h1>
					}
					{
						!dialogIsOpen
						?	<Video className='MoodPage__video'>
								<NavBar className='NavBar--sticky' />
								{!contentNotFound && <Decision className='MoodPage__decision' />}
								<ShareButton />
							</Video>
						: null
					}
					{
						dialogIsOpen
						?	<div>
								<NavBar className='NavBar--sticky' />
								<Grid fluid>
									<YoutubeSearch />
								</Grid>
							</div>
						: null
					}
					<NodesInsert open={dialogIsOpen} moodSlug={params.moodSlug} /> {/* TODO rework passing of moodSlug */}
				</PageWrapper>
	}
}

MoodPage.propTypes = {
	videoId: PropTypes.string,
	moodName: PropTypes.string,
	contentNotFound: PropTypes.bool,
	isLoading: PropTypes.bool.isRequired,
	params: PropTypes.object.isRequired,
	unloadMood: PropTypes.func.isRequired,
	unloadNode: PropTypes.func.isRequired,
	toggleHeader: PropTypes.func.isRequired,
}

export const stateToProps = ({ node, mood }, ownProps) => {
	return {
		moodName: mood.get('name'),
		videoId: node.get('contentId'),
		contentNotFound: node.get('contentNotFound'),
		isLoading: mood.get('loading') || !node.get('finishedLoading'),
		dialogIsOpen: node.get('dialogIsOpen'),
		...ownProps
	}
}

export const dispatchToProps = dispatch => ({
	unloadMood: () => dispatch(unloadMood()),
	unloadNode: () => dispatch(nodeActions.unloadNode()),
	toggleHeader: (boolean) => dispatch(globalActions.toggleHeader(boolean))
})

export default (connect(stateToProps, dispatchToProps)(MoodPage))