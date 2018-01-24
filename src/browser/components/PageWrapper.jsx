import PropTypes from 'prop-types'
import classNames from 'classnames'
import React, { Component } from 'react'
import { Grid } from 'react-styled-flexboxgrid'
import Loading from 'browser/components/Loading'
import MetaData from 'browser/components/MetaData'
import { translate as t } from 'browser/containers/Translator'

/**
 * Wrapper for *Page.jsx components
 * Server-side it returns chidren with no modifications to be prerendered in html
 * Client-side it applies loading and page transition
 */
export default class PageWrapper extends Component {

    static defaultProps = {
        grid: true,
        loading: false
    }

    static propTypes = {
        preset: PropTypes.string,
        location: PropTypes.object,
        grid: PropTypes.bool.isRequired,
        loading: PropTypes.bool.isRequired,
    }

    render() {
        const { props } = this
		const {location, loading, children, preset} = this.props
        const cx = classNames('PageWrapper PageWrapper__Grid', props.className)
        const metaTags = {
            title: props.title,
            image: props.image,
            description: props.description,
        }
        // RouterTransition creates it's own 'div'
        // which makes it harder to apply styles on root class
        const rootStyles =  {
            minWidth: '100%',
            minHeight: '100%',
            // position: 'relative',
        }

        return  props.grid
                ?   <Grid fluid className={cx}>
                        <MetaData {...metaTags} />
                        {children}
                    </Grid>
                :   <div className={classNames('PageWrapper', props.className)}>
                        <MetaData {...metaTags} />
                        {children}
                    </div>
    }
}