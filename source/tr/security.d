module tr.security;
import core.time : days, seconds;
import std.datetime;
import std.string;

/** Bar is the smallest unit of a security time series
It consists of four values: open, close, high and low*/
class Bar
{
    float open; ///opening price for the bar.
    float close;///closing price for the bar.
    float high; ///highest price for the bar.
    float low;  ///lowest price for the bar.
    DateTime dt = DateTime(1800,1,1,1,1,1); ///datestamp of bar. First moment of 1800 is default.
    unittest
    {
        Bar bar = new Bar;
        assert(bar.dt.toISOString() == "18000101T010101");
    }
}

/**
Security contains series data of Bars for a particular time-frame
*/
class Security
{
    string securityName; ///Name of the security.
    string timeFrame; ///Time frame of the security.
    Bar[] bars; ///Bars in the series.
}