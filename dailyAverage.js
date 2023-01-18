import moment from "moment-timezone";
import { trimDate } from "./trimDate.js";

/**
 * Calculates daily averages for the time series specified by `datetime` and `x`.
 *
 * The returned object contains two properties:
 * * datetime -- Array of date objects specifying the starting hour of each day
 * * average -- Array or daily average values for each day
 * @param {...Date} datetime Regular hourly axis representing the time associated
 * with each measurement.
 * @param {...Number} x Array of hourly measurements.
 * @param {string} timezone Olson time zone to use as "local time".
 * @returns {...Number} Array of local time daily averages.
 */
export function dailyAverage(datetime, x, timezone) {
  // Start by trimming to full days in the local timezone
  let trimmed = trimDate(datetime, x, timezone);

  // TODO: Add support for minCount valid values and partial days.

  let dayCount = trimmed.datetime.length / 24;
  let daily_datetime = [];
  let daily_average = [];
  for (let i = 0; i < dayCount; i++) {
    let start = i * 24;
    let end = i * 24 + 24;
    // NOTE:  Average is assigned to the start of the day.
    daily_datetime[i] = trimmed.datetime[start];
    daily_average[i] = trimmed.x.slice(start, end).reduce((a, o) => a + o) / 24;
  }

  // Round to one decimal place and ensure null is the missing value
  daily_average = daily_average.map((o) =>
    o === null || o === undefined || isNaN(o) ? null : Math.round(10 * o) / 10
  );

  return { datetime: daily_datetime, average: daily_average };
}
