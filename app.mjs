// Test that pm25_nowcast works

import { pm_nowcast } from "./index.js";

let pm25 = [
  1, 3, 5, 9, 7, 15, 12, 10, 18, 10, 2, 8, 10, 15, 1, 4, 28, 18, 15, 3, 6, 8, 4,
  8, 3, 4,
];

let nowcast = pm_nowcast(pm25);

console.log(nowcast);
