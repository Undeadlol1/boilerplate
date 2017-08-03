import { withRouter } from 'react-router'
import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import PropTypes from 'prop-types'

const defaultTitle = 'MooD - музыка твоего настроения'

class MetaData extends Component {
	// copy+paste from https://megatags.co/#generate-tags
	render() {
		const { appUrl, location, appName, title, description, image, } = this.props
		// current url (slice of '/' before adding pathname)
		const url = appUrl.slice(0, -1) + location.pathname
	    return  <Helmet
					// this insures title to change if data is undefined
					defaultTitle={defaultTitle}
				>
					{/* COMMON TAGS */}
					<meta charset="utf-8" />
					<title>{title}</title>
					{/* Search Engine */}
					{/* 150 characters for SEO, 200 characters for Twitter & Facebook */}
					<meta name="description" content={description} />
					<meta name="image" content={image} />
					{/* Schema.org for Google */}
					<meta itemprop="name" content={title} />
					<meta itemprop="description" content={description} />
					<meta itemprop="image" content={image} />
					{/* Twitter */}
					<meta name="twitter:card" content="summary_large_image" />
					<meta name="twitter:title" content={title} />
					<meta name="twitter:description" content={description} />
					<meta name="twitter:url" content={url} />
					{/*<meta name="twitter:site" content="@publishehadle_sdd" />*/}
					{/*<meta name="twitter:creator" content="@auth_handledee" />*/}
					{/* Maximum dimension: 1024px x 512px; minimum dimension: 440px x 220px */}
					<meta name="twitter:image:src" content={image} />
					{/* HTTPS URL to an iFrame player */}
					{/* TODO add 'videoId' property */}
					{/*<meta name="twitter:player" content="https://www.youtube.com/watch?v=EDJsVbSZb-Q" />*/}
					{/* Open Graph general (Facebook, Pinterest & Google+) */}
					<meta name="og:title" content={title} />
					<meta name="og:description" content={description} />
					{/* Recommended dimension: 1200px x 630px; minimum dimension: 600px x 315px */}
					<meta name="og:image" content={image} />
					<meta name="og:url" content={url} />
					<meta name="og:site_name" content={appName} />
					{/* this is a test */}
					<meta property="og:image:width" content="968" />
					<meta property="og:image:height" content="504" />
					{/* TODO dynamic locales */}
					<meta name="og:locale" content="ru_RU" />
					{/*<meta name="og:video" content="https://www.youtube.com/watch?v=EDJsVbSZb-Q" />*/}
					{/*<meta name="fb:admins" content="facebook_admin_id" />*/}
					{/*<meta name="fb:app_id" content="some_fb_id" />*/}
					<meta name="og:type" content="website" />
				</Helmet>

	}
}

MetaData.defaultProps = {
	appUrl: process.env.URL,
	title: defaultTitle,
	appName: process.env.APP_NAME,
	description: defaultTitle,
	image: process.env.URL + "android-chrome-192x192.png",
}

MetaData.PropTypes = {
	title: PropTypes.string.isRequired,
	image: PropTypes.string.isRequired,
	appUrl: PropTypes.string.isRequired,
	appName: PropTypes.string.isRequired,
	location: PropTypes.object.isRequired,
	description: PropTypes.string.isRequired,
}

export { MetaData }

// 'withRouter' provedes 'location' object
export default withRouter(MetaData)