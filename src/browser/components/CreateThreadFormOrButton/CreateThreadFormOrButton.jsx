import cls from 'classnames'
import PropTypes from 'prop-types'
import { Fade } from 'react-reveal'
import React, { Component } from 'react'
import { Row, Col } from 'react-styled-flexboxgrid'
import RaisedButton from 'material-ui/RaisedButton'
import { translate as t } from 'browser/containers/Translator'
import CreateThreadForm from 'browser/components/CreateThreadForm'

/*
	display button
	on button click display thread creation form
*/

class CreateThreadFormOrButton extends Component {
	state = {showButton: true}

	showForm = () => this.setState({showButton: false})

	render() {
		const {props, state} = this
		const className = cls(props.className, "CreateThreadFormOrButton")
		if (state.showButton) return (
			<Row className={className}>
				<Col xs={12}>
					<RaisedButton
						label={props.label}
						onClick={this.showForm}
						className="CreateThreadFormOrButton__button"
					/>
				</Col>
			</Row>
		)
		else return (
			<Fade> {/* animation */}
				<CreateThreadForm {...props} />
			</Fade>
		)
	}
}

CreateThreadFormOrButton.defaultProps = {
	label: t('create_thread')
}

CreateThreadFormOrButton.propTypes = {
	// button label
	label: PropTypes.string
}

export default CreateThreadFormOrButton