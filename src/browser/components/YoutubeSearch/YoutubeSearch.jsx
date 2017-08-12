import cls from 'classnames'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import store from 'browser/redux/store'
import TextField from 'material-ui/TextField'
import { Grid, Row, Col } from 'react-styled-flexboxgrid'
import YoutubeVideos from 'browser/components/YoutubeVideos'
import { translate as t } from 'browser/containers/Translator'
import { youtubeSearch } from 'browser/redux/actions/NodeActions'
import LoginLogoutButton from 'browser/components/LoginLogoutButton'

class YoutubeSearch extends Component {

	state = {
		query: "",
		error: '',
		pristine: true,
		validating: false,
	}

	onChange = (event, query) => {
		if (query.length == 0) this.setState({ error: t('cannot_be_empty') })
		this.setState({query})
	}

	handleSubmit = event => {
		event && event.preventDefault()
		// console.log('this.props: ', this.props);
		if (!this.props.UserId) return this.setState({error: t('please_login')})
		// store.
		// this.setState({query: 'SUBMIT IS CALLED YO'})
		this.props.youtubeSearch(this.state.query)
	}

	render() {
		const { state, props } = this
		const classNames = cls(props.className, "YoutubeSearch")
		// TODO
		const { handleSubmit, UserId, youtubeSearch, submitting, ...rest } = this.props
		return 	<div className={classNames} {...rest}>
					<Row>
						<Col xs={12}>
							<form onSubmit={this.handleSubmit}>
								<TextField
									fullWidth
									autoFocus
									required
									value={state.query}
									errorText={state.error}
									// name="query"
									onChange={this.onChange}
									disabled={state.validating}
									hintText={t('search_for_video')} />
								{/* hack to submit on 'enter' */}
								<button type="submit" hidden={true}>Submit</button>
							</form>
						</Col>
					</Row>
					<YoutubeVideos />
				</div>
	}
}

YoutubeSearch.PropTypes = {
	UserId: PropTypes.string,
	youtubeSearch: PropTypes.func.isRequired,
}

export { YoutubeSearch }
export default connect(
	// stateToProps
	(state, ownProps) => ({
		UserId: state.user.get('id'),
		...ownProps
	}),
	// dispatchToProps
    (dispatch, ownProps) => ({
		youtubeSearch(query) {
			dispatch(youtubeSearch(query))
		}
	})
)(YoutubeSearch)
