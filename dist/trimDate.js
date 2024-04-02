"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.trimDate = trimDate;
var _momentTimezone = _interopRequireDefault(require("moment-timezone"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
/**
 * Returns an object trimmed to full local time days. Any partial days are
 * discarded. The returned object contains two properties:
 *
 * * datetime -- the original datetime array trimmed to full days
 * * x -- the original x array trimmed to full days
 *
 * @param {Array.<Date>} datetime Regular hourly axis representing the time associated
 * with each measurement.
 * @param {Array.<number>} x Array of hourly measurements.
 * @param {string} timezone Olson time zone to use as "local time".
 * @returns {object} Object with `datetime` and `x` properties.
 */
function trimDate(datetime, x, timezone) {
  // TODO:  Validate parameters
  // Calculate local time hours and start/end
  var localTime = datetime.map(function (o) {
    return _momentTimezone["default"].tz(o, timezone);
  });
  var hours = localTime.map(function (o) {
    return o.hours();
  });
  var start = hours[0] === 0 ? 0 : 24 - hours[0];
  var end = hours[hours.length - 1] === 23 ? hours.length : hours.length - hours[hours.length - 1] - 1;
  var trimmed_datetime = datetime.slice(start, end);
  var trimmed_x = x.slice(start, end);
  return {
    datetime: trimmed_datetime,
    x: trimmed_x
  };
}