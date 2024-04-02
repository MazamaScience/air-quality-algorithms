"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pm_nowcast = pm_nowcast;
var _utils = require("./utils.js");
/**
 * Returns an array of NowCast values derived from the incoming time series.
 *
 * **NOTE:** Incoming data must be on an hourly axis with no gaps. Missing
 * values should be represented by 'null'.
 *
 * @param {Array.<number>} pm Array of hourly PM2.5 or PM10  measurements.
 * @returns {Array.<number>} Array of NowCast values.
 */
function pm_nowcast(pm) {
  // TODO: Validate that pm is numeric
  // See:  https://observablehq.com/@openaq/epa-pm-nowcast
  var nowcast = Array(pm.length);
  for (var i = 0; i < pm.length; i++) {
    var end = i + 1;
    var start = end < 12 ? 0 : end - 12;
    nowcast[i] = nowcastPM(pm.slice(start, end));
  }

  // Round to one decimal place and use null as the missing value
  nowcast = (0, _utils.roundAndUseNull)(nowcast);
  return nowcast;
}

/**
 * Convert an array of up to 12 PM2.5 or PM10 measurements in chronological order
 * into a single NowCast value.
 *
 * **NOTE:** Incoming data must be on an hourly axis with no gaps.  Missing
 * values should be represented by 'null'.
 *
 * @private
 * @param {Array.<number>} x Array of 12 hourly values in chronological order.
 * @returns {number} NowCast value.
 */
function nowcastPM(x) {
  // NOTE:  We don't insist on 12 hours of data. Convert single values into arrays.
  if (typeof x === "number") x = [x];

  // NOTE:  map/reduce syntax: a: accumulator; o: object; i: index

  // NOTE:  The algorithm below assumes reverse chronological order.
  // NOTE:  WARNING:  In javascript `null * 1 = 0` which messes up things in
  // NOTE:  our mapping functions. So we convert all null to NaN
  // NOTE:  and then back to null upon return.
  x = x.reverse().map(function (o) {
    return o === null ? NaN : o;
  });

  // Check for recent values;
  var recentValidCount = x.slice(0, 3).reduce(function (a, o) {
    return Number.isNaN(o) ? a : a + 1;
  }, 0);
  if (recentValidCount < 2) return null;
  var validIndices = x.reduce(function (a, o, i) {
    return Number.isNaN(o) ? a : a.concat(i);
  }, []);

  // NOTE:  max and min calculations need to be tolerant of missing values
  var max = x.filter(function (o) {
    return !Number.isNaN(o);
  }).reduce(function (a, o) {
    return o > a ? o : a;
  });
  var min = x.filter(function (o) {
    return !Number.isNaN(o);
  }).reduce(function (a, o) {
    return o < a ? o : a;
  });
  var scaledRateOfChange = (max - min) / max;
  var weightFactor = 1 - scaledRateOfChange < 0.5 ? 0.5 : 1 - scaledRateOfChange;

  // TODO:  Check for any valid values before attempting to reduce.
  // TODO:  If all NaN, then simply return null.

  var weightedValues = x.map(function (o, i) {
    return o * Math.pow(weightFactor, i);
  }) // maps onto an array including NaN
  .filter(function (x) {
    return !Number.isNaN(x);
  }); // remove NaN before calculating sum

  var weightedSum = null;
  if (weightedValues.length == 0) {
    return null;
  } else {
    weightedSum = weightedValues.reduce(function (a, o) {
      return a + o;
    });
  }
  var weightFactorSum = validIndices.map(function (o) {
    return Math.pow(weightFactor, o);
  }).reduce(function (a, o) {
    return a + o;
  });
  var returnVal = parseFloat((weightedSum / weightFactorSum).toFixed(1));

  // Convert NaN back to null
  returnVal = Number.isNaN(returnVal) ? null : returnVal;
  return returnVal;
}