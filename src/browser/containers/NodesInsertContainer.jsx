import React, { Component } from 'react'
import isUrl from 'is-url'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { reduxForm } from 'redux-form'
import store from 'browser/redux/store'
import { parseUrl } from 'shared/parsers.js'
import isEmpty from 'lodash/isEmpty'
import assignIn from 'lodash/assignIn'
import NodesInsert from 'browser/components/NodesInsert'
import { translate } from 'browser/containers/Translator'
import { actions } from 'browser/redux/actions/GlobalActions'
import { insertNode, actions as nodeActions } from 'browser/redux/actions/NodeActions'
import { parseJSON, checkStatus } from 'browser/redux/actions/actionHelpers'

@reduxForm({
	form: 'NodesInsert',
    // check if node already exists or not
	asyncValidate(values, dispatch, props) {
		return fetch(`/api/nodes/validate`
                     + `/${store.getState().mood.get('id')}`
                     + `/${parseUrl(values.url).contentId}`
                )
				.then(parseJSON)
				.then(node => {
					if (!isEmpty(node)) throw {
                        url: translate('this_video_already_exists_please_no_duplicates')
                    }
					else return
                })
    },
    asyncBlurFields: [ 'url' ],
    // validate user and url
	validate({url}, second) {
		let errors = {}
        const user = store.getState().user.get('id')
		if (!user) errors.url = translate('please_login')
        if (!url) errors.url = translate('url_cant_be_empty')
        else if (url && !isUrl(url)) errors.url = translate('something_wrong_with_this_url')
		return errors
	}
})
@connect(
	// stateToProps
	({node}, ownProps) =>
    ({ dialogIsOpen: node.get('dialogIsOpen'), ...ownProps}),
	// dispatchToProps
    (dispatch, ownProps) => ({
        insertNode(formValues) {
            const { moodSlug } = ownProps
            // TODO parseUrl is not really needed anymore. Parsing is made on server side. Remove this?
            const node = parseUrl(formValues.url)
            extend(node, { moodSlug })
            dispatch(insertNode(node))
            ownProps.reset()
        },
        toggleDialog() {
			dispatch(actions.toggleControls())
            dispatch(nodeActions.toggleDialog())
        },
        toggleControls(boolean) {
			dispatch(actions.toggleControls(boolean))
		},
    })
)
export default class NodesInsertContainer extends Component {
    static propTypes = {
        moodSlug: PropTypes.string.isRequired
    }
    render() {
        return <NodesInsert {...this.props} />
    }
}