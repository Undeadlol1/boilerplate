import cls from 'classnames'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Row, Col } from 'react-styled-flexboxgrid'
import RaisedButton from 'material-ui/RaisedButton'
import { translate as t } from 'browser/containers/Translator'
import CreateThreadForm from 'browser/components/CreateThreadForm'

// FIXME: add comments

class CreateThreadFormOrButton extends Component {
	state = {
		showButton: true,
	}

	showForm = () => {
		this.setState({showButton: false})
	}

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
		else return <CreateThreadForm {...props} />
	}
}

CreateThreadFormOrButton.defaultProps = {
	label: t('create_thread')
}

CreateThreadFormOrButton.propTypes = {
	label: PropTypes.string
}

export default CreateThreadFormOrButton