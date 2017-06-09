import Pagination from 'react-ultimate-pagination-material-ui'
import { Card, CardMedia, CardTitle } from 'material-ui/Card'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'react-styled-flexboxgrid'
import { fetchMoods } from '../redux/actions/MoodActions'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import selectn from 'selectn'
import { translate } from '../containers/Translator'

@connect(
	// stateToProps
	(state, ownProps) => ({ ...ownProps }),
	// dispatchToProps
    (dispatch, ownProps) => ({
		changePage(page) {
			dispatch(fetchMoods(page))
		}
    })
)
class MoodsList extends Component {

	renderItems = () => {
		const { props } = this
		if(props.moods.size) {
			return props.moods.map( mood => {
					const nodeContent = mood.getIn(['Nodes', 0, 'contentId'])
					const src = nodeContent
								? `http://img.youtube.com/vi/${nodeContent}/0.jpg`
								: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/2000px-No_image_available.svg.png'
					return	<Col className="MoodsList__item" xs={12} sm={6} md={4} lg={3} key={mood.get('id')}>
								<Link to={`/mood/${mood.get('slug')}`}>
									<Card>
										<CardMedia overlay={<CardTitle title={mood.get('name')} />}>
											<img src={src} />
										</CardMedia>
									</Card>
								</Link>
							</Col>
			})
		}

		else return	<div className={(props.className || 'col s12 MoodsList')}> {/* TODO rework this for proper responsivness */}
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
		const { props } = this

		return  <section className="MoodsList">
					<Row>
						{this.renderItems()}
					</Row>
					<Row>
						<div style={{ margin: '0 auto' }}>
							{/*Created UltimatePagination component has the following interface:

								currentPage: number - current page number
								totalPages: number - total number of pages
								boundaryPagesRange: number, optional, default: 1 - number of always visible pages at the beginning and end
								siblingPagesRange: number, optional, default: 1 - number of always visible pages before and after the current one
								hideEllipsis: bool, optional, default: false - boolean flag to hide ellipsis
								hidePreviousAndNextPageLinks: bool, optional, default: false - boolean flag to hide previous and next page links
								hideFirstAndLastPageLink: bool, optional, default: false - boolean flag to hide first and last page links
								onChange: function - callback that will be called with new page when it should be changed by user interaction (optional)*/}
							{
								props.totalPages > 1
								? <Pagination
									onChange={props.changePage}
									currentPage={props.currentPage}
									totalPages={props.totalPages}
									hidePreviousAndNextPageLinks={true}
									hideFirstAndLastPageLink={true} />
								: null
							}
						</div>
					</Row>
				</section>
	}
}

MoodsList.propTypes = {
  moods: PropTypes.object.isRequired,
  totalPages: PropTypes.number,  
  currentPage: PropTypes.number,
}

MoodsList.defaultProps = {
	totalPages: 0,
	currentPage: 0,
}

export default MoodsList
