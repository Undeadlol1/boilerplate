// dependencies
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import React, { PureComponent } from 'react'
import { Grid, Row, Col } from 'react-styled-flexboxgrid'
// project files
import PageWrapper from 'browser/components/PageWrapper'
import { translate as t } from 'browser/containers/Translator'

class AboutPage extends PureComponent {
    render() {
		const { props } = this
		return 	<PageWrapper className='AboutPage'>
					<Row className="AboutPage__header">
						<Col xs={12}>
							<h1 className="AboutPage__title">{t('about_us')}</h1>
						</Col>
					</Row>
				</PageWrapper>
    }
}

AboutPage.propTypes = {
	// name: PropTypes.string.isRequired,
}

export { AboutPage }

export default
connect(
	(state, ownProps) => ({
		...ownProps,
		// name: state.forum.get('name'),
	}),
)(AboutPage)