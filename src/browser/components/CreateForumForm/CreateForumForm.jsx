import cls from 'classnames'
import get from 'lodash/get'
import gql from "graphql-tag"
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import store from 'browser/redux/store'
import Dialog from 'material-ui/Dialog'
import { stringify } from 'query-string'
import React, { Component } from 'react'
import FlatButton from 'material-ui/FlatButton'
import { TextField } from 'redux-form-material-ui'
import { Form, Field, reduxForm } from 'redux-form'
import RaisedButton from 'material-ui/RaisedButton'
import { query as forumsQuery } from '../ForumsList'
import { translate } from 'browser/containers/Translator'
import { Grid, Row, Col } from 'react-styled-flexboxgrid'
import ContentAdd from 'material-ui/svg-icons/content/add'
import browserHistory from 'react-router/lib/browserHistory'
import { actions } from 'browser/redux/actions/GlobalActions'
import { parseJSON } from'browser/redux/actions/actionHelpers'
import { insertForum } from 'browser/redux/forum/ForumActions'
import { Mutation, MutationFunc, graphql } from "react-apollo"
import FloatingActionButton from 'material-ui/FloatingActionButton'

const createForum = gql`
  mutation createForum($name: String!) {
    forum: createForum(name: $name) {
      id
      name
	  UserId
	  slug
    }
  }
`;

const getCurrentUser = gql`
  query getCurrentUser {
	  viewer {
		  id
	  }
  }
`

@graphql(getCurrentUser)
@reduxForm({
	form: 'CreateForumForm',
	validate(values) {
		let errors = {}
		const user = store.getState().user.get('id')

		if (!user) errors.name = translate('please_login')
		if (!values.name) errors.name = translate('name_cant_be_empty')
		// if (!values.text) errors.text = translate('cant_be_empty')

		return errors
	},
	onSubmit(values, dispatch, props) {
		// 		function insertSucces(slug) {
		// 			ownProps.reset()
		// 			browserHistory.push('/mood/' + slug);
		// 		}
		//         // dispatch(insertForum(values, insertSucces))
	}
})
export class CreateForumForm extends Component {

	handleSubmit = variables => {
		this.props
		.createForum({ variables })
		.then(() => this.props.reset())

	}

	render() {
		// Hide component if user is not admin.
		if (get(this, 'props.data.viewer.id') != process.env.ADMIN_ID) return null
		const { props } = this
		const { insertForum, handleSubmit, asyncValidating } = props
		const classNames = cls(props.className, "CreateForumForm")
		const isDisabled = asyncValidating == 'name' || props.submitting
		console.log('data', props.data);
		console.log('errors', props.errors)
		console.log('error', props.error)
		console.log('loading', props.loading);
		return <Row className={classNames}>
			<Col xs={12}>
				<form onSubmit={handleSubmit(this.handleSubmit)}>
					<Field
						fullWidth
						name="name"
						component={TextField}
						hidden={asyncValidating}
						hintText={translate("add_something")}
					/>
					{/* <Field
						rows={2}
						fullWidth
						name="text"
						multiLine={true}
						component={TextField}
						hidden={asyncValidating}
						hintText={translate("description")}
					/> */}
					<center>
						<RaisedButton
							type="submit"
							primary={true}
							disabled={!props.valid}
							label={translate('submit')} />
					</center>
				</form>
			</Col>
		</Row>
	}
}

CreateForumForm.propTypes = {
	UserId: PropTypes.number,
}

// TODO reorganize this for better testing
const form = reduxForm({
	form: 'CreateForumForm',
	validate(values) {
		let errors = {}
		const user = store.getState().user.get('id')

		if (!user) errors.name = translate('please_login')
		if (!values.name) errors.name = translate('name_cant_be_empty')
		// if (!values.text) errors.text = translate('cant_be_empty')

		return errors
	},
	onSubmit(values, dispatch, props) {
	// 		function insertSucces(slug) {
	// 			ownProps.reset()
	// 			browserHistory.push('/mood/' + slug);
	// 		}
    //         // dispatch(insertForum(values, insertSucces))
	}
})
// (CreateForumForm)
// (connect(
// 	(state, ownProps) => ({
// 		...ownProps,
// 		UserId: state.user.get('id'),
// 	}),
//     (dispatch, ownProps) => ({
//         insertForum(values) {
// 			console.log('ownProps: ', ownProps);
// 			console.log('insertForum')
// 			// values.parentId = ownProps.parentId

// 			// function insertSucces(forum) {
// 			// 	ownProps.reset()
// 			// 	// browserHistory.push('/forum/' + forum.slug);
// 			// }
//             // // dispatch(toggleDialog())
//             // dispatch(insertForum(values, insertSucces))
// 		}
//     })
// )(CreateForumForm))
// console.log('form: ', new form());

// Update apollo cache to push
// created forum into "forums" array.
function update(cache, { data: { forum } }) {
	const { forums } = cache.readQuery({ query: forumsQuery })
	cache.writeQuery({
		query: forumsQuery,
		data: { forums: forums.concat([forum]) }
	});
}

const mutation = props => <Mutation mutation={createForum} update={update}>
	{(createForum, response) => (<CreateForumForm {...props} {...response} createForum={createForum}/>)}
</Mutation>

export default mutation
