import cls from 'classnames'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import store from 'browser/redux/store'
import Dialog from 'material-ui/Dialog'
import { stringify } from 'query-string'
import React, { Component } from 'react'
import FlatButton from 'material-ui/FlatButton'
import { TextField } from 'redux-form-material-ui'
import { Form, Field, reduxForm } from 'redux-form'
import { translate } from 'browser/containers/Translator'
import { Grid, Row, Col } from 'react-styled-flexboxgrid'
import ContentAdd from 'material-ui/svg-icons/content/add'
import browserHistory from 'react-router/lib/browserHistory'
import { actions } from 'browser/redux/actions/GlobalActions'
import { parseJSON } from'browser/redux/actions/actionHelpers'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import { insertMood, toggleDialog } from 'browser/redux/actions/MoodActions'

export class MoodsInsert extends Component {
	render() {
		const { props } = this
		const { insertMood, handleSubmit, dialogIsOpen, toggleDialog, asyncValidating, className } = props
		const classNames = cls(className, "MoodsInsert")
		const isDisabled = props.asyncValidating == 'name' || props.submitting
		const actions = [
					<FlatButton
						primary={false}
						onTouchTap={toggleDialog}
						label={translate("cancel")}
						disabled={isDisabled}
					/>,
				]
	    return  <div className={classNames}>
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
                        title={translate("add_your_own_mood")}
                        autoScrollBodyContent={true}
                        onRequestClose={toggleDialog}
                    >
						<form onSubmit={handleSubmit(insertMood)}>
							<Row>
								<Col xs={12}>
									<Field name="name" component={TextField} hidden={asyncValidating} hintText={translate("add_something")} autoFocus fullWidth />
									<button type="submit" hidden={true}>Submit</button>
								</Col>
							</Row>
						</form>
					</Dialog>
				</div>

	}
}
// TODO reorganize this for better testing
export default reduxForm({
	form: 'MoodsInsert',
	asyncValidate({name}) {
		return fetch('/api/moods/mood/' + '?' + stringify({name}))
				.then(parseJSON)
				.then(result => {
					if (result) throw { name: translate('this_mood_already_exists') }
					else return
				})
    },
	validate(values) {
		let errors = {}
		const user = store.getState().user.get('id')

		if (!user) errors.name = translate('please_login')
		if (!values.name) errors.name = translate('name_cant_be_empty')

		return errors
	},
	asyncBlurFields: [ 'name' ]
})
(connect(
	(state, ownProps) => ({
		dialogIsOpen: state.mood.get('dialogIsOpen'),
		...ownProps
	}),
    (dispatch, ownProps) => ({
        insertMood({name}) {
			function insertSucces(slug) {
				ownProps.reset()
				browserHistory.push('/mood/' + slug);
			}
            dispatch(toggleDialog())
            dispatch(insertMood(name, insertSucces))
		},
		toggleDialog() {
			dispatch(actions.toggleControls())
            dispatch(toggleDialog())
        },
    })
)(MoodsInsert))