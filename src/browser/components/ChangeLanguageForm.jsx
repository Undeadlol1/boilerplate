// TODO rework all of this
import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { Row, Col } from 'react-styled-flexboxgrid'
import { updateUser } from '../redux/actions/UserActions'
// TODO test (redux-form may be importing whole material-ui library)
import { TextField, SelectField } from 'redux-form-material-ui'
import MenuItem from 'material-ui/MenuItem'
import cookies from 'cookies-js'
import { translate } from '../containers/Translator'

@reduxForm({
	form: 'ChangeLanguageForm',
	validate(values) {return {}}
})
@connect(
	({user}, ownProps) => {
		const UserId = user.get('id')
		return ({UserId, ...ownProps})
	},
    (dispatch, ownProps) => ({
        changeLanguage(UserId, language) {
			cookies.set('locale', language)
            dispatch(
				updateUser(UserId, {language})
			)
        }
    })
)
export default class ChangeLanguageForm extends Component {
	handleChange = (event, language) => {
		const {UserId, changeLanguage} = this.props
		changeLanguage(UserId, language)
	}

	render() {
		const { changeLanguage } = this.props
		const labelText = translate("choose_your_language")
	    return  <form>
					<Row>
						<Col xs={12} sm={6} md={3}>
							<Field
								fullWidth
								name="language"
								component={SelectField}
								onChange={this.handleChange}
								floatingLabelText={labelText}
							>
								<MenuItem value="ru" primaryText="Русский" />
								<MenuItem value="en" primaryText="English" />
								<MenuItem value="uk" primaryText="Українська" />
							</Field>
						</Col>
					</Row>
		        </form>

	}
}
