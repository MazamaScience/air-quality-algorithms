import { test } from "uvu";
import * as assert from "uvu/assert";

import {
  arrayMin,
  arrayMax,
  arrayCount,
  arraySum,
  arrayMean,
  roundAndUseNull,
  useNull,
} from "../src/index.js";

test("roundAndUseNull works properly", () => {
  let x = [1, 1.1, 1.12, 1.123, 1.1234, NaN, undefined, null, 1.12345];
  let x_0 = [1, 1, 1, 1, 1, null, null, null, 1];
  let x_1 = [1, 1.1, 1.1, 1.1, 1.1, null, null, null, 1.1];
  let x_2 = [1, 1.1, 1.12, 1.12, 1.12, null, null, null, 1.12];
  let x_3 = [1, 1.1, 1.12, 1.123, 1.123, null, null, null, 1.123];
  let x_4 = [1, 1.1, 1.12, 1.123, 1.1234, null, null, null, 1.1235]; // rounds up

  assert.equal(roundAndUseNull(x), x_1); // defaults to digits = 1
  assert.equal(roundAndUseNull(x, 0), x_0);
  assert.equal(roundAndUseNull(x, 1), x_1);
  assert.equal(roundAndUseNull(x, 2), x_2);
  assert.equal(roundAndUseNull(x, 3), x_3);
  assert.equal(roundAndUseNull(x, 4), x_4);
});

test("useNull works properly", () => {
  let x = [1, 1.1, 1.12, 1.123, 1.1234, NaN, undefined, null, 1.12345];
  let x_null = [1, 1.1, 1.12, 1.123, 1.1234, null, null, null, 1.12345];
  assert.equal(useNull(x), x_null);
});

test("array math works properly", () => {
  let x = [16, 2, 8, NaN, undefined, null, 6];
  let x_null = [null, null, NaN, undefined, null];
  assert.is(arrayMin(x), 2);
  assert.is(arrayMin(x_null), null);
  assert.is(arrayMax(x), 16);
  assert.is(arrayMax(x_null), null);
  assert.is(arrayCount(x), 4);
  assert.is(arrayCount(x_null), 0);
  assert.is(arraySum(x), 32);
  assert.is(arraySum(x_null), null);
  assert.is(arrayMean(x), 8);
  assert.is(arrayMean(x_null), null);
});

test.run();
