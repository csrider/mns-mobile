Number Change History
=====================
3.14.1
------

* No changes.

3.14.0
------
* Parse can now parse all the formats that format can produce. ([#587][]: @Satyam)
* Fixed regression in `Y.Number.parse` with strings containing only
  whitespace. ([#1427][])

[#587]: https://github.com/yui/yui3/pull/587
[#1427]: https://github.com/yui/yui3/pull/1427

3.13.0
------

* No changes.

3.12.0
------

* No changes.

3.11.0
------

* No changes.

3.10.3
------

* No changes.

3.10.2
------

* No changes.

3.10.1
------

* No changes.

3.10.0
------

* No changes.

3.9.1
-----

* No changes.

3.9.0
-----

* PR #433 (ticket #2533028) - Fix incorrectly parsing empty string as 0. [okuryu]

3.8.1
-----

* No changes.

3.8.0
-----

  * No changes.

3.7.3
-----

* No changes.

3.7.2
-----

* No changes.

3.7.1
-----

* No changes.

3.7.0
-----

* Moved from Y.Datatype.Number to Y.Number

3.6.0
-----

* No changes.

3.5.1
-----

* No changes.

3.5.0
-----

* No changes.

3.4.1
-----

* No changes

3.4.0
-----

* Languages are no longer fetch-able for the `datatype-date` module, only for
  the `datatype-date-format` module:

      var availLangs = Y.Intl.getAvailableLangs("datatype-date-format");

3.3.0
-----

* No changes.

3.2.0
-----

* No changes.

3.1.1
-----

* No changes.

3.1.0
-----

* Changed to use YUI language resource bundles rather than proprietary
  infrastructure.

3.0.0
-----

* No changes.

3.0.0beta1
----------

* Initial release.
