import { test } from "uvu";
import * as assert from "uvu/assert";

import moment from "moment-timezone";
import { trimDate } from "../index.js";

// Start of Valentine's Day in Greenwich
let start = moment.tz("2023-02-14 00:00:00", "UTC");
let datetime = [];
let x = [];

// ----- Test trimming in different timezones ----------------------------------

// Precisely 10 days worth of data
for (var i = 0; i < 240; i++) {
  datetime[i] = new Date(start + i * 3600 * 1000);
  let val = 10 + 5 * Math.sin((i * Math.PI) / 12) + Math.random() * 6 - 3;
  x[i] = Math.round(val * 10) / 10;
}

test("trimming Date objects works for 'America/Los_Angeles'", () => {
  let timezone = "America/Los_Angeles";
  let trimmed = trimDate(datetime, x, timezone);
  let tz_start = moment.tz(trimmed.datetime[0], timezone);
  let tz_end = moment.tz(trimmed.datetime[215], timezone);
  assert.is(trimmed.datetime.length, 216);
  assert.is(tz_start.hours(), 0);
  assert.is(tz_end.hours(), 23);
  // UTC is 8 hours ahead of "America/Los_Angeles" during the winter
  assert.is(trimmed.datetime[0].valueOf(), datetime[8].valueOf());
});

test("trimming Date objects works for 'America/New_York'", () => {
  let timezone = "America/New_York";
  let trimmed = trimDate(datetime, x, timezone);
  let tz_start = moment.tz(trimmed.datetime[0], timezone);
  let tz_end = moment.tz(trimmed.datetime[215], timezone);
  assert.is(trimmed.datetime.length, 216);
  assert.is(tz_start.hours(), 0);
  assert.is(tz_end.hours(), 23);
  // UTC is 5 hours ahead of "America/New_York" during the winter
  assert.is(trimmed.datetime[0].valueOf(), datetime[5].valueOf());
});

// ----- Test passing in moment objects ----------------------------------------

// Precisely 10 days worth of data
for (var i = 0; i < 240; i++) {
  datetime[i] = moment.tz(start + i * 3600 * 1000, "UTC");
  let val = 10 + 5 * Math.sin((i * Math.PI) / 12) + Math.random() * 6 - 3;
  x[i] = Math.round(val * 10) / 10;
}

test("trimming moment.tz objects works for 'America/Los_Angeles'", () => {
  let timezone = "America/Los_Angeles";
  let trimmed = trimDate(datetime, x, timezone);
  let tz_start = moment.tz(trimmed.datetime[0], timezone);
  let tz_end = moment.tz(trimmed.datetime[215], timezone);
  assert.is(trimmed.datetime.length, 216);
  assert.is(tz_start.hours(), 0);
  assert.is(tz_end.hours(), 23);
  // UTC is 8 hours ahead of "America/Los_Angeles" during the winter
  assert.is(trimmed.datetime[0].valueOf(), datetime[8].valueOf());
});

test("trimming Date objects works for 'America/New_York'", () => {
  let timezone = "America/New_York";
  let trimmed = trimDate(datetime, x, timezone);
  let tz_start = moment.tz(trimmed.datetime[0], timezone);
  let tz_end = moment.tz(trimmed.datetime[215], timezone);
  assert.is(trimmed.datetime.length, 216);
  assert.is(tz_start.hours(), 0);
  assert.is(tz_end.hours(), 23);
  // UTC is 5 hours ahead of "America/New_York" during the winter
  assert.is(trimmed.datetime[0].valueOf(), datetime[5].valueOf());
});

// ----- Run all tests ---------------------------------------------------------

test.run();
