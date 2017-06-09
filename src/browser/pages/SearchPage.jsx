import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Loading from '../components/Loading'
import MoodsList from '../components/MoodsList'
import MoodsFind from '../components/MoodsFind'
import { Grid } from 'react-styled-flexboxgrid';
import { injectProps } from 'relpers'
import { connect } from 'react-redux';
import { fetchMoods } from '../redux/actions/MoodActions'
import { RouteTransition } from 'react-router-transition';
import presets from 'react-router-transition/src/presets';

@connect(
	({ global, mood }) => {
		const 	{ moods, loading } = mood
		const searchedMoods = mood.get('searchedMoods')
		return 	{
			loading: mood.get('loading'),
			totalPages: searchedMoods.get('totalPages'), // TODO rework this?
			currentPage: searchedMoods.get('currentPage'), // TODO rework this? 
			moods: searchedMoods.get('moods'),
		}
	},
	dispatch => ({
		fetchMoods() {dispatch(fetchMoods())}
	})
)
export default class SearchPage extends Component {

	static propTypes = {
		moods: PropTypes.object,
		loading: PropTypes.bool
	}

	componentWillMount() { this.props.fetchMoods() }

    @injectProps
    render({loading, moods, currentPage, totalPages, location}) {
        return 	loading
                ?   <Loading />
                :	<RouteTransition
						pathname={location.pathname}
						{...presets.pop}
					>
						<Grid className="SearchPage">
	        				<MoodsFind />
							<MoodsList moods={moods} currentPage={currentPage} totalPages={totalPages} />
	        	    	</Grid>
					</RouteTransition>
    }
}
