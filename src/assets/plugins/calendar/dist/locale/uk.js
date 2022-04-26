!(function (e) {
  'function' == typeof define && define.amd
    ? define(['jquery', 'moment'], e)
    : 'object' == typeof exports
    ? (module.exports = e(require('jquery'), require('moment')))
    : e(jQuery, moment);
})(function (e, t) {
  !(function () {
    function e(e, t) {
      var _ = e.split('_');
      return t % 10 === 1 && t % 100 !== 11
        ? _[0]
        : t % 10 >= 2 && t % 10 <= 4 && (t % 100 < 10 || t % 100 >= 20)
        ? _[1]
        : _[2];
    }
    function _(t, _, n) {
      var a = {
        mm: _ ? 'хвилина_хвилини_хвилин' : 'хвилину_хвилини_хвилин',
        hh: _ ? 'година_години_годин' : 'годину_години_годин',
        dd: 'день_дні_днів',
        MM: 'місяць_місяці_місяців',
        yy: 'рік_роки_років',
      };
      return 'm' === n ? (_ ? 'хвилина' : 'хвилину') : 'h' === n ? (_ ? 'година' : 'годину') : t + ' ' + e(a[n], +t);
    }
    function n(e, t) {
      var _ = {
          nominative: 'неділя_понеділок_вівторок_середа_четвер_п’ятниця_субота'.split('_'),
          accusative: 'неділю_понеділок_вівторок_середу_четвер_п’ятницю_суботу'.split('_'),
          genitive: 'неділі_понеділка_вівторка_середи_четверга_п’ятниці_суботи'.split('_'),
        },
        n = /(\[[ВвУу]\]) ?dddd/.test(t)
          ? 'accusative'
          : /\[?(?:минулої|наступної)? ?\] ?dddd/.test(t)
          ? 'genitive'
          : 'nominative';
      return _[n][e.day()];
    }
    function a(e) {
      return function () {
        return e + 'о' + (11 === this.hours() ? 'б' : '') + '] LT';
      };
    }
    var r = t.defineLocale('uk', {
      months: {
        format: 'січня_лютого_березня_квітня_травня_червня_липня_серпня_вересня_жовтня_листопада_грудня'.split('_'),
        standalone:
          'січень_лютий_березень_квітень_травень_червень_липень_серпень_вересень_жовтень_листопад_грудень'.split('_'),
      },
      monthsShort: 'січ_лют_бер_квіт_трав_черв_лип_серп_вер_жовт_лист_груд'.split('_'),
      weekdays: n,
      weekdaysShort: 'нд_пн_вт_ср_чт_пт_сб'.split('_'),
      weekdaysMin: 'нд_пн_вт_ср_чт_пт_сб'.split('_'),
      longDateFormat: {
        LT: 'HH:mm',
        LTS: 'HH:mm:ss',
        L: 'DD.MM.YYYY',
        LL: 'D MMMM YYYY р.',
        LLL: 'D MMMM YYYY р., HH:mm',
        LLLL: 'dddd, D MMMM YYYY р., HH:mm',
      },
      calendar: {
        sameDay: a('[Сьогодні '),
        nextDay: a('[Завтра '),
        lastDay: a('[Вчора '),
        nextWeek: a('[У] dddd ['),
        lastWeek: function () {
          switch (this.day()) {
            case 0:
            case 3:
            case 5:
            case 6:
              return a('[Минулої] dddd [').call(this);
            case 1:
            case 2:
            case 4:
              return a('[Минулого] dddd [').call(this);
          }
        },
        sameElse: 'L',
      },
      relativeTime: {
        future: 'за %s',
        past: '%s тому',
        s: 'декілька секунд',
        m: _,
        mm: _,
        h: 'годину',
        hh: _,
        d: 'день',
        dd: _,
        M: 'місяць',
        MM: _,
        y: 'рік',
        yy: _,
      },
      meridiemParse: /ночі|ранку|дня|вечора/,
      isPM: function (e) {
        return /^(дня|вечора)$/.test(e);
      },
      meridiem: function (e, t, _) {
        return e < 4 ? 'ночі' : e < 12 ? 'ранку' : e < 17 ? 'дня' : 'вечора';
      },
      ordinalParse: /\d{1,2}-(й|го)/,
      ordinal: function (e, t) {
        switch (t) {
          case 'M':
          case 'd':
          case 'DDD':
          case 'w':
          case 'W':
            return e + '-й';
          case 'D':
            return e + '-го';
          default:
            return e;
        }
      },
      week: { dow: 1, doy: 7 },
    });
    return r;
  })(),
    e.fullCalendar.datepickerLocale('uk', 'uk', {
      closeText: 'Закрити',
      prevText: '&#x3C;',
      nextText: '&#x3E;',
      currentText: 'Сьогодні',
      monthNames: [
        'Січень',
        'Лютий',
        'Березень',
        'Квітень',
        'Травень',
        'Червень',
        'Липень',
        'Серпень',
        'Вересень',
        'Жовтень',
        'Листопад',
        'Грудень',
      ],
      monthNamesShort: ['Січ', 'Лют', 'Бер', 'Кві', 'Тра', 'Чер', 'Лип', 'Сер', 'Вер', 'Жов', 'Лис', 'Гру'],
      dayNames: ['неділя', 'понеділок', 'вівторок', 'середа', 'четвер', 'п’ятниця', 'субота'],
      dayNamesShort: ['нед', 'пнд', 'вів', 'срд', 'чтв', 'птн', 'сбт'],
      dayNamesMin: ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
      weekHeader: 'Тиж',
      dateFormat: 'dd.mm.yy',
      firstDay: 1,
      isRTL: !1,
      showMonthAfterYear: !1,
      yearSuffix: '',
    }),
    e.fullCalendar.locale('uk', {
      buttonText: { month: 'Місяць', week: 'Тиждень', day: 'День', list: 'Порядок денний' },
      allDayText: 'Увесь день',
      eventLimitText: function (e) {
        return '+ще ' + e + '...';
      },
      noEventsMessage: 'Немає подій для відображення',
    });
});
