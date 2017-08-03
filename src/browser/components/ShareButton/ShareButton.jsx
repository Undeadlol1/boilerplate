import cls from 'classnames'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Icon from 'browser/components/Icon'
import SocialShare from 'material-ui/svg-icons/social/share'
import { SpeedDial, SpeedDialItem } from 'react-mui-speeddial'
import NavigationClose from 'material-ui/svg-icons/navigation/close'

export class ShareButton extends Component {

	shareOnVk() {
		if (process.env.BROWSER) {
			window.open("https://vk.com/share.php?url=" + window.location.href)
		}
	}

	shareOnTwitter() {
		if (process.env.BROWSER) {
			window.open("https://twitter.com/intent/tweet?url=" + window.location.href)
		}
	}

	render() {
		const {props} = this
		const className = cls(props.className, "ShareButton")
		return <div className={className}>
					<SpeedDial
						fabContentOpen={<SocialShare className='ShareButton__main-icon' />}
						fabContentClose={<NavigationClose className='ShareButton__main-icon' />}
					>
						<SpeedDialItem
							fabContent={<Icon size="lg" name="vk" />}
							onTouchTap={this.shareOnVk}
						/>
						<SpeedDialItem
							fabContent={<Icon size="lg" name="twitter" />}
							onTouchTap={this.shareOnTwitter}
						/>
					</SpeedDial>
				</div>
	}
}

ShareButton.defaultProps = {
	// title: process.env.APP_NAME,
	// appUrl: process.env.URL,
}

ShareButton.PropTypes = {
	// title: PropTypes.string,
	// appUrl: PropTypes.string,
}

export default ShareButton