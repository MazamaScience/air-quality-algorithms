/**
 * Convert an array of values to an array rounded to `digits` decimal places
 * and using `null` as the default missing value. Missing values are
 * any members of `x` with values of `undefined`, `NaN` or `null`.
 *
 * @param {Array.<number>} x Array of values.
 * @param {number} digits Number of digits to retain after the decimal point.
 * @returns {Array.<number>} Array of values.
 */
export function roundAndUseNull(x, digits = 1) {
  let factor = Math.pow(10, digits);
  let x_rounded = x.map((o) =>
    o === null || o === undefined || isNaN(o)
      ? null
      : Math.round(factor * o) / factor
  );
  return x_rounded;
}

/**
 * Convert an array of values to an array where all values of `undefined` or
 * `NaN` have been replaced by `null`.
 *
 * @param {Array.<number>} x Array of values.
 * @returns {Array.<number>} Array of values.
 */
export function useNull(x) {
  let x_null = x.map((o) =>
    o === null || o === undefined || isNaN(o) ? null : o
  );
  return x_null;
}

/**
 * Return the minimum value in an array, ignoring any non-numeric values such as
 * `NaN` or `null`. If all values are non-numeric, `null` is returned.
 *
 * @param {Array.<number>} x Array of values.
 * @returns {number|null} Minimum numeric value or null.
 */
export function arrayMin(x) {
  // https://stackoverflow.com/questions/19279852/how-to-skip-nan-when-using-math-min-apply
  const FUN = function (a, o) {
    return o === null || o > a ? a : o;
  };
  let value = useNull(x).reduce(FUN, Number.MAX_VALUE);
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
export function arrayMax(x) {
  // https://stackoverflow.com/questions/19279852/how-to-skip-nan-when-using-math-min-apply
  const FUN = function (a, o) {
    return o === null || o < a ? a : o;
  };
  let value = useNull(x).reduce(FUN, Number.MIN_VALUE);
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
export function arrayCount(x) {
  const FUN = function (a, o) {
    return o === null ? a : a + 1;
  };
  let value = useNull(x).reduce(FUN, 0);
  return value;
}

/**
 * Return the sum of an array, ignoring any non-numeric values such as
 * `NaN` or `null`. If all values are non-numeric, `null` is returned.
 *
 * @param {Array.<number>} x Array of values.
 * @returns {number|null} Sum of numeric values or null.
 */
export function arraySum(x) {
  const FUN = function (a, o) {
    return o === null ? a : a + o;
  };
  let value = useNull(x).reduce(FUN, null);
  return value;
}

/**
 * Return the mean of an array, ignoring any non-numeric values such as
 * `NaN` or `null`. If all values are non-numeric, `null` is returned.
 *
 * @param {Array.<number>} x Array of values.
 * @returns {number|null} Mean of numeric values or null.
 */
export function arrayMean(x) {
  let count = arrayCount(x);
  if (count === 0) {
    return null;
  } else {
    let value = arraySum(x) / count;
    return value;
  }
}
