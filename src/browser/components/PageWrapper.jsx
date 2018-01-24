import PropTypes from 'prop-types'
import classNames from 'classnames'
import React, { Component } from 'react'
import { Grid } from 'react-styled-flexboxgrid'
import MetaData from 'browser/components/MetaData'

/**
 * Wrapper for *Page.jsx components
 * Used to set MetaData tags
 * and add <Grid> element
 * Grid can is used to make page fullscreen and or with left and right margin
 * you can set it via "fluid" property
 */
export default class PageWrapper extends Component {

    static defaultProps = { fluid: true }

    static propTypes = {
        // metadata tags
        title: PropTypes.string,
        image: PropTypes.string,
        description: PropTypes.string,
        // full screen or not
        fluid: PropTypes.bool.isRequired,
    }

    render() {
        const { props } = this
        const cx = classNames('PageWrapper PageWrapper__Grid', props.className)
        const metaTags = {
            title: props.title,
            description: props.image,
            description: props.description,
        }
        // FIXME: check if this is needed
        // const rootStyles =  {
        //     minWidth: '100%',
        //     minHeight: '100%',
        // }

        return <Grid fluid={props.fluid} className={cx}>
                    <MetaData {...metaTags} />
                    {props.children}
                </Grid>
    }
}