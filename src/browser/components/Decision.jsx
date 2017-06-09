import React, { Component } from 'react'
import selectn from 'selectn'
import PropTypes from 'prop-types'
import { injectProps } from 'relpers'
import { connect } from 'react-redux'
import Slider from 'material-ui/Slider'
import InputRange from 'react-input-range'
import Icon from 'browser/components/Icon'
import { changeRating } from '../redux/actions/NodeActions'

// TODO rework this. This is a mess

@connect(
	// state to props
	({ node }, ownProps) => ({ decision: node.Decision, ...ownProps }),
	// dispatch to props
	(dispatch) => ({
		changeRating(payload) {
			console.log('rating', payload)
			dispatch(changeRating(payload))
		}
    })
)
class Decision extends Component {

	state = { rating: 0 } // do i need this?

	// TODO get rid of this?
	changeRating(event, rating) {
		// console.log('event', event)
		// const rating = event.target.value // do i need this?
		console.log('rating', rating)
		this.setState({ rating }) // do i need this?
	}

	handleSubmit() {
		const { props, state } = this
		const currentRating = selectn('decision.rating', props)
		const newRating = state.rating
		if (currentRating === newRating) return
		props.changeRating({
			rating: newRating,
			NodeId: selectn('content.NodeId', props)
		})
	}

	render() {
		return null
		const { decision, className, changeRating, ...rest } = this.props
		return 	<div className={'Decision ' + className}>
					<Icon name="thumbs-up" hoverIcon='thumbs-o-up' />
					<Icon name="step-forward" />
					<Icon name="thumbs-down" hoverIcon='thumbs-o-down' />
				</div>
	}
}

Decision.propTypes = {
	// content: PropTypes.object.isRequired,
	// decision: PropTypes.object.isRequired,
	// changeRating: PropTypes.func.isRequired
}

export default Decision