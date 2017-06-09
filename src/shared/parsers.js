// import { Meteor } from 'meteor/meteor';

function parseYoutube(url) {
	let video_id = url.split('v=')[1],
		ampersandPosition = video_id.indexOf('&')
	if(ampersandPosition != -1) {
		video_id = video_id.substring(0, ampersandPosition)
	}
	return video_id
}

function parseUrl(url) {

	function checkForImageUrl(url) {
		return(url.match(/\.(jpeg|jpg|gif|png)$/) != null);
	}

	if(checkForImageUrl(url)) return {
								url,
								// provider: null,
								type: 'image',
							}

	if (url.includes('youtube' || 'youtu.be')) {
		return {
			url,
			type: 'video',
			provider: 'youtube',
			contentId: parseYoutube(url)
		}
	}
	else throw new Error("Unrecognised-url-provider")
}

export { parseUrl }
