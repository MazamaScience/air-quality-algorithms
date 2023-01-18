import { pm_nowcast } from "../index.js";
import { trimDate } from "../index.js";
import { dailyAverage } from "../index.js";
import { diurnalAverage } from "../index.js";

import moment from "moment-timezone";

let datetime = [];
let x = [];
let timezone = "America/Los_Angeles";

let now = moment.tz("UTC").startOf("hour");

for (var i = 0; i < 240; i++) {
  datetime[i] = new Date(now - (240 - i) * 3600 * 1000);
  let val = 10 + 5 * Math.sin((i * Math.PI) / 12) + Math.random() * 6 - 3;
  x[i] = Math.round(val * 10) / 10;
}

let nowcast = pm_nowcast(x); // looks good

let trimmed = trimDate(datetime, x, timezone);

let daily = dailyAverage(datetime, x, timezone);

let diurnal = diurnalAverage(datetime, x, timezone);

let z = 1;

// ----- PLAY AREA -------------------------------------------------------------

let start = moment.tz("2023-02-14 00:00:00", "UTC");
datetime = [];
x = [];

for (var i = 0; i < 240; i++) {
  datetime[i] = new Date(start + i * 3600 * 1000);
  let val = 10 + 5 * Math.sin((i * Math.PI) / 12) + Math.random() * 6 - 3;
  x[i] = Math.round(val * 10) / 10;
}

for (var i = 0; i < 240; i++) {
  datetime[i] = moment.tz(start + i * 3600 * 1000, "UTC");
  let val = 10 + 5 * Math.sin((i * Math.PI) / 12) + Math.random() * 6 - 3;
  x[i] = Math.round(val * 10) / 10;
}

let zzz = 1;
