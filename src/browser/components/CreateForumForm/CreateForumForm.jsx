import { translate } from "browser/containers/Translator";
import cls from "classnames";
import get from "lodash/get";
import RaisedButton from "material-ui/RaisedButton";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { Mutation, Query } from "react-apollo";
import { Col, Row } from "react-styled-flexboxgrid";
import { Field, reduxForm, SubmissionError } from "redux-form";
import { TextField } from "redux-form-material-ui";

import {
  createForum as mutation,
  getCurrentUser,
  getForums,
} from "../../graphql";

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
  };
  /**
   * On submit use apollo to
   * send mutation, update apollo cache,
   * catch errors and then reset form.
   * @param {Object} variables Form values from redux-forms decorator.
   */
  handleSubmit = variables => {
    return (
      this.props
        .createForum({ variables })
        .then(() => this.props.reset())
        // Catch and show errors in redux-form.
        .catch(({ message, graphQLErrors }) => {
          throw new SubmissionError({
            name: get(graphQLErrors, "[0].message") || message,
          });
        })
    );
  };

  render() {
    // Hide component if user is not admin.
    if (get(this, "props.data.viewer.id") != process.env.ADMIN_ID) return null;
    const { props } = this;
    const { handleSubmit, asyncValidating } = props;
    const classNames = cls(props.className, "CreateForumForm");
    const isDisabled =
      asyncValidating == "name" ||
      props.submitting ||
      props.loading ||
      !props.valid;
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
                label={translate("submit")}
              />
            </center>
          </form>
        </Col>
      </Row>
    );
  }
}
/**
 * Add graphql mutation functionality to component.
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
    const { forum } = response.data;
    const { forums } = cache.readQuery({ query: getForums });
    return cache.writeQuery({
      query: getForums,
      data: { forums: forums.concat([forum]) },
    });
  }
  return (
    <Mutation mutation={mutation} update={update}>
      {(createForum, props) => {
        const properties = {
          ...props,
          ...ownProps,
          createForum,
        };
        return <CreateForumForm {...properties} />;
      }}
    </Mutation>
  );
};
/**
 * Add graphql query which fetches current user.
 * @param {Object} props
 */
const withQuery = props => (
  <Query query={getCurrentUser}>
    {({ data, error, loading }) => {
      const properties = { data, error, loading, ...props };
      return withMutation(properties);
    }}
  </Query>
);
/**
 * Wrap component with redux-form validations.
 */
export default reduxForm({
  form: "CreateForumForm",
  validate(values, ownProps) {
    let errors = {};
    if (get(ownProps, "data.viewer")) errors.name = translate("please_login");
    if (!values.name) errors.name = translate("name_cant_be_empty");
    return errors;
  },
})(withQuery);
