"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.arrayCount = arrayCount;
exports.arrayMax = arrayMax;
exports.arrayMean = arrayMean;
exports.arrayMin = arrayMin;
exports.arraySum = arraySum;
exports.roundAndUseNull = roundAndUseNull;
exports.useNull = useNull;
/**
 * Convert an array of values to an array rounded to `digits` decimal places
 * and using `null` as the default missing value. Missing values are
 * any members of `x` with values of `undefined`, `NaN` or `null`.
 *
 * @param {Array.<number>} x Array of values.
 * @param {number} digits Number of digits to retain after the decimal point.
 * @returns {Array.<number>} Array of values.
 */
function roundAndUseNull(x) {
  var digits = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  var factor = Math.pow(10, digits);
  var x_rounded = x.map(function (o) {
    return o === null || o === undefined || isNaN(o) ? null : Math.round(factor * o) / factor;
  });
  return x_rounded;
}

/**
 * Convert an array of values to an array where all values of `undefined` or
 * `NaN` have been replaced by `null`.
 *
 * @param {Array.<number>} x Array of values.
 * @returns {Array.<number>} Array of values.
 */
function useNull(x) {
  var x_null = x.map(function (o) {
    return o === null || o === undefined || isNaN(o) ? null : o;
  });
  return x_null;
}

/**
 * Return the minimum value in an array, ignoring any non-numeric values such as
 * `NaN` or `null`. If all values are non-numeric, `null` is returned.
 *
 * @param {Array.<number>} x Array of values.
 * @returns {number|null} Minimum numeric value or null.
 */
function arrayMin(x) {
  // https://stackoverflow.com/questions/19279852/how-to-skip-nan-when-using-math-min-apply
  var FUN = function FUN(a, o) {
    return o === null || o > a ? a : o;
  };
  var value = useNull(x).reduce(FUN, Number.MAX_VALUE);
  if (value === Number.MAX_VALUE) {
    value = null;
  }
  return value;
}

/**
 * Return the maximum value in an array, ignoring any non-numeric values such as
 * `NaN` or `null`. If all values are non-numeric, `null` is returned.
 *
 * @param {Array.<number>} x Array of values.
 * @returns {number|null} Maximum numeric value or null.
 */
function arrayMax(x) {
  // https://stackoverflow.com/questions/19279852/how-to-skip-nan-when-using-math-min-apply
  var FUN = function FUN(a, o) {
    return o === null || o < a ? a : o;
  };
  var value = useNull(x).reduce(FUN, Number.MIN_VALUE);
  if (value === Number.MIN_VALUE) {
    value = null;
  }
  return value;
}

/**
 * Return the count of valid values an array, ignoring any non-numeric values
 * such as `NaN` or `null`.
 *
 * @param {Array.<number>} x Array of values.
 * @returns {number} Count of numeric values.
 */
function arrayCount(x) {
  var FUN = function FUN(a, o) {
    return o === null ? a : a + 1;
  };
  var value = useNull(x).reduce(FUN, 0);
  return value;
}

/**
 * Return the sum of an array, ignoring any non-numeric values such as
 * `NaN` or `null`. If all values are non-numeric, `null` is returned.
 *
 * @param {Array.<number>} x Array of values.
 * @returns {number|null} Sum of numeric values or null.
 */
function arraySum(x) {
  var FUN = function FUN(a, o) {
    return o === null ? a : a + o;
  };
  var value = useNull(x).reduce(FUN, null);
  return value;
}

/**
 * Return the mean of an array, ignoring any non-numeric values such as
 * `NaN` or `null`. If all values are non-numeric, `null` is returned.
 *
 * @param {Array.<number>} x Array of values.
 * @returns {number|null} Mean of numeric values or null.
 */
function arrayMean(x) {
  var count = arrayCount(x);
  if (count === 0) {
    return null;
  } else {
    var value = arraySum(x) / count;
    return value;
  }
}