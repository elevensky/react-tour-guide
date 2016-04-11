'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Indicator = function (_Component) {
  _inherits(Indicator, _Component);

  function Indicator() {
    _classCallCheck(this, Indicator);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Indicator).apply(this, arguments));
  }

  _createClass(Indicator, [{
    key: 'render',
    value: function render() {
      var styles = {
        'position': this.props.cssPosition === 'fixed' ? 'fixed' : 'absolute',
        'top': this.props.yPos,
        'left': this.props.xPos
      };

      return _react2.default.createElement('div', { className: 'tour-indicator', style: styles, onClick: this.props.handleIndicatorClick });
    }
  }]);

  return Indicator;
}(_react.Component);

exports.default = Indicator;


Indicator.PropTypes = {
  cssPosition: _react.PropTypes.string.isRequired,
  xPos: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.string]).isRequired,
  yPos: _react.PropTypes.oneOfType([_react.PropTypes.number, _react.PropTypes.string]).isRequired,
  handleIndicatorClick: _react.PropTypes.func.isRequired
};

Indicator.getDefaultProps = {
  cssPosition: 'absolute',
  xPos: -1000,
  yPos: -1000
};