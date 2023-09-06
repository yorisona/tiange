// @ts-nocheck
!(function (l) {
  let e,
    d =
      '<svg><symbol id="icon-qq" viewBox="0 0 1024 1024"><path d="M933.446 643.862c-18.784-108.945-97.673-180.323-97.673-180.323 11.268-98.92-30.056-116.461-30.056-116.461-8.701-306.05-272.335-300.692-277.87-300.546-5.542-0.146-269.211-5.505-277.872 300.548 0 0-41.325 17.54-30.055 116.461 0 0-78.895 71.378-97.676 180.323 0 0-10.034 184.083 90.16 22.544 0 0 22.544 61.344 63.867 116.455 0 0-73.897 25.062-67.621 90.165 0 0-2.518 72.618 157.784 67.625 0 0 112.702-8.757 146.516-56.35h29.795c33.809 47.595 146.514 56.35 146.514 56.35 160.262 4.993 157.781-67.625 157.781-67.625 6.238-65.103-67.62-90.165-67.62-90.165 41.324-55.11 63.862-116.455 63.862-116.455 100.156 161.537 90.164-22.546 90.164-22.546z" fill="#4CA4FF" ></path></symbol></svg>',
    t = (e = document.getElementsByTagName('script'))[e.length - 1].getAttribute('data-injectcss');
  if (t && !l.__iconfont__svg__cssinject__) {
    l.__iconfont__svg__cssinject__ = !0;
    try {
      document.write(
        '<style>.svgfont {display: inline-block;width: 1em;height: 1em;fill: currentColor;vertical-align: -0.1em;font-size:16px;}</style>',
      );
    } catch (e) {
      console && console.log(e);
    }
  }
  !(function (e) {
    if (document.addEventListener)
      if (~['complete', 'loaded', 'interactive'].indexOf(document.readyState)) setTimeout(e, 0);
      else {
        var t = function () {
          document.removeEventListener('DOMContentLoaded', t, !1), e();
        };
        document.addEventListener('DOMContentLoaded', t, !1);
      }
    else
      document.attachEvent &&
        ((o = e),
        (i = l.document),
        (c = !1),
        (d = function () {
          try {
            i.documentElement.doScroll('left');
          } catch (e) {
            return void setTimeout(d, 50);
          }
          n();
        })(),
        (i.onreadystatechange = function () {
          'complete' == i.readyState && ((i.onreadystatechange = null), n());
        }));
    function n() {
      c || ((c = !0), o());
    }
    let o, i, c, d;
  })(function () {
    let e, t, n, o, i, c;
    ((e = document.createElement('div')).innerHTML = d),
      (d = null),
      (t = e.getElementsByTagName('svg')[0]) &&
        (t.setAttribute('aria-hidden', 'true'),
        (t.style.position = 'absolute'),
        (t.style.width = 0),
        (t.style.height = 0),
        (t.style.overflow = 'hidden'),
        (n = t),
        (o = document.body).firstChild
          ? ((i = n), (c = o.firstChild).parentNode.insertBefore(i, c))
          : o.appendChild(n));
  });
})(window);
