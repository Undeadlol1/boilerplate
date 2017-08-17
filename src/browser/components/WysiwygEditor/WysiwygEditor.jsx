import cls from 'classnames'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import React, { Component } from 'react'
import { Editor } from 'react-draft-wysiwyg'
import { EditorState, ContentState, convertFromHTML } from 'draft-js'

class WysiwygEditor extends Component {
	state = {
		editor: null
	}

	componentDidMount = () => {
		this.setState({
			tabs: this.renderEditor()
		})
	}

	renderTabs = () => {
			let defaultState
			if (process.env.BROWSER) {
				const blocksFromHTML = convertFromHTML(defaultTexts[index])
				defaultState = process.env.BROWSER ?
								EditorState.createWithContent(ContentState.createFromBlockArray(
									blocksFromHTML.contentBlocks,
									blocksFromHTML.entityMap
								))
							: undefined
			}
			return <Editor
						defaultEditorState={defaultState}
						onEditorStateChange={this.props.onChange}
					/>
	}

	render() {
		const {props, state} = this
		const {...rest} = props
		const className = cls(props.className, "WysiwygEditor")
		if (!state.editor) return <Editor className={className} {...rest} />
		else return state.editor
	}
}

WysiwygEditor.PropTypes = {
	onChange: PropTypes.func
}

export { WysiwygEditor }
export default connect(
	// stateToProps
	(state, ownProps) => ({ ...ownProps }),
	// dispatchToProps
    (dispatch, ownProps) => ({})
)(WysiwygEditor)