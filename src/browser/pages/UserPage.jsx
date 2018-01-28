import PropTypes from 'prop-types'
import { injectProps } from 'relpers'
import { connect } from 'react-redux'
import { injectIntl } from 'react-intl'
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

@injectIntl
export class UserPage extends Component {
    render() {
		const { props } = this
		const {moods, loading, image, UserId, displayName, intl} = this.props
		const src = image || `https://api.adorable.io/avatars/300/${UserId}.png`
		const imageText = intl.formatMessage(
			{id: 'image_of_user_username'},
			{username: displayName},
		)
		const title = intl.formatMessage(
			{id: 'user_on_APP_NAME'},
			{username: displayName},
		)

		return 	<PageWrapper
					image={src}
					title={title}
					loading={loading}
					className='UserPage'
				>
					<Row center="xs">
						<Col xs={12}>
							<h2 className="UserPage__username">
								{props.displayName}
							</h2>
						</Col>
					</Row>
					<Row center="xs">
						<Col xs={12} className="UserPage__avatar">
							<Avatar
								src={src}
								size={300}
								alt={imageText}
								title={imageText}
							/>
						</Col>
					</Row>
					<Row>
						<Col xs={12}>
							{props.isOwnPage ? <ChangeLanguageForm /> : null}
						</Col>
					</Row>
					{/* <Row>
						<Col xs={12}>
							<center><h3>{t('created_moods')}</h3></center>
						</Col>
					</Row>
					<MoodsList moods={moods} /> */}
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