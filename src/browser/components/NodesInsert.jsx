import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Dialog from 'material-ui/Dialog'
import { Form, Field } from 'redux-form'
import FlatButton from 'material-ui/FlatButton'
import { Grid } from 'react-styled-flexboxgrid'
import { TextField } from 'redux-form-material-ui'
import ContentAdd from 'material-ui/svg-icons/content/add'
import YoutubeSearch from 'browser/components/YoutubeSearch'
import { translate as t } from 'browser/containers/Translator'
import FloatingActionButton from 'material-ui/FloatingActionButton'

class NodesInsert extends Component {
    render() {
        const { props } = this
        const { handleSubmit, toggleDialog, dialogIsOpen } = this.props
        const isDisabled = props.asyncValidating == 'url' || props.submitting

        const actions = [
                            <FlatButton
                                primary={false}
                                onTouchTap={toggleDialog}
                                label={t("cancel")}
                                disabled={isDisabled}
                            />,
                            // <FlatButton
                            //     type="submit"
                            //     primary={true}
                            //     disabled={!props.valid}
                            //     onTouchTap={handleSubmit}
                            //     label={t("submit")}
                            //     disabled={isDisabled}
                            // />
                        ]
// TODO this 'handlesubmit' just bugs me out
        // TODO this is where it comes from
        // Failed prop type: The prop `onSubmit` is marked as required in `Form`
        return  <Form onSubmit={handleSubmit(props.insertNode)} className="NodesInsert">

                    {/* BUTTON */}
                    <FloatingActionButton
                        secondary={true}
                        onClick={toggleDialog}
                    >
                        <ContentAdd />
                    </FloatingActionButton>
                    {/* DIALOG */}
                    <Dialog
                        modal={false}
                        actions={actions}
                        open={dialogIsOpen}
                        title={t("add_something")}
                        autoScrollBodyContent={true}
                        onRequestClose={toggleDialog}
                    >
                        <Grid className="NodesInsert__Grid">
                            <YoutubeSearch />
                        </Grid>
                        {/*<Field
                            name="url"
                            fullWidth
                            hintText={t('add_url')}
                            disabled={isDisabled}
                            component={TextField}
                        />*/}
                    </Dialog>

                </Form>
    }
}

NodesInsert.propTypes = {
    dialogIsOpen: PropTypes.bool.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    toggleDialog: PropTypes.func.isRequired,
}

export default NodesInsert