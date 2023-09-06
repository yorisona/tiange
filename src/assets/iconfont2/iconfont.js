!(function (a) {
  let t,
    i =
      '<svg><symbol id="icon-menu" viewBox="0 0 1024 1024"><path d="M225.854934 210.432687l-93.071745 0c-2.49789 0-4.523013 2.025123-4.523013 4.523013l0 93.071745c0 2.49789 2.025123 4.523013 4.523013 4.523013l93.071745 0c2.49789 0 4.523013-2.025123 4.523013-4.523013l0-93.071745C230.377948 212.45781 228.352825 210.432687 225.854934 210.432687z"  ></path><path d="M868.248703 210.432687 302.545594 210.432687c-15.182794 0-27.491121 2.025123-27.491121 4.523013l0 93.071745c0 2.49789 12.308327 4.523013 27.491121 4.523013L868.248703 312.550459c15.182794 0 27.491121-2.025123 27.491121-4.523013l0-93.071745C895.739824 212.45781 883.431497 210.432687 868.248703 210.432687z"  ></path><path d="M225.854934 461.738269l-93.071745 0c-2.49789 0-4.523013 2.025123-4.523013 4.523013l0 93.071745c0 2.49789 2.025123 4.523013 4.523013 4.523013l93.071745 0c2.49789 0 4.523013-2.025123 4.523013-4.523013l0-93.071745C230.377948 463.763392 228.352825 461.738269 225.854934 461.738269z"  ></path><path d="M868.248703 461.738269 302.545594 461.738269c-15.182794 0-27.491121 2.025123-27.491121 4.523013l0 93.071745c0 2.49789 12.308327 4.523013 27.491121 4.523013L868.248703 563.856042c15.182794 0 27.491121-2.025123 27.491121-4.523013l0-93.071745C895.739824 463.763392 883.431497 461.738269 868.248703 461.738269z"  ></path><path d="M225.854934 711.448518l-93.071745 0c-2.49789 0-4.523013 2.025123-4.523013 4.523013l0 93.071745c0 2.49789 2.025123 4.523013 4.523013 4.523013l93.071745 0c2.49789 0 4.523013-2.025123 4.523013-4.523013l0-93.071745C230.377948 713.473641 228.352825 711.448518 225.854934 711.448518z"  ></path><path d="M868.248703 711.448518 302.545594 711.448518c-15.182794 0-27.491121 2.025123-27.491121 4.523013l0 93.071745c0 2.49789 12.308327 4.523013 27.491121 4.523013L868.248703 813.56629c15.182794 0 27.491121-2.025123 27.491121-4.523013l0-93.071745C895.739824 713.473641 883.431497 711.448518 868.248703 711.448518z"  ></path></symbol><symbol id="icon-user" viewBox="0 0 1872 1024"><path d="M951.333615 287.35973m-223.980237 0a218.879 218.879 0 1 0 447.960475 0 218.879 218.879 0 1 0-447.960475 0ZM1335.466389 895.482975c-0.490164-212.177424-172.280762-384.030443-384.132774-384.030443-211.854059 0-383.644657 171.85302-384.134821 384.030443L1335.466389 895.482975z"  ></path></symbol></svg>',
    e = (t = document.getElementsByTagName('script'))[t.length - 1].getAttribute('data-injectcss');
  if (e && !a.__iconfont__svg__cssinject__) {
    a.__iconfont__svg__cssinject__ = !0;
    try {
      document.write(
        '<style>.svgfont {display: inline-block;width: 1em;height: 1em;fill: currentColor;vertical-align: -0.1em;font-size:16px;}</style>',
      );
    } catch (t) {
      console && console.log(t);
    }
  }
  !(function (t) {
    if (document.addEventListener)
      if (~['complete', 'loaded', 'interactive'].indexOf(document.readyState)) setTimeout(t, 0);
      else {
        var e = function () {
          document.removeEventListener('DOMContentLoaded', e, !1), t();
        };
        document.addEventListener('DOMContentLoaded', e, !1);
      }
    else
      document.attachEvent &&
        ((c = t),
        (o = a.document),
        (l = !1),
        (i = function () {
          try {
            o.documentElement.doScroll('left');
          } catch (t) {
            return void setTimeout(i, 50);
          }
          n();
        })(),
        (o.onreadystatechange = function () {
          'complete' == o.readyState && ((o.onreadystatechange = null), n());
        }));
    function n() {
      l || ((l = !0), c());
    }
    let c, o, l, i;
  })(function () {
    let t, e, n, c, o, l;
    ((t = document.createElement('div')).innerHTML = i),
      (i = null),
      (e = t.getElementsByTagName('svg')[0]) &&
        (e.setAttribute('aria-hidden', 'true'),
        (e.style.position = 'absolute'),
        (e.style.width = 0),
        (e.style.height = 0),
        (e.style.overflow = 'hidden'),
        (n = e),
        (c = document.body).firstChild
          ? ((o = n), (l = c.firstChild).parentNode.insertBefore(o, l))
          : c.appendChild(n));
  });
})(window);
