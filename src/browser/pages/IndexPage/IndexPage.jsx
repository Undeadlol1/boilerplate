// dependencies
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import React, { Component } from 'react'
// project files
import { t } from 'browser/containers/Translator'
import ForumsList from 'browser/components/ForumsList'
import PageWrapper from 'browser/components/PageWrapper'
import WelcomeCard from 'browser/components/WelcomeCard'
import ThreadsList from 'browser/components/ThreadsList'
import CreateForumForm from 'browser/components/CreateForumForm'

class IndexPage extends Component {
    render() {
		const { props } = this
		return 	<PageWrapper className='IndexPage'>
					<WelcomeCard />
					<b>{t('forums_list')}:</b>
					<ForumsList />
					<CreateForumForm />
				</PageWrapper>
    }
}

IndexPage.propTypes = {}

export { IndexPage }

export default
connect(
	(state, ownProps) => ({...ownProps})
)(IndexPage)