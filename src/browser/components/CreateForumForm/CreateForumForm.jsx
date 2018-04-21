import cls from 'classnames'
import get from 'lodash/get'
import gql from 'graphql-tag'
import PropTypes from 'prop-types'
import { compose } from 'recompose'
import { connect } from 'react-redux'
import store from 'browser/redux/store'
import Dialog from 'material-ui/Dialog'
import React, { Component } from 'react'
import FlatButton from 'material-ui/FlatButton'
import { TextField } from 'redux-form-material-ui'
import { Form, Field, reduxForm } from 'redux-form'
import RaisedButton from 'material-ui/RaisedButton'
import { query as forumsQuery } from '../ForumsList'
import { translate } from 'browser/containers/Translator'
import { Grid, Row, Col } from 'react-styled-flexboxgrid'
import { actions } from 'browser/redux/actions/GlobalActions'
import { parseJSON } from'browser/redux/actions/actionHelpers'
import { insertForum } from 'browser/redux/forum/ForumActions'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import withMutation from 'react-apollo-decorators/lib/withMutation'
import { Mutation, MutationFunc, graphql, Query, withApollo } from 'react-apollo'

class CreateForumForm extends Component {
	static propTypes = {
		// Current user.
		viewer: PropTypes.object,
		// Form reset function.
		reset: PropTypes.func.isRequired,
		// Appollo client to send mutation query.
		client: PropTypes.object.isRequired,
	}
	/**
	 * On submit use apollo client to
	 * send mutation, update apollo cache
	 * and then reset form.
	 */
	handleSubmit = variables => {
		this.props.client
		.mutate({
			mutation,
			variables,
			update: this.updateCache
		})
		.then(() => this.props.reset())
	}
	/**
	 * Update apollo cache to push created forum into "forums" array.
	 * @param {Object} cache Apollo cache.
	 * @param {Object} response Mutation response.
	 */
	updateCache = (cache, { data: { forum } }) => {
		const { forums } = cache.readQuery({ query: forumsQuery })
		return cache.writeQuery({
			query: forumsQuery,
			data: { forums: forums.concat([forum]) }
		});
	}

	render() {
		// Hide component if user is not admin.
		if (get(this, 'props.viewer.id') != process.env.ADMIN_ID) return null
		const { props } = this
		const { handleSubmit, asyncValidating } = props
		const classNames = cls(props.className, "CreateForumForm")
		const isDisabled = asyncValidating == 'name' || props.submitting || props.loading || !props.valid
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
					<center>
						<RaisedButton
							type="submit"
							primary={true}
							disabled={isDisabled}
							label={translate('submit')} />
					</center>
				</form>
			</Col>
		</Row>
	}
}

const mutation = gql`
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
/**
 * Compose decorators:
 * 1) Get current user via apollo-graphql.
 * 2) Add validations via redux-forms.
 * 3) Provide apollo client to run mutation query on submit.
 */
const enhance = compose(
	withGraphQL(getCurrentUser),
	reduxForm({
		form: 'CreateForumForm',
		validate(values, ownProps) {
			let errors = {}
			if (!ownProps.viewer) errors.name = translate('please_login')
			if (!values.name) errors.name = translate('name_cant_be_empty')
			return errors
		}
	}),
	withApollo,
)

export default enhance(CreateForumForm)