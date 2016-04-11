'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.withTour = withTour;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _Indicator = require('./Indicator');

var _Indicator2 = _interopRequireDefault(_Indicator);

var _Tooltip = require('./Tooltip');

var _Tooltip2 = _interopRequireDefault(_Tooltip);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

if (!Object.assign) {
  Object.defineProperty(Object, "assign", {
    enumerable: false,
    configurable: true,
    writable: true,
    value: function value(target, firstSource) {
      if (target === undefined || target === null) throw new TypeError("Cannot convert first argument to object");
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

function withTour(settings, done) {
  return function (ComposedComponent) {
    return function (_Component) {
      _inherits(_class2, _Component);

      function _class2(props) {
        _classCallCheck(this, _class2);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(_class2).call(this, props));

        _this.completionCallback = function (done) {
          done || function () {};
        };

        _this._renderLayer = function () {
          // By calling this method in componentDidMount() and componentDidUpdate(), you're effectively
          // creating a "wormhole" that funnels React's hierarchical updates through to a DOM node on an
          // entirely different part of the page.
          _this.setState({ xPos: -1000, yPos: -1000 });
          _reactDom2.default.render(_this.renderCurrentStep(), _this._target);
          _this.calculatePlacement();
        };

        _this._unrenderLayer = function () {
          _reactDom2.default.unmountComponentAtNode(_this._target);
        };

        _this.componentWillUnmount = function () {
          _this._unrenderLayer();
          document.body.removeChild(_this._target);
          window.removeEventListener('resize', _this.calculatePlacement);
        };

        _this.setTourSteps = function (steps, cb) {
          cb = cb || function () {};

          _this.setState(_this.state, function () {
            this.settings.steps = steps;
            cb();
          }.bind(_this));
        };

        _this.getUserTourProgress = function () {
          return {
            index: _this.state.currentIndex,
            percentageComplete: _this.state.currentIndex / _this.settings.steps.length * 100,
            step: _this.settings.steps[_this.state.currentIndex]
          };
        };

        _this.preventWindowOverflow = function (value, axis, elWidth, elHeight) {
          var winWidth = parseInt((0, _jquery2.default)(window).width());
          var docHeight = parseInt((0, _jquery2.default)(document).height());

          void 0;
          void 0;

          if (axis.toLowerCase() === 'x') {
            if (value + elWidth > winWidth) {
              void 0;
              value = winWidth - elWidth;
            } else if (value < 0) {
              void 0;
              value = 0;
            }
          } else if (axis.toLowerCase() === 'y') {
            if (value + elHeight > docHeight) {
              void 0;
              value = docHeight - elHeight;
            } else if (value < 0) {
              void 0;
              value = 0;
            }
          }

          return value;
        };

        _this.calculatePlacement = function () {
          var step = _this.settings.steps[_this.state.currentIndex];
          var $target = (0, _jquery2.default)(step.element);
          var offset = $target.offset();
          var targetWidth = $target.outerWidth();
          var targetHeight = $target.outerHeight();
          var position = step.position.toLowerCase();
          var topRegex = new RegExp('top', 'gi');
          var bottomRegex = new RegExp('bottom', 'gi');
          var leftRegex = new RegExp('left', 'gi');
          var rightRegex = new RegExp('right', 'gi');
          var $element = _this.state.showTooltip ? (0, _jquery2.default)('.tour-tooltip') : (0, _jquery2.default)('.tour-indicator');
          var elWidth = $element.outerWidth();
          var elHeight = $element.outerHeight();
          var placement = {
            x: -1000,
            y: -1000
          };

          // Calculate x position
          if (leftRegex.test(position)) {
            placement.x = offset.left - elWidth / 2;
          } else if (rightRegex.test(position)) {
            placement.x = offset.left + targetWidth - elWidth / 2;
          } else {
            placement.x = offset.left + targetWidth / 2 - elWidth / 2;
          }

          // Calculate y position
          if (topRegex.test(position)) {
            placement.y = offset.top - elHeight / 2;
          } else if (bottomRegex.test(position)) {
            placement.y = offset.top + targetHeight - elHeight / 2;
          } else {
            placement.y = offset.top + targetHeight / 2 - elHeight / 2;
          }

          _this.setState({
            xPos: _this.preventWindowOverflow(placement.x, 'x', elWidth, elHeight),
            yPos: _this.preventWindowOverflow(placement.y, 'y', elWidth, elHeight)
          });
        };

        _this.handleIndicatorClick = function (evt) {
          evt.preventDefault();

          _this.setState({ showTooltip: true });
        };

        _this.closeTooltip = function (evt) {
          evt.preventDefault();

          _this.setState({
            showTooltip: false,
            currentIndex: _this.state.currentIndex + 1
          }, _this.scrollToNextStep);
        };

        _this.scrollToNextStep = function () {
          var $nextIndicator = (0, _jquery2.default)('.tour-indicator');

          if ($nextIndicator && $nextIndicator.length && _this.settings.scrollToSteps) {
            (0, _jquery2.default)('html, body').animate({
              'scrollTop': $nextIndicator.offset().top - (0, _jquery2.default)(window).height() / 2
            }, 500);
          }

          void 0;
        };

        _this.renderCurrentStep = function () {
          var element = null;
          var currentStep = _this.settings.steps[_this.state.currentIndex];
          var $target = currentStep && currentStep.element ? (0, _jquery2.default)(currentStep.element) : null;
          var cssPosition = $target ? $target.css('position') : null;

          if ($target && $target.length) {
            if (_this.state.showTooltip) {
              element = _react2.default.createElement(_Tooltip2.default, { cssPosition: cssPosition,
                xPos: _this.state.xPos,
                yPos: _this.state.yPos,
                text: currentStep.text,
                closeTooltip: _this.closeTooltip });
            } else {
              element = _react2.default.createElement(_Indicator2.default, { cssPosition: cssPosition,
                xPos: _this.state.xPos,
                yPos: _this.state.yPos,
                handleIndicatorClick: _this.handleIndicatorClick });
            }
          }

          return element;
        };

        _this.settings = Object.assign({
          startIndex: 0,
          scrollToSteps: true,
          steps: []
        }, settings);
        _this.state = {
          currentIndex: _this.settings.startIndex,
          showTooltip: false,
          xPos: -1000,
          yPos: -1000
        };
        return _this;
      }

      _createClass(_class2, [{
        key: 'componentDidUpdate',
        value: function componentDidUpdate(prevProps, prevState) {
          var hasNewIndex = this.state.currentIndex !== prevState.currentIndex;
          var hasNewStep = !!this.settings.steps[this.state.currentIndex];
          var hasNewX = this.state.xPos !== prevState.xPos;
          var hasNewY = this.state.yPos !== prevState.yPos;
          var didToggleTooltip = this.state.showTooltip && this.state.showTooltip !== prevState.showTooltip;

          if (hasNewIndex && hasNewStep || didToggleTooltip || hasNewX || hasNewY) {
            this._renderLayer();
          } else if (!hasNewStep) {
            this.completionCallback();
            this._unrenderLayer();
          }
        }
      }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
          if (this.settings.steps[this.state.currentIndex]) {
            this._target = document.createElement('div');
            document.body.appendChild(this._target);
            this._renderLayer();
          }
          window.addEventListener('resize', this.handleResize);
        }
      }, {
        key: 'render',
        value: function render() {
          return _react2.default.createElement(ComposedComponent, this.props);
        }
      }]);

      return _class2;
    }(_react.Component);
  };
}