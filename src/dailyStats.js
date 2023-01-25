import moment from "moment-timezone";
import { trimDate } from "./trimDate.js";
import {
  arrayCount,
  arrayMin,
  arrayMean,
  arrayMax,
  roundAndUseNull,
  useNull,
} from "./utils.js";

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
export function dailyStats(datetime, x, timezone) {
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
