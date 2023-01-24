# air-monitor-algorithms

A package containing algorithms used in the processing of hourly time series data.
Initial use cases include air quality monitoring time series.

This package is a dependency of the
[air-monitor](https://github.com/MazamaScience/air-monitor)
package for working with air quality monitoring data archives hosted by the
US Forest Service.

**NOTE:** A core assumption of the "air-monitor" data model is that all time
series data are on a regular hourly axis with no gaps. When working with this
javascript package, missing values should be indicated by `null`.

Supported functions include:

- `dailyAverage()` -- Converts time series data into local time daily averages.
- `diurnalAverage()` -- Converts time series data into local time averages by hour-of-day.
- `pm_nowcast()` -- Applies the _Nowcast_ algorithm to PM2.5 or PM10 time series data.
- `trimDate()` -- Returns an object with time series data trimmed to local time full days.

## Usage

The package can be installed with `npm`:

```
npm install github:MazamaScience/air-monitor-algorithms
```

This package is provided as an ES Module intended for use in other modules or
in Svelte and Vue applications. Here is an example of how to import functions
from this module:

```
import {
  dailyAverage,
  diurnalAverage,
  pm_nowcast,
} from "air-monitor-algorithms";
...
```

---

This project is supported by the [USFS AirFire](https://www.airfire.org) group.
