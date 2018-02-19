// dependencies
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import React, { PureComponent } from 'react'
import { Grid, Row } from 'react-styled-flexboxgrid'
// project files
import store from 'browser/redux/store'
import Wysiwyg from 'browser/components/Wysiwyg'
import { t } from 'browser/containers/Translator'
import MoodsFind from 'browser/components/MoodsFind'
import MoodsList from 'browser/components/MoodsList'
import ForumsList from 'browser/components/ForumsList'
import PageWrapper from 'browser/components/PageWrapper'
import WelcomeCard from 'browser/components/WelcomeCard'
import ThreadsList from 'browser/components/ThreadsList'
import CreateForumForm from 'browser/components/CreateForumForm'

class IndexPage extends PureComponent {
    render() {
		const { props } = this
		return 	<PageWrapper
					className='IndexPage'
					loading={props.loading}
				>
					<WelcomeCard />
					<b>{t('forums_list')}:</b>
					<ForumsList />
					<CreateForumForm />
				</PageWrapper>
    }
}

IndexPage.propTypes = {
	moods: PropTypes.object,
	totalPages: PropTypes.number,
	currentPage: PropTypes.number,
	loading: PropTypes.bool.isRequired,
	location: PropTypes.object.isRequired,
}

export { IndexPage }

export default
connect(
	({mood}) => ({
		moods: mood.get('moods'),
		loading: mood.get('loading'),
		totalPages: mood.get('totalPages'),
		currentPage: mood.get('currentPage'),
	}),
)(IndexPage)