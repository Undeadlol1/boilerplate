// dependencies
import { connect } from "react-redux";
import React, { Component } from "react";
// project files
import { t } from "browser/containers/Translator";
import ForumsList from "browser/components/ForumsList";
import PageWrapper from "browser/components/PageWrapper";
import WelcomeCard from "browser/components/WelcomeCard";
import CreateForumForm from "browser/components/CreateForumForm";

class IndexPage extends Component {
  render() {
    return (
      <PageWrapper className="IndexPage">
        <WelcomeCard />
        <CreateForumForm />
        <b>{t("forums_list")}:</b>
        <ForumsList />
      </PageWrapper>
    );
  }
}

IndexPage.propTypes = {};

export { IndexPage };

export default connect((state, ownProps) => ({ ...ownProps }))(IndexPage);
