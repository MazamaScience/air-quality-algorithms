import { test } from "uvu";
import * as assert from "uvu/assert";

import moment from "moment-timezone";
import { diurnalAverage } from "../src/index.js";

// Start of Valentine's Day in Greenwich
let start = moment.tz("2023-02-14 00:00:00", "UTC");
let datetime = [];
let x = [];

// Precisely 10 days worth of data
let day = 0;
for (var i = 0; i < 240; i++) {
  if (i % 24 === 0) day++;
  datetime[i] = new Date(start + i * 3600 * 1000);
  let val = 10 + 5 * Math.sin((i * Math.PI) / 12);
  x[i] = Math.round(val * 10) / 10;
}

let hours = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
  22, 23,
];

test("diurnal averages work for 'UTC'", () => {
  let timezone = "UTC";
  let diurnal = diurnalAverage(datetime, x, timezone);
  let averages = [
    10, 11.3, 12.5, 13.5, 14.3, 14.8, 15, 14.8, 14.3, 13.5, 12.5, 11.3, 10, 8.7,
    7.5, 6.5, 5.7, 5.2, 5, 5.2, 5.7, 6.5, 7.5, 8.7,
  ];
  assert.equal(diurnal.hour, hours);
  assert.equal(diurnal.averages);
});

test("diurnal averages work for 'America/Chicago'", () => {
  let timezone = "America/Chicago";
  let diurnal = diurnalAverage(datetime, x, timezone);
  let averages = [
    15, 14.8, 14.3, 13.5, 12.5, 11.3, 10, 8.7, 7.5, 6.5, 5.7, 5.2, 5, 5.2, 5.7,
    6.5, 7.5, 8.7, 10, 11.3, 12.5, 13.5, 14.3, 14.8,
  ];
  assert.equal(diurnal.hour, hours);
  assert.equal(diurnal.averages);
});

// ----- Run all tests ---------------------------------------------------------

test.run();

// ----- Notes -----------------------------------------------------------------

// Manual testing for "America/Chicago"

// x.slice(0,24)
// // (24) [10, 11.3, 12.5, 13.5, 14.3, 14.8, 15, 14.8, 14.3, 13.5, 12.5, 11.3, 10, 8.7, 7.5, 6.5, 5.7, 5.2, 5, 5.2, 5.7, 6.5, 7.5, 8.7]
// x.slice(6,30)
// // (24) [15, 14.8, 14.3, 13.5, 12.5, 11.3, 10, 8.7, 7.5, 6.5, 5.7, 5.2, 5, 5.2, 5.7, 6.5, 7.5, 8.7, 10, 11.3, 12.5, 13.5, 14.3, 14.8]
