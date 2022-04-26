!(function (a) {
  'function' == typeof define && define.amd ? define(['jquery', 'moment'], a) : a(jQuery, moment);
})(function (a, b) {
  function c(a, b) {
    var c = a.split('_');
    return b % 10 === 1 && b % 100 !== 11
      ? c[0]
      : b % 10 >= 2 && 4 >= b % 10 && (10 > b % 100 || b % 100 >= 20)
      ? c[1]
      : c[2];
  }
  function d(a, b, d) {
    var e = {
      mm: 'хвилина_хвилини_хвилин',
      hh: 'година_години_годин',
      dd: 'день_дні_днів',
      MM: 'місяць_місяці_місяців',
      yy: 'рік_роки_років',
    };
    return 'm' === d ? (b ? 'хвилина' : 'хвилину') : 'h' === d ? (b ? 'година' : 'годину') : a + ' ' + c(e[d], +a);
  }
  function e(a, b) {
    var c = {
        nominative:
          'січень_лютий_березень_квітень_травень_червень_липень_серпень_вересень_жовтень_листопад_грудень'.split('_'),
        accusative: 'січня_лютого_березня_квітня_травня_червня_липня_серпня_вересня_жовтня_листопада_грудня'.split('_'),
      },
      d = /D[oD]? *MMMM?/.test(b) ? 'accusative' : 'nominative';
    return c[d][a.month()];
  }
  function f(a, b) {
    var c = {
        nominative: 'неділя_понеділок_вівторок_середа_четвер_п’ятниця_субота'.split('_'),
        accusative: 'неділю_понеділок_вівторок_середу_четвер_п’ятницю_суботу'.split('_'),
        genitive: 'неділі_понеділка_вівторка_середи_четверга_п’ятниці_суботи'.split('_'),
      },
      d = /(\[[ВвУу]\]) ?dddd/.test(b)
        ? 'accusative'
        : /\[?(?:минулої|наступної)? ?\] ?dddd/.test(b)
        ? 'genitive'
        : 'nominative';
    return c[d][a.day()];
  }
  function g(a) {
    return function () {
      return a + 'о' + (11 === this.hours() ? 'б' : '') + '] LT';
    };
  }
  (b.defineLocale || b.lang).call(b, 'uk', {
    months: e,
    monthsShort: 'січ_лют_бер_квіт_трав_черв_лип_серп_вер_жовт_лист_груд'.split('_'),
    weekdays: f,
    weekdaysShort: 'нд_пн_вт_ср_чт_пт_сб'.split('_'),
    weekdaysMin: 'нд_пн_вт_ср_чт_пт_сб'.split('_'),
    longDateFormat: {
      LT: 'HH:mm',
      LTS: 'LT:ss',
      L: 'DD.MM.YYYY',
      LL: 'D MMMM YYYY р.',
      LLL: 'D MMMM YYYY р., LT',
      LLLL: 'dddd, D MMMM YYYY р., LT',
    },
    calendar: {
      sameDay: g('[Сьогодні '),
      nextDay: g('[Завтра '),
      lastDay: g('[Вчора '),
      nextWeek: g('[У] dddd ['),
      lastWeek: function () {
        switch (this.day()) {
          case 0:
          case 3:
          case 5:
          case 6:
            return g('[Минулої] dddd [').call(this);
          case 1:
          case 2:
          case 4:
            return g('[Минулого] dddd [').call(this);
        }
      },
      sameElse: 'L',
    },
    relativeTime: {
      future: 'за %s',
      past: '%s тому',
      s: 'декілька секунд',
      m: d,
      mm: d,
      h: 'годину',
      hh: d,
      d: 'день',
      dd: d,
      M: 'місяць',
      MM: d,
      y: 'рік',
      yy: d,
    },
    meridiemParse: /ночі|ранку|дня|вечора/,
    isPM: function (a) {
      return /^(дня|вечора)$/.test(a);
    },
    meridiem: function (a, b, c) {
      return 4 > a ? 'ночі' : 12 > a ? 'ранку' : 17 > a ? 'дня' : 'вечора';
    },
    ordinalParse: /\d{1,2}-(й|го)/,
    ordinal: function (a, b) {
      switch (b) {
        case 'M':
        case 'd':
        case 'DDD':
        case 'w':
        case 'W':
          return a + '-й';
        case 'D':
          return a + '-го';
        default:
          return a;
      }
    },
    week: { dow: 1, doy: 7 },
  }),
    a.fullCalendar.datepickerLang('uk', 'uk', {
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
    a.fullCalendar.lang('uk', {
      buttonText: { month: 'Місяць', week: 'Тиждень', day: 'День', list: 'Порядок денний' },
      allDayText: 'Увесь день',
      eventLimitText: function (a) {
        return '+ще ' + a + '...';
      },
    });
});
