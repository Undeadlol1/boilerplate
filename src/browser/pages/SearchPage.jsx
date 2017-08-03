import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Loading from '../components/Loading'
import MoodsList from '../components/MoodsList'
import MoodsFind from '../components/MoodsFind'
import { Grid } from 'react-styled-flexboxgrid';
import { injectProps } from 'relpers'
import { connect } from 'react-redux';
import { fetchMoods } from '../redux/actions/MoodActions'
import PageWrapper from 'browser/components/PageWrapper'

export class SearchPage extends Component {
	componentWillMount() { this.props.fetchMoods() }
    @injectProps
    render({loading, moods, currentPage, totalPages, location}) {
		return 	<PageWrapper className="SearchPage">
					<Grid fluid>
						<Loading condition={loading}>
							<MoodsFind />
							<MoodsList moods={moods} currentPage={currentPage} totalPages={totalPages} />
						</Loading>
					</Grid>
				</PageWrapper>
    }
}

SearchPage.propTypes = {
	moods: PropTypes.object,
	totalPages: PropTypes.number,
	currentPage: PropTypes.number,
	loading: PropTypes.bool.isRequired,
	fetchMoods: PropTypes.func.isRequired,
}

export default
connect(
	({ mood }) => {
		const searchedMoods = mood.get('searchedMoods')
		return 	{
			moods: searchedMoods.get('moods'),
			totalPages: searchedMoods.get('totalPages'),
			currentPage: searchedMoods.get('currentPage'),
			loading: process.env.BROWSER && mood.get('loading'),
		}
	},
	dispatch => ({
		fetchMoods() {dispatch(fetchMoods())}
	})
)(SearchPage)