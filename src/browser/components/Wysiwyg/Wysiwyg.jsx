import cls from 'classnames'
import PropTypes from 'prop-types'
import TinyMCE from 'react-tinymce'
import Paper from 'material-ui/Paper'
import React, { Component } from 'react'
import { Row, Col } from 'react-styled-flexboxgrid'
import { translate as t } from 'browser/containers/Translator'


/**
 * Wysiwig editor based on TinyMCE
 * @class Wysiwyg
 * @extends {Component}
 */
class Wysiwyg extends Component {
	handleEditorChange(e) {
		this.props.onChange(e.target.getContent())
	}
	render() {
		const {props} = this
		const className = cls(props.className, "Wysiwyg")
		return (
			<Paper zDepth={5} className={className}>
				{props.label ? <b>{props.label}</b> : ''}
				<TinyMCE
					content={props.text}
					config={{
						//inline: true
						resize: false,
						elementpath: true,
						paste_as_text: true,
						autoresize_bottom_margin: 10,
						content_css : '/tinymce.css',
						skin_url: '/tinymce.skins/light',
						language_url : '/tinymce.languages/ru.js',
						plugins: 'autoresize code image autolink advlist autosave codesample link preview print contextmenu paste',
					}}
					onChange={this.handleEditorChange.bind(this)}
				/>
			</Paper>
		)
	}
}

Wysiwyg.defaultProps = {
  label: '',
  text: ''
}
Wysiwyg.propTypes = {
  label: PropTypes.string,
  text: PropTypes.string.isRequired
}

export { Wysiwyg }
export default Wysiwyg