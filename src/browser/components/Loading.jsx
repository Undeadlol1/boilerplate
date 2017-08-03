import CircularProgress from 'material-ui/CircularProgress'
import React, { Component } from 'react'
import isEmpty from 'lodash/isEmpty'
import classNames from 'classnames'
import PropTypes from 'prop-types'

/**
 * show loading indicator
 * could be used as a wrapper via 'condition' prop
 */
function Loading ({condition, children, color, style, className}) {
    const styles = style || {
        top: '50%',
        left: '50%',
        position: 'absolute', //!important;
        transform: 'translate(-50%, -50%)',
    }
    const cx = classNames('Loading', className)
    if (!condition && !isEmpty(children)) return <div className={className}>{children}</div>
    return <div style={styles} className={className} ><CircularProgress color={color} className="loading" style={styles} /></div>
}

Loading.propTypes = {
    color: PropTypes.string,
    condition: PropTypes.bool,
}

export default Loading