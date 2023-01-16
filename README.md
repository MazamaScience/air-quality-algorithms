# air-monitor-algorithms
Algorithms used in processing of hourly time series data. Initial use cases include air quality monitoring.

**NOTE:** A core assumption of the "air-monitor" data model is that all time series data are on a 
regular hourly axis with no gaps. Missing values should be indicated by `null`.

Supported functions include:

* `pm_nowcast()` -- Applies the _Nowcast_ algorithm to measurements of PM2.5 or PM10,
* `pm_AQI()` -- Converts measurements of PM2.5 or PM10 into US EPA AQI values.
* `dailyAverage()` -- Converts time series into local time daily averages.
* `diurnalAverage()` -- Converts time series into local time averages-by-hour-of-day.


