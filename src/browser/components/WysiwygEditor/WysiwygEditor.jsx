import cls from 'classnames'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import React, { Component } from 'react'
// https://jpuri.github.io/react-draft-wysiwyg/#/docs
import { Editor } from 'react-draft-wysiwyg'
import { detectLocale } from 'browser/containers/Translator'
import { EditorState, ContentState, convertFromHTML, } from 'draft-js'

class WysiwygEditor extends Component {
	render() {
		const 	{props, state} = this,
				{...rest} = props,
				locale = detectLocale(),
				className = cls(props.className, "WysiwygEditor")
		let defaultEditorState = EditorState.createEmpty()
		if (process.env.BROWSER) {
			const blocksFromHTML = convertFromHTML(props.defaultState)
			defaultEditorState = EditorState.createWithContent(
				ContentState.createFromBlockArray(
					blocksFromHTML.contentBlocks,
					blocksFromHTML.entityMap
				)
			)
		}
		return <Editor
					className={className}
					defaultEditorState={defaultEditorState}
					onContentStateChange={this.props.onChange}
					localization={{locale}}
					{...rest}
				/>
	}
}

WysiwygEditor.PropTypes = {
	onChange: PropTypes.func,
	defaultState: PropTypes.object,
}

export { WysiwygEditor }
export default connect(
	// stateToProps
	({user}, ownProps) => ({...ownProps}),
	// dispatchToProps
    (dispatch, ownProps) => ({})
)(WysiwygEditor)