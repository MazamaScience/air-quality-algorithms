"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dailyStats = dailyStats;
var _momentTimezone = _interopRequireDefault(require("moment-timezone"));
var _trimDate = require("./trimDate.js");
var _utils = require("./utils.js");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
/**
 * Calculates daily statistics for the time series specified by `datetime` and `x`.
 *
 * The returned object contains five properties:
 * * datetime -- Array of date objects specifying the starting hour of each day.
 * * count -- Array of daily counts of non-missing values.
 * * min -- Array of daily minimum values.
 * * mean -- Array of daily mean values.
 * * max -- Array of daily maximum values.
 *
 * @param {Array.<Date>} datetime Regular hourly axis (no missing hours)
 * representing the time associated with each measurement.
 * @param {Array.<number>} x Array of hourly measurements.
 * @param {string} timezone Olson time zone to use as "local time".
 * @returns {object} An object with `datetime`, `count`, `min`, `mean` and `max`
 * properties.
 */
function dailyStats(datetime, x, timezone) {
  // Start by trimming to full days in the local timezone
  var trimmed = (0, _trimDate.trimDate)(datetime, x, timezone);

  // TODO: Add support for minCount valid values and partial days.

  var dayCount = trimmed.datetime.length / 24;
  var daily_datetime = [];
  var daily_count = [];
  var daily_min = [];
  var daily_mean = [];
  var daily_max = [];
  for (var i = 0; i < dayCount; i++) {
    var start = i * 24;
    var end = i * 24 + 24;
    // NOTE:  Values are assigned to the start of the day.
    daily_datetime[i] = trimmed.datetime[start];
    // NOTE:  Stats involve values from start to end of the day.
    var values = trimmed.x.slice(start, end);
    daily_count[i] = (0, _utils.arrayCount)(values);
    daily_min[i] = (0, _utils.arrayMin)(values);
    daily_mean[i] = (0, _utils.arrayMean)(values);
    daily_max[i] = (0, _utils.arrayMax)(values);
  }

  // Round to one decimal place and use null as the missing value
  daily_count = (0, _utils.roundAndUseNull)(daily_count, 0);
  daily_min = (0, _utils.roundAndUseNull)(daily_min);
  daily_mean = (0, _utils.roundAndUseNull)(daily_mean);
  daily_max = (0, _utils.roundAndUseNull)(daily_max);
  return {
    datetime: daily_datetime,
    count: daily_count,
    min: daily_min,
    mean: daily_mean,
    max: daily_max
  };
}