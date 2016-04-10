import React, { Component, PropTypes } from 'react';

export default class Tooltip extends Component {

  render() {
    var styles = {
      'position': this.props.cssPosition === 'fixed' ? 'fixed' : 'absolute',
      'top': this.props.yPos,
      'left': this.props.xPos
    };

    return (
      <div>
        <div className="tour-backdrop" onClick={this.props.closeTooltip} />
        <div className="tour-tooltip" style={styles}>
          <p>{this.props.text || ''}</p>
          <div className="tour-btn close" onClick={this.props.closeTooltip}>
            {this.props.closeButtonText || 'Close'}
          </div>
        </div>
      </div>
    );
  }

};

Tooltip.PropTypes = {
  cssPosition: PropTypes.string.isRequired,
  xPos: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ]).isRequired,
  yPos: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ]).isRequired,
  text: PropTypes.string.isRequired,
  closeButtonText: PropTypes.string,
  closeTooltip: PropTypes.func.isRequired
}

Tooltip.getDefaultProps = {
  cssPosition: 'absolute',
  xPos: -1000,
  yPos: -1000,
  text: ''
}