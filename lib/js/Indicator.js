import React, { Component, PropTypes } from 'react';

export default class Indicator extends Component {

  render() {
    var styles = {
      'position': this.props.cssPosition === 'fixed' ? 'fixed' : 'absolute',
      'top': this.props.yPos,
      'left': this.props.xPos
    }

    return (
      <div className="tour-indicator" style={styles} onClick={this.props.handleIndicatorClick} />
    )
  }
}

Indicator.PropTypes = {
  cssPosition: PropTypes.string.isRequired,
  xPos: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ]).isRequired,
  yPos: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ]).isRequired,
  handleIndicatorClick: PropTypes.func.isRequired
}

Indicator.getDefaultProps = {
  cssPosition: 'absolute',
  xPos: -1000,
  yPos: -1000
}