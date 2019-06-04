// dependencies
import * as React from "react";
import { connect } from "react-redux";
// project files
import { t } from "browser/containers/Translator";
import ForumsList from "browser/components/ForumsList";
import PageWrapper from "browser/components/PageWrapper";
import WelcomeCard from "browser/components/WelcomeCard";
import CreateForumForm from "browser/components/CreateForumForm";

export class IndexPage extends React.Component<{}, {}> {
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

export default connect((state, ownProps) => ({ ...ownProps }))(IndexPage);
