import { connect } from 'react-redux'
import store from 'browser/redux/store'
import React, { Component } from 'react'
import { TextField } from 'redux-form-material-ui'
import { Form, Field, reduxForm } from 'redux-form'
import { Grid, Row, Col } from 'react-styled-flexboxgrid'
import YoutubeVideos from 'browser/components/YoutubeVideos'
import { translate as t } from 'browser/containers/Translator'
import { youtubeSearch } from 'browser/redux/actions/NodeActions'
import LoginLogoutButton from 'browser/components/LoginLogoutButton'

@connect(
	(state, ownProps) => ({ ...ownProps }),
    (dispatch, ownProps) => ({
		onSubmit({query}) {
			dispatch(youtubeSearch(query))
		}
    })
)
@reduxForm({
	form: 'YoutubeSearch',
	validate({query}) {
		let errors = {}
        const user = store.getState().user.get('id')
		if (!user) errors.query = t('please_login')
        if (!query) errors.query = t('name_cant_be_empty')
		return errors
	}
})
export default class YoutubeSearch extends Component {
	render() {
		const { handleSubmit, onSubmit, submitting } = this.props
		return 	<div>
					<Row>
						<Col xs={12}>
							<Form onSubmit={handleSubmit(onSubmit)} className="YoutubeSearch">
								<Field
									fullWidth
									autoFocus
									name="query"
									disabled={submitting}
									component={TextField}
									hintText={t('search_for_video')} />
								{/* hack to submit on 'enter' */}
								<button type="submit" hidden={true}>Submit</button>
							</Form>
						</Col>
					</Row>
					<YoutubeVideos />
				</div>
	}
}
