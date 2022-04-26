!(function (e) {
  'function' == typeof define && define.amd
    ? define(['jquery', 'moment'], e)
    : 'object' == typeof exports
    ? (module.exports = e(require('jquery'), require('moment')))
    : e(jQuery, moment);
})(function (e, t) {
  !(function () {
    var e = t.defineLocale('mk', {
      months: 'јануари_февруари_март_април_мај_јуни_јули_август_септември_октомври_ноември_декември'.split('_'),
      monthsShort: 'јан_фев_мар_апр_мај_јун_јул_авг_сеп_окт_ное_дек'.split('_'),
      weekdays: 'недела_понеделник_вторник_среда_четврток_петок_сабота'.split('_'),
      weekdaysShort: 'нед_пон_вто_сре_чет_пет_саб'.split('_'),
      weekdaysMin: 'нe_пo_вт_ср_че_пе_сa'.split('_'),
      longDateFormat: {
        LT: 'H:mm',
        LTS: 'H:mm:ss',
        L: 'D.MM.YYYY',
        LL: 'D MMMM YYYY',
        LLL: 'D MMMM YYYY H:mm',
        LLLL: 'dddd, D MMMM YYYY H:mm',
      },
      calendar: {
        sameDay: '[Денес во] LT',
        nextDay: '[Утре во] LT',
        nextWeek: '[Во] dddd [во] LT',
        lastDay: '[Вчера во] LT',
        lastWeek: function () {
          switch (this.day()) {
            case 0:
            case 3:
            case 6:
              return '[Изминатата] dddd [во] LT';
            case 1:
            case 2:
            case 4:
            case 5:
              return '[Изминатиот] dddd [во] LT';
          }
        },
        sameElse: 'L',
      },
      relativeTime: {
        future: 'после %s',
        past: 'пред %s',
        s: 'неколку секунди',
        m: 'минута',
        mm: '%d минути',
        h: 'час',
        hh: '%d часа',
        d: 'ден',
        dd: '%d дена',
        M: 'месец',
        MM: '%d месеци',
        y: 'година',
        yy: '%d години',
      },
      ordinalParse: /\d{1,2}-(ев|ен|ти|ви|ри|ми)/,
      ordinal: function (e) {
        var t = e % 10,
          a = e % 100;
        return 0 === e
          ? e + '-ев'
          : 0 === a
          ? e + '-ен'
          : a > 10 && a < 20
          ? e + '-ти'
          : 1 === t
          ? e + '-ви'
          : 2 === t
          ? e + '-ри'
          : 7 === t || 8 === t
          ? e + '-ми'
          : e + '-ти';
      },
      week: { dow: 1, doy: 7 },
    });
    return e;
  })(),
    e.fullCalendar.datepickerLocale('mk', 'mk', {
      closeText: 'Затвори',
      prevText: '&#x3C;',
      nextText: '&#x3E;',
      currentText: 'Денес',
      monthNames: [
        'Јануари',
        'Февруари',
        'Март',
        'Април',
        'Мај',
        'Јуни',
        'Јули',
        'Август',
        'Септември',
        'Октомври',
        'Ноември',
        'Декември',
      ],
      monthNamesShort: ['Јан', 'Фев', 'Мар', 'Апр', 'Мај', 'Јун', 'Јул', 'Авг', 'Сеп', 'Окт', 'Ное', 'Дек'],
      dayNames: ['Недела', 'Понеделник', 'Вторник', 'Среда', 'Четврток', 'Петок', 'Сабота'],
      dayNamesShort: ['Нед', 'Пон', 'Вто', 'Сре', 'Чет', 'Пет', 'Саб'],
      dayNamesMin: ['Не', 'По', 'Вт', 'Ср', 'Че', 'Пе', 'Са'],
      weekHeader: 'Сед',
      dateFormat: 'dd.mm.yy',
      firstDay: 1,
      isRTL: !1,
      showMonthAfterYear: !1,
      yearSuffix: '',
    }),
    e.fullCalendar.locale('mk', {
      buttonText: { month: 'Месец', week: 'Недела', day: 'Ден', list: 'График' },
      allDayText: 'Цел ден',
      eventLimitText: function (e) {
        return '+повеќе ' + e;
      },
      noEventsMessage: 'Нема настани за прикажување',
    });
});
