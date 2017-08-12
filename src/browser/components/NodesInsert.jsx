import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Dialog from 'material-ui/Dialog'
import { Form, Field } from 'redux-form'
import FlatButton from 'material-ui/FlatButton'
import { Grid } from 'react-styled-flexboxgrid'
import { TextField } from 'redux-form-material-ui'
import ContentAdd from 'material-ui/svg-icons/content/add'
import CloseIcon from 'material-ui/svg-icons/navigation/close'
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
                            />
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
                        {
                            props.open
                            ? <CloseIcon />
                            : <ContentAdd />
                        }
                    </FloatingActionButton>
                    {/* DIALOG */}
                    {/* <Dialog
                        modal={false}
                        actions={actions}
                        open={false}
                        title={t("add_something")}
                        autoScrollBodyContent={true}
                        onRequestClose={toggleDialog}
                    >
                        <Grid className="NodesInsert__Grid">
                            <YoutubeSearch />
                        </Grid>
                    </Dialog> */}

                </Form>
    }
}

NodesInsert.propTypes = {
    open: PropTypes.bool,
    dialogIsOpen: PropTypes.bool.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    toggleDialog: PropTypes.func.isRequired,
}

export default NodesInsert