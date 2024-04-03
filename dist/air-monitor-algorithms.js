(function (exports, moment) {
  'use strict';

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
    let localTime = datetime.map((o) => moment.tz(o, timezone));
    let hours = localTime.map((o) => o.hours());
    let start = hours[0] === 0 ? 0 : 24 - hours[0];
    let end =
      hours[hours.length - 1] === 23
        ? hours.length
        : hours.length - hours[hours.length - 1] - 1;

    let trimmed_datetime = datetime.slice(start, end);
    let trimmed_x = x.slice(start, end);

    return {
      datetime: trimmed_datetime,
      x: trimmed_x,
    };
  }

  /**
   * Convert an array of values to an array rounded to `digits` decimal places
   * and using `null` as the default missing value. Missing values are
   * any members of `x` with values of `undefined`, `NaN` or `null`.
   *
   * @param {Array.<number>} x Array of values.
   * @param {number} digits Number of digits to retain after the decimal point.
   * @returns {Array.<number>} Array of values.
   */
  function roundAndUseNull(x, digits = 1) {
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
  function useNull(x) {
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
  function arrayMin(x) {
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
  function arrayMax(x) {
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
  function arrayCount(x) {
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
  function arraySum(x) {
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
  function arrayMean(x) {
    let count = arrayCount(x);
    if (count === 0) {
      return null;
    } else {
      let value = arraySum(x) / count;
      return value;
    }
  }

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
    let trimmed = trimDate(datetime, x, timezone);

    // TODO: Add support for minCount valid values and partial days.

    let dayCount = trimmed.datetime.length / 24;

    let daily_datetime = [];
    let daily_count = [];
    let daily_min = [];
    let daily_mean = [];
    let daily_max = [];

    for (let i = 0; i < dayCount; i++) {
      let start = i * 24;
      let end = i * 24 + 24;
      // NOTE:  Values are assigned to the start of the day.
      daily_datetime[i] = trimmed.datetime[start];
      // NOTE:  Stats involve values from start to end of the day.
      let values = trimmed.x.slice(start, end);
      daily_count[i] = arrayCount(values);
      daily_min[i] = arrayMin(values);
      daily_mean[i] = arrayMean(values);
      daily_max[i] = arrayMax(values);
    }

    // Round to one decimal place and use null as the missing value
    daily_count = roundAndUseNull(daily_count, 0);
    daily_min = roundAndUseNull(daily_min);
    daily_mean = roundAndUseNull(daily_mean);
    daily_max = roundAndUseNull(daily_max);

    return {
      datetime: daily_datetime,
      count: daily_count,
      min: daily_min,
      mean: daily_mean,
      max: daily_max,
    };
  }

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
  function diurnalStats(datetime, x, timezone, dayCount = 7) {
    // Start by trimming to full days in the local timezone
    let trimmed = trimDate(datetime, x, timezone);

    // Use the most recent dayCount days
    let fullDayCount = trimmed.datetime.length / 24;
    dayCount = fullDayCount < dayCount ? fullDayCount : dayCount;
    let startIndex = trimmed.datetime.length - dayCount * 24;

    let localTime = trimmed.datetime.map((o) => moment.tz(o, timezone));
    localTime.map((o) => o.hours());

    let value = useNull(trimmed.x);
    let validValue = value.map((o) => (o === null ? 0 : 1));

    let hour = [];
    let hourly_count = [];
    let hourly_min = [];
    let hourly_mean = [];
    let hourly_max = [];

    // For each hour, average together the contributions from each day
    for (let h = 0; h < 24; h++) {
      let min = Number.MAX_VALUE;
      let max = Number.MIN_VALUE;
      let count = 0;
      let sum = null;
      for (let d = 0; d < dayCount; d++) {
        let index = startIndex + h + d * 24;
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

    hourly_min = roundAndUseNull(hourly_min);
    hourly_mean = roundAndUseNull(hourly_mean);
    hourly_max = roundAndUseNull(hourly_max);

    return {
      hour: hour,
      count: hourly_count,
      min: hourly_min,
      mean: hourly_mean,
      max: hourly_max,
    };
  }

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
    let nowcast = Array(pm.length);
    for (let i = 0; i < pm.length; i++) {
      let end = i + 1;
      let start = end < 12 ? 0 : end - 12;
      nowcast[i] = nowcastPM(pm.slice(start, end));
    }

    // Round to one decimal place and use null as the missing value
    nowcast = roundAndUseNull(nowcast);

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
    x = x.reverse().map((o) => (o === null ? NaN : o));

    // Check for recent values;
    let recentValidCount = x
      .slice(0, 3)
      .reduce((a, o) => (Number.isNaN(o) ? a : a + 1), 0);
    if (recentValidCount < 2) return null;

    let validIndices = x.reduce(
      (a, o, i) => (Number.isNaN(o) ? a : a.concat(i)),
      []
    );

    // NOTE:  max and min calculations need to be tolerant of missing values
    let max = x.filter((o) => !Number.isNaN(o)).reduce((a, o) => (o > a ? o : a));
    let min = x.filter((o) => !Number.isNaN(o)).reduce((a, o) => (o < a ? o : a));
    let scaledRateOfChange = (max - min) / max;
    let weightFactor =
      1 - scaledRateOfChange < 0.5 ? 0.5 : 1 - scaledRateOfChange;

    // TODO:  Check for any valid values before attempting to reduce.
    // TODO:  If all NaN, then simply return null.

    let weightedValues = x
      .map((o, i) => o * Math.pow(weightFactor, i)) // maps onto an array including NaN
      .filter((x) => !Number.isNaN(x)); // remove NaN before calculating sum

    let weightedSum = null;
    if (weightedValues.length == 0) {
      return null;
    } else {
      weightedSum = weightedValues.reduce((a, o) => a + o);
    }

    let weightFactorSum = validIndices
      .map((o) => Math.pow(weightFactor, o))
      .reduce((a, o) => a + o);

    let returnVal = parseFloat((weightedSum / weightFactorSum).toFixed(1));

    // Convert NaN back to null
    returnVal = Number.isNaN(returnVal) ? null : returnVal;
    return returnVal;
  }

  exports.arrayCount = arrayCount;
  exports.arrayMax = arrayMax;
  exports.arrayMean = arrayMean;
  exports.arrayMin = arrayMin;
  exports.arraySum = arraySum;
  exports.dailyStats = dailyStats;
  exports.diurnalStats = diurnalStats;
  exports.pm_nowcast = pm_nowcast;
  exports.roundAndUseNull = roundAndUseNull;
  exports.trimDate = trimDate;
  exports.useNull = useNull;

  return exports;

})({}, moment);
