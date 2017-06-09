import { connect } from 'react-redux'
import React, { Component } from 'react'
import { TextField } from 'redux-form-material-ui'
import { Form, Field, reduxForm } from 'redux-form'
import YoutubeVideos from 'browser/components/YoutubeVideos'
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
	validate(values, second) {
		// TODO this 😎
		// let errors = {}
        // const user = store.getState().user.get('id')
		// if (!user) errors.url = translate('please_login')
        // if (!url) errors.url = translate('url_cant_be_empty')
        // else if (url && !isUrl(url)) errors.url = translate('something_wrong_with_this_url')
		// return errors
	}
})
export default class YoutubeSearch extends Component {
	render() {
		const { handleSubmit, onSubmit, submitting } = this.props
		return 	<Form onSubmit={handleSubmit(onSubmit)} className="YoutubeSearch">
					<Field
						fullWidth
						name="query"
						disabled={submitting}
						component={TextField}
						hintText={'Or search for video'} />
					{/* hack to submit on 'enter' */}
					<button type="submit" hidden={true}>Submit</button>
					<YoutubeVideos />
				</Form>
	}
}
