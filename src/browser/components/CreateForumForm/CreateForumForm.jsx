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
import { Mutation, MutationFunc, graphql, Query } from 'react-apollo'

class CreateForumForm extends Component {

	static propTypes = {
		UserId: PropTypes.number,
		reset: PropTypes.func.isRequired,
		createForum: PropTypes.func.isRequired,
	}

	handleSubmit = variables => {
		this.props
		.createForum({ variables })
		.then(() => this.props.reset())
	}

	render() {
		console.log('this.props: ', this.props);
		console.log('viewer: ', get(this, 'props.data.viewer.id') );
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

// Update apollo cache to push
// created forum into "forums" array.
function update(cache, { data: { forum } }) {
	const { forums } = cache.readQuery({ query: forumsQuery })
	cache.writeQuery({
		query: forumsQuery,
		data: { forums: forums.concat([forum]) }
	});
}

const formValidations = reduxForm({
	form: 'CreateForumForm',
	validate(values) {
		let errors = {}
		const user = store.getState().user.get('id')

		if (!user) errors.name = translate('please_login')
		if (!values.name) errors.name = translate('name_cant_be_empty')
		// if (!values.text) errors.text = translate('cant_be_empty')

		return errors
	}
})

const enhance = compose(
	formValidations,
	withGraphQL(getCurrentUser),
	withMutation(createForum),
)

const mutation = props => (
	<Mutation mutation={createForum} update={update}>
		{(createForum, response) => (<CreateForumForm {...props} {...response} createForum={createForum} />)}
	</Mutation>
)

export default enhance(mutation)