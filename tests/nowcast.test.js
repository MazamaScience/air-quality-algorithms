import { test } from "uvu";
import * as assert from "uvu/assert";

import { pm_nowcast } from "../src/index.js";

test("nowcast works properly", () => {
  // Data from: https://forum.airnowtech.org/t/the-nowcast-for-pm2-5-and-pm10/172
  // Answer should be 28.4 ug/m3 or 85 AQI
  let pm25 = [34.9, 43, 50, 64.9, 69.2, 66.2, 53.7, 48.6, 49.2, 35, null, 21];
  let nowcast = pm_nowcast(pm25);
  assert.is(nowcast.length, pm25.length);
  assert.is(nowcast[0], null);
  assert.is(nowcast[11], 28.4);
});

test("nowcast handles missing values properly", () => {
  let pm25 = [34.9, 43, 50, 64.9, 69.2, 66.2, 53.7, 48.6, 49.2, 35, null, null];
  assert.is(pm_nowcast(pm25)[11], null);
});

test.run();
