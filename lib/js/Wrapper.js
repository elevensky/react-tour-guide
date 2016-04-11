import React, { Component, PropTypes } from 'react';
import ReactDOM from "react-dom";
import $ from 'jquery';

import Indicator from './Indicator';
import Tooltip from './Tooltip';

if (!Object.assign) {
  Object.defineProperty(Object, "assign", {
    enumerable: false,
    configurable: true,
    writable: true,
    value: function(target, firstSource) {
      if (target === undefined || target === null)
        throw new TypeError("Cannot convert first argument to object");
      var to = Object(target);
      for (var i = 1; i < arguments.length; i++) {
        var nextSource = arguments[i];
        if (nextSource === undefined || nextSource === null) continue;
        var keysArray = Object.keys(Object(nextSource));
        for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
          var nextKey = keysArray[nextIndex];
          var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
          if (desc !== undefined && desc.enumerable) to[nextKey] = nextSource[nextKey];
        }
      }
      return to;
    }
  });
}

export function withTour(settings, done) {
  return (ComposedComponent) => class extends Component {
    constructor(props) {
      super(props);
      this.settings = Object.assign({
        startIndex: 0,
        scrollToSteps: true,
        steps: []
      }, settings);
      this.state = {
        currentIndex: this.settings.startIndex,
        showTooltip: false,
        xPos: -1000,
        yPos: -1000
      };
    }

    completionCallback = done || function() { }

    _renderLayer = () => {
      // By calling this method in componentDidMount() and componentDidUpdate(), you're effectively
      // creating a "wormhole" that funnels React's hierarchical updates through to a DOM node on an
      // entirely different part of the page.
      this.setState({ xPos: -1000, yPos: -1000 });
      ReactDOM.render(this.renderCurrentStep(), this._target);
      this.calculatePlacement();
    }

    _unrenderLayer = () => {
      ReactDOM.unmountComponentAtNode(this._target);
    }

    componentDidUpdate(prevProps, prevState) {
      var hasNewIndex = this.state.currentIndex !== prevState.currentIndex;
      var hasNewStep = !!this.settings.steps[this.state.currentIndex];
      var hasNewX = this.state.xPos !== prevState.xPos;
      var hasNewY = this.state.yPos !== prevState.yPos;
      var didToggleTooltip = this.state.showTooltip && this.state.showTooltip !== prevState.showTooltip;

      if ( (hasNewIndex && hasNewStep) || didToggleTooltip || hasNewX || hasNewY ) {
        this._renderLayer();
      } else if ( !hasNewStep ) {
        this.completionCallback();
        this._unrenderLayer();
      }
    }

    componentDidMount() {
      if ( this.settings.steps[this.state.currentIndex] ) {
        this._target = document.createElement('div');
        document.body.appendChild(this._target);
        this._renderLayer();
      }
      window.addEventListener('resize', this.handleResize);
    }

    componentWillUnmount = () => {
      this._unrenderLayer();
      document.body.removeChild(this._target);
      window.removeEventListener('resize', this.calculatePlacement);
    }

    setTourSteps = (steps, cb) => {
      cb = cb || function() {};

      this.setState(this.state, function() {
        this.settings.steps = steps;
        cb();
      }.bind(this));
    }

    getUserTourProgress = () => {
      return {
        index: this.state.currentIndex,
        percentageComplete: (this.state.currentIndex/this.settings.steps.length)*100,
        step: this.settings.steps[this.state.currentIndex]
      };
    }

    preventWindowOverflow = (value, axis, elWidth, elHeight) => {
      var winWidth = parseInt($(window).width());
      var docHeight = parseInt($(document).height());

      void 0;
      void 0;

      if ( axis.toLowerCase() === 'x' ) {
        if ( value + elWidth > winWidth ) {
          void 0;
          value = winWidth - elWidth;
        } else if ( value < 0 ) {
          void 0;
          value = 0;
        }
      } else if ( axis.toLowerCase() === 'y' ) {
        if ( value + elHeight > docHeight ) {
          void 0;
          value = docHeight - elHeight;
        } else if ( value < 0 ) {
          void 0;
          value = 0;
        }
      }

      return value;
    }

    calculatePlacement = () => {
      var step = this.settings.steps[this.state.currentIndex];
      var $target = $(step.element);
      var offset = $target.offset();
      var targetWidth = $target.outerWidth();
      var targetHeight = $target.outerHeight();
      var position = step.position.toLowerCase();
      var topRegex = new RegExp('top', 'gi');
      var bottomRegex = new RegExp('bottom', 'gi');
      var leftRegex = new RegExp('left', 'gi');
      var rightRegex = new RegExp('right', 'gi');
      var $element = this.state.showTooltip ? $('.tour-tooltip') : $('.tour-indicator');
      var elWidth = $element.outerWidth();
      var elHeight = $element.outerHeight();
      var placement = {
        x: -1000,
        y: -1000
      };

      // Calculate x position
      if ( leftRegex.test(position) ) {
        placement.x = offset.left - elWidth/2;
      } else if ( rightRegex.test(position) ) {
        placement.x = offset.left + targetWidth - elWidth/2;
      } else {
        placement.x = offset.left + targetWidth/2 - elWidth/2;
      }

      // Calculate y position
      if ( topRegex.test(position) ) {
        placement.y = offset.top - elHeight/2;
      } else if ( bottomRegex.test(position) ) {
        placement.y = offset.top + targetHeight - elHeight/2;
      } else {
        placement.y = offset.top + targetHeight/2 - elHeight/2;
      }

      this.setState({
        xPos: this.preventWindowOverflow(placement.x, 'x', elWidth, elHeight),
        yPos: this.preventWindowOverflow(placement.y, 'y', elWidth, elHeight)
      });
    }

    handleIndicatorClick = (evt) => {
      evt.preventDefault();

      this.setState({ showTooltip: true });
    }

    closeTooltip = (evt) => {
      evt.preventDefault();

      this.setState({
        showTooltip: false,
        currentIndex: this.state.currentIndex + 1
      }, this.scrollToNextStep);
    }

    scrollToNextStep = () => {
      var $nextIndicator = $('.tour-indicator');

      if ( $nextIndicator && $nextIndicator.length && this.settings.scrollToSteps ) {
        $('html, body').animate({
          'scrollTop': $nextIndicator.offset().top - $(window).height()/2
        }, 500);
      }

      void 0;
    }

    renderCurrentStep = () => {
      var element = null;
      var currentStep = this.settings.steps[this.state.currentIndex];
      var $target = currentStep && currentStep.element ? $(currentStep.element) : null;
      var cssPosition = $target ? $target.css('position') : null;

      if ( $target && $target.length ) {
        if ( this.state.showTooltip ) {
          element = (
            React.createElement(Tooltip, {cssPosition: cssPosition,
                     xPos: this.state.xPos,
                     yPos: this.state.yPos,
                     text: currentStep.text,
                     closeTooltip: this.closeTooltip})
          );
        } else {
          element = (
            React.createElement(Indicator, {cssPosition: cssPosition,
                       xPos: this.state.xPos,
                       yPos: this.state.yPos,
                       handleIndicatorClick: this.handleIndicatorClick})
          );
        }
      }

      return element;
    }

    render() {
      return <ComposedComponent  {...this.props} />;
    }
  }
}