import cx from 'classnames'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Tabs, Tab } from 'material-ui/Tabs'
import React, { PureComponent } from 'react'
import MoodsList from 'browser/components/MoodsList'
import { translate as t } from 'browser/containers/Translator'

export class MoodTabs extends PureComponent {
	static propTypes = {
		new: PropTypes.object.isRequired,
		random: PropTypes.object.isRequired,
		popular: PropTypes.object.isRequired,
	}
	render() {
		const { props } = this
		const classNames = cx('MoodTabs', props.className)
		return 	<Tabs className={classNames}>
					<Tab label={t('popular')}>
						<MoodsList
							selector="popular"
							moods={props.popular.get('moods')}
							totalPages={props.popular.get('totalPages')}
							currentPage={props.popular.get('currentPage')} />
					</Tab>
					 <Tab label={t('new')}>
						<MoodsList
							selector="new"
							moods={props.new.get('moods')}
							totalPages={props.new.get('totalPages')}
							currentPage={props.new.get('currentPage')} />
					</Tab>
					<Tab label={t('random')}>
						<MoodsList
							selector="random"
							moods={props.random.get('moods')}
							totalPages={props.random.get('totalPages')}
							currentPage={props.random.get('currentPage')} />
					</Tab>
				</Tabs>
	}
}

export default connect(
	// state to props
	({ mood }, ownProps) => {
		return {
			new: mood.get('new'),
			random: mood.get('random'),
			popular: mood.get('popular'),
			...ownProps
		}
	}
)(MoodTabs)