import PropTypes from 'prop-types'
import React, { Component } from 'react'
import FontAwesome from 'react-fontawesome'
import { assignIn as extendObject } from 'lodash'

class Icon extends Component {
    state = {
        currentIcon: this.props.name
    }

    toggleHoverIcon = isHovering => {
        const { name, hoverIcon } = this.props
        const currentIcon = isHovering ? hoverIcon : name
        if (hoverIcon) this.setState({ currentIcon })
    }

    render() {
        const { size, style, hoverIcon, ...rest } = this.props
        const iconOptions = {
                                size: size || "2x",
                                name: this.state.currentIcon,
                                style: extendObject({color: 'white'}, style),
                            }

        return  <FontAwesome
                    {...rest}
                    {...iconOptions}
                    onMouseEnter={this.toggleHoverIcon.bind(this, true)}
                    onMouseLeave={this.toggleHoverIcon.bind(this, false)}
                />
    }
}

Icon.propTypes = {
    hoverIcon: PropTypes.string
}

export default Icon