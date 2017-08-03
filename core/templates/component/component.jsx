import cls from 'classnames'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import React, { Component } from 'react'

class ComponentName extends Component {
	render() {
		const {props} = this
		const className = cls(props.className, "ComponentName")
		return 	<div className={className}></div>
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