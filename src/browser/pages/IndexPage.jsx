// dependencies
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Grid } from 'react-styled-flexboxgrid';
import { injectProps } from 'relpers'
import { connect } from 'react-redux'
import { RouteTransition } from 'react-router-transition'
import presets from 'react-router-transition/src/presets'
// project files
import { fetchMoods } from 'browser/redux/actions/MoodActions'
import Loading from 'browser/components/Loading'
import MoodsFind from 'browser/components/MoodsFind'
import MoodsList from 'browser/components/MoodsList'
import MoodsInsert from 'browser/components/MoodsInsert'
import YoutubeSearch from 'browser/components/YoutubeSearch'

@connect(
	({ global, mood }) => ({
		moods: mood.get('moods'),
		loading: mood.get('loading'),
		totalPages: mood.get('totalPages'), // TODO rework this?
		currentPage: mood.get('currentPage'), // TODO rework this?
	}),
	dispatch => ({
		fetchMoods() {dispatch(fetchMoods())}
	})
)
export default class IndexPage extends Component {

	static propTypes = {
		moods: PropTypes.object,
		loading: PropTypes.bool
	}

	componentWillMount() { this.props.fetchMoods() }

    @injectProps
    render({loading, moods, currentPage, totalPages, dispatch, location}) {
		return  <RouteTransition				
						pathname={location.pathname}
						{...presets.pop}
					>
					<Grid className="IndexPage">
						<MoodsInsert />						
						{
							process.env.BROWSER && loading
							? <Loading />
							: <div>
								<MoodsList moods={moods} currentPage={currentPage} totalPages={totalPages} />
							 </div> 
						}
					</Grid>						
				</RouteTransition>
    }
}
