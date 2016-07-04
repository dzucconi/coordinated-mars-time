(function() {
  'use strict';

  function render(name) {
    return function(hh, mm, ss) {
      return '<div class="' + name + '">' +
        '<span class="digits">' + pad(hh) + '</span>' +
        '<span class="separator">:</span>' +
        '<span class="digits">' + pad(mm) + '</span>' +
        '<span class="separator">:</span>' +
        '<span class="digits">' + pad(ss) + '</span>' +
      '</div>';
    };
  }

  function pad(n) {
    if (n < 10) n = '0' + n;
    return n;
  }

  function hToHMS(h) {
    var x = h * 3600;
    var y = x % 3600;
    var hh = Math.floor(x / 3600);
    var mm = Math.floor(y / 60);
    var ss = Math.round(y % 60);
    return [hh, mm, ss];
  }

  var JULIAN_DATE_AT_UNIX_EPOCH = 2440587.5;
  var MILLISECONDS_PER_DAY = 8.64E7;
  var SECONDS_PER_DAY = 86400;
  var LEAP_SECONDS_FOR_UTC = 36; // https://hpiers.obspm.fr/iers/bul/bulc/ntp/leap-seconds.list
  var EPHEMERIS_TIME_TAI_OFFSET = 32.184; // https://en.wikipedia.org/wiki/Terrestrial_Time#cite_note-5
  var JULIAN_DATE_AT_TERRESTIAL_TIME_AT_UNIX_EPOCH = 2451545.0;
  var HOURS_PER_DAY = 24;
  var MARS_TO_EARTH_DAY_RATIO = 1.027491252;

  function update() {
    var now = new Date();
    var unixTimestamp = now.getTime();

    var julianDateUTC = JULIAN_DATE_AT_UNIX_EPOCH + (unixTimestamp / MILLISECONDS_PER_DAY);
    var julianDateTerrestialTime = julianDateUTC + (LEAP_SECONDS_FOR_UTC + EPHEMERIS_TIME_TAI_OFFSET) / SECONDS_PER_DAY;
    var j2000 = julianDateTerrestialTime - JULIAN_DATE_AT_TERRESTIAL_TIME_AT_UNIX_EPOCH;
    var marsSolDate = (((j2000 - 4.5) / MARS_TO_EARTH_DAY_RATIO) + 44796.0 - 0.00096);
    var coordinatedMarsTime = (HOURS_PER_DAY * marsSolDate) % HOURS_PER_DAY;

    document.body.innerHTML = (
      render('mars').apply(null, hToHMS(coordinatedMarsTime)) +
      render('earth').apply(null, [now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds()])
    );
  }

  update();
  setInterval(update, 10);
})();
