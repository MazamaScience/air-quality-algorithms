import moment from "moment-timezone";
import { trimDate } from "./trimDate.js";
import { roundAndUseNull, useNull } from "./utils.js";

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
 * @returns {object} An object with `hour` and `average` properties.
 */
export function diurnalStats(datetime, x, timezone, dayCount = 7) {
  // Start by trimming to full days in the local timezone
  let trimmed = trimDate(datetime, x, timezone);

  // Use the most recent dayCount days
  let fullDayCount = trimmed.datetime.length / 24;
  dayCount = fullDayCount < dayCount ? fullDayCount : dayCount;
  let startIndex = trimmed.datetime.length - dayCount * 24;

  let localTime = trimmed.datetime.map((o) => moment.tz(o, timezone));
  let hours = localTime.map((o) => o.hours());

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
