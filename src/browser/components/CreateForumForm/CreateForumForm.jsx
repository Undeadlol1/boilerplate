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
import RaisedButton from 'material-ui/RaisedButton'
import { query as forumsQuery } from '../ForumsList'
import { translate } from 'browser/containers/Translator'
import { Grid, Row, Col } from 'react-styled-flexboxgrid'
import { actions } from 'browser/redux/actions/GlobalActions'
import { parseJSON } from'browser/redux/actions/actionHelpers'
import { insertForum } from 'browser/redux/forum/ForumActions'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import { Form, Field, reduxForm, SubmissionError  } from 'redux-form'
import { getCurrentUser, createForum as mutation } from '../../graphql'
import { Mutation, MutationFunc, graphql, Query, withApollo } from 'react-apollo'
/**
 * Form to create a forum.
 * It is not visible if logged in user is not an admin.
 * On success a new forum is pushed in cached "forums" array.
 * On submit failure error message is displayed under input field.
 * @export
 */
export class CreateForumForm extends Component {
	static propTypes = {
		// Current user.
		data: PropTypes.object,
		// Form reset function.
		reset: PropTypes.func.isRequired,
		// Graphql mutation.
		createForum: PropTypes.func.isRequired,
	}
	/**
	 * On submit use apollo to
	 * send mutation, update apollo cache,
	 * catch errors and then reset form.
	 * @param {Object} variables Form values from redux-forms decorator.
	 */
	handleSubmit = variables => {
		return this.props
		.createForum({ variables })
		.then(() => this.props.reset())
		// Catch and show errors in redux-form.
		.catch(({ message, graphQLErrors}) => {
			throw new SubmissionError({
				name: get(graphQLErrors, '[0].message') || message
			})
		})
	}

	render() {
		// Hide component if user is not admin.
		if (get(this, 'props.data.viewer.id') != process.env.ADMIN_ID) return null
		const { props } = this
		const { handleSubmit, asyncValidating } = props
		const classNames = cls(props.className, "CreateForumForm")
		const isDisabled = asyncValidating == 'name' || props.submitting || props.loading || !props.valid
		return (
			<Row className={classNames}>
				<Col xs={12}>
					<form onSubmit={handleSubmit(this.handleSubmit)}>
						<Field
							fullWidth
							name="name"
							component={TextField}
							errorText={props.error}
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
		)
	}
}
/**
 * Add graphlq mutation functionality to component.
 * This is the official way of doing mutations in Apollo.
 * https://www.apollographql.com/docs/react/essentials/mutations.html
 * @param {Object} ownProps
 */
const withMutation = ownProps => {
	/**
	 * Update apollo cache to push created forum into "forums" array.
	 * @param {Object} cache Apollo cache.
	 * @param {Object} response Mutation response.
	 */
	function update(cache, response) {
		const { forum } = response.data
		const { forums } = cache.readQuery({ query: forumsQuery })
		return cache.writeQuery({
			query: forumsQuery,
			data: { forums: forums.concat([forum]) }
		})
	}
	return <Mutation mutation={mutation} update={update}>
		{
			(createForum, props) => {
				const properties = {
					...props,
					...ownProps,
					createForum
				}
				return (
					<CreateForumForm {...properties} />
				)
			}
		}
	</Mutation>
}
/**
 * Add graphql query which feches currentl user.
 * @param {Object} props
 */
const withQuery = props => (
	<Query query={getCurrentUser}>
		{({ data, error, loading }) => {
			const properties = { data, error, loading, ...props }
			return withMutation(properties)
		}}
	</Query>
)
/**
 * Wrap component with redux-form validations.
 */
export default reduxForm({
	form: 'CreateForumForm',
	validate(values, ownProps) {
		let errors = {}
		if (!ownProps.viewer) errors.name = translate('please_login')
		if (!values.name) errors.name = translate('name_cant_be_empty')
		return errors
	}
})(withQuery)