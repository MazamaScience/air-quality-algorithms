import moment from "moment-timezone";
import { trimDate } from "./trimDate.js";

/**
 * Calculates diurnal averages for the time series specified by `datetime` and `x`.
 *
 * The returned object contains two properties:
 * * hour -- Array of local time hours [0-24]
 * * average -- Array of time-of-day averages for each hour
 *
 * By default, the averages are calculated using data from the most recent 7 days
 * in the `datetime` array.
 *
 * @param {Array.<Date>} datetime Regular hourly axis representing the time associated
 * with each measurement.
 * @param {Array.<number>} x Array of hourly measurements.
 * @param {string} timezone Olson time zone to use as "local time".
 * @param {number} dayCount Number of days to use.
 * @returns {object} An object with `hour` and `average` properties.
 */
export function diurnalAverage(datetime, x, timezone, dayCount = 7) {
  // Start by trimming to full days in the local timezone
  let trimmed = trimDate(datetime, x, timezone);

  let fullDayCount = trimmed.datetime.length / 24;
  dayCount = fullDayCount < dayCount ? fullDayCount : dayCount;

  let localTime = datetime.map((o) => moment.tz(o, timezone));
  let hours = localTime.map((o) => o.hours());

  let hour = [];
  let hourly_average = [];

  // For each hour, average together the contributions from each day
  for (let h = 0; h < 24; h++) {
    let sum = 0;
    for (let d = 0; d < dayCount; d++) {
      sum += x[h + d * 24];
    }
    hour[h] = h;
    hourly_average[h] = sum / dayCount;
  }

  // Round to one decimal place and ensure null is the missing value
  hourly_average = hourly_average.map((o) =>
    o === null || o === undefined || isNaN(o) ? null : Math.round(10 * o) / 10
  );

  return { hour: hour, average: hourly_average };
}
