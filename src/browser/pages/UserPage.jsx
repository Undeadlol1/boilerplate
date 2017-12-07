import PropTypes from 'prop-types'
import { injectProps } from 'relpers'
import { connect } from 'react-redux'
import Avatar from 'material-ui/Avatar'
import React, { Component } from 'react'
import Loading from 'browser/components/Loading'
import MoodsList from 'browser/components/MoodsList'
import MoodsFind from 'browser/components/MoodsFind'
import MoodsInsert from 'browser/components/MoodsInsert'
import PageWrapper from 'browser/components/PageWrapper'
import { Grid, Row, Col } from 'react-styled-flexboxgrid'
import { translate } from 'browser/containers/Translator'
import YoutubeSearch from 'browser/components/YoutubeSearch'
import { translate as t } from 'browser/containers/Translator'
import ChangeLanguageForm from 'browser/components/ChangeLanguageForm'

export class UserPage extends Component {
	@injectProps
    render({moods, loading, image, location, UserId, displayName, isOwnPage}) {
		const src = `https://api.adorable.io/avatars/300/${UserId}.png`
		const imageText = displayName + translate('things_image')
		return 	<PageWrapper
					preset={'pop'}
					loading={loading}
					location={location}
					className='UserPage'
				>
					<Grid fluid>
						<Row center="xs">
							<Col xs={12}>
								<h2 className="UserPage__username">{displayName}</h2>
							</Col>
						</Row>
						<Row center="xs">
							<Col xs={12} className="UserPage__avatar">
								<Avatar
									size={300}
									title={imageText}
									src={image || src}
									alt={displayName + translate('things_image')}
								/>
							</Col>
						</Row>
						<Row>
							<Col xs={12}>
								{isOwnPage ? <ChangeLanguageForm /> : null}
							</Col>
						</Row>
						{/* <Row>
							<Col xs={12}>
								<center><h3>{t('created_moods')}</h3></center>
							</Col>
						</Row>
						<MoodsList moods={moods} /> */}
					</Grid>
				</PageWrapper>
    }
}

UserPage.propTypes = {
	image: PropTypes.string,
	displayName: PropTypes.string,
	loading: PropTypes.bool.isRequired,
	isOwnPage: PropTypes.bool.isRequired,
}

export default connect(
	({user}, {params}) => {
		const UserId = user.getIn(['fetchedUser', 'id'])
		const fetchedUser = user.get('fetchedUser')
		return {
			UserId,
			loading: user.get('loading'),
			image: fetchedUser.get('image'),
			isOwnPage: user.get('id') == UserId,
			moods: user.getIn(['fetchedUser', 'moods']),
			displayName: user.getIn(['fetchedUser', 'displayName']),
		}
	},
)(UserPage)