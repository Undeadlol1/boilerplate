import cls from 'classnames'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import React, { Component } from 'react'
import { Row, Col } from 'react-styled-flexboxgrid'
import { translate as t } from 'browser/containers/Translator'

class ComponentName extends Component {
	render() {
		const {props} = this
		const className = cls(props.className, "ComponentName")
		return 	<Row className={className}>
					<Col xs={12}>

					</Col>
				</Row>
	}
}

ComponentName.PropTypes = {}

export { ComponentName }
export default connect(
	// stateToProps
	(state, ownProps) => ({ ...ownProps }),
	// dispatchToProps
    (dispatch, ownProps) => ({})
)(ComponentName)