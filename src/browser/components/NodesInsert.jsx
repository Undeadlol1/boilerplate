import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ContentAdd from 'material-ui/svg-icons/content/add'
import { Form, Field } from 'redux-form'
import { TextField } from 'redux-form-material-ui'
import { translate } from 'browser/containers/Translator'
import YoutubeSearch from 'browser/components/YoutubeSearch'

class NodesInsert extends Component {

    state = { open: false }

    render() {
        const { props } = this
        const { handleSubmit, toggleDialog } = this.props
        const isDisabled = props.asyncValidating == 'url' || props.submitting

        const actions = [
                            <FlatButton
                                primary={true}
                                onTouchTap={toggleDialog}
                                label={translate("cancel")}
                                disabled={isDisabled}
                            />,
                            <FlatButton
                                type="submit"
                                primary={true}
                                disabled={!props.valid}
                                onTouchTap={handleSubmit}
                                label={translate("submit")}
                                disabled={isDisabled}
                            />
                        ]

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
                        modal={true}
                        actions={actions} 
                        onRequestClose={toggleDialog}
                        open={props.node.dialogIsOpen}
                        title={translate("add_something")}
                    >
                        <Field
                            name="url"
                            fullWidth
                            hintText={'Add url'}
                            disabled={isDisabled}
                            component={TextField}
                        />
                        <YoutubeSearch />
                    </Dialog>
                    
                </Form>
    }
}

NodesInsert.propTypes = {
    moodSlug: PropTypes.string.isRequired
}

export default NodesInsert