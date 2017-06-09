import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'react-styled-flexboxgrid'
import { connect } from 'react-redux';
import Loading from '../components/Loading'
import NodesInsert from '../containers/NodesInsertContainer'
import Decision from '../components/Decision.jsx'
import Video from '../components/Video.jsx'
import NavBar from '../components/NavBar'
import { fetchMood, unloadMood } from '../redux/actions/MoodActions'
import { fetchNode, actions } from '../redux/actions/NodeActions'
import { toggleHeader } from '../redux/actions/GlobalActions'
import { RouteTransition } from 'react-router-transition';
import presets from 'react-router-transition/src/presets';
import { FormattedMessage } from 'react-intl';
import { translate } from 'browser/containers/Translator'

@connect(
	({ node, mood, global: { controlsAreShown } }, ownProps) => {
		return { mood, node, controlsAreShown, ...ownProps}
	}, // TODO rework "node" state because it is store in 'mood' now
	(dispatch, ownProps) => ({ // TODO remove this and use dispatch directly?
		fetchMood: (slug) => dispatch(fetchMood(slug)),
	    fetchNode: (slug) => dispatch(fetchNode(slug)),
	    unloadMood: () => dispatch(unloadMood()),
	    unloadNode: () => dispatch(actions.unloadNode()),
		toggleHeader: (boolean) => dispatch(toggleHeader(boolean))
    })
)
class MoodPage extends Component {

	componentWillMount() {
		this.props.toggleHeader(false)
		this.props.fetchMood(this.props.params.moodSlug)
		this.props.fetchNode(this.props.params.moodSlug)
	}

	componentWillUnmount() {
		this.props.unloadMood()
		this.props.unloadNode()		
		this.props.toggleHeader(true)		
	}

	render() {
		let dom;
		const { mood, node, location, params, controlsAreShown, toggleHeader, ...rest } = this.props

		if (process.env.BROWSER && (mood.loading || node.loading)) return <Loading />

		if (!node.contentId) {

			dom = 	<div className="MoodPage--empty">
						<NavBar className='NavBar--sticky' />
						{/* TODO remove h1 (use css instead) */}
						<h1 className="MoodPage__header">{translate("currently_zero_content_here")}</h1>
						<NodesInsert moodSlug={params.moodSlug} />
					</div>
		}
		else {
			dom =  <Video className='MoodPage__video' moodSlug={params.moodSlug}> {/* TODO rework passing of moodSlug */}
						<NavBar className='NavBar--sticky' />
						<Decision className='MoodPage__decision' />
						<NodesInsert moodSlug={params.moodSlug} />																	
					</Video>
		}

		return 	<div className="MoodPage">
					{/*<NavBar className='NavBar--sticky' />			*/}
					<RouteTransition {...presets.slideLeft} pathname={location.pathname} className="MoodPage">
						{dom}
					</RouteTransition>
				</div>
	}
}

MoodPage.propTypes = {
	mood: PropTypes.object,
	node: PropTypes.object,
	// fetchMood: PropTypes.func.isRequred,
	// fetchNode: PropTypes.func.isRequred,		
	// unloadMood: PropTypes.func.isRequred,		
	// unloadNode: PropTypes.func.isRequred,		
	// toggleHeader: PropTypes.func.isRequred,
}

export default MoodPage