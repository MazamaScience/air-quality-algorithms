"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.diurnalStats = diurnalStats;
var _momentTimezone = _interopRequireDefault(require("moment-timezone"));
var _trimDate = require("./trimDate.js");
var _utils = require("./utils.js");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
/**
 * Calculates diurnal averages for the time series specified by `datetime` and `x`.
 *
 * The returned object contains two properties:
 * * hour -- Array of local time hours [0-24].
 * * count -- Array of hour-of-day counts of non-missing values.
 * * min -- Array of hour-of-day minimum values.
 * * mean -- Array of hour-of-day mean values.
 * * max -- Array of hour-of-day maximum values
 *
 * By default, statistics are calculated using data from the most recent 7 days
 * in the `datetime` array.
 *
 * @param {Array.<Date>} datetime Regular hourly axis (no missing hours)
 * representing the time associated with each measurement.
 * @param {Array.<number>} x Array of hourly measurements.
 * @param {string} timezone Olson time zone to use as "local time".
 * @param {number} dayCount Number of most recent days to use.
 * @returns {object} Object with `hour`, `count`, `min`, `mean` and `max` properties.
 */
function diurnalStats(datetime, x, timezone) {
  var dayCount = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 7;
  // Start by trimming to full days in the local timezone
  var trimmed = (0, _trimDate.trimDate)(datetime, x, timezone);

  // Use the most recent dayCount days
  var fullDayCount = trimmed.datetime.length / 24;
  dayCount = fullDayCount < dayCount ? fullDayCount : dayCount;
  var startIndex = trimmed.datetime.length - dayCount * 24;
  var localTime = trimmed.datetime.map(function (o) {
    return _momentTimezone["default"].tz(o, timezone);
  });
  var hours = localTime.map(function (o) {
    return o.hours();
  });
  var value = (0, _utils.useNull)(trimmed.x);
  var validValue = value.map(function (o) {
    return o === null ? 0 : 1;
  });
  var hour = [];
  var hourly_count = [];
  var hourly_min = [];
  var hourly_mean = [];
  var hourly_max = [];

  // For each hour, average together the contributions from each day
  for (var h = 0; h < 24; h++) {
    var min = Number.MAX_VALUE;
    var max = Number.MIN_VALUE;
    var count = 0;
    var sum = null;
    for (var d = 0; d < dayCount; d++) {
      var index = startIndex + h + d * 24;
      if (validValue[index] === 1) {
        min = value[index] < min ? value[index] : min;
        max = value[index] > max ? value[index] : max;
        count += 1;
        sum += value[index];
      }
    }
    hour[h] = h;
    hourly_min[h] = min === Number.MAX_VALUE ? null : min;
    hourly_max[h] = max === Number.MIN_VALUE ? null : max;
    hourly_count[h] = count;
    hourly_mean[h] = sum === null ? null : sum / count;
  }
  hourly_min = (0, _utils.roundAndUseNull)(hourly_min);
  hourly_mean = (0, _utils.roundAndUseNull)(hourly_mean);
  hourly_max = (0, _utils.roundAndUseNull)(hourly_max);
  return {
    hour: hour,
    count: hourly_count,
    min: hourly_min,
    mean: hourly_mean,
    max: hourly_max
  };
}