import { test } from "uvu";
import * as assert from "uvu/assert";

import moment from "moment-timezone";
import { dailyAverage } from "../index.js";

// Start of Valentine's Day in Greenwich
let start = moment.tz("2023-02-14 00:00:00", "UTC");
let datetime = [];
let x = [];

// Precisely 10 days worth of data
let day = 0;
for (var i = 0; i < 240; i++) {
  if (i % 24 === 0) day++;
  datetime[i] = new Date(start + i * 3600 * 1000);
  let val = day * 10 + 5 * Math.sin((i * Math.PI) / 12);
  x[i] = Math.round(val * 10) / 10;
}

test("daily averages work for 'UTC'", () => {
  let timezone = "UTC";
  let daily = dailyAverage(datetime, x, timezone);
  let day0 = new Date(moment.tz("2023-02-14 00:00:00", "UTC"));
  let day1 = new Date(moment.tz("2023-02-15 00:00:00", "UTC"));
  assert.equal(daily.datetime.slice(0, 2), [day0, day1]);
  assert.equal(daily.average.slice(0, 2), [10, 20]);
});

test("daily averages work for 'America/Chicago'", () => {
  let timezone = "America/Chicago";
  let daily = dailyAverage(datetime, x, timezone);
  let day0 = new Date(moment.tz("2023-02-14 06:00:00", "UTC"));
  let day1 = new Date(moment.tz("2023-02-15 06:00:00", "UTC"));
  assert.equal(daily.datetime.slice(0, 2), [day0, day1]);
  assert.equal(daily.average.slice(0, 2), [12.5, 22.5]);
});

// ----- Run all tests ---------------------------------------------------------

test.run();

// ----- Notes -----------------------------------------------------------------

// // Manual testing for "America/Chicago"
// x.slice(6,30).reduce((a,o) => a + o) / 24
// // 12.5
// x.slice(30,54).reduce((a,o) => a + o) / 24
// // 22.5
