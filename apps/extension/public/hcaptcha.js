/* https://hcaptcha.com/license */
!(function () {
  'use strict'
  function t(t) {
    var e = this.constructor
    return this.then(
      function (i) {
        return e.resolve(t()).then(function () {
          return i
        })
      },
      function (i) {
        return e.resolve(t()).then(function () {
          return e.reject(i)
        })
      },
    )
  }
  function e(t) {
    return new this(function (e, i) {
      if (!t || 'undefined' == typeof t.length) {
        return i(
          new TypeError(
            typeof t + ' ' + t + ' is not iterable(cannot read property Symbol(Symbol.iterator))',
          ),
        )
      }
      var n = Array.prototype.slice.call(t)
      if (0 === n.length) return e([])
      var o = n.length
      function r(t, i) {
        if (i && ('object' == typeof i || 'function' == typeof i)) {
          var s = i.then
          if ('function' == typeof s) {
            return void s.call(
              i,
              function (e) {
                r(t, e)
              },
              function (i) {
                ;(n[t] = { status: 'rejected', reason: i }), 0 == --o && e(n)
              },
            )
          }
        }
        ;(n[t] = { status: 'fulfilled', value: i }), 0 == --o && e(n)
      }
      for (var s = 0; s < n.length; s++) r(s, n[s])
    })
  }
  var i = setTimeout,
    n = 'undefined' != typeof setImmediate ? setImmediate : null
  function o(t) {
    return Boolean(t && 'undefined' != typeof t.length)
  }
  function r() {}
  function s(t) {
    if (!(this instanceof s)) throw new TypeError('Promises must be constructed via new')
    if ('function' != typeof t) throw new TypeError('not a function')
    ;(this._state = 0),
      (this._handled = !1),
      (this._value = undefined),
      (this._deferreds = []),
      f(t, this)
  }
  function a(t, e) {
    for (; 3 === t._state; ) t = t._value
    0 !== t._state
      ? ((t._handled = !0),
        s._immediateFn(function () {
          var i = 1 === t._state ? e.onFulfilled : e.onRejected
          if (null !== i) {
            var n
            try {
              n = i(t._value)
            } catch (o) {
              return void l(e.promise, o)
            }
            c(e.promise, n)
          } else (1 === t._state ? c : l)(e.promise, t._value)
        }))
      : t._deferreds.push(e)
  }
  function c(t, e) {
    try {
      if (e === t) throw new TypeError('A promise cannot be resolved with itself.')
      if (e && ('object' == typeof e || 'function' == typeof e)) {
        var i = e.then
        if (e instanceof s) return (t._state = 3), (t._value = e), void h(t)
        if ('function' == typeof i) {
          return void f(
            ((n = i),
            (o = e),
            function () {
              n.apply(o, arguments)
            }),
            t,
          )
        }
      }
      ;(t._state = 1), (t._value = e), h(t)
    } catch (r) {
      l(t, r)
    }
    var n, o
  }
  function l(t, e) {
    ;(t._state = 2), (t._value = e), h(t)
  }
  function h(t) {
    2 === t._state &&
      0 === t._deferreds.length &&
      s._immediateFn(function () {
        t._handled || s._unhandledRejectionFn(t._value)
      })
    for (var e = 0, i = t._deferreds.length; e < i; e++) a(t, t._deferreds[e])
    t._deferreds = null
  }
  function u(t, e, i) {
    ;(this.onFulfilled = 'function' == typeof t ? t : null),
      (this.onRejected = 'function' == typeof e ? e : null),
      (this.promise = i)
  }
  function f(t, e) {
    var i = !1
    try {
      t(
        function (t) {
          i || ((i = !0), c(e, t))
        },
        function (t) {
          i || ((i = !0), l(e, t))
        },
      )
    } catch (n) {
      if (i) return
      ;(i = !0), l(e, n)
    }
  }
  ;(s.prototype['catch'] = function (t) {
    return this.then(null, t)
  }),
    (s.prototype.then = function (t, e) {
      var i = new this.constructor(r)
      return a(this, new u(t, e, i)), i
    }),
    (s.prototype['finally'] = t),
    (s.all = function (t) {
      return new s(function (e, i) {
        if (!o(t)) return i(new TypeError('Promise.all accepts an array'))
        var n = Array.prototype.slice.call(t)
        if (0 === n.length) return e([])
        var r = n.length
        function s(t, o) {
          try {
            if (o && ('object' == typeof o || 'function' == typeof o)) {
              var a = o.then
              if ('function' == typeof a) {
                return void a.call(
                  o,
                  function (e) {
                    s(t, e)
                  },
                  i,
                )
              }
            }
            ;(n[t] = o), 0 == --r && e(n)
          } catch (c) {
            i(c)
          }
        }
        for (var a = 0; a < n.length; a++) s(a, n[a])
      })
    }),
    (s.allSettled = e),
    (s.resolve = function (t) {
      return t && 'object' == typeof t && t.constructor === s
        ? t
        : new s(function (e) {
            e(t)
          })
    }),
    (s.reject = function (t) {
      return new s(function (e, i) {
        i(t)
      })
    }),
    (s.race = function (t) {
      return new s(function (e, i) {
        if (!o(t)) return i(new TypeError('Promise.race accepts an array'))
        for (var n = 0, r = t.length; n < r; n++) s.resolve(t[n]).then(e, i)
      })
    }),
    (s._immediateFn =
      ('function' == typeof n &&
        function (t) {
          n(t)
        }) ||
      function (t) {
        i(t, 0)
      }),
    (s._unhandledRejectionFn = function (t) {
      'undefined' != typeof console &&
        console &&
        console.warn('Possible Unhandled Promise Rejection:', t)
    })
  var d = (function () {
    if ('undefined' != typeof self) return self
    if ('undefined' != typeof window) return window
    if ('undefined' != typeof global) return global
    throw new Error('unable to locate global object')
  })()
  function p(t, e, i) {
    return e <= t && t <= i
  }
  function m(t) {
    if (t === undefined) return {}
    if (t === Object(t)) return t
    throw TypeError('Could not convert argument to dictionary')
  }
  'function' != typeof d.Promise
    ? (d.Promise = s)
    : (d.Promise.prototype['finally'] || (d.Promise.prototype['finally'] = t),
      d.Promise.allSettled || (d.Promise.allSettled = e))
  var y = function (t) {
      return t >= 0 && t <= 127
    },
    g = -1
  function v(t) {
    ;(this.tokens = [].slice.call(t)), this.tokens.reverse()
  }
  v.prototype = {
    endOfStream: function () {
      return !this.tokens.length
    },
    read: function () {
      return this.tokens.length ? this.tokens.pop() : g
    },
    prepend: function (t) {
      if (Array.isArray(t)) for (var e = t; e.length; ) this.tokens.push(e.pop())
      else this.tokens.push(t)
    },
    push: function (t) {
      if (Array.isArray(t)) for (var e = t; e.length; ) this.tokens.unshift(e.shift())
      else this.tokens.unshift(t)
    },
  }
  var b = -1
  function w(t, e) {
    if (t) throw TypeError('Decoder error')
    return e || 65533
  }
  function x(t) {
    return (
      (t = String(t).trim().toLowerCase()), Object.prototype.hasOwnProperty.call(k, t) ? k[t] : null
    )
  }
  var k = {}
  ;[
    {
      encodings: [{ labels: ['unicode-1-1-utf-8', 'utf-8', 'utf8'], name: 'UTF-8' }],
      heading: 'The Encoding',
    },
  ].forEach(function (t) {
    t.encodings.forEach(function (t) {
      t.labels.forEach(function (e) {
        k[e] = t
      })
    })
  })
  var C,
    _ = {
      'UTF-8': function (t) {
        return new T(t)
      },
    },
    E = {
      'UTF-8': function (t) {
        return new L(t)
      },
    },
    A = 'utf-8'
  function S(t, e) {
    if (!(this instanceof S)) throw TypeError("Called as a function. Did you forget 'new'?")
    ;(t = t !== undefined ? String(t) : A),
      (e = m(e)),
      (this._encoding = null),
      (this._decoder = null),
      (this._ignoreBOM = !1),
      (this._BOMseen = !1),
      (this._error_mode = 'replacement'),
      (this._do_not_flush = !1)
    var i = x(t)
    if (null === i || 'replacement' === i.name) throw RangeError('Unknown encoding: ' + t)
    if (!E[i.name]) {
      throw Error('Decoder not present. Did you forget to include encoding-indexes.js first?')
    }
    var n = this
    return (
      (n._encoding = i),
      e.fatal && (n._error_mode = 'fatal'),
      e.ignoreBOM && (n._ignoreBOM = !0),
      Object.defineProperty ||
        ((this.encoding = n._encoding.name.toLowerCase()),
        (this.fatal = 'fatal' === n._error_mode),
        (this.ignoreBOM = n._ignoreBOM)),
      n
    )
  }
  function B(t, e) {
    if (!(this instanceof B)) throw TypeError("Called as a function. Did you forget 'new'?")
    ;(e = m(e)),
      (this._encoding = null),
      (this._encoder = null),
      (this._do_not_flush = !1),
      (this._fatal = e.fatal ? 'fatal' : 'replacement')
    var i = this
    if (e.NONSTANDARD_allowLegacyEncoding) {
      var n = x((t = t !== undefined ? String(t) : A))
      if (null === n || 'replacement' === n.name) throw RangeError('Unknown encoding: ' + t)
      if (!_[n.name]) {
        throw Error('Encoder not present. Did you forget to include encoding-indexes.js first?')
      }
      i._encoding = n
    } else i._encoding = x('utf-8')
    return Object.defineProperty || (this.encoding = i._encoding.name.toLowerCase()), i
  }
  function L(t) {
    var e = t.fatal,
      i = 0,
      n = 0,
      o = 0,
      r = 128,
      s = 191
    this.handler = function (t, a) {
      if (a === g && 0 !== o) return (o = 0), w(e)
      if (a === g) return b
      if (0 === o) {
        if (p(a, 0, 127)) return a
        if (p(a, 194, 223)) (o = 1), (i = 31 & a)
        else if (p(a, 224, 239)) {
          224 === a && (r = 160), 237 === a && (s = 159), (o = 2), (i = 15 & a)
        } else {
          if (!p(a, 240, 244)) return w(e)
          240 === a && (r = 144), 244 === a && (s = 143), (o = 3), (i = 7 & a)
        }
        return null
      }
      if (!p(a, r, s)) return (i = o = n = 0), (r = 128), (s = 191), t.prepend(a), w(e)
      if (((r = 128), (s = 191), (i = (i << 6) | (63 & a)), (n += 1) !== o)) return null
      var c = i
      return (i = o = n = 0), c
    }
  }
  function T(t) {
    t.fatal
    this.handler = function (t, e) {
      if (e === g) return b
      if (y(e)) return e
      var i, n
      p(e, 128, 2047)
        ? ((i = 1), (n = 192))
        : p(e, 2048, 65535)
        ? ((i = 2), (n = 224))
        : p(e, 65536, 1114111) && ((i = 3), (n = 240))
      for (var o = [(e >> (6 * i)) + n]; i > 0; ) {
        var r = e >> (6 * (i - 1))
        o.push(128 | (63 & r)), (i -= 1)
      }
      return o
    }
  }
  Object.defineProperty &&
    (Object.defineProperty(S.prototype, 'encoding', {
      get: function () {
        return this._encoding.name.toLowerCase()
      },
    }),
    Object.defineProperty(S.prototype, 'fatal', {
      get: function () {
        return 'fatal' === this._error_mode
      },
    }),
    Object.defineProperty(S.prototype, 'ignoreBOM', {
      get: function () {
        return this._ignoreBOM
      },
    })),
    (S.prototype.decode = function (t, e) {
      var i
      ;(i =
        'object' == typeof t && t instanceof ArrayBuffer
          ? new Uint8Array(t)
          : 'object' == typeof t && 'buffer' in t && t.buffer instanceof ArrayBuffer
          ? new Uint8Array(t.buffer, t.byteOffset, t.byteLength)
          : new Uint8Array(0)),
        (e = m(e)),
        this._do_not_flush ||
          ((this._decoder = E[this._encoding.name]({ fatal: 'fatal' === this._error_mode })),
          (this._BOMseen = !1)),
        (this._do_not_flush = Boolean(e.stream))
      for (var n, o = new v(i), r = []; ; ) {
        var s = o.read()
        if (s === g) break
        if ((n = this._decoder.handler(o, s)) === b) break
        null !== n && (Array.isArray(n) ? r.push.apply(r, n) : r.push(n))
      }
      if (!this._do_not_flush) {
        do {
          if ((n = this._decoder.handler(o, o.read())) === b) break
          null !== n && (Array.isArray(n) ? r.push.apply(r, n) : r.push(n))
        } while (!o.endOfStream())
        this._decoder = null
      }
      return function (t) {
        var e, i
        return (
          (e = ['UTF-8', 'UTF-16LE', 'UTF-16BE']),
          (i = this._encoding.name),
          -1 === e.indexOf(i) ||
            this._ignoreBOM ||
            this._BOMseen ||
            (t.length > 0 && 65279 === t[0]
              ? ((this._BOMseen = !0), t.shift())
              : t.length > 0 && (this._BOMseen = !0)),
          (function (t) {
            for (var e = '', i = 0; i < t.length; ++i) {
              var n = t[i]
              n <= 65535
                ? (e += String.fromCharCode(n))
                : ((n -= 65536), (e += String.fromCharCode(55296 + (n >> 10), 56320 + (1023 & n))))
            }
            return e
          })(t)
        )
      }.call(this, r)
    }),
    Object.defineProperty &&
      Object.defineProperty(B.prototype, 'encoding', {
        get: function () {
          return this._encoding.name.toLowerCase()
        },
      }),
    (B.prototype.encode = function (t, e) {
      ;(t = t === undefined ? '' : String(t)),
        (e = m(e)),
        this._do_not_flush ||
          (this._encoder = _[this._encoding.name]({ fatal: 'fatal' === this._fatal })),
        (this._do_not_flush = Boolean(e.stream))
      for (
        var i,
          n = new v(
            (function (t) {
              for (var e = String(t), i = e.length, n = 0, o = []; n < i; ) {
                var r = e.charCodeAt(n)
                if (r < 55296 || r > 57343) o.push(r)
                else if (r >= 56320 && r <= 57343) o.push(65533)
                else if (r >= 55296 && r <= 56319) {
                  if (n === i - 1) o.push(65533)
                  else {
                    var s = e.charCodeAt(n + 1)
                    if (s >= 56320 && s <= 57343) {
                      var a = 1023 & r,
                        c = 1023 & s
                      o.push(65536 + (a << 10) + c), (n += 1)
                    } else o.push(65533)
                  }
                }
                n += 1
              }
              return o
            })(t),
          ),
          o = [];
        ;

      ) {
        var r = n.read()
        if (r === g) break
        if ((i = this._encoder.handler(n, r)) === b) break
        Array.isArray(i) ? o.push.apply(o, i) : o.push(i)
      }
      if (!this._do_not_flush) {
        for (; (i = this._encoder.handler(n, n.read())) !== b; ) {
          Array.isArray(i) ? o.push.apply(o, i) : o.push(i)
        }
        this._encoder = null
      }
      return new Uint8Array(o)
    }),
    window.TextDecoder || (window.TextDecoder = S),
    window.TextEncoder || (window.TextEncoder = B),
    (function (t) {
      if ('function' != typeof Promise) throw 'Promise support required'
      var e = t.crypto || t.msCrypto
      if (e) {
        var i = e.subtle || e.webkitSubtle
        if (i) {
          var n = t.Crypto || e.constructor || Object,
            o = t.SubtleCrypto || i.constructor || Object,
            r = (t.CryptoKey || t.Key, t.navigator.userAgent.indexOf('Edge/') > -1),
            s = !!t.msCrypto && !r,
            a = !e.subtle && !!e.webkitSubtle
          if (s || a) {
            var c = { KoZIhvcNAQEB: '1.2.840.113549.1.1.1' },
              l = { '1.2.840.113549.1.1.1': 'KoZIhvcNAQEB' }
            if (
              (['generateKey', 'importKey', 'unwrapKey'].forEach(function (t) {
                var n = i[t]
                i[t] = function (o, r, c) {
                  var l,
                    h,
                    u,
                    p,
                    w = [].slice.call(arguments)
                  switch (t) {
                    case 'generateKey':
                      ;(l = m(o)), (h = r), (u = c)
                      break
                    case 'importKey':
                      ;(l = m(c)),
                        (h = w[3]),
                        (u = w[4]),
                        'jwk' === o &&
                          ((r = g(r)).alg || (r.alg = y(l)),
                          r.key_ops ||
                            (r.key_ops =
                              'oct' !== r.kty ? ('d' in r ? u.filter(E) : u.filter(_)) : u.slice()),
                          (w[1] = v(r)))
                      break
                    case 'unwrapKey':
                      ;(l = w[4]), (h = w[5]), (u = w[6]), (w[2] = c._key)
                  }
                  if ('generateKey' === t && 'HMAC' === l.name && l.hash) {
                    return (
                      (l.length =
                        l.length ||
                        { 'SHA-1': 512, 'SHA-256': 512, 'SHA-384': 1024, 'SHA-512': 1024 }[
                          l.hash.name
                        ]),
                      i.importKey(
                        'raw',
                        e.getRandomValues(new Uint8Array((l.length + 7) >> 3)),
                        l,
                        h,
                        u,
                      )
                    )
                  }
                  if (
                    a &&
                    'generateKey' === t &&
                    'RSASSA-PKCS1-v1_5' === l.name &&
                    (!l.modulusLength || l.modulusLength >= 2048)
                  ) {
                    return (
                      ((o = m(o)).name = 'RSAES-PKCS1-v1_5'),
                      delete o.hash,
                      i
                        .generateKey(o, !0, ['encrypt', 'decrypt'])
                        .then(function (t) {
                          return Promise.all([
                            i.exportKey('jwk', t.publicKey),
                            i.exportKey('jwk', t.privateKey),
                          ])
                        })
                        .then(function (t) {
                          return (
                            (t[0].alg = t[1].alg = y(l)),
                            (t[0].key_ops = u.filter(_)),
                            (t[1].key_ops = u.filter(E)),
                            Promise.all([
                              i.importKey('jwk', t[0], l, !0, t[0].key_ops),
                              i.importKey('jwk', t[1], l, h, t[1].key_ops),
                            ])
                          )
                        })
                        .then(function (t) {
                          return { publicKey: t[0], privateKey: t[1] }
                        })
                    )
                  }
                  if (
                    (a || (s && 'SHA-1' === (l.hash || {}).name)) &&
                    'importKey' === t &&
                    'jwk' === o &&
                    'HMAC' === l.name &&
                    'oct' === r.kty
                  ) {
                    return i.importKey('raw', d(f(r.k)), c, w[3], w[4])
                  }
                  if (a && 'importKey' === t && ('spki' === o || 'pkcs8' === o)) {
                    return i.importKey('jwk', b(r), c, w[3], w[4])
                  }
                  if (s && 'unwrapKey' === t) {
                    return i.decrypt(w[3], c, r).then(function (t) {
                      return i.importKey(o, t, w[4], w[5], w[6])
                    })
                  }
                  try {
                    p = n.apply(i, w)
                  } catch (x) {
                    return Promise.reject(x)
                  }
                  return (
                    s &&
                      (p = new Promise(function (t, e) {
                        ;(p.onabort = p.onerror =
                          function (t) {
                            e(t)
                          }),
                          (p.oncomplete = function (e) {
                            t(e.target.result)
                          })
                      })),
                    (p = p.then(function (t) {
                      return (
                        'HMAC' === l.name && (l.length || (l.length = 8 * t.algorithm.length)),
                        0 == l.name.search('RSA') &&
                          (l.modulusLength ||
                            (l.modulusLength = (t.publicKey || t).algorithm.modulusLength),
                          l.publicExponent ||
                            (l.publicExponent = (t.publicKey || t).algorithm.publicExponent)),
                        (t =
                          t.publicKey && t.privateKey
                            ? {
                                publicKey: new C(t.publicKey, l, h, u.filter(_)),
                                privateKey: new C(t.privateKey, l, h, u.filter(E)),
                              }
                            : new C(t, l, h, u))
                      )
                    }))
                  )
                }
              }),
              ['exportKey', 'wrapKey'].forEach(function (t) {
                var e = i[t]
                i[t] = function (n, o, r) {
                  var c,
                    l = [].slice.call(arguments)
                  switch (t) {
                    case 'exportKey':
                      l[1] = o._key
                      break
                    case 'wrapKey':
                      ;(l[1] = o._key), (l[2] = r._key)
                  }
                  if (
                    ((a || (s && 'SHA-1' === (o.algorithm.hash || {}).name)) &&
                      'exportKey' === t &&
                      'jwk' === n &&
                      'HMAC' === o.algorithm.name &&
                      (l[0] = 'raw'),
                    !a || 'exportKey' !== t || ('spki' !== n && 'pkcs8' !== n) || (l[0] = 'jwk'),
                    s && 'wrapKey' === t)
                  ) {
                    return i.exportKey(n, o).then(function (t) {
                      return (
                        'jwk' === n && (t = d(unescape(encodeURIComponent(JSON.stringify(g(t)))))),
                        i.encrypt(l[3], r, t)
                      )
                    })
                  }
                  try {
                    c = e.apply(i, l)
                  } catch (h) {
                    return Promise.reject(h)
                  }
                  return (
                    s &&
                      (c = new Promise(function (t, e) {
                        ;(c.onabort = c.onerror =
                          function (t) {
                            e(t)
                          }),
                          (c.oncomplete = function (e) {
                            t(e.target.result)
                          })
                      })),
                    'exportKey' === t &&
                      'jwk' === n &&
                      (c = c.then(function (t) {
                        return (a || (s && 'SHA-1' === (o.algorithm.hash || {}).name)) &&
                          'HMAC' === o.algorithm.name
                          ? {
                              kty: 'oct',
                              alg: y(o.algorithm),
                              key_ops: o.usages.slice(),
                              ext: !0,
                              k: u(p(t)),
                            }
                          : ((t = g(t)).alg || (t.alg = y(o.algorithm)),
                            t.key_ops ||
                              (t.key_ops =
                                'public' === o.type
                                  ? o.usages.filter(_)
                                  : 'private' === o.type
                                  ? o.usages.filter(E)
                                  : o.usages.slice()),
                            t)
                      })),
                    !a ||
                      'exportKey' !== t ||
                      ('spki' !== n && 'pkcs8' !== n) ||
                      (c = c.then(function (t) {
                        return (t = w(g(t)))
                      })),
                    c
                  )
                }
              }),
              ['encrypt', 'decrypt', 'sign', 'verify'].forEach(function (t) {
                var e = i[t]
                i[t] = function (n, o, r, a) {
                  if (s && (!r.byteLength || (a && !a.byteLength))) {
                    throw new Error('Empty input is not allowed')
                  }
                  var c,
                    l = [].slice.call(arguments),
                    h = m(n)
                  if (
                    (!s ||
                      ('sign' !== t && 'verify' !== t) ||
                      ('RSASSA-PKCS1-v1_5' !== n && 'HMAC' !== n) ||
                      (l[0] = { name: n }),
                    s && o.algorithm.hash && (l[0].hash = l[0].hash || o.algorithm.hash),
                    s && 'decrypt' === t && 'AES-GCM' === h.name)
                  ) {
                    var u = n.tagLength >> 3
                    ;(l[2] = (r.buffer || r).slice(0, r.byteLength - u)),
                      (n.tag = (r.buffer || r).slice(r.byteLength - u))
                  }
                  s &&
                    'AES-GCM' === h.name &&
                    l[0].tagLength === undefined &&
                    (l[0].tagLength = 128),
                    (l[1] = o._key)
                  try {
                    c = e.apply(i, l)
                  } catch (f) {
                    return Promise.reject(f)
                  }
                  return (
                    s &&
                      (c = new Promise(function (e, i) {
                        ;(c.onabort = c.onerror =
                          function (t) {
                            i(t)
                          }),
                          (c.oncomplete = function (i) {
                            i = i.target.result
                            if ('encrypt' === t && i instanceof AesGcmEncryptResult) {
                              var n = i.ciphertext,
                                o = i.tag
                              ;(i = new Uint8Array(n.byteLength + o.byteLength)).set(
                                new Uint8Array(n),
                                0,
                              ),
                                i.set(new Uint8Array(o), n.byteLength),
                                (i = i.buffer)
                            }
                            e(i)
                          })
                      })),
                    c
                  )
                }
              }),
              s)
            ) {
              var h = i.digest
              ;(i.digest = function (t, e) {
                if (!e.byteLength) throw new Error('Empty input is not allowed')
                var n
                try {
                  n = h.call(i, t, e)
                } catch (o) {
                  return Promise.reject(o)
                }
                return (
                  (n = new Promise(function (t, e) {
                    ;(n.onabort = n.onerror =
                      function (t) {
                        e(t)
                      }),
                      (n.oncomplete = function (e) {
                        t(e.target.result)
                      })
                  })),
                  n
                )
              }),
                (t.crypto = Object.create(e, {
                  getRandomValues: {
                    value: function (t) {
                      return e.getRandomValues(t)
                    },
                  },
                  subtle: { value: i },
                })),
                (t.CryptoKey = C)
            }
            a && ((e.subtle = i), (t.Crypto = n), (t.SubtleCrypto = o), (t.CryptoKey = C))
          }
        }
      }
      function u(t) {
        return btoa(t).replace(/\=+$/, '').replace(/\+/g, '-').replace(/\//g, '_')
      }
      function f(t) {
        return (
          (t = (t += '===').slice(0, -t.length % 4)), atob(t.replace(/-/g, '+').replace(/_/g, '/'))
        )
      }
      function d(t) {
        for (var e = new Uint8Array(t.length), i = 0; i < t.length; i++) e[i] = t.charCodeAt(i)
        return e
      }
      function p(t) {
        return (
          t instanceof ArrayBuffer && (t = new Uint8Array(t)), String.fromCharCode.apply(String, t)
        )
      }
      function m(t) {
        var e = { name: (t.name || t || '').toUpperCase().replace('V', 'v') }
        switch (e.name) {
          case 'SHA-1':
          case 'SHA-256':
          case 'SHA-384':
          case 'SHA-512':
            break
          case 'AES-CBC':
          case 'AES-GCM':
          case 'AES-KW':
            t.length && (e.length = t.length)
            break
          case 'HMAC':
            t.hash && (e.hash = m(t.hash)), t.length && (e.length = t.length)
            break
          case 'RSAES-PKCS1-v1_5':
            t.publicExponent && (e.publicExponent = new Uint8Array(t.publicExponent)),
              t.modulusLength && (e.modulusLength = t.modulusLength)
            break
          case 'RSASSA-PKCS1-v1_5':
          case 'RSA-OAEP':
            t.hash && (e.hash = m(t.hash)),
              t.publicExponent && (e.publicExponent = new Uint8Array(t.publicExponent)),
              t.modulusLength && (e.modulusLength = t.modulusLength)
            break
          default:
            throw new SyntaxError('Bad algorithm name')
        }
        return e
      }
      function y(t) {
        return {
          HMAC: { 'SHA-1': 'HS1', 'SHA-256': 'HS256', 'SHA-384': 'HS384', 'SHA-512': 'HS512' },
          'RSASSA-PKCS1-v1_5': {
            'SHA-1': 'RS1',
            'SHA-256': 'RS256',
            'SHA-384': 'RS384',
            'SHA-512': 'RS512',
          },
          'RSAES-PKCS1-v1_5': { '': 'RSA1_5' },
          'RSA-OAEP': { 'SHA-1': 'RSA-OAEP', 'SHA-256': 'RSA-OAEP-256' },
          'AES-KW': { 128: 'A128KW', 192: 'A192KW', 256: 'A256KW' },
          'AES-GCM': { 128: 'A128GCM', 192: 'A192GCM', 256: 'A256GCM' },
          'AES-CBC': { 128: 'A128CBC', 192: 'A192CBC', 256: 'A256CBC' },
        }[t.name][(t.hash || {}).name || t.length || '']
      }
      function g(t) {
        ;(t instanceof ArrayBuffer || t instanceof Uint8Array) &&
          (t = JSON.parse(decodeURIComponent(escape(p(t)))))
        var e = { kty: t.kty, alg: t.alg, ext: t.ext || t.extractable }
        switch (e.kty) {
          case 'oct':
            e.k = t.k
          case 'RSA':
            ;['n', 'e', 'd', 'p', 'q', 'dp', 'dq', 'qi', 'oth'].forEach(function (i) {
              i in t && (e[i] = t[i])
            })
            break
          default:
            throw new TypeError('Unsupported key type')
        }
        return e
      }
      function v(t) {
        var e = g(t)
        return (
          s && ((e.extractable = e.ext), delete e.ext),
          d(unescape(encodeURIComponent(JSON.stringify(e)))).buffer
        )
      }
      function b(t) {
        var e = x(t),
          i = !1
        e.length > 2 && ((i = !0), e.shift())
        var n = { ext: !0 }
        if ('1.2.840.113549.1.1.1' !== e[0][0]) throw new TypeError('Unsupported key type')
        var o = ['n', 'e', 'd', 'p', 'q', 'dp', 'dq', 'qi'],
          r = x(e[1])
        i && r.shift()
        for (var s = 0; s < r.length; s++) {
          r[s][0] || (r[s] = r[s].subarray(1)), (n[o[s]] = u(p(r[s])))
        }
        return (n.kty = 'RSA'), n
      }
      function w(t) {
        var e,
          i = [['', null]],
          n = !1
        if ('RSA' !== t.kty) throw new TypeError('Unsupported key type')
        for (
          var o = ['n', 'e', 'd', 'p', 'q', 'dp', 'dq', 'qi'], r = [], s = 0;
          s < o.length && o[s] in t;
          s++
        ) {
          var a = (r[s] = d(f(t[o[s]])))
          128 & a[0] && ((r[s] = new Uint8Array(a.length + 1)), r[s].set(a, 1))
        }
        return (
          r.length > 2 && ((n = !0), r.unshift(new Uint8Array([0]))),
          (i[0][0] = '1.2.840.113549.1.1.1'),
          (e = r),
          i.push(new Uint8Array(k(e)).buffer),
          n ? i.unshift(new Uint8Array([0])) : (i[1] = { tag: 3, value: i[1] }),
          new Uint8Array(k(i)).buffer
        )
      }
      function x(t, e) {
        if (
          (t instanceof ArrayBuffer && (t = new Uint8Array(t)),
          e || (e = { pos: 0, end: t.length }),
          e.end - e.pos < 2 || e.end > t.length)
        ) {
          throw new RangeError('Malformed DER')
        }
        var i,
          n = t[e.pos++],
          o = t[e.pos++]
        if (o >= 128) {
          if (((o &= 127), e.end - e.pos < o)) throw new RangeError('Malformed DER')
          for (var r = 0; o--; ) (r <<= 8), (r |= t[e.pos++])
          o = r
        }
        if (e.end - e.pos < o) throw new RangeError('Malformed DER')
        switch (n) {
          case 2:
            i = t.subarray(e.pos, (e.pos += o))
            break
          case 3:
            if (t[e.pos++]) throw new Error('Unsupported bit string')
            o--
          case 4:
            i = new Uint8Array(t.subarray(e.pos, (e.pos += o))).buffer
            break
          case 5:
            i = null
            break
          case 6:
            var s = btoa(p(t.subarray(e.pos, (e.pos += o))))
            if (!(s in c)) throw new Error('Unsupported OBJECT ID ' + s)
            i = c[s]
            break
          case 48:
            i = []
            for (var a = e.pos + o; e.pos < a; ) i.push(x(t, e))
            break
          default:
            throw new Error('Unsupported DER tag 0x' + n.toString(16))
        }
        return i
      }
      function k(t, e) {
        e || (e = [])
        var i = 0,
          n = 0,
          o = e.length + 2
        if ((e.push(0, 0), t instanceof Uint8Array)) {
          ;(i = 2), (n = t.length)
          for (var r = 0; r < n; r++) e.push(t[r])
        } else if (t instanceof ArrayBuffer) {
          ;(i = 4), (n = t.byteLength), (t = new Uint8Array(t))
          for (r = 0; r < n; r++) e.push(t[r])
        } else if (null === t) (i = 5), (n = 0)
        else if ('string' == typeof t && t in l) {
          var s = d(atob(l[t]))
          ;(i = 6), (n = s.length)
          for (r = 0; r < n; r++) e.push(s[r])
        } else if (t instanceof Array) {
          for (r = 0; r < t.length; r++) k(t[r], e)
          ;(i = 48), (n = e.length - o)
        } else {
          if (!('object' == typeof t && 3 === t.tag && t.value instanceof ArrayBuffer)) {
            throw new Error('Unsupported DER value ' + t)
          }
          ;(i = 3), (n = (t = new Uint8Array(t.value)).byteLength), e.push(0)
          for (r = 0; r < n; r++) e.push(t[r])
          n++
        }
        if (n >= 128) {
          var a = n
          n = 4
          for (
            e.splice(o, 0, (a >> 24) & 255, (a >> 16) & 255, (a >> 8) & 255, 255 & a);
            n > 1 && !(a >> 24);

          ) {
            ;(a <<= 8), n--
          }
          n < 4 && e.splice(o, 4 - n), (n |= 128)
        }
        return e.splice(o - 2, 2, i, n), e
      }
      function C(t, e, i, n) {
        Object.defineProperties(this, {
          _key: { value: t },
          type: { value: t.type, enumerable: !0 },
          extractable: { value: i === undefined ? t.extractable : i, enumerable: !0 },
          algorithm: { value: e === undefined ? t.algorithm : e, enumerable: !0 },
          usages: { value: n === undefined ? t.usages : n, enumerable: !0 },
        })
      }
      function _(t) {
        return 'verify' === t || 'encrypt' === t || 'wrapKey' === t
      }
      function E(t) {
        return 'sign' === t || 'decrypt' === t || 'unwrapKey' === t
      }
    })(window),
    Array.prototype.indexOf ||
      (Array.prototype.indexOf = (function (t) {
        return function (e, i) {
          if (null === this || this === undefined) {
            throw TypeError('Array.prototype.indexOf called on null or undefined')
          }
          var n = t(this),
            o = n.length >>> 0,
            r = Math.min(0 | i, o)
          if (r < 0) r = Math.max(0, o + r)
          else if (r >= o) return -1
          if (void 0 === e) {
            for (; r !== o; ++r) if (void 0 === n[r] && r in n) return r
          } else if (e != e) {
            for (; r !== o; ++r) if (n[r] != n[r]) return r
          } else for (; r !== o; ++r) if (n[r] === e) return r
          return -1
        }
      })(Object)),
    Array.isArray ||
      (Array.isArray = function (t) {
        return '[object Array]' === Object.prototype.toString.call(t)
      }),
    document.getElementsByClassName ||
      (window.Element.prototype.getElementsByClassName =
        document.constructor.prototype.getElementsByClassName =
          function (t) {
            if (document.querySelectorAll) return document.querySelectorAll('.' + t)
            for (
              var e = document.getElementsByTagName('*'),
                i = new RegExp('(^|\\s)' + t + '(\\s|$)'),
                n = [],
                o = 0;
              o < e.length;
              o++
            ) {
              i.test(e[o].className) && n.push(e[o])
            }
            return n
          }),
    String.prototype.startsWith ||
      (String.prototype.startsWith = function (t, e) {
        return this.substr(!e || e < 0 ? 0 : +e, t.length) === t
      }),
    String.prototype.endsWith ||
      (String.prototype.endsWith = function (t, e) {
        return (
          (e === undefined || e > this.length) && (e = this.length),
          this.substring(e - t.length, e) === t
        )
      })
  try {
    if (
      Object.defineProperty &&
      Object.getOwnPropertyDescriptor &&
      Object.getOwnPropertyDescriptor(Element.prototype, 'textContent') &&
      !Object.getOwnPropertyDescriptor(Element.prototype, 'textContent').get
    ) {
      var O = Object.getOwnPropertyDescriptor(Element.prototype, 'innerText')
      Object.defineProperty(Element.prototype, 'textContent', {
        get: function () {
          return O.get.call(this)
        },
        set: function (t) {
          O.set.call(this, t)
        },
      })
    }
  } catch (Qr) {}
  Function.prototype.bind ||
    (Function.prototype.bind = function (t) {
      if ('function' != typeof this) {
        throw new TypeError('Function.prototype.bind: Item Can Not Be Bound.')
      }
      var e = Array.prototype.slice.call(arguments, 1),
        i = this,
        n = function () {},
        o = function () {
          return i.apply(
            this instanceof n ? this : t,
            e.concat(Array.prototype.slice.call(arguments)),
          )
        }
      return this.prototype && (n.prototype = this.prototype), (o.prototype = new n()), o
    }),
    'function' != typeof Object.create &&
      (Object.create = function (t, e) {
        function i() {}
        if (((i.prototype = t), 'object' == typeof e)) {
          for (var n in e) e.hasOwnProperty(n) && (i[n] = e[n])
        }
        return new i()
      }),
    Date.now ||
      (Date.now = function () {
        return new Date().getTime()
      }),
    window.console || (window.console = {})
  for (
    var H,
      M,
      R,
      P,
      I = ['error', 'info', 'log', 'show', 'table', 'trace', 'warn'],
      V = function (t) {},
      D = I.length;
    --D > -1;

  ) {
    ;(C = I[D]), window.console[C] || (window.console[C] = V)
  }
  if (window.atob) {
    try {
      window.atob(' ')
    } catch (ts) {
      window.atob = (function (t) {
        var e = function (e) {
          return t(String(e).replace(/[\t\n\f\r ]+/g, ''))
        }
        return (e.original = t), e
      })(window.atob)
    }
  } else {
    var F = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
      $ = /^(?:[A-Za-z\d+\/]{4})*?(?:[A-Za-z\d+\/]{2}(?:==)?|[A-Za-z\d+\/]{3}=?)?$/
    window.atob = function (t) {
      if (((t = String(t).replace(/[\t\n\f\r ]+/g, '')), !$.test(t))) {
        throw new TypeError(
          "Failed to execute 'atob' on 'Window': The string to be decoded is not correctly encoded.",
        )
      }
      var e, i, n
      t += '=='.slice(2 - (3 & t.length))
      for (var o = '', r = 0; r < t.length; ) {
        ;(e =
          (F.indexOf(t.charAt(r++)) << 18) |
          (F.indexOf(t.charAt(r++)) << 12) |
          ((i = F.indexOf(t.charAt(r++))) << 6) |
          (n = F.indexOf(t.charAt(r++)))),
          (o +=
            64 === i
              ? String.fromCharCode((e >> 16) & 255)
              : 64 === n
              ? String.fromCharCode((e >> 16) & 255, (e >> 8) & 255)
              : String.fromCharCode((e >> 16) & 255, (e >> 8) & 255, 255 & e))
      }
      return o
    }
  }
  if (
    (Event.prototype.preventDefault ||
      (Event.prototype.preventDefault = function () {
        this.returnValue = !1
      }),
    Event.prototype.stopPropagation ||
      (Event.prototype.stopPropagation = function () {
        this.cancelBubble = !0
      }),
    window.Prototype && Array.prototype.toJSON)
  ) {
    console.error(
      '[hCaptcha] Custom JSON polyfill detected, please remove to ensure hCaptcha works properly',
    )
    var U = Array.prototype.toJSON,
      j = JSON.stringify
    JSON.stringify = function (t) {
      try {
        return delete Array.prototype.toJSON, j(t)
      } finally {
        Array.prototype.toJSON = U
      }
    }
  }
  Object.keys ||
    (Object.keys =
      ((H = Object.prototype.hasOwnProperty),
      (M = !Object.prototype.propertyIsEnumerable.call({ toString: null }, 'toString')),
      (P = (R = [
        'toString',
        'toLocaleString',
        'valueOf',
        'hasOwnProperty',
        'isPrototypeOf',
        'propertyIsEnumerable',
        'constructor',
      ]).length),
      function (t) {
        if ('function' != typeof t && ('object' != typeof t || null === t)) {
          throw new TypeError('Object.keys called on non-object')
        }
        var e,
          i,
          n = []
        for (e in t) H.call(t, e) && n.push(e)
        if (M) for (i = 0; i < P; i++) H.call(t, R[i]) && n.push(R[i])
        return n
      })),
    /*! Raven.js 3.27.2 (6d91db933) | github.com/getsentry/raven-js */ (function (t) {
      if ('object' == typeof exports && 'undefined' != typeof module) module.exports = t()
      else if ('function' == typeof define && define.amd) define('raven-js', t)
      else {
        ;('undefined' != typeof window
          ? window
          : 'undefined' != typeof global
          ? global
          : 'undefined' != typeof self
          ? self
          : this
        ).Raven = t()
      }
    })(function () {
      return (function t(e, i, n) {
        function o(s, a) {
          if (!i[s]) {
            if (!e[s]) {
              var c = 'function' == typeof require && require
              if (!a && c) return c(s, !0)
              if (r) return r(s, !0)
              var l = new Error("Cannot find module '" + s + "'")
              throw ((l.code = 'MODULE_NOT_FOUND'), l)
            }
            var h = (i[s] = { exports: {} })
            e[s][0].call(
              h.exports,
              function (t) {
                var i = e[s][1][t]
                return o(i || t)
              },
              h,
              h.exports,
              t,
              e,
              i,
              n,
            )
          }
          return i[s].exports
        }
        for (var r = 'function' == typeof require && require, s = 0; s < n.length; s++) o(n[s])
        return o
      })(
        {
          1: [
            function (t, e, i) {
              function n(t) {
                ;(this.name = 'RavenConfigError'), (this.message = t)
              }
              ;(n.prototype = new Error()), (n.prototype.constructor = n), (e.exports = n)
            },
            {},
          ],
          2: [
            function (t, e, i) {
              var n = t(5)
              e.exports = {
                wrapMethod: function (t, e, i) {
                  var o = t[e],
                    r = t
                  if (e in t) {
                    var s = 'warn' === e ? 'warning' : e
                    t[e] = function () {
                      var t = [].slice.call(arguments),
                        a = n.safeJoin(t, ' '),
                        c = { level: s, logger: 'console', extra: { arguments: t } }
                      'assert' === e
                        ? !1 === t[0] &&
                          ((a =
                            'Assertion failed: ' +
                            (n.safeJoin(t.slice(1), ' ') || 'console.assert')),
                          (c.extra.arguments = t.slice(1)),
                          i && i(a, c))
                        : i && i(a, c),
                        o && Function.prototype.apply.call(o, r, t)
                    }
                  }
                },
              }
            },
            { 5: 5 },
          ],
          3: [
            function (t, e, i) {
              ;(function (i) {
                function n() {
                  return +new Date()
                }
                function o(t, e) {
                  return v(e)
                    ? function (i) {
                        return e(i, t)
                      }
                    : e
                }
                function r() {
                  for (var t in ((this.a = !('object' != typeof JSON || !JSON.stringify)),
                  (this.b = !g(z)),
                  (this.c = !g(Z)),
                  (this.d = null),
                  (this.e = null),
                  (this.f = null),
                  (this.g = null),
                  (this.h = null),
                  (this.i = null),
                  (this.j = {}),
                  (this.k = {
                    release: N.SENTRY_RELEASE && N.SENTRY_RELEASE.id,
                    logger: 'javascript',
                    ignoreErrors: [],
                    ignoreUrls: [],
                    whitelistUrls: [],
                    includePaths: [],
                    headers: null,
                    collectWindowErrors: !0,
                    captureUnhandledRejections: !0,
                    maxMessageLength: 0,
                    maxUrlLength: 250,
                    stackTraceLimit: 50,
                    autoBreadcrumbs: !0,
                    instrument: !0,
                    sampleRate: 1,
                    sanitizeKeys: [],
                  }),
                  (this.l = { method: 'POST', referrerPolicy: I() ? 'origin' : '' }),
                  (this.m = 0),
                  (this.n = !1),
                  (this.o = Error.stackTraceLimit),
                  (this.p = N.console || {}),
                  (this.q = {}),
                  (this.r = []),
                  (this.s = n()),
                  (this.t = []),
                  (this.u = []),
                  (this.v = null),
                  (this.w = N.location),
                  (this.x = this.w && this.w.href),
                  this.y(),
                  this.p)) {
                    this.q[t] = this.p[t]
                  }
                }
                var s = t(6),
                  a = t(7),
                  c = t(8),
                  l = t(1),
                  h = t(5),
                  u = h.isErrorEvent,
                  f = h.isDOMError,
                  d = h.isDOMException,
                  p = h.isError,
                  m = h.isObject,
                  y = h.isPlainObject,
                  g = h.isUndefined,
                  v = h.isFunction,
                  b = h.isString,
                  w = h.isArray,
                  x = h.isEmptyObject,
                  k = h.each,
                  C = h.objectMerge,
                  _ = h.truncate,
                  E = h.objectFrozen,
                  A = h.hasKey,
                  S = h.joinRegExp,
                  B = h.urlencode,
                  L = h.uuid4,
                  T = h.htmlTreeAsString,
                  O = h.isSameException,
                  H = h.isSameStacktrace,
                  M = h.parseUrl,
                  R = h.fill,
                  P = h.supportsFetch,
                  I = h.supportsReferrerPolicy,
                  V = h.serializeKeysForMessage,
                  D = h.serializeException,
                  F = h.sanitize,
                  $ = t(2).wrapMethod,
                  U = 'source protocol user pass host port path'.split(' '),
                  j = /^(?:(\w+):)?\/\/(?:(\w+)(:\w+)?@)?([\w\.-]+)(?::(\d+))?(\/.*)/,
                  N =
                    'undefined' != typeof window
                      ? window
                      : void 0 !== i
                      ? i
                      : 'undefined' != typeof self
                      ? self
                      : {},
                  z = N.document,
                  Z = N.navigator
                ;(r.prototype = {
                  VERSION: '3.27.2',
                  debug: !1,
                  TraceKit: s,
                  config: function (t, e) {
                    var i = this
                    if (i.g) return this.z('error', 'Error: Raven has already been configured'), i
                    if (!t) return i
                    var n = i.k
                    e &&
                      k(e, function (t, e) {
                        'tags' === t || 'extra' === t || 'user' === t ? (i.j[t] = e) : (n[t] = e)
                      }),
                      i.setDSN(t),
                      n.ignoreErrors.push(/^Script error\.?$/),
                      n.ignoreErrors.push(/^Javascript error: Script error\.? on line 0$/),
                      (n.ignoreErrors = S(n.ignoreErrors)),
                      (n.ignoreUrls = !!n.ignoreUrls.length && S(n.ignoreUrls)),
                      (n.whitelistUrls = !!n.whitelistUrls.length && S(n.whitelistUrls)),
                      (n.includePaths = S(n.includePaths)),
                      (n.maxBreadcrumbs = Math.max(0, Math.min(n.maxBreadcrumbs || 100, 100)))
                    var o = { xhr: !0, console: !0, dom: !0, location: !0, sentry: !0 },
                      r = n.autoBreadcrumbs
                    '[object Object]' === {}.toString.call(r) ? (r = C(o, r)) : !1 !== r && (r = o),
                      (n.autoBreadcrumbs = r)
                    var a = { tryCatch: !0 },
                      c = n.instrument
                    return (
                      '[object Object]' === {}.toString.call(c)
                        ? (c = C(a, c))
                        : !1 !== c && (c = a),
                      (n.instrument = c),
                      (s.collectWindowErrors = !!n.collectWindowErrors),
                      i
                    )
                  },
                  install: function () {
                    var t = this
                    return (
                      t.isSetup() &&
                        !t.n &&
                        (s.report.subscribe(function () {
                          t.A.apply(t, arguments)
                        }),
                        t.k.captureUnhandledRejections && t.B(),
                        t.C(),
                        t.k.instrument && t.k.instrument.tryCatch && t.D(),
                        t.k.autoBreadcrumbs && t.E(),
                        t.F(),
                        (t.n = !0)),
                      (Error.stackTraceLimit = t.k.stackTraceLimit),
                      this
                    )
                  },
                  setDSN: function (t) {
                    var e = this,
                      i = e.G(t),
                      n = i.path.lastIndexOf('/'),
                      o = i.path.substr(1, n)
                    ;(e.H = t),
                      (e.h = i.user),
                      (e.I = i.pass && i.pass.substr(1)),
                      (e.i = i.path.substr(n + 1)),
                      (e.g = e.J(i)),
                      (e.K = e.g + '/' + o + 'api/' + e.i + '/store/'),
                      this.y()
                  },
                  context: function (t, e, i) {
                    return (
                      v(t) && ((i = e || []), (e = t), (t = {})), this.wrap(t, e).apply(this, i)
                    )
                  },
                  wrap: function (t, e, i) {
                    function n() {
                      var n = [],
                        r = arguments.length,
                        s = !t || (t && !1 !== t.deep)
                      for (i && v(i) && i.apply(this, arguments); r--; ) {
                        n[r] = s ? o.wrap(t, arguments[r]) : arguments[r]
                      }
                      try {
                        return e.apply(this, n)
                      } catch (a) {
                        throw (o.L(), o.captureException(a, t), a)
                      }
                    }
                    var o = this
                    if (g(e) && !v(t)) return t
                    if ((v(t) && ((e = t), (t = void 0)), !v(e))) return e
                    try {
                      if (e.M) return e
                      if (e.N) return e.N
                    } catch (r) {
                      return e
                    }
                    for (var s in e) A(e, s) && (n[s] = e[s])
                    return (n.prototype = e.prototype), (e.N = n), (n.M = !0), (n.O = e), n
                  },
                  uninstall: function () {
                    return (
                      s.report.uninstall(),
                      this.P(),
                      this.Q(),
                      this.R(),
                      this.S(),
                      (Error.stackTraceLimit = this.o),
                      (this.n = !1),
                      this
                    )
                  },
                  T: function (t) {
                    this.z('debug', 'Raven caught unhandled promise rejection:', t),
                      this.captureException(t.reason, {
                        mechanism: { type: 'onunhandledrejection', handled: !1 },
                      })
                  },
                  B: function () {
                    return (
                      (this.T = this.T.bind(this)),
                      N.addEventListener && N.addEventListener('unhandledrejection', this.T),
                      this
                    )
                  },
                  P: function () {
                    return (
                      N.removeEventListener && N.removeEventListener('unhandledrejection', this.T),
                      this
                    )
                  },
                  captureException: function (t, e) {
                    if (((e = C({ trimHeadFrames: 0 }, e || {})), u(t) && t.error)) t = t.error
                    else {
                      if (f(t) || d(t)) {
                        var i = t.name || (f(t) ? 'DOMError' : 'DOMException'),
                          n = t.message ? i + ': ' + t.message : i
                        return this.captureMessage(
                          n,
                          C(e, { stacktrace: !0, trimHeadFrames: e.trimHeadFrames + 1 }),
                        )
                      }
                      if (p(t)) t = t
                      else {
                        if (!y(t)) {
                          return this.captureMessage(
                            t,
                            C(e, { stacktrace: !0, trimHeadFrames: e.trimHeadFrames + 1 }),
                          )
                        }
                        ;(e = this.U(e, t)), (t = new Error(e.message))
                      }
                    }
                    this.d = t
                    try {
                      var o = s.computeStackTrace(t)
                      this.V(o, e)
                    } catch (r) {
                      if (t !== r) throw r
                    }
                    return this
                  },
                  U: function (t, e) {
                    var i = Object.keys(e).sort(),
                      n = C(t, {
                        message: 'Non-Error exception captured with keys: ' + V(i),
                        fingerprint: [c(i)],
                        extra: t.extra || {},
                      })
                    return (n.extra.W = D(e)), n
                  },
                  captureMessage: function (t, e) {
                    if (!this.k.ignoreErrors.test || !this.k.ignoreErrors.test(t)) {
                      var i,
                        n = C({ message: (t += '') }, (e = e || {}))
                      try {
                        throw new Error(t)
                      } catch (o) {
                        i = o
                      }
                      i.name = null
                      var r = s.computeStackTrace(i),
                        a = w(r.stack) && r.stack[1]
                      a && 'Raven.captureException' === a.func && (a = r.stack[2])
                      var c = (a && a.url) || ''
                      if (
                        (!this.k.ignoreUrls.test || !this.k.ignoreUrls.test(c)) &&
                        (!this.k.whitelistUrls.test || this.k.whitelistUrls.test(c))
                      ) {
                        if (this.k.stacktrace || e.stacktrace || '' === n.message) {
                          ;(n.fingerprint = null == n.fingerprint ? t : n.fingerprint),
                            ((e = C({ trimHeadFrames: 0 }, e)).trimHeadFrames += 1)
                          var l = this.X(r, e)
                          n.stacktrace = { frames: l.reverse() }
                        }
                        return (
                          n.fingerprint &&
                            (n.fingerprint = w(n.fingerprint) ? n.fingerprint : [n.fingerprint]),
                          this.Y(n),
                          this
                        )
                      }
                    }
                  },
                  captureBreadcrumb: function (t) {
                    var e = C({ timestamp: n() / 1e3 }, t)
                    if (v(this.k.breadcrumbCallback)) {
                      var i = this.k.breadcrumbCallback(e)
                      if (m(i) && !x(i)) e = i
                      else if (!1 === i) return this
                    }
                    return (
                      this.u.push(e), this.u.length > this.k.maxBreadcrumbs && this.u.shift(), this
                    )
                  },
                  addPlugin: function (t) {
                    var e = [].slice.call(arguments, 1)
                    return this.r.push([t, e]), this.n && this.F(), this
                  },
                  setUserContext: function (t) {
                    return (this.j.user = t), this
                  },
                  setExtraContext: function (t) {
                    return this.Z('extra', t), this
                  },
                  setTagsContext: function (t) {
                    return this.Z('tags', t), this
                  },
                  clearContext: function () {
                    return (this.j = {}), this
                  },
                  getContext: function () {
                    return JSON.parse(a(this.j))
                  },
                  setEnvironment: function (t) {
                    return (this.k.environment = t), this
                  },
                  setRelease: function (t) {
                    return (this.k.release = t), this
                  },
                  setDataCallback: function (t) {
                    var e = this.k.dataCallback
                    return (this.k.dataCallback = o(e, t)), this
                  },
                  setBreadcrumbCallback: function (t) {
                    var e = this.k.breadcrumbCallback
                    return (this.k.breadcrumbCallback = o(e, t)), this
                  },
                  setShouldSendCallback: function (t) {
                    var e = this.k.shouldSendCallback
                    return (this.k.shouldSendCallback = o(e, t)), this
                  },
                  setTransport: function (t) {
                    return (this.k.transport = t), this
                  },
                  lastException: function () {
                    return this.d
                  },
                  lastEventId: function () {
                    return this.f
                  },
                  isSetup: function () {
                    return !(
                      !this.a ||
                      (!this.g &&
                        (this.ravenNotConfiguredError ||
                          ((this.ravenNotConfiguredError = !0),
                          this.z('error', 'Error: Raven has not been configured.')),
                        1))
                    )
                  },
                  afterLoad: function () {
                    var t = N.RavenConfig
                    t && this.config(t.dsn, t.config).install()
                  },
                  showReportDialog: function (t) {
                    if (z) {
                      if (
                        !(t = C(
                          { eventId: this.lastEventId(), dsn: this.H, user: this.j.user || {} },
                          t,
                        )).eventId
                      ) {
                        throw new l('Missing eventId')
                      }
                      if (!t.dsn) throw new l('Missing DSN')
                      var e = encodeURIComponent,
                        i = []
                      for (var n in t) {
                        if ('user' === n) {
                          var o = t.user
                          o.name && i.push('name=' + e(o.name)),
                            o.email && i.push('email=' + e(o.email))
                        } else i.push(e(n) + '=' + e(t[n]))
                      }
                      var r = this.J(this.G(t.dsn)),
                        s = z.createElement('script')
                      ;(s.async = !0),
                        (s.src = r + '/api/embed/error-page/?' + i.join('&')),
                        (z.head || z.body).appendChild(s)
                    }
                  },
                  L: function () {
                    var t = this
                    ;(this.m += 1),
                      setTimeout(function () {
                        t.m -= 1
                      })
                  },
                  $: function (t, e) {
                    var i, n
                    if (this.b) {
                      for (n in ((e = e || {}),
                      (t = 'raven' + t.substr(0, 1).toUpperCase() + t.substr(1)),
                      z.createEvent
                        ? (i = z.createEvent('HTMLEvents')).initEvent(t, !0, !0)
                        : ((i = z.createEventObject()).eventType = t),
                      e)) {
                        A(e, n) && (i[n] = e[n])
                      }
                      if (z.createEvent) z.dispatchEvent(i)
                      else {
                        try {
                          z.fireEvent('on' + i.eventType.toLowerCase(), i)
                        } catch (o) {}
                      }
                    }
                  },
                  _: function (t) {
                    var e = this
                    return function (i) {
                      if (((e.aa = null), e.v !== i)) {
                        var n
                        e.v = i
                        try {
                          n = T(i.target)
                        } catch (o) {
                          n = '<unknown>'
                        }
                        e.captureBreadcrumb({ category: 'ui.' + t, message: n })
                      }
                    }
                  },
                  ba: function () {
                    var t = this
                    return function (e) {
                      var i
                      try {
                        i = e.target
                      } catch (o) {
                        return
                      }
                      var n = i && i.tagName
                      if (n && ('INPUT' === n || 'TEXTAREA' === n || i.isContentEditable)) {
                        var r = t.aa
                        r || t._('input')(e),
                          clearTimeout(r),
                          (t.aa = setTimeout(function () {
                            t.aa = null
                          }, 1e3))
                      }
                    }
                  },
                  ca: function (t, e) {
                    var i = M(this.w.href),
                      n = M(e),
                      o = M(t)
                    ;(this.x = e),
                      i.protocol === n.protocol && i.host === n.host && (e = n.relative),
                      i.protocol === o.protocol && i.host === o.host && (t = o.relative),
                      this.captureBreadcrumb({ category: 'navigation', data: { to: e, from: t } })
                  },
                  C: function () {
                    var t = this
                    ;(t.da = Function.prototype.toString),
                      (Function.prototype.toString = function () {
                        return 'function' == typeof this && this.M
                          ? t.da.apply(this.O, arguments)
                          : t.da.apply(this, arguments)
                      })
                  },
                  Q: function () {
                    this.da && (Function.prototype.toString = this.da)
                  },
                  D: function () {
                    function t(t) {
                      return function (e, n) {
                        for (var o = new Array(arguments.length), r = 0; r < o.length; ++r) {
                          o[r] = arguments[r]
                        }
                        var s = o[0]
                        return (
                          v(s) &&
                            (o[0] = i.wrap(
                              {
                                mechanism: {
                                  type: 'instrument',
                                  data: { function: t.name || '<anonymous>' },
                                },
                              },
                              s,
                            )),
                          t.apply ? t.apply(this, o) : t(o[0], o[1])
                        )
                      }
                    }
                    function e(t) {
                      var e = N[t] && N[t].prototype
                      e &&
                        e.hasOwnProperty &&
                        e.hasOwnProperty('addEventListener') &&
                        (R(
                          e,
                          'addEventListener',
                          function (e) {
                            return function (n, r, s, a) {
                              try {
                                r &&
                                  r.handleEvent &&
                                  (r.handleEvent = i.wrap(
                                    {
                                      mechanism: {
                                        type: 'instrument',
                                        data: {
                                          target: t,
                                          function: 'handleEvent',
                                          handler: (r && r.name) || '<anonymous>',
                                        },
                                      },
                                    },
                                    r.handleEvent,
                                  ))
                              } catch (c) {}
                              var l, h, u
                              return (
                                o &&
                                  o.dom &&
                                  ('EventTarget' === t || 'Node' === t) &&
                                  ((h = i._('click')),
                                  (u = i.ba()),
                                  (l = function (t) {
                                    if (t) {
                                      var e
                                      try {
                                        e = t.type
                                      } catch (i) {
                                        return
                                      }
                                      return 'click' === e ? h(t) : 'keypress' === e ? u(t) : void 0
                                    }
                                  })),
                                e.call(
                                  this,
                                  n,
                                  i.wrap(
                                    {
                                      mechanism: {
                                        type: 'instrument',
                                        data: {
                                          target: t,
                                          function: 'addEventListener',
                                          handler: (r && r.name) || '<anonymous>',
                                        },
                                      },
                                    },
                                    r,
                                    l,
                                  ),
                                  s,
                                  a,
                                )
                              )
                            }
                          },
                          n,
                        ),
                        R(
                          e,
                          'removeEventListener',
                          function (t) {
                            return function (e, i, n, o) {
                              try {
                                i = i && (i.N ? i.N : i)
                              } catch (r) {}
                              return t.call(this, e, i, n, o)
                            }
                          },
                          n,
                        ))
                    }
                    var i = this,
                      n = i.t,
                      o = this.k.autoBreadcrumbs
                    R(N, 'setTimeout', t, n),
                      R(N, 'setInterval', t, n),
                      N.requestAnimationFrame &&
                        R(
                          N,
                          'requestAnimationFrame',
                          function (t) {
                            return function (e) {
                              return t(
                                i.wrap(
                                  {
                                    mechanism: {
                                      type: 'instrument',
                                      data: {
                                        function: 'requestAnimationFrame',
                                        handler: (t && t.name) || '<anonymous>',
                                      },
                                    },
                                  },
                                  e,
                                ),
                              )
                            }
                          },
                          n,
                        )
                    for (
                      var r = [
                          'EventTarget',
                          'Window',
                          'Node',
                          'ApplicationCache',
                          'AudioTrackList',
                          'ChannelMergerNode',
                          'CryptoOperation',
                          'EventSource',
                          'FileReader',
                          'HTMLUnknownElement',
                          'IDBDatabase',
                          'IDBRequest',
                          'IDBTransaction',
                          'KeyOperation',
                          'MediaController',
                          'MessagePort',
                          'ModalWindow',
                          'Notification',
                          'SVGElementInstance',
                          'Screen',
                          'TextTrack',
                          'TextTrackCue',
                          'TextTrackList',
                          'WebSocket',
                          'WebSocketWorker',
                          'Worker',
                          'XMLHttpRequest',
                          'XMLHttpRequestEventTarget',
                          'XMLHttpRequestUpload',
                        ],
                        s = 0;
                      s < r.length;
                      s++
                    ) {
                      e(r[s])
                    }
                  },
                  E: function () {
                    function t(t, i) {
                      t in i &&
                        v(i[t]) &&
                        R(i, t, function (i) {
                          return e.wrap(
                            {
                              mechanism: {
                                type: 'instrument',
                                data: { function: t, handler: (i && i.name) || '<anonymous>' },
                              },
                            },
                            i,
                          )
                        })
                    }
                    var e = this,
                      i = this.k.autoBreadcrumbs,
                      n = e.t
                    if (i.xhr && 'XMLHttpRequest' in N) {
                      var o = N.XMLHttpRequest && N.XMLHttpRequest.prototype
                      R(
                        o,
                        'open',
                        function (t) {
                          return function (i, n) {
                            return (
                              b(n) &&
                                -1 === n.indexOf(e.h) &&
                                (this.ea = { method: i, url: n, status_code: null }),
                              t.apply(this, arguments)
                            )
                          }
                        },
                        n,
                      ),
                        R(
                          o,
                          'send',
                          function (i) {
                            return function () {
                              function n() {
                                if (o.ea && 4 === o.readyState) {
                                  try {
                                    o.ea.status_code = o.status
                                  } catch (t) {}
                                  e.captureBreadcrumb({ type: 'http', category: 'xhr', data: o.ea })
                                }
                              }
                              for (
                                var o = this, r = ['onload', 'onerror', 'onprogress'], s = 0;
                                s < r.length;
                                s++
                              ) {
                                t(r[s], o)
                              }
                              return (
                                'onreadystatechange' in o && v(o.onreadystatechange)
                                  ? R(o, 'onreadystatechange', function (t) {
                                      return e.wrap(
                                        {
                                          mechanism: {
                                            type: 'instrument',
                                            data: {
                                              function: 'onreadystatechange',
                                              handler: (t && t.name) || '<anonymous>',
                                            },
                                          },
                                        },
                                        t,
                                        n,
                                      )
                                    })
                                  : (o.onreadystatechange = n),
                                i.apply(this, arguments)
                              )
                            }
                          },
                          n,
                        )
                    }
                    i.xhr &&
                      P() &&
                      R(
                        N,
                        'fetch',
                        function (t) {
                          return function () {
                            for (var i = new Array(arguments.length), n = 0; n < i.length; ++n) {
                              i[n] = arguments[n]
                            }
                            var o,
                              r = i[0],
                              s = 'GET'
                            if (
                              ('string' == typeof r
                                ? (o = r)
                                : 'Request' in N && r instanceof N.Request
                                ? ((o = r.url), r.method && (s = r.method))
                                : (o = '' + r),
                              -1 !== o.indexOf(e.h))
                            ) {
                              return t.apply(this, i)
                            }
                            i[1] && i[1].method && (s = i[1].method)
                            var a = { method: s, url: o, status_code: null }
                            return t
                              .apply(this, i)
                              .then(function (t) {
                                return (
                                  (a.status_code = t.status),
                                  e.captureBreadcrumb({ type: 'http', category: 'fetch', data: a }),
                                  t
                                )
                              })
                              ['catch'](function (t) {
                                throw (
                                  (e.captureBreadcrumb({
                                    type: 'http',
                                    category: 'fetch',
                                    data: a,
                                    level: 'error',
                                  }),
                                  t)
                                )
                              })
                          }
                        },
                        n,
                      ),
                      i.dom &&
                        this.b &&
                        (z.addEventListener
                          ? (z.addEventListener('click', e._('click'), !1),
                            z.addEventListener('keypress', e.ba(), !1))
                          : z.attachEvent &&
                            (z.attachEvent('onclick', e._('click')),
                            z.attachEvent('onkeypress', e.ba())))
                    var r = N.chrome,
                      s =
                        !(r && r.app && r.app.runtime) &&
                        N.history &&
                        N.history.pushState &&
                        N.history.replaceState
                    if (i.location && s) {
                      var a = N.onpopstate
                      N.onpopstate = function () {
                        var t = e.w.href
                        if ((e.ca(e.x, t), a)) return a.apply(this, arguments)
                      }
                      var c = function (t) {
                        return function () {
                          var i = arguments.length > 2 ? arguments[2] : void 0
                          return i && e.ca(e.x, i + ''), t.apply(this, arguments)
                        }
                      }
                      R(N.history, 'pushState', c, n), R(N.history, 'replaceState', c, n)
                    }
                    if (i.console && 'console' in N && console.log) {
                      var l = function (t, i) {
                        e.captureBreadcrumb({ message: t, level: i.level, category: 'console' })
                      }
                      k(['debug', 'info', 'warn', 'error', 'log'], function (t, e) {
                        $(console, e, l)
                      })
                    }
                  },
                  R: function () {
                    for (var t; this.t.length; ) {
                      var e = (t = this.t.shift())[0],
                        i = t[1],
                        n = t[2]
                      e[i] = n
                    }
                  },
                  S: function () {
                    for (var t in this.q) this.p[t] = this.q[t]
                  },
                  F: function () {
                    var t = this
                    k(this.r, function (e, i) {
                      var n = i[0],
                        o = i[1]
                      n.apply(t, [t].concat(o))
                    })
                  },
                  G: function (t) {
                    var e = j.exec(t),
                      i = {},
                      n = 7
                    try {
                      for (; n--; ) i[U[n]] = e[n] || ''
                    } catch (o) {
                      throw new l('Invalid DSN: ' + t)
                    }
                    if (i.pass && !this.k.allowSecretKey) {
                      throw new l(
                        'Do not specify your secret key in the DSN. See: http://bit.ly/raven-secret-key',
                      )
                    }
                    return i
                  },
                  J: function (t) {
                    var e = '//' + t.host + (t.port ? ':' + t.port : '')
                    return t.protocol && (e = t.protocol + ':' + e), e
                  },
                  A: function (t, e) {
                    ;((e = e || {}).mechanism = e.mechanism || { type: 'onerror', handled: !1 }),
                      this.m || this.V(t, e)
                  },
                  V: function (t, e) {
                    var i = this.X(t, e)
                    this.$('handle', { stackInfo: t, options: e }),
                      this.fa(t.name, t.message, t.url, t.lineno, i, e)
                  },
                  X: function (t, e) {
                    var i = this,
                      n = []
                    if (
                      t.stack &&
                      t.stack.length &&
                      (k(t.stack, function (e, o) {
                        var r = i.ga(o, t.url)
                        r && n.push(r)
                      }),
                      e && e.trimHeadFrames)
                    ) {
                      for (var o = 0; o < e.trimHeadFrames && o < n.length; o++) n[o].in_app = !1
                    }
                    return (n = n.slice(0, this.k.stackTraceLimit))
                  },
                  ga: function (t, e) {
                    var i = {
                      filename: t.url,
                      lineno: t.line,
                      colno: t.column,
                      function: t.func || '?',
                    }
                    return (
                      t.url || (i.filename = e),
                      (i.in_app = !(
                        (this.k.includePaths.test && !this.k.includePaths.test(i.filename)) ||
                        /(Raven|TraceKit)\./.test(i['function']) ||
                        /raven\.(min\.)?js$/.test(i.filename)
                      )),
                      i
                    )
                  },
                  fa: function (t, e, i, n, o, r) {
                    var s,
                      a = (t ? t + ': ' : '') + (e || '')
                    if (
                      (!this.k.ignoreErrors.test ||
                        (!this.k.ignoreErrors.test(e) && !this.k.ignoreErrors.test(a))) &&
                      (o && o.length
                        ? ((i = o[0].filename || i), o.reverse(), (s = { frames: o }))
                        : i && (s = { frames: [{ filename: i, lineno: n, in_app: !0 }] }),
                      (!this.k.ignoreUrls.test || !this.k.ignoreUrls.test(i)) &&
                        (!this.k.whitelistUrls.test || this.k.whitelistUrls.test(i)))
                    ) {
                      var c = C(
                          {
                            exception: { values: [{ type: t, value: e, stacktrace: s }] },
                            transaction: i,
                          },
                          r,
                        ),
                        l = c.exception.values[0]
                      null == l.type && '' === l.value && (l.value = 'Unrecoverable error caught'),
                        !c.exception.mechanism &&
                          c.mechanism &&
                          ((c.exception.mechanism = c.mechanism), delete c.mechanism),
                        (c.exception.mechanism = C(
                          { type: 'generic', handled: !0 },
                          c.exception.mechanism || {},
                        )),
                        this.Y(c)
                    }
                  },
                  ha: function (t) {
                    var e = this.k.maxMessageLength
                    if ((t.message && (t.message = _(t.message, e)), t.exception)) {
                      var i = t.exception.values[0]
                      i.value = _(i.value, e)
                    }
                    var n = t.request
                    return (
                      n &&
                        (n.url && (n.url = _(n.url, this.k.maxUrlLength)),
                        n.Referer && (n.Referer = _(n.Referer, this.k.maxUrlLength))),
                      t.breadcrumbs && t.breadcrumbs.values && this.ia(t.breadcrumbs),
                      t
                    )
                  },
                  ia: function (t) {
                    for (var e, i, n, o = ['to', 'from', 'url'], r = 0; r < t.values.length; ++r) {
                      if ((i = t.values[r]).hasOwnProperty('data') && m(i.data) && !E(i.data)) {
                        n = C({}, i.data)
                        for (var s = 0; s < o.length; ++s) {
                          ;(e = o[s]),
                            n.hasOwnProperty(e) && n[e] && (n[e] = _(n[e], this.k.maxUrlLength))
                        }
                        t.values[r].data = n
                      }
                    }
                  },
                  ja: function () {
                    if (this.c || this.b) {
                      var t = {}
                      return (
                        this.c && Z.userAgent && (t.headers = { 'User-Agent': Z.userAgent }),
                        N.location && N.location.href && (t.url = N.location.href),
                        this.b &&
                          z.referrer &&
                          (t.headers || (t.headers = {}), (t.headers.Referer = z.referrer)),
                        t
                      )
                    }
                  },
                  y: function () {
                    ;(this.ka = 0), (this.la = null)
                  },
                  ma: function () {
                    return this.ka && n() - this.la < this.ka
                  },
                  na: function (t) {
                    var e = this.e
                    return (
                      !(!e || t.message !== e.message || t.transaction !== e.transaction) &&
                      (t.stacktrace || e.stacktrace
                        ? H(t.stacktrace, e.stacktrace)
                        : t.exception || e.exception
                        ? O(t.exception, e.exception)
                        : (!t.fingerprint && !e.fingerprint) ||
                          (Boolean(t.fingerprint && e.fingerprint) &&
                            JSON.stringify(t.fingerprint) === JSON.stringify(e.fingerprint)))
                    )
                  },
                  oa: function (t) {
                    if (!this.ma()) {
                      var e = t.status
                      if (400 === e || 401 === e || 429 === e) {
                        var i
                        try {
                          ;(i = P()
                            ? t.headers.get('Retry-After')
                            : t.getResponseHeader('Retry-After')),
                            (i = 1e3 * parseInt(i, 10))
                        } catch (o) {}
                        ;(this.ka = i || 2 * this.ka || 1e3), (this.la = n())
                      }
                    }
                  },
                  Y: function (t) {
                    var e = this.k,
                      i = { project: this.i, logger: e.logger, platform: 'javascript' },
                      o = this.ja()
                    if (
                      (o && (i.request = o),
                      t.trimHeadFrames && delete t.trimHeadFrames,
                      ((t = C(i, t)).tags = C(C({}, this.j.tags), t.tags)),
                      (t.extra = C(C({}, this.j.extra), t.extra)),
                      (t.extra['session:duration'] = n() - this.s),
                      this.u &&
                        this.u.length > 0 &&
                        (t.breadcrumbs = { values: [].slice.call(this.u, 0) }),
                      this.j.user && (t.user = this.j.user),
                      e.environment && (t.environment = e.environment),
                      e.release && (t.release = e.release),
                      e.serverName && (t.server_name = e.serverName),
                      (t = this.pa(t)),
                      Object.keys(t).forEach(function (e) {
                        ;(null == t[e] || '' === t[e] || x(t[e])) && delete t[e]
                      }),
                      v(e.dataCallback) && (t = e.dataCallback(t) || t),
                      t && !x(t) && (!v(e.shouldSendCallback) || e.shouldSendCallback(t)))
                    ) {
                      return this.ma()
                        ? void this.z('warn', 'Raven dropped error due to backoff: ', t)
                        : void ('number' == typeof e.sampleRate
                            ? Math.random() < e.sampleRate && this.qa(t)
                            : this.qa(t))
                    }
                  },
                  pa: function (t) {
                    return F(t, this.k.sanitizeKeys)
                  },
                  ra: function () {
                    return L()
                  },
                  qa: function (t, e) {
                    var i = this,
                      n = this.k
                    if (this.isSetup()) {
                      if (((t = this.ha(t)), !this.k.allowDuplicates && this.na(t))) {
                        return void this.z('warn', 'Raven dropped repeat event: ', t)
                      }
                      ;(this.f = t.event_id || (t.event_id = this.ra())),
                        (this.e = t),
                        this.z('debug', 'Raven about to send:', t)
                      var o = {
                        sentry_version: '7',
                        sentry_client: 'raven-js/' + this.VERSION,
                        sentry_key: this.h,
                      }
                      this.I && (o.sentry_secret = this.I)
                      var r = t.exception && t.exception.values[0]
                      this.k.autoBreadcrumbs &&
                        this.k.autoBreadcrumbs.sentry &&
                        this.captureBreadcrumb({
                          category: 'sentry',
                          message: r ? (r.type ? r.type + ': ' : '') + r.value : t.message,
                          event_id: t.event_id,
                          level: t.level || 'error',
                        })
                      var s = this.K
                      ;(n.transport || this._makeRequest).call(this, {
                        url: s,
                        auth: o,
                        data: t,
                        options: n,
                        onSuccess: function () {
                          i.y(), i.$('success', { data: t, src: s }), e && e()
                        },
                        onError: function (n) {
                          i.z('error', 'Raven transport failed to send: ', n),
                            n.request && i.oa(n.request),
                            i.$('failure', { data: t, src: s }),
                            (n =
                              n || new Error('Raven send failed (no additional details provided)')),
                            e && e(n)
                        },
                      })
                    }
                  },
                  _makeRequest: function (t) {
                    var e = t.url + '?' + B(t.auth),
                      i = null,
                      n = {}
                    if (
                      (t.options.headers && (i = this.sa(t.options.headers)),
                      t.options.fetchParameters && (n = this.sa(t.options.fetchParameters)),
                      P())
                    ) {
                      n.body = a(t.data)
                      var o = C({}, this.l),
                        r = C(o, n)
                      return (
                        i && (r.headers = i),
                        N.fetch(e, r)
                          .then(function (e) {
                            if (e.ok) t.onSuccess && t.onSuccess()
                            else {
                              var i = new Error('Sentry error code: ' + e.status)
                              ;(i.request = e), t.onError && t.onError(i)
                            }
                          })
                          ['catch'](function () {
                            t.onError &&
                              t.onError(new Error('Sentry error code: network unavailable'))
                          })
                      )
                    }
                    var s = N.XMLHttpRequest && new N.XMLHttpRequest()
                    s &&
                      ('withCredentials' in s || 'undefined' != typeof XDomainRequest) &&
                      ('withCredentials' in s
                        ? (s.onreadystatechange = function () {
                            if (4 === s.readyState) {
                              if (200 === s.status) t.onSuccess && t.onSuccess()
                              else if (t.onError) {
                                var e = new Error('Sentry error code: ' + s.status)
                                ;(e.request = s), t.onError(e)
                              }
                            }
                          })
                        : ((s = new XDomainRequest()),
                          (e = e.replace(/^https?:/, '')),
                          t.onSuccess && (s.onload = t.onSuccess),
                          t.onError &&
                            (s.onerror = function () {
                              var e = new Error('Sentry error code: XDomainRequest')
                              ;(e.request = s), t.onError(e)
                            })),
                      s.open('POST', e),
                      i &&
                        k(i, function (t, e) {
                          s.setRequestHeader(t, e)
                        }),
                      s.send(a(t.data)))
                  },
                  sa: function (t) {
                    var e = {}
                    for (var i in t) {
                      if (t.hasOwnProperty(i)) {
                        var n = t[i]
                        e[i] = 'function' == typeof n ? n() : n
                      }
                    }
                    return e
                  },
                  z: function (t) {
                    this.q[t] &&
                      (this.debug || this.k.debug) &&
                      Function.prototype.apply.call(this.q[t], this.p, [].slice.call(arguments, 1))
                  },
                  Z: function (t, e) {
                    g(e) ? delete this.j[t] : (this.j[t] = C(this.j[t] || {}, e))
                  },
                }),
                  (r.prototype.setUser = r.prototype.setUserContext),
                  (r.prototype.setReleaseContext = r.prototype.setRelease),
                  (e.exports = r)
              }.call(
                this,
                'undefined' != typeof global
                  ? global
                  : 'undefined' != typeof self
                  ? self
                  : 'undefined' != typeof window
                  ? window
                  : {},
              ))
            },
            { 1: 1, 2: 2, 5: 5, 6: 6, 7: 7, 8: 8 },
          ],
          4: [
            function (t, e, i) {
              ;(function (i) {
                var n = t(3),
                  o =
                    'undefined' != typeof window
                      ? window
                      : void 0 !== i
                      ? i
                      : 'undefined' != typeof self
                      ? self
                      : {},
                  r = o.Raven,
                  s = new n()
                ;(s.noConflict = function () {
                  return (o.Raven = r), s
                }),
                  s.afterLoad(),
                  (e.exports = s),
                  (e.exports.Client = n)
              }.call(
                this,
                'undefined' != typeof global
                  ? global
                  : 'undefined' != typeof self
                  ? self
                  : 'undefined' != typeof window
                  ? window
                  : {},
              ))
            },
            { 3: 3 },
          ],
          5: [
            function (t, e, i) {
              ;(function (i) {
                function n(t) {
                  switch (Object.prototype.toString.call(t)) {
                    case '[object Error]':
                    case '[object Exception]':
                    case '[object DOMException]':
                      return !0
                    default:
                      return t instanceof Error
                  }
                }
                function o(t) {
                  return '[object DOMError]' === Object.prototype.toString.call(t)
                }
                function r(t) {
                  return void 0 === t
                }
                function s(t) {
                  return '[object Object]' === Object.prototype.toString.call(t)
                }
                function a(t) {
                  return '[object String]' === Object.prototype.toString.call(t)
                }
                function c(t) {
                  return '[object Array]' === Object.prototype.toString.call(t)
                }
                function l() {
                  if (!('fetch' in x)) return !1
                  try {
                    return new Headers(), new Request(''), new Response(), !0
                  } catch (t) {
                    return !1
                  }
                }
                function h(t, e) {
                  var i, n
                  if (r(t.length)) for (i in t) f(t, i) && e.call(null, i, t[i])
                  else if ((n = t.length)) for (i = 0; i < n; i++) e.call(null, i, t[i])
                }
                function u(t, e) {
                  if ('number' != typeof e) {
                    throw new Error('2nd argument to `truncate` function should be a number')
                  }
                  return 'string' != typeof t || 0 === e || t.length <= e
                    ? t
                    : t.substr(0, e) + 'â€¦'
                }
                function f(t, e) {
                  return Object.prototype.hasOwnProperty.call(t, e)
                }
                function d(t) {
                  for (var e, i = [], n = 0, o = t.length; n < o; n++) {
                    a((e = t[n]))
                      ? i.push(e.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1'))
                      : e && e.source && i.push(e.source)
                  }
                  return new RegExp(i.join('|'), 'i')
                }
                function p(t) {
                  var e,
                    i,
                    n,
                    o,
                    r,
                    s = []
                  if (!t || !t.tagName) return ''
                  if (
                    (s.push(t.tagName.toLowerCase()),
                    t.id && s.push('#' + t.id),
                    (e = t.className) && a(e))
                  ) {
                    for (i = e.split(/\s+/), r = 0; r < i.length; r++) s.push('.' + i[r])
                  }
                  var c = ['type', 'name', 'title', 'alt']
                  for (r = 0; r < c.length; r++) {
                    ;(n = c[r]), (o = t.getAttribute(n)) && s.push('[' + n + '="' + o + '"]')
                  }
                  return s.join('')
                }
                function m(t, e) {
                  return !!(!!t ^ !!e)
                }
                function y(t, e) {
                  if (m(t, e)) return !1
                  var i = t.frames,
                    n = e.frames
                  if (void 0 === i || void 0 === n) return !1
                  if (i.length !== n.length) return !1
                  for (var o, r, s = 0; s < i.length; s++) {
                    if (
                      ((o = i[s]),
                      (r = n[s]),
                      o.filename !== r.filename ||
                        o.lineno !== r.lineno ||
                        o.colno !== r.colno ||
                        o['function'] !== r['function'])
                    ) {
                      return !1
                    }
                  }
                  return !0
                }
                function g(t) {
                  return (function (t) {
                    return ~-encodeURI(t).split(/%..|./).length
                  })(JSON.stringify(t))
                }
                function v(t) {
                  if ('string' == typeof t) {
                    return u(t, 40)
                  }
                  if ('number' == typeof t || 'boolean' == typeof t || void 0 === t) return t
                  var e = Object.prototype.toString.call(t)
                  return '[object Object]' === e
                    ? '[Object]'
                    : '[object Array]' === e
                    ? '[Array]'
                    : '[object Function]' === e
                    ? t.name
                      ? '[Function: ' + t.name + ']'
                      : '[Function]'
                    : t
                }
                function b(t, e) {
                  return 0 === e
                    ? v(t)
                    : s(t)
                    ? Object.keys(t).reduce(function (i, n) {
                        return (i[n] = b(t[n], e - 1)), i
                      }, {})
                    : Array.isArray(t)
                    ? t.map(function (t) {
                        return b(t, e - 1)
                      })
                    : v(t)
                }
                var w = t(7),
                  x =
                    'undefined' != typeof window
                      ? window
                      : void 0 !== i
                      ? i
                      : 'undefined' != typeof self
                      ? self
                      : {},
                  k = 3,
                  C = 51200,
                  _ = 40
                e.exports = {
                  isObject: function (t) {
                    return 'object' == typeof t && null !== t
                  },
                  isError: n,
                  isErrorEvent: function (t) {
                    return '[object ErrorEvent]' === Object.prototype.toString.call(t)
                  },
                  isDOMError: o,
                  isDOMException: function (t) {
                    return '[object DOMException]' === Object.prototype.toString.call(t)
                  },
                  isUndefined: r,
                  isFunction: function (t) {
                    return 'function' == typeof t
                  },
                  isPlainObject: s,
                  isString: a,
                  isArray: c,
                  isEmptyObject: function (t) {
                    if (!s(t)) return !1
                    for (var e in t) if (t.hasOwnProperty(e)) return !1
                    return !0
                  },
                  supportsErrorEvent: function () {
                    try {
                      return new ErrorEvent(''), !0
                    } catch (t) {
                      return !1
                    }
                  },
                  supportsDOMError: function () {
                    try {
                      return new DOMError(''), !0
                    } catch (t) {
                      return !1
                    }
                  },
                  supportsDOMException: function () {
                    try {
                      return new DOMException(''), !0
                    } catch (t) {
                      return !1
                    }
                  },
                  supportsFetch: l,
                  supportsReferrerPolicy: function () {
                    if (!l()) return !1
                    try {
                      return new Request('pickleRick', { referrerPolicy: 'origin' }), !0
                    } catch (t) {
                      return !1
                    }
                  },
                  supportsPromiseRejectionEvent: function () {
                    return 'function' == typeof PromiseRejectionEvent
                  },
                  wrappedCallback: function (t) {
                    return function (e, i) {
                      var n = t(e) || e
                      return (i && i(n)) || n
                    }
                  },
                  each: h,
                  objectMerge: function (t, e) {
                    return e
                      ? (h(e, function (e, i) {
                          t[e] = i
                        }),
                        t)
                      : t
                  },
                  truncate: u,
                  objectFrozen: function (t) {
                    return !!Object.isFrozen && Object.isFrozen(t)
                  },
                  hasKey: f,
                  joinRegExp: d,
                  urlencode: function (t) {
                    var e = []
                    return (
                      h(t, function (t, i) {
                        e.push(encodeURIComponent(t) + '=' + encodeURIComponent(i))
                      }),
                      e.join('&')
                    )
                  },
                  uuid4: function () {
                    var t = x.crypto || x.msCrypto
                    if (!r(t) && t.getRandomValues) {
                      var e = new Uint16Array(8)
                      t.getRandomValues(e),
                        (e[3] = (4095 & e[3]) | 16384),
                        (e[4] = (16383 & e[4]) | 32768)
                      var i = function (t) {
                        for (var e = t.toString(16); e.length < 4; ) e = '0' + e
                        return e
                      }
                      return (
                        i(e[0]) +
                        i(e[1]) +
                        i(e[2]) +
                        i(e[3]) +
                        i(e[4]) +
                        i(e[5]) +
                        i(e[6]) +
                        i(e[7])
                      )
                    }
                    return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (t) {
                      var e = (16 * Math.random()) | 0
                      return ('x' === t ? e : (3 & e) | 8).toString(16)
                    })
                  },
                  htmlTreeAsString: function (t) {
                    for (
                      var e, i = [], n = 0, o = 0, r = ' > '.length;
                      t &&
                      n++ < 5 &&
                      !('html' === (e = p(t)) || (n > 1 && o + i.length * r + e.length >= 80));

                    ) {
                      i.push(e), (o += e.length), (t = t.parentNode)
                    }
                    return i.reverse().join(' > ')
                  },
                  htmlElementAsString: p,
                  isSameException: function (t, e) {
                    return (
                      !m(t, e) &&
                      ((t = t.values[0]),
                      (e = e.values[0]),
                      t.type === e.type &&
                        t.value === e.value &&
                        !(function (t, e) {
                          return r(t) && r(e)
                        })(t.stacktrace, e.stacktrace) &&
                        y(t.stacktrace, e.stacktrace))
                    )
                  },
                  isSameStacktrace: y,
                  parseUrl: function (t) {
                    if ('string' != typeof t) return {}
                    var e = t.match(
                        /^(([^:\/?#]+):)?(\/\/([^\/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?$/,
                      ),
                      i = e[6] || '',
                      n = e[8] || ''
                    return { protocol: e[2], host: e[4], path: e[5], relative: e[5] + i + n }
                  },
                  fill: function (t, e, i, n) {
                    if (null != t) {
                      var o = t[e]
                      ;(t[e] = i(o)), (t[e].M = !0), (t[e].O = o), n && n.push([t, e, o])
                    }
                  },
                  safeJoin: function (t, e) {
                    if (!c(t)) return ''
                    for (var i = [], o = 0; o < t.length; o++) {
                      try {
                        i.push(String(t[o]))
                      } catch (n) {
                        i.push('[value cannot be serialized]')
                      }
                    }
                    return i.join(e)
                  },
                  serializeException: function E(t, e, i) {
                    if (!s(t)) return t
                    i = 'number' != typeof (e = 'number' != typeof e ? k : e) ? C : i
                    var n = b(t, e)
                    return g(w(n)) > i ? E(t, e - 1) : n
                  },
                  serializeKeysForMessage: function (t, e) {
                    if ('number' == typeof t || 'string' == typeof t) return t.toString()
                    if (!Array.isArray(t)) return ''
                    if (
                      0 ===
                      (t = t.filter(function (t) {
                        return 'string' == typeof t
                      })).length
                    ) {
                      return '[object has no keys]'
                    }
                    if (((e = 'number' != typeof e ? _ : e), t[0].length >= e)) return t[0]
                    for (var i = t.length; i > 0; i--) {
                      var n = t.slice(0, i).join(', ')
                      if (!(n.length > e)) return i === t.length ? n : n + 'â€¦'
                    }
                    return ''
                  },
                  sanitize: function (t, e) {
                    if (!c(e) || (c(e) && 0 === e.length)) return t
                    var i,
                      n = d(e),
                      r = '********'
                    try {
                      i = JSON.parse(w(t))
                    } catch (o) {
                      return t
                    }
                    return (function a(t) {
                      return c(t)
                        ? t.map(function (t) {
                            return a(t)
                          })
                        : s(t)
                        ? Object.keys(t).reduce(function (e, i) {
                            return (e[i] = n.test(i) ? r : a(t[i])), e
                          }, {})
                        : t
                    })(i)
                  },
                }
              }.call(
                this,
                'undefined' != typeof global
                  ? global
                  : 'undefined' != typeof self
                  ? self
                  : 'undefined' != typeof window
                  ? window
                  : {},
              ))
            },
            { 7: 7 },
          ],
          6: [
            function (t, e, i) {
              ;(function (i) {
                function n() {
                  return 'undefined' == typeof document || null == document.location
                    ? ''
                    : document.location.href
                }
                var o = t(5),
                  r = { collectWindowErrors: !0, debug: !1 },
                  s =
                    'undefined' != typeof window
                      ? window
                      : void 0 !== i
                      ? i
                      : 'undefined' != typeof self
                      ? self
                      : {},
                  a = [].slice,
                  c = '?',
                  l =
                    /^(?:[Uu]ncaught (?:exception: )?)?(?:((?:Eval|Internal|Range|Reference|Syntax|Type|URI|)Error): )?(.*)$/
                ;(r.report = (function () {
                  function t(e, i) {
                    var n = null
                    if (!i || r.collectWindowErrors) {
                      for (var o in d) {
                        if (d.hasOwnProperty(o)) {
                          try {
                            d[o].apply(null, [e].concat(a.call(arguments, 2)))
                          } catch (t) {
                            n = t
                          }
                        }
                      }
                      if (n) throw n
                    }
                  }
                  function e(e, s, a, h, f) {
                    var d = o.isErrorEvent(f) ? f.error : f,
                      p = o.isErrorEvent(e) ? e.message : e
                    if (y) r.computeStackTrace.augmentStackTraceWithInitialElement(y, s, a, p), i()
                    else if (d && o.isError(d)) t(r.computeStackTrace(d), !0)
                    else {
                      var m,
                        g = { url: s, line: a, column: h },
                        v = void 0
                      if ('[object String]' === {}.toString.call(p)) {
                        ;(m = p.match(l)) && ((v = m[1]), (p = m[2]))
                      }
                      ;(g.func = c), t({ name: v, message: p, url: n(), stack: [g] }, !0)
                    }
                    return !!u && u.apply(this, arguments)
                  }
                  function i() {
                    var e = y,
                      i = p
                    ;(p = null), (y = null), (m = null), t.apply(null, [e, !1].concat(i))
                  }
                  function h(t, e) {
                    var n = a.call(arguments, 1)
                    if (y) {
                      if (m === t) return
                      i()
                    }
                    var o = r.computeStackTrace(t)
                    if (
                      ((y = o),
                      (m = t),
                      (p = n),
                      setTimeout(
                        function () {
                          m === t && i()
                        },
                        o.incomplete ? 2e3 : 0,
                      ),
                      !1 !== e)
                    ) {
                      throw t
                    }
                  }
                  var u,
                    f,
                    d = [],
                    p = null,
                    m = null,
                    y = null
                  return (
                    (h.subscribe = function (t) {
                      f || ((u = s.onerror), (s.onerror = e), (f = !0)), d.push(t)
                    }),
                    (h.unsubscribe = function (t) {
                      for (var e = d.length - 1; e >= 0; --e) d[e] === t && d.splice(e, 1)
                    }),
                    (h.uninstall = function () {
                      f && ((s.onerror = u), (f = !1), (u = void 0)), (d = [])
                    }),
                    h
                  )
                })()),
                  (r.computeStackTrace = (function () {
                    function t(t) {
                      if ('undefined' != typeof t.stack && t.stack) {
                        for (
                          var e,
                            i,
                            o,
                            r =
                              /^\s*at (?:(.*?) ?\()?((?:file|https?|blob|chrome-extension|native|eval|webpack|<anonymous>|[a-z]:|\/).*?)(?::(\d+))?(?::(\d+))?\)?\s*$/i,
                            s =
                              /^\s*at (?:((?:\[object object\])?.+) )?\(?((?:file|ms-appx(?:-web)|https?|webpack|blob):.*?):(\d+)(?::(\d+))?\)?\s*$/i,
                            a =
                              /^\s*(.*?)(?:\((.*?)\))?(?:^|@)((?:file|https?|blob|chrome|webpack|resource|moz-extension).*?:\/.*?|\[native code\]|[^@]*(?:bundle|\d+\.js))(?::(\d+))?(?::(\d+))?\s*$/i,
                            l = /(\S+) line (\d+)(?: > eval line \d+)* > eval/i,
                            h = /\((\S*)(?::(\d+))(?::(\d+))\)/,
                            u = t.stack.split('\n'),
                            f = [],
                            d = (/^(.*) is undefined$/.exec(t.message), 0),
                            p = u.length;
                          d < p;
                          ++d
                        ) {
                          if ((i = r.exec(u[d]))) {
                            var m = i[2] && 0 === i[2].indexOf('native')
                            i[2] &&
                              0 === i[2].indexOf('eval') &&
                              (e = h.exec(i[2])) &&
                              ((i[2] = e[1]), (i[3] = e[2]), (i[4] = e[3])),
                              (o = {
                                url: m ? null : i[2],
                                func: i[1] || c,
                                args: m ? [i[2]] : [],
                                line: i[3] ? +i[3] : null,
                                column: i[4] ? +i[4] : null,
                              })
                          } else if ((i = s.exec(u[d]))) {
                            o = {
                              url: i[2],
                              func: i[1] || c,
                              args: [],
                              line: +i[3],
                              column: i[4] ? +i[4] : null,
                            }
                          } else {
                            if (!(i = a.exec(u[d]))) continue
                            i[3] && i[3].indexOf(' > eval') > -1 && (e = l.exec(i[3]))
                              ? ((i[3] = e[1]), (i[4] = e[2]), (i[5] = null))
                              : 0 !== d ||
                                i[5] ||
                                'undefined' == typeof t.columnNumber ||
                                (f[0].column = t.columnNumber + 1),
                              (o = {
                                url: i[3],
                                func: i[1] || c,
                                args: i[2] ? i[2].split(',') : [],
                                line: i[4] ? +i[4] : null,
                                column: i[5] ? +i[5] : null,
                              })
                          }
                          if (
                            (!o.func && o.line && (o.func = c),
                            o.url && 'blob:' === o.url.substr(0, 5))
                          ) {
                            var y = new XMLHttpRequest()
                            if ((y.open('GET', o.url, !1), y.send(null), 200 === y.status)) {
                              var g = y.responseText || '',
                                v = (g = g.slice(-300)).match(/\/\/# sourceMappingURL=(.*)$/)
                              if (v) {
                                var b = v[1]
                                '~' === b.charAt(0) &&
                                  (b =
                                    ('undefined' == typeof document || null == document.location
                                      ? ''
                                      : document.location.origin
                                      ? document.location.origin
                                      : document.location.protocol +
                                        '//' +
                                        document.location.hostname +
                                        (document.location.port
                                          ? ':' + document.location.port
                                          : '')) + b.slice(1)),
                                  (o.url = b.slice(0, -4))
                              }
                            }
                          }
                          f.push(o)
                        }
                        return f.length
                          ? { name: t.name, message: t.message, url: n(), stack: f }
                          : null
                      }
                    }
                    function e(t, e, i, n) {
                      var o = { url: e, line: i }
                      if (o.url && o.line) {
                        if (
                          ((t.incomplete = !1),
                          o.func || (o.func = c),
                          t.stack.length > 0 && t.stack[0].url === o.url)
                        ) {
                          if (t.stack[0].line === o.line) return !1
                          if (!t.stack[0].line && t.stack[0].func === o.func) {
                            return (t.stack[0].line = o.line), !1
                          }
                        }
                        return t.stack.unshift(o), (t.partial = !0), !0
                      }
                      return (t.incomplete = !0), !1
                    }
                    function i(t, s) {
                      for (
                        var a,
                          l,
                          h = /function\s+([_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*)?\s*\(/i,
                          u = [],
                          f = {},
                          d = !1,
                          p = i.caller;
                        p && !d;
                        p = p.caller
                      ) {
                        if (p !== o && p !== r.report) {
                          if (
                            ((l = { url: null, func: c, line: null, column: null }),
                            p.name
                              ? (l.func = p.name)
                              : (a = h.exec(p.toString())) && (l.func = a[1]),
                            'undefined' == typeof l.func)
                          ) {
                            try {
                              l.func = a.input.substring(0, a.input.indexOf('{'))
                            } catch (y) {}
                          }
                          f['' + p] ? (d = !0) : (f['' + p] = !0), u.push(l)
                        }
                      }
                      s && u.splice(0, s)
                      var m = { name: t.name, message: t.message, url: n(), stack: u }
                      return (
                        e(
                          m,
                          t.sourceURL || t.fileName,
                          t.line || t.lineNumber,
                          t.message || t.description,
                        ),
                        m
                      )
                    }
                    function o(e, o) {
                      var a = null
                      o = null == o ? 0 : +o
                      try {
                        if ((a = t(e))) return a
                      } catch (s) {
                        if (r.debug) throw s
                      }
                      try {
                        if ((a = i(e, o + 1))) return a
                      } catch (s) {
                        if (r.debug) throw s
                      }
                      return { name: e.name, message: e.message, url: n() }
                    }
                    return (
                      (o.augmentStackTraceWithInitialElement = e),
                      (o.computeStackTraceFromStackProp = t),
                      o
                    )
                  })()),
                  (e.exports = r)
              }.call(
                this,
                'undefined' != typeof global
                  ? global
                  : 'undefined' != typeof self
                  ? self
                  : 'undefined' != typeof window
                  ? window
                  : {},
              ))
            },
            { 5: 5 },
          ],
          7: [
            function (t, e, i) {
              function n(t, e) {
                for (var i = 0; i < t.length; ++i) if (t[i] === e) return i
                return -1
              }
              function o(t, e) {
                var i = [],
                  o = []
                return (
                  null == e &&
                    (e = function (t, e) {
                      return i[0] === e
                        ? '[Circular ~]'
                        : '[Circular ~.' + o.slice(0, n(i, e)).join('.') + ']'
                    }),
                  function (r, s) {
                    if (i.length > 0) {
                      var a = n(i, this)
                      ~a ? i.splice(a + 1) : i.push(this),
                        ~a ? o.splice(a, 1 / 0, r) : o.push(r),
                        ~n(i, s) && (s = e.call(this, r, s))
                    } else i.push(s)
                    return null == t
                      ? s instanceof Error
                        ? (function (t) {
                            var e = { stack: t.stack, message: t.message, name: t.name }
                            for (var i in t) {
                              Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i])
                            }
                            return e
                          })(s)
                        : s
                      : t.call(this, r, s)
                  }
                )
              }
              ;(i = e.exports =
                function (t, e, i, n) {
                  return JSON.stringify(t, o(e, n), i)
                }),
                (i.getSerialize = o)
            },
            {},
          ],
          8: [
            function (t, e, i) {
              function n(t, e) {
                var i = (65535 & t) + (65535 & e)
                return (((t >> 16) + (e >> 16) + (i >> 16)) << 16) | (65535 & i)
              }
              function o(t, e, i, o, r, s) {
                return n(
                  (function (t, e) {
                    return (t << e) | (t >>> (32 - e))
                  })(n(n(e, t), n(o, s)), r),
                  i,
                )
              }
              function r(t, e, i, n, r, s, a) {
                return o((e & i) | (~e & n), t, e, r, s, a)
              }
              function s(t, e, i, n, r, s, a) {
                return o((e & n) | (i & ~n), t, e, r, s, a)
              }
              function a(t, e, i, n, r, s, a) {
                return o(e ^ i ^ n, t, e, r, s, a)
              }
              function c(t, e, i, n, r, s, a) {
                return o(i ^ (e | ~n), t, e, r, s, a)
              }
              function l(t, e) {
                ;(t[e >> 5] |= 128 << e % 32), (t[14 + (((e + 64) >>> 9) << 4)] = e)
                var i,
                  o,
                  l,
                  h,
                  u,
                  f = 1732584193,
                  d = -271733879,
                  p = -1732584194,
                  m = 271733878
                for (i = 0; i < t.length; i += 16) {
                  ;(o = f),
                    (l = d),
                    (h = p),
                    (u = m),
                    (f = r(f, d, p, m, t[i], 7, -680876936)),
                    (m = r(m, f, d, p, t[i + 1], 12, -389564586)),
                    (p = r(p, m, f, d, t[i + 2], 17, 606105819)),
                    (d = r(d, p, m, f, t[i + 3], 22, -1044525330)),
                    (f = r(f, d, p, m, t[i + 4], 7, -176418897)),
                    (m = r(m, f, d, p, t[i + 5], 12, 1200080426)),
                    (p = r(p, m, f, d, t[i + 6], 17, -1473231341)),
                    (d = r(d, p, m, f, t[i + 7], 22, -45705983)),
                    (f = r(f, d, p, m, t[i + 8], 7, 1770035416)),
                    (m = r(m, f, d, p, t[i + 9], 12, -1958414417)),
                    (p = r(p, m, f, d, t[i + 10], 17, -42063)),
                    (d = r(d, p, m, f, t[i + 11], 22, -1990404162)),
                    (f = r(f, d, p, m, t[i + 12], 7, 1804603682)),
                    (m = r(m, f, d, p, t[i + 13], 12, -40341101)),
                    (p = r(p, m, f, d, t[i + 14], 17, -1502002290)),
                    (f = s(
                      f,
                      (d = r(d, p, m, f, t[i + 15], 22, 1236535329)),
                      p,
                      m,
                      t[i + 1],
                      5,
                      -165796510,
                    )),
                    (m = s(m, f, d, p, t[i + 6], 9, -1069501632)),
                    (p = s(p, m, f, d, t[i + 11], 14, 643717713)),
                    (d = s(d, p, m, f, t[i], 20, -373897302)),
                    (f = s(f, d, p, m, t[i + 5], 5, -701558691)),
                    (m = s(m, f, d, p, t[i + 10], 9, 38016083)),
                    (p = s(p, m, f, d, t[i + 15], 14, -660478335)),
                    (d = s(d, p, m, f, t[i + 4], 20, -405537848)),
                    (f = s(f, d, p, m, t[i + 9], 5, 568446438)),
                    (m = s(m, f, d, p, t[i + 14], 9, -1019803690)),
                    (p = s(p, m, f, d, t[i + 3], 14, -187363961)),
                    (d = s(d, p, m, f, t[i + 8], 20, 1163531501)),
                    (f = s(f, d, p, m, t[i + 13], 5, -1444681467)),
                    (m = s(m, f, d, p, t[i + 2], 9, -51403784)),
                    (p = s(p, m, f, d, t[i + 7], 14, 1735328473)),
                    (f = a(
                      f,
                      (d = s(d, p, m, f, t[i + 12], 20, -1926607734)),
                      p,
                      m,
                      t[i + 5],
                      4,
                      -378558,
                    )),
                    (m = a(m, f, d, p, t[i + 8], 11, -2022574463)),
                    (p = a(p, m, f, d, t[i + 11], 16, 1839030562)),
                    (d = a(d, p, m, f, t[i + 14], 23, -35309556)),
                    (f = a(f, d, p, m, t[i + 1], 4, -1530992060)),
                    (m = a(m, f, d, p, t[i + 4], 11, 1272893353)),
                    (p = a(p, m, f, d, t[i + 7], 16, -155497632)),
                    (d = a(d, p, m, f, t[i + 10], 23, -1094730640)),
                    (f = a(f, d, p, m, t[i + 13], 4, 681279174)),
                    (m = a(m, f, d, p, t[i], 11, -358537222)),
                    (p = a(p, m, f, d, t[i + 3], 16, -722521979)),
                    (d = a(d, p, m, f, t[i + 6], 23, 76029189)),
                    (f = a(f, d, p, m, t[i + 9], 4, -640364487)),
                    (m = a(m, f, d, p, t[i + 12], 11, -421815835)),
                    (p = a(p, m, f, d, t[i + 15], 16, 530742520)),
                    (f = c(
                      f,
                      (d = a(d, p, m, f, t[i + 2], 23, -995338651)),
                      p,
                      m,
                      t[i],
                      6,
                      -198630844,
                    )),
                    (m = c(m, f, d, p, t[i + 7], 10, 1126891415)),
                    (p = c(p, m, f, d, t[i + 14], 15, -1416354905)),
                    (d = c(d, p, m, f, t[i + 5], 21, -57434055)),
                    (f = c(f, d, p, m, t[i + 12], 6, 1700485571)),
                    (m = c(m, f, d, p, t[i + 3], 10, -1894986606)),
                    (p = c(p, m, f, d, t[i + 10], 15, -1051523)),
                    (d = c(d, p, m, f, t[i + 1], 21, -2054922799)),
                    (f = c(f, d, p, m, t[i + 8], 6, 1873313359)),
                    (m = c(m, f, d, p, t[i + 15], 10, -30611744)),
                    (p = c(p, m, f, d, t[i + 6], 15, -1560198380)),
                    (d = c(d, p, m, f, t[i + 13], 21, 1309151649)),
                    (f = c(f, d, p, m, t[i + 4], 6, -145523070)),
                    (m = c(m, f, d, p, t[i + 11], 10, -1120210379)),
                    (p = c(p, m, f, d, t[i + 2], 15, 718787259)),
                    (d = c(d, p, m, f, t[i + 9], 21, -343485551)),
                    (f = n(f, o)),
                    (d = n(d, l)),
                    (p = n(p, h)),
                    (m = n(m, u))
                }
                return [f, d, p, m]
              }
              function h(t) {
                var e,
                  i = '',
                  n = 32 * t.length
                for (e = 0; e < n; e += 8) i += String.fromCharCode((t[e >> 5] >>> e % 32) & 255)
                return i
              }
              function u(t) {
                var e,
                  i = []
                for (i[(t.length >> 2) - 1] = void 0, e = 0; e < i.length; e += 1) i[e] = 0
                var n = 8 * t.length
                for (e = 0; e < n; e += 8) i[e >> 5] |= (255 & t.charCodeAt(e / 8)) << e % 32
                return i
              }
              function f(t) {
                var e,
                  i,
                  n = '0123456789abcdef',
                  o = ''
                for (i = 0; i < t.length; i += 1) {
                  ;(e = t.charCodeAt(i)), (o += n.charAt((e >>> 4) & 15) + n.charAt(15 & e))
                }
                return o
              }
              function d(t) {
                return unescape(encodeURIComponent(t))
              }
              function p(t) {
                return (function (t) {
                  return h(l(u(t), 8 * t.length))
                })(d(t))
              }
              function m(t, e) {
                return (function (t, e) {
                  var i,
                    n,
                    o = u(t),
                    r = [],
                    s = []
                  for (
                    r[15] = s[15] = void 0, o.length > 16 && (o = l(o, 8 * t.length)), i = 0;
                    i < 16;
                    i += 1
                  ) {
                    ;(r[i] = 909522486 ^ o[i]), (s[i] = 1549556828 ^ o[i])
                  }
                  return (n = l(r.concat(u(e)), 512 + 8 * e.length)), h(l(s.concat(n), 640))
                })(d(t), d(e))
              }
              e.exports = function (t, e, i) {
                return e
                  ? i
                    ? m(e, t)
                    : (function (t, e) {
                        return f(m(t, e))
                      })(e, t)
                  : i
                  ? p(t)
                  : (function (t) {
                      return f(p(t))
                    })(t)
              }
            },
            {},
          ],
        },
        {},
        [4],
      )(4)
    })
  var N = [
      { family: 'UC Browser', patterns: ['(UC? ?Browser|UCWEB|U3)[ /]?(\\d+)\\.(\\d+)\\.(\\d+)'] },
      {
        family: 'Opera',
        name_replace: 'Opera Mobile',
        patterns: [
          '(Opera)/.+Opera Mobi.+Version/(\\d+)\\.(\\d+)',
          '(Opera)/(\\d+)\\.(\\d+).+Opera Mobi',
          'Opera Mobi.+(Opera)(?:/|\\s+)(\\d+)\\.(\\d+)',
          'Opera Mobi',
          '(?:Mobile Safari).*(OPR)/(\\d+)\\.(\\d+)\\.(\\d+)',
        ],
      },
      {
        family: 'Opera',
        name_replace: 'Opera Mini',
        patterns: [
          '(Opera Mini)(?:/att|)/?(\\d+|)(?:\\.(\\d+)|)(?:\\.(\\d+)|)',
          '(OPiOS)/(\\d+).(\\d+).(\\d+)',
        ],
      },
      {
        family: 'Opera',
        name_replace: 'Opera Neon',
        patterns: ['Chrome/.+( MMS)/(\\d+).(\\d+).(\\d+)'],
      },
      {
        name_replace: 'Opera',
        patterns: [
          '(Opera)/9.80.*Version/(\\d+)\\.(\\d+)(?:\\.(\\d+)|)',
          '(?:Chrome).*(OPR)/(\\d+)\\.(\\d+)\\.(\\d+)',
        ],
      },
      {
        family: 'Firefox',
        name_replace: 'Firefox Mobile',
        patterns: [
          '(Fennec)/(\\d+)\\.(\\d+)\\.?([ab]?\\d+[a-z]*)',
          '(Fennec)/(\\d+)\\.(\\d+)(pre)',
          '(Fennec)/(\\d+)\\.(\\d+)',
          '(?:Mobile|Tablet);.*(Firefox)/(\\d+)\\.(\\d+)',
          '(FxiOS)/(\\d+)\\.(\\d+)(\\.(\\d+)|)(\\.(\\d+)|)',
        ],
      },
      { name_replace: 'Coc Coc', patterns: ['(coc_coc_browser)/(\\d+)\\.(\\d+)(?:\\.(\\d+)|)'] },
      {
        family: 'QQ',
        name_replace: 'QQ Mini',
        patterns: ['(MQQBrowser/Mini)(?:(\\d+)(?:\\.(\\d+)|)(?:\\.(\\d+)|)|)'],
      },
      {
        family: 'QQ',
        name_replace: 'QQ Mobile',
        patterns: ['(MQQBrowser)(?:/(\\d+)(?:\\.(\\d+)|)(?:\\.(\\d+)|)|)'],
      },
      {
        name_replace: 'QQ',
        patterns: ['(QQBrowser)(?:/(\\d+)(?:\\.(\\d+)\\.(\\d+)(?:\\.(\\d+)|)|)|)'],
      },
      {
        family: 'Edge',
        name: 'Edge Mobile',
        patterns: [
          'Windows Phone .*(Edge)/(\\d+)\\.(\\d+)',
          '(EdgiOS|EdgA)/(\\d+)\\.(\\d+).(\\d+).(\\d+)',
        ],
      },
      { name_replace: 'Edge', patterns: ['(Edge|Edg)/(\\d+)(?:\\.(\\d+)|)'] },
      { patterns: ['(Puffin)/(\\d+)\\.(\\d+)(?:\\.(\\d+)|)'] },
      {
        family: 'Chrome',
        name_replace: 'Chrome Mobile',
        patterns: [
          'Version/.+(Chrome)/(\\d+)\\.(\\d+)\\.(\\d+)\\.(\\d+)',
          '; wv\\).+(Chrome)/(\\d+)\\.(\\d+)\\.(\\d+)\\.(\\d+)',
          '(CriOS)/(\\d+)\\.(\\d+)\\.(\\d+)\\.(\\d+)',
          '(CrMo)/(\\d+)\\.(\\d+)\\.(\\d+)\\.(\\d+)',
          '(Chrome)/(\\d+)\\.(\\d+)\\.(\\d+)\\.(\\d+) Mobile(?:[ /]|$)',
          ' Mobile .*(Chrome)/(\\d+)\\.(\\d+)\\.(\\d+)\\.(\\d+)',
        ],
      },
      {
        family: 'Yandex',
        name_replace: 'Yandex Mobile',
        patterns: ['(YaBrowser)/(\\d+)\\.(\\d+)\\.(\\d+)\\.(\\d+).*Mobile'],
      },
      { name_replace: 'Yandex', patterns: ['(YaBrowser)/(\\d+)\\.(\\d+)\\.(\\d+)'] },
      { patterns: ['(Vivaldi)/(\\d+)\\.(\\d+)', '(Vivaldi)/(\\d+)\\.(\\d+)\\.(\\d+)'] },
      { name_replace: 'Brave', patterns: ['(brave)/(\\d+)\\.(\\d+)\\.(\\d+) Chrome'] },
      {
        family: 'Chrome',
        patterns: ['(Chromium|Chrome)/(\\d+)\\.(\\d+)(?:\\.(\\d+)|)(?:\\.(\\d+)|)'],
      },
      { name_replace: 'Internet Explorer Mobile', patterns: ['(IEMobile)[ /](\\d+)\\.(\\d+)'] },
      {
        family: 'Safari',
        name_replace: 'Safari Mobile',
        patterns: [
          '(iPod|iPhone|iPad).+Version/(d+).(d+)(?:.(d+)|).*[ +]Safari',
          '(iPod|iPod touch|iPhone|iPad);.*CPU.*OS[ +](\\d+)_(\\d+)(?:_(\\d+)|).* AppleNews\\/\\d+\\.\\d+\\.\\d+?',
          '(iPod|iPhone|iPad).+Version/(\\d+)\\.(\\d+)(?:\\.(\\d+)|)',
          '(iPod|iPod touch|iPhone|iPad);.*CPU.*OS[ +](\\d+)_(\\d+)(?:_(\\d+)|).*Mobile.*[ +]Safari',
          '(iPod|iPod touch|iPhone|iPad);.*CPU.*OS[ +](\\d+)_(\\d+)(?:_(\\d+)|).*Mobile',
          '(iPod|iPod touch|iPhone|iPad).* Safari',
          '(iPod|iPod touch|iPhone|iPad)',
        ],
      },
      { name_replace: 'Safari', patterns: ['(Version)/(\\d+)\\.(\\d+)(?:\\.(\\d+)|).*Safari/'] },
      { name_replace: 'Internet Explorer', patterns: ['(Trident)/(7|8).(0)'], major_replace: '11' },
      { name_replace: 'Internet Explorer', patterns: ['(Trident)/(6)\\.(0)'], major_replace: '10' },
      { name_replace: 'Internet Explorer', patterns: ['(Trident)/(5)\\.(0)'], major_replace: '9' },
      { name_replace: 'Internet Explorer', patterns: ['(Trident)/(4)\\.(0)'], major_replace: '8' },
      {
        family: 'Firefox',
        patterns: [
          '(Firefox)/(\\d+)\\.(\\d+)\\.(\\d+)',
          '(Firefox)/(\\d+)\\.(\\d+)(pre|[ab]\\d+[a-z]*|)',
        ],
      },
    ],
    z = [
      {
        family: 'Windows',
        name_replace: 'Windows Phone',
        patterns: [
          '(Windows Phone) (?:OS[ /])?(\\d+)\\.(\\d+)',
          '^UCWEB.*; (wds) (\\d+)\\.(d+)(?:\\.(\\d+)|);',
          '^UCWEB.*; (wds) (\\d+)\\.(\\d+)(?:\\.(\\d+)|);',
        ],
      },
      { family: 'Windows', name_replace: 'Windows Mobile', patterns: ['(Windows ?Mobile)'] },
      {
        name_replace: 'Android',
        patterns: [
          '(Android)[ \\-/](\\d+)(?:\\.(\\d+)|)(?:[.\\-]([a-z0-9]+)|)',
          '(Android) (d+);',
          '^UCWEB.*; (Adr) (\\d+)\\.(\\d+)(?:[.\\-]([a-z0-9]+)|);',
          '^(JUC).*; ?U; ?(?:Android|)(\\d+)\\.(\\d+)(?:[\\.\\-]([a-z0-9]+)|)',
          '(android)\\s(?:mobile\\/)(\\d+)(?:\\.(\\d+)(?:\\.(\\d+)|)|)',
          '(Silk-Accelerated=[a-z]{4,5})',
          'Puffin/[\\d\\.]+AT',
          'Puffin/[\\d\\.]+AP',
        ],
      },
      {
        name_replace: 'Chrome OS',
        patterns: [
          '(x86_64|aarch64)\\ (\\d+)\\.(\\d+)\\.(\\d+).*Chrome.*(?:CitrixChromeApp)$',
          '(CrOS) [a-z0-9_]+ (\\d+)\\.(\\d+)(?:\\.(\\d+)|)',
        ],
      },
      {
        name_replace: 'Windows',
        patterns: ['(Windows 10)', '(Windows NT 6\\.4)', '(Windows NT 10\\.0)'],
        major_replace: '10',
      },
      {
        name_replace: 'Windows',
        patterns: ['(Windows NT 6\\.3; ARM;)', '(Windows NT 6.3)'],
        major_replace: '8',
        minor_replace: '1',
      },
      { name_replace: 'Windows', patterns: ['(Windows NT 6\\.2)'], major_replace: '8' },
      { name_replace: 'Windows', patterns: ['(Windows NT 6\\.1)'], major_replace: '7' },
      { name_replace: 'Windows', patterns: ['(Windows NT 6\\.0)'], major_replace: 'Vista' },
      {
        name_replace: 'Windows',
        patterns: ['(Windows (?:NT 5\\.2|NT 5\\.1))'],
        major_replace: 'XP',
      },
      {
        name_replace: 'Mac OS X',
        patterns: [
          '((?:Mac[ +]?|; )OS[ +]X)[\\s+/](?:(\\d+)[_.](\\d+)(?:[_.](\\d+)|)|Mach-O)',
          '\\w+\\s+Mac OS X\\s+\\w+\\s+(\\d+).(\\d+).(\\d+).*',
          '(?:PPC|Intel) (Mac OS X)',
        ],
      },
      {
        name_replace: 'Mac OS X',
        patterns: [' (Dar)(win)/(10).(d+).*((?:i386|x86_64))'],
        major_replace: '10',
        minor_replace: '6',
      },
      {
        name_replace: 'Mac OS X',
        patterns: [' (Dar)(win)/(11).(\\d+).*\\((?:i386|x86_64)\\)'],
        major_replace: '10',
        minor_replace: '7',
      },
      {
        name_replace: 'Mac OS X',
        patterns: [' (Dar)(win)/(12).(\\d+).*\\((?:i386|x86_64)\\)'],
        major_replace: '10',
        minor_replace: '8',
      },
      {
        name_replace: 'Mac OS X',
        patterns: [' (Dar)(win)/(13).(\\d+).*\\((?:i386|x86_64)\\)'],
        major_replace: '10',
        minor_replace: '9',
      },
      {
        name_replace: 'iOS',
        patterns: [
          '^UCWEB.*; (iPad|iPh|iPd) OS (\\d+)_(\\d+)(?:_(\\d+)|);',
          '(CPU[ +]OS|iPhone[ +]OS|CPU[ +]iPhone|CPU IPhone OS)[ +]+(\\d+)[_\\.](\\d+)(?:[_\\.](\\d+)|)',
          '(iPhone|iPad|iPod); Opera',
          '(iPhone|iPad|iPod).*Mac OS X.*Version/(\\d+)\\.(\\d+)',
          '\\b(iOS[ /]|iOS; |iPhone(?:/| v|[ _]OS[/,]|; | OS : |\\d,\\d/|\\d,\\d; )|iPad/)(\\d{1,2})[_\\.](\\d{1,2})(?:[_\\.](\\d+)|)',
          '\\((iOS);',
          '(iPod|iPhone|iPad)',
          'Puffin/[\\d\\.]+IT',
          'Puffin/[\\d\\.]+IP',
        ],
      },
      {
        family: 'Chrome',
        name_replace: 'Chromecast',
        patterns: [
          '(CrKey -)(?:[ /](\\d+)\\.(\\d+)(?:\\.(\\d+)|)|)',
          '(CrKey[ +]armv7l)(?:[ /](\\d+)\\.(\\d+)(?:\\.(\\d+)|)|)',
          '(CrKey)(?:[/](\\d+)\\.(\\d+)(?:\\.(\\d+)|)|)',
        ],
      },
      { name_replace: 'Debian', patterns: ['([Dd]ebian)'] },
      { family: 'Linux', name_replace: 'Linux', patterns: ['(Linux Mint)(?:/(\\d+)|)'] },
      {
        family: 'Linux',
        patterns: [
          '(Ubuntu|Kubuntu|Arch Linux|CentOS|Slackware|Gentoo|openSUSE|SUSE|Red Hat|Fedora|PCLinuxOS|Mageia|(?:Free|Open|Net|\\b)BSD)',
          '(Mandriva)(?: Linux|)/(?:[\\d.-]+m[a-z]{2}(\\d+).(\\d)|)',
          '(Linux)(?:[ /](\\d+)\\.(\\d+)(?:\\.(\\d+)|)|)',
          '\\(linux-gnu\\)',
        ],
      },
      {
        family: 'BlackBerry',
        name_replace: 'BlackBerry OS',
        patterns: [
          '(BB10);.+Version/(\\d+)\\.(\\d+)\\.(\\d+)',
          '(Black[Bb]erry)[0-9a-z]+/(\\d+)\\.(\\d+)\\.(\\d+)(?:\\.(\\d+)|)',
          '(Black[Bb]erry).+Version/(\\d+)\\.(\\d+)\\.(\\d+)(?:\\.(\\d+)|)',
          '(Black[Bb]erry)',
        ],
      },
      {
        patterns: [
          '(Fedora|Red Hat|PCLinuxOS|Puppy|Ubuntu|Kindle|Bada|Sailfish|Lubuntu|BackTrack|Slackware|(?:Free|Open|Net|\\b)BSD)[/ ](\\d+)\\.(\\d+)(?:\\.(\\d+)|)(?:\\.(\\d+)|)',
        ],
      },
    ],
    Z = navigator.userAgent,
    W = function () {
      return Z
    },
    q = function (t) {
      return G(t || Z, N)
    },
    K = function (t) {
      return G(t || Z, z)
    }
  function Y(t, e) {
    try {
      var i = new RegExp(e).exec(t)
      return i
        ? { name: i[1] || 'Other', major: i[2] || '0', minor: i[3] || '0', patch: i[4] || '0' }
        : null
    } catch (ts) {
      return null
    }
  }
  function G(t, e) {
    for (var i = null, n = null, o = -1, r = !1; ++o < e.length && !r; ) {
      i = e[o]
      for (var s = -1; ++s < i.patterns.length && !r; ) r = null !== (n = Y(t, i.patterns[s]))
    }
    return r
      ? ((n.family = i.family || i.name_replace || n.name),
        i.name_replace && (n.name = i.name_replace),
        i.major_replace && (n.major = i.major_replace),
        i.minor_replace && (n.minor = i.minor_replace),
        i.patch_replace && (n.minor = i.patch_replace),
        n)
      : { family: 'Other', name: 'Other', major: '0', minor: '0', patch: '0' }
  }
  function J() {
    var t = this,
      e = q(),
      i = W()
    ;(this.agent = i.toLowerCase()),
      (this.language = window.navigator.userLanguage || window.navigator.language),
      (this.isCSS1 = 'CSS1Compat' === (document.compatMode || '')),
      (this.width = function () {
        return window.innerWidth && window.document.documentElement.clientWidth
          ? Math.min(window.innerWidth, document.documentElement.clientWidth)
          : window.innerWidth ||
              window.document.documentElement.clientWidth ||
              document.body.clientWidth
      }),
      (this.height = function () {
        return (
          window.innerHeight ||
          window.document.documentElement.clientHeight ||
          document.body.clientHeight
        )
      }),
      (this.scrollX = function () {
        return window.pageXOffset !== undefined
          ? window.pageXOffset
          : t.isCSS1
          ? document.documentElement.scrollLeft
          : document.body.scrollLeft
      }),
      (this.scrollY = function () {
        return window.pageYOffset !== undefined
          ? window.pageYOffset
          : t.isCSS1
          ? document.documentElement.scrollTop
          : document.body.scrollTop
      }),
      (this.type =
        'Edge' === e.family
          ? 'edge'
          : 'Internet Explorer' === e.family
          ? 'ie'
          : 'Chrome' === e.family
          ? 'chrome'
          : 'Safari' === e.family
          ? 'safari'
          : 'Firefox' === e.family
          ? 'firefox'
          : e.family.toLowerCase()),
      (this.version = 1 * (e.major + '.' + e.minor) || 0),
      (this.hasPostMessage = !!window.postMessage)
  }
  ;(J.prototype.hasEvent = function (t, e) {
    return 'on' + t in (e || document.createElement('div'))
  }),
    (J.prototype.getScreenDimensions = function () {
      var t = {}
      for (var e in window.screen) t[e] = window.screen[e]
      return delete t.orientation, t
    }),
    (J.prototype.getWindowDimensions = function () {
      return [this.width(), this.height()]
    }),
    (J.prototype.interrogateNavigator = function () {
      var t = {}
      for (var e in window.navigator) {
        if ('webkitPersistentStorage' !== e) {
          try {
            t[e] = window.navigator[e]
          } catch (Qr) {}
        }
      }
      if ((delete t.plugins, delete t.mimeTypes, (t.plugins = []), window.navigator.plugins)) {
        for (var i = 0; i < window.navigator.plugins.length; i++) {
          t.plugins[i] = window.navigator.plugins[i].filename
        }
      }
      return t
    }),
    (J.prototype.supportsPST = function () {
      return document.hasPrivateToken !== undefined
    }),
    (J.prototype.supportsCanvas = function () {
      var t = document.createElement('canvas')
      return !(!t.getContext || !t.getContext('2d'))
    }),
    (J.prototype.supportsWebAssembly = function () {
      try {
        if ('object' == typeof WebAssembly && 'function' == typeof WebAssembly.instantiate) {
          var t = new WebAssembly.Module(Uint8Array.of(0, 97, 115, 109, 1, 0, 0, 0))
          if (t instanceof WebAssembly.Module) {
            return new WebAssembly.Instance(t) instanceof WebAssembly.Instance
          }
        }
      } catch (ts) {
        return !1
      }
    })
  var X = new J(),
    Q = new (function () {
      var t,
        e,
        i = K(),
        n = W()
      ;(this.mobile =
        ((t = !!(
          'ontouchstart' in window ||
          navigator.maxTouchPoints > 0 ||
          navigator.msMaxTouchPoints > 0
        )),
        (e = !1),
        i &&
          (e =
            ['iOS', 'Windows Phone', 'Windows Mobile', 'Android', 'BlackBerry OS'].indexOf(
              i.name,
            ) >= 0),
        t && e)),
        (this.dpr = function () {
          return window.devicePixelRatio || 1
        }),
        this.mobile && i && 'Windows' === i.family && n.indexOf('touch') < 0 && (this.mobile = !1),
        (this.os =
          'iOS' === i.family
            ? 'ios'
            : 'Android' === i.family
            ? 'android'
            : 'Mac OS X' === i.family
            ? 'mac'
            : 'Windows' === i.family
            ? 'windows'
            : 'Linux' === i.family
            ? 'linux'
            : i.family.toLowerCase()),
        (this.version = (function () {
          if (!i) return 'unknown'
          var t = i.major
          return i.minor && (t += '.' + i.minor), i.patch && (t += '.' + i.patch), t
        })())
    })(),
    tt = {
      Browser: X,
      System: Q,
      supportsPAT: function () {
        return ('mac' === Q.os || 'ios' === Q.os) && 'safari' === X.type && X.version >= 16.2
      },
    },
    et = {
      CHALLENGE_PASSED: 'challenge-passed',
      CHALLENGE_ESCAPED: 'challenge-escaped',
      CHALLENGE_CLOSED: 'challenge-closed',
      CHALLENGE_EXPIRED: 'challenge-expired',
      CHALLENGE_ALREADY_CLOSED: 'challenge-already-closed',
      AUTHENTICATION_DONE: 'authentication-done',
      AUTHENTICATION_PASSED: 'authentication-passed',
    },
    it = {
      INVALID_DATA: 'invalid-data',
      BUNDLE_ERROR: 'bundle-error',
      NETWORK_ERROR: 'network-error',
      RATE_LIMITED: 'rate-limited',
      CHALLENGE_ERROR: 'challenge-error',
      INCOMPLETE_ANSWER: 'incomplete-answer',
      MISSING_CAPTCHA: 'missing-captcha',
      MISSING_SITEKEY: 'missing-sitekey',
      INVALID_CAPTCHA_ID: 'invalid-captcha-id',
      AUTHENTICATION_ERROR: 'authentication-error',
    },
    nt = 'https://hcaptcha.com',
    ot = 'https://api.hcaptcha.com',
    rt = 'https://api2.hcaptcha.com',
    st = 'https://cloudflare.hcaptcha.com',
    at = { AUTO: 'auto' },
    ct = [nt, ot, rt, st],
    lt = {
      __proto__: null,
      CaptchaEvent: et,
      CaptchaError: it,
      ROOT_ENDPOINT: nt,
      API_ENDPOINT: ot,
      API2_ENDPOINT: rt,
      CF_ENDPOINT: st,
      EXECUTE_MODE: at,
      MAIN_ENDPOINTS: ct,
    },
    ht = {
      host: null,
      file: null,
      sitekey: null,
      a11y_tfe: null,
      pingdom:
        'safari' === tt.Browser.type &&
        'windows' !== tt.System.os &&
        'mac' !== tt.System.os &&
        'ios' !== tt.System.os &&
        'android' !== tt.System.os,
      assetDomain: 'https://newassets.hcaptcha.com',
      assetUrl: 'https://newassets.hcaptcha.com/captcha/v1/a8cd801/static',
      width: null,
      height: null,
      mobile: null,
      orientation: 'portrait',
      challenge_type: null,
    },
    ut = {
      theme: {
        contrast: { hcolor: '#FFF', hfcolor: '#000' },
        light: { hcolor: '#00838F', hfcolor: '#FFF' },
      },
      text: '#555555',
      accent: '#926FC1',
      warn: { base: '#BF1722', hover: '#9D1B1B' },
      link: { base: '#00838f', hover: '#00838f' },
      white: '#fff',
      grey: { base: '#333', placeholder: '#f0eff0', selected: '#5C6F8A' },
      purple: '#65549b',
      hoverOff: '#00838f',
      skipHoverOff: '#737373',
      hoverOn: '#00838f',
      error: '#fc481e',
      outline: '#262D38',
    },
    ft = {
      se: null,
      custom: !1,
      tplinks: 'on',
      language: null,
      reportapi: 'https://accounts.hcaptcha.com',
      endpoint: ot,
      pstIssuer: 'https://pst-issuer.hcaptcha.com',
      size: 'normal',
      theme: 'light',
      mode: undefined,
      assethost: null,
      imghost: null,
      recaptchacompat: 'true',
      pat: 'on',
      confirmNav: !1,
    },
    dt = 'https://30910f52569b4c17b1081ead2dae43b4@sentry.hcaptcha.com/6',
    pt = 'a8cd801',
    mt = 'prod'
  function yt(t, e) {
    ;(t.style.width = '304px'),
      (t.style.height = '78px'),
      (t.style.backgroundColor = '#f9e5e5'),
      (t.style.position = 'relative'),
      (t.innerHTML = '')
    var i = document.createElement('div')
    ;(i.style.width = '284px'),
      (i.style.position = 'absolute'),
      (i.style.top = '12px'),
      (i.style.left = '10px'),
      (i.style.color = '#7c0a06'),
      (i.style.fontSize = '14px'),
      (i.style.fontWeight = 'normal'),
      (i.style.lineHeight = '18px'),
      (i.innerHTML =
        e ||
        "Please <a style='color:inherit;text-decoration:underline; font: inherit' target='_blank' href='https://www.whatismybrowser.com/guides/how-to-update-your-browser/auto'>upgrade your browser</a> to complete this captcha."),
      t.appendChild(i)
  }
  function gt(t) {
    for (var e = document.getElementsByClassName('h-captcha'), i = [], n = 0; n < e.length; n++) {
      i.push(e[n])
    }
    var o = []
    if ('off' !== ft.recaptchacompat) {
      for (var r = document.getElementsByClassName('g-recaptcha'), s = 0; s < r.length; s++) {
        o.push(r[s])
      }
    }
    for (var a = [].concat(i, o), c = 0; c < a.length; c++) t(a[c])
  }
  var vt = 'The captcha failed to load.',
    bt = []
  function wt(t) {
    for (
      var e = [], i = /(https?|wasm):\/\//, n = /^at /, o = /:\d+:\d+/g, r = 0, s = t.length;
      r < s;
      r++
    ) {
      var a = t[r]
      if (!i.test(a)) {
        var c = a.trim().replace(n, '').replace(o, '')
        e.push(c)
      }
    }
    return e.join('\n').trim()
  }
  function xt(t) {
    if (t && 'string' == typeof t && -1 === bt.indexOf(t) && !(bt.length >= 10)) {
      var e = wt(t.trim().split('\n').slice(0, 2))
      bt.push(e)
    }
  }
  function kt(t) {
    ;(t && 'object' == typeof t) || (t = { name: 'error', message: '', stack: '' })
    var e = { message: t.name + ': ' + t.message }
    t.stack && (e.stack_trace = { trace: t.stack }),
      St('report error', 'internal', 'debug', e),
      Et(t.message || 'internal error', 'error', ht.file, t)
  }
  function Ct(t) {
    return function () {
      try {
        return t.apply(this, arguments)
      } catch (Qr) {
        throw (
          (kt(Qr),
          gt(function (t) {
            yt(t, vt)
          }),
          Qr)
        )
      }
    }
  }
  function _t(t) {
    if (ft.sentry) {
      var e = !1
      try {
        e = -1 !== window.location.href.indexOf('chargebee.com')
      } catch (ts) {}
      window.Raven &&
        Raven.config(dt, {
          release: pt,
          environment: mt,
          autoBreadcrumbs: { xhr: !0, dom: !0, sentry: !0 },
          tags: {
            'site-host': ht.host,
            'site-key': ht.sitekey,
            'endpoint-url': ft.endpoint,
            'asset-url': ht.assetUrl,
          },
          sampleRate: e ? 1 : 0.01,
          ignoreErrors: [
            "Cannot set properties of undefined (setting 'data')",
            'canvas.contentDocument',
            "Can't find variable: ZiteReader",
            'Cannot redefine property: hcaptcha',
            'Cannot redefine property: BetterJsPop',
            'grecaptcha is not defined',
            'jQuery is not defined',
            '$ is not defined',
            'Script is not a function',
          ],
        }),
        window.Raven &&
          Raven.setUserContext({
            'Browser-Agent': tt.Browser.agent,
            'Browser-Type': tt.Browser.type,
            'Browser-Version': tt.Browser.version,
            'System-OS': tt.System.os,
            'System-Version': tt.System.version,
            'Is-Mobile': tt.System.mobile,
          }),
        St(ht.file + '_internal', 'setup', 'info'),
        t &&
          (window.onerror = function (t, e, i, n, o) {
            ;(o && 'object' == typeof o) || (o = {})
            var r = o.name || 'Error',
              s = o.stack || ''
            Ct(xt)(s),
              -1 === s.indexOf('chrome-extension://') &&
                -1 === s.indexOf('safari-extension://') &&
                -1 === s.indexOf('moz-extension://') &&
                -1 === s.indexOf('chrome://internal-') &&
                -1 === s.indexOf('/hammerhead.js') &&
                -1 === s.indexOf('eval at buildCode') &&
                -1 === s.indexOf('u.c.b.r.o.w.s.e.r/ucbrowser_script.js') &&
                (St(t, 'global', 'debug', { name: r, url: e, line: i, column: n, stack: s }),
                At('global', o, { message: t }))
          })
    }
  }
  function Et(t, e, i, n) {
    if (((e = e || 'error'), ft.sentry)) {
      var o = 'warn' === e ? 'warning' : e
      window.Raven && Raven.captureMessage(t, { level: o, logger: i, extra: n })
    }
  }
  function At(t, e, i) {
    return ((i = i || {}).error = e), Et((e && e.message) || 'Missing error message', 'error', t, i)
  }
  function St(t, e, i, n) {
    ft.sentry &&
      window.Raven &&
      Raven.captureBreadcrumb({ message: t, category: e, level: i, data: n })
  }
  var Bt = {
      getCookie: function (t) {
        var e = document.cookie.replace(/ /g, '').split(';')
        try {
          for (var i = '', n = e.length; n-- && !i; ) e[n].indexOf(t) >= 0 && (i = e[n])
          return i
        } catch (ts) {
          return ''
        }
      },
      hasCookie: function (t) {
        return !!Bt.getCookie(t)
      },
      supportsAPI: function () {
        try {
          return 'hasStorageAccess' in document && 'requestStorageAccess' in document
        } catch (ts) {
          return !1
        }
      },
      hasAccess: function () {
        return new Promise(function (t) {
          document
            .hasStorageAccess()
            .then(function () {
              t(!0)
            })
            ['catch'](function () {
              t(!1)
            })
        })
      },
      requestAccess: function () {
        try {
          return document.requestStorageAccess()
        } catch (ts) {
          return Promise.resolve()
        }
      },
    },
    Lt = {
      array: function (t) {
        if (0 === t.length) return t
        for (var e, i, n = t.length; --n > -1; ) {
          ;(i = Math.floor(Math.random() * (n + 1))), (e = t[n]), (t[n] = t[i]), (t[i] = e)
        }
        return t
      },
    }
  function Tt(t) {
    ;(this.r = 255),
      (this.g = 255),
      (this.b = 255),
      (this.a = 1),
      (this.h = 1),
      (this.s = 1),
      (this.l = 1),
      this.parseString(t)
  }
  function Ot(t, e, i) {
    return (
      i < 0 && (i += 1),
      i > 1 && (i -= 1),
      i < 1 / 6 ? t + 6 * (e - t) * i : i < 0.5 ? e : i < 2 / 3 ? t + (e - t) * (2 / 3 - i) * 6 : t
    )
  }
  ;(Tt.hasAlpha = function (t) {
    return 'string' == typeof t && (-1 !== t.indexOf('rgba') || (9 === t.length && '#' === t[0]))
  }),
    (Tt.prototype.parseString = function (t) {
      t && (0 === t.indexOf('#') ? this.fromHex(t) : 0 === t.indexOf('rgb') && this.fromRGBA(t))
    }),
    (Tt.prototype.fromHex = function (t) {
      var e = 1
      9 === t.length && (e = parseInt(t.substr(7, 2), 16) / 255)
      var i = (t = t.substr(1, 6)).replace(
          /^([a-f\d])([a-f\d])([a-f\d])?$/i,
          function (t, e, i, n) {
            return e + e + i + i + n + n
          },
        ),
        n = parseInt(i, 16),
        o = n >> 16,
        r = (n >> 8) & 255,
        s = 255 & n
      this.setRGBA(o, r, s, e)
    }),
    (Tt.prototype.fromRGBA = function (t) {
      var e = t.indexOf('rgba'),
        i = t
          .substr(e)
          .replace(/rgba?\(/, '')
          .replace(/\)/, '')
          .replace(/[\s+]/g, '')
          .split(','),
        n = Math.floor(parseInt(i[0])),
        o = Math.floor(parseInt(i[1])),
        r = Math.floor(parseInt(i[2])),
        s = parseFloat(i[3])
      this.setRGBA(n, o, r, s)
    }),
    (Tt.prototype.setRGB = function (t, e, i) {
      this.setRGBA(t, e, i, 1)
    }),
    (Tt.prototype.setRGBA = function (t, e, i, n) {
      ;(this.r = t), (this.g = e), (this.b = i), (this.a = isNaN(n) ? this.a : n), this.updateHSL()
    }),
    (Tt.prototype.hsl2rgb = function (t, e, i) {
      if (0 === e) {
        var n = Math.round(255 * i)
        return this.setRGB(n, n, n), this
      }
      var o = i <= 0.5 ? i * (1 + e) : i + e - i * e,
        r = 2 * i - o
      return (
        (this.r = Math.round(255 * Ot(r, o, t + 1 / 3))),
        (this.g = Math.round(255 * Ot(r, o, t))),
        (this.b = Math.round(255 * Ot(r, o, t - 1 / 3))),
        (this.h = t),
        (this.s = e),
        (this.l = i),
        this
      )
    }),
    (Tt.prototype.updateHSL = function () {
      var t,
        e = this.r / 255,
        i = this.g / 255,
        n = this.b / 255,
        o = Math.max(e, i, n),
        r = Math.min(e, i, n),
        s = null,
        a = (o + r) / 2
      if (o === r) s = t = 0
      else {
        var c = o - r
        switch (((t = a > 0.5 ? c / (2 - o - r) : c / (o + r)), o)) {
          case e:
            s = (i - n) / c + (i < n ? 6 : 0)
            break
          case i:
            s = (n - e) / c + 2
            break
          case n:
            s = (e - i) / c + 4
        }
        s /= 6
      }
      return (this.h = s), (this.s = t), (this.l = a), this
    }),
    (Tt.prototype.getHex = function () {
      return '#' + ((1 << 24) + (this.r << 16) + (this.g << 8) + this.b).toString(16).slice(1)
    }),
    (Tt.prototype.getRGBA = function () {
      return 'rgba(' + this.r + ',' + this.g + ',' + this.b + ',' + this.a + ')'
    }),
    (Tt.prototype.clone = function () {
      var t = new Tt()
      return t.setRGBA(this.r, this.g, this.b, this.a), t
    }),
    (Tt.prototype.mix = function (t, e) {
      t instanceof Tt || (t = new Tt(t))
      var i = new Tt(),
        n = Math.round(this.r + e * (t.r - this.r)),
        o = Math.round(this.g + e * (t.g - this.g)),
        r = Math.round(this.b + e * (t.b - this.b))
      return i.setRGB(n, o, r), i
    }),
    (Tt.prototype.blend = function (t, e) {
      var i
      t instanceof Tt || (t = new Tt(t))
      for (var n = [], o = 0; o < e; o++) (i = this.mix.call(this, t, o / e)), n.push(i)
      return n
    }),
    (Tt.prototype.lightness = function (t) {
      return t > 1 && (t /= 100), this.hsl2rgb(this.h, this.s, t), this
    }),
    (Tt.prototype.saturation = function (t) {
      return t > 1 && (t /= 100), this.hsl2rgb(this.h, t, this.l), this
    }),
    (Tt.prototype.hue = function (t) {
      return this.hsl2rgb(t / 360, this.s, this.l), this
    })
  var Ht = {
      decode: function (t) {
        try {
          var e = t.split('.')
          return {
            header: JSON.parse(atob(e[0])),
            payload: JSON.parse(atob(e[1])),
            signature: atob(e[2].replace(/_/g, '/').replace(/-/g, '+')),
            raw: { header: e[0], payload: e[1], signature: e[2] },
          }
        } catch (ts) {
          throw new Error('Token is invalid.')
        }
      },
      checkExpiration: function (t) {
        if (new Date(1e3 * t) <= new Date(Date.now())) throw new Error('Token is expired.')
        return !0
      },
    },
    Mt = {
      _setup: !1,
      _af: null,
      _fps: 60,
      _singleFrame: 1 / 60,
      _lagThreshold: 500,
      _adjustedLag: (1 / 60) * 2,
      _startTime: 0,
      _lastTime: 0,
      _nextTime: 1 / 60,
      _elapsed: 0,
      _difference: 0,
      _renders: [],
      _paused: !1,
      _running: !1,
      _tick: !1,
      frame: 0,
      time: 0,
      requestFrame: null,
      cancelFrame: null,
      _init: function () {
        for (
          var t,
            e = window.requestAnimationFrame,
            i = window.cancelAnimationFrame,
            n = ['ms', 'moz', 'webkit', 'o'],
            o = n.length;
          --o > -1 && !e;

        ) {
          ;(e = window[n[o] + 'RequestAnimationFrame']),
            (i =
              window[n[o] + 'CancelAnimationFrame'] || window[n[o] + 'CancelRequestAnimationFrame'])
        }
        e
          ? ((Mt.requestFrame = e.bind(window)), (Mt.cancelFrame = i.bind(window)))
          : ((Mt.requestFrame =
              ((t = Date.now()),
              function (e) {
                window.setTimeout(function () {
                  e(Date.now() - t)
                }, 1e3 * Mt._singleFrame)
              })),
            (Mt.cancelFrame = function (t) {
              return clearTimeout(t), null
            })),
          (Mt._setup = !0),
          (Mt._startTime = Mt._lastTime = Date.now())
      },
      add: function (t, e) {
        Mt._renders.push({ callback: t, paused: !1 == !e || !1 }), !1 == !e && Mt.start()
      },
      remove: function (t) {
        for (var e = Mt._renders.length; --e > -1; ) {
          Mt._renders[e].callback === t && ((Mt._renders[e].paused = !0), Mt._renders.splice(e, 1))
        }
      },
      start: function (t) {
        if ((!1 === Mt._setup && Mt._init(), t)) {
          for (var e = Mt._renders.length; --e > -1; ) {
            Mt._renders[e].callback === t && (Mt._renders[e].paused = !1)
          }
        }
        !0 !== Mt._running &&
          ((Mt._paused = !1), (Mt._running = !0), (Mt._af = Mt.requestFrame(Mt._update)))
      },
      stop: function (t) {
        if (t) {
          for (var e = Mt._renders.length; --e > -1; ) {
            Mt._renders[e].callback === t && (Mt._renders[e].paused = !0)
          }
        } else {
          !1 !== Mt._running &&
            ((Mt._af = Mt.cancelFrame(Mt._af)), (Mt._paused = !0), (Mt._running = !1))
        }
      },
      elapsed: function () {
        return Date.now() - Mt._startTime
      },
      fps: function (t) {
        return arguments.length
          ? ((Mt._fps = t),
            (Mt._singleFrame = 1 / (Mt._fps || 60)),
            (Mt._adjustedLag = 2 * Mt._singleFrame),
            (Mt._nextTime = Mt.time + Mt._singleFrame),
            Mt._fps)
          : Mt._fps
      },
      isRunning: function () {
        return Mt._running
      },
      _update: function () {
        if (
          !Mt._paused &&
          ((Mt._elapsed = Date.now() - Mt._lastTime),
          (Mt._tick = !1),
          Mt._elapsed > Mt._lagThreshold && (Mt._startTime += Mt._elapsed - Mt._adjustedLag),
          (Mt._lastTime += Mt._elapsed),
          (Mt.time = (Mt._lastTime - Mt._startTime) / 1e3),
          (Mt._difference = Mt.time - Mt._nextTime),
          Mt._difference > 0 &&
            (Mt.frame++,
            (Mt._nextTime +=
              Mt._difference +
              (Mt._difference >= Mt._singleFrame
                ? Mt._singleFrame / 4
                : Mt._singleFrame - Mt._difference)),
            (Mt._tick = !0)),
          (Mt._af = Mt.requestFrame(Mt._update)),
          !0 === Mt._tick && Mt._renders.length > 0)
        ) {
          for (var t = Mt._renders.length; --t > -1; ) {
            Mt._renders[t] && !1 === Mt._renders[t].paused && Mt._renders[t].callback(Mt.time)
          }
        }
      },
    },
    Rt = function (t) {
      for (
        var e, i, n, o = {}, r = t ? (t.indexOf('&') >= 0 ? t.split('&') : [t]) : [], s = 0;
        s < r.length;
        s++
      ) {
        if (r[s].indexOf('=') >= 0) {
          if (
            ((e = r[s].split('=')),
            (i = decodeURIComponent(e[0])),
            ('false' !== (n = decodeURIComponent(e[1])) && 'true' !== n) || (n = 'true' === n),
            'theme' === i || 'themeConfig' === i)
          ) {
            try {
              n = JSON.parse(n)
            } catch (ts) {}
          }
          o[i] = n
        }
      }
      return o
    },
    Pt = function (t) {
      var e = []
      for (var i in t) {
        var n = t[i]
        ;(n = 'object' == typeof n ? JSON.stringify(n) : n),
          e.push([encodeURIComponent(i), encodeURIComponent(n)].join('='))
      }
      return e.join('&')
    },
    It = { __proto__: null, Decode: Rt, Encode: Pt }
  function Vt(t, e, i) {
    return Math.min(Math.max(t, e), i)
  }
  function Dt(t, e, i, n, o, r) {
    var s = ((t - e) * (o - n)) / (i - e) + n
    return !1 === r ? s : Vt(s, Math.min(n, o), Math.max(n, o))
  }
  function Ft(t) {
    return t * (Math.PI / 180)
  }
  function $t(t) {
    return (180 * t) / Math.PI
  }
  var Ut = { __proto__: null, clamp: Vt, range: Dt, toRadians: Ft, toDegrees: $t }
  function jt(t) {
    var e = [].slice.call(arguments, 1)
    'string' == typeof t
      ? window[t]
        ? 'function' == typeof window[t]
          ? window[t].apply(null, e)
          : console.log("[hCaptcha] Callback '" + t + "' is not a function.")
        : console.log("[hCaptcha] Callback '" + t + "' is not defined.")
      : 'function' == typeof t
      ? t.apply(null, e)
      : console.log("[hcaptcha] Invalid callback '" + t + "'.")
  }
  function Nt() {
    try {
      jt.apply(null, arguments)
    } catch (Qr) {
      console.error('[hCaptcha] There was an error in your callback.'), console.error(Qr)
    }
  }
  var zt,
    Zt = {
      UUID: function (t) {
        return /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i.test(t) || !1
      },
      UUIDv4: function (t) {
        return (
          /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(t) || !1
        )
      },
      URL: function (t) {
        var e = new RegExp('^(http|https)://'),
          i = new RegExp('^((?!(data|javascript):).)*$')
        return e.test(t) && i.test(t) && -1 === t.indexOf('#')
      },
      IMAGE: function (t) {
        return (0 === t.indexOf('https://') || 0 === t.indexOf('/')) && t.endsWith('.png')
      },
    }
  function Wt(t, e) {
    var i,
      n = 'attempts' in (e = e || {}) ? e.attempts : 1,
      o = e.delay || 0,
      r = e.onFail
    return (
      (i = function (e, i, s) {
        t().then(e, function (t) {
          var e = n-- > 0
          if (r) {
            var a = r(t, n)
            a && ((e = !1 !== a.retry && e), (o = a.delay))
          }
          e ? setTimeout(s, o || 0) : i(t)
        })
      }),
      new Promise(function (t, e) {
        i(t, e, function n() {
          i(t, e, n)
        })
      })
    )
  }
  function qt() {
    var t = this
    ;(this._bottom = 0),
      (this._top = 0),
      (this.storage = {}),
      (this.add = function (e) {
        return (t.storage[t._top] = e), t._top++, e
      }),
      (this.remove = function () {
        if (!t.empty()) {
          var e = t._bottom,
            i = t.storage[e]
          return (t.storage[e] = null), t._bottom++, i
        }
      }),
      (this.empty = function () {
        return t._top === t._bottom
      }),
      (this.size = function () {
        return t._top - t._bottom
      })
  }
  var Kt = {
    queue: qt,
    depth: function es(t, e, i) {
      if ('object' == typeof t && t[e] && t[e].length > 0) {
        for (var n = t[e].length; --n > -1; ) es(t[e][n], e, i)
      }
      t !== undefined && i(t)
    },
    breathe: function (t, e, i) {
      var n = new qt(),
        o = null
      for (n.add(t), o = n.remove(); o; ) {
        for (var r = 0; r < o[e].length; r++) n.add(o[e][r])
        i(o), (o = n.remove())
      }
    },
  }
  function Yt() {
    ;(this.children = []), (this._events = [])
  }
  ;(Yt.prototype.initComponent = function (t, e) {
    var i = new t(e)
    return (i._parent = this), this.children.push(i), i
  }),
    (Yt.prototype.destroy = function () {
      var t = this
      try {
        Kt.depth(this, 'children', function (e) {
          if (t !== e) {
            for (var i = t.children.length; --i > -1; ) {
              t.children[i] === e && t.children.splice(i, 1)
            }
          }
          e._destroy && e._destroy(), (e = null)
        })
      } catch (ts) {
        throw new Error('Trouble destroying nodes: ' + ts)
      }
      return null
    }),
    (Yt.prototype._destroy = function () {
      this.onDestroy && this.onDestroy()
      for (var t = this._events.length || 0; --t > -1; ) this._events.splice(t, 1)
      ;(this.children = null),
        (this._destroy = null),
        (this._events = null),
        (this.destroy = null),
        (this.emit = null),
        (this.on = null),
        (this.off = null),
        (this.initComponent = null)
    }),
    (Yt.prototype.on = function (t, e) {
      for (var i = this._events.length, n = !1; --i > -1 && !1 === n; ) {
        this._events[i].event === t && (n = this._events[i])
      }
      !1 === n && ((n = { event: t, listeners: [] }), this._events.push(n)), n.listeners.push(e)
    }),
    (Yt.prototype.off = function (t, e) {
      for (var i = this._events.length; --i > -1; ) {
        if (this._events[i].event === t) {
          for (var n = this._events[i].listeners.length; --n > -1; ) {
            this._events[i].listeners[n] === e && this._events[i].listeners[n].splice(n, 1)
          }
          0 === this._events[i].listeners.length && this._events[i].splice(i, 1)
        }
      }
    }),
    (Yt.prototype.emit = function (t) {
      for (var e = Array.prototype.slice.call(arguments, 1), i = this._events.length; --i > -1; ) {
        if (this._events[i].event === t) {
          for (var n = this._events[i].listeners.length; --n > -1; ) {
            this._events[i].listeners[n].apply(this, e)
          }
        }
      }
    })
  var Gt = {
      eventName: function (t) {
        var e = t
        return (
          'down' === t || 'up' === t || 'move' === t || 'over' === t || 'out' === t
            ? (e =
                !tt.System.mobile || ('down' !== t && 'up' !== t && 'move' !== t)
                  ? 'mouse' + t
                  : 'down' === t
                  ? 'touchstart'
                  : 'up' === t
                  ? 'touchend'
                  : 'touchmove')
            : 'enter' === t && (e = 'keydown'),
          e
        )
      },
      actionName: function (t) {
        var e = t
        return (
          'touchstart' === e || 'mousedown' === e
            ? (e = 'down')
            : 'touchmove' === e || 'mousemove' === e
            ? (e = 'move')
            : 'touchend' === e || 'mouseup' === e
            ? (e = 'up')
            : 'mouseover' === e
            ? (e = 'over')
            : 'mouseout' === e && (e = 'out'),
          e
        )
      },
      eventCallback: function (t, e, i) {
        var n = Gt.actionName(t)
        return function (o) {
          if (
            ((o = o || window.event),
            'down' === n ||
              'move' === n ||
              'up' === n ||
              'over' === n ||
              'out' === n ||
              'click' === n)
          ) {
            var r = Gt.eventCoords(o)
            if (!r) return
            var s = i.getBoundingClientRect()
            ;(o.windowX = r.x),
              (o.windowY = r.y),
              (o.elementX = o.windowX - (s.x || s.left)),
              (o.elementY = o.windowY - (s.y || s.top))
          }
          ;(o.keyNum = o.which || o.keyCode || 0),
            ('enter' === t && 13 !== o.keyNum && 32 !== o.keyNum) ||
              ((o.action = n), (o.targetElement = i), e(o))
        }
      },
      eventCoords: function (t) {
        if (!t) return null
        var e = t
        if (t.touches || t.changedTouches) {
          var i = t.touches && t.touches.length >= 1 ? t.touches : t.changedTouches
          i && i[0] && (e = i[0])
        }
        return 'number' == typeof e.pageX && 'number' == typeof e.pageY
          ? { x: e.pageX, y: e.pageY }
          : 'number' == typeof e.clientX && 'number' == typeof e.clientY
          ? { x: e.clientX, y: e.clientY }
          : null
      },
    },
    Jt = ['Webkit', 'Moz', 'ms'],
    Xt = document.createElement('div').style,
    Qt = {}
  function te(t) {
    var e = Qt[t]
    return (
      e ||
      (t in Xt
        ? t
        : (Qt[t] =
            (function (t) {
              for (var e = t[0].toUpperCase() + t.slice(1), i = Jt.length; i--; ) {
                if ((t = Jt[i] + e) in Xt) return t
              }
            })(t) || t))
    )
  }
  function ee(t, e, i) {
    if (
      ((this.dom = null),
      (this._clss = []),
      (this._nodes = []),
      (this._listeners = []),
      (this._frag = null),
      t && 'object' == typeof t)
    ) {
      this.dom = t
      var n = [],
        o = []
      'string' == typeof t.className && (o = t.className.split(' '))
      for (var r = 0; r < o.length; r++) '' !== o[r] && ' ' !== o[r] && n.push(o[r])
      this._clss = n
    } else {
      ;(i !== undefined && null !== i) || (i = !0),
        (!t || ('string' == typeof t && (t.indexOf('#') >= 0 || t.indexOf('.') >= 0))) &&
          (t && (e = t), (t = 'div')),
        (this.dom = document.createElement(t)),
        e &&
          (e.indexOf('#') >= 0
            ? (this.dom.id = e.split('#')[1])
            : (e.indexOf('.') >= 0 && (e = e.split('.')[1]), this.addClass.call(this, e)))
    }
    !0 === i && ((this._frag = document.createDocumentFragment()), this._frag.appendChild(this.dom))
  }
  ;(ee.prototype.cloneNode = function (t) {
    try {
      return this.dom.cloneNode(t)
    } catch (ts) {
      return At('element', ts), null
    }
  }),
    (ee.prototype.createElement = function (t, e) {
      try {
        var i = new ee(t, e, !1)
        return this.appendElement.call(this, i), this._nodes.push(i), i
      } catch (ts) {
        return At('element', ts), null
      }
    }),
    (ee.prototype.appendElement = function (t) {
      if (t === undefined) {
        return kt({ name: 'DomElement Add Child', message: 'Child Element is undefined' })
      }
      var e
      e = t._frag !== undefined && null !== t._frag ? t._frag : t.dom !== undefined ? t.dom : t
      try {
        t instanceof ee && (t._parent = this), this.dom.appendChild(e)
      } catch (ts) {
        kt({ name: 'DomElement Add Child', message: 'Failed to append child.' })
      }
      return this
    }),
    (ee.prototype.removeElement = function (t) {
      try {
        var e
        if (t._nodes) for (e = t._nodes.length; e--; ) t.removeElement(t._nodes[e])
        for (e = this._nodes.length; --e > -1; ) this._nodes[e] === t && this._nodes.splice(e, 1)
        var i = t instanceof ee ? t.dom : t,
          n = i.parentNode === this.dom ? this.dom : i.parentNode
        if ((n.removeChild && n.removeChild(i), !n)) {
          throw new Error('Child component does not have correct setup')
        }
        t.__destroy && t.__destroy()
      } catch (ts) {
        kt({ name: 'DomElement Remove Child', message: ts.message || 'Failed to remove child.' })
      }
    }),
    (ee.prototype.addClass = function (t) {
      return (
        !1 === this.hasClass.call(this, t) &&
          (this._clss.push(t), (this.dom.className = this._clss.join(' '))),
        this
      )
    }),
    (ee.prototype.hasClass = function (t) {
      for (
        var e = -1 !== this.dom.className.split(' ').indexOf(t), i = this._clss.length;
        i-- && !e;

      ) {
        e = this._clss[i] === t
      }
      return e
    }),
    (ee.prototype.removeClass = function (t) {
      for (var e = this._clss.length; --e > -1; ) this._clss[e] === t && this._clss.splice(e, 1)
      return (this.dom.className = this._clss.join(' ')), this
    }),
    (ee.prototype.text = function (t) {
      if (this && this.dom) {
        if (!t) return this.dom.textContent
        for (var e, i, n, o, r = /&(.*?);/g, s = /<[a-z][\s\S]*>/i; null !== (e = r.exec(t)); ) {
          !1 === s.test(e[0])
            ? ((n = e[0]),
              (o = void 0),
              ((o = document.createElement('div')).innerHTML = n),
              (i = o.textContent),
              (t = t.replace(new RegExp(e[0], 'g'), i)))
            : (t = t.replace(e[0], ''))
        }
        return (this.dom.textContent = t), this
      }
    }),
    (ee.prototype.content = ee.prototype.text),
    (ee.prototype.css = function (t) {
      var e,
        i = 'ie' === tt.Browser.type && 8 === tt.Browser.version,
        n = 'safari' === tt.Browser.type && 12 === Math.floor(tt.Browser.version)
      for (var o in t) {
        e = t[o]
        try {
          if ('transition' === o && n) continue
          'opacity' !== o &&
            'zIndex' !== o &&
            'fontWeight' !== o &&
            isFinite(e) &&
            parseFloat(e) === e &&
            (e += 'px')
          var r = te(o)
          i && 'opacity' === o
            ? (this.dom.style.filter = 'alpha(opacity=' + 100 * e + ')')
            : i && Tt.hasAlpha(e)
            ? (this.dom.style[r] = new Tt(e).getHex())
            : (this.dom.style[r] = e)
        } catch (Qr) {}
      }
      return this
    }),
    (ee.prototype.backgroundImage = function (t, e, i, n) {
      var o = e !== undefined && i !== undefined,
        r = { '-ms-high-contrast-adjust': 'none' }
      if (('object' == typeof e && (n = e), n === undefined && (n = {}), o)) {
        var s = t.width / t.height,
          a = e,
          c = a / s
        n.cover && c < i && (a = (c = i) * s),
          n.contain && c > i && (a = (c = i) * s),
          (r.width = a),
          (r.height = c),
          n.center &&
            ((r.marginLeft = -a / 2),
            (r.marginTop = -c / 2),
            (r.position = 'absolute'),
            (r.left = '50%'),
            (r.top = '50%')),
          (n.left || n.right) && ((r.left = n.left || 0), (r.top = n.top || 0))
      }
      'ie' === tt.Browser.type && 8 === tt.Browser.version
        ? (r.filter =
            "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" +
            t.src +
            "',sizingMethod='scale')")
        : ((r.background = 'url(' + t.src + ')'),
          (r.backgroundPosition = '50% 50%'),
          (r.backgroundRepeat = 'no-repeat'),
          (r.backgroundSize = o
            ? a + 'px ' + c + 'px'
            : n.cover
            ? 'cover'
            : n.contain
            ? 'contain'
            : '100%')),
        this.css.call(this, r)
    }),
    (ee.prototype.setAttribute = function (t, e) {
      var i
      if ('object' == typeof t) for (var n in t) (i = t[n]), this.dom.setAttribute(n, i)
      else this.dom.setAttribute(t, e)
    }),
    (ee.prototype.removeAttribute = function (t, e) {
      var i
      if ('object' == typeof t) for (var n in t) (i = t[n]), this.dom.removeAttribute(n, i)
      else this.dom.removeAttribute(t, e)
    }),
    (ee.prototype.addEventListener = function (t, e, i) {
      var n = { event: Gt.eventName(t), handler: Gt.eventCallback(t, e, this.dom), callback: e }
      this._listeners.push(n),
        this.dom.addEventListener
          ? this.dom.addEventListener(n.event, n.handler, i)
          : this.dom.attachEvent('on' + n.event, n.handler)
    }),
    (ee.prototype.removeEventListener = function (t, e, i) {
      for (var n, o = this._listeners.length; --o > -1; ) {
        ;(n = this._listeners[o]).event === t &&
          n.callback === e &&
          (this._listeners.splice(o, 1),
          this.dom.removeEventListener
            ? this.dom.removeEventListener(n.event, n.handler, i)
            : this.dom.detachEvent('on' + n.event, n.handler))
      }
    }),
    (ee.prototype.focus = function () {
      this.dom.focus()
    }),
    (ee.prototype.blur = function () {
      this.dom.blur()
    }),
    (ee.prototype.html = function (t) {
      return t && (this.dom.innerHTML = t), this.dom.innerHTML
    }),
    (ee.prototype.__destroy = function () {
      for (var t, e = this._listeners.length; --e > -1; ) {
        ;(t = this._listeners[e]),
          this._listeners.splice(e, 1),
          this.dom.removeEventListener
            ? this.dom.removeEventListener(t.event, t.handler)
            : this.dom.detachEvent('on' + t.event, t.handler)
      }
      return (
        (this.dom = null),
        (this._clss = []),
        (this._nodes = []),
        (this._listeners = []),
        (this._frag = null),
        (t = null),
        null
      )
    }),
    (ee.prototype.isConnected = function () {
      return (
        !!this.dom &&
        ('isConnected' in this.dom
          ? this.dom.isConnected
          : !(
              this.dom.ownerDocument &&
              this.dom.ownerDocument.compareDocumentPosition(this.dom) &
                this.dom.DOCUMENT_POSITION_DISCONNECTED
            ))
      )
    })
  var ie = {
    self: function (t, e) {
      var i = {},
        n = Array.prototype.slice.call(arguments, 2)
      for (var o in (e.apply(t, n), t)) i[o] = t[o]
    },
    proto: function (t, e) {
      ;(t.prototype = Object.create(e.prototype)), (t.prototype.constructor = t)
    },
  }
  function ne(t, e) {
    ie.self(this, ee, e || 'div', t), (this.children = []), (this._events = [])
  }
  function oe(t) {
    if (null === t) return ''
    var e = []
    return re(t, e), e.join('&')
  }
  function re(t, e) {
    var i, n
    if ('object' == typeof t) {
      for (n in t) !0 === se((i = t[n])) ? re(i, e) : (e[e.length] = ae(n, i))
    } else if (!0 === Array.isArray(t)) {
      for (var o = 0; o < t.length; o++) !0 === se((i = t[o])) ? re(t, e) : (e[e.length] = ae(n, i))
    } else e[e.length] = ae(t)
  }
  function se(t) {
    return !0 === Array.isArray(t) || 'object' == typeof t
  }
  function ae(t, e) {
    return encodeURIComponent(t) + '=' + encodeURIComponent(null === e ? '' : e)
  }
  ie.proto(ne, ee),
    (ne.prototype.initComponent = function (t, e, i) {
      try {
        var n = new t(e)
        return (
          (n._parent = this),
          this.children.push(n),
          n.dom &&
            (i !== undefined ? i.appendElement && i.appendElement(n) : this.appendElement(n)),
          n
        )
      } catch (ts) {
        return At('component', ts), null
      }
    }),
    (ne.prototype.removeComponent = function (t) {
      for (var e = this.children.length; --e > -1; ) {
        if (this.children[e] === t) {
          this.children.splice(e, 1)
          break
        }
      }
      t._destroy && t._destroy(), (t = null)
    }),
    (ne.prototype.removeAllComponents = function () {
      for (var t = this.children.length; --t > -1; ) {
        this.children[t]._destroy && this.children[t]._destroy()
      }
      this.children = []
    }),
    (ne.prototype.destroy = function () {
      var t = this
      try {
        Kt.depth(this, 'children', function (e) {
          if (t !== e) {
            for (var i = t.children.length; --i > -1; ) {
              t.children[i] === e && t.children.splice(i, 1)
            }
          }
          e._destroy && e._destroy(), (e = null)
        })
      } catch (ts) {
        throw new Error('Trouble destroying nodes: ' + ts)
      }
      return null
    }),
    (ne.prototype._destroy = function () {
      try {
        this.onDestroy && this.onDestroy(),
          this._parent.removeElement && this._parent.removeElement(this)
        for (var t = this._events.length; --t > -1; ) this._events.splice(t, 1)
        ;(this.children = null),
          (this._destroy = null),
          (this._events = null),
          (this.destroy = null),
          (this.emit = null),
          (this.on = null),
          (this.off = null),
          (this.initComponent = null)
      } catch (ts) {
        kt({ name: 'DomComponent', message: 'Failed to destroy.' })
      }
    }),
    (ne.prototype.on = function (t, e) {
      for (var i = this._events.length, n = !1; --i > -1 && !1 === n; ) {
        this._events[i].event === t && (n = this._events[i])
      }
      !1 === n && ((n = { event: t, listeners: [] }), this._events.push(n)), n.listeners.push(e)
    }),
    (ne.prototype.off = function (t, e) {
      for (var i = this._events.length; --i > -1; ) {
        if (this._events[i].event === t) {
          for (var n = this._events[i].listeners.length; --n > -1; ) {
            this._events[i].listeners[n] === e && this._events[i].listeners.splice(n, 1)
          }
          0 === this._events[i].listeners.length && this._events.splice(i, 1)
        }
      }
    }),
    (ne.prototype.emit = function (t) {
      for (
        var e = Array.prototype.slice.call(arguments, 1), i = this._events.length;
        --i > -1 && this._events;

      ) {
        if (this._events[i].event === t) {
          for (var n = this._events[i].listeners.length; --n > -1; ) {
            this._events[i].listeners[n].apply(this, e)
          }
        }
      }
    })
  var ce = {
      af: 'Afrikaans',
      sq: 'Albanian',
      am: 'Amharic',
      ar: 'Arabic',
      hy: 'Armenian',
      az: 'Azerbaijani',
      eu: 'Basque',
      be: 'Belarusian',
      bn: 'Bengali',
      bg: 'Bulgarian',
      bs: 'Bosnian',
      my: 'Burmese',
      ca: 'Catalan',
      ceb: 'Cebuano',
      zh: 'Chinese',
      'zh-CN': 'Chinese Simplified',
      'zh-TW': 'Chinese Traditional',
      co: 'Corsican',
      hr: 'Croatian',
      cs: 'Czech',
      da: 'Danish',
      nl: 'Dutch',
      en: 'English',
      eo: 'Esperanto',
      et: 'Estonian',
      fi: 'Finnish',
      fr: 'French',
      fy: 'Frisian',
      gd: 'Gaelic',
      gl: 'Galacian',
      ka: 'Georgian',
      de: 'German',
      el: 'Greek',
      gu: 'Gujurati',
      ht: 'Haitian',
      ha: 'Hausa',
      haw: 'Hawaiian',
      he: 'Hebrew',
      hi: 'Hindi',
      hmn: 'Hmong',
      hu: 'Hungarian',
      is: 'Icelandic',
      ig: 'Igbo',
      id: 'Indonesian',
      ga: 'Irish',
      it: 'Italian',
      ja: 'Japanese',
      jw: 'Javanese',
      kn: 'Kannada',
      kk: 'Kazakh',
      km: 'Khmer',
      rw: 'Kinyarwanda',
      ky: 'Kirghiz',
      ko: 'Korean',
      ku: 'Kurdish',
      lo: 'Lao',
      la: 'Latin',
      lv: 'Latvian',
      lt: 'Lithuanian',
      lb: 'Luxembourgish',
      mk: 'Macedonian',
      mg: 'Malagasy',
      ms: 'Malay',
      ml: 'Malayalam',
      mt: 'Maltese',
      mi: 'Maori',
      mr: 'Marathi',
      mn: 'Mongolian',
      ne: 'Nepali',
      no: 'Norwegian',
      ny: 'Nyanja',
      or: 'Oriya',
      fa: 'Persian',
      pl: 'Polish',
      'pt-BR': 'Portuguese (Brazil)',
      pt: 'Portuguese (Portugal)',
      ps: 'Pashto',
      pa: 'Punjabi',
      ro: 'Romanian',
      ru: 'Russian',
      sm: 'Samoan',
      sn: 'Shona',
      sd: 'Sindhi',
      si: 'Singhalese',
      sr: 'Serbian',
      sk: 'Slovak',
      sl: 'Slovenian',
      so: 'Somani',
      st: 'Southern Sotho',
      es: 'Spanish',
      su: 'Sundanese',
      sw: 'Swahili',
      sv: 'Swedish',
      tl: 'Tagalog',
      tg: 'Tajik',
      ta: 'Tamil',
      tt: 'Tatar',
      te: 'Teluga',
      th: 'Thai',
      tr: 'Turkish',
      tk: 'Turkmen',
      ug: 'Uyghur',
      uk: 'Ukrainian',
      ur: 'Urdu',
      uz: 'Uzbek',
      vi: 'Vietnamese',
      cy: 'Welsh',
      xh: 'Xhosa',
      yi: 'Yiddish',
      yo: 'Yoruba',
      zu: 'Zulu',
    },
    le = {
      zh: { 'I am human': 'æˆ‘æ˜¯äºº' },
      ar: { 'I am human': 'Ø£Ù†Ø§ Ø§Ù„Ø¥Ù†Ø³Ø§Ù†' },
      af: { 'I am human': 'Ek is menslike' },
      am: { 'I am human': 'áŠ¥áŠ” áˆ°á‹ áŠáŠ' },
      hy: { 'I am human': 'ÔµÕ½ Õ´Õ¡Ö€Õ¤ Õ¥Õ´' },
      az: { 'I am human': 'MÉ™n insanam' },
      eu: { 'I am human': 'Gizakia naiz' },
      bn: { 'I am human': 'à¦†à¦®à¦¿ à¦®à¦¾à¦¨à¦¬ à¦¨à¦‡' },
      bg: { 'I am human': 'ÐÐ· ÑÑŠÐ¼ Ñ‡Ð¾Ð²ÐµÐº' },
      ca: { 'I am human': 'SÃ³c humÃ ' },
      hr: { 'I am human': 'Ja sam Äovjek' },
      cs: { 'I am human': 'Jsem ÄlovÄ›k' },
      da: { 'I am human': 'Jeg er et menneske' },
      nl: { 'I am human': 'Ik ben een mens' },
      et: { 'I am human': 'Ma olen inimeste' },
      fi: { 'I am human': 'Olen ihminen' },
      fr: { 'I am human': 'Je suis humain' },
      gl: { 'I am human': 'Eu son humano' },
      ka: { 'I am human': 'áƒ›áƒ” áƒ•áƒáƒ  áƒáƒ“áƒáƒ›áƒ˜áƒáƒœáƒ˜' },
      de: { 'I am human': 'Ich bin ein Mensch' },
      el: { 'I am human': 'Î•Î¯Î¼Î±Î¹ Î¬Î½Î¸ÏÏ‰Ï€Î¿Ï‚' },
      gu: { 'I am human': 'àª¹à«àª‚ àª®àª¾àª¨àªµ àª›à«àª‚' },
      iw: { 'I am human': '. ×× ×™ ×× ×•×©×™' },
      hi: { 'I am human': 'à¤®à¥ˆà¤‚ à¤®à¤¾à¤¨à¤µ à¤¹à¥‚à¤‚' },
      hu: { 'I am human': 'Nem vagyok robot' },
      is: { 'I am human': 'Ã‰g er manneskja' },
      id: { 'I am human': 'Aku manusia' },
      it: { 'I am human': 'Sono un essere umano' },
      ja: { 'I am human': 'ç§ã¯äººé–“ã§ã™' },
      kn: { 'I am human': 'à²¨à²¾à²¨à³ à²®à²¾à²¨à²µà²¨à³' },
      ko: { 'I am human': 'ì‚¬ëžŒìž…ë‹ˆë‹¤' },
      lo: { 'I am human': 'àº‚à»‰àº­àºà»€àº›àº±àº™àº¡àº°àº™àº¸àº”' },
      lv: { 'I am human': 'Es esmu cilvÄ“ks' },
      lt: { 'I am human': 'AÅ¡ esu Å¾mogaus' },
      ms: { 'I am human': 'Saya manusia' },
      ml: { 'I am human': 'à´žà´¾àµ» à´®à´¨àµà´·àµà´¯à´¨à´¾à´£àµ' },
      mr: { 'I am human': 'à¤®à¥€ à¤®à¤¾à¤¨à¤µà¥€ à¤†à¤¹à¥‡' },
      mn: { 'I am human': 'Ð‘Ð¸ Ð±Ð¾Ð» Ñ…Ò¯Ð½' },
      no: { 'I am human': 'Jeg er menneskelig' },
      fa: { 'I am human': 'Ù…Ù† Ø§Ù†Ø³Ø§Ù†ÛŒ Ù‡Ø³ØªÙ…' },
      pl: { 'I am human': 'Jestem czÅ‚owiekiem' },
      pt: { 'I am human': 'Sou humano' },
      ro: { 'I am human': 'Eu sunt om' },
      ru: { 'I am human': 'Ð¯ Ñ‡ÐµÐ»Ð¾Ð²ÐµÐº' },
      sr: { 'I am human': 'Ja sam ljudski' },
      si: { 'I am human': 'à¶¸à¶¸ à¶¸à·’à¶±à·’à·ƒà·Šà·ƒà·”' },
      sk: { 'I am human': 'Ja som Älovek' },
      sl: { 'I am human': 'Jaz sem ÄloveÅ¡ki' },
      es: { 'I am human': 'Soy humano' },
      sw: { 'I am human': 'Mimi ni binadamu' },
      sv: { 'I am human': 'Jag Ã¤r mÃ¤nniska' },
      ta: { 'I am human': 'à®¨à®¾à®©à¯ à®®à®©à®¿à®¤' },
      te: { 'I am human': 'à°¨à±‡à°¨à± à°®à°¨à°¿à°·à°¿à°¨à°¿' },
      th: { 'I am human': 'à¸œà¸¡à¸¡à¸™à¸¸à¸©à¸¢à¹Œ' },
      tr: { 'I am human': 'Ben bir insanÄ±m' },
      uk: { 'I am human': 'Ð¯ Ð»ÑŽÐ´Ð¸Ð½Ð¸' },
      ur: { 'I am human': 'Ù…ÛŒÚº Ø§Ù†Ø³Ø§Ù† ÛÙˆÚº' },
      vi: { 'I am human': 'TÃ´i lÃ  con ngÆ°á»i' },
      zu: { 'I am human': 'Ngingumuntu' },
    },
    he = null,
    ue = {
      translate: function (t, e) {
        var i = ue.getBestTrans(le),
          n = i && i[t]
        if (((n = n || t), e)) {
          for (var o = Object.keys(e), r = o.length; r--; ) {
            n = n.replace(new RegExp('{{' + o[r] + '}}', 'g'), e[o[r]])
          }
        }
        return n
      },
      getBestTrans: function (t) {
        var e = ue.getLocale()
        return e in t
          ? t[e]
          : ue.getShortLocale(e) in t
          ? t[ue.getShortLocale(e)]
          : 'en' in t
          ? t.en
          : null
      },
      resolveLocale: function (t) {
        var e = ue.getShortLocale(t)
        return (
          'in' === e && (t = 'id'),
          'iw' === e && (t = 'he'),
          'nb' === e && (t = 'no'),
          'ji' === e && (t = 'yi'),
          'zh-CN' === t && (t = 'zh'),
          'jv' === e && (t = 'jw'),
          ce[t] ? t : ce[e] ? e : 'en'
        )
      },
      getLocale: function () {
        return ue.resolveLocale(he || window.navigator.userLanguage || window.navigator.language)
      },
      setLocale: function (t) {
        'zh-Hans' === t ? (t = 'zh-CN') : 'zh-Hant' === t && (t = 'zh-TW'), (he = t)
      },
      getShortLocale: function (t) {
        return t.indexOf('-') >= 0 ? t.substring(0, t.indexOf('-')) : t
      },
      isShortLocale: function (t) {
        return 2 === t.length || 3 === t.length
      },
      addTable: function (t, e) {
        if ((e || (e = Object.create(null)), le[t])) {
          var i = le[t]
          for (var n in e) i[n] = e[n]
        } else le[t] = e
        return le[t]
      },
      getTable: function (t) {
        return le[t]
      },
      addTables: function (t) {
        for (var e in t) ue.addTable(e, t[e])
        return le
      },
      getTables: function () {
        return le
      },
    },
    fe = {
      400: 'Rate limited or network error. Please retry.',
      429: 'Your computer or network has sent too many requests.',
      500: 'Cannot contact hCaptcha. Check your connection and try again.',
    },
    de = function (t) {
      try {
        return ue.translate(fe[t])
      } catch (ts) {
        return !1
      }
    },
    pe = 'undefined' != typeof XDomainRequest && !('withCredentials' in XMLHttpRequest.prototype)
  function me(t, e, i) {
    i = i || {}
    var n = {
      url: e,
      method: t.toUpperCase(),
      responseType: i.responseType || 'string',
      dataType: i.dataType || null,
      withCredentials: i.withCredentials || !1,
      headers: i.headers || null,
      data: i.data || null,
      timeout: i.timeout || null,
      pst: i.pst || null,
    }
    n.legacy = n.withCredentials && pe
    var o = 'fetch' in window && n.pst ? ge : ye
    return i.retry
      ? Wt(function () {
          return (
            i.data &&
              ((n.data = 'function' == typeof i.data ? i.data() : i.data),
              'json' === n.dataType && 'object' == typeof n.data
                ? (n.data = JSON.stringify(n.data))
                : 'query' === n.dataType && (n.data = oe(n.data))),
            o(n)
          )
        }, i.retry)
      : (i.data &&
          ((n.data = 'function' == typeof i.data ? i.data() : i.data),
          'json' === n.dataType && 'object' == typeof n.data
            ? (n.data = JSON.stringify(n.data))
            : 'query' === n.dataType && (n.data = oe(n.data))),
        o(n))
  }
  function ye(t) {
    var e = t.legacy ? new XDomainRequest() : new XMLHttpRequest(),
      i = 'function' == typeof t.url ? t.url() : t.url
    return new Promise(function (n, o) {
      var r,
        s = function (r) {
          return function () {
            var s = e.response,
              a = e.statusText || '',
              c = e.status,
              l = e.readyState
            if (
              (s || ('' !== e.responseType && 'text' !== e.responseType) || (s = e.responseText),
              4 === l || t.legacy)
            ) {
              try {
                if (s) {
                  var h = e.contentType
                  if (
                    (e.getResponseHeader && (h = e.getResponseHeader('content-type')),
                    'ArrayBuffer' in window &&
                      s instanceof ArrayBuffer &&
                      h &&
                      -1 !== h.toLowerCase().indexOf('application/json') &&
                      (s = new TextDecoder().decode(new Uint8Array(s))),
                    'string' == typeof s)
                  ) {
                    try {
                      s = JSON.parse(s)
                    } catch (u) {
                      At('http', u, {
                        url: i,
                        config: t,
                        responseType: e.responseType,
                        contentType: h,
                        response: s,
                      })
                    }
                  }
                }
              } catch (u) {
                return (
                  At('http', u, { contentType: h }),
                  void o({
                    event: it.NETWORK_ERROR,
                    endpoint: i,
                    response: s,
                    state: l,
                    status: c,
                    message: de(c || 400) || a,
                  })
                )
              }
              if ('error' === r || (c >= 400 && c <= 511)) {
                return void o({
                  event: it.NETWORK_ERROR,
                  endpoint: i,
                  response: s,
                  state: l,
                  status: c,
                  message: de(c || 400) || a,
                })
              }
              n({ state: l, status: c, body: s, message: a })
            }
          }
        }
      if (
        ((e.onload = s('complete')),
        (e.onerror = e.ontimeout = s('error')),
        e.open(t.method, i),
        'arraybuffer' === t.responseType &&
          (!t.legacy && 'TextDecoder' in window && 'ArrayBuffer' in window
            ? (e.responseType = 'arraybuffer')
            : ((t.responseType = 'json'), (t.headers.accept = 'application/json'))),
        t.timeout && (e.timeout = 'function' == typeof t.timeout ? t.timeout(i) : t.timeout),
        !t.legacy) &&
        ((e.withCredentials = t.withCredentials), t.headers)
      ) {
        for (var a in t.headers) (r = t.headers[a]), e.setRequestHeader(a, r)
      }
      setTimeout(function () {
        e.send(t.data)
      }, 0)
    })
  }
  function ge(t) {
    var e,
      i = 'function' == typeof t.url ? t.url() : t.url,
      n = new Headers()
    if (('json' === t.responseType && n.set('content-type', 'application/json'), t.headers)) {
      for (var o in t.headers) (e = t.headers[o]), n.set(o, e)
    }
    var r = { method: t.method, credentials: 'include', body: t.data, headers: n }
    if (t.pst) {
      var s = {}
      'token-request' === t.pst
        ? (s = { version: 1, operation: 'token-request' })
        : 'token-redemption' === t.pst
        ? (s = { version: 1, operation: 'token-redemption', refreshPolicy: 'refresh' })
        : 'send-redemption-record' === t.pst &&
          (s = { version: 1, operation: 'send-redemption-record', issuers: [ft.pstIssuer] }),
        (r.privateToken = s)
    }
    return new Promise(function (e, n) {
      fetch(i, r)
        .then(function (o) {
          return 200 !== o.status
            ? n({
                event: it.NETWORK_ERROR,
                endpoint: i,
                response: o,
                state: 4,
                status: o.status,
                message: de(o.status || 400),
              })
            : ('arraybuffer' === t.responseType
                ? o.arrayBuffer()
                : 'json' === t.responseType
                ? o.json()
                : o.text()
              ).then(function (t) {
                e({ state: 4, status: o.status, body: t, message: de(o.status || 400) })
              })
        })
        ['catch'](function (t) {
          n({
            event: it.NETWORK_ERROR,
            endpoint: i,
            response: t.error,
            state: 4,
            status: 400,
            message: de(400),
          })
        })
    })
  }
  var ve = function (t, e) {
      if (('object' == typeof t && e === undefined && (t = (e = t).url), null === t)) {
        throw new Error('Url missing')
      }
      return me('GET', t, e)
    },
    be = function (t, e) {
      if (('object' == typeof t && e === undefined && (t = (e = t).url), null === t)) {
        throw new Error('Url missing')
      }
      return me('POST', t, e)
    },
    we = ['svg', 'gif', 'png']
  function xe(t, e) {
    e = e || {}
    var i,
      n = t
    if (0 === n.indexOf('data:image')) {
      for (var o = !1, r = we.length, s = -1; s++ < r && !o; ) {
        ;(o = n.indexOf(we[s]) >= 0) && (i = we[s])
      }
    } else i = n.substr(n.lastIndexOf('.') + 1, n.length)
    !!(
      !document.createElementNS ||
      !document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect
    ) &&
      e.fallback &&
      (e.fallback.indexOf('.') >= 0
        ? (i = (n = e.fallback).substr(n.lastIndexOf('.') + 1, n.length))
        : ((n = t.substr(0, t.indexOf(i)) + e.fallback), (i = e.fallback))),
      e.prefix && (n = e.prefix + '/' + n),
      (this.attribs = { crossOrigin: e.crossOrigin || null }),
      (this.id = n),
      (this.src = (function (t) {
        if (ft.assethost && 0 === t.indexOf(ht.assetDomain)) {
          return ft.assethost + t.replace(ht.assetDomain, '')
        }
        if (ft.imghost && t.indexOf('imgs') >= 0) {
          var e = t.indexOf('.ai') >= 0 ? t.indexOf('.ai') + 3 : t.indexOf('.com') + 4
          return ft.imghost + t.substr(e, t.length)
        }
        return t
      })(n)),
      (this.ext = i),
      (this.width = 0),
      (this.height = 0),
      (this.aspect = 0),
      (this.loaded = !1),
      (this.error = !1),
      (this.element = null),
      (this.cb = { load: [], error: [] })
  }
  function ke(t, e, i) {
    for (var n = t[e], o = n.length, r = null; --o > -1; ) (r = n[o]), n.splice(o, 1), r(i)
    'error' === e ? (t.load = []) : (t.error = [])
  }
  function Ce(t, e) {
    var i = t
    e || (e = {}),
      e.prefix && (i = e.prefix + '/' + t),
      (this.attribs = {
        defer: e.defer || null,
        async: e.async || null,
        crossOrigin: e.crossOrigin || null,
        integrity: e.integrity || null,
      }),
      (this.id = i),
      (this.src = (function (t) {
        return ft.assethost && 0 === t.indexOf(ht.assetDomain)
          ? ft.assethost + t.replace(ht.assetDomain, '')
          : t
      })(i)),
      (this.loaded = !1),
      (this.error = !1),
      (this.element = null),
      (this.cb = { load: [], error: [] })
  }
  function _e(t, e, i) {
    for (var n = t[e], o = n.length, r = null; --o > -1; ) (r = n[o]), n.splice(o, 1), r(i)
    'error' === e ? (t.load = []) : (t.error = [])
  }
  function Ee(t, e) {
    var i = t
    e || (e = {}),
      e.prefix && (i = e.prefix + '/' + t),
      (this.responseType = e.responseType),
      (this.id = i),
      (this.src = (function (t) {
        return ft.assethost && 0 === t.indexOf(ht.assetDomain)
          ? ft.assethost + t.replace(ht.assetDomain, '')
          : t
      })(i)),
      (this.loaded = !1),
      (this.error = !1),
      (this.cb = { load: [], error: [] }),
      (this.data = null)
  }
  function Ae(t, e, i) {
    for (var n = t[e], o = n.length, r = null; --o > -1; ) (r = n[o]), n.splice(o, 1), r(i)
    'error' === e ? (t.load = []) : (t.error = [])
  }
  ;(xe.prototype.load = function () {
    return ('svg' === this.ext ? this._loadSvg() : this._loadImg())['catch'](function (t) {
      throw (Et('Asset failed', 'error', 'assets', { error: t }), t)
    })
  }),
    (xe.prototype._loadSvg = function () {
      var t,
        e = this,
        i = this.src,
        n = this.id
      if (0 === i.indexOf('data:image/svg+xml')) {
        var o = i.slice('data:image/svg+xml,'.length)
        t = Promise.resolve(decodeURIComponent(o))
      } else {
        t = ve(i).then(function (t) {
          return t.body
        })
      }
      return t
        .then(function (t) {
          var i = new DOMParser().parseFromString(t, 'image/svg+xml').documentElement,
            n = parseInt(i.getAttribute('width')),
            o = parseInt(i.getAttribute('height'))
          return e._imgLoaded(i, n, o), e
        })
        ['catch'](function (t) {
          e.error = !0
          var i = (t && t.message ? t.message : t || 'Loading Error') + ': ' + n
          throw (ke(e.cb, 'error', i), i)
        })
    }),
    (xe.prototype._loadImg = function () {
      var t = this,
        e = this.attribs,
        i = this.src,
        n = this.id
      return new Promise(function (o, r) {
        function s() {
          t.loaded || (t._imgLoaded(a, a.width, a.height), (a.onload = a.onerror = null), o(t))
        }
        var a = new Image()
        e.crossOrigin && (a.crossOrigin = e.crossOrigin),
          (a.onerror = function () {
            ;(t.error = !0), (a.onload = a.onerror = null)
            var e = 'Loading Error: ' + n
            ke(t.cb, 'error', e), r(e)
          }),
          (a.onload = s),
          (a.src = i),
          a.complete && s()
      })
    }),
    (xe.prototype._imgLoaded = function (t, e, i) {
      ;(this.element = new ee(t)),
        (this.width = e),
        (this.height = i),
        (this.aspect = e / i),
        (this.loaded = !0),
        ke(this.cb, 'load', this)
    }),
    (xe.prototype.onload = function (t) {
      this.error || (this.loaded ? t(this) : this.cb.load.push(t))
    }),
    (xe.prototype.onerror = function (t) {
      ;(this.loaded && !this.error) || (this.error ? t(this) : this.cb.error.push(t))
    }),
    (Ce.prototype.load = function () {
      var t = this,
        e = this.attribs,
        i = this.src,
        n = this.id
      return new Promise(function (o, r) {
        var s = document.createElement('script')
        ;(t.element = s),
          (s.onerror = function () {
            ;(t.error = !0), (s.onload = s.onreadystatechange = s.onerror = null)
            var e = 'Loading Error: ' + n
            _e(t.cb, 'error', e), r(e)
          }),
          (s.onload = s.onreadystatechange =
            function () {
              this.loaded ||
                (s.readyState && 'loaded' !== s.readyState && 'complete' !== s.readyState) ||
                ((t.loaded = !0),
                (s.onload = s.onreadystatechange = s.onerror = null),
                document.body.removeChild(s),
                _e(t.cb, 'load', t),
                o(t))
            }),
          (s.type = 'text/javascript'),
          (s.src = i),
          e.crossOrigin && (s.crossorigin = e.crossOrigin),
          e.async && (s.async = !0),
          e.defer && (s.defer = !0),
          e.integrity && (s.integrity = e.integrity),
          document.body.appendChild(s),
          s.complete && s.onload()
      })
    }),
    (Ce.prototype.onload = function (t) {
      this.error || (this.loaded ? t(this) : this.cb.load.push(t))
    }),
    (Ce.prototype.onerror = function (t) {
      ;(this.loaded && !this.error) || (this.error ? t(this) : this.cb.error.push(t))
    }),
    (Ee.prototype.load = function () {
      var t = this,
        e = this.src,
        i = this.id
      return new Promise(function (n, o) {
        var r = {}
        'arraybuffer' === t.responseType
          ? (r.responseType = 'arraybuffer')
          : e.indexOf('json') >= 0 && (r.responseType = 'json'),
          ve(e, r)
            .then(function (e) {
              ;(t.loaded = !0), (t.data = e.body), Ae(t.cb, 'load', t), n(t)
            })
            ['catch'](function (e) {
              t.error = !0
              var n = (e && e.message ? e.message : 'Loading Error') + ': ' + i
              Ae(t.cb, 'error', n), o(n)
            })
      })
    }),
    (Ee.prototype.onload = function (t) {
      this.error || (this.loaded ? t(this) : this.cb.load.push(t))
    }),
    (Ee.prototype.onerror = function (t) {
      ;(this.loaded && !this.error) || (this.error ? t(this) : this.cb.error.push(t))
    })
  var Se = [],
    Be = {
      image: function (t, e) {
        var i = new xe(t, e)
        return Se.push(i), i.load()
      },
      script: function (t, e) {
        var i = new Ce(t, e)
        return Se.push(i), i.load()
      },
      file: function (t, e) {
        var i = new Ee(t, e)
        return Se.push(i), i.load()
      },
      retrieve: function (t) {
        return new Promise(function (e, i) {
          for (var n = Se.length, o = !1, r = null; --n > -1 && !o; ) {
            o = (r = Se[n]).id === t || -1 !== r.id.indexOf('/' === t[0] ? '' : '/' + t)
          }
          if (!o) return e(null)
          r.onload(e), r.onerror(i)
        })
      },
    },
    Le = [],
    Te = !1,
    Oe = !1
  function He(t) {
    var e = Array.prototype.slice.call(arguments, 1)
    !0 !== Oe &&
    'interactive' !== document.readyState &&
    'loaded' !== document.readyState &&
    'complete' !== document.readyState
      ? (Le.push({ fn: t, args: e }), !1 === Te && Me())
      : setTimeout(function () {
          t(e)
        }, 1)
  }
  function Me() {
    document.addEventListener
      ? (document.addEventListener('DOMContentLoaded', Pe), window.addEventListener('load', Pe))
      : (document.attachEvent('onreadystatechange', Re), window.attachEvent('onload', Pe)),
      (Te = !0)
  }
  function Re() {
    ;('interactive' !== document.readyState &&
      'loaded' !== document.readyState &&
      'complete' !== document.readyState) ||
      Pe()
  }
  function Pe() {
    if (!1 === Oe) {
      for (var t = 0; t < Le.length; t++) Le[t].fn.apply(null, Le[t].args)
      Le = []
    }
    ;(Oe = !0),
      document.removeEventListener
        ? (document.removeEventListener('DOMContentLoaded', Pe),
          window.removeEventListener('load', Pe))
        : (document.detachEvent('onreadystatechange', Re), window.detachEvent('onload', Pe))
  }
  var Ie = new ee(document),
    Ve = new ee(window),
    De = {
      __proto__: null,
      Loader: Be,
      BaseComponent: Yt,
      DomComponent: ne,
      DomElement: ee,
      Extend: ie,
      Normalize: Gt,
      Dom: {
        __proto__: null,
        Window: Ve,
        Document: Ie,
        Element: ee,
        Ready: He,
        Find: function (t) {
          for (var e, i, n = null, o = !1, r = t.split(' '), s = 0; s < r.length; s++) {
            if (
              ((e = r[s]).indexOf('#') >= 0 && (n = document.getElementById(e.replace('#', ''))),
              e.indexOf('.') >= 0)
            ) {
              if ((null === n && (n = document), o)) {
                for (var a = [], c = 0; c < n.length; c++) {
                  i = n[c].getElementsByClassName(e.replace('.', ''))
                  for (var l = 0; l < i.length; l++) a.push(i[l])
                }
                ;(n = a), (a = [])
              } else (n = n.getElementsByClassName(e.replace('.', ''))), (o = !0)
            }
          }
          if (!0 === o) {
            if (1 === n.length) return n[0]
            for (var h = [], u = 0; u < n.length; u++) h.push(n[u])
            return h
          }
          return n
        },
      },
    }
  function Fe(t, e) {
    ;(this._period = t),
      (this._interval = e),
      (this._date = []),
      (this._data = []),
      (this._prevTimestamp = 0),
      (this._meanPeriod = 0),
      (this._meanCounter = 0)
  }
  ;(Fe.prototype.getMeanPeriod = function () {
    return this._meanPeriod
  }),
    (Fe.prototype.getData = function () {
      return this._cleanStaleData(), this._data
    }),
    (Fe.prototype.getSize = function () {
      return this._cleanStaleData(), this._data.length
    }),
    (Fe.prototype.getCapacity = function () {
      return 0 === this._period ? this._interval : Math.ceil(this._interval / this._period)
    }),
    (Fe.prototype.push = function (t, e) {
      this._cleanStaleData()
      var i = 0 === this._date.length
      if (
        (t - (this._date[this._date.length - 1] || 0) >= this._period &&
          (this._date.push(t), this._data.push(e)),
        !i)
      ) {
        var n = t - this._prevTimestamp
        ;(this._meanPeriod = (this._meanPeriod * this._meanCounter + n) / (this._meanCounter + 1)),
          this._meanCounter++
      }
      this._prevTimestamp = t
    }),
    (Fe.prototype._cleanStaleData = function () {
      for (var t = Date.now(), e = this._date.length - 1; e >= 0; e--) {
        if (t - this._date[e] >= this._interval) {
          this._date.splice(0, e + 1), this._data.splice(0, e + 1)
          break
        }
      }
    })
  var $e = { touchstart: 'ts', touchend: 'te', touchmove: 'tm', touchcancel: 'tc' },
    Ue = { mousedown: 'md', mouseup: 'mu', mousemove: 'mm' },
    je = { pointermove: 'pm' },
    Ne = { keydown: 'kd', keyup: 'ku' },
    ze = { devicemotion: 'dm' },
    Ze = function (t, e) {
      var i = Ue[t],
        n = null
      return function (t) {
        ;(n = (function (t) {
          return [t.windowX, t.windowY, Date.now()]
        })(t)),
          e(i, n)
      }
    },
    We = function (t, e) {
      var i = je[t],
        n = null
      return function (t) {
        n = (function (t) {
          var e = [],
            i = []
          t.getCoalescedEvents && (i = t.getCoalescedEvents())
          for (var n = 0; n < i.length; n++) {
            var o = i[n]
            e.push([o.x, o.y, Date.now()])
          }
          return e
        })(t)
        for (var o = 0; o < n.length; o++) e(i, n[o])
      }
    },
    qe = function (t, e) {
      var i = $e[t],
        n = null
      return function (t) {
        ;(n = (function (t) {
          var e = []
          try {
            var i, n
            if (
              (t.touches && t.touches.length >= 1
                ? (i = t.touches)
                : t.changedTouches && t.changedTouches.length >= 1 && (i = t.changedTouches),
              i)
            ) {
              for (var o = 0; o < i.length; o++) {
                ;(n = Gt.eventCoords(i[o])) && e.push([i[o].identifier, n.x, n.y])
              }
              e.push(Date.now())
            }
            return e
          } catch (ts) {
            return e
          }
        })(t)),
          e(i, n)
      }
    },
    Ke = function (t, e) {
      var i = Ne[t],
        n = null
      return function (t) {
        ;(n = (function (t) {
          return [t.keyNum, Date.now()]
        })(t)),
          e(i, n)
      }
    },
    Ye = function (t, e) {
      var i = ze[t],
        n = null,
        o = []
      return function (t) {
        ;(n = (function (t, e) {
          ;(t.acceleration === undefined || (t.acceleration && t.acceleration.x === undefined)) &&
            (t.acceleration = { x: 0, y: 0, z: 0 })
          ;(t.rotationRate === undefined ||
            (t.rotationRate && t.rotationRate.alpha === undefined)) &&
            (t.rotationRate = { alpha: 0, beta: 0, gamma: 0 })
          var i = [
              t.acceleration.x,
              t.acceleration.y,
              t.acceleration.z,
              t.rotationRate.alpha,
              t.rotationRate.beta,
              t.rotationRate.gamma,
              Date.now(),
            ],
            n = []
          if (0 === e.length) (e = i), (n = i)
          else {
            for (var o, r = 0, s = 0; s < 6; s++) {
              ;(o = e[s] - i[s]), n.push(i[s]), (r += Math.abs(o))
            }
            if ((n.push(Date.now()), (e = i), r <= 0)) return null
          }
          return { motion: n, prevmotion: e }
        })(t, o)),
          null !== n && ((o = n.prevmotion), (n = n.motion), e(i, n))
      }
    }
  function Ge() {
    ;(this._manifest = {}),
      (this.state = {
        timeBuffers: {},
        loadTime: Date.now(),
        recording: !1,
        initRecord: !1,
        record: { mouse: !0, touch: !0, keys: !1, motion: !1 },
      }),
      (this._recordEvent = this._recordEvent.bind(this))
  }
  ;(Ge.prototype.record = function (t, e, i, n) {
    if (
      ((this._manifest.st = Date.now()),
      (this.state.record.mouse = t === undefined ? this.state.record.mouse : t),
      (this.state.record.touch = i === undefined ? this.state.record.touch : i),
      (this.state.record.keys = e === undefined ? this.state.record.keys : e),
      (this.state.record.motion = n === undefined ? this.state.record.motion : n),
      !1 === this.state.initRecord)
    ) {
      var o = new ee(document.body)
      this.state.record.mouse &&
        (o.addEventListener('mousedown', Ze('mousedown', this._recordEvent), !0),
        o.addEventListener('mousemove', Ze('mousemove', this._recordEvent), !0),
        o.addEventListener('mouseup', Ze('mouseup', this._recordEvent), !0),
        o.addEventListener('pointermove', We('pointermove', this._recordEvent), !0)),
        !0 === this.state.record.keys &&
          (o.addEventListener('keyup', Ke('keyup', this._recordEvent), !0),
          o.addEventListener('keydown', Ke('keydown', this._recordEvent), !0)),
        this.state.record.touch &&
          !0 === tt.Browser.hasEvent('touchstart', document.body) &&
          (o.addEventListener('touchstart', qe('touchstart', this._recordEvent), !0),
          o.addEventListener('touchmove', qe('touchmove', this._recordEvent), !0),
          o.addEventListener('touchend', qe('touchend', this._recordEvent), !0)),
        this.state.record.motion &&
          !0 === tt.Browser.hasEvent('devicemotion', window) &&
          o.addEventListener('devicemotion', Ye('devicemotion', this._recordEvent), !0),
        (this.state.initRecord = !0)
    }
    this.state.recording = !0
  }),
    (Ge.prototype.stop = function () {
      this.state.recording = !1
    }),
    (Ge.prototype.time = function () {
      return this.state.loadTime
    }),
    (Ge.prototype.getData = function () {
      for (var t in this.state.timeBuffers) {
        ;(this._manifest[t] = this.state.timeBuffers[t].getData()),
          (this._manifest[t + '-mp'] = this.state.timeBuffers[t].getMeanPeriod())
      }
      return this._manifest
    }),
    (Ge.prototype.setData = function (t, e) {
      this._manifest[t] = e
    }),
    (Ge.prototype.resetData = function () {
      ;(this._manifest = {}), (this.state.timeBuffers = {})
    }),
    (Ge.prototype.circBuffPush = function (t, e) {
      this._recordEvent(t, e)
    }),
    (Ge.prototype._recordEvent = function (t, e) {
      if (!1 !== this.state.recording) {
        try {
          var i = e[e.length - 1]
          this.state.timeBuffers[t] || (this.state.timeBuffers[t] = new Fe(16, 15e3)),
            this.state.timeBuffers[t].push(i, e)
        } catch (Qr) {
          At('motion', Qr)
        }
      }
    })
  var Je = new Ge()
  function Xe(t) {
    ;(t = t || {}),
      (this.x = t.x || 0),
      (this.y = t.y || 0),
      (this.rotate = this.rotate.bind(this)),
      (this.getDistance = this.getDistance.bind(this)),
      (this.radius = 0),
      (this.tolerance = 0),
      (this.fill = !1),
      (this.stroke = !1),
      (this.fillColor = '#fff'),
      (this.strokeColor = '#fff'),
      (this.strokeWidth = 1)
  }
  function Qe(t, e, i) {
    ie.self(this, Xe, t),
      (this.handleIn = new Xe(e)),
      (this.handleOut = new Xe(i)),
      (this.prev = null),
      (this.next = null),
      (this.index = 0)
  }
  function ti(t) {
    ;(this._closed = !1),
      (this.stroke = !1),
      (this.fill = !1),
      (this.fillColor = '#fff'),
      (this.strokeColor = '#fff'),
      (this.strokeWidth = 1),
      (this.showPoints = !1),
      (this.pointRadius = 0),
      (this._head = null),
      (this._tail = null),
      (this.segments = []),
      (this.addPoint = this.addPoint.bind(this)),
      (this.removePoint = this.removePoint.bind(this)),
      (this.forEachPoint = this.forEachPoint.bind(this)),
      (this.getBounding = this.getBounding.bind(this)),
      (this.getCenter = this.getCenter.bind(this)),
      (this.destroy = this.destroy.bind(this)),
      t && t.length && this.addPoints(t)
  }
  function ei(t, e) {
    if (e.y <= t.y) {
      if (e.next.y > t.y && ii(e, e.next, t) > 0) return 1
    } else if (e.next.y <= t.y && ii(e, e.next, t) < 0) return -1
    return 0
  }
  function ii(t, e, i) {
    return (e.x - t.x) * (i.y - t.y) - (i.x - t.x) * (e.y - t.y)
  }
  function ni(t) {
    ie.self(this, ti),
      (this.bounding = { left: 0, top: 0, width: 0, height: 0 }),
      (this.svgData = (function (t) {
        if ('string' != typeof t) return null
        var e = decodeURIComponent(t),
          i = e.indexOf('d="') + 3,
          n = e.indexOf('"', i),
          o = t.slice(i, n),
          r = (function (t) {
            var e = 0,
              i = 0,
              n = 0,
              o = 0,
              r = t.match(/<svg[^>]*width=['"]([^'"]+)['"]/),
              s = t.match(/<svg[^>]*height=['"]([^'"]+)['"]/)
            if (
              r &&
              s &&
              ((n = parseFloat(r[1])), (o = parseFloat(s[1])), !isNaN(n) && !isNaN(o))
            ) {
              return { left: e, top: i, width: n, height: o }
            }
            var a = t.match(/<svg[^>]*viewBox=['"]([^'"]+)['"]/)
            if (a) {
              var c = a[1].split(' ')
              if (
                ((e = parseFloat(c[0])),
                (i = parseFloat(c[1])),
                (n = parseFloat(c[2])),
                (o = parseFloat(c[3])),
                !(isNaN(e) || isNaN(i) || isNaN(n) || isNaN(o)))
              ) {
                return { left: e, top: i, width: n, height: o }
              }
            }
            return { left: 0, top: 0, width: 0, height: 0 }
          })(e)
        return { pathCommands: oi(o), viewport: r }
      })(t)),
      this.svgData &&
        ((this.bounding.width = this.svgData.viewport.width),
        (this.bounding.height = this.svgData.viewport.height))
  }
  function oi(t) {
    for (var e = t.match(/[a-df-zA-DF-Z][^a-df-zA-DF-Z]*/g) || [], i = [], n = 0; n < e.length; ) {
      for (
        var o = e[n],
          r = o[0],
          s = o
            .slice(1)
            .trim()
            .split(/[\s,]+/),
          a = [],
          c = 0;
        c < s.length;

      ) {
        a.push(parseFloat(s[c])), c++
      }
      i.push({ type: r, params: a }), n++
    }
    return i
  }
  ;(Xe.prototype.rotate = function (t, e) {
    var i = Ft(e),
      n = Math.sin(i),
      o = Math.cos(i),
      r = this.x - t.x,
      s = this.y - t.y
    ;(this.x = r * o - s * n + t.x), (this.y = r * n + s * o + t.y)
  }),
    (Xe.prototype.getDistance = function (t) {
      return Math.sqrt(Math.pow(this.x - t.x, 2) + Math.pow(this.y - t.y, 2))
    }),
    (Xe.prototype.getAngle = function (t) {
      var e = t.x - this.x,
        i = t.y - this.y,
        n = $t(Math.atan2(i, e))
      return n < 0 && (n += 360), n
    }),
    (Xe.prototype.hitTest = function (t) {
      return this.radius + this.tolerance >= this.getDistance(t)
    }),
    (Xe.prototype.restrict = function (t, e, i, n) {
      if ('x' !== t && 'y' !== t) throw new Error('Point.restrict requires a value: x or y')
      return e + this[t] < i ? (e = this[t] - i) : e + this[t] > n && (e = n - this[t]), this[t] + e
    }),
    (Xe.prototype.draw = function (t) {
      t.ctx.beginPath(),
        t.ctx.arc(this.x, this.y, this.radius / t.scale, 0, 2 * Math.PI, !1),
        this.fill && ((t.ctx.fillStyle = this.fillColor), t.ctx.fill()),
        this.stroke &&
          ((t.ctx.strokeStyle = this.strokeColor),
          (t.ctx.lineWidth = this.strokeWidth / t.scale),
          t.ctx.stroke())
    }),
    ie.proto(Qe, Xe),
    (Qe.prototype.set = function (t, e, i) {
      ;(this.x = t.x || this.x),
        (this.y = t.y || this.y),
        e === undefined
          ? ((this.handleIn.x = this.x), (this.handleIn.y = this.y))
          : ((this.handleIn.x = e.x), (this.handleIn.y = e.y)),
        i === undefined
          ? ((this.handleOut.x = this.x), (this.handleOut.y = this.y))
          : ((this.handleOut.x = i.x), (this.handleOut.y = i.y))
    }),
    (Qe.prototype.clone = function () {
      var t = { x: this.x, y: this.y },
        e = { x: this.handleIn.x, y: this.handleIn.y },
        i = { x: this.handleOut.x, y: this.handleOut.y },
        n = new Qe()
      return (
        e.x === i.x && e.y === i.y ? n.set(t) : n.set(t, e, i),
        (n.index = this.index),
        (n.prev = this.prev),
        (n.next = this.next),
        (n.radius = this.radius),
        (n.tolerance = this.tolerance),
        (n.fill = this.fill),
        (n.stroke = this.stroke),
        (n.fillColor = this.fillColor),
        (n.strokeColor = this.strokeColor),
        (n.strokeWidth = this.strokeWidth),
        n
      )
    }),
    (Qe.prototype.move = function (t, e) {
      ;(this.x += t),
        (this.y += e),
        (this.handleIn.x += t),
        (this.handleIn.y += e),
        (this.handleOut.x += t),
        (this.handleOut.y += e)
    }),
    (Qe.prototype.render = function (t) {
      this.handleIn.x !== this.x && this.handleIn.y !== this.y && this.handleIn.draw(t),
        this.handleOut.x !== this.x && this.handleOut.y !== this.y && this.handleOut.draw(t),
        this.draw(t)
    }),
    (ti.prototype.addPoint = function (t) {
      var e
      return (
        t instanceof Qe ? (e = t.clone()) : ((e = new Qe()).set(t), (e.radius = this.pointRadius)),
        (e.index = this.segments.length),
        null === this._head
          ? ((this._head = e), (this._tail = e))
          : ((e.prev = this._tail), (this._tail.next = e), (this._tail = e)),
        (this._head.prev = this._tail),
        (this._tail.next = this._head),
        this.segments.push(e),
        e
      )
    }),
    (ti.prototype.addPoints = function (t) {
      for (var e = 0; e < t.length; e++) this.addPoint(t[e])
      t = null
    }),
    (ti.prototype.setPoints = function (t, e) {
      e === undefined && (e = 0)
      for (var i = e; i < t.length; i++) {
        this.segments[i] === undefined ? this.addPoint(t[i]) : this.segments[i].set(t[i])
      }
      ;(t = null), (e = null)
    }),
    (ti.prototype.setPointRadius = function (t) {
      for (var e = -1; ++e < this.segments.length; ) undefined.radius = t
    }),
    (ti.prototype.removePoint = function (t) {
      for (var e = this.segments.length, i = null; --e > -1 && null === i; ) {
        ;(i = this.segments[e]),
          t.x === i.x &&
            t.y === i.y &&
            (this.segments.splice(e, 1),
            i === this._head && i === this._tail
              ? ((this._head = null), (this._tail = null))
              : i === this.head
              ? ((this._head = this._head.next), (this._head.prev = null))
              : i === this._tail
              ? ((this._tail = this._tail.prev), (this._tail.next = null))
              : ((i.prev.next = i.next), (i.next.prev = i.prev)))
      }
      return i
    }),
    (ti.prototype.forEachPoint = function (t, e) {
      if (0 !== this.segments.length && this.segments) {
        for (var i, n = !1, o = this.segments.length; --o > -1 && !n; ) {
          ;(i = this.segments[e ? this.segments.length - 1 - o : o]), t && (n = t(i))
        }
      }
    }),
    (ti.prototype.close = function (t) {
      this._closed = t
    }),
    (ti.prototype.isClosed = function () {
      return this._closed
    }),
    (ti.prototype.start = function () {
      return this._head
    }),
    (ti.prototype.end = function () {
      return this._tail
    }),
    (ti.prototype.rotate = function (t, e) {
      e === undefined && (e = this.getCenter())
      for (var i, n = -1; ++n < this.segments.length; ) {
        ;(i = this.segments[n]).handleIn.rotate(e, t), i.rotate(e, t), i.handleOut.rotate(e, t)
      }
    }),
    (ti.prototype.move = function (t, e) {
      for (var i = -1; ++i < this.segments.length; ) this.segments[i].move(t, e)
    }),
    (ti.prototype.getPoint = function (t) {
      return this.segments[t]
    }),
    (ti.prototype.getLength = function () {
      return this.segments.length
    }),
    (ti.prototype.getCenter = function () {
      var t = this.getBounding()
      return { x: (t.right - t.left) / 2 + t.left, y: (t.bottom - t.top) / 2 + t.top }
    }),
    (ti.prototype.getDimensions = function () {
      var t = this.getBounding()
      return { width: t.right - t.left, height: t.bottom - t.top }
    }),
    (ti.prototype.getBounding = function () {
      for (var t, e = null, i = null, n = null, o = null, r = -1; ++r < this.segments.length; ) {
        ;(t = this.segments[r]),
          (null === e || t.x < e) && (e = t.x),
          (null === i || t.x > i) && (i = t.x),
          (null === n || t.y < n) && (n = t.y),
          (null === o || t.y > o) && (o = t.y)
      }
      return { left: e, top: n, bottom: o, right: i }
    }),
    (ti.prototype.draw = function (t) {
      t.ctx.beginPath()
      for (var e = -1, i = this.segments.length; ++e < i; ) {
        var n = this.segments[e],
          o =
            n.x !== n.handleIn.x ||
            n.y !== n.handleIn.y ||
            n.prev.x !== n.prev.handleOut.x ||
            n.prev.y !== n.prev.handleOut.y
        if (0 === n.index) t.ctx.moveTo(n.x, n.y)
        else if (o) {
          t.ctx.bezierCurveTo(
            n.prev.handleOut.x,
            n.prev.handleOut.y,
            n.handleIn.x,
            n.handleIn.y,
            n.x,
            n.y,
          ),
            (n.next.x !== n.next.handleIn.x || n.next.y !== n.next.handleIn.y) &&
              this._closed &&
              this._tail === n &&
              t.ctx.bezierCurveTo(
                n.handleOut.x,
                n.handleOut.y,
                n.next.handleIn.x,
                n.next.handleIn.y,
                n.next.x,
                n.next.y,
              )
        } else t.ctx.lineTo(n.x, n.y)
      }
      this._closed && t.ctx.closePath(),
        this.fill && ((t.ctx.fillStyle = this.fillColor), t.ctx.fill()),
        this.stroke &&
          ((t.ctx.strokeStyle = this.strokeColor),
          (t.ctx.lineWidth = this.strokeWidth / t.scale),
          t.ctx.stroke()),
        !0 === this.showPoints &&
          this.forEachPoint(function (e) {
            ;(e.fill = !0), e.render(t)
          })
    }),
    (ti.prototype.hitTest = function (t, e) {
      e === undefined && (e = {})
      var i,
        n = !1,
        o = 0,
        r = !1
      ;(e.segment = e.segment === undefined || e.segment), (e.path = e.path === undefined || e.path)
      for (var s = -1; ++s < this.segments.length; ) {
        ;(i = this.segments[s]),
          e.path && this._closed && (o += ei(t, i)),
          e.segment && i.hitTest(t) && (r = i)
      }
      return (
        e.path && 0 !== o && !1 === r
          ? (n = { type: 'path', geometry: this })
          : r && (n = { type: 'segment', geometry: r }),
        n
      )
    }),
    (ti.prototype.destroy = function () {
      for (var t = this.segments.length; --t > -1; ) this.segments.splice(t, 1)
      return (this._head = null), (this._tail = null), (this.segments = []), null
    }),
    ie.proto(ni, ti),
    (ni.prototype.size = function (t, e) {
      t
        ? (e || (e = t), (this.bounding.width = t), (this.bounding.height = e))
        : ((this.bounding.width = this.svgData.viewport.width),
          (this.bounding.height = this.svgData.viewport.height))
    }),
    (ni.prototype.move = function (t, e) {
      t && (e || (e = t), (this.bounding.left = t), (this.bounding.top = e))
    }),
    (ni.prototype.destroy = function () {
      ;(this.bounding = { left: 0, top: 0, width: 0, height: 0 }), (this.svgData = null)
    }),
    (ni.prototype.getBounding = function () {
      return this.bounding
    }),
    (ni.prototype.drawSVG = function (t) {
      ri(t, this.svgData, this.bounding)
    })
  var ri = function (t, e, i) {
    if (t && e && i) {
      var n = t.ctx,
        o = 0,
        r = 0,
        s = e.pathCommands,
        a = e.viewport,
        c = i.width / a.width,
        l = i.height / a.height,
        h = Math.min(c, l)
      n.translate(i.left + a.left, i.top + a.top), n.beginPath()
      for (var u = 0; u < s.length; ) {
        var f = s[u].params
        switch (s[u].type) {
          case 'M':
            n.moveTo(f[0] * h, f[1] * h), (o = f[0] * h), (r = f[1] * h)
            break
          case 'm':
            n.moveTo(o + f[0] * h, r + f[1] * h), (o += f[0] * h), (r += f[1] * h)
            break
          case 'L':
            n.lineTo(f[0] * h, f[1] * h), (o = f[0] * h), (r = f[1] * h)
            break
          case 'l':
            n.lineTo(o + f[0] * h, r + f[1] * h), (o += f[0] * h), (r += f[1] * h)
            break
          case 'H':
            n.lineTo(f[0] * h, r), (o = f[0] * h)
            break
          case 'h':
            n.lineTo(o + f[0] * h, r), (o += f[0] * h)
            break
          case 'V':
            n.lineTo(o, f[0] * h), (r = f[0] * h)
            break
          case 'v':
            n.lineTo(o, r + f[0] * h), (r += f[0] * h)
            break
          case 'C':
            n.bezierCurveTo(f[0] * h, f[1] * h, f[2] * h, f[3] * h, f[4] * h, f[5] * h),
              (o = f[4] * h),
              (r = f[5] * h)
            break
          case 'c':
            n.bezierCurveTo(
              o + f[0] * h,
              r + f[1] * h,
              o + f[2] * h,
              r + f[3] * h,
              o + f[4] * h,
              r + f[5] * h,
            ),
              (o += f[4] * h),
              (r += f[5] * h)
            break
          case 'Z':
          case 'z':
            n.closePath()
        }
        u++
      }
      n.stroke()
    }
  }
  function si() {
    ie.self(this, Xe),
      (this.radius = 0),
      (this.tolerance = 0),
      (this.fill = !1),
      (this.stroke = !1),
      (this.fillColor = '#fff'),
      (this.strokeWidth = 1),
      (this.hovered = !1),
      (this.complete = !1)
  }
  function ai() {
    ie.self(this, ee, 'canvas')
    var t = this
    ;(this.element = this.dom),
      (this.ctx = this.element.getContext('2d')),
      (this.scale = 1),
      (this.dpr = window.devicePixelRatio || 1),
      (this.clearColor = '#fff'),
      (this.ctx.roundedRect = function (e, i, n, o, r) {
        var s = n > 0 ? r : -r,
          a = o > 0 ? r : -r
        t.ctx.beginPath(),
          t.ctx.moveTo(e + s, i),
          t.ctx.lineTo(e + n - s, i),
          t.ctx.quadraticCurveTo(e + n, i, e + n, i + a),
          t.ctx.lineTo(e + n, i + o - a),
          t.ctx.quadraticCurveTo(e + n, i + o, e + n - s, i + o),
          t.ctx.lineTo(e + s, i + o),
          t.ctx.quadraticCurveTo(e, i + o, e, i + o - a),
          t.ctx.lineTo(e, i + a),
          t.ctx.quadraticCurveTo(e, i, e + s, i),
          t.ctx.closePath()
      })
  }
  function ci() {
    this._events = Object.create(null)
  }
  function li(t, e, i, n) {
    this._events[t] || (this._events[t] = []),
      this._events[t].unshift({ fn: e, once: n, context: i })
  }
  function hi(t, e, i) {
    ;(this.target = t),
      this.setTargetOrigin(i),
      (this.id = e),
      (this.messages = []),
      (this.incoming = []),
      (this.waiting = []),
      (this.isReady = !0),
      (this.queue = [])
  }
  ie.proto(si, Xe),
    (si.prototype.draw = function (t) {
      var e = this.radius / t.scale
      if (this.complete) {
        t.ctx.save(),
          t.ctx.beginPath(),
          t.ctx.arc(this.x, this.y, e + 2, 0, 2 * Math.PI),
          (t.ctx.strokeStyle = ut.white),
          (t.ctx.fillStyle = ut.white),
          (t.ctx.lineWidth = 2),
          t.ctx.stroke(),
          t.ctx.fill(),
          t.ctx.beginPath(),
          t.ctx.arc(this.x, this.y, e + 3, 0, 2 * Math.PI),
          (t.ctx.strokeStyle = ut.outline),
          (t.ctx.lineWidth = 1),
          t.ctx.stroke(),
          t.ctx.restore(),
          this.hovered &&
            (t.ctx.beginPath(),
            t.ctx.arc(this.x, this.y, e + 9, 0, 2 * Math.PI),
            (t.ctx.strokeStyle = ut.white),
            (t.ctx.lineWidth = 2),
            t.ctx.stroke(),
            t.ctx.beginPath(),
            t.ctx.arc(this.x, this.y, e + 10, 0, 2 * Math.PI),
            (t.ctx.strokeStyle = ut.outline),
            (t.ctx.lineWidth = 1),
            t.ctx.stroke())
      } else {
        var i = 2.5,
          n = [2.5, 4]
        t.ctx.beginPath(),
          t.ctx.arc(this.x, this.y, 1.5, 0, 2 * Math.PI, !1),
          (t.ctx.strokeStyle = ut.white),
          (t.ctx.lineWidth = 0.5),
          (t.ctx.fillStyle = this.fillColor),
          t.ctx.fill(),
          (t.ctx.strokeStyle = ut.outline),
          (t.ctx.lineWidth = 0.5),
          t.ctx.stroke(),
          t.ctx.beginPath(),
          t.ctx.arc(this.x, this.y, e + 2, 0, 2 * Math.PI),
          (t.ctx.strokeStyle = ut.white),
          (t.ctx.lineWidth = 2),
          t.ctx.stroke(),
          t.ctx.beginPath(),
          t.ctx.arc(this.x, this.y, e + 3, 0, 2 * Math.PI),
          (t.ctx.strokeStyle = ut.outline),
          (t.ctx.lineWidth = 1),
          t.ctx.stroke(),
          (t.ctx.fillStyle = ut.outline),
          t.ctx.roundedRect(this.x - (e + 5), this.y - 2, n[0], n[1], 2),
          t.ctx.fill(),
          (t.ctx.fillStyle = ut.white),
          t.ctx.roundedRect(this.x - (e + 5 - 1), this.y - 1, n[0], n[1] / 2, 1),
          t.ctx.fill(),
          (t.ctx.fillStyle = ut.outline),
          t.ctx.roundedRect(this.x + e + i, this.y - 2, n[0], n[1], 2),
          t.ctx.fill(),
          (t.ctx.fillStyle = ut.white),
          t.ctx.roundedRect(this.x + e + i - 1, this.y - 1, n[0], n[1] / 2, 1),
          t.ctx.fill(),
          (t.ctx.fillStyle = ut.outline),
          t.ctx.roundedRect(this.x - 2, this.y - e - 5, n[1], n[0], 2),
          t.ctx.fill(),
          (t.ctx.fillStyle = ut.white),
          t.ctx.roundedRect(this.x - 1, this.y - e - 5 + 1, n[1] / 2, n[0], 1),
          t.ctx.fill(),
          (t.ctx.fillStyle = ut.outline),
          t.ctx.roundedRect(this.x - 2, this.y + e + i, n[1], n[0], 2),
          t.ctx.fill(),
          (t.ctx.fillStyle = ut.white),
          t.ctx.roundedRect(this.x - 1, this.y + e + i - 1, n[1] / 2, n[0], 1),
          t.ctx.fill()
      }
    }),
    ie.proto(ai, ee),
    (ai.prototype.dimensions = function (t, e) {
      this.css({ width: t, height: e }),
        (this.element.width = Math.round(t / this.scale) * this.dpr),
        (this.element.height = Math.round(e / this.scale) * this.dpr),
        this.ctx.scale(this.dpr, this.dpr),
        (this.width = Math.round(t / this.scale)),
        (this.height = Math.round(e / this.scale))
    }),
    (ai.prototype.clear = function () {
      this.ctx && this.ctx.clearRect(0, 0, this.element.width, this.element.height)
    }),
    (ai.prototype.draw = function () {
      this.ctx &&
        ((this.ctx.fillStyle = this.clearColor),
        this.ctx.fillRect(0, 0, this.element.width, this.element.height))
    }),
    (ai.prototype._destroy = function () {
      this.__destroy(),
        (this.element = null),
        (this.ctx = null),
        (this.width = null),
        (this.height = null)
    }),
    (ci.prototype.on = function (t, e, i) {
      li.call(this, t, e, i, !1)
    }),
    (ci.prototype.once = function (t, e, i) {
      li.call(this, t, e, i, !0)
    }),
    (ci.prototype.off = function (t, e) {
      var i = this._events[t]
      if (i) {
        for (var n = i.length; --n > -1; ) i[n].fn === e && i.splice(n, 1)
        0 === i.length && delete this._events[t]
      }
    }),
    (ci.prototype.emit = function (t) {
      var e = this._events[t]
      if (e) {
        for (var i, n = Array.prototype.slice.call(arguments, 1), o = e.length; --o > -1; ) {
          ;(i = e[o]).fn.apply(i.context, n), i.once && e.splice(o, 1)
        }
        0 === e.length && delete this._events[t]
      }
    }),
    (ci.prototype.removeAllListeners = function () {
      this._events = Object.create(null)
    }),
    (hi.prototype._sendMessage = function (t, e) {
      var i = t instanceof HTMLIFrameElement
      try {
        i
          ? t.contentWindow.postMessage(JSON.stringify(e), this.targetOrigin)
          : t.postMessage(JSON.stringify(e), this.targetOrigin)
      } catch (Qr) {
        At('messaging', Qr),
          '*' !== this.targetOrigin && (this.setTargetOrigin('*'), this._sendMessage(t, e))
      }
    }),
    (hi.prototype.setReady = function (t) {
      var e = this
      ;(e.isReady = t),
        e.isReady &&
          e.queue.length &&
          (e.queue.forEach(function (t) {
            e._sendMessage.apply(e, t)
          }),
          e.clearQueue())
    }),
    (hi.prototype.clearQueue = function () {
      this.queue = []
    }),
    (hi.prototype.setID = function (t) {
      this.id = t
    }),
    (hi.prototype.setTargetOrigin = function (t) {
      this.targetOrigin = '*'
    }),
    (hi.prototype.contact = function (t, e) {
      if (!this.id) throw new Error('Chat requires unique id to communicate between windows')
      var i = this,
        n = Math.random().toString(36).substr(2),
        o = { source: 'hcaptcha', label: t, id: this.id, promise: 'create', lookup: n }
      if (e) {
        if ('object' != typeof e) throw new Error('Message must be an object.')
        o.contents = e
      }
      return new Promise(function (e, r) {
        i.waiting.push({ label: t, reject: r, resolve: e, lookup: n }), i._addToQueue(i.target, o)
      })
    }),
    (hi.prototype.listen = function (t, e) {
      if (!this.id) throw new Error('Chat requires unique id to communicate between windows')
      for (var i = this.messages.length, n = !1; --i > -1 && !1 === n; ) {
        this.messages[i].label === t && (n = this.messages[i])
      }
      !1 === n && ((n = { label: t, listeners: [] }), this.messages.push(n)), n.listeners.push(e)
    }),
    (hi.prototype.answer = function (t, e) {
      if (!this.id) throw new Error('Chat requires unique id to communicate between windows')
      for (var i = this.incoming.length, n = !1; --i > -1 && !1 === n; ) {
        this.incoming[i].label === t && (n = this.incoming[i])
      }
      !1 === n && ((n = { label: t, listeners: [] }), this.incoming.push(n)), n.listeners.push(e)
    }),
    (hi.prototype.send = function (t, e) {
      var i = this
      if (!i.id) throw new Error('Chat requires unique id to communicate between windows')
      var n = { source: 'hcaptcha', label: t, id: i.id }
      if (e) {
        if ('object' != typeof e) throw new Error('Message must be an object.')
        n.contents = e
      }
      i._addToQueue(i.target, n)
    }),
    (hi.prototype.check = function (t, e) {
      for (
        var i = [].concat.apply([], [this.messages, this.incoming, this.waiting]), n = [], o = -1;
        ++o < i.length;

      ) {
        if (i[o].label === t) {
          if (e && i[o].lookup && e !== i[o].lookup) continue
          n.push(i[o])
        }
      }
      return n
    }),
    (hi.prototype.respond = function (t) {
      for (
        var e,
          i,
          n = -1,
          o = 0,
          r = [].concat.apply([], [this.messages, this.incoming, this.waiting]);
        ++n < r.length;

      ) {
        if (r[n].label === t.label) {
          if (t.lookup && r[n].lookup && t.lookup !== r[n].lookup) continue
          var s = []
          if (
            ((e = r[n]),
            t.error && s.push(t.error),
            t.contents && s.push(t.contents),
            t.promise && 'create' !== t.promise)
          ) {
            e[t.promise].apply(e[t.promise], s)
            for (var a = this.waiting.length, c = !1; --a > -1 && !1 === c; ) {
              this.waiting[a].label === e.label &&
                this.waiting[a].lookup === e.lookup &&
                ((c = !0), this.waiting.splice(a, 1))
            }
            continue
          }
          for (o = 0; o < e.listeners.length; o++) {
            if (((i = e.listeners[o]), 'create' === t.promise)) {
              var l = this._contactPromise(e.label, t.lookup)
              s.push(l)
            }
            i.apply(i, s)
          }
        }
      }
      r = null
    }),
    (hi.prototype.destroy = function () {
      return (
        this.clearQueue(),
        (this.messages = null),
        (this.incoming = null),
        (this.waiting = null),
        (this.isReady = !1),
        null
      )
    }),
    (hi.prototype._contactPromise = function (t, e) {
      var i = this,
        n = {},
        o = new Promise(function (t, e) {
          ;(n.resolve = t), (n.reject = e)
        }),
        r = { source: 'hcaptcha', label: t, id: i.id, promise: null, lookup: e }
      return (
        o
          .then(function (t) {
            ;(r.promise = 'resolve'), null !== t && (r.contents = t), i._addToQueue(i.target, r)
          })
          ['catch'](function (t) {
            ;(r.promise = 'reject'), null !== t && (r.error = t), i._addToQueue(i.target, r)
          }),
        n
      )
    }),
    (hi.prototype._addToQueue = function (t, e) {
      this.isReady ? this._sendMessage(t, e) : this.queue.push([t, e])
    })
  var ui = {
    chats: [],
    messages: [],
    globalEnabled: !1,
    isSupported: function () {
      return !!window.postMessage
    },
    createChat: function (t, e, i) {
      var n = new hi(t, e, i)
      return ui.chats.push(n), n
    },
    addChat: function (t) {
      ui.chats.push(t)
    },
    removeChat: function (t) {
      for (var e = !1, i = ui.chats.length; --i > -1 && !1 === e; ) {
        t.id === ui.chats[i].id &&
          t.target === ui.chats[i].target &&
          ((e = ui.chats[i]), ui.chats.splice(i, 1))
      }
      return e
    },
    handleGlobal: function (t) {
      if (ui.globalEnabled) {
        var e = ui.messages
        if (e.length >= 10) ui.globalEnabled = !1
        else {
          var i = e.some(function (e) {
            return JSON.stringify(e.data) === JSON.stringify(t.data)
          })
          i || e.push(t)
        }
      }
    },
    handle: function (t) {
      var e = t.data,
        i = 'string' == typeof e && e.indexOf('hcaptcha') >= 0
      try {
        if (!i) return void ui.handleGlobal(t)
        e = JSON.parse(e)
        for (var n, o = ui.chats, r = -1; ++r < o.length; ) {
          var s = '*' === (n = o[r]).targetOrigin || t.origin === n.targetOrigin
          n.id === e.id && s && n.respond(e)
        }
      } catch (Qr) {
        St('postMessage handler error', 'postMessage', 'debug', { event: t, error: Qr })
      }
    },
  }
  window.addEventListener
    ? window.addEventListener('message', ui.handle)
    : window.attachEvent('onmessage', ui.handle)
  var fi = new hi(window.parent)
  fi.init = function (t, e) {
    fi.setID(t), fi.setTargetOrigin(e), (ui.globalEnabled = !0), ui.addChat(fi)
  }
  var di = null
  function pi(t) {
    di && ft.confirmNav ? di.display('link', { url: t }) : window.open(t, '_blank')
  }
  function mi(t, e) {
    for (var i in e) {
      var n = e[i]
      switch (typeof n) {
        case 'string':
          t[i] = n
          break
        case 'object':
          ;(t[i] = t[i] || {}), mi(t[i], n)
          break
        default:
          throw new Error(
            'Source theme contains invalid data types. Only string and object types are supported.',
          )
      }
    }
  }
  function yi(t, e) {
    try {
      return t in e
    } catch (i) {
      return !1
    }
  }
  function gi(t) {
    return !!t && 'object' == typeof t
  }
  function vi(t) {
    return gi(t) ? bi({}, t) : t
  }
  function bi(t, e) {
    var i,
      n = {},
      o = Object.keys(t)
    for (i = 0; i < o.length; i++) n[o[i]] = vi(t[o[i]])
    var r,
      s,
      a = Object.keys(e)
    for (i = 0; i < a.length; i++) {
      var c = a[i]
      if (
        !(
          !yi((r = c), (s = t)) ||
          (Object.hasOwnProperty.call(s, r) && Object.propertyIsEnumerable.call(s, r))
        )
      ) {
        return
      }
      yi(c, t) && gi(t[c]) ? (n[c] = bi(t[c], e[c])) : (n[c] = vi(e[c]))
    }
    return n
  }
  var wi = { transparent: 'transparent', white: '#ffffff', black: '#000000' },
    xi = {
      100: '#fafafa',
      200: '#f5f5f5',
      300: '#E0E0E0',
      400: '#D7D7D7',
      500: '#BFBFBF',
      600: '#919191',
      700: '#555555',
      800: '#333333',
      900: '#222222',
      1e3: '#14191F',
    },
    ki = { 300: '#4DE1D2', 500: '#00838F' },
    Ci = { 300: '#BF1722', 500: '#BF1722', 700: '#9D1B1B' },
    _i = { __proto__: null, common: wi, grey: xi, teal: ki, red: Ci },
    Ei = {
      mode: 'light',
      grey: xi,
      primary: { main: ki[500] },
      secondary: { main: ki[300] },
      warn: { light: Ci[300], main: Ci[500], dark: Ci[700] },
      text: { heading: xi[700], body: xi[700] },
    },
    Ai = {
      mode: 'dark',
      grey: xi,
      primary: { main: ki[500] },
      secondary: { main: ki[300] },
      text: { heading: xi[200], body: xi[200] },
    }
  function Si(t, e) {
    return 'dark' === e && t in Ai ? Ai[t] : Ei[t]
  }
  function Bi() {
    ;(this._themes = Object.create(null)),
      (this._active = 'light'),
      this.add('light', {}),
      this.add('dark', { palette: { mode: 'dark' } })
  }
  ;(Bi.prototype.get = function (t) {
    if (!t) return this._themes[this._active]
    var e = this._themes[t]
    if (!e) throw new Error('Cannot find theme with name: ' + t)
    return e
  }),
    (Bi.prototype.use = function (t) {
      this._themes[t] ? (this._active = t) : console.error('Cannot find theme with name: ' + t)
    }),
    (Bi.prototype.active = function () {
      return this._active
    }),
    (Bi.prototype.add = function (t, e) {
      e || (e = {}),
        (e.palette = (function (t) {
          t || (t = {})
          var e = t.mode || 'light',
            i = t.primary || Si('primary', e),
            n = t.secondary || Si('secondary', e),
            o = t.warn || Si('warn', e),
            r = t.grey || Si('grey', e),
            s = t.text || Si('text', e)
          return bi({ common: wi, mode: e, primary: i, secondary: n, grey: r, warn: o, text: s }, t)
        })(e.palette)),
        (e.component = e.component || Object.create(null)),
        (this._themes[t] = e)
    }),
    (Bi.prototype.extend = function (t, e) {
      'string' == typeof e && (e = JSON.parse(e))
      var i = JSON.parse(JSON.stringify(this.get(t)))
      return mi(i, e), i
    }),
    (Bi.merge = function (t, e) {
      return bi(t, e || {})
    })
  var Li = { __proto__: null, Colors: _i, Theme: Bi },
    Ti = new Bi()
  function Oi(t) {
    var e = t.palette,
      i = t.component
    return Bi.merge({ focus: { outline: e.primary.main } }, i.link)
  }
  function Hi(t) {
    ie.self(this, ne, 'link', 'a'),
      (this.config = {
        url: t.url,
        text: t.text,
        underline: t.underline || !1,
        theme: t.theme,
        onDarkBg: t.onDarkBg,
      }),
      this.setAttribute('tabindex', 0),
      this.config.url &&
        (this.setAttribute('href', this.config.url), this.setAttribute('target', '_blank')),
      (this.onSelect = this.onSelect.bind(this)),
      (this.onHover = this.onHover.bind(this)),
      (this.onFocus = this.onFocus.bind(this)),
      (this.onBlur = this.onBlur.bind(this)),
      this.addEventListener('click', this.onSelect),
      this.addEventListener('enter', this.onSelect),
      this.addEventListener('over', this.onHover),
      this.addEventListener('out', this.onHover),
      this.addEventListener('focus', this.onFocus),
      this.addEventListener('blur', this.onBlur),
      this.translate()
  }
  function Mi(t) {
    ie.self(this, ne, null, 'span'),
      (this.config = { text: t.text, bold: t.bold }),
      this.text(this.config.text)
  }
  function Ri(t) {
    ie.self(this, ne, t.selector || null, t.element || 'div'), (this.state = { theme: t.theme })
  }
  function Pi(t) {
    if ('string' != typeof t.src && !(t.src instanceof HTMLElement)) {
      throw new TypeError('Graphic src must be string or HTMLElement. Passed src: ' + t.src)
    }
    ie.self(this, ne, t.selector || '.graphic'),
      (this.state = { loaded: !1 }),
      (this.config = {
        src: t.src,
        fallback: t.fallback || !1,
        width: t.width || 0,
        height: t.height || t.width || 0,
        fill: t.fill,
        stroke: t.stroke,
      }),
      (this.image = null),
      (t.autoLoad || t.autoLoad === undefined) && this.load()
  }
  function Ii(t, e) {
    var i = t.nodeName
    if ('svg' === i || 'g' === i || 'clipPath' === i) {
      var n = t && (t.children || t.childNodes)
      if (!n) return
      for (var o = 0; o < n.length; o++) Ii(n[o], e)
    } else if (
      t &&
      t.style &&
      ('path' === i || 'rect' === i || 'circle' === i || 'polygon' === i)
    ) {
      var r = !!t.getAttribute('stroke'),
        s = !!t.getAttribute('fill')
      r && (t.style.stroke = e), s && (t.style.fill = e), s || r || (t.style.fill = e)
    }
  }
  function Vi(t) {
    var e = t.palette,
      i = t.component
    return Bi.merge(
      {
        main: { fill: e.common.white, icon: e.grey[700], text: e.text.main },
        hover: { fill: e.grey[200], icon: e.primary.main, text: e.text.main },
        focus: { icon: e.primary.main, outline: e.primary.main },
        active: { icon: e.grey[700] },
      },
      i.button,
    )
  }
  function Di(t) {
    ie.self(this, ne, t.selector),
      (this._theme = t.theme),
      (this.state = {
        selectable: !1 !== t.selectable,
        title: t.title,
        label: t.label,
        value: t.value,
        visible: !0,
        locked: !1,
        mobile: !1,
        selected: !1,
        width: t.width,
        height: t.height,
        closedAt: Date.now(),
        downAt: 0,
        style: Vi(this._theme.get()),
      }),
      this.addClass('button'),
      this.setAttribute('tabindex', 0),
      this.setAttribute('role', 'button'),
      (this.onDown = this.onDown.bind(this)),
      (this.onHover = this.onHover.bind(this)),
      (this.onSelect = this.onSelect.bind(this)),
      (this.onFocus = this.onFocus.bind(this)),
      (this.onBlur = this.onBlur.bind(this)),
      this.addEventListener('down', this.onDown),
      this.addEventListener('click', this.onSelect),
      this.addEventListener('enter', this.onSelect),
      this.addEventListener('focus', this.onFocus),
      this.addEventListener('blur', this.onBlur),
      !1 === tt.System.mobile &&
        (this.addEventListener('over', this.onHover), this.addEventListener('out', this.onHover)),
      this.setCopy()
  }
  Ti.add('contrast', {
    component: {
      prompt: { main: { fill: '#fff', text: '#000' } },
      expandButton: { main: { fill: '#000' } },
    },
  }),
    Ti.add('grey-red', {
      component: {
        breadcrumb: { active: { fill: '#FF0000' } },
        prompt: { main: { fill: '#6a6a6a' } },
        task: { selected: { border: '#ff1f17' } },
        expandButton: { main: { fill: '#6a6a6a' } },
        verifyButton: { main: { fill: '#ff1f17' }, hover: { fill: '#ff1f17' } },
        skipButton: { main: { fill: '#6a6a6a' }, hover: { fill: '#6a6a6a' } },
      },
    }),
    ie.proto(Hi, ne),
    (Hi.prototype.style = function (t) {
      var e = t.fontSize || 12,
        i = t.color || 'inherit',
        n = Oi(this.config.theme.get())
      this.css({
        color: i,
        fontWeight: 500,
        fontSize: e,
        cursor: 'pointer',
        textDecoration: this.config.underline ? 'underline' : 'none',
        outlineColor: n.focus.outline,
        display: 'inline-block',
        lineHeight: e,
      })
    }),
    (Hi.prototype.translate = function () {
      var t = ue.translate(this.config.text)
      this.content(t)
    }),
    (Hi.prototype.onHover = function (t) {
      var e = 'over' === t.action
      this.css({ textDecoration: e || this.config.underline ? 'underline' : 'none' })
    }),
    (Hi.prototype.onSelect = function (t) {
      this.emit('click', t)
    }),
    (Hi.prototype.onFocus = function (t) {
      var e = Oi(this.config.theme.get()).focus.outline
      this.css({ outline: '2px solid ' + e })
    }),
    (Hi.prototype.onBlur = function (t) {
      this.css({ outline: 'none' })
    }),
    ie.proto(Mi, ne),
    (Mi.prototype.style = function (t) {
      var e = t.fontSize || 12,
        i = t.color || '#000'
      this.css({ color: i, fontWeight: this.config.bold ? 700 : 500, fontSize: e, lineHeight: e })
    }),
    (Mi.prototype.translate = function () {
      var t = ue.translate(this.config.text)
      this.text(t)
    }),
    ie.proto(Ri, ne),
    (Ri.prototype.style = function (t) {
      for (var e = this.children.length; --e > -1; ) this.children[e].style(t)
    }),
    (Ri.prototype.parseText = function (t) {
      var e,
        i,
        n = [
          { type: 'BOLD', regex: /\*\*([^*]*)\*\*/g },
          { type: 'LINK', regex: /\[([^[]+)]\(([^)]*)\)/g },
        ],
        o = []
      for (e = n.length; --e > -1; ) {
        for (; null != (i = n[e].regex.exec(t)); ) (i.type = n[e].type), o.push(i)
      }
      ;(o = o.sort(function (t, e) {
        return t.index - e.index
      })),
        this.removeAllComponents()
      var r = 0
      for (e = 0; e < o.length; e++) {
        switch (
          ((i = o[e]),
          this.initComponent(Mi, { text: t.substring(r, i.index) }),
          (r = i.index + i[0].length),
          i.type)
        ) {
          case 'BOLD':
            this.initComponent(Mi, { text: i[1], bold: !0 })
            break
          case 'LINK':
            this.initComponent(Hi, {
              text: i[1],
              url: i[2],
              underline: !0,
              onDarkBg: !0,
              theme: this.state.theme,
            })
        }
      }
      r < t.length && this.initComponent(Mi, { text: t.substring(r) }),
        this.style({ fontSize: 'inherit', color: 'inherit' })
    }),
    ie.proto(Pi, ne),
    (Pi.prototype.load = function () {
      if (this.state.loaded) return Promise.resolve()
      this.state.loaded = !0
      var t = this,
        e = this.config.src
      return Be.image(e, { fallback: this.config.fallback })
        .then(function (e) {
          ;(t.image = e), t.appendElement(e.element), t.size(), t.fill()
        })
        ['catch'](function () {
          St('graphic failed to load', 'image', 'info', { src: e })
        })
    }),
    (Pi.prototype.size = function (t, e) {
      ;(this.config.width = t || this.config.width),
        (this.config.height = e || t || this.config.height),
        this.css({ width: this.config.width, height: this.config.height }),
        this.image &&
          this.image.element.css({
            width: this.config.width,
            height: this.config.height,
            display: 'block',
          })
    }),
    (Pi.prototype.fill = function (t) {
      ;((this.config.fill = t || this.config.fill),
      this.image && 'svg' === this.image.ext && this.config.fill) &&
        Ii(this.image.element.dom, this.config.fill)
    }),
    ie.proto(Di, ne),
    (Di.prototype.style = function (t) {
      ;(this.state.mobile = t),
        (this.state.style = Vi(this._theme.get())),
        this.css({
          width: this.state.width,
          height: this.state.height,
          cursor: this.state.locked ? 'default' : 'pointer',
          display: this.state.visible ? 'inline-block' : 'none',
          color: this.state.style.main.text,
          backgroundColor: this.state.style.main.fill,
          outlineColor: this.state.style.focus.outline,
          border: '1px solid ' + this.state.style.main.border,
          borderRadius: 4,
        }),
        this.emit('style')
    }),
    (Di.prototype.getWidth = function () {
      return this.state.width
    }),
    (Di.prototype.getHeight = function () {
      return this.state.height
    }),
    (Di.prototype._updateStyle = function (t) {
      this.state.style = Vi(this._theme.get())
      var e = t ? 'hover' : 'main'
      this.css({
        backgroundColor: this.state.style[e].fill,
        borderColor: this.state.style[e].border,
        color: this.state.style[e].text,
      }),
        this.emit('style-update', t)
    }),
    (Di.prototype.onDown = function () {
      this.state.downAt = Date.now()
    }),
    (Di.prototype.onHover = function (t) {
      null === this.emit ||
        !0 === this.state.locked ||
        this.state.selected ||
        (this.emit('hover', t), this._updateStyle('over' === t.action))
    }),
    (Di.prototype.onSelect = function (t) {
      this.emit &&
        !0 !== this.state.locked &&
        (Math.abs(this.state.downAt - this.state.closedAt) < 30 ||
          (this._setState(!!this.state.selectable && !this.state.selected),
          this.emit('click', { selected: this.state.selected, usingKb: 'enter' === t.action })))
    }),
    (Di.prototype.onFocus = function (t) {
      var e = this.state.style.focus.outline
      this.css({ outline: '2px solid ' + e })
    }),
    (Di.prototype.onBlur = function (t) {
      this.css({ outline: 'none' })
    }),
    (Di.prototype.setLock = function (t) {
      ;(this.state.locked = t), this.css({ cursor: t ? 'default' : 'pointer' })
    }),
    (Di.prototype.enable = function (t) {
      ;(this.state.visible = t),
        this.css({ display: t ? 'inline-block' : 'none' }),
        this.setLock.call(this, !t)
    }),
    (Di.prototype.reset = function () {
      this._setState(!1)
    }),
    (Di.prototype._setState = function (t) {
      ;(this.state.style = Vi(this._theme.get())),
        (this.state.selected = t),
        this.css({ backgroundColor: this.state.style.main.fill }),
        t ? this._updateStyle(!0) : (this.state.closedAt = Date.now()),
        this.emit('state-changed', t)
    }),
    (Di.prototype.setLabel = function (t) {
      t && (this.state.label = t),
        this.state.label && this.setAttribute('aria-label', ue.translate(this.state.label))
    }),
    (Di.prototype.setTitle = function (t) {
      t && (this.state.title = t),
        this.state.title && this.setAttribute('title', ue.translate(this.state.title))
    }),
    (Di.prototype.setCopy = function () {
      this.setLabel(), this.setTitle()
    }),
    (Di.prototype.controlsMenu = function (t) {
      this.setAttribute('aria-expanded', !1),
        this.setAttribute('aria-haspopup', 'menu'),
        this.setAttribute('aria-controls', t.dom.id),
        t.setAttribute('aria-labelledby', this.dom.id),
        t.setAttribute('role', 'menu'),
        t.setAttribute('tabindex', -1),
        this.on('state-changed', function (t) {
          this.setAttribute('aria-expanded', t)
        })
    }),
    (Di.prototype.ownsListBox = function (t) {
      this.setAttribute('aria-expanded', !1),
        this.setAttribute('aria-haspopup', 'listbox'),
        this.setAttribute('aria-owns', t.dom.id),
        t.setAttribute('aria-labelledby', this.dom.id),
        t.setAttribute('role', 'listbox'),
        this.on('state-changed', function (t) {
          this.setAttribute('aria-expanded', t)
        })
    }),
    (Di.prototype.getValue = function () {
      return this.state.value
    })
  var Fi = 'https://newassets.hcaptcha.com/captcha/v1/a8cd801/static/images'
  function $i(t) {
    ;(t.selector = t.selector || t.name),
      ie.self(this, Di, t),
      (this.$on = this.initComponent(Pi, {
        selector: '.' + t.name + '-on',
        src: t.src,
        fallback: Fi + '/' + t.name + '-on.png',
        autoLoad: !1,
      })),
      (this.$off = this.initComponent(Pi, {
        selector: '.' + t.name + '-off',
        src: t.src,
        fallback: Fi + '/' + t.name + '-off.png',
        autoLoad: !1,
      })),
      this.on('state-changed', this._onStateChange.bind(this)),
      this.on('style', this._onStyle.bind(this)),
      this.on('style-update', this._onStyleUpdate.bind(this))
  }
  function Ui(t) {
    ie.self(this, Di, t),
      (this.state.text = t.text),
      (this.$text = this.createElement('.text')),
      this.on('style', this._onStyle.bind(this)),
      this.setText()
  }
  function ji(t) {
    ie.self(this, Di, t),
      (this.state.text = t.text),
      (this.state.type = t.type || 'confirm'),
      (this.$text = this.createElement('.text')),
      this.on('style', this._onStyle.bind(this)),
      this.setText()
  }
  function Ni(t) {
    var e = t.palette,
      i = t.component
    return Bi.merge(
      {
        main: { fill: e.grey[200], border: e.grey[600] },
        selected: { check: e.primary.main },
        focus: { outline: e.primary.main },
      },
      i.radio,
    )
  }
  function zi(t) {
    ie.self(this, ne, 'radio-button'),
      (this.state = { theme: t.theme, locked: !1, selected: !1, text: t.text, value: t.value }),
      (this.$wrapper = this.createElement('.wrapper')),
      (this.$radio = this.$wrapper.createElement('.radio')),
      (this.$radio.bg = this.$radio.createElement('.radio-bg')),
      (this.$radio.check = this.$radio.createElement('.radio-indicator')),
      this.$radio.check.css({ opacity: 0 }),
      (this.$text = this.$wrapper.createElement('.radio-text')),
      (this.$text.dom.id = 'RadioButton-' + this.state.value),
      this.$radio.setAttribute('tabindex', '0'),
      this.$radio.setAttribute('role', 'radio'),
      this.$radio.setAttribute('aria-pressed', !1),
      this.$radio.setAttribute('aria-labelledby', this.$text.dom.id),
      (this.onSelect = this.onSelect.bind(this)),
      (this.onFocus = this.onFocus.bind(this)),
      (this.onBlur = this.onBlur.bind(this)),
      this.$radio.addEventListener('click', this.onSelect),
      this.$radio.addEventListener('enter', this.onSelect),
      this.$radio.addEventListener('focus', this.onFocus),
      this.$radio.addEventListener('blur', this.onBlur)
  }
  function Zi(t) {
    var e = t.palette,
      i = t.component,
      n = 'light' === e.mode
    return Bi.merge(
      {
        main: { fill: e.grey[100], border: e.grey[n ? 600 : 200] },
        focus: { fill: e.grey[200], outline: e.grey[n ? 800 : 100] },
        disabled: { fill: e.grey[300] },
      },
      i.textarea,
    )
  }
  function Wi(t) {
    ie.self(this, ne, 'input-textarea')
    var e = this
    ;(this.state = { visible: !1, placeholder: t.placeholder, theme: t.theme }),
      (this.$textarea = this.createElement('textarea', '.textarea')),
      this.setPlaceholder.call(this),
      this.$textarea.addEventListener('input', function (t) {
        e.emit('change', t.target.value)
      })
  }
  function qi(t) {
    ie.self(this, ne, t.selector || 'list-native', 'select')
    var e = this
    ;(this._options = []),
      (this._selected = null),
      this.setAttribute('tabindex', -1),
      this.addEventListener('change', function () {
        e.dom.value && e.select(e.dom.value)
      })
  }
  ie.proto($i, Di),
    ($i.prototype.load = function () {
      return Promise.all([this.$on.load(), this.$off.load()])
    }),
    ($i.prototype._onStyle = function () {
      var t = this.getWidth(),
        e = t - 10,
        i = (t - e) / 2
      this.$on.size(e),
        this.$on.fill(this.state.style.focus.icon),
        this.$on.css({ '-ms-high-contrast-adjust': 'none', position: 'absolute', top: i, left: i }),
        this.$off.size(e),
        this.$off.fill(this.state.style.main.icon),
        this.$off.css({ '-ms-high-contrast-adjust': 'none', position: 'absolute', top: i, left: i })
    }),
    ($i.prototype._onStyleUpdate = function (t) {
      'ie' === tt.Browser.type && 8 === tt.Browser.version
        ? (this.$on.css({ display: t ? 'block' : 'none' }),
          this.$off.css({ display: t ? 'none' : 'block' }))
        : (this.$on.css({ opacity: t ? 1 : 0 }), this.$off.css({ opacity: t ? 0 : 1 }))
    }),
    ($i.prototype._onStateChange = function (t) {
      'ie' === tt.Browser.type && 8 === tt.Browser.version
        ? (this.$on.css({ display: t ? 'block' : 'none' }),
          this.$off.css({ display: t ? 'none' : 'block' }))
        : (this.$on.css({ opacity: t ? 1 : 0 }), this.$off.css({ opacity: t ? 0 : 1 }))
    }),
    ie.proto(Ui, Di),
    (Ui.prototype.setText = function (t) {
      this.$text.text(t || this.state.text || this.state.title)
    }),
    (Ui.prototype._onStyle = function () {
      this.css({ cursor: 'pointer' }),
        this.$text.css({
          width: '100%',
          height: '100%',
          textAlign: 'center',
          fontSize: 11,
          fontWeight: 600,
          lineHeight: this.state.height,
          position: 'absolute',
        })
    }),
    ie.proto(ji, Di),
    (ji.prototype.setText = function (t) {
      t && (this.state.text = t),
        this.$text.text(ue.translate(this.state.text || this.state.title)),
        this.setCopy()
    }),
    (ji.prototype._onStyle = function () {
      var t = this._theme.get().palette,
        e = 'light' === t.mode,
        i = 'warn' === this.state.type ? t.warn.main : t.primary.main
      this.css({
        width: 'auto',
        height: 15,
        cursor: this.state.locked ? 'default' : 'pointer',
        display: 'block',
        margin: '0 auto',
        textAlign: 'center',
        lineHeight: 15,
        borderRadius: 4,
        padding: '10px 15px',
      }),
        this.$text.css({
          color: this.state.locked ? (e ? t.text.body : t.grey[700]) : i,
          fontSize: 15,
          fontWeight: 500,
          display: 'inline-block',
        })
    }),
    (ji.prototype.lock = function (t) {
      var e = this._theme.get().palette,
        i = 'warn' === this.state.type ? e.warn.main : e.primary.main,
        n = 'light' === e.mode
      ;(this.state.locked = t),
        this.css({ cursor: t ? 'default' : 'pointer' }),
        this.$text.css({ color: t ? (n ? e.text.body : e.grey[700]) : i }),
        t ? this.setAttribute('aria-disabled', t) : this.removeAttribute('aria-disabled')
    }),
    ie.proto(zi, ne),
    (zi.prototype.style = function (t) {
      var e = Dt(t, 125, 150, 13, 14),
        i = 15,
        n = t - 27,
        o = this.state.theme,
        r = Ni(o.get()),
        s = o.get().palette,
        a = 'light' === s.mode
      this.css({ height: 'auto', marginTop: 5, marginBottom: 5, position: 'relative' }),
        this.$wrapper.css({
          cursor: 'pointer',
          height: 'auto',
          width: 'auto',
          position: 'relative',
          display: 'inline-block',
        }),
        this.$radio.css({
          position: 'relative',
          display: 'inline-block',
          width: i,
          height: i,
          borderRadius: 2,
          overflow: 'hidden',
          border: '1px solid ' + r.main.border,
          float: 'left',
        }),
        this.$radio.check.css({
          position: 'absolute',
          top: 2,
          left: 2,
          zIndex: 10,
          width: 11,
          height: 11,
          borderRadius: 1,
          backgroundColor: r.selected.check,
        }),
        this.$radio.bg.css({
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 0,
          width: i,
          height: i,
          backgroundColor: r.main.fill,
        }),
        this.$text.css({
          position: 'relative',
          display: 'inline-block',
          width: n,
          fontSize: e,
          fontWeight: 400,
          color: a ? s.text.body : s.grey[700],
          float: 'right',
          marginLeft: 10,
          marginTop: 1,
          wordBreak: 'break-word',
        })
    }),
    (zi.prototype.toggle = function (t) {
      this.state.locked ||
        ((this.state.selected = t),
        this.$radio.check.css({ opacity: t ? 1 : 0 }),
        this.$radio.setAttribute('aria-pressed', t))
    }),
    (zi.prototype.lock = function (t) {
      this.state.locked = t
    }),
    (zi.prototype.setCopy = function () {
      var t = ue.translate(this.state.text)
      this.$text.text(t)
    }),
    (zi.prototype.onSelect = function (t) {
      this.emit('select', this)
    }),
    (zi.prototype.onFocus = function (t) {
      var e = Ni(this.state.theme.get()).focus.outline
      this.$radio.css({ outline: '2px solid ' + e })
    }),
    (zi.prototype.onBlur = function (t) {
      this.$radio.css({ outline: 'none' })
    }),
    ie.proto(Wi, ne),
    (Wi.prototype.style = function (t, e) {
      var i = this.state.theme,
        n = Zi(i.get()),
        o = i.get().palette,
        r = 'light' === o.mode
      this.$textarea.css({
        width: t - 30,
        height: 50,
        borderRadius: 4,
        backgroundColor: n.main.fill,
        color: r ? o.text.body : o.grey[700],
        border: '1px solid ' + n.main.border,
        fontSize: e ? 12 : 14,
        lineHeight: e ? 16 : 18,
        fontWeight: 500,
        boxSizing: 'border-box',
        MozBoxSizing: 'border-box',
        padding: '8px 12px',
        position: 'absolute',
        left: '50%',
        marginLeft: -(t - 30) / 2,
      }),
        this.css({ height: 50, width: t, position: 'relative' }),
        this.visible(this.state.visible)
    }),
    (Wi.prototype.visible = function (t) {
      ;(this.state.visible = t), this.css({ display: t ? 'block' : 'none' })
    }),
    (Wi.prototype.disable = function (t) {
      if (this.state.visible) {
        var e = Zi(this.state.theme.get())
        ;(this.$textarea.dom.disabled = !t),
          this.$textarea.css({ backgroundColor: t ? e.main.fill : e.disabled.fill })
      }
    }),
    (Wi.prototype.getValue = function () {
      return this.$textarea.dom.value
    }),
    (Wi.prototype.setValue = function (t) {
      this.$textarea.dom.value = t
    }),
    (Wi.prototype.setPlaceholder = function () {
      this.$textarea.setAttribute('placeholder', ue.translate(this.state.placeholder))
    }),
    ie.proto(qi, ne),
    (qi.prototype.getSelected = function () {
      return this._selected
    }),
    (qi.prototype.setCopy = function () {
      for (var t = this._options.length; t--; ) {
        this._options[t].element.text(ue.translate(this._options[t].text))
      }
    }),
    (qi.prototype.setOptions = function (t) {
      for (var e, i = this._options.length; i--; ) this.removeElement(this._options[i].element)
      for (this._options = t, i = 0; i < t.length; i++) {
        ;((e = this.createElement('option', t[i].selector || '.option')).dom.value = t[i].value),
          e.text(t[i].text),
          (this._options[i].element = e)
      }
    }),
    (qi.prototype.select = function (t) {
      for (var e = null, i = this._options.length; i--; ) {
        t === this._options[i].value && (e = this._options[i])
      }
      if (!e) throw new Error('Cannot select a missing option value: ' + t)
      this._selected && this._selected.element.removeAttribute('selected'),
        e.element.setAttribute('selected', 'selected'),
        (this._selected = e),
        (this.dom.value = e.value),
        this.emit('hide'),
        this.emit('select', e)
    }),
    (qi.prototype.deselect = function () {
      this._selected && this._selected.element.removeAttribute('selected'),
        (this._selected = null),
        (this.dom.value = null)
    }),
    (qi.prototype.style = function () {
      this.css({
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        opacity: 0,
        zIndex: 50,
      })
    })
  var Ki = 37,
    Yi = 39,
    Gi = 38,
    Ji = 40,
    Xi = ('onwheel' in document || document, document, 'ontouchstart' in document),
    Qi = navigator.maxTouchPoints && navigator.maxTouchPoints > 1,
    tn = !!window.navigator.msPointerEnabled,
    en = 'onkeydown' in document
  function nn(t) {
    ;(this.state = {
      pause: !1,
      action: null,
      position: { x: 0, y: 0 },
      delta: { x: 0, y: 0 },
      created: !1,
    }),
      (this.config = {
        arrowScrolling: !1 !== t.arrowScrolling,
        keyStep: t.keyStep || 120,
        firefoxMult: t.firefoxMult || 15,
        touchMult: t.touchMult || 2,
        mouseMult: t.mouseMult || 1,
      })
    var e = t.element || document.body
    e instanceof ee || ((e = new ee(e)), (this.state.created = !0)),
      (this.element = e),
      (this.msBodyTouch = null),
      (this.clamp = { enabled: !1, min: { x: 0, y: 0 }, max: { x: 0, y: 0 } }),
      (this.onWheel = this.onWheel.bind(this)),
      (this.onKey = this.onKey.bind(this)),
      (this.onTouch = this.onTouch.bind(this)),
      (this.destroy = this.destroy.bind(this)),
      this._addListeners()
  }
  function on() {
    ie.self(this, ne, 'scroll-container')
  }
  function rn(t) {
    ie.self(this, ne, t.selector || 'list-custom'),
      (this.state = { skipAnimationOnce: !1 }),
      (this.scroll = new nn({ element: this, arrowScrolling: !1, mouseMult: 0.5, keyStep: 46 })),
      (this._container = this.initComponent(on)),
      (this._handle = this.createElement('div')),
      this.on('scroll-update', this._onScrollUpdate.bind(this))
  }
  function sn(t) {
    var e = t.palette,
      i = t.component
    return Bi.merge(
      {
        main: { fill: e.common.transparent, line: e.grey[200], text: e.grey[700] },
        hover: { fill: e.grey[200], text: e.grey[900], border: e.primary.main + 'b3' },
        selected: { fill: '#5C6F8A', text: e.grey[100] },
      },
      i.listItem,
    )
  }
  function an(t) {
    ie.self(this, ne, t.option.selector || '.option')
    var e = this
    ;(this.state = {
      style: sn(t.theme.get()),
      selected: !1,
      usingKb: !1,
      isLast: !1,
      size: t.size,
      option: t.option,
      theme: t.theme,
      isMenu: t.isMenu,
      height: t.height,
    }),
      (this.text = this.text.bind(this)),
      (this._text = this.createElement('span')),
      (this._separator = this.createElement('div')),
      this.addEventListener('click', this.select.bind(this)),
      this.addEventListener('enter', this.select.bind(this)),
      this.addEventListener('over', this._onHover.bind(this, !0)),
      this.addEventListener('out', this._onHover.bind(this, !1)),
      this.addEventListener('blur', function () {
        e.updateStyle(!1), e.emit('blur')
      }),
      this.addEventListener('focus', function () {
        e.updateStyle(e.state.usingKb), e.emit('focus')
      }),
      this.setAttribute('tabindex', 0),
      this.setAttribute('aria-selected', this.state.selected),
      this.setAttribute('aria-setsize', this.state.size),
      this.setAttribute('role', this.state.isMenu ? 'menuitem' : 'option'),
      this.setCopy()
  }
  function cn(t) {
    ie.self(this, rn, { selector: t.selector || 'list-custom' }),
      (this.state = {
        theme: t.theme,
        isMenu: t.isMenu,
        usingKb: !1,
        visible: !1,
        centerOnce: !1,
        search: '',
        focusedId: -1,
        selected: null,
        optionStyle: null,
        searchTimer: null,
        optionsVisible: t.optionsVisible || 6,
        optionHeight: 46,
      }),
      (this._options = []),
      this.setAttribute('tabindex', -1),
      this.setAttribute('aria-expanded', !1),
      this.setAttribute('role', this.state.isMenu ? 'presentation' : 'listbox'),
      this.addEventListener('keydown', this.onKeyPress.bind(this))
  }
  function ln(t) {
    ie.self(this, ne, (t = t || {}).selector || '.box-container'),
      (this._theme = t.theme),
      (this._tabbable = 'boolean' != typeof t.tabbable || t.tabbable),
      (this.boxState = {
        ariaLabel: t.ariaLabel,
        visible: !0,
        css: {
          boxSizing: t.boxSizing,
          width: t.width,
          height: t.height,
          padding: t.padding,
          margin: t.margin,
          borderWidth: t.borderWidth,
          borderStyle: t.borderStyle,
          borderRadius: t.borderRadius,
          borderColor: t.borderColor,
          backgroundColor: t.backgroundColor,
          cursor: t.cursor,
        },
      }),
      this.setStyle(this.boxState),
      this.setAriaLabel(),
      this.setVisible(!0)
  }
  function hn(t) {
    ie.self(this, ne, t.selector || '.border'),
      (this.state = {
        visible: t.visible === undefined || t.visible,
        thickness: t.thickness || 1,
        color: t.color || '#000000',
        rounded: t.rounded || 0,
      }),
      (this.$top = this.createElement('div')),
      (this.$right = this.createElement('div')),
      (this.$left = this.createElement('div')),
      (this.$bottom = this.createElement('div'))
  }
  function un(t) {
    var e = t.palette,
      i = t.component
    return Bi.merge({ focus: { outline: e.primary.main } }, i.link)
  }
  function fn(t) {
    ie.self(this, ne, 'logo', 'a'),
      (this.state = {
        theme: t.theme,
        url: t.url || '',
        width: t.width || 0,
        height: t.height || 0,
      }),
      this.setAttribute('tabindex', 0),
      this.setAttribute('target', '_blank'),
      this.setAttribute('href', this.state.url),
      this.setAttribute('role', 'button')
    var e = { selector: '.logo-graphic', src: t.src, fallback: t.fallback, autoLoad: t.autoLoad }
    ;(this.graphic = this.initComponent(Pi, e)),
      this.graphic.css({ cursor: 'pointer', '-ms-high-contrast-adjust': 'none' }),
      (this.onSelect = this.onSelect.bind(this)),
      (this.onFocus = this.onFocus.bind(this)),
      (this.onBlur = this.onBlur.bind(this)),
      this.addEventListener('click', this.onSelect),
      this.addEventListener('enter', this.onSelect),
      this.addEventListener('focus', this.onFocus),
      this.addEventListener('blur', this.onBlur)
  }
  function dn(t) {
    var e = t.palette,
      i = t.component
    return Bi.merge({ main: { fill: e.primary.main, icon: e.common.white } }, i.badge)
  }
  function pn(t) {
    if (
      (ie.self(this, ne, t.selector || '.badge'),
      t || (t = {}),
      (this._theme = t.theme),
      (this._style = dn(this._theme.get())),
      (this._timer = null),
      (this.state = { loaded: !1, visible: !1 }),
      (this.config = { icon: t.icon, value: t.value, size: t.size || 0 }),
      t.icon)
    ) {
      var e,
        i = t.icon
      'object' == typeof t.icon && ((i = t.icon.src), (e = t.icon.fallback)),
        (this.$wrapper = this.createElement('.badge-icon-wrapper')),
        (this.icon = this.initComponent(
          Pi,
          { selector: '.icon', src: i, fallback: e },
          this.$wrapper,
        ))
    }
    ;(this.$fill = this.createElement('.badge-fill')),
      (this.$radial = this.createElement('.badge-radial'))
  }
  ;(nn.prototype.pause = function (t) {
    this.state.pause = t
  }),
    (nn.prototype.update = function (t) {
      if (!this.state.pause) {
        var e = this.state.position,
          i = this.state.delta,
          n = this.state.action
        ;(e.x += i.x),
          (e.y += i.y),
          this.clamp.enabled
            ? ((e.x = Vt(e.x, this.clamp.min.x, this.clamp.max.x)),
              (e.y = Vt(e.y, this.clamp.min.y, this.clamp.max.y)))
            : console.log(e.y, this.element.dom.scrollHeight),
          this.element.emit('scroll-update', { x: e.x, y: e.y, delta: i, action: n, original: t })
      }
    }),
    (nn.prototype._addListeners = function () {
      var t = { passive: !1 }
      ;('ie' !== tt.Browser.type || ('ie' === tt.Browser.type && 8 !== tt.Browser.version)) &&
        (this.element.addEventListener('DOMMouseScroll', this.onWheel),
        this.element.addEventListener('wheel', this.onWheel, t)),
        this.element.addEventListener('mousewheel', this.onWheel, t),
        Xi &&
          (this.element.addEventListener('touchstart', this.onTouch),
          this.element.addEventListener('touchmove', this.onTouch)),
        tn &&
          Qi &&
          ((this.msBodyTouch = document.body.style.msTouchAction),
          (document.body.style.msTouchAction = 'none'),
          this.element.addEventListener('MSPointerDown', this.onTouch, !0),
          this.element.addEventListener('MSPointerMove', this.onTouch, !0)),
        this.config.arrowScrolling && en && this.element.addEventListener('keydown', this.onKey)
    }),
    (nn.prototype._removeListeners = function () {
      var t = { passive: !1 }
      ;('ie' !== tt.Browser.type || ('ie' === tt.Browser.type && 8 !== tt.Browser.version)) &&
        (this.element.removeEventListener('DOMMouseScroll', this.onWheel),
        this.element.removeEventListener('wheel', this.onWheel, t)),
        this.element.removeEventListener('mousewheel', this.onWheel, t),
        Xi &&
          (this.element.removeEventListener('touchstart', this.onTouch),
          this.element.removeEventListener('touchmove', this.onTouch)),
        tn &&
          Qi &&
          ((this.msBodyTouch = document.body.style.msTouchAction),
          (document.body.style.msTouchAction = 'none'),
          this.element.removeEventListener('MSPointerDown', this.onTouch, !0),
          this.element.removeEventListener('MSPointerMove', this.onTouch, !0)),
        this.config.arrowScrolling && en && this.element.removeEventListener('keydown', this.onKey)
    }),
    (nn.prototype.onWheel = function (t) {
      if (!this.state.pause) {
        ;(t = window.event || t).preventDefault && t.preventDefault()
        var e = this.state.delta,
          i = this.config.mouseMult,
          n = this.config.firefoxMult
        'detail' in t && 'wheel' !== t.type && 0 !== t.detail
          ? ((e.y = -1 * t.detail), (e.y *= n))
          : 'wheelDelta' in t && !('wheelDeltaY' in t)
          ? (e.y = -1 * t.wheelDelta)
          : ((e.x = -1 * (t.deltaX || t.wheelDeltaX)),
            (e.y = -1 * (t.deltaY || t.wheelDeltaY)),
            'firefox' === tt.Browser.type && 1 === t.deltaMode && n && ((e.x *= n), (e.y *= n))),
          i && ((e.x *= i), (e.y *= i)),
          (this.state.action = 'wheel'),
          this.update.call(this, t)
      }
    }),
    (nn.prototype.onTouch = function (t) {
      if (!this.state.pause) {
        var e = this.state.position,
          i = this.state.delta,
          n = this.config.touchMult,
          o = t.targetTouches[0]
        'move' === t.action
          ? ((i.x = (o.pageX - e.x) * n), (i.y = (o.pageY - e.y) * n))
          : ((i.x = 0), (i.y = 0)),
          (this.state.action = 'touch'),
          this.update.call(this, t)
      }
    }),
    (nn.prototype.onKey = function (t) {
      if (!this.state.pause && !t.metaKey) {
        var e = this.state.delta,
          i = this.config.keyStep
        switch (t.keyCode) {
          case Ji:
            t.preventDefault && t.preventDefault(), (e.x = 0), (e.y = -i)
            break
          case Gi:
            t.preventDefault && t.preventDefault(), (e.x = 0), (e.y = i)
            break
          case Ki:
            ;(e.x = -i), (e.y = 0)
            break
          case Yi:
            ;(e.x = i), (e.y = 0)
            break
          default:
            return (e.x = 0), void (e.y = 0)
        }
        ;(this.state.action = 'keypress'), this.update.call(this, t)
      }
    }),
    (nn.prototype.clampX = function (t, e, i) {
      ;(this.clamp.enabled = t), (this.clamp.min.x = e || 0), (this.clamp.max.x = i || 0)
    }),
    (nn.prototype.clampY = function (t, e, i) {
      ;(this.clamp.enabled = t), (this.clamp.min.y = e || 0), (this.clamp.max.y = i || 0)
    }),
    (nn.prototype.reset = function () {
      ;(this.state.position = { x: 0, y: 0 }), (this.state.delta = { x: 0, y: 0 })
    }),
    (nn.prototype.setPosX = function (t) {
      this.setPos(t, this.state.position.y)
    }),
    (nn.prototype.setPosY = function (t) {
      this.setPos(this.state.position.x, t)
    }),
    (nn.prototype.moveYBy = function (t) {
      this.setPos(this.state.position.x, this.state.position.y + t)
    }),
    (nn.prototype.getY = function () {
      return this.state.position.y
    }),
    (nn.prototype.setPos = function (t, e) {
      this.clamp.enabled &&
        ((t = Vt(t, this.clamp.min.x, this.clamp.max.x)),
        (e = Vt(e, this.clamp.min.y, this.clamp.max.y))),
        (this.state.position = { x: t, y: e }),
        (this.state.delta = { x: 0, y: 0 }),
        this.element.emit('scroll-update', { x: t, y: e, delta: this.state.delta, action: null })
    }),
    (nn.prototype.destroy = function () {
      var t = this.state.created
      this._removeListeners(),
        (this.state = {
          pause: !1,
          action: null,
          position: { x: 0, y: 0 },
          delta: { x: 0, y: 0 },
          created: !1,
        }),
        t && (this.element = this.element.destroy())
    }),
    ie.proto(on, ne),
    ie.proto(rn, ne),
    (rn.prototype.getContainer = function () {
      return this._container
    }),
    (rn.prototype.scrollInView = function (t, e, i) {
      ;(this.dom.scrollTop = 0), (this.state.skipAnimationOnce = i)
      var n = -t.offsetTop,
        o = t.offsetHeight,
        r = this.dom.clientHeight,
        s = this._container.dom.scrollHeight,
        a = this.scroll.getY(),
        c = a - r
      this._handle.css({ display: s <= r ? 'none' : 'block' }),
        this.scroll.clampY(!0, r - s, 0),
        e
          ? this.scroll.setPosY(n + r / 2 - o / 2)
          : n > a
          ? this.scroll.setPosY(n)
          : n - o < c && this.scroll.setPosY(n + r - o)
    }),
    (rn.prototype._onScrollUpdate = function (t) {
      var e = t.y,
        i = this._handle.dom.offsetHeight,
        n = this.dom.clientHeight,
        o = (Dt(e, 0, n - this._container.dom.scrollHeight, 0, 1) || 0) * (n - i - 4)
      'ie' === tt.Browser.type && 8 === tt.Browser.version
        ? (this._container.css({ top: e }), this._handle.css({ top: o }))
        : (this._container.css({
            transform: 'translateY(' + e + 'px)',
            transition: this.state.skipAnimationOnce ? 'none' : 'transform 300ms',
          }),
          this._handle.css({
            transform: 'translateY(' + o + 'px)',
            transition: this.state.skipAnimationOnce ? 'none' : 'transform 300ms',
          }),
          (this.state.skipAnimationOnce = !1))
    }),
    (rn.prototype.baseStyle = function () {
      this._container.css({ width: '100%', position: 'absolute', overflowY: 'hidden' }),
        this._handle.css({
          position: 'absolute',
          willChange: 'transform',
          width: 3,
          height: 40,
          top: 2,
          right: 5,
          borderRadius: 4,
          backgroundColor: '#6E829E',
        })
    }),
    (rn.prototype.onDestroy = function () {
      this.scroll.destroy && this.scroll.destroy()
    }),
    ie.proto(an, ne),
    (an.prototype.usingKb = function (t) {
      this.state.usingKb = t
    }),
    (an.prototype.select = function () {
      ;(this.state.selected = !0),
        this.setAttribute('aria-selected', this.state.selected),
        this.updateStyle(this.state.usingKb),
        this.emit('select', this)
    }),
    (an.prototype.deselect = function () {
      ;(this.state.selected = !1),
        this.dom && (this.setAttribute('aria-selected', this.state.selected), this.updateStyle())
    }),
    (an.prototype.focus = function () {
      this.dom && (this.dom.focus(), this.emit('focus'))
    }),
    (an.prototype.getOptionData = function () {
      return this.state.option
    }),
    (an.prototype.setCopy = function () {
      this._text.text(ue.translate(this.state.option.text))
    }),
    (an.prototype._onHover = function (t) {
      this.emit('hover', t), this.usingKb(!1), this.updateStyle(t)
    }),
    (an.prototype.updateStyle = function (t) {
      if (this.dom) {
        var e = this.state.theme.get().palette,
          i = this.state.style
        this.css({
          background: this.state.selected ? i.selected.fill : t ? i.hover.fill : i.main.fill,
          color: this.state.option.warn
            ? e.warn.main
            : this.state.selected
            ? i.selected.text
            : t
            ? i.hover.text
            : i.main.text,
          borderColor: this.state.usingKb && t ? i.hover.border : 'transparent',
        }),
          this._separator.css({
            display: this.state.isLast || this.state.selected || t ? 'none' : 'block',
          })
      }
    }),
    (an.prototype.text = function () {
      return this._text.text()
    }),
    (an.prototype.style = function (t) {
      ;(this.state.isLast = t), (this.state.style = sn(this.state.theme.get()))
      this.css({
        position: 'relative',
        cursor: 'pointer',
        height: this.state.height - 6,
        fontSize: 14,
        fontWeight: 400,
        borderWidth: 3,
        borderStyle: 'solid',
        borderColor: 'transparent',
      }),
        this._separator.css({
          position: 'absolute',
          height: 1,
          bottom: -4,
          left: 10,
          right: 10,
          background: this.state.style.main.line,
        }),
        this.updateStyle()
    }),
    ie.proto(cn, rn),
    (cn.prototype.getSelected = function () {
      return this.state.selected && this.state.selected.getOptionData()
    }),
    (cn.prototype.setCopy = function () {
      for (var t = this._options.length; t--; ) this._options[t].setCopy()
    }),
    (cn.prototype.setOptions = function (t) {
      for (var e, i = this._options.length; i--; ) {
        this.getContainer().removeElement(this._options[i])
      }
      for (this._options = [], i = 0; i < t.length; i++) {
        e = this.getContainer().initComponent(an, {
          theme: this.state.theme,
          isMenu: this.state.isMenu,
          size: t.length,
          height: this.state.optionHeight,
          option: t[i],
        })
        var n = i === t.length - 1
        e.usingKb(this.state.usingKb),
          e.style(n),
          this._options.push(e),
          e.on('select', this._onOptionSelect.bind(this, e)),
          e.on('focus', this._onOptionFocus.bind(this, i)),
          e.on('blur', this._onOptionBlur.bind(this, i)),
          e.on('hover', this._onOptionHover.bind(this))
      }
      var o = -1 === this.state.optionsVisible ? this._options.length : this.state.optionsVisible
      this.css({ height: o * this.state.optionHeight })
    }),
    (cn.prototype.select = function (t) {
      for (var e = null, i = this._options.length; i--; ) {
        t === this._options[i].getOptionData().value && (e = this._options[i])
      }
      if (!e) throw new Error('Cannot select a missing option value: ' + t)
      e.select()
    }),
    (cn.prototype.deselect = function () {
      this.state.selected && this.state.selected.deselect(), (this.state.selected = null)
    }),
    (cn.prototype._onOptionSelect = function (t) {
      this.hide(),
        this.state.selected && this.state.selected !== t && this.state.selected.deselect(),
        (this.state.selected = t),
        this.emit('select', t.getOptionData())
    }),
    (cn.prototype._onOptionFocus = function (t) {
      this.state.focusedId = t
      var e = this._options[t],
        i = !this.state.centerOnce && e === this.state.selected
      i && (this.state.centerOnce = !0), this.scrollInView(e.dom, i, i)
    }),
    (cn.prototype._onOptionHover = function () {
      for (var t = this._options.length; t--; ) this._options[t].updateStyle(!1)
    }),
    (cn.prototype._onOptionBlur = function () {
      var t = this
      ;(this.state.focusedId = -1),
        setTimeout(function () {
          t.dom && -1 === t.state.focusedId && t.hide()
        }, 0)
    }),
    (cn.prototype.isVisible = function () {
      return this.state.visible
    }),
    (cn.prototype.hide = function () {
      this.state.visible &&
        ((this.state.visible = !1),
        this.setAttribute('aria-expanded', !1),
        this.css({ display: 'none' }),
        this.emit('hide'))
    }),
    (cn.prototype.open = function () {
      if (!this.state.visible) {
        ;(this.state.centerOnce = !1),
          (this.state.visible = !0),
          this.setAttribute('aria-expanded', !0),
          this.css({ display: 'block' })
        var t = this.state.selected ? this.state.selected : this._options[0]
        t && t.focus(), this.emit('open')
      }
    }),
    (cn.prototype.usingKb = function (t) {
      this.state.usingKb = t
      for (var e = this._options.length; e--; ) this._options[e].usingKb(t)
    }),
    (cn.prototype.style = function (t) {
      var e = (function (t) {
        var e = t.palette,
          i = t.component
        return Bi.merge({ main: { fill: e.common.white, border: '#6E829E' } }, i.list)
      })(this.state.theme.get())
      this.css({
        width: t || 160,
        display: this.isVisible() ? 'block' : 'none',
        zIndex: 100,
        background: e.main.fill,
        boxShadow: 'rgba(0, 0, 0, 0.3) 0px 0px 4px',
        borderWidth: 1,
        borderRadius: 4,
        borderStyle: 'solid',
        borderColor: e.main.border,
        position: 'absolute',
        overflow: 'hidden',
        left: 0,
      }),
        this.getContainer().css({
          lineHeight: this.state.optionHeight - 6,
          whiteSpace: 'nowrap',
          textAlign: 'center',
        })
      for (var i = this._options.length; --i > -1; ) {
        this._options[i].style(i === this._options.length - 1)
      }
      this.baseStyle()
    }),
    (cn.prototype.onKeyPress = function (t) {
      var e = this
      if (27 === t.keyNum) {
        return (
          t.stopPropagation && t.stopPropagation(),
          t.preventDefault && t.preventDefault(),
          void e.hide()
        )
      }
      if (-1 === [13, 32].indexOf(t.keyNum)) {
        if ((this.usingKb(!0), -1 !== [38, 40].indexOf(t.keyNum))) {
          var i = (e.state.focusedId + (38 === t.keyNum ? -1 : 1)) % e._options.length
          return (
            -1 === i && (i = e._options.length - 1),
            t.stopPropagation && t.stopPropagation(),
            t.preventDefault && t.preventDefault(),
            void e._options[i].focus()
          )
        }
        this.state.searchTimer && clearTimeout(this.state.searchTimer),
          (this.state.searchTimer = setTimeout(function () {
            e.state.search = ''
          }, 500)),
          (this.state.search += String.fromCharCode(t.keyCode))
        var n = this._findByValue(this.state.search)
        n && n.focus()
      }
    }),
    (cn.prototype._findByValue = function (t) {
      t = t.toLowerCase()
      for (var e = null, i = this._options.length; i--; ) {
        0 === this._options[i].text().toLowerCase().indexOf(t) && (e = this._options[i])
      }
      return e
    }),
    ie.proto(ln, ne),
    (ln.prototype.setStyle = function (t) {
      t = t || {}
      var e = (function (t) {
        var e = t.palette,
          i = t.component,
          n = 'light' === e.mode
        return Bi.merge(
          {
            main: { fill: e.grey[n ? 100 : 800], border: e.grey[n ? 300 : 200] },
            hover: { fill: e.grey[n ? 200 : 900] },
          },
          i.box,
        )
      })(this._theme.get())
      ;(this.boxState.css.boxSizing = t.boxSizing || this.boxState.css.boxSizing || 'content-box'),
        (this.boxState.css.width = t.width || this.boxState.css.width || '100%'),
        (this.boxState.css.height = t.height || this.boxState.css.height || '100%'),
        (this.boxState.css.padding = t.padding || this.boxState.css.padding || 0),
        (this.boxState.css.margin = t.margin || this.boxState.css.margin || 0),
        (this.boxState.css.borderWidth = t.borderWidth || this.boxState.css.borderWidth || 0),
        (this.boxState.css.borderRadius = t.borderRadius || this.boxState.css.borderRadius || 0),
        (this.boxState.css.borderStyle = t.borderStyle || this.boxState.css.borderStyle || 'solid'),
        (this.boxState.css.borderColor =
          t.borderColor || this.boxState.css.borderColor || e.main.border),
        (this.boxState.css.backgroundColor =
          t.backgroundColor || this.boxState.css.backgroundColor || e.main.fill),
        (this.boxState.css.cursor = t.cursor || this.boxState.css.cursor || 'default'),
        this.css(this.boxState.css)
    }),
    (ln.prototype.setVisible = function (t) {
      ;(this.boxState.visible = t),
        this.setAttribute('aria-hidden', !t),
        this.css({ display: t ? 'block' : 'none' }),
        this._tabbable && this.setAttribute('tabindex', t ? '0' : '-1')
    }),
    (ln.prototype.setAriaLabel = function (t) {
      t
        ? this.setAttribute('aria-label', t)
        : this.boxState.ariaLabel &&
          this.setAttribute('aria-label', ue.translate(this.boxState.ariaLabel))
    }),
    ie.proto(hn, ne),
    (hn.prototype.style = function (t, e, i) {
      e || (e = t),
        i !== undefined && (this.state.thickness = i),
        this.css({
          width: t,
          height: e,
          opacity: this.state.visible ? 1 : 0,
          position: 'absolute',
          left: 0,
          top: 0,
          overflow: 'hidden',
          borderRadius: this.state.rounded,
        }),
        this.$top.css({
          position: 'absolute',
          left: 0,
          top: 0,
          width: t,
          height: this.state.thickness,
          backgroundColor: this.state.color,
        }),
        this.$bottom.css({
          position: 'absolute',
          left: 0,
          bottom: 0,
          width: t,
          height: this.state.thickness,
          backgroundColor: this.state.color,
        }),
        this.$right.css({
          position: 'absolute',
          right: 0,
          top: 0,
          width: this.state.thickness,
          height: e,
          backgroundColor: this.state.color,
        }),
        this.$left.css({
          position: 'absolute',
          left: 0,
          top: 0,
          width: this.state.thickness,
          height: e,
          backgroundColor: this.state.color,
        })
    }),
    (hn.prototype.setVisibility = function (t) {
      ;(this.state.visible = t), this.css({ opacity: t ? 1 : 0 })
    }),
    (hn.prototype.setColor = function (t) {
      ;(this.state.color = t),
        this.$top.css({ backgroundColor: this.state.color }),
        this.$bottom.css({ backgroundColor: this.state.color }),
        this.$right.css({ backgroundColor: this.state.color }),
        this.$left.css({ backgroundColor: this.state.color })
    }),
    (hn.prototype.isVisible = function () {
      return this.state.visible
    }),
    ie.proto(fn, ne),
    (fn.prototype.setUrl = function (t) {
      this.state.url = t
    }),
    (fn.prototype.getUrl = function () {
      return this.state.url
    }),
    (fn.prototype.size = function (t, e) {
      var i = un(this.state.theme.get())
      t && (this.state.width = t),
        e ? (this.state.height = e) : t && (this.state.height = t),
        this.css({
          outlineColor: i.focus.outline,
          display: 'block',
          width: this.state.width,
          height: this.state.height,
        }),
        this.graphic.size(this.state.width, this.state.height)
    }),
    (fn.prototype.onSelect = function (t) {
      t.preventDefault && t.preventDefault(), window.open(this.state.url, '_blank')
    }),
    (fn.prototype.onFocus = function (t) {
      var e = un(this.state.theme.get()).focus.outline
      this.css({ outline: '2px solid ' + e })
    }),
    (fn.prototype.onBlur = function (t) {
      this.css({ outline: 'none' })
    }),
    ie.proto(pn, ne),
    (pn.prototype.size = function (t, e) {
      ;(this.config.size = t || this.config.size), (this._style = dn(this._theme.get()))
      var i = e || this._style.main.fill,
        n = this.state.visible ? 1 : 1.2
      if (
        (this.css({
          width: this.config.size,
          height: this.config.size,
          borderRadius: '50%',
          opacity: this.state.visible ? 1 : 0,
          transition: 'none',
        }),
        this.$fill.css({
          backgroundColor: i,
          width: this.config.size,
          height: this.config.size,
          position: 'absolute',
          transform: 'scale(' + n + ')',
          top: 0,
          left: 0,
          zIndex: 5,
          transition: 'none',
          borderRadius: '50%',
          border: 1,
          borderColor: '#fff',
        }),
        this.$radial.css({
          backgroundColor: i,
          width: this.config.size,
          height: this.config.size,
          transform: 'scale(1)',
          position: 'absolute',
          opacity: 0.5,
          top: 0,
          left: 0,
          zIndex: 0,
          transition: 'none',
          borderRadius: '50%',
        }),
        this.icon)
      ) {
        var o = this._style.main.icon
        this.$wrapper.css({
          width: this.config.size,
          height: this.config.size,
          overflow: 'hidden',
        }),
          this.icon.fill(o),
          this.icon.size(this.config.size, this.config.size),
          this.icon.css({ position: 'absolute', top: 0, left: 0, zIndex: 15 })
      }
    }),
    (pn.prototype.display = function (t, e) {
      this._timer && (this._timer = clearTimeout(this._timer)),
        this.resetAnimation(),
        e
          ? (this._timer = setTimeout(
              function () {
                ;(this.state.visible = t), t ? this.animateIn() : this.animateOut()
              }.bind(this),
              16,
            ))
          : this.reset(t)
    }),
    (pn.prototype.reset = function (t) {
      ;(this.state.visible = t),
        this.css({ transition: 'none', opacity: t ? 1 : 0 }),
        this.icon.css({
          top: t ? 0 : this.config.size / 4,
          opacity: t ? 1 : 0,
          transition: 'none',
        }),
        this.$radial.css({ opacity: 0, transition: 'none' }),
        this.$fill.css({ transition: 'none', transform: 'scale(1)' })
    }),
    (pn.prototype.resetAnimation = function () {
      var t = this.state.visible ? 1 : 0.75
      this.$fill.css({ transition: 'none', transform: 'scale(' + t + ')' }),
        this.$radial.css({ opacity: 0.25, transition: 'none', transform: 'scale(1)' }),
        this.icon.css({
          top: this.state.visible ? 0 : this.config.size / 4,
          opacity: this.state.visible ? 1 : 0,
          transition: 'none',
        })
    }),
    (pn.prototype.animateIn = function () {
      this.css({ transition: 'all 0.25s cubic-bezier(0.33, 1, 0.68, 1)', opacity: 1 }),
        this.$fill.css({
          transition: 'all 0.25s cubic-bezier(.18,1.78,.66,.84) 0.05s',
          transform: 'scale(1)',
        }),
        this.$radial.css({
          opacity: 0,
          transition: 'all 0.35s cubic-bezier(0.33, 1, 0.68, 1) 0.05s',
          transform: 'scale(1.5)',
        }),
        this.icon.css({
          top: 0,
          opacity: 1,
          transition: 'all 0.25s cubic-bezier(0.33, 1, 0.68, 1) 0.05s',
        })
    }),
    (pn.prototype.animateOut = function () {
      this.css({ transition: 'opacity 0.2s cubic-bezier(0.25, 1, 0.5, 1) 0.05s', opacity: 0 }),
        this.$fill.css({
          transition: 'transform 0.2s cubic-bezier(0.25, 1, 0.5, 1) 0.05s',
          transform: 'scale(0.65)',
        }),
        this.$radial.css({ opacity: 0, transition: 'none' }),
        this.icon.css({
          top: -this.config.size / 4,
          opacity: 0,
          transition: 'all 0.2s cubic-bezier(0.25, 1, 0.5, 1)',
        })
    }),
    (pn.prototype.fill = function (t) {
      this.$fill.css({ backgroundColor: t, transition: 'none' }),
        this.$radial.css({ backgroundColor: t, transition: 'none' })
    })
  var mn = {
    __proto__: null,
    Graphic: Pi,
    ListNative: qi,
    ListCustom: cn,
    Link: Hi,
    Logo: fn,
    Span: Mi,
    Markdown: Ri,
    IconButton: $i,
    TextButton: Ui,
    ActionButton: ji,
    RadioButton: zi,
    TextArea: Wi,
    Box: ln,
    Border: hn,
    Badge: pn,
  }
  function yn() {
    ie.self(this, $i, {
      title: 'Close Modal',
      name: 'close',
      src: "data:image/svg+xml,%3csvg width='22' height='22' viewBox='0 0 22 22' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3cpath fill-rule='evenodd' clip-rule='evenodd' d='M17.5669 4.17308C17.1764 3.78256 16.5432 3.78256 16.1527 4.17308L11 9.32578L5.84731 4.17309C5.45678 3.78257 4.82362 3.78257 4.43309 4.17309L4.17308 4.43311C3.78256 4.82363 3.78256 5.4568 4.17308 5.84732L9.32577 11L4.17309 16.1527C3.78257 16.5432 3.78257 17.1764 4.17309 17.5669L4.4331 17.8269C4.82363 18.2174 5.45679 18.2174 5.84732 17.8269L11 12.6742L16.1527 17.8269C16.5432 18.2174 17.1764 18.2174 17.5669 17.8269L17.8269 17.5669C18.2174 17.1764 18.2174 16.5432 17.8269 16.1527L12.6742 11L17.8269 5.84731C18.2174 5.45678 18.2174 4.82362 17.8269 4.43309L17.5669 4.17308Z'/%3e%3c/svg%3e",
      theme: Ti,
      width: 30,
      height: 30,
    })
  }
  function gn() {
    ie.self(this, ne, 'header'),
      (this.state = { visible: !0 }),
      (this.$title = this.createElement('h2', '#modal-title')),
      (this.$underline = this.createElement('.underline')),
      this.setAttribute('role', 'heading')
  }
  function vn(t) {
    var e = t.palette,
      i = t.component,
      n = 'light' === e.mode
    return Bi.merge(
      {
        main: { fill: e.common.white, border: e.grey[n ? 300 : 200] },
        hover: { fill: e.grey[n ? 200 : 700] },
        focus: { outline: e.primary.main },
      },
      i.modal,
    )
  }
  function bn() {
    ie.self(this, ne, 'modal')
    var t = this
    ;(this.state = { visible: !1, curr: null, prev: null }),
      (this._style = vn(Ti.get())),
      this.addClass('no-outline'),
      this.setAttribute('role', 'dialog'),
      this.setAttribute('aria-modal', !0),
      this.setAttribute('tabindex', '0'),
      (this.header = this.initComponent(gn)),
      this.header.on('close', function () {
        t.emit('close')
      }),
      (this.$content = this.createElement('#modal-content')),
      this.$content.addClass('content'),
      this.setAttribute('aria-describedby', 'modal-content'),
      (this.close = this.initComponent(yn)),
      this.close.on('click', function () {
        t.emit('close')
      }),
      this.addEventListener('keydown', function (e) {
        t.dom &&
          9 === e.keyNum &&
          (e.shiftKey
            ? document.activeElement === t.dom &&
              (t.close.focus(), e.preventDefault && e.preventDefault())
            : document.activeElement === t.close.dom &&
              (t.focus(), e.preventDefault && e.preventDefault()))
      }),
      this.addEventListener('focus', function () {
        t.css({ border: '2px solid ' + t._style.focus.outline })
      }),
      this.addEventListener('blur', function () {
        t.css({ border: 'none' })
      })
  }
  function wn(t) {
    ie.self(this, ne, 'copy', 'p')
    var e = this
    t || (t = {}),
      (this.state = {
        text: t.text || '',
        linkUnderline: t.linkUnderline || !1,
        link: t.link || !1,
        linkText: t.linkText || '',
        linkTo: t.linkTo || null,
        replaceText: t.replaceText || null,
      }),
      this.state.link &&
        ((this.link = new Hi({
          theme: Ti,
          text: this.state.linkText,
          url: this.state.linkTo,
          underline: this.state.linkUnderline,
        })),
        this.state.linkTo &&
          this.link.on('click', function (t) {
            e.emit('click', t)
          }))
  }
  ie.proto(yn, $i),
    (yn.size = yn.prototype.size = 30),
    ie.proto(gn, ne),
    (gn.prototype.style = function (t, e) {
      var i = e ? 40 : 44,
        n = Ti.get().palette,
        o = 'light' === n.mode
      return (
        this.$title.css({
          color: o ? n.text.heading : n.grey[700],
          fontWeight: 600,
          textAlign: 'left',
          fontSize: e ? 15 : 16,
          display: this.state.visible ? 'table-cell' : 'none',
          verticalAlign: 'middle',
          paddingTop: 2,
          height: i,
          width: t - yn.size,
        }),
        this.$underline.css({
          backgroundColor: n.primary.main,
          width: t,
          height: 1,
          top: i,
          position: 'absolute',
        }),
        this.css({ width: t, height: i, position: 'relative', top: 0 }),
        { height: i, width: t }
      )
    }),
    (gn.prototype.setCopy = function (t) {
      var e = ue.translate(t)
      this.$title.text(e)
    }),
    (gn.prototype.display = function (t) {
      ;(this.state.visible = t), this.css({ display: t ? 'table-cell' : 'none' })
    }),
    (gn.prototype.isVisible = function () {
      return this.state.visible
    }),
    ie.proto(bn, ne),
    (bn.prototype.load = function () {
      this.close.load()
    }),
    (bn.prototype.style = function (t, e) {
      var i = t < 300
      ;(this._style = vn(Ti.get())),
        this.css({
          width: t,
          maxHeight: e,
          position: 'relative',
          margin: '0 auto',
          backgroundColor: this._style.main.fill,
          display: this.header ? 'block' : 'table',
          borderRadius: 4,
          zIndex: 10,
          overflow: 'hidden',
          border: '1px solid ' + this._style.main.border,
          boxShadow: 'rgba(0, 0, 0, 0.15) 0px 0px 2px',
          padding: '0px 15px 15px',
        }),
        this.header.isVisible()
          ? (this.header.style(t, i),
            this.$content.css({ display: 'block', height: 'auto', marginTop: 10 }))
          : this.$content.css({
              display: 'table-cell',
              verticalAlign: 'middle',
              marginTop: 0,
              height: e,
            }),
        this.close.style(),
        this.close.css({ position: 'absolute', right: 20, top: i ? 5 : 7 })
    }),
    (bn.prototype.setTitle = function (t) {
      t
        ? (this.header.display(!0), this.header.setCopy(t), this.close.setTitle())
        : this.header.display(!1)
    }),
    ie.proto(wn, ne),
    (wn.prototype.style = function (t, e) {
      var i = Ti.get().palette,
        n = 'light' === i.mode
      e || (e = 'center'),
        this.css({
          width: '100%',
          fontSize: t,
          textAlign: e,
          fontWeight: 400,
          color: n ? i.text.body : i.grey[700],
          lineHeight: t + 6,
          display: 'inline',
        }),
        this.state.link && (this.link.style(t), this.link.css({ display: 'inline' }))
    }),
    (wn.prototype.translate = function () {
      var t = ue.translate(this.state.text)
      if (this.state.link) {
        if ((this.link.translate(), this.state.replaceText)) {
          var e = t.split('{{' + this.state.replaceText + '}}'),
            i = document.createTextNode(e[0])
          if ((this.appendElement(i), this.appendElement(this.link), '' !== e[1])) {
            var n = document.createTextNode(e[1])
            this.appendElement(n)
          }
        } else {
          var o = document.createTextNode(t + ' ')
          this.appendElement(o), this.appendElement(this.link)
        }
      } else this.content(t)
    })
  function xn() {
    ie.self(this, ne, 'instructions')
    var t = this
    ;(this.copy = this.initComponent(wn, {
      text: 'hCaptcha is a service that reduces bots and spam by asking simple questions. Please follow the instructions at the top of the screen for each challenge. For more information visit {{site-url}}',
      link: !0,
      linkText: 'hcaptcha.com',
      linkTo:
        'https://www.hcaptcha.com/what-is-hcaptcha-about?ref=' +
        ht.host +
        '&utm_campaign=' +
        ht.sitekey +
        '&utm_medium=embed_about',
      replaceText: 'site-url',
    })),
      this.copy.on('click', function (e) {
        e.preventDefault(), pi(t.copy.state.linkTo)
      })
  }
  function kn() {
    ie.self(this, ne, 'feedback')
    var t = this
    ;(this.info = this.initComponent(Mi, { text: 'Having a problem?' })),
      (this.link = this.initComponent(Hi, { theme: Ti, underline: !0, text: 'Give feedback.' })),
      this.link.on('click', function () {
        t.emit('click')
      })
  }
  function Cn() {
    ie.self(this, ne, 'information')
    var t = this
    ;(this.instructions = this.initComponent(xn, null, this.$content)),
      (this.feedback = this.initComponent(kn, null, this.$content)),
      this.feedback.on('click', function () {
        t.emit('change', 'feedback')
      })
  }
  function _n() {
    ie.self(this, ne, 'actions')
    var t = this
    ;(this.cancel = this.initComponent(ji, {
      theme: Ti,
      selector: 'button-cancel',
      title: 'Cancel',
      type: 'warn',
    })),
      (this.send = this.initComponent(ji, {
        theme: Ti,
        selector: 'button-send',
        title: 'Send',
        type: 'confirm',
      })),
      this.cancel.on('click', function () {
        t.emit('cancel')
      }),
      this.send.on('click', function () {
        t.emit('confirm')
      })
  }
  ie.proto(xn, ne),
    (xn.prototype.style = function (t) {
      this.copy.style(t, 'left')
    }),
    (xn.prototype.setCopy = function () {
      this.copy.translate()
    }),
    ie.proto(kn, ne),
    (kn.prototype.style = function (t) {
      var e = Math.floor(Dt(t, 250, 300, 11, 13)),
        i = Ti.get().palette,
        n = 'light' === i.mode
      this.css({
        textAlign: 'center',
        color: n ? i.text.body : i.grey[700],
        fontSize: e,
        fontWeight: 500,
        width: t,
        margin: '0 auto',
      }),
        this.link.css({ fontWeight: 500, marginLeft: 3 })
    }),
    (kn.prototype.setCopy = function () {
      var t = ue.translate('Provide feedback regarding the hCaptcha service.')
      this.info.translate(), this.link.translate(), this.link.setAttribute('aria-label', t)
    }),
    ie.proto(Cn, ne),
    (Cn.prototype.style = function (t, e, i) {
      var n = Math.floor(Dt(t, 250, 275, 12, 14))
      this.instructions.style(n),
        this.instructions.css({ marginBottom: 10 }),
        this.feedback.style(t)
    }),
    (Cn.prototype.setCopy = function () {
      this.instructions.setCopy(), this.feedback.setCopy()
    }),
    ie.proto(_n, ne),
    (_n.prototype.style = function (t, e, i) {
      this.send.style(),
        this.cancel.style(t, i),
        this.cancel.css({ position: 'absolute', left: 0 }),
        this.send.css({ position: 'absolute', right: 0 })
    }),
    (_n.prototype.setCopy = function () {
      this.cancel.setText(), this.send.setText()
    }),
    (_n.prototype.lockSend = function (t) {
      this.send.lock(t),
        t
          ? this.send.setLabel('Please select an option to send response.')
          : this.send.removeAttribute('aria-label')
    }),
    (_n.prototype.visible = function (t) {
      this.cancel.enable(t), this.send.enable(t)
    })
  function En() {
    ie.self(this, ne, 'instructions'),
      (this.copy = this.initComponent(wn, {
        text: 'Please select Confirm to follow the link, or Cancel to stay on the current screen.',
      }))
  }
  function An(t) {
    ie.self(this, ne, 'navigation')
    var e = this
    ;(this.confirmation = this.initComponent(En)),
      (this.actions = this.initComponent(_n)),
      this.actions.on('confirm', function () {
        window.open(t.url, '_blank'), e.emit('close')
      }),
      this.actions.on('cancel', function () {
        e.emit('close')
      })
  }
  function Sn(t) {
    ie.self(this, ne, 'options'),
      (this.state = { visible: !0 }),
      (this.handeSelect = this.handeSelect.bind(this)),
      (this.$wrapper = this.createElement('.column-wrapper')),
      (this.$left = this.$wrapper.createElement('.column-left')),
      (this.$right = this.$wrapper.createElement('.column-right')),
      (this.options = [])
    for (var e = null, i = null, n = null, o = 0; o < t.length; o++) {
      ;(n = t[o]),
        (i = o >= t.length / 2 ? this.$right : this.$left),
        (e = this.initComponent(zi, { theme: Ti, text: n.text, value: n.value }, i)).setCopy(),
        e.on('select', this.handeSelect),
        this.options.push(e)
    }
  }
  ie.proto(En, ne),
    (En.prototype.style = function (t) {
      this.copy.style(t, 'left')
    }),
    (En.prototype.setCopy = function () {
      this.copy.translate()
    }),
    ie.proto(An, ne),
    (An.prototype.style = function (t, e, i) {
      var n = Math.floor(Dt(t, 250, 275, 12, 14))
      this.confirmation.style(n),
        this.confirmation.css({ marginBottom: 10 }),
        this.actions.style(t, i),
        this.actions.css({
          width: i ? 200 : 220,
          height: 35,
          position: 'relative',
          margin: '10px auto 0px',
        })
    }),
    (An.prototype.setCopy = function () {
      this.confirmation.setCopy(), this.actions.setCopy()
    }),
    ie.proto(Sn, ne),
    (Sn.prototype.style = function (t, e) {
      var i = Math.floor(t / 2)
      this.$left.css({ width: '50%', display: 'inline-block' }),
        this.$right.css({ width: '50%', display: 'inline-block' })
      for (var n = 0; n < this.options.length; n++) this.options[n].style(i)
    }),
    (Sn.prototype.handeSelect = function (t) {
      if (this.state.visible) {
        for (var e = !1, i = 0; i < this.options.length; i++) {
          ;(e = this.options[i] === t) && e === t.state.selected && (e = !e),
            this.options[i].toggle(e)
        }
        this.emit('update', t)
      }
    }),
    (Sn.prototype.visible = function (t) {
      ;(this.state.visible = t), this.css({ display: t ? 'inline-block' : 'none' })
      for (var e = 0; e < this.options.length; e++) this.options[e].lock(!t)
    }),
    (Sn.prototype.setCopy = function () {
      for (var t = 0; t < this.options.length; t++) this.options[t].setCopy()
    })
  var Bn = 'Please provide details and steps to reproduce.',
    Ln = [
      { text: "Can't Solve", value: 'captcha_solve' },
      { text: "Can't Click", value: 'captcha_usability' },
      { text: 'Off Screen', value: 'captcha_position' },
      { text: 'Other', value: 'other' },
    ],
    Tn = 'Please describe your issue.',
    On = [
      { text: 'Inappropriate', value: 'inappropriate' },
      { text: 'Violent', value: 'violent' },
      { text: 'Too Difficult', value: 'difficulty' },
      { text: 'Other', value: 'other' },
    ],
    Hn = 'Please describe your issue.',
    Mn = [
      { text: 'Inappropriate', value: 'content' },
      { text: 'Software Bug', value: 'software' },
      { text: 'Too Difficult', value: 'difficulty' },
      { text: 'Other', value: 'other' },
    ]
  function Rn(t) {
    ie.self(this, ne, 'report')
    var e = this
    this.state = { selected: null, taskKey: t.key, type: t.type }
    var i,
      n,
      o,
      r =
        ((i = t.type),
        (n = Hn),
        (o = Mn),
        'bug' === i ? ((n = Bn), (o = Ln)) : 'image' === i && ((n = Tn), (o = On)),
        { prompt: n, options: o })
    ;(this.options = this.initComponent(Sn, r.options)),
      (this.comment = this.initComponent(Wi, { placeholder: r.prompt, theme: Ti })),
      (this.actions = this.initComponent(_n)),
      this.actions.lockSend(!0),
      this.options.on('update', this.storeAnswer.bind(this)),
      this.actions.on('confirm', this.sendMessage.bind(this)),
      this.actions.on('cancel', function () {
        e.emit('close')
      }),
      this.setAttribute('role', 'radiogroup')
  }
  function Pn() {
    ie.self(this, ne, 'thanks-feedback')
    var t = this
    if (
      ((this.$copy = this.createElement('.feedback-thanks')),
      (this.$resolve = this.createElement('.feedback-resolve')),
      (this.$option = this.createElement('.accessibility-option')),
      (this.$option.content = this.initComponent(
        Mi,
        { theme: Ti, text: 'Please also try turning off your ad blocker.â€' },
        this.$option,
      )),
      (this.$option.link = this.initComponent(
        Hi,
        { theme: Ti, text: 'Our accessibility option may help.' },
        this.$option,
      )),
      (this.$bug = this.createElement('.feedback-bug')),
      (this.$bug.content = this.initComponent(
        Mi,
        { theme: Ti, text: 'Reporting a functionality issue?' },
        this.$bug,
      )),
      (this.$bug.link = this.initComponent(
        Hi,
        { theme: Ti, text: 'See how to report issues with detailed logs.' },
        this.$bug,
      )),
      this.$bug.link.addEventListener('click', function () {
        pi('https://www.hcaptcha.com/reporting-bugs')
      }),
      this.$option.link.on('click', function () {
        pi('https://hcaptcha.com/accessibility')
      }),
      !1 === tt.System.mobile)
    ) {
      var e = function (e) {
        var i = Ti.get().palette,
          n = 'light' === i.mode
        t.$bug.link.css(
          'over' === e.action
            ? { color: i.primary.main, textDecoration: 'underline' }
            : { color: n ? i.text.body : i.grey[700], textDecoration: 'none' },
        )
      }
      this.$bug.link.addEventListener('over', e), this.$bug.link.addEventListener('out', e)
      var i = function (e) {
        var i = Ti.get().palette,
          n = 'light' === i.mode
        t.$option.link.css(
          'over' === e.action
            ? { color: i.primary.main, textDecoration: 'underline' }
            : { color: n ? i.text.body : i.grey[700], textDecoration: 'none' },
        )
      }
      this.$option.link.addEventListener('over', i), this.$option.link.addEventListener('out', i)
    }
  }
  function In() {
    ie.self(this, ne, 'thanks-accessibility')
    var t = this
    ;(this.$sorry = this.createElement('.accessibility-text')),
      (this.$option = this.createElement('.accessibility-option')),
      (this.$avoid = this.createElement('.accessibility-avoid'))
    var e = function (t) {
      pi('https://hcaptcha.com/accessibility')
    }
    if (
      (this.$option.addEventListener('enter', e),
      this.$option.addEventListener('down', e),
      !1 === tt.System.mobile)
    ) {
      var i = function (e) {
        var i = Ti.get().palette,
          n = 'light' === i.mode
        t.$option.css(
          'over' === e.action
            ? { color: i.primary.main, textDecoration: 'underline' }
            : { color: n ? i.text.body : i.grey[700], textDecoration: 'none' },
        )
      }
      this.$option.addEventListener('over', i), this.$option.addEventListener('out', i)
    }
  }
  function Vn() {
    ie.self(this, ne, 'thanks-feedback'),
      (this.$copy = this.createElement('.feedback-thanks')),
      (this.$resolve = this.createElement('.feedback-resolve'))
  }
  function Dn(t) {
    ie.self(this, ne, 'thanks'),
      'accessibility' === t.response
        ? (this.copy = this.initComponent(In, null, this.$content))
        : 'image' === t.response
        ? (this.copy = this.initComponent(Vn, null, this.$content))
        : (this.copy = this.initComponent(Pn, null, this.$content))
  }
  ie.proto(Rn, ne),
    (Rn.prototype.style = function (t, e, i) {
      this.options.style(t, i),
        this.options.css({ marginBottom: 10 }),
        this.comment.style(t, i),
        this.comment.css({ marginTop: 10 }),
        this.actions.style(t, i),
        this.actions.css({
          width: i ? 200 : 220,
          height: 35,
          position: 'relative',
          margin: '10px auto 0px',
        })
    }),
    (Rn.prototype.sendMessage = function () {
      var t = '',
        e = this.comment.getValue()
      this.state.selected && (t = this.state.selected.state.text),
        this.comment.setValue(''),
        this.comment.visible(!1),
        this.options.visible(!1),
        this.actions.visible(!1),
        this.emit('report', { reason: t, comment: e, key: this.state.taskKey }),
        this.emit('change', 'thanks', { response: this.state.type })
    }),
    (Rn.prototype.storeAnswer = function (t) {
      var e = t.state.selected,
        i = 'other' === t.state.value && e
      this.comment.visible(i),
        (this.state.selected = e ? t : null),
        this.actions.lockSend(null === this.selected)
    }),
    (Rn.prototype.setCopy = function (t) {
      this.options.setCopy(), this.comment.setPlaceholder(), this.actions.setCopy()
    }),
    ie.proto(Pn, ne),
    (Pn.prototype.style = function (t, e) {
      var i = Dt(t, 280, 310, 260, 310),
        n = Dt(t, 280, 300, 12, 13),
        o = n + 4,
        r = Ti.get().palette,
        s = 'light' === r.mode
      this.css({
        fontWeight: 500,
        textAlign: 'center',
        fontSize: n + 1,
        lineHeight: n + 4,
        color: s ? r.text.body : r.grey[700],
        width: t,
      }),
        this.$copy.css({ width: i, margin: '0 auto', fontWeight: 600, marginBottom: 2 }),
        this.$resolve.css({
          fontSize: n,
          lineHeight: o,
          width: i,
          margin: '0 auto',
          marginBottom: 10,
        }),
        this.$option.css({ fontSize: n, lineHeight: o, marginBottom: 10 }),
        this.$option.link.css({ fontSize: n, lineHeight: o }),
        this.$bug.css({
          fontSize: n - 1,
          lineHeight: o - 1,
          width: i,
          margin: '0 auto',
          marginBottom: -2,
        }),
        this.$bug.link.css({
          fontSize: n - 1,
          lineHeight: o - 1,
          width: i,
          margin: '0 auto',
          cursor: 'pointer',
        })
    }),
    (Pn.prototype.setCopy = function () {
      var t = ue.translate('Thank you for your feedback.'),
        e = ue.translate("We'll resolve your issue as quickly as we can.")
      this.$copy.text(t),
        this.$resolve.text(e),
        this.$bug.content.translate(),
        this.$bug.link.translate(),
        this.$option.content.translate(),
        this.$option.link.translate()
      var i = ue.translate('View our accessibility option.'),
        n = ue.translate("Give a detailed report of a bug you've encountered.")
      this.$option.link.setAttribute('aria-label', i), this.$bug.link.setAttribute('aria-label', n)
    }),
    ie.proto(In, ne),
    (In.prototype.style = function (t, e) {
      var i = Dt(t, 280, 310, 260, 310),
        n = Dt(t, 280, 300, 12, 13),
        o = n + 4,
        r = Ti.get().palette,
        s = 'light' === r.mode
      this.css({
        fontWeight: 500,
        fontSize: n + 1,
        lineHeight: o,
        textAlign: 'center',
        color: s ? r.text.body : r.grey[700],
        width: t,
      }),
        this.$sorry.css({ fontWeight: 600, width: i, margin: '0 auto', marginBottom: 2 }),
        this.$option.css({
          fontSize: n,
          lineHeight: o,
          color: s ? r.text.body : r.grey[700],
          cursor: 'pointer',
          marginBottom: 10,
        }),
        this.$avoid.css({
          width: i,
          textAlign: 'center',
          fontSize: n,
          lineHeight: o,
          margin: '0 auto',
        })
    }),
    (In.prototype.setCopy = function () {
      var t = ue.translate('Sorry to hear that!'),
        e = ue.translate('Our accessibility option may help.'),
        i = ue.translate(
          'This lets you avoid future questions by registering and setting a cookie.',
        ),
        n = ue.translate('Please also try turning off your ad blocker.â€')
      this.$sorry.text(t + ' '), this.$option.text(e), this.$avoid.text(i + ' ' + n)
    }),
    ie.proto(Vn, ne),
    (Vn.prototype.style = function (t, e) {
      var i = Dt(t, 280, 310, 260, 310),
        n = Dt(t, 280, 300, 12, 13),
        o = n + 4
      this.css({
        fontWeight: 500,
        textAlign: 'center',
        fontSize: n + 1,
        lineHeight: n + 4,
        color: '#707070',
        width: t,
      }),
        this.$copy.css({ width: i, margin: '0 auto', fontWeight: 600, marginBottom: 2 }),
        this.$resolve.css({
          fontSize: n,
          lineHeight: o,
          width: i,
          margin: '0 auto',
          marginBottom: 10,
        })
    }),
    (Vn.prototype.setCopy = function () {
      var t = {
        thanks: ue.translate('Thank you for your feedback.'),
        resolve: ue.translate('We will look into the issue immediately.'),
      }
      this.$copy.text(t.thanks), this.$resolve.text(t.resolve)
    }),
    ie.proto(Dn, bn),
    (Dn.prototype.style = function (t, e, i) {
      this.copy.style(t, i)
    }),
    (Dn.prototype.setCopy = function () {
      this.copy.setCopy()
    }),
    (Dn.prototype.setFocus = function () {
      this.copy.focus()
    })
  var Fn = 'https://newassets.hcaptcha.com/captcha/v1/a8cd801/static/images'
  function $n() {
    ie.self(this, ne, 'cookie-icon'),
      (this.$none = this.initComponent(Pi, {
        selector: '.icon-none',
        src: "data:image/svg+xml,%3csvg width='155' height='155' viewBox='0 0 155 155' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3cmask id='mask0' mask-type='alpha' maskUnits='userSpaceOnUse' x='3' y='4' width='150' height='149'%3e%3cpath d='M153 78C153 119.421 119.421 153 78 153C36.5786 153 3 119.421 3 78C3 42.6044 27.5196 12.9356 60.5 5.0526C66.1145 3.71061 68 4 69.5 5.0526C71.6884 6.5883 62.5 20 69.5 31.5C76.5 43 89.5 39.5 101.5 53C107.488 59.7371 105.376 73.2409 117.5 79C137.5 88.5 151 71 153 78Z' fill='%23555555'/%3e%3c/mask%3e%3cg mask='url(%23mask0)'%3e%3cpath fill-rule='evenodd' clip-rule='evenodd' d='M78 153C119.421 153 153 119.421 153 78C153 36.5786 119.421 3 78 3C36.5786 3 3 36.5786 3 78C3 119.421 36.5786 153 78 153ZM57 41.5C57 45.6421 53.6421 49 49.5 49C45.3579 49 42 45.6421 42 41.5C42 37.3579 45.3579 34 49.5 34C53.6421 34 57 37.3579 57 41.5ZM83 74C83 79.5228 78.5228 84 73 84C67.4772 84 63 79.5228 63 74C63 68.4772 67.4772 64 73 64C78.5228 64 83 68.4772 83 74ZM54 117C54 122.523 49.5229 127 44 127C38.4772 127 34 122.523 34 117C34 111.477 38.4772 107 44 107C49.5229 107 54 111.477 54 117ZM119.5 122C123.642 122 127 118.642 127 114.5C127 110.358 123.642 107 119.5 107C115.358 107 112 110.358 112 114.5C112 118.642 115.358 122 119.5 122ZM32 83C34.7614 83 37 80.7614 37 78C37 75.2386 34.7614 73 32 73C29.2386 73 27 75.2386 27 78C27 80.7614 29.2386 83 32 83ZM88 111C88 113.761 85.7614 116 83 116C80.2386 116 78 113.761 78 111C78 108.239 80.2386 106 83 106C85.7614 106 88 108.239 88 111Z' fill='%23555555'/%3e%3c/g%3e%3c/svg%3e",
        fallback: Fn + '/cookie-none.png',
        width: 18,
      })),
      (this.$blocked = this.initComponent(Pi, {
        selector: '.icon-blocked',
        src: "data:image/svg+xml,%3csvg width='155' height='155' viewBox='0 0 155 155' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3cmask id='mask0' mask-type='alpha' maskUnits='userSpaceOnUse' x='3' y='4' width='150' height='149'%3e%3cpath fill-rule='evenodd' clip-rule='evenodd' d='M78 153C119.421 153 153 119.421 153 78C152.203 75.2117 149.582 76.3107 145.452 78.0421C139.214 80.6575 129.534 84.7159 117.5 79C115.427 78.0152 113.77 76.804 112.418 75.4389L43.3324 144.524C53.7009 149.939 65.4929 153 78 153ZM26.783 132.789L103.528 56.0443C102.962 54.931 102.304 53.9045 101.5 53C95.5 46.25 89.25 43.75 83.625 41.5C78 39.25 73 37.25 69.5 31.5C64.8464 23.8548 67.3474 15.3646 68.904 10.0807C69.6888 7.41648 70.2336 5.56736 69.5 5.05259C68 3.99999 66.1145 3.7106 60.5 5.05259C27.5196 12.9356 3 42.6044 3 78C3 99.6193 12.1474 119.102 26.783 132.789Z' fill='%23EB4040'/%3e%3c/mask%3e%3cg mask='url(%23mask0)'%3e%3cpath fill-rule='evenodd' clip-rule='evenodd' d='M78 153C119.421 153 153 119.421 153 78C153 36.5786 119.421 3 78 3C36.5786 3 3 36.5786 3 78C3 119.421 36.5786 153 78 153ZM57 41.5C57 45.6421 53.6421 49 49.5 49C45.3579 49 42 45.6421 42 41.5C42 37.3579 45.3579 34 49.5 34C53.6421 34 57 37.3579 57 41.5ZM83 74C83 79.5228 78.5228 84 73 84C67.4772 84 63 79.5228 63 74C63 68.4772 67.4772 64 73 64C78.5228 64 83 68.4772 83 74ZM54 117C54 122.523 49.5229 127 44 127C38.4772 127 34 122.523 34 117C34 111.477 38.4772 107 44 107C49.5229 107 54 111.477 54 117ZM119.5 122C123.642 122 127 118.642 127 114.5C127 110.358 123.642 107 119.5 107C115.358 107 112 110.358 112 114.5C112 118.642 115.358 122 119.5 122ZM32 83C34.7614 83 37 80.7614 37 78C37 75.2386 34.7614 73 32 73C29.2386 73 27 75.2386 27 78C27 80.7614 29.2386 83 32 83ZM88 111C88 113.761 85.7614 116 83 116C80.2386 116 78 113.761 78 111C78 108.239 80.2386 106 83 106C85.7614 106 88 108.239 88 111Z' fill='%23E25C5C'/%3e%3c/g%3e%3crect x='140.572' y='19' width='13' height='179' transform='rotate(45 140.572 19)' fill='%23555555'/%3e%3c/svg%3e",
        fallback: Fn + '/cookie-blocked.png',
        width: 18,
      })),
      (this.$found = this.initComponent(Pi, {
        selector: '.icon-found',
        src: "data:image/svg+xml,%3csvg width='155' height='155' viewBox='0 0 155 155' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3cmask id='mask0' mask-type='alpha' maskUnits='userSpaceOnUse' x='3' y='4' width='150' height='149'%3e%3cpath d='M153 78C153 119.421 119.421 153 78 153C36.5786 153 3 119.421 3 78C3 42.6044 27.5196 12.9356 60.5 5.05259C66.1145 3.7106 68 3.99999 69.5 5.05259C71.6884 6.58829 62.5 20 69.5 31.5C76.5 43 89.5 39.5 101.5 53C107.488 59.737 105.376 73.2409 117.5 79C137.5 88.5 151 71 153 78Z' fill='%23555555'/%3e%3c/mask%3e%3cg mask='url(%23mask0)'%3e%3cpath fill-rule='evenodd' clip-rule='evenodd' d='M78 153C119.421 153 153 119.421 153 78C153 36.5786 119.421 3 78 3C36.5786 3 3 36.5786 3 78C3 119.421 36.5786 153 78 153ZM57 41.5C57 45.6421 53.6421 49 49.5 49C45.3579 49 42 45.6421 42 41.5C42 37.3579 45.3579 34 49.5 34C53.6421 34 57 37.3579 57 41.5ZM83 74C83 79.5228 78.5228 84 73 84C67.4772 84 63 79.5228 63 74C63 68.4772 67.4772 64 73 64C78.5228 64 83 68.4772 83 74ZM54 117C54 122.523 49.5229 127 44 127C38.4772 127 34 122.523 34 117C34 111.477 38.4772 107 44 107C49.5229 107 54 111.477 54 117ZM119.5 122C123.642 122 127 118.642 127 114.5C127 110.358 123.642 107 119.5 107C115.358 107 112 110.358 112 114.5C112 118.642 115.358 122 119.5 122ZM32 83C34.7614 83 37 80.7614 37 78C37 75.2386 34.7614 73 32 73C29.2386 73 27 75.2386 27 78C27 80.7614 29.2386 83 32 83ZM88 111C88 113.761 85.7614 116 83 116C80.2386 116 78 113.761 78 111C78 108.239 80.2386 106 83 106C85.7614 106 88 108.239 88 111Z' fill='%2300838f'/%3e%3c/g%3e%3c/svg%3e",
        fallback: Fn + '/cookie-found.png',
        width: 18,
      })),
      'ie' === tt.Browser.type && 8 === tt.Browser.version
        ? (this.$none.css({ display: 'none' }),
          this.$blocked.css({ display: 'none' }),
          this.$found.css({ display: 'none' }))
        : (this.$none.css({ opacity: 0 }),
          this.$blocked.css({ opacity: 0 }),
          this.$found.css({ opacity: 0 }))
  }
  ie.proto($n, ne),
    ($n.prototype.style = function () {
      this.css({
        width: 18,
        height: 18,
        display: 'inline',
        position: 'relative',
        background: 'rgba(0,0,0,0)',
      })
      var t = { '-ms-high-contrast-adjust': 'none', position: 'absolute', left: 0, top: 0 }
      this.$none.css(t), this.$blocked.css(t), this.$found.css(t)
    }),
    ($n.prototype.display = function (t) {
      'ie' === tt.Browser.type && 8 === tt.Browser.version
        ? (this.$none.css({ display: 'none' === t ? 'block' : 'none' }),
          this.$blocked.css({ display: 'blocked' === t ? 'block' : 'none' }),
          this.$found.css({ display: 'found' === t ? 'block' : 'none' }))
        : (this.$none.css({ opacity: 'none' === t ? 1 : 0 }),
          this.$blocked.css({ opacity: 'blocked' === t ? 1 : 0 }),
          this.$found.css({ opacity: 'found' === t ? 1 : 0 }))
    })
  var Un = {
      noAccess: 'Accessibility cookie is not set. {{retrieve-cookie}}',
      hasAccess: 'Cookies are disabled or the accessibility cookie is not set. {{enable-cookies}}',
    },
    jn = 'Accessibility cookie is set. For help, please email {{support}}',
    Nn = 'support@hcaptcha.com'
  function zn() {
    ie.self(this, ne, 'status')
    var t = this
    ;(this.state = { hasCookie: !1, hasAccess: !1, allowedAccess: !1 }),
      (this.$header = this.createElement('.header')),
      (this.$header.copy = this.$header.createElement('.text')),
      this.$header.setAttribute('aria-hidden', !0),
      (this.icon = this.initComponent($n, null, this.$header)),
      (this.retrieve = this.initComponent(wn, {
        text: Un.noAccess,
        link: !0,
        linkText: 'Retrieve accessibility cookie.',
        linkUnderline: !0,
        linkTo: 'https://dashboard.hcaptcha.com/signup?type=accessibility',
        replaceText: 'retrieve-cookie',
      })),
      (this.disabled = this.initComponent(wn, {
        text: Un.hasAccess,
        link: !0,
        linkText: 'Enable cross-site cookies.',
        linkUnderline: !0,
        replaceText: 'enable-cookies',
      })),
      (this.help = this.initComponent(wn, {
        text: jn,
        link: !0,
        linkText: Nn,
        linkUnderline: !0,
        linkTo: 'mailto:' + Nn,
        replaceText: 'support',
      })),
      (this.retrieve.dom.id = 'status-retrieve'),
      (this.disabled.dom.id = 'status-disabled'),
      (this.help.dom.id = 'status-help'),
      this.disabled.on('click', function () {
        Bt.requestAccess().then(function () {
          t.setType()
        })
      })
  }
  ie.proto(zn, ne),
    (zn.prototype.style = function (t) {
      this.css({ fontSize: t, color: '#555555' }),
        this.$header.css({ fontWeight: 600, marginBottom: 5 }),
        this.$header.copy.css({ display: 'inline', position: 'relative' }),
        this.icon.style(),
        this.icon.css({ top: -2, marginLeft: 5 }),
        this.retrieve.style(t, 'left'),
        this.disabled.style(t, 'left'),
        this.help.style(t, 'left')
      var e = this.state.hasCookie
      this.help.css({ display: e ? 'block' : 'none' })
      var i =
        !this.state.hasCookie &&
        (!this.hasAccess || (this.state.hasAccess && !this.state.allowedAccess))
      this.retrieve.css({ display: i ? 'block' : 'none' })
      var n = !this.state.hasCookie && this.state.hasAccess && !this.state.allowedAccess
      this.disabled.css({ display: n ? 'block' : 'none' })
    }),
    (zn.prototype.checkAccess = function () {
      var t = this
      fi.contact('get-ac').then(function (e) {
        ;(t.state.hasCookie = !!e),
          Bt.supportsAPI()
            ? ((t.state.hasAccess = !0),
              Bt.hasAccess().then(function (e) {
                ;(t.state.allowedAccess = e), t.setType()
              }))
            : ((t.state.hasAccess = !1), t.setType())
      })
    }),
    (zn.prototype.setType = function () {
      this.$header.copy.text(ue.translate('Status:'))
      var t = this.state.hasCookie
      this.help.css({ display: t ? 'block' : 'none' })
      var e =
        !this.state.hasCookie &&
        (!this.hasAccess || (this.state.hasAccess && !this.state.allowedAccess))
      this.retrieve.css({ display: e ? 'block' : 'none' })
      var i = !this.state.hasCookie && this.state.hasAccess && !this.state.allowedAccess
      this.disabled.css({ display: i ? 'block' : 'none' })
      var n = this.state.hasCookie ? 'found' : this.state.hasAccess ? 'blocked' : 'none'
      this.icon.display(n)
    }),
    (zn.prototype.translate = function () {
      this.$header.copy.text(ue.translate('Status:')),
        this.retrieve.translate(),
        this.disabled.translate(),
        this.help.translate()
    })
  function Zn() {
    ie.self(this, ne, 'accessibility')
    var t = this
    ;(this.copy = this.initComponent(wn, {
      text: 'To bypass our visual challenge, we offer an accessibility cookie.',
      link: !0,
      linkText: 'Learn more about hCaptcha Accessibility.',
      linkUnderline: !0,
      linkTo:
        'https://hcaptcha.com/accessibility?ref=' +
        ht.host +
        '&utm_campaign=' +
        ht.sitekey +
        '&utm_medium=challenge',
    })),
      this.copy.on('click', function (e) {
        e.preventDefault(), pi(t.copy.state.linkTo)
      }),
      (this.status = this.initComponent(zn)),
      this.status.checkAccess()
  }
  function Wn() {
    ie.self(this, ne, 'challenge-modal'),
      (this.modalContent = null),
      (this.state = { visible: !1, curr: null, prev: null }),
      (this.config = { width: 0, height: 0, mobile: !1 }),
      (this.display = this.display.bind(this)),
      (this.close = this.close.bind(this)),
      (this.$container = this.createElement('.container')),
      (this.modal = this.initComponent(bn, null, this.$container)),
      this.modal.on('close', this.close),
      (this.$bg = this.createElement('.modal-bg')),
      this.$bg.addEventListener('click', this.close)
    var t = 'ie' === tt.Browser.type && 8 === tt.Browser.version
    this.css({ visibility: 'hidden', display: t ? 'none' : 'table', zIndex: -1 })
  }
  function qn() {
    ie.self(this, ne, null, '.challenge-container'),
      (this.handleResize = null),
      (this.handleCheck = null),
      (this.handleFocus = null),
      (this.handleSubmit = null)
  }
  function Kn() {
    ie.self(this, ne, 'display-error'),
      (this.visible = !1),
      this.setAttribute('aria-hidden', !0),
      this.setAttribute('role', 'alert'),
      (this.copy = this.createElement('.error-text')),
      this.appendElement(this.copy),
      this.setCopy.call(this),
      this.css({ opacity: 0 })
  }
  function Yn() {
    ie.self(this, ne, 'Crumb'), (this.$bg = this.createElement('.crumb-bg'))
  }
  function Gn() {
    ie.self(this, ne, 'challenge-breadcrumbs'),
      (this.width = 0),
      (this.size = 0),
      (this.crumbs = []),
      (this.$wrapper = this.createElement('.crumbs-wrapper'))
  }
  ie.proto(Zn, ne),
    (Zn.prototype.style = function (t) {
      var e = Math.floor(Dt(t, 250, 275, 12, 14))
      this.copy.style(e, 'left'),
        this.copy.css({ position: 'relative', display: 'inline' }),
        this.status.style(e),
        this.status.css({ marginTop: 10 })
    }),
    (Zn.prototype.setCopy = function () {
      this.copy.translate(), this.status.translate()
    }),
    ie.proto(Wn, ne),
    (Wn.prototype.load = function () {
      this.modal.load()
    }),
    (Wn.prototype.style = function (t, e, i) {
      var n = Dt(t, 300, 450, 290, 375),
        o = Dt(e, 275, 300, 260, 275),
        r = n - 2 * Dt(t, 300, 450, 20, 25),
        s = 'ie' === tt.Browser.type && 8 === tt.Browser.version
      this.css({
        position: 'absolute',
        width: '100%',
        height: '100%',
        display: s && !this.state.visible ? 'none' : 'table',
        top: 0,
        left: 0,
      }),
        this.$container.css({ display: 'table-cell', verticalAlign: 'middle' }),
        this.$bg.css({
          position: 'fixed',
          width: '100%',
          height: '100%',
          top: 0,
          left: 0,
          backgroundColor: '#000',
          opacity: 0,
          zindex: 0,
          cursor: 'pointer',
        }),
        (this.config.width = r),
        (this.config.height = o),
        (this.config.mobile = i),
        this._styleContent()
    }),
    (Wn.prototype._styleContent = function () {
      this.modal.style(this.config.width, this.config.height),
        this.modalContent &&
          this.modalContent.style(this.config.width, this.config.height, this.config.mobile)
    }),
    (Wn.prototype.close = function () {
      if (this.state.visible) {
        ;(this.state.visible = !1),
          this.modalContent &&
            (this.modalContent.off('close', this.close),
            (this.modalContent = this.modalContent.destroy()))
        var t = 'ie' === tt.Browser.type && 8 === tt.Browser.version
        this.css({ visibility: 'hidden', display: t ? 'none' : 'table', zIndex: -1 }),
          'report_image' === this.state.prev &&
            'thanks' === this.state.curr &&
            this.emit('refresh'),
          this.emit('close')
      }
    }),
    (Wn.prototype.display = function (t, e) {
      var i = this,
        n = null
      e || (e = {}),
        this.modalContent && (this.modalContent = this.modalContent.destroy()),
        (this.state.prev = this.state.curr),
        (this.state.curr = t)
      var o = null
      'info' === t
        ? ((n = Cn), (o = 'Information'))
        : 'link' === t
        ? ((n = An), (o = 'Confirm Navigation'))
        : 'feedback' === t
        ? ((n = Rn), (o = 'Feedback'), (e.type = 'feedback'))
        : 'report_bug' === t
        ? ((n = Rn), (o = 'Software Bug'), (e.type = 'bug'))
        : 'report_image' === t
        ? ((n = Rn), (o = 'Tell Us Why'), (e.type = 'image'))
        : t.indexOf('thanks') >= 0
        ? (n = Dn)
        : t.indexOf('accessibility') >= 0 && ((n = Zn), (o = 'Accessibility')),
        this.state.visible &&
          (this.modal.destroy(),
          (this.modal = this.initComponent(bn, null, this.$container)),
          this.modal.load(),
          this.modal.on('close', this.close)),
        (this.modalContent = this.initComponent(n, e, this.modal.$content)),
        this.modal.setTitle(o),
        this.modalContent.setCopy(),
        this.modalContent.on('close', this.close),
        this.modalContent.on('change', this.display),
        this.modalContent.on('report', function (t) {
          i.emit('report', t)
        }),
        this._styleContent(),
        this.css({ visibility: 'visible', display: 'table', zIndex: 200 }),
        this.modal.focus(),
        (this.state.visible = !0),
        this.emit('open')
    }),
    (Wn.prototype.isOpen = function () {
      return this.state.visible
    }),
    ie.proto(qn, ne),
    (qn.prototype.style = function (t, e) {
      this.css({ width: t, height: e, position: 'relative', zIndex: 0 })
    }),
    (qn.prototype.mount = function (t) {
      var e = this
      this.appendElement(t),
        (this.handleResize = function () {
          e.emit('resize')
        }),
        (this.handleCheck = function (i) {
          var n = 'skip'
          i
            ? (n = t.breadcrumbs && t.served < t.breadcrumbs ? 'next' : 'check')
            : 'landscape' === ht.orientation &&
              t.breadcrumbs &&
              t.served === t.breadcrumbs &&
              (n = 'check'),
            e.emit('action-changed', n)
        }),
        (this.handleFocus = function () {
          e.emit('focus-check')
        }),
        (this.handleSubmit = function () {
          e.emit('submit')
        }),
        t.on && t.on('display-check', this.handleCheck),
        t.on && t.on('challenge-resize', this.handleResize),
        t.on && t.on('focus-check', this.handleFocus),
        t.on && t.on('submit', this.handleSubmit),
        (this.isMounted = !0)
    }),
    (qn.prototype.unmount = function (t) {
      if (t.destroy) {
        try {
          t.off && t.off('display-check', this.handleCheck),
            t.off && t.off('challenge-resize', this.handleResize),
            t.off && t.off('focus-check', this.handleFocus),
            t.off && t.off('submit', this.handleSubmit),
            t.destroy()
        } catch (Qr) {}
      } else this.removeElement(t)
      return (this.isMounted = !1), null
    }),
    ie.proto(Kn, ne),
    (Kn.prototype.style = function (t) {
      var e = Ti.get().palette,
        i = 'landscape' === ht.orientation && 'image_label_binary' === ht.challenge_type
      this.copy.css({ display: 'table-cell', verticalAlign: 'middle' }),
        this.css({
          display: 'table',
          fontSize: t,
          color: e.warn.main,
          width: '100%',
          textAlign: i ? 'left' : 'right',
        })
    }),
    (Kn.prototype.display = function (t) {
      this.css({ opacity: t ? 1 : 0 }), (this.visible = t), this.setAttribute('aria-hidden', !t)
    }),
    (Kn.prototype.setCopy = function () {
      var t = ue.translate('Please try again.')
      this.copy.text(t + '  âš ï¸')
    }),
    ie.proto(Yn, ne),
    (Yn.prototype.style = function (t) {
      this.css({ width: t, height: t, overflow: 'hidden', borderRadius: '50%' }),
        this.$bg.css({ width: t, height: t })
    }),
    (Yn.prototype.active = function (t) {
      var e = (function (t) {
        var e = t.palette,
          i = t.component
        return Bi.merge(
          { main: { fill: e.grey[200] }, active: { fill: e.primary.main } },
          i.breadcrumb,
        )
      })(Ti.get())
      this.$bg.css({ backgroundColor: t ? e.active.fill : e.main.fill })
    }),
    (Yn.prototype.hide = function () {
      this.css({ opacity: 0 })
    }),
    ie.proto(Gn, ne),
    (Gn.prototype.createCrumbs = function (t) {
      this.display = !0
      for (var e = null, i = 0; i < t; i++) {
        ;(e = this.initComponent(Yn, null, this.$wrapper)), this.crumbs.push(e)
      }
    }),
    (Gn.prototype.removeCrumbs = function () {
      if (((this.display = !1), 0 !== this.crumbs.length)) {
        for (var t = -1; ++t < this.crumbs.length; ) this.crumbs[t].destroy()
        this.crumbs = []
      }
    }),
    (Gn.prototype.style = function (t, e) {
      for (var i = e ? 6 : 7, n = e ? 4 : 5, o = -1; ++o < this.crumbs.length; ) {
        this.crumbs[o].style(i),
          this.crumbs[o].css({ left: o * i + o * n, top: 0, position: 'absolute' })
      }
      this.css({ width: t, height: i })
      var r = this.crumbs.length * i + n * (this.crumbs.length - 1)
      this.$wrapper.css({ width: r, height: i, position: 'absolute', left: (t - r) / 2 }),
        (this.size = i),
        (this.width = t),
        (this.mobile = e)
    }),
    (Gn.prototype.setIndex = function (t) {
      for (var e = -1; ++e < this.crumbs.length; ) this.crumbs[e].active(t === e)
    }),
    (Gn.prototype.hide = function () {
      for (var t = -1; ++t < this.crumbs.length; ) this.crumbs[t].hide()
    })
  function Jn() {
    ie.self(this, $i, {
      selector: '#menu-info',
      title: 'Get information about hCaptcha and accessibility options.',
      label: 'Get information about hCaptcha and accessibility options.',
      name: 'info',
      src: "data:image/svg+xml,%3csvg width='25' height='25' viewBox='0 0 25 25' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3ccircle cx='12.5' cy='21.6' r='2' fill='%23787878'/%3e%3ccircle cx='12.5' cy='12.5' r='2' fill='%23787878'/%3e%3ccircle cx='12.5' cy='3.40002' r='2' fill='%23787878'/%3e%3c/svg%3e",
      theme: Ti,
      width: 35,
      height: 35,
    }),
      (this._ignoreHighlight = !1)
  }
  ie.proto(Jn, $i),
    (Jn.prototype.focus = function (t) {
      ;(this._ignoreHighlight = t), this.dom.focus()
    }),
    (Jn.prototype.onFocus = function (t) {
      if (this._ignoreHighlight) this._ignoreHighlight = !1
      else {
        var e = this.state.style.focus.outline
        this.css({ outline: '2px solid ' + e })
      }
    })
  function Xn() {
    ie.self(this, $i, {
      title: 'Refresh Challenge.',
      label: 'Refresh Challenge.',
      name: 'refresh',
      src: "data:image/svg+xml,%3csvg width='25' height='25' viewBox='0 0 25 25' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M20.9148 19.6529C20.9994 19.7239 21.0106 19.8501 20.9381 19.9335C19.5234 21.5598 17.6702 22.7467 15.5981 23.3506C13.4619 23.9733 11.1891 23.9485 9.06708 23.2794C6.94502 22.6103 5.06902 21.327 3.67632 19.5917C2.28361 17.8564 1.43675 15.7471 1.24283 13.5306C1.0489 11.314 1.51662 9.08969 2.58684 7.13894C3.65706 5.18818 5.28171 3.5986 7.25535 2.57119C9.22898 1.54378 11.463 1.12469 13.6748 1.36692C15.8203 1.6019 17.8514 2.44889 19.527 3.80487C19.6129 3.87435 19.6238 4.00065 19.5528 4.08527L18.3637 5.50245C18.2927 5.58707 18.1666 5.5979 18.0805 5.5288C16.746 4.45867 15.1329 3.79007 13.4298 3.60355C11.6604 3.40977 9.87319 3.74503 8.29428 4.56696C6.71537 5.38889 5.41565 6.66056 4.55948 8.22116C3.7033 9.78176 3.32913 11.5612 3.48427 13.3345C3.63941 15.1077 4.3169 16.7952 5.43106 18.1834C6.54522 19.5716 8.04602 20.5982 9.74367 21.1335C11.4413 21.6688 13.2596 21.6886 14.9685 21.1905C16.6133 20.7111 18.0858 19.7725 19.2142 18.4869C19.287 18.4039 19.413 18.3927 19.4976 18.4637L20.9148 19.6529Z' fill='%23787878'/%3e%3cpath d='M22.7248 7.93974C22.7557 8.07007 22.6522 8.19336 22.5185 8.18555L14.9712 7.74462C14.807 7.73502 14.7239 7.54239 14.8297 7.4164L20.6321 0.501257C20.7379 0.375269 20.942 0.423631 20.98 0.583657L22.7248 7.93974Z' fill='%23787878'/%3e%3c/svg%3e",
      theme: Ti,
      width: 35,
      height: 35,
      selectable: !1,
    })
  }
  function Qn(t) {
    var e = t.palette,
      i = t.component
    return Bi.merge(
      {
        main: { fill: e.primary.main, text: e.common.white, border: e.primary.main },
        hover: { fill: e.primary.main, text: e.common.white, border: e.primary.main },
        focus: { outline: e.primary.main },
      },
      i.verifyButton,
    )
  }
  function to(t) {
    var e = t.palette,
      i = t.component
    return Bi.merge(
      {
        main: { fill: e.grey[700], text: e.common.white, border: e.grey[700] },
        hover: { fill: e.grey[800], text: e.common.white, border: e.grey[800] },
        focus: { outline: e.primary.main },
      },
      i.skipButton,
    )
  }
  function eo() {
    ie.self(this, ne, 'button-submit'),
      (this.state = { text: 'Check', type: 'check', label: 'Verify Answers', locked: !1 }),
      (this._verifyStyle = Qn(Ti.get())),
      (this._skipStyle = to(Ti.get())),
      (this.copy = this.createElement('.text')),
      this.addClass('button'),
      this.setAttribute('tabindex', 0),
      this.setAttribute('role', 'button'),
      this.setLabel.call(this),
      (this.onHover = this.onHover.bind(this)),
      (this.onSelect = this.onSelect.bind(this)),
      (this.onFocus = this.onFocus.bind(this)),
      (this.onBlur = this.onBlur.bind(this)),
      this.addEventListener('click', this.onSelect),
      this.addEventListener('enter', this.onSelect),
      this.addEventListener('focus', this.onFocus),
      this.addEventListener('blur', this.onBlur),
      !1 === tt.System.mobile &&
        (this.addEventListener('over', this.onHover), this.addEventListener('out', this.onHover))
  }
  function io() {
    ie.self(this, ne, 'interface-challenge')
    var t = this
    ;(this.state = { loaded: !1, action: null, locked: !1, visible: !1, whiteLabel: !1 }),
      (this.text = this.initComponent(Kn)),
      (this.breadcrumbs = this.initComponent(Gn)),
      (this.submit = this.initComponent(eo)),
      this.submit.on('click', function () {
        t.emit('submit')
      })
  }
  function no(t) {
    ie.self(this, Ui, { selector: 'display-language', theme: Ti, width: 26, height: 16 })
    var e = this
    ;(this._theme = t.theme),
      this.on('style', function () {
        e.css({ display: 'block' })
      })
  }
  function oo() {
    ie.self(this, ne, 'language-selector')
    var t = this
    this.state = { locked: !1 }
    var e = tt.System.mobile
    ;(this.list = this.initComponent(e ? qi : cn, {
      theme: Ti,
      selector: '#language-list',
      optionsVisible: 5,
    })),
      (this.display = this.initComponent(no, { theme: Ti })),
      this.display.ownsListBox(this.list)
    var i = []
    for (var n in ce) i.push({ value: n, text: ce[n] })
    this.list.setOptions(i),
      this.list.on('select', function (e) {
        t.display.setLocale(e.value),
          e.value !== ue.getLocale() &&
            (ue.setLocale(e.value), fi.send('challenge-language', { locale: e.value }))
      }),
      e ||
        this.display.on('click', function (e) {
          e.selected ? (t.list.usingKb && t.list.usingKb(e.usingKb), t.list.open()) : t.list.hide()
        }),
      this.list.on('hide', function () {
        t.display.reset()
      }),
      this.style(),
      this.updateLocale()
  }
  ie.proto(Xn, $i),
    ie.proto(eo, ne),
    (eo.prototype.style = function (t) {
      var e = t ? 30 : 35,
        i = 'check' === this.state.type || 'next' === this.state.type
      ;(this._verifyStyle = Qn(Ti.get())), (this._skipStyle = to(Ti.get()))
      var n = (function (t) {
        try {
          var e = t.palette
          return t.component && t.component.challenge
            ? t.component.challenge.main.fill
            : e.common && e.common.white
            ? e.common.white
            : '#FFF'
        } catch (Qr) {
          return '#FFF'
        }
      })(Ti.get())
      this.css({
        height: e,
        cursor: 'pointer',
        minWidth: t ? 50 : 70,
        padding: '0px 5px',
        outlineColor: 'none',
        borderRadius: 4,
        border: '2px solid ' + n,
      })
      var o = i ? this._verifyStyle.main.text : this._skipStyle.main.text
      this.copy.css({
        color: o,
        width: '100%',
        height: '100%',
        textAlign: 'center',
        position: 'relative',
        pointerEvents: 'none',
        lineHeight: e,
        fontSize: 14,
        fontWeight: 600,
        zIndex: 5,
      }),
        (this.height = e)
    }),
    (eo.prototype.action = function (t) {
      var e,
        i = t.charAt(0).toUpperCase() + t.slice(1),
        n =
          'check' === t || 'next' === t || 'report' === t
            ? this._verifyStyle.main.fill
            : this._skipStyle.main.fill
      'check' === t
        ? (e = 'Verify Answers')
        : 'next' === t
        ? (e = 'Next Challenge')
        : 'report' === t
        ? (e = 'Report Images')
        : ((e = 'Skip Challenge'), (t = 'skip')),
        (this.state.type = t),
        (this.state.text = i),
        (this.state.label = e),
        this.css({ backgroundColor: n }),
        this.setLabel.call(this)
    }),
    (eo.prototype.onHover = function (t) {
      if (null !== this.emit && !0 !== this.state.locked) {
        var e = 'over' === t.action,
          i =
            'check' === this.state.type || 'next' === this.state.type
              ? this._verifyStyle
              : this._skipStyle,
          n = e ? 'hover' : 'main'
        this.css({ backgroundColor: i[n].fill })
      }
    }),
    (eo.prototype.onSelect = function (t) {
      null !== this.emit && !0 !== this.state.locked && this.emit('click', t)
    }),
    (eo.prototype.onFocus = function (t) {
      var e = 'check' === this.state.type ? '_verifyStyle' : '_skipStyle',
        i = this[e].focus.border || this[e].focus.outline
      this.css({ outline: '2px solid ' + i })
    }),
    (eo.prototype.onBlur = function (t) {
      this.css({ outline: 'none' })
    }),
    (eo.prototype.setLock = function (t) {
      this.state.locked = t
      var e =
        'check' === this.state.type || 'next' === this.state.type
          ? this._verifyStyle
          : this._skipStyle
      this.css({ cursor: t ? 'default' : 'pointer', backgroundColor: e.main.fill })
    }),
    (eo.prototype.setLabel = function () {
      var t = ue.translate(this.state.text),
        e = ue.translate(this.state.label)
      ue.getLocale().indexOf('en') >= 0 && 'check' === this.state.type && (t = 'Verify'),
        this.copy.text(t),
        this.setAttribute('title', e),
        this.setAttribute('aria-label', e)
    }),
    (eo.prototype.getElement = function () {
      return (this && this.dom) || null
    }),
    ie.proto(io, ne),
    (io.prototype.removeCrumbs = function () {
      this.breadcrumbs.removeCrumbs()
    }),
    (io.prototype.style = function (t, e, i) {
      var n = 'landscape' === ht.orientation && 'image_label_binary' === ht.challenge_type,
        o = n ? e : 16
      this.breadcrumbs.display &&
        (this.breadcrumbs.style(t, i),
        this.breadcrumbs.css({ position: 'absolute', top: (o - this.breadcrumbs.size) / 2 }))
      var r = i ? 11 : 12
      return (
        this.text.style(r),
        this.text.css({
          position: 'absolute',
          height: o,
          top: 0,
          right: n ? 'auto' : 0,
          left: n ? 0 : 'auto',
          width: n ? 140 : '100%',
        }),
        this.submit.style(i),
        this.submit.css({ position: 'absolute', right: 0, bottom: 0, zIndex: 100 }),
        this.css({ width: t, height: e }),
        { width: t, height: e }
      )
    }),
    (io.prototype.setAction = function (t) {
      ;(this.state.action = t), this.submit.action(t)
    }),
    (io.prototype.getAction = function () {
      return this.state.action
    }),
    (io.prototype.displayTryAgain = function (t) {
      this.text.display(t)
    }),
    (io.prototype.setWhiteLabelEnabled = function (t) {
      this.state.whiteLabel = t
    }),
    (io.prototype.translate = function () {
      this.text.setCopy(), this.submit.setLabel()
    }),
    (io.prototype.setLock = function (t) {
      ;(this.state.locked = t), this.submit.setLock(t)
    }),
    (io.prototype.isLocked = function () {
      return this.state.locked
    }),
    ie.proto(no, Ui),
    (no.prototype.setLocale = function (t) {
      this.setText(ue.getShortLocale(t).toUpperCase())
    }),
    (no.prototype.style = function () {
      var t = (function (t) {
          var e = t.palette,
            i = t.component
          return Bi.merge({ focus: { outline: e.primary.main } }, i.button)
        })(this._theme.get()),
        e = 'landscape' === ht.orientation && 'image_label_binary' === ht.challenge_type,
        i = e ? 14 : 11,
        n = e ? 35 : 26,
        o = e ? 35 : 16
      ;(this.state.width = n),
        (this.state.height = o),
        this.css({
          display: 'table',
          cursor: 'pointer',
          textAlign: 'center',
          fontWeight: 600,
          width: n,
          height: o,
          fontSize: i,
          outlineColor: t.focus.outline,
          borderRadius: 4,
        }),
        this.$text.css({ display: 'table-cell', verticalAlign: 'middle' })
    }),
    ie.proto(oo, ne),
    (oo.prototype.style = function (t) {
      var e = 'landscape' === ht.orientation && 'image_label_binary' === ht.challenge_type
      this.display.style(),
        this.css({
          position: 'relative',
          display: 'inline-block',
          top: t ? 5 : 10,
          left: 0,
          zIndex: 100,
        }),
        this.list.style(),
        this.list.css({ bottom: e ? -128 : 30, left: e ? 45 : 'auto' })
    }),
    (oo.prototype.getDimensions = function () {
      return { width: this.display.getWidth(), height: this.display.getHeight() }
    }),
    (oo.prototype.setLabel = function () {
      var t = this.list.getSelected().text,
        e = ue.translate('Select a language {{language}}', { language: t })
      this.display.setLabel(e), this.display.setTitle(ue.translate('Language'))
    }),
    (oo.prototype.updateLocale = function () {
      this.list.select(ue.getLocale())
    }),
    (oo.prototype.setVisible = function (t) {
      this.css({ display: t ? 'block' : 'none ' })
    }),
    (oo.prototype.setLock = function (t) {
      ;(this.state.locked = t),
        t ? this.list.setAttribute('disabled', t) : this.list.removeAttribute('disabled')
    })
  function ro(t) {
    ie.self(this, ne, 'hcaptcha-logo'), (this.mobile = !1), (this.charity = t)
    var e = this.charity
        ? "data:image/svg+xml,%3csvg id='logo_charity' role='img' aria-hidden='true' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 500 500'%3e%3crect x='306.25' y='418.75' width='56.25' height='56.25' style='fill:%230074bf%3bopacity:0.5%3bisolation:isolate'/%3e%3crect x='250' y='418.75' width='56.25' height='56.25' style='fill:%230074bf%3bopacity:0.699999988079071%3bisolation:isolate'/%3e%3crect x='193.75' y='418.75' width='56.25' height='56.25' style='fill:%230074bf%3bopacity:0.699999988079071%3bisolation:isolate'/%3e%3crect x='137.5' y='418.75' width='56.25' height='56.25' style='fill:%230074bf%3bopacity:0.5%3bisolation:isolate'/%3e%3crect x='362.5' y='362.5' width='56.25' height='56.25' style='fill:%230082bf%3bopacity:0.699999988079071%3bisolation:isolate'/%3e%3crect x='306.25' y='362.5' width='56.25' height='56.25' style='fill:%230082bf%3bopacity:0.800000011920929%3bisolation:isolate'/%3e%3crect x='250' y='362.5' width='56.25' height='56.25' style='fill:%230082bf'/%3e%3crect x='193.75' y='362.5' width='56.25' height='56.25' style='fill:%230082bf'/%3e%3crect x='137.5' y='362.5' width='56.25' height='56.25' style='fill:%230082bf%3bopacity:0.800000011920929%3bisolation:isolate'/%3e%3crect x='81.25' y='362.5' width='56.25' height='56.25' style='fill:%230082bf%3bopacity:0.699999988079071%3bisolation:isolate'/%3e%3crect x='418.75' y='306.25' width='56.25' height='56.25' style='fill:%23008fbf%3bopacity:0.5%3bisolation:isolate'/%3e%3crect x='362.5' y='306.25' width='56.25' height='56.25' style='fill:%23008fbf%3bopacity:0.800000011920929%3bisolation:isolate'/%3e%3crect x='306.25' y='306.25' width='56.25' height='56.25' style='fill:%23008fbf'/%3e%3crect x='250' y='306.25' width='56.25' height='56.25' style='fill:%23008fbf'/%3e%3crect x='193.75' y='306.25' width='56.25' height='56.25' style='fill:%23008fbf'/%3e%3crect x='137.5' y='306.25' width='56.25' height='56.25' style='fill:%23008fbf'/%3e%3crect x='81.25' y='306.25' width='56.25' height='56.25' style='fill:%23008fbf%3bopacity:0.800000011920929%3bisolation:isolate'/%3e%3crect x='25' y='306.25' width='56.25' height='56.25' style='fill:%23008fbf%3bopacity:0.5%3bisolation:isolate'/%3e%3crect x='418.75' y='250' width='56.25' height='56.25' style='fill:%23009dbf%3bopacity:0.699999988079071%3bisolation:isolate'/%3e%3crect x='362.5' y='250' width='56.25' height='56.25' style='fill:%23009dbf'/%3e%3crect x='306.25' y='250' width='56.25' height='56.25' style='fill:%23009dbf'/%3e%3crect x='250' y='250' width='56.25' height='56.25' style='fill:%23009dbf'/%3e%3crect x='193.75' y='250' width='56.25' height='56.25' style='fill:%23009dbf'/%3e%3crect x='137.5' y='250' width='56.25' height='56.25' style='fill:%23009dbf'/%3e%3crect x='81.25' y='250' width='56.25' height='56.25' style='fill:%23009dbf'/%3e%3crect x='25' y='250' width='56.25' height='56.25' style='fill:%23009dbf%3bopacity:0.699999988079071%3bisolation:isolate'/%3e%3crect x='418.75' y='193.75' width='56.25' height='56.25' style='fill:%2300abbf%3bopacity:0.699999988079071%3bisolation:isolate'/%3e%3crect x='362.5' y='193.75' width='56.25' height='56.25' style='fill:%2300abbf'/%3e%3crect x='306.25' y='193.75' width='56.25' height='56.25' style='fill:%2300abbf'/%3e%3crect x='250' y='193.75' width='56.25' height='56.25' style='fill:%2300abbf'/%3e%3crect x='193.75' y='193.75' width='56.25' height='56.25' style='fill:%2300abbf'/%3e%3crect x='137.5' y='193.75' width='56.25' height='56.25' style='fill:%2300abbf'/%3e%3crect x='81.25' y='193.75' width='56.25' height='56.25' style='fill:%2300abbf'/%3e%3crect x='25' y='193.75' width='56.25' height='56.25' style='fill:%2300abbf%3bopacity:0.699999988079071%3bisolation:isolate'/%3e%3crect x='418.75' y='137.5' width='56.25' height='56.25' style='fill:%2300b9bf%3bopacity:0.5%3bisolation:isolate'/%3e%3crect x='362.5' y='137.5' width='56.25' height='56.25' style='fill:%2300b9bf%3bopacity:0.800000011920929%3bisolation:isolate'/%3e%3crect x='306.25' y='137.5' width='56.25' height='56.25' style='fill:%2300b9bf'/%3e%3crect x='250' y='137.5' width='56.25' height='56.25' style='fill:%2300b9bf'/%3e%3crect x='193.75' y='137.5' width='56.25' height='56.25' style='fill:%2300b9bf'/%3e%3crect x='137.5' y='137.5' width='56.25' height='56.25' style='fill:%2300b9bf'/%3e%3crect x='81.25' y='137.5' width='56.25' height='56.25' style='fill:%2300b9bf%3bopacity:0.800000011920929%3bisolation:isolate'/%3e%3crect x='25' y='137.5' width='56.25' height='56.25' style='fill:%2300b9bf%3bopacity:0.5%3bisolation:isolate'/%3e%3crect x='362.5' y='81.25' width='56.25' height='56.25' style='fill:%2300c6bf%3bopacity:0.699999988079071%3bisolation:isolate'/%3e%3crect x='306.25' y='81.25' width='56.25' height='56.25' style='fill:%2300c6bf%3bopacity:0.800000011920929%3bisolation:isolate'/%3e%3crect x='250' y='81.25' width='56.25' height='56.25' style='fill:%2300c6bf'/%3e%3crect x='193.75' y='81.25' width='56.25' height='56.25' style='fill:%2300c6bf'/%3e%3crect x='137.5' y='81.25' width='56.25' height='56.25' style='fill:%2300c6bf%3bopacity:0.800000011920929%3bisolation:isolate'/%3e%3crect x='81.25' y='81.25' width='56.25' height='56.25' style='fill:%2300c6bf%3bopacity:0.699999988079071%3bisolation:isolate'/%3e%3crect x='306.25' y='25' width='56.25' height='56.25' style='fill:%2300d4bf%3bopacity:0.5%3bisolation:isolate'/%3e%3crect x='250' y='25' width='56.25' height='56.25' style='fill:%2300d4bf%3bopacity:0.699999988079071%3bisolation:isolate'/%3e%3crect x='193.75' y='25' width='56.25' height='56.25' style='fill:%2300d4bf%3bopacity:0.699999988079071%3bisolation:isolate'/%3e%3crect x='137.5' y='25' width='56.25' height='56.25' style='fill:%2300d4bf%3bopacity:0.5%3bisolation:isolate'/%3e%3cpath d='M190.87%2c158.6c36.33%2c0%2c46.52%2c26.05%2c59.6%2c34.41%2c12.11-8.36%2c22.29-34.41%2c59.59-34.41%2c36.34%2c0%2c65.18%2c29.8%2c66%2c67%2c2.78%2c54-90.26%2c135.93-125.63%2c159.19-36.34-23.26-128.42-105.16-126.6-159.19C125.69%2c188.4%2c153.56%2c158.6%2c190.87%2c158.6Z' style='fill:white'/%3e%3c/svg%3e"
        : "data:image/svg+xml,%3csvg width='32' height='32' viewBox='0 0 32 32' role='img' aria-hidden='true' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3cpath opacity='0.5' d='M24 28H20V32H24V28Z' fill='%230074BF'/%3e%3cpath opacity='0.7' d='M20 28H16V32H20V28Z' fill='%230074BF'/%3e%3cpath opacity='0.7' d='M16 28H12V32H16V28Z' fill='%230074BF'/%3e%3cpath opacity='0.5' d='M12 28H8V32H12V28Z' fill='%230074BF'/%3e%3cpath opacity='0.7' d='M28 24H24V28H28V24Z' fill='%230082BF'/%3e%3cpath opacity='0.8' d='M24 24H20V28H24V24Z' fill='%230082BF'/%3e%3cpath d='M20 24H16V28H20V24Z' fill='%230082BF'/%3e%3cpath d='M16 24H12V28H16V24Z' fill='%230082BF'/%3e%3cpath opacity='0.8' d='M12 24H8V28H12V24Z' fill='%230082BF'/%3e%3cpath opacity='0.7' d='M8 24H4V28H8V24Z' fill='%230082BF'/%3e%3cpath opacity='0.5' d='M32 20H28V24H32V20Z' fill='%23008FBF'/%3e%3cpath opacity='0.8' d='M28 20H24V24H28V20Z' fill='%23008FBF'/%3e%3cpath d='M24 20H20V24H24V20Z' fill='%23008FBF'/%3e%3cpath d='M20 20H16V24H20V20Z' fill='%23008FBF'/%3e%3cpath d='M16 20H12V24H16V20Z' fill='%23008FBF'/%3e%3cpath d='M12 20H8V24H12V20Z' fill='%23008FBF'/%3e%3cpath opacity='0.8' d='M8 20H4V24H8V20Z' fill='%23008FBF'/%3e%3cpath opacity='0.5' d='M4 20H0V24H4V20Z' fill='%23008FBF'/%3e%3cpath opacity='0.7' d='M32 16H28V20H32V16Z' fill='%23009DBF'/%3e%3cpath d='M28 16H24V20H28V16Z' fill='%23009DBF'/%3e%3cpath d='M24 16H20V20H24V16Z' fill='%23009DBF'/%3e%3cpath d='M20 16H16V20H20V16Z' fill='%23009DBF'/%3e%3cpath d='M16 16H12V20H16V16Z' fill='%23009DBF'/%3e%3cpath d='M12 16H8V20H12V16Z' fill='%23009DBF'/%3e%3cpath d='M8 16H4V20H8V16Z' fill='%23009DBF'/%3e%3cpath opacity='0.7' d='M4 16H0V20H4V16Z' fill='%23009DBF'/%3e%3cpath opacity='0.7' d='M32 12H28V16H32V12Z' fill='%2300ABBF'/%3e%3cpath d='M28 12H24V16H28V12Z' fill='%2300ABBF'/%3e%3cpath d='M24 12H20V16H24V12Z' fill='%2300ABBF'/%3e%3cpath d='M20 12H16V16H20V12Z' fill='%2300ABBF'/%3e%3cpath d='M16 12H12V16H16V12Z' fill='%2300ABBF'/%3e%3cpath d='M12 12H8V16H12V12Z' fill='%2300ABBF'/%3e%3cpath d='M8 12H4V16H8V12Z' fill='%2300ABBF'/%3e%3cpath opacity='0.7' d='M4 12H0V16H4V12Z' fill='%2300ABBF'/%3e%3cpath opacity='0.5' d='M32 8H28V12H32V8Z' fill='%2300B9BF'/%3e%3cpath opacity='0.8' d='M28 8H24V12H28V8Z' fill='%2300B9BF'/%3e%3cpath d='M24 8H20V12H24V8Z' fill='%2300B9BF'/%3e%3cpath d='M20 8H16V12H20V8Z' fill='%2300B9BF'/%3e%3cpath d='M16 8H12V12H16V8Z' fill='%2300B9BF'/%3e%3cpath d='M12 8H8V12H12V8Z' fill='%2300B9BF'/%3e%3cpath opacity='0.8' d='M8 8H4V12H8V8Z' fill='%2300B9BF'/%3e%3cpath opacity='0.5' d='M4 8H0V12H4V8Z' fill='%2300B9BF'/%3e%3cpath opacity='0.7' d='M28 4H24V8H28V4Z' fill='%2300C6BF'/%3e%3cpath opacity='0.8' d='M24 4H20V8H24V4Z' fill='%2300C6BF'/%3e%3cpath d='M20 4H16V8H20V4Z' fill='%2300C6BF'/%3e%3cpath d='M16 4H12V8H16V4Z' fill='%2300C6BF'/%3e%3cpath opacity='0.8' d='M12 4H8V8H12V4Z' fill='%2300C6BF'/%3e%3cpath opacity='0.7' d='M8 4H4V8H8V4Z' fill='%2300C6BF'/%3e%3cpath opacity='0.5' d='M24 0H20V4H24V0Z' fill='%2300D4BF'/%3e%3cpath opacity='0.7' d='M20 0H16V4H20V0Z' fill='%2300D4BF'/%3e%3cpath opacity='0.7' d='M16 0H12V4H16V0Z' fill='%2300D4BF'/%3e%3cpath opacity='0.5' d='M12 0H8V4H12V0Z' fill='%2300D4BF'/%3e%3cpath d='M10.5141 14.9697L11.6379 12.4572C12.0459 11.8129 11.9958 11.0255 11.5449 10.5745C11.4876 10.5173 11.416 10.46 11.3444 10.4171C11.0366 10.2238 10.6572 10.1808 10.3065 10.2954C9.91993 10.4171 9.58349 10.6748 9.36875 11.0184C9.36875 11.0184 7.82972 14.6046 7.26421 16.2153C6.69871 17.8259 6.92062 20.7822 9.12536 22.987C11.4661 25.3277 14.8448 25.8575 17.0066 24.2397C17.0997 24.1967 17.1784 24.1395 17.2572 24.0751L23.9072 18.5202C24.2293 18.2554 24.7089 17.7042 24.2794 17.0743C23.8642 16.4586 23.0697 16.881 22.7404 17.0886L18.9107 19.8731C18.8391 19.9304 18.7318 19.9232 18.6673 19.8517C18.6673 19.8517 18.6673 19.8445 18.6602 19.8445C18.56 19.7228 18.5456 19.4079 18.696 19.2862L24.5657 14.304C25.074 13.8459 25.1456 13.1802 24.7304 12.7292C24.3295 12.2854 23.6924 12.2997 23.1842 12.7578L17.9157 16.881C17.8155 16.9597 17.6652 16.9454 17.5864 16.8452L17.5793 16.838C17.4719 16.7235 17.4361 16.5231 17.5506 16.4014L23.535 10.596C24.0074 10.1522 24.036 9.4149 23.5922 8.94245C23.3775 8.72054 23.084 8.59169 22.7762 8.59169C22.4612 8.59169 22.1606 8.70623 21.9387 8.92813L15.8255 14.6691C15.6823 14.8122 15.396 14.6691 15.3602 14.4973C15.3459 14.4328 15.3674 14.3684 15.4103 14.3255L20.0918 8.99972C20.5571 8.56306 20.5858 7.83292 20.1491 7.36763C19.7124 6.90234 18.9823 6.87371 18.517 7.31036C18.4955 7.32468 18.4812 7.34615 18.4597 7.36763L11.3659 15.2203C11.1082 15.478 10.736 15.4851 10.557 15.342C10.4425 15.2489 10.4282 15.0843 10.5141 14.9697Z' fill='white'/%3e%3c/svg%3e",
      i =
        'https://newassets.hcaptcha.com/captcha/v1/a8cd801/static/images' +
        (this.charity ? '/icon-charity' : '/icon') +
        '.png'
    this.color = this.initComponent(Pi, {
      selector: '.logo',
      src: e,
      width: 32,
      fallback: i,
      autoLoad: !1,
    })
  }
  function so(t) {
    ie.self(this, ne, 'hcaptcha-logo'),
      t || (t = {}),
      (this.state = { label: 'hCaptcha' }),
      (this.mobile = !1),
      (this.link =
        'https://www.hcaptcha.com/what-is-hcaptcha-about?ref=' +
        ht.host +
        '&utm_campaign=' +
        ht.sitekey +
        '&utm_medium=challenge'),
      (this.icon = this.initComponent(ro, !!t.charity)),
      (this.onClick = this.onClick.bind(this)),
      this.addEventListener('click', this.onClick)
  }
  ie.proto(ro, ne),
    (ro.prototype.load = function () {
      this.color.load()
    }),
    (ro.prototype.style = function (t) {
      this.mobile = t
      var e = 32
      return (
        this.css({ width: e, height: e, position: 'absolute', top: 0, left: 0 }),
        this.color.css({
          '-ms-high-contrast-adjust': 'none',
          width: e,
          height: e,
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 5,
        }),
        { width: e, height: e }
      )
    }),
    ie.proto(so, ne),
    (so.prototype.load = function () {
      this.icon.load()
    }),
    (so.prototype.style = function (t, e) {
      t !== undefined && (this.mobile = t)
      var i = this.icon.style(this.mobile)
      this.css({
        display: e ? 'block' : 'none',
        width: i.width,
        height: i.height,
        left: '50%',
        marginLeft: -i.width / 2,
        cursor: 'pointer',
        position: 'absolute',
      }),
        (this.height = i.height)
    }),
    (so.prototype.onClick = function () {
      null !== this.fireEvent && pi(this.link)
    }),
    (so.prototype.setLabel = function () {
      var t = this.state.label
      this.setAttribute('title', t)
    })
  var ao = [
    { text: 'Accessibility', value: 'accessibility', selector: '#accessibility', type: 'modal' },
    {
      text: 'Report Image',
      value: 'report_image',
      selector: '#report_image',
      type: 'custom',
      warn: !0,
    },
    { text: 'Report Bug', value: 'report_bug', selector: '#report_bug', type: 'modal' },
    { text: 'Information', value: 'info', selector: '#info', type: 'modal' },
  ]
  function co() {
    ie.self(this, cn, { isMenu: !0, theme: Ti, selector: '#menu', optionsVisible: -1 }),
      (this.state.a11yChallenge = !1),
      (this.options = []),
      this.on('select', function (t) {
        t &&
          ('link' === t.type
            ? pi(t.value)
            : 'modal' === t.type
            ? this.emit('display', t.value)
            : 'challenge' === t.type &&
              ('text_challenge' === t.value && ((ht.a11y_tfe = !0), this.emit('refresh')),
              'visual_challenge' === t.value && ((ht.a11y_tfe = !1), this.emit('refresh'))))
      })
  }
  function lo() {
    ie.self(this, ne, 'interface-user')
    var t = this
    ;(this.state = { isRq: !1, loaded: !1, locked: !1, visible: !1, whiteLabel: !1 }),
      (this.language = this.initComponent(oo)),
      (this.menu = this.initComponent(Jn)),
      (this.menuList = this.initComponent(co)),
      (this.refresh = this.initComponent(Xn)),
      (this.logo = this.initComponent(so)),
      this.menu.controlsMenu(this.menuList),
      this.menu.on('click', function (e) {
        t.menuList.usingKb(e.usingKb), t.menuList.visible(e.selected, t.state.isRq)
      }),
      this.menuList.on('hide', function () {
        t.menu.reset()
      }),
      this.refresh.on('click', function () {
        t.emit('refresh')
      }),
      this.menuList.on('select', function (e) {
        e && 'report_image' === e.value && t.emit('report')
      }),
      this.menuList.on('refresh', function () {
        t.refresh.dom.click()
      }),
      this.menuList.on('display', function (e) {
        t.emit('display', e)
      })
  }
  ie.proto(co, cn),
    (co.prototype.setA11yChallenge = function (t) {
      this.state.a11yChallenge = t
    }),
    (co.prototype._setOptions = function (t) {
      var e
      for (this.options = [], e = 0; e < ao.length; e++) {
        ;('report_image' === ao[e].value && t) || this.options.push(ao[e])
      }
      this.state.a11yChallenge &&
        this.options.splice(
          1,
          0,
          ht.a11y_tfe
            ? {
                text: 'Visual Challenge',
                value: 'visual_challenge',
                selector: '#visual_challenge',
                type: 'challenge',
              }
            : {
                text: 'Text Challenge',
                value: 'text_challenge',
                selector: '#text_challenge',
                type: 'challenge',
              },
        ),
        this.setOptions(this.options)
    }),
    (co.prototype.visible = function (t, e) {
      t ? (this._setOptions(e), this.deselect(), this.open()) : this.hide()
    }),
    ie.proto(lo, ne),
    (lo.prototype.refresh = function () {
      this.refresh.dom.click()
    }),
    (lo.prototype.load = function (t) {
      ;(this.state.isRq = t),
        this.state.loaded || (this.menu.load(), this.refresh.load(), this.logo.load())
    }),
    (lo.prototype.setupLogo = function (t, e) {
      t &&
        (this.logo.destroy(),
        (this.logo = this.initComponent(so, { charity: t })),
        this.logo.load()),
        (this.logo.link = e || this.logo.link)
    }),
    (lo.prototype.style = function (t, e, i) {
      var n = 'landscape' === ht.orientation && 'image_label_binary' === ht.challenge_type,
        o = !this.state.whiteLabel,
        r = !this.state.whiteLabel
      if (
        (this.language.style(i),
        this.refresh.style(i),
        this.menu.style(i, o),
        this.menuList.style(190),
        this.logo.style(t < 400, r),
        n)
      ) {
        var s = this.language.getDimensions(),
          a = (e - (this.refresh.getHeight() + 16 + s.height)) / 2
        this.language.css({ top: a, left: (t - s.width) / 2, position: 'absolute' }),
          this.refresh.css({
            position: 'absolute',
            top: a + 16 + s.height,
            bottom: 'auto',
            left: o ? (t - this.refresh.getWidth()) / 2 : 0,
            zIndex: 100,
          }),
          this.menu.css({
            position: 'absolute',
            left: (t - this.menu.getWidth()) / 2,
            bottom: 0,
            zIndex: 100,
          }),
          this.menuList.css({
            position: 'absolute',
            zIndex: 1e3,
            left: this.menu.getWidth() + 10,
            bottom: 0,
          }),
          this.logo.css({ top: 0, bottom: 'auto' })
      } else {
        this.language.css({ top: 0, left: 0, position: 'absolute' }),
          this.refresh.css({
            position: 'absolute',
            top: 'auto',
            bottom: (40 - this.menu.getHeight()) / 2,
            left: o ? this.menu.getWidth() + 10 : 0,
            zIndex: 100,
          }),
          this.menu.css({
            position: 'absolute',
            left: 0,
            bottom: (40 - this.menu.getHeight()) / 2,
            zIndex: 100,
          }),
          this.menuList.css({
            position: 'absolute',
            zIndex: 1e3,
            left: 0,
            bottom: this.menu.getHeight() + 10,
          }),
          this.logo.css({ top: 'auto', bottom: (40 - this.logo.height) / 2 })
      }
      return this.css({ width: t, height: e }), { width: t, height: e }
    }),
    (lo.prototype.focus = function (t) {
      'menu' === t && this.menu.focus()
    }),
    (lo.prototype.displayLanguage = function (t) {
      this.language.setVisible(t)
    }),
    (lo.prototype.setWhiteLabel = function (t) {
      this.state.whiteLabel = t
    }),
    (lo.prototype.enableRefresh = function (t) {
      this.refresh.enable(t)
    }),
    (lo.prototype.translate = function () {
      this.language.updateLocale(),
        this.language.setLabel(),
        this.menu.setCopy(),
        this.refresh.setCopy(),
        this.logo.setLabel()
    }),
    (lo.prototype.setLock = function (t) {
      ;(this.state.locked = t),
        this.language.setLock(t),
        this.menu.setLock(t),
        this.refresh.setLock(t)
    }),
    (lo.prototype.isLocked = function () {
      return this.state.locked
    })
  var ho = null
  function uo(t, e) {
    var i = this
    e || (e = {}),
      (ht.host = e.host ? e.host : ''),
      (ht.sitekey = e.sitekey ? e.sitekey : ''),
      (ht.charity = !!e.charity),
      (ht.orientation = e.orientation)
    var n = new ci(),
      o = {
        visible: !1,
        create: !1,
        locked: !1,
        timer: null,
        timerExpired: !1,
        preventClose: !1,
        focus: 'challenge',
        interaction: 'mouse',
      }
    t instanceof ee || (t = new ee(t))
    var r = new ee('.interface-wrapper'),
      s = new qn(),
      a = new io(),
      c = new lo(),
      l = new Wn()
    return (
      t.appendElement(r),
      r.appendElement(s),
      r.appendElement(c),
      r.appendElement(a),
      r.appendElement(l),
      c.on('display', l.display),
      t.setAttribute('aria-hidden', !0),
      (di = l),
      l.on('open', function () {
        o.preventClose = !0
      }),
      l.on('close', function () {
        o.visible && c.menu.focus(),
          i.hideReport(!1),
          o.preventClose &&
            ((o.preventClose = !1), o.timerExpired && ((o.timerExpired = !1), n.emit('refresh')))
      }),
      s.on('action-changed', function (t) {
        a.setAction(t)
      }),
      s.on('submit', function () {
        n.emit('submit')
      }),
      s.on('focus-check', function () {
        n.emit('focus-check')
      }),
      s.on('resize', function () {
        n.emit('resize')
      }),
      a.on('submit', function () {
        n.emit('submit')
      }),
      c.on('refresh', function () {
        n.emit('refresh')
      }),
      c.on('report', function () {
        n.emit('report')
      }),
      l.on('report', function (t) {
        n.emit('report-submission', t)
      }),
      r.addEventListener('keydown', function (t) {
        o.interaction = 'keyboard'
      }),
      r.addEventListener('click', function (t) {
        o.interaction = 'mouse'
      }),
      (i.events = n),
      (i.addTheme = function (t, e) {
        Ti.add(t, e)
      }),
      (i.useTheme = function (t) {
        Ti.use(t)
      }),
      (i.size = function (t, e) {
        return i.style(t, e)
      }),
      (i.create = function (t) {
        ;(o.create = !0), c.load(!!t.rq), c.displayLanguage(!t.rq), c.enableRefresh(!t.rq)
      }),
      (i.isMounted = function () {
        return !!ho
      }),
      (i.init = function (t) {
        var e = t.charity && !0 === t.charity
        c.setupLogo(e, t.link), t.a11yChallenge && c.menuList.setA11yChallenge(t.a11yChallenge)
      }),
      (i.setWhiteLabel = function (t) {
        c.setWhiteLabel(t)
      }),
      (i.setup = function (t, e) {
        return new Promise(function (i, n) {
          try {
            ho && ho.type !== e.request_type && (s.unmount(ho), (ho = null)),
              ho ||
                ((ht.challenge_type = e.request_type),
                (ho = new t({ theme: { name: Ti.active(), config: Ti.get() } })),
                s.mount(ho)),
              a.removeCrumbs(),
              ho
                .setup(e, ht.orientation)
                .then(i)
                ['catch'](function (t) {
                  var e = t
                  t instanceof Error &&
                    (e = {
                      event: it.CHALLENGE_ERROR,
                      message: 'Challenge encountered an error during setup.',
                      reason: t.toString(),
                    }),
                    n(e)
                }),
              ho.breadcrumbs &&
                'number' == typeof ho.breadcrumbs &&
                ho.breadcrumbs > 1 &&
                (a.breadcrumbs.createCrumbs(ho.breadcrumbs), a.breadcrumbs.setIndex(ho.served))
          } catch (Qr) {
            s.isMounted || (ho = null),
              n({
                event: it.CHALLENGE_ERROR,
                message: 'Creating challenge failed.',
                reason: Qr.toString(),
              })
          }
        })
      }),
      (i.show = function (e) {
        if (!o.create) return Promise.reject(new Error(et.CHALLENGE_ALREADY_CLOSED))
        ;(o.visible = !0),
          t.removeAttribute('aria-hidden'),
          Je.resetData(),
          Je.record(!0, !0, !0, !1),
          Je.setData('dct', Date.now())
        var n = i.setup(e.bundle, e.bundleData),
          r = i.style(e.width, e.height).then(function (n) {
            o.visible &&
              (a.setLock(!1),
              c.setLock(!1),
              fi.contact('challenge-ready', n).then(function () {
                var n = 'info' === o.focus,
                  r = e.challengeType.indexOf('text') >= 0,
                  s = t.hasClass('using-kb')
                ht.a11y_tfe || !n || (!s && r)
                  ? i.focus()
                  : (c.menu.focus(!s), (o.focus = 'challenge'))
              }))
          })
        return new Promise(function (t, i) {
          r['catch'](i),
            n.then(t, i),
            o.timer && clearTimeout(o.timer),
            (o.timer = setTimeout(function () {
              ;(o.timerExpired = !0), o.preventClose || i({ event: et.CHALLENGE_EXPIRED })
            }, e.expiration))
        })
      }),
      (i.style = function (e, i) {
        return ho
          ? new Promise(function (n, o) {
              try {
                ho.style(e, i)
                  .then(function (e) {
                    var i = 10,
                      o = e.mobile ? 60 : 70,
                      h = e.width,
                      u = e.height + i + o
                    s.style(e.width, e.height, i),
                      'landscape' === ht.orientation && 'image_label_binary' === ht.challenge_type
                        ? ((o = 35),
                          (h = e.width + o + i),
                          (u = e.height + o + i),
                          a.style(e.width, o),
                          a.css({ position: 'absolute', right: 0, bottom: 0 }),
                          c.style(o, u),
                          c.css({ position: 'absolute', left: 0, bottom: 0 }),
                          s.css({ position: 'absolute', top: 0, left: o + i }))
                        : (a.style(e.width, o),
                          a.css({ position: 'absolute', left: 0, bottom: 0 }),
                          c.style(e.width, o),
                          c.css({ position: 'absolute', left: 0, bottom: 0 }),
                          s.css({ position: 'relative', marginBottom: i, right: 'auto' })),
                      r.css({ width: h, height: u, margin: i, position: 'relative' }),
                      t.css({ width: h + 20, height: u + 20 }),
                      l.style(h, u, e.mobile),
                      l.load(),
                      n({ width: h + 20, height: u + 20, mobile: e.mobile })
                  })
                  ['catch'](function (t) {
                    o({
                      event: it.CHALLENGE_ERROR,
                      message: 'Error occurred in promise of .style()',
                      reason: t.toString(),
                    })
                  })
              } catch (Qr) {
                o({
                  event: it.CHALLENGE_ERROR,
                  message: 'Error when calling .style()',
                  reason: Qr.toString(),
                })
              }
            })
          : Promise.resolve({ width: 0, height: 0, mobile: !1 })
      }),
      (i.submit = function () {
        return (i.hasBreadcrumbs() && i.getTotalServed() !== i.getTotalBreadcrumbs()) ||
          'skip' !== a.getAction()
          ? new Promise(function (t, e) {
              try {
                if ((ho && ho.submit(), i.hasBreadcrumbs())) {
                  var n = i.getTotalServed()
                  a.breadcrumbs.setIndex(n)
                }
                t('challenge-complete'),
                  null !== o._timer &&
                    'check' === a.getAction() &&
                    (clearTimeout(o._timer), (o._timer = null))
              } catch (Qr) {
                e(Qr)
              }
            })
          : Promise.resolve('challenge-skip')
      }),
      (i.displayReport = function (t) {
        return new Promise(function (e, n) {
          try {
            if (!i.isMounted()) return e()
            if (!i.canReport()) {
              var o
              if ('fallback' === t.request_type) o = t.key
              else {
                var r = i.hasBreadcrumbs() ? i.getTotalServed() - 1 : 0
                o = t.tasklist[r].task_key
              }
              return e(o)
            }
            i.report().then(e), a.breadcrumbs && a.breadcrumbs.hide()
          } catch (ts) {
            n(ts)
          }
        })
      }),
      (i.hideReport = function () {
        ho && ho.report && ho.report(!1)
      }),
      (i.close = function () {
        ho && (ho = s.unmount(ho)),
          o.timer && clearTimeout(o.timer),
          (o.timer = null),
          t.setAttribute('aria-hidden', !0),
          a.displayTryAgain(!1),
          a.removeCrumbs(),
          l.close(),
          (o.visible = !1),
          (o.create = !1)
      }),
      (i.translateInterface = function (t) {
        if (t && t.locale && t.table) {
          try {
            t.table && (ue.setLocale(t.locale), ue.addTable(t.locale, t.table)),
              ho && ho.translate && ho.translate(),
              a.translate(),
              c.translate(),
              document.documentElement.setAttribute('lang', ue.getLocale())
          } catch (Qr) {
            At('translation', Qr)
          }
        }
      }),
      (i.translateBundle = function () {
        ho && ho.translate && ho.translate()
      }),
      (i.isVisible = function () {
        return o.visible
      }),
      (i.setFocus = function (t) {
        o.focus = t
      }),
      (i.triggerFocus = function (t, e) {
        'submit' === t ? a.submit.focus() : i.focus(e)
      }),
      (i.isInterfaceLocked = function () {
        return o.locked
      }),
      (i.lockInterface = function (t) {
        ;(o.locked = t), a.setLock(t), c.setLock(t)
      }),
      (i.hasActiveElement = function () {
        return (
          document.activeElement === a.submit.dom ||
          document.activeElement === c.refresh.dom ||
          document.activeElement === c.menu.dom
        )
      }),
      (i.getActiveElement = function () {
        return document.activeElement === a.submit.dom
          ? 'submit'
          : document.activeElement === c.refresh.dom
          ? 'refresh'
          : document.activeElement === c.menu.dom
          ? 'menu'
          : null
      }),
      (i.getModal = function () {
        return l
      }),
      (i.getTotalServed = function () {
        return ho.served
      }),
      (i.getTotalBreadcrumbs = function () {
        return ho ? ho.breadcrumbs : 0
      }),
      (i.hasBreadcrumbs = function () {
        return !(!ho || !ho.breadcrumbs)
      }),
      (i.canReport = function () {
        return ho.report && 'function' == typeof ho.report
      }),
      (i.report = function () {
        return new Promise(function (t) {
          var e = function (i) {
            ho.off('report-image', e), t(i)
          }
          ho.report(!0), ho.on('report-image', e)
        })
      }),
      (i.focus = function (t) {
        ho && ho.setFocus && ho.setFocus(t || 0, o.interaction)
      }),
      (i.displayTryAgain = function (t) {
        a.displayTryAgain(t)
      }),
      (i.enableA11yChallenge = function (t) {
        c.menuList.setA11yChallenge(t)
      }),
      i
    )
  }
  !(function (t) {
    if ('object' == typeof exports && 'undefined' != typeof module) module.exports = t()
    else if ('function' == typeof define && define.amd) define('raven-js', t)
    else {
      ;('undefined' != typeof window
        ? window
        : 'undefined' != typeof global
        ? global
        : 'undefined' != typeof self
        ? self
        : this
      ).msgpack = t()
    }
  })(function () {
    return (function t(e, i, n) {
      function o(s, a) {
        if (!i[s]) {
          if (!e[s]) {
            var c = 'function' == typeof require && require
            if (!a && c) return c(s, !0)
            if (r) return r(s, !0)
            var l = new Error("Cannot find module '" + s + "'")
            throw ((l.code = 'MODULE_NOT_FOUND'), l)
          }
          var h = (i[s] = { exports: {} })
          e[s][0].call(
            h.exports,
            function (t) {
              var i = e[s][1][t]
              return o(i || t)
            },
            h,
            h.exports,
            t,
            e,
            i,
            n,
          )
        }
        return i[s].exports
      }
      for (var r = 'function' == typeof require && require, s = 0; s < n.length; s++) o(n[s])
      return o
    })(
      {
        1: [
          function (t, e, i) {
            ;(i.encode = t('./encode').encode),
              (i.decode = t('./decode').decode),
              (i.Encoder = t('./encoder').Encoder),
              (i.Decoder = t('./decoder').Decoder),
              (i.createCodec = t('./ext').createCodec),
              (i.codec = t('./codec').codec)
          },
          {
            './codec': 10,
            './decode': 12,
            './decoder': 13,
            './encode': 15,
            './encoder': 16,
            './ext': 20,
          },
        ],
        2: [
          function (t, e, i) {
            ;(function (t) {
              function i(t) {
                return t && t.isBuffer && t
              }
              e.exports =
                i(void 0 !== t && t) ||
                i(this.Buffer) ||
                i('undefined' != typeof window && window.Buffer) ||
                this.Buffer
            }.call(this, t('buffer').Buffer))
          },
          { buffer: 29 },
        ],
        3: [
          function (t, e, i) {
            ;(i.copy = function (t, e, i, n) {
              var o
              i || (i = 0), n || 0 === n || (n = this.length), e || (e = 0)
              var r = n - i
              if (t === this && i < e && e < n) for (o = r - 1; o >= 0; o--) t[o + e] = this[o + i]
              else for (o = 0; o < r; o++) t[o + e] = this[o + i]
              return r
            }),
              (i.toString = function (t, e, i) {
                var n = this,
                  o = 0 | e
                i || (i = n.length)
                for (var r = '', s = 0; o < i; ) {
                  ;(s = n[o++]) < 128
                    ? (r += String.fromCharCode(s))
                    : (192 == (224 & s)
                        ? (s = ((31 & s) << 6) | (63 & n[o++]))
                        : 224 == (240 & s)
                        ? (s = ((15 & s) << 12) | ((63 & n[o++]) << 6) | (63 & n[o++]))
                        : 240 == (248 & s) &&
                          (s =
                            ((7 & s) << 18) |
                            ((63 & n[o++]) << 12) |
                            ((63 & n[o++]) << 6) |
                            (63 & n[o++])),
                      s >= 65536
                        ? ((s -= 65536),
                          (r += String.fromCharCode(55296 + (s >>> 10), 56320 + (1023 & s))))
                        : (r += String.fromCharCode(s)))
                }
                return r
              }),
              (i.write = function (t, e) {
                for (var i = this, n = e || (e |= 0), o = t.length, r = 0, s = 0; s < o; ) {
                  ;(r = t.charCodeAt(s++)) < 128
                    ? (i[n++] = r)
                    : r < 2048
                    ? ((i[n++] = 192 | (r >>> 6)), (i[n++] = 128 | (63 & r)))
                    : r < 55296 || r > 57343
                    ? ((i[n++] = 224 | (r >>> 12)),
                      (i[n++] = 128 | ((r >>> 6) & 63)),
                      (i[n++] = 128 | (63 & r)))
                    : ((r = 65536 + (((r - 55296) << 10) | (t.charCodeAt(s++) - 56320))),
                      (i[n++] = 240 | (r >>> 18)),
                      (i[n++] = 128 | ((r >>> 12) & 63)),
                      (i[n++] = 128 | ((r >>> 6) & 63)),
                      (i[n++] = 128 | (63 & r)))
                }
                return n - e
              })
          },
          {},
        ],
        4: [
          function (t, e, i) {
            function n(t) {
              return new Array(t)
            }
            var o = t('./bufferish')
            ;((i = e.exports = n(0)).alloc = n),
              (i.concat = o.concat),
              (i.from = function (t) {
                if (!o.isBuffer(t) && o.isView(t)) t = o.Uint8Array.from(t)
                else if (o.isArrayBuffer(t)) t = new Uint8Array(t)
                else {
                  if ('string' == typeof t) return o.from.call(i, t)
                  if ('number' == typeof t) {
                    throw new TypeError('"value" argument must not be a number')
                  }
                }
                return Array.prototype.slice.call(t)
              })
          },
          { './bufferish': 8 },
        ],
        5: [
          function (t, e, i) {
            function n(t) {
              return new r(t)
            }
            var o = t('./bufferish'),
              r = o.global
            ;((i = e.exports = o.hasBuffer ? n(0) : []).alloc = (o.hasBuffer && r.alloc) || n),
              (i.concat = o.concat),
              (i.from = function (t) {
                if (!o.isBuffer(t) && o.isView(t)) t = o.Uint8Array.from(t)
                else if (o.isArrayBuffer(t)) t = new Uint8Array(t)
                else {
                  if ('string' == typeof t) return o.from.call(i, t)
                  if ('number' == typeof t) {
                    throw new TypeError('"value" argument must not be a number')
                  }
                }
                return r.from && 1 !== r.from.length ? r.from(t) : new r(t)
              })
          },
          { './bufferish': 8 },
        ],
        6: [
          function (t, e, i) {
            function n(t, e, i, n) {
              var a = s.isBuffer(this),
                c = s.isBuffer(t)
              if (a && c) return this.copy(t, e, i, n)
              if (l || a || c || !s.isView(this) || !s.isView(t)) {
                return r.copy.call(this, t, e, i, n)
              }
              var h = i || null != n ? o.call(this, i, n) : this
              return t.set(h, e), h.length
            }
            function o(t, e) {
              var i = this.slice || (!l && this.subarray)
              if (i) return i.call(this, t, e)
              var o = s.alloc.call(this, e - t)
              return n.call(this, o, 0, t, e), o
            }
            var r = t('./buffer-lite')
            ;(i.copy = n),
              (i.slice = o),
              (i.toString = function (t, e, i) {
                var n = !c && s.isBuffer(this) ? this.toString : r.toString
                return n.apply(this, arguments)
              }),
              (i.write = (function (t) {
                return function () {
                  var e = this[t] || r[t]
                  return e.apply(this, arguments)
                }
              })('write'))
            var s = t('./bufferish'),
              a = s.global,
              c = s.hasBuffer && 'TYPED_ARRAY_SUPPORT' in a,
              l = c && !a.TYPED_ARRAY_SUPPORT
          },
          { './buffer-lite': 3, './bufferish': 8 },
        ],
        7: [
          function (t, e, i) {
            function n(t) {
              return new Uint8Array(t)
            }
            var o = t('./bufferish')
            ;((i = e.exports = o.hasArrayBuffer ? n(0) : []).alloc = n),
              (i.concat = o.concat),
              (i.from = function (t) {
                if (o.isView(t)) {
                  var e = t.byteOffset,
                    n = t.byteLength
                  ;(t = t.buffer).byteLength !== n &&
                    (t.slice
                      ? (t = t.slice(e, e + n))
                      : (t = new Uint8Array(t)).byteLength !== n &&
                        (t = Array.prototype.slice.call(t, e, e + n)))
                } else {
                  if ('string' == typeof t) return o.from.call(i, t)
                  if ('number' == typeof t) {
                    throw new TypeError('"value" argument must not be a number')
                  }
                }
                return new Uint8Array(t)
              })
          },
          { './bufferish': 8 },
        ],
        8: [
          function (t, e, i) {
            function n(t) {
              return r(this).alloc(t)
            }
            function o(t) {
              var e = 3 * t.length,
                i = n.call(this, e),
                o = g.write.call(i, t)
              return e !== o && (i = g.slice.call(i, 0, o)), i
            }
            function r(t) {
              return f(t) ? m : d(t) ? y : u(t) ? p : l ? m : h ? y : p
            }
            function s() {
              return !1
            }
            function a(t, e) {
              return (
                (t = '[object ' + t + ']'),
                function (i) {
                  return null != i && {}.toString.call(e ? i[e] : i) === t
                }
              )
            }
            var c = (i.global = t('./buffer-global')),
              l = (i.hasBuffer = c && !!c.isBuffer),
              h = (i.hasArrayBuffer = 'undefined' != typeof ArrayBuffer),
              u = (i.isArray = t('isarray'))
            i.isArrayBuffer = h
              ? function (t) {
                  return t instanceof ArrayBuffer || v(t)
                }
              : s
            var f = (i.isBuffer = l ? c.isBuffer : s),
              d = (i.isView = h ? ArrayBuffer.isView || a('ArrayBuffer', 'buffer') : s)
            ;(i.alloc = n),
              (i.concat = function (t, e) {
                e ||
                  ((e = 0),
                  Array.prototype.forEach.call(t, function (t) {
                    e += t.length
                  }))
                var o = (this !== i && this) || t[0],
                  r = n.call(o, e),
                  s = 0
                return (
                  Array.prototype.forEach.call(t, function (t) {
                    s += g.copy.call(t, r, s)
                  }),
                  r
                )
              }),
              (i.from = function (t) {
                return 'string' == typeof t ? o.call(this, t) : r(this).from(t)
              })
            var p = (i.Array = t('./bufferish-array')),
              m = (i.Buffer = t('./bufferish-buffer')),
              y = (i.Uint8Array = t('./bufferish-uint8array')),
              g = (i.prototype = t('./bufferish-proto')),
              v = a('ArrayBuffer')
          },
          {
            './buffer-global': 2,
            './bufferish-array': 4,
            './bufferish-buffer': 5,
            './bufferish-proto': 6,
            './bufferish-uint8array': 7,
            isarray: 34,
          },
        ],
        9: [
          function (t, e, i) {
            function n(t) {
              return this instanceof n ? ((this.options = t), void this.init()) : new n(t)
            }
            function o(t, e) {
              return t && e
                ? function () {
                    return t.apply(this, arguments), e.apply(this, arguments)
                  }
                : t || e
            }
            function r(t) {
              return new n(t)
            }
            var s = t('isarray')
            ;(i.createCodec = r),
              (i.install = function (t) {
                for (var e in t) n.prototype[e] = o(n.prototype[e], t[e])
              }),
              (i.filter = function (t) {
                return s(t)
                  ? (function (t) {
                      function e(t, e) {
                        return e(t)
                      }
                      return (
                        (t = t.slice()),
                        function (i) {
                          return t.reduce(e, i)
                        }
                      )
                    })(t)
                  : t
              })
            var a = t('./bufferish')
            ;(n.prototype.init = function () {
              var t = this.options
              return t && t.uint8array && (this.bufferish = a.Uint8Array), this
            }),
              (i.preset = r({ preset: !0 }))
          },
          { './bufferish': 8, isarray: 34 },
        ],
        10: [
          function (t, e, i) {
            t('./read-core'), t('./write-core'), (i.codec = { preset: t('./codec-base').preset })
          },
          { './codec-base': 9, './read-core': 22, './write-core': 25 },
        ],
        11: [
          function (t, e, i) {
            function n(t) {
              if (!(this instanceof n)) return new n(t)
              if (t && ((this.options = t), t.codec)) {
                var e = (this.codec = t.codec)
                e.bufferish && (this.bufferish = e.bufferish)
              }
            }
            i.DecodeBuffer = n
            var o = t('./read-core').preset
            t('./flex-buffer').FlexDecoder.mixin(n.prototype),
              (n.prototype.codec = o),
              (n.prototype.fetch = function () {
                return this.codec.decode(this)
              })
          },
          { './flex-buffer': 21, './read-core': 22 },
        ],
        12: [
          function (t, e, i) {
            i.decode = function (t, e) {
              var i = new n(e)
              return i.write(t), i.read()
            }
            var n = t('./decode-buffer').DecodeBuffer
          },
          { './decode-buffer': 11 },
        ],
        13: [
          function (t, e, i) {
            function n(t) {
              return this instanceof n ? void r.call(this, t) : new n(t)
            }
            i.Decoder = n
            var o = t('event-lite'),
              r = t('./decode-buffer').DecodeBuffer
            ;(n.prototype = new r()),
              o.mixin(n.prototype),
              (n.prototype.decode = function (t) {
                arguments.length && this.write(t), this.flush()
              }),
              (n.prototype.push = function (t) {
                this.emit('data', t)
              }),
              (n.prototype.end = function (t) {
                this.decode(t), this.emit('end')
              })
          },
          { './decode-buffer': 11, 'event-lite': 31 },
        ],
        14: [
          function (t, e, i) {
            function n(t) {
              if (!(this instanceof n)) return new n(t)
              if (t && ((this.options = t), t.codec)) {
                var e = (this.codec = t.codec)
                e.bufferish && (this.bufferish = e.bufferish)
              }
            }
            i.EncodeBuffer = n
            var o = t('./write-core').preset
            t('./flex-buffer').FlexEncoder.mixin(n.prototype),
              (n.prototype.codec = o),
              (n.prototype.write = function (t) {
                this.codec.encode(this, t)
              })
          },
          { './flex-buffer': 21, './write-core': 25 },
        ],
        15: [
          function (t, e, i) {
            i.encode = function (t, e) {
              var i = new n(e)
              return i.write(t), i.read()
            }
            var n = t('./encode-buffer').EncodeBuffer
          },
          { './encode-buffer': 14 },
        ],
        16: [
          function (t, e, i) {
            function n(t) {
              return this instanceof n ? void r.call(this, t) : new n(t)
            }
            i.Encoder = n
            var o = t('event-lite'),
              r = t('./encode-buffer').EncodeBuffer
            ;(n.prototype = new r()),
              o.mixin(n.prototype),
              (n.prototype.encode = function (t) {
                this.write(t), this.emit('data', this.read())
              }),
              (n.prototype.end = function (t) {
                arguments.length && this.encode(t), this.flush(), this.emit('end')
              })
          },
          { './encode-buffer': 14, 'event-lite': 31 },
        ],
        17: [
          function (t, e, i) {
            i.ExtBuffer = function o(t, e) {
              return this instanceof o
                ? ((this.buffer = n.from(t)), void (this.type = e))
                : new o(t, e)
            }
            var n = t('./bufferish')
          },
          { './bufferish': 8 },
        ],
        18: [
          function (t, e, i) {
            function n(e) {
              return a || (a = t('./encode').encode), a(e)
            }
            function o(t) {
              return t.valueOf()
            }
            function r(t) {
              ;(t = RegExp.prototype.toString.call(t).split('/')).shift()
              var e = [t.pop()]
              return e.unshift(t.join('/')), e
            }
            function s(t) {
              var e = {}
              for (var i in u) e[i] = t[i]
              return e
            }
            i.setExtPackers = function (t) {
              t.addExtPacker(14, Error, [s, n]),
                t.addExtPacker(1, EvalError, [s, n]),
                t.addExtPacker(2, RangeError, [s, n]),
                t.addExtPacker(3, ReferenceError, [s, n]),
                t.addExtPacker(4, SyntaxError, [s, n]),
                t.addExtPacker(5, TypeError, [s, n]),
                t.addExtPacker(6, URIError, [s, n]),
                t.addExtPacker(10, RegExp, [r, n]),
                t.addExtPacker(11, Boolean, [o, n]),
                t.addExtPacker(12, String, [o, n]),
                t.addExtPacker(13, Date, [Number, n]),
                t.addExtPacker(15, Number, [o, n]),
                'undefined' != typeof Uint8Array &&
                  (t.addExtPacker(17, Int8Array, h),
                  t.addExtPacker(18, Uint8Array, h),
                  t.addExtPacker(19, Int16Array, h),
                  t.addExtPacker(20, Uint16Array, h),
                  t.addExtPacker(21, Int32Array, h),
                  t.addExtPacker(22, Uint32Array, h),
                  t.addExtPacker(23, Float32Array, h),
                  'undefined' != typeof Float64Array && t.addExtPacker(24, Float64Array, h),
                  'undefined' != typeof Uint8ClampedArray &&
                    t.addExtPacker(25, Uint8ClampedArray, h),
                  t.addExtPacker(26, ArrayBuffer, h),
                  t.addExtPacker(29, DataView, h)),
                c.hasBuffer && t.addExtPacker(27, l, c.from)
            }
            var a,
              c = t('./bufferish'),
              l = c.global,
              h = c.Uint8Array.from,
              u = { name: 1, message: 1, stack: 1, columnNumber: 1, fileName: 1, lineNumber: 1 }
          },
          { './bufferish': 8, './encode': 15 },
        ],
        19: [
          function (t, e, i) {
            function n(e) {
              return c || (c = t('./decode').decode), c(e)
            }
            function o(t) {
              return RegExp.apply(null, t)
            }
            function r(t) {
              return function (e) {
                var i = new t()
                for (var n in u) i[n] = e[n]
                return i
              }
            }
            function s(t) {
              return function (e) {
                return new t(e)
              }
            }
            function a(t) {
              return new Uint8Array(t).buffer
            }
            i.setExtUnpackers = function (t) {
              t.addExtUnpacker(14, [n, r(Error)]),
                t.addExtUnpacker(1, [n, r(EvalError)]),
                t.addExtUnpacker(2, [n, r(RangeError)]),
                t.addExtUnpacker(3, [n, r(ReferenceError)]),
                t.addExtUnpacker(4, [n, r(SyntaxError)]),
                t.addExtUnpacker(5, [n, r(TypeError)]),
                t.addExtUnpacker(6, [n, r(URIError)]),
                t.addExtUnpacker(10, [n, o]),
                t.addExtUnpacker(11, [n, s(Boolean)]),
                t.addExtUnpacker(12, [n, s(String)]),
                t.addExtUnpacker(13, [n, s(Date)]),
                t.addExtUnpacker(15, [n, s(Number)]),
                'undefined' != typeof Uint8Array &&
                  (t.addExtUnpacker(17, s(Int8Array)),
                  t.addExtUnpacker(18, s(Uint8Array)),
                  t.addExtUnpacker(19, [a, s(Int16Array)]),
                  t.addExtUnpacker(20, [a, s(Uint16Array)]),
                  t.addExtUnpacker(21, [a, s(Int32Array)]),
                  t.addExtUnpacker(22, [a, s(Uint32Array)]),
                  t.addExtUnpacker(23, [a, s(Float32Array)]),
                  'undefined' != typeof Float64Array && t.addExtUnpacker(24, [a, s(Float64Array)]),
                  'undefined' != typeof Uint8ClampedArray &&
                    t.addExtUnpacker(25, s(Uint8ClampedArray)),
                  t.addExtUnpacker(26, a),
                  t.addExtUnpacker(29, [a, s(DataView)])),
                l.hasBuffer && t.addExtUnpacker(27, s(h))
            }
            var c,
              l = t('./bufferish'),
              h = l.global,
              u = { name: 1, message: 1, stack: 1, columnNumber: 1, fileName: 1, lineNumber: 1 }
          },
          { './bufferish': 8, './decode': 12 },
        ],
        20: [
          function (t, e, i) {
            t('./read-core'), t('./write-core'), (i.createCodec = t('./codec-base').createCodec)
          },
          { './codec-base': 9, './read-core': 22, './write-core': 25 },
        ],
        21: [
          function (t, e, i) {
            function n() {
              if (!(this instanceof n)) return new n()
            }
            function o() {
              if (!(this instanceof o)) return new o()
            }
            function r() {
              throw new Error('method not implemented: write()')
            }
            function s() {
              throw new Error('method not implemented: fetch()')
            }
            function a() {
              return this.buffers && this.buffers.length
                ? (this.flush(), this.pull())
                : this.fetch()
            }
            function c(t) {
              ;(this.buffers || (this.buffers = [])).push(t)
            }
            function l() {
              return (this.buffers || (this.buffers = [])).shift()
            }
            function h(t) {
              return function (e) {
                for (var i in t) e[i] = t[i]
                return e
              }
            }
            ;(i.FlexDecoder = n), (i.FlexEncoder = o)
            var u = t('./bufferish'),
              f = 2048,
              d = 65536,
              p = 'BUFFER_SHORTAGE'
            ;(n.mixin = h({
              bufferish: u,
              write: function (t) {
                var e = this.offset ? u.prototype.slice.call(this.buffer, this.offset) : this.buffer
                ;(this.buffer = e ? (t ? this.bufferish.concat([e, t]) : e) : t), (this.offset = 0)
              },
              fetch: s,
              flush: function () {
                for (; this.offset < this.buffer.length; ) {
                  var t,
                    e = this.offset
                  try {
                    t = this.fetch()
                  } catch (t) {
                    if (t && t.message != p) throw t
                    this.offset = e
                    break
                  }
                  this.push(t)
                }
              },
              push: c,
              pull: l,
              read: a,
              reserve: function (t) {
                var e = this.offset,
                  i = e + t
                if (i > this.buffer.length) throw new Error(p)
                return (this.offset = i), e
              },
              offset: 0,
            })),
              n.mixin(n.prototype),
              (o.mixin = h({
                bufferish: u,
                write: r,
                fetch: function () {
                  var t = this.start
                  if (t < this.offset) {
                    var e = (this.start = this.offset)
                    return u.prototype.slice.call(this.buffer, t, e)
                  }
                },
                flush: function () {
                  for (; this.start < this.offset; ) {
                    var t = this.fetch()
                    t && this.push(t)
                  }
                },
                push: c,
                pull: function () {
                  var t = this.buffers || (this.buffers = []),
                    e = t.length > 1 ? this.bufferish.concat(t) : t[0]
                  return (t.length = 0), e
                },
                read: a,
                reserve: function (t) {
                  var e = 0 | t
                  if (this.buffer) {
                    var i = this.buffer.length,
                      n = 0 | this.offset,
                      o = n + e
                    if (o < i) return (this.offset = o), n
                    this.flush(), (t = Math.max(t, Math.min(2 * i, this.maxBufferSize)))
                  }
                  return (
                    (t = Math.max(t, this.minBufferSize)),
                    (this.buffer = this.bufferish.alloc(t)),
                    (this.start = 0),
                    (this.offset = e),
                    0
                  )
                },
                send: function (t) {
                  var e = t.length
                  if (e > this.minBufferSize) this.flush(), this.push(t)
                  else {
                    var i = this.reserve(e)
                    u.prototype.copy.call(t, this.buffer, i)
                  }
                },
                maxBufferSize: d,
                minBufferSize: f,
                offset: 0,
                start: 0,
              })),
              o.mixin(o.prototype)
          },
          { './bufferish': 8 },
        ],
        22: [
          function (t, e, i) {
            function n() {
              var t = this.options
              return (
                (this.decode = (function (t) {
                  var e = a.getReadToken(t)
                  return function (t) {
                    var i = s(t),
                      n = e[i]
                    if (!n) throw new Error('Invalid type: ' + (i ? '0x' + i.toString(16) : i))
                    return n(t)
                  }
                })(t)),
                t && t.preset && r.setExtUnpackers(this),
                this
              )
            }
            var o = t('./ext-buffer').ExtBuffer,
              r = t('./ext-unpacker'),
              s = t('./read-format').readUint8,
              a = t('./read-token'),
              c = t('./codec-base')
            c.install({
              addExtUnpacker: function (t, e) {
                ;(this.extUnpackers || (this.extUnpackers = []))[t] = c.filter(e)
              },
              getExtUnpacker: function (t) {
                return (
                  (this.extUnpackers || (this.extUnpackers = []))[t] ||
                  function (e) {
                    return new o(e, t)
                  }
                )
              },
              init: n,
            }),
              (i.preset = n.call(c.preset))
          },
          {
            './codec-base': 9,
            './ext-buffer': 17,
            './ext-unpacker': 19,
            './read-format': 23,
            './read-token': 24,
          },
        ],
        23: [
          function (t, e, i) {
            function n(t, e) {
              var i,
                n = {},
                o = new Array(e),
                r = new Array(e),
                s = t.codec.decode
              for (i = 0; i < e; i++) (o[i] = s(t)), (r[i] = s(t))
              for (i = 0; i < e; i++) n[o[i]] = r[i]
              return n
            }
            function o(t, e) {
              var i,
                n = new Map(),
                o = new Array(e),
                r = new Array(e),
                s = t.codec.decode
              for (i = 0; i < e; i++) (o[i] = s(t)), (r[i] = s(t))
              for (i = 0; i < e; i++) n.set(o[i], r[i])
              return n
            }
            function r(t, e) {
              for (var i = new Array(e), n = t.codec.decode, o = 0; o < e; o++) i[o] = n(t)
              return i
            }
            function s(t, e) {
              var i = t.reserve(e),
                n = i + e
              return B.toString.call(t.buffer, 'utf-8', i, n)
            }
            function a(t, e) {
              var i = t.reserve(e),
                n = i + e,
                o = B.slice.call(t.buffer, i, n)
              return S.from(o)
            }
            function c(t, e) {
              var i = t.reserve(e),
                n = i + e,
                o = B.slice.call(t.buffer, i, n)
              return S.Uint8Array.from(o).buffer
            }
            function l(t, e) {
              var i = t.reserve(e + 1),
                n = t.buffer[i++],
                o = i + e,
                r = t.codec.getExtUnpacker(n)
              if (!r) throw new Error('Invalid ext type: ' + (n ? '0x' + n.toString(16) : n))
              return r(B.slice.call(t.buffer, i, o))
            }
            function h(t) {
              var e = t.reserve(1)
              return t.buffer[e]
            }
            function u(t) {
              var e = t.reserve(1),
                i = t.buffer[e]
              return 128 & i ? i - 256 : i
            }
            function f(t) {
              var e = t.reserve(2),
                i = t.buffer
              return (i[e++] << 8) | i[e]
            }
            function d(t) {
              var e = t.reserve(2),
                i = t.buffer,
                n = (i[e++] << 8) | i[e]
              return 32768 & n ? n - 65536 : n
            }
            function p(t) {
              var e = t.reserve(4),
                i = t.buffer
              return 16777216 * i[e++] + (i[e++] << 16) + (i[e++] << 8) + i[e]
            }
            function m(t) {
              var e = t.reserve(4),
                i = t.buffer
              return (i[e++] << 24) | (i[e++] << 16) | (i[e++] << 8) | i[e]
            }
            function y(t, e) {
              return function (i) {
                var n = i.reserve(t)
                return e.call(i.buffer, n, T)
              }
            }
            function g(t) {
              return new E(this, t).toNumber()
            }
            function v(t) {
              return new A(this, t).toNumber()
            }
            function b(t) {
              return new E(this, t)
            }
            function w(t) {
              return new A(this, t)
            }
            function x(t) {
              return C.read(this, t, !1, 23, 4)
            }
            function k(t) {
              return C.read(this, t, !1, 52, 8)
            }
            var C = t('ieee754'),
              _ = t('int64-buffer'),
              E = _.Uint64BE,
              A = _.Int64BE
            ;(i.getReadFormat = function (t) {
              var e = S.hasArrayBuffer && t && t.binarraybuffer,
                i = t && t.int64
              return {
                map: L && t && t.usemap ? o : n,
                array: r,
                str: s,
                bin: e ? c : a,
                ext: l,
                uint8: h,
                uint16: f,
                uint32: p,
                uint64: y(8, i ? b : g),
                int8: u,
                int16: d,
                int32: m,
                int64: y(8, i ? w : v),
                float32: y(4, x),
                float64: y(8, k),
              }
            }),
              (i.readUint8 = h)
            var S = t('./bufferish'),
              B = t('./bufferish-proto'),
              L = 'undefined' != typeof Map,
              T = !0
          },
          { './bufferish': 8, './bufferish-proto': 6, ieee754: 32, 'int64-buffer': 33 },
        ],
        24: [
          function (t, e, i) {
            function n(t) {
              var e,
                i = new Array(256)
              for (e = 0; e <= 127; e++) i[e] = o(e)
              for (e = 128; e <= 143; e++) i[e] = s(e - 128, t.map)
              for (e = 144; e <= 159; e++) i[e] = s(e - 144, t.array)
              for (e = 160; e <= 191; e++) i[e] = s(e - 160, t.str)
              for (
                i[192] = o(null),
                  i[193] = null,
                  i[194] = o(!1),
                  i[195] = o(!0),
                  i[196] = r(t.uint8, t.bin),
                  i[197] = r(t.uint16, t.bin),
                  i[198] = r(t.uint32, t.bin),
                  i[199] = r(t.uint8, t.ext),
                  i[200] = r(t.uint16, t.ext),
                  i[201] = r(t.uint32, t.ext),
                  i[202] = t.float32,
                  i[203] = t.float64,
                  i[204] = t.uint8,
                  i[205] = t.uint16,
                  i[206] = t.uint32,
                  i[207] = t.uint64,
                  i[208] = t.int8,
                  i[209] = t.int16,
                  i[210] = t.int32,
                  i[211] = t.int64,
                  i[212] = s(1, t.ext),
                  i[213] = s(2, t.ext),
                  i[214] = s(4, t.ext),
                  i[215] = s(8, t.ext),
                  i[216] = s(16, t.ext),
                  i[217] = r(t.uint8, t.str),
                  i[218] = r(t.uint16, t.str),
                  i[219] = r(t.uint32, t.str),
                  i[220] = r(t.uint16, t.array),
                  i[221] = r(t.uint32, t.array),
                  i[222] = r(t.uint16, t.map),
                  i[223] = r(t.uint32, t.map),
                  e = 224;
                e <= 255;
                e++
              ) {
                i[e] = o(e - 256)
              }
              return i
            }
            function o(t) {
              return function () {
                return t
              }
            }
            function r(t, e) {
              return function (i) {
                var n = t(i)
                return e(i, n)
              }
            }
            function s(t, e) {
              return function (i) {
                return e(i, t)
              }
            }
            var a = t('./read-format')
            i.getReadToken = function (t) {
              var e = a.getReadFormat(t)
              return t && t.useraw
                ? (function (t) {
                    var e,
                      i = n(t).slice()
                    for (
                      i[217] = i[196], i[218] = i[197], i[219] = i[198], e = 160;
                      e <= 191;
                      e++
                    ) {
                      i[e] = s(e - 160, t.bin)
                    }
                    return i
                  })(e)
                : n(e)
            }
          },
          { './read-format': 23 },
        ],
        25: [
          function (t, e, i) {
            function n() {
              var t = this.options
              return (
                (this.encode = (function (t) {
                  var e = s.getWriteType(t)
                  return function (t, i) {
                    var n = e[typeof i]
                    if (!n) throw new Error('Unsupported type "' + typeof i + '": ' + i)
                    n(t, i)
                  }
                })(t)),
                t && t.preset && r.setExtPackers(this),
                this
              )
            }
            var o = t('./ext-buffer').ExtBuffer,
              r = t('./ext-packer'),
              s = t('./write-type'),
              a = t('./codec-base')
            a.install({
              addExtPacker: function (t, e, i) {
                function n(e) {
                  return i && (e = i(e)), new o(e, t)
                }
                i = a.filter(i)
                var r = e.name
                r && 'Object' !== r
                  ? ((this.extPackers || (this.extPackers = {}))[r] = n)
                  : (this.extEncoderList || (this.extEncoderList = [])).unshift([e, n])
              },
              getExtPacker: function (t) {
                var e = this.extPackers || (this.extPackers = {}),
                  i = t.constructor,
                  n = i && i.name && e[i.name]
                if (n) return n
                for (
                  var o = this.extEncoderList || (this.extEncoderList = []), r = o.length, s = 0;
                  s < r;
                  s++
                ) {
                  var a = o[s]
                  if (i === a[0]) return a[1]
                }
              },
              init: n,
            }),
              (i.preset = n.call(a.preset))
          },
          { './codec-base': 9, './ext-buffer': 17, './ext-packer': 18, './write-type': 27 },
        ],
        26: [
          function (t, e, i) {
            function n() {
              var t = y.slice()
              return (
                (t[196] = o(196)),
                (t[197] = r(197)),
                (t[198] = s(198)),
                (t[199] = o(199)),
                (t[200] = r(200)),
                (t[201] = s(201)),
                (t[202] = a(202, 4, w.writeFloatBE || h, !0)),
                (t[203] = a(203, 8, w.writeDoubleBE || u, !0)),
                (t[204] = o(204)),
                (t[205] = r(205)),
                (t[206] = s(206)),
                (t[207] = a(207, 8, c)),
                (t[208] = o(208)),
                (t[209] = r(209)),
                (t[210] = s(210)),
                (t[211] = a(211, 8, l)),
                (t[217] = o(217)),
                (t[218] = r(218)),
                (t[219] = s(219)),
                (t[220] = r(220)),
                (t[221] = s(221)),
                (t[222] = r(222)),
                (t[223] = s(223)),
                t
              )
            }
            function o(t) {
              return function (e, i) {
                var n = e.reserve(2),
                  o = e.buffer
                ;(o[n++] = t), (o[n] = i)
              }
            }
            function r(t) {
              return function (e, i) {
                var n = e.reserve(3),
                  o = e.buffer
                ;(o[n++] = t), (o[n++] = i >>> 8), (o[n] = i)
              }
            }
            function s(t) {
              return function (e, i) {
                var n = e.reserve(5),
                  o = e.buffer
                ;(o[n++] = t),
                  (o[n++] = i >>> 24),
                  (o[n++] = i >>> 16),
                  (o[n++] = i >>> 8),
                  (o[n] = i)
              }
            }
            function a(t, e, i, n) {
              return function (o, r) {
                var s = o.reserve(e + 1)
                ;(o.buffer[s++] = t), i.call(o.buffer, r, s, n)
              }
            }
            function c(t, e) {
              new p(this, e, t)
            }
            function l(t, e) {
              new m(this, e, t)
            }
            function h(t, e) {
              f.write(this, t, e, !1, 23, 4)
            }
            function u(t, e) {
              f.write(this, t, e, !1, 52, 8)
            }
            var f = t('ieee754'),
              d = t('int64-buffer'),
              p = d.Uint64BE,
              m = d.Int64BE,
              y = t('./write-uint8').uint8,
              g = t('./bufferish'),
              v = g.global,
              b = g.hasBuffer && 'TYPED_ARRAY_SUPPORT' in v && !v.TYPED_ARRAY_SUPPORT,
              w = (g.hasBuffer && v.prototype) || {}
            i.getWriteToken = function (t) {
              return t && t.uint8array
                ? (function () {
                    var t = n()
                    return (t[202] = a(202, 4, h)), (t[203] = a(203, 8, u)), t
                  })()
                : b || (g.hasBuffer && t && t.safe)
                ? (function () {
                    var t = y.slice()
                    return (
                      (t[196] = a(196, 1, v.prototype.writeUInt8)),
                      (t[197] = a(197, 2, v.prototype.writeUInt16BE)),
                      (t[198] = a(198, 4, v.prototype.writeUInt32BE)),
                      (t[199] = a(199, 1, v.prototype.writeUInt8)),
                      (t[200] = a(200, 2, v.prototype.writeUInt16BE)),
                      (t[201] = a(201, 4, v.prototype.writeUInt32BE)),
                      (t[202] = a(202, 4, v.prototype.writeFloatBE)),
                      (t[203] = a(203, 8, v.prototype.writeDoubleBE)),
                      (t[204] = a(204, 1, v.prototype.writeUInt8)),
                      (t[205] = a(205, 2, v.prototype.writeUInt16BE)),
                      (t[206] = a(206, 4, v.prototype.writeUInt32BE)),
                      (t[207] = a(207, 8, c)),
                      (t[208] = a(208, 1, v.prototype.writeInt8)),
                      (t[209] = a(209, 2, v.prototype.writeInt16BE)),
                      (t[210] = a(210, 4, v.prototype.writeInt32BE)),
                      (t[211] = a(211, 8, l)),
                      (t[217] = a(217, 1, v.prototype.writeUInt8)),
                      (t[218] = a(218, 2, v.prototype.writeUInt16BE)),
                      (t[219] = a(219, 4, v.prototype.writeUInt32BE)),
                      (t[220] = a(220, 2, v.prototype.writeUInt16BE)),
                      (t[221] = a(221, 4, v.prototype.writeUInt32BE)),
                      (t[222] = a(222, 2, v.prototype.writeUInt16BE)),
                      (t[223] = a(223, 4, v.prototype.writeUInt32BE)),
                      t
                    )
                  })()
                : n()
            }
          },
          { './bufferish': 8, './write-uint8': 28, ieee754: 32, 'int64-buffer': 33 },
        ],
        27: [
          function (t, e, i) {
            var n = t('isarray'),
              o = t('int64-buffer'),
              r = o.Uint64BE,
              s = o.Int64BE,
              a = t('./bufferish'),
              c = t('./bufferish-proto'),
              l = t('./write-token'),
              h = t('./write-uint8').uint8,
              u = t('./ext-buffer').ExtBuffer,
              f = 'undefined' != typeof Uint8Array,
              d = 'undefined' != typeof Map,
              p = []
            ;(p[1] = 212),
              (p[2] = 213),
              (p[4] = 214),
              (p[8] = 215),
              (p[16] = 216),
              (i.getWriteType = function (t) {
                function e(t, e) {
                  if (null === e) return i(t, e)
                  if (b(e)) return w(t, e)
                  if (n(e)) {
                    return (function (t, e) {
                      var i = e.length
                      y[i < 16 ? 144 + i : i <= 65535 ? 220 : 221](t, i)
                      for (var n = t.codec.encode, o = 0; o < i; o++) n(t, e[o])
                    })(t, e)
                  }
                  if (r.isUint64BE(e)) {
                    return (function (t, e) {
                      y[207](t, e.toArray())
                    })(t, e)
                  }
                  if (s.isInt64BE(e)) {
                    return (function (t, e) {
                      y[211](t, e.toArray())
                    })(t, e)
                  }
                  var o = t.codec.getExtPacker(e)
                  return (
                    o && (e = o(e)),
                    e instanceof u
                      ? (function (t, e) {
                          var i = e.buffer,
                            n = i.length,
                            o = p[n] || (n < 255 ? 199 : n <= 65535 ? 200 : 201)
                          y[o](t, n), h[e.type](t), t.send(i)
                        })(t, e)
                      : void x(t, e)
                  )
                }
                function i(t, e) {
                  y[192](t, e)
                }
                function o(t, e) {
                  var i = e.length
                  y[i < 255 ? 196 : i <= 65535 ? 197 : 198](t, i), t.send(e)
                }
                function m(t, e) {
                  var i = Object.keys(e),
                    n = i.length
                  y[n < 16 ? 128 + n : n <= 65535 ? 222 : 223](t, n)
                  var o = t.codec.encode
                  i.forEach(function (i) {
                    o(t, i), o(t, e[i])
                  })
                }
                var y = l.getWriteToken(t),
                  g = t && t.useraw,
                  v = f && t && t.binarraybuffer,
                  b = v ? a.isArrayBuffer : a.isBuffer,
                  w = v
                    ? function (t, e) {
                        o(t, new Uint8Array(e))
                      }
                    : o,
                  x =
                    d && t && t.usemap
                      ? function (t, e) {
                          if (!(e instanceof Map)) return m(t, e)
                          var i = e.size
                          y[i < 16 ? 128 + i : i <= 65535 ? 222 : 223](t, i)
                          var n = t.codec.encode
                          e.forEach(function (e, i, o) {
                            n(t, i), n(t, e)
                          })
                        }
                      : m,
                  k = {
                    boolean: function (t, e) {
                      y[e ? 195 : 194](t, e)
                    },
                    function: i,
                    number: function (t, e) {
                      var i = 0 | e
                      return e !== i
                        ? void y[203](t, e)
                        : void y[
                            -32 <= i && i <= 127
                              ? 255 & i
                              : 0 <= i
                              ? i <= 255
                                ? 204
                                : i <= 65535
                                ? 205
                                : 206
                              : -128 <= i
                              ? 208
                              : -32768 <= i
                              ? 209
                              : 210
                          ](t, i)
                    },
                    object: g
                      ? function (t, i) {
                          return b(i)
                            ? (function (t, e) {
                                var i = e.length
                                y[i < 32 ? 160 + i : i <= 65535 ? 218 : 219](t, i), t.send(e)
                              })(t, i)
                            : void e(t, i)
                        }
                      : e,
                    string: (function (t) {
                      return function (e, i) {
                        var n = i.length,
                          o = 5 + 3 * n
                        e.offset = e.reserve(o)
                        var r = e.buffer,
                          s = t(n),
                          a = e.offset + s
                        n = c.write.call(r, i, a)
                        var l = t(n)
                        if (s !== l) {
                          var h = a + l - s,
                            u = a + n
                          c.copy.call(r, r, h, a, u)
                        }
                        y[1 === l ? 160 + n : l <= 3 ? 215 + l : 219](e, n), (e.offset += n)
                      }
                    })(
                      g
                        ? function (t) {
                            return t < 32 ? 1 : t <= 65535 ? 3 : 5
                          }
                        : function (t) {
                            return t < 32 ? 1 : t <= 255 ? 2 : t <= 65535 ? 3 : 5
                          },
                    ),
                    symbol: i,
                    undefined: i,
                  }
                return k
              })
          },
          {
            './bufferish': 8,
            './bufferish-proto': 6,
            './ext-buffer': 17,
            './write-token': 26,
            './write-uint8': 28,
            'int64-buffer': 33,
            isarray: 34,
          },
        ],
        28: [
          function (t, e, i) {
            function n(t) {
              return function (e) {
                var i = e.reserve(1)
                e.buffer[i] = t
              }
            }
            for (var o = (i.uint8 = new Array(256)), r = 0; r <= 255; r++) o[r] = n(r)
          },
          {},
        ],
        29: [
          function (t, e, i) {
            ;(function (e) {
              function n() {
                return r.TYPED_ARRAY_SUPPORT ? 2147483647 : 1073741823
              }
              function o(t, e) {
                if (n() < e) throw new RangeError('Invalid typed array length')
                return (
                  r.TYPED_ARRAY_SUPPORT
                    ? ((t = new Uint8Array(e)).__proto__ = r.prototype)
                    : (null === t && (t = new r(e)), (t.length = e)),
                  t
                )
              }
              function r(t, e, i) {
                if (!(r.TYPED_ARRAY_SUPPORT || this instanceof r)) return new r(t, e, i)
                if ('number' == typeof t) {
                  if ('string' == typeof e) {
                    throw new Error(
                      'If encoding is specified then the first argument must be a string',
                    )
                  }
                  return c(this, t)
                }
                return s(this, t, e, i)
              }
              function s(t, e, i, n) {
                if ('number' == typeof e) {
                  throw new TypeError('"value" argument must not be a number')
                }
                return 'undefined' != typeof ArrayBuffer && e instanceof ArrayBuffer
                  ? (function (t, e, i, n) {
                      if ((e.byteLength, i < 0 || e.byteLength < i)) {
                        throw new RangeError("'offset' is out of bounds")
                      }
                      if (e.byteLength < i + (n || 0)) {
                        throw new RangeError("'length' is out of bounds")
                      }
                      return (
                        (e =
                          void 0 === i && void 0 === n
                            ? new Uint8Array(e)
                            : void 0 === n
                            ? new Uint8Array(e, i)
                            : new Uint8Array(e, i, n)),
                        r.TYPED_ARRAY_SUPPORT ? ((t = e).__proto__ = r.prototype) : (t = l(t, e)),
                        t
                      )
                    })(t, e, i, n)
                  : 'string' == typeof e
                  ? (function (t, e, i) {
                      if ((('string' == typeof i && '' !== i) || (i = 'utf8'), !r.isEncoding(i))) {
                        throw new TypeError('"encoding" must be a valid string encoding')
                      }
                      var n = 0 | u(e, i),
                        s = (t = o(t, n)).write(e, i)
                      return s !== n && (t = t.slice(0, s)), t
                    })(t, e, i)
                  : (function (t, e) {
                      if (r.isBuffer(e)) {
                        var i = 0 | h(e.length)
                        return 0 === (t = o(t, i)).length || e.copy(t, 0, 0, i), t
                      }
                      if (e) {
                        if (
                          ('undefined' != typeof ArrayBuffer && e.buffer instanceof ArrayBuffer) ||
                          'length' in e
                        ) {
                          return 'number' != typeof e.length ||
                            (function (t) {
                              return t != t
                            })(e.length)
                            ? o(t, 0)
                            : l(t, e)
                        }
                        if ('Buffer' === e.type && U(e.data)) return l(t, e.data)
                      }
                      throw new TypeError(
                        'First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.',
                      )
                    })(t, e)
              }
              function a(t) {
                if ('number' != typeof t) throw new TypeError('"size" argument must be a number')
                if (t < 0) throw new RangeError('"size" argument must not be negative')
              }
              function c(t, e) {
                if ((a(e), (t = o(t, e < 0 ? 0 : 0 | h(e))), !r.TYPED_ARRAY_SUPPORT)) {
                  for (var i = 0; i < e; ++i) t[i] = 0
                }
                return t
              }
              function l(t, e) {
                var i = e.length < 0 ? 0 : 0 | h(e.length)
                t = o(t, i)
                for (var n = 0; n < i; n += 1) t[n] = 255 & e[n]
                return t
              }
              function h(t) {
                if (t >= n()) {
                  throw new RangeError(
                    'Attempt to allocate Buffer larger than maximum size: 0x' +
                      n().toString(16) +
                      ' bytes',
                  )
                }
                return 0 | t
              }
              function u(t, e) {
                if (r.isBuffer(t)) return t.length
                if (
                  'undefined' != typeof ArrayBuffer &&
                  'function' == typeof ArrayBuffer.isView &&
                  (ArrayBuffer.isView(t) || t instanceof ArrayBuffer)
                ) {
                  return t.byteLength
                }
                'string' != typeof t && (t = '' + t)
                var i = t.length
                if (0 === i) return 0
                for (var n = !1; ; ) {
                  switch (e) {
                    case 'ascii':
                    case 'latin1':
                    case 'binary':
                      return i
                    case 'utf8':
                    case 'utf-8':
                    case void 0:
                      return I(t).length
                    case 'ucs2':
                    case 'ucs-2':
                    case 'utf16le':
                    case 'utf-16le':
                      return 2 * i
                    case 'hex':
                      return i >>> 1
                    case 'base64':
                      return V(t).length
                    default:
                      if (n) return I(t).length
                      ;(e = ('' + e).toLowerCase()), (n = !0)
                  }
                }
              }
              function f(t, e, i) {
                var n = !1
                if (((void 0 === e || e < 0) && (e = 0), e > this.length)) return ''
                if (((void 0 === i || i > this.length) && (i = this.length), i <= 0)) return ''
                if ((i >>>= 0) <= (e >>>= 0)) return ''
                for (t || (t = 'utf8'); ; ) {
                  switch (t) {
                    case 'hex':
                      return A(this, e, i)
                    case 'utf8':
                    case 'utf-8':
                      return C(this, e, i)
                    case 'ascii':
                      return _(this, e, i)
                    case 'latin1':
                    case 'binary':
                      return E(this, e, i)
                    case 'base64':
                      return k(this, e, i)
                    case 'ucs2':
                    case 'ucs-2':
                    case 'utf16le':
                    case 'utf-16le':
                      return S(this, e, i)
                    default:
                      if (n) throw new TypeError('Unknown encoding: ' + t)
                      ;(t = (t + '').toLowerCase()), (n = !0)
                  }
                }
              }
              function d(t, e, i) {
                var n = t[e]
                ;(t[e] = t[i]), (t[i] = n)
              }
              function p(t, e, i, n, o) {
                if (0 === t.length) return -1
                if (
                  ('string' == typeof i
                    ? ((n = i), (i = 0))
                    : i > 2147483647
                    ? (i = 2147483647)
                    : i < -2147483648 && (i = -2147483648),
                  (i = +i),
                  isNaN(i) && (i = o ? 0 : t.length - 1),
                  i < 0 && (i = t.length + i),
                  i >= t.length)
                ) {
                  if (o) return -1
                  i = t.length - 1
                } else if (i < 0) {
                  if (!o) return -1
                  i = 0
                }
                if (('string' == typeof e && (e = r.from(e, n)), r.isBuffer(e))) {
                  return 0 === e.length ? -1 : m(t, e, i, n, o)
                }
                if ('number' == typeof e) {
                  return (
                    (e &= 255),
                    r.TYPED_ARRAY_SUPPORT && 'function' == typeof Uint8Array.prototype.indexOf
                      ? o
                        ? Uint8Array.prototype.indexOf.call(t, e, i)
                        : Uint8Array.prototype.lastIndexOf.call(t, e, i)
                      : m(t, [e], i, n, o)
                  )
                }
                throw new TypeError('val must be string, number or Buffer')
              }
              function m(t, e, i, n, o) {
                function r(t, e) {
                  return 1 === a ? t[e] : t.readUInt16BE(e * a)
                }
                var s,
                  a = 1,
                  c = t.length,
                  l = e.length
                if (
                  void 0 !== n &&
                  ('ucs2' === (n = String(n).toLowerCase()) ||
                    'ucs-2' === n ||
                    'utf16le' === n ||
                    'utf-16le' === n)
                ) {
                  if (t.length < 2 || e.length < 2) return -1
                  ;(a = 2), (c /= 2), (l /= 2), (i /= 2)
                }
                if (o) {
                  var h = -1
                  for (s = i; s < c; s++) {
                    if (r(t, s) === r(e, -1 === h ? 0 : s - h)) {
                      if ((-1 === h && (h = s), s - h + 1 === l)) return h * a
                    } else -1 !== h && (s -= s - h), (h = -1)
                  }
                } else {
                  for (i + l > c && (i = c - l), s = i; s >= 0; s--) {
                    for (var u = !0, f = 0; f < l; f++) {
                      if (r(t, s + f) !== r(e, f)) {
                        u = !1
                        break
                      }
                    }
                    if (u) return s
                  }
                }
                return -1
              }
              function y(t, e, i, n) {
                i = Number(i) || 0
                var o = t.length - i
                n ? (n = Number(n)) > o && (n = o) : (n = o)
                var r = e.length
                if (r % 2 != 0) throw new TypeError('Invalid hex string')
                n > r / 2 && (n = r / 2)
                for (var s = 0; s < n; ++s) {
                  var a = parseInt(e.substr(2 * s, 2), 16)
                  if (isNaN(a)) return s
                  t[i + s] = a
                }
                return s
              }
              function g(t, e, i, n) {
                return D(I(e, t.length - i), t, i, n)
              }
              function v(t, e, i, n) {
                return D(
                  (function (t) {
                    for (var e = [], i = 0; i < t.length; ++i) e.push(255 & t.charCodeAt(i))
                    return e
                  })(e),
                  t,
                  i,
                  n,
                )
              }
              function b(t, e, i, n) {
                return v(t, e, i, n)
              }
              function w(t, e, i, n) {
                return D(V(e), t, i, n)
              }
              function x(t, e, i, n) {
                return D(
                  (function (t, e) {
                    for (var i, n, o, r = [], s = 0; s < t.length && !((e -= 2) < 0); ++s) {
                      ;(i = t.charCodeAt(s)), (n = i >> 8), (o = i % 256), r.push(o), r.push(n)
                    }
                    return r
                  })(e, t.length - i),
                  t,
                  i,
                  n,
                )
              }
              function k(t, e, i) {
                return 0 === e && i === t.length
                  ? F.fromByteArray(t)
                  : F.fromByteArray(t.slice(e, i))
              }
              function C(t, e, i) {
                i = Math.min(t.length, i)
                for (var n = [], o = e; o < i; ) {
                  var r,
                    s,
                    a,
                    c,
                    l = t[o],
                    h = null,
                    u = l > 239 ? 4 : l > 223 ? 3 : l > 191 ? 2 : 1
                  if (o + u <= i) {
                    switch (u) {
                      case 1:
                        l < 128 && (h = l)
                        break
                      case 2:
                        128 == (192 & (r = t[o + 1])) &&
                          (c = ((31 & l) << 6) | (63 & r)) > 127 &&
                          (h = c)
                        break
                      case 3:
                        ;(r = t[o + 1]),
                          (s = t[o + 2]),
                          128 == (192 & r) &&
                            128 == (192 & s) &&
                            (c = ((15 & l) << 12) | ((63 & r) << 6) | (63 & s)) > 2047 &&
                            (c < 55296 || c > 57343) &&
                            (h = c)
                        break
                      case 4:
                        ;(r = t[o + 1]),
                          (s = t[o + 2]),
                          (a = t[o + 3]),
                          128 == (192 & r) &&
                            128 == (192 & s) &&
                            128 == (192 & a) &&
                            (c = ((15 & l) << 18) | ((63 & r) << 12) | ((63 & s) << 6) | (63 & a)) >
                              65535 &&
                            c < 1114112 &&
                            (h = c)
                    }
                  }
                  null === h
                    ? ((h = 65533), (u = 1))
                    : h > 65535 &&
                      ((h -= 65536), n.push(((h >>> 10) & 1023) | 55296), (h = 56320 | (1023 & h))),
                    n.push(h),
                    (o += u)
                }
                return (function (t) {
                  var e = t.length
                  if (e <= j) return String.fromCharCode.apply(String, t)
                  for (var i = '', n = 0; n < e; ) {
                    i += String.fromCharCode.apply(String, t.slice(n, (n += j)))
                  }
                  return i
                })(n)
              }
              function _(t, e, i) {
                var n = ''
                i = Math.min(t.length, i)
                for (var o = e; o < i; ++o) n += String.fromCharCode(127 & t[o])
                return n
              }
              function E(t, e, i) {
                var n = ''
                i = Math.min(t.length, i)
                for (var o = e; o < i; ++o) n += String.fromCharCode(t[o])
                return n
              }
              function A(t, e, i) {
                var n = t.length
                ;(!e || e < 0) && (e = 0), (!i || i < 0 || i > n) && (i = n)
                for (var o = '', r = e; r < i; ++r) o += P(t[r])
                return o
              }
              function S(t, e, i) {
                for (var n = t.slice(e, i), o = '', r = 0; r < n.length; r += 2) {
                  o += String.fromCharCode(n[r] + 256 * n[r + 1])
                }
                return o
              }
              function B(t, e, i) {
                if (t % 1 != 0 || t < 0) throw new RangeError('offset is not uint')
                if (t + e > i) throw new RangeError('Trying to access beyond buffer length')
              }
              function L(t, e, i, n, o, s) {
                if (!r.isBuffer(t)) {
                  throw new TypeError('"buffer" argument must be a Buffer instance')
                }
                if (e > o || e < s) throw new RangeError('"value" argument is out of bounds')
                if (i + n > t.length) throw new RangeError('Index out of range')
              }
              function T(t, e, i, n) {
                e < 0 && (e = 65535 + e + 1)
                for (var o = 0, r = Math.min(t.length - i, 2); o < r; ++o) {
                  t[i + o] = (e & (255 << (8 * (n ? o : 1 - o)))) >>> (8 * (n ? o : 1 - o))
                }
              }
              function O(t, e, i, n) {
                e < 0 && (e = 4294967295 + e + 1)
                for (var o = 0, r = Math.min(t.length - i, 4); o < r; ++o) {
                  t[i + o] = (e >>> (8 * (n ? o : 3 - o))) & 255
                }
              }
              function H(t, e, i, n, o, r) {
                if (i + n > t.length) throw new RangeError('Index out of range')
                if (i < 0) throw new RangeError('Index out of range')
              }
              function M(t, e, i, n, o) {
                return o || H(t, 0, i, 4), $.write(t, e, i, n, 23, 4), i + 4
              }
              function R(t, e, i, n, o) {
                return o || H(t, 0, i, 8), $.write(t, e, i, n, 52, 8), i + 8
              }
              function P(t) {
                return t < 16 ? '0' + t.toString(16) : t.toString(16)
              }
              function I(t, e) {
                e = e || 1 / 0
                for (var i, n = t.length, o = null, r = [], s = 0; s < n; ++s) {
                  if ((i = t.charCodeAt(s)) > 55295 && i < 57344) {
                    if (!o) {
                      if (i > 56319) {
                        ;(e -= 3) > -1 && r.push(239, 191, 189)
                        continue
                      }
                      if (s + 1 === n) {
                        ;(e -= 3) > -1 && r.push(239, 191, 189)
                        continue
                      }
                      o = i
                      continue
                    }
                    if (i < 56320) {
                      ;(e -= 3) > -1 && r.push(239, 191, 189), (o = i)
                      continue
                    }
                    i = 65536 + (((o - 55296) << 10) | (i - 56320))
                  } else o && (e -= 3) > -1 && r.push(239, 191, 189)
                  if (((o = null), i < 128)) {
                    if ((e -= 1) < 0) break
                    r.push(i)
                  } else if (i < 2048) {
                    if ((e -= 2) < 0) break
                    r.push((i >> 6) | 192, (63 & i) | 128)
                  } else if (i < 65536) {
                    if ((e -= 3) < 0) break
                    r.push((i >> 12) | 224, ((i >> 6) & 63) | 128, (63 & i) | 128)
                  } else {
                    if (!(i < 1114112)) throw new Error('Invalid code point')
                    if ((e -= 4) < 0) break
                    r.push(
                      (i >> 18) | 240,
                      ((i >> 12) & 63) | 128,
                      ((i >> 6) & 63) | 128,
                      (63 & i) | 128,
                    )
                  }
                }
                return r
              }
              function V(t) {
                return F.toByteArray(
                  (function (t) {
                    if (
                      (t = (function (t) {
                        return t.trim ? t.trim() : t.replace(/^\s+|\s+$/g, '')
                      })(t).replace(N, '')).length < 2
                    ) {
                      return ''
                    }
                    for (; t.length % 4 != 0; ) t += '='
                    return t
                  })(t),
                )
              }
              function D(t, e, i, n) {
                for (var o = 0; o < n && !(o + i >= e.length || o >= t.length); ++o) e[o + i] = t[o]
                return o
              }
              var F = t('base64-js'),
                $ = t('ieee754'),
                U = t('isarray')
              ;(i.Buffer = r),
                (i.SlowBuffer = function (t) {
                  return +t != t && (t = 0), r.alloc(+t)
                }),
                (i.INSPECT_MAX_BYTES = 50),
                (r.TYPED_ARRAY_SUPPORT =
                  void 0 !== e.TYPED_ARRAY_SUPPORT
                    ? e.TYPED_ARRAY_SUPPORT
                    : (function () {
                        try {
                          var t = new Uint8Array(1)
                          return (
                            (t.__proto__ = {
                              __proto__: Uint8Array.prototype,
                              foo: function () {
                                return 42
                              },
                            }),
                            42 === t.foo() &&
                              'function' == typeof t.subarray &&
                              0 === t.subarray(1, 1).byteLength
                          )
                        } catch (t) {
                          return !1
                        }
                      })()),
                (i.kMaxLength = n()),
                (r.poolSize = 8192),
                (r._augment = function (t) {
                  return (t.__proto__ = r.prototype), t
                }),
                (r.from = function (t, e, i) {
                  return s(null, t, e, i)
                }),
                r.TYPED_ARRAY_SUPPORT &&
                  ((r.prototype.__proto__ = Uint8Array.prototype),
                  (r.__proto__ = Uint8Array),
                  'undefined' != typeof Symbol &&
                    Symbol.species &&
                    r[Symbol.species] === r &&
                    Object.defineProperty(r, Symbol.species, { value: null, configurable: !0 })),
                (r.alloc = function (t, e, i) {
                  return (function (t, e, i, n) {
                    return (
                      a(e),
                      e <= 0
                        ? o(t, e)
                        : void 0 !== i
                        ? 'string' == typeof n
                          ? o(t, e).fill(i, n)
                          : o(t, e).fill(i)
                        : o(t, e)
                    )
                  })(null, t, e, i)
                }),
                (r.allocUnsafe = function (t) {
                  return c(null, t)
                }),
                (r.allocUnsafeSlow = function (t) {
                  return c(null, t)
                }),
                (r.isBuffer = function (t) {
                  return !(null == t || !t._isBuffer)
                }),
                (r.compare = function (t, e) {
                  if (!r.isBuffer(t) || !r.isBuffer(e)) {
                    throw new TypeError('Arguments must be Buffers')
                  }
                  if (t === e) return 0
                  for (var i = t.length, n = e.length, o = 0, s = Math.min(i, n); o < s; ++o) {
                    if (t[o] !== e[o]) {
                      ;(i = t[o]), (n = e[o])
                      break
                    }
                  }
                  return i < n ? -1 : n < i ? 1 : 0
                }),
                (r.isEncoding = function (t) {
                  switch (String(t).toLowerCase()) {
                    case 'hex':
                    case 'utf8':
                    case 'utf-8':
                    case 'ascii':
                    case 'latin1':
                    case 'binary':
                    case 'base64':
                    case 'ucs2':
                    case 'ucs-2':
                    case 'utf16le':
                    case 'utf-16le':
                      return !0
                    default:
                      return !1
                  }
                }),
                (r.concat = function (t, e) {
                  if (!U(t)) throw new TypeError('"list" argument must be an Array of Buffers')
                  if (0 === t.length) return r.alloc(0)
                  var i
                  if (void 0 === e) for (e = 0, i = 0; i < t.length; ++i) e += t[i].length
                  var n = r.allocUnsafe(e),
                    o = 0
                  for (i = 0; i < t.length; ++i) {
                    var s = t[i]
                    if (!r.isBuffer(s)) {
                      throw new TypeError('"list" argument must be an Array of Buffers')
                    }
                    s.copy(n, o), (o += s.length)
                  }
                  return n
                }),
                (r.byteLength = u),
                (r.prototype._isBuffer = !0),
                (r.prototype.swap16 = function () {
                  var t = this.length
                  if (t % 2 != 0) throw new RangeError('Buffer size must be a multiple of 16-bits')
                  for (var e = 0; e < t; e += 2) d(this, e, e + 1)
                  return this
                }),
                (r.prototype.swap32 = function () {
                  var t = this.length
                  if (t % 4 != 0) throw new RangeError('Buffer size must be a multiple of 32-bits')
                  for (var e = 0; e < t; e += 4) d(this, e, e + 3), d(this, e + 1, e + 2)
                  return this
                }),
                (r.prototype.swap64 = function () {
                  var t = this.length
                  if (t % 8 != 0) throw new RangeError('Buffer size must be a multiple of 64-bits')
                  for (var e = 0; e < t; e += 8) {
                    d(this, e, e + 7),
                      d(this, e + 1, e + 6),
                      d(this, e + 2, e + 5),
                      d(this, e + 3, e + 4)
                  }
                  return this
                }),
                (r.prototype.toString = function () {
                  var t = 0 | this.length
                  return 0 === t
                    ? ''
                    : 0 === arguments.length
                    ? C(this, 0, t)
                    : f.apply(this, arguments)
                }),
                (r.prototype.equals = function (t) {
                  if (!r.isBuffer(t)) throw new TypeError('Argument must be a Buffer')
                  return this === t || 0 === r.compare(this, t)
                }),
                (r.prototype.inspect = function () {
                  var t = '',
                    e = i.INSPECT_MAX_BYTES
                  return (
                    this.length > 0 &&
                      ((t = this.toString('hex', 0, e).match(/.{2}/g).join(' ')),
                      this.length > e && (t += ' ... ')),
                    '<Buffer ' + t + '>'
                  )
                }),
                (r.prototype.compare = function (t, e, i, n, o) {
                  if (!r.isBuffer(t)) throw new TypeError('Argument must be a Buffer')
                  if (
                    (void 0 === e && (e = 0),
                    void 0 === i && (i = t ? t.length : 0),
                    void 0 === n && (n = 0),
                    void 0 === o && (o = this.length),
                    e < 0 || i > t.length || n < 0 || o > this.length)
                  ) {
                    throw new RangeError('out of range index')
                  }
                  if (n >= o && e >= i) return 0
                  if (n >= o) return -1
                  if (e >= i) return 1
                  if (this === t) return 0
                  for (
                    var s = (o >>>= 0) - (n >>>= 0),
                      a = (i >>>= 0) - (e >>>= 0),
                      c = Math.min(s, a),
                      l = this.slice(n, o),
                      h = t.slice(e, i),
                      u = 0;
                    u < c;
                    ++u
                  ) {
                    if (l[u] !== h[u]) {
                      ;(s = l[u]), (a = h[u])
                      break
                    }
                  }
                  return s < a ? -1 : a < s ? 1 : 0
                }),
                (r.prototype.includes = function (t, e, i) {
                  return -1 !== this.indexOf(t, e, i)
                }),
                (r.prototype.indexOf = function (t, e, i) {
                  return p(this, t, e, i, !0)
                }),
                (r.prototype.lastIndexOf = function (t, e, i) {
                  return p(this, t, e, i, !1)
                }),
                (r.prototype.write = function (t, e, i, n) {
                  if (void 0 === e) (n = 'utf8'), (i = this.length), (e = 0)
                  else if (void 0 === i && 'string' == typeof e) (n = e), (i = this.length), (e = 0)
                  else {
                    if (!isFinite(e)) {
                      throw new Error(
                        'Buffer.write(string, encoding, offset[, length]) is no longer supported',
                      )
                    }
                    ;(e |= 0),
                      isFinite(i)
                        ? ((i |= 0), void 0 === n && (n = 'utf8'))
                        : ((n = i), (i = void 0))
                  }
                  var o = this.length - e
                  if (
                    ((void 0 === i || i > o) && (i = o),
                    (t.length > 0 && (i < 0 || e < 0)) || e > this.length)
                  ) {
                    throw new RangeError('Attempt to write outside buffer bounds')
                  }
                  n || (n = 'utf8')
                  for (var r = !1; ; ) {
                    switch (n) {
                      case 'hex':
                        return y(this, t, e, i)
                      case 'utf8':
                      case 'utf-8':
                        return g(this, t, e, i)
                      case 'ascii':
                        return v(this, t, e, i)
                      case 'latin1':
                      case 'binary':
                        return b(this, t, e, i)
                      case 'base64':
                        return w(this, t, e, i)
                      case 'ucs2':
                      case 'ucs-2':
                      case 'utf16le':
                      case 'utf-16le':
                        return x(this, t, e, i)
                      default:
                        if (r) throw new TypeError('Unknown encoding: ' + n)
                        ;(n = ('' + n).toLowerCase()), (r = !0)
                    }
                  }
                }),
                (r.prototype.toJSON = function () {
                  return { type: 'Buffer', data: Array.prototype.slice.call(this._arr || this, 0) }
                })
              var j = 4096
              ;(r.prototype.slice = function (t, e) {
                var i,
                  n = this.length
                if (
                  ((t = ~~t) < 0 ? (t += n) < 0 && (t = 0) : t > n && (t = n),
                  (e = void 0 === e ? n : ~~e) < 0 ? (e += n) < 0 && (e = 0) : e > n && (e = n),
                  e < t && (e = t),
                  r.TYPED_ARRAY_SUPPORT)
                ) {
                  ;(i = this.subarray(t, e)).__proto__ = r.prototype
                } else {
                  var o = e - t
                  i = new r(o, void 0)
                  for (var s = 0; s < o; ++s) i[s] = this[s + t]
                }
                return i
              }),
                (r.prototype.readUIntLE = function (t, e, i) {
                  ;(t |= 0), (e |= 0), i || B(t, e, this.length)
                  for (var n = this[t], o = 1, r = 0; ++r < e && (o *= 256); ) n += this[t + r] * o
                  return n
                }),
                (r.prototype.readUIntBE = function (t, e, i) {
                  ;(t |= 0), (e |= 0), i || B(t, e, this.length)
                  for (var n = this[t + --e], o = 1; e > 0 && (o *= 256); ) n += this[t + --e] * o
                  return n
                }),
                (r.prototype.readUInt8 = function (t, e) {
                  return e || B(t, 1, this.length), this[t]
                }),
                (r.prototype.readUInt16LE = function (t, e) {
                  return e || B(t, 2, this.length), this[t] | (this[t + 1] << 8)
                }),
                (r.prototype.readUInt16BE = function (t, e) {
                  return e || B(t, 2, this.length), (this[t] << 8) | this[t + 1]
                }),
                (r.prototype.readUInt32LE = function (t, e) {
                  return (
                    e || B(t, 4, this.length),
                    (this[t] | (this[t + 1] << 8) | (this[t + 2] << 16)) + 16777216 * this[t + 3]
                  )
                }),
                (r.prototype.readUInt32BE = function (t, e) {
                  return (
                    e || B(t, 4, this.length),
                    16777216 * this[t] + ((this[t + 1] << 16) | (this[t + 2] << 8) | this[t + 3])
                  )
                }),
                (r.prototype.readIntLE = function (t, e, i) {
                  ;(t |= 0), (e |= 0), i || B(t, e, this.length)
                  for (var n = this[t], o = 1, r = 0; ++r < e && (o *= 256); ) n += this[t + r] * o
                  return n >= (o *= 128) && (n -= Math.pow(2, 8 * e)), n
                }),
                (r.prototype.readIntBE = function (t, e, i) {
                  ;(t |= 0), (e |= 0), i || B(t, e, this.length)
                  for (var n = e, o = 1, r = this[t + --n]; n > 0 && (o *= 256); ) {
                    r += this[t + --n] * o
                  }
                  return r >= (o *= 128) && (r -= Math.pow(2, 8 * e)), r
                }),
                (r.prototype.readInt8 = function (t, e) {
                  return (
                    e || B(t, 1, this.length), 128 & this[t] ? -1 * (255 - this[t] + 1) : this[t]
                  )
                }),
                (r.prototype.readInt16LE = function (t, e) {
                  e || B(t, 2, this.length)
                  var i = this[t] | (this[t + 1] << 8)
                  return 32768 & i ? 4294901760 | i : i
                }),
                (r.prototype.readInt16BE = function (t, e) {
                  e || B(t, 2, this.length)
                  var i = this[t + 1] | (this[t] << 8)
                  return 32768 & i ? 4294901760 | i : i
                }),
                (r.prototype.readInt32LE = function (t, e) {
                  return (
                    e || B(t, 4, this.length),
                    this[t] | (this[t + 1] << 8) | (this[t + 2] << 16) | (this[t + 3] << 24)
                  )
                }),
                (r.prototype.readInt32BE = function (t, e) {
                  return (
                    e || B(t, 4, this.length),
                    (this[t] << 24) | (this[t + 1] << 16) | (this[t + 2] << 8) | this[t + 3]
                  )
                }),
                (r.prototype.readFloatLE = function (t, e) {
                  return e || B(t, 4, this.length), $.read(this, t, !0, 23, 4)
                }),
                (r.prototype.readFloatBE = function (t, e) {
                  return e || B(t, 4, this.length), $.read(this, t, !1, 23, 4)
                }),
                (r.prototype.readDoubleLE = function (t, e) {
                  return e || B(t, 8, this.length), $.read(this, t, !0, 52, 8)
                }),
                (r.prototype.readDoubleBE = function (t, e) {
                  return e || B(t, 8, this.length), $.read(this, t, !1, 52, 8)
                }),
                (r.prototype.writeUIntLE = function (t, e, i, n) {
                  ;((t = +t), (e |= 0), (i |= 0), n) || L(this, t, e, i, Math.pow(2, 8 * i) - 1, 0)
                  var o = 1,
                    r = 0
                  for (this[e] = 255 & t; ++r < i && (o *= 256); ) this[e + r] = (t / o) & 255
                  return e + i
                }),
                (r.prototype.writeUIntBE = function (t, e, i, n) {
                  ;((t = +t), (e |= 0), (i |= 0), n) || L(this, t, e, i, Math.pow(2, 8 * i) - 1, 0)
                  var o = i - 1,
                    r = 1
                  for (this[e + o] = 255 & t; --o >= 0 && (r *= 256); ) this[e + o] = (t / r) & 255
                  return e + i
                }),
                (r.prototype.writeUInt8 = function (t, e, i) {
                  return (
                    (t = +t),
                    (e |= 0),
                    i || L(this, t, e, 1, 255, 0),
                    r.TYPED_ARRAY_SUPPORT || (t = Math.floor(t)),
                    (this[e] = 255 & t),
                    e + 1
                  )
                }),
                (r.prototype.writeUInt16LE = function (t, e, i) {
                  return (
                    (t = +t),
                    (e |= 0),
                    i || L(this, t, e, 2, 65535, 0),
                    r.TYPED_ARRAY_SUPPORT
                      ? ((this[e] = 255 & t), (this[e + 1] = t >>> 8))
                      : T(this, t, e, !0),
                    e + 2
                  )
                }),
                (r.prototype.writeUInt16BE = function (t, e, i) {
                  return (
                    (t = +t),
                    (e |= 0),
                    i || L(this, t, e, 2, 65535, 0),
                    r.TYPED_ARRAY_SUPPORT
                      ? ((this[e] = t >>> 8), (this[e + 1] = 255 & t))
                      : T(this, t, e, !1),
                    e + 2
                  )
                }),
                (r.prototype.writeUInt32LE = function (t, e, i) {
                  return (
                    (t = +t),
                    (e |= 0),
                    i || L(this, t, e, 4, 4294967295, 0),
                    r.TYPED_ARRAY_SUPPORT
                      ? ((this[e + 3] = t >>> 24),
                        (this[e + 2] = t >>> 16),
                        (this[e + 1] = t >>> 8),
                        (this[e] = 255 & t))
                      : O(this, t, e, !0),
                    e + 4
                  )
                }),
                (r.prototype.writeUInt32BE = function (t, e, i) {
                  return (
                    (t = +t),
                    (e |= 0),
                    i || L(this, t, e, 4, 4294967295, 0),
                    r.TYPED_ARRAY_SUPPORT
                      ? ((this[e] = t >>> 24),
                        (this[e + 1] = t >>> 16),
                        (this[e + 2] = t >>> 8),
                        (this[e + 3] = 255 & t))
                      : O(this, t, e, !1),
                    e + 4
                  )
                }),
                (r.prototype.writeIntLE = function (t, e, i, n) {
                  if (((t = +t), (e |= 0), !n)) {
                    var o = Math.pow(2, 8 * i - 1)
                    L(this, t, e, i, o - 1, -o)
                  }
                  var r = 0,
                    s = 1,
                    a = 0
                  for (this[e] = 255 & t; ++r < i && (s *= 256); ) {
                    t < 0 && 0 === a && 0 !== this[e + r - 1] && (a = 1),
                      (this[e + r] = (((t / s) >> 0) - a) & 255)
                  }
                  return e + i
                }),
                (r.prototype.writeIntBE = function (t, e, i, n) {
                  if (((t = +t), (e |= 0), !n)) {
                    var o = Math.pow(2, 8 * i - 1)
                    L(this, t, e, i, o - 1, -o)
                  }
                  var r = i - 1,
                    s = 1,
                    a = 0
                  for (this[e + r] = 255 & t; --r >= 0 && (s *= 256); ) {
                    t < 0 && 0 === a && 0 !== this[e + r + 1] && (a = 1),
                      (this[e + r] = (((t / s) >> 0) - a) & 255)
                  }
                  return e + i
                }),
                (r.prototype.writeInt8 = function (t, e, i) {
                  return (
                    (t = +t),
                    (e |= 0),
                    i || L(this, t, e, 1, 127, -128),
                    r.TYPED_ARRAY_SUPPORT || (t = Math.floor(t)),
                    t < 0 && (t = 255 + t + 1),
                    (this[e] = 255 & t),
                    e + 1
                  )
                }),
                (r.prototype.writeInt16LE = function (t, e, i) {
                  return (
                    (t = +t),
                    (e |= 0),
                    i || L(this, t, e, 2, 32767, -32768),
                    r.TYPED_ARRAY_SUPPORT
                      ? ((this[e] = 255 & t), (this[e + 1] = t >>> 8))
                      : T(this, t, e, !0),
                    e + 2
                  )
                }),
                (r.prototype.writeInt16BE = function (t, e, i) {
                  return (
                    (t = +t),
                    (e |= 0),
                    i || L(this, t, e, 2, 32767, -32768),
                    r.TYPED_ARRAY_SUPPORT
                      ? ((this[e] = t >>> 8), (this[e + 1] = 255 & t))
                      : T(this, t, e, !1),
                    e + 2
                  )
                }),
                (r.prototype.writeInt32LE = function (t, e, i) {
                  return (
                    (t = +t),
                    (e |= 0),
                    i || L(this, t, e, 4, 2147483647, -2147483648),
                    r.TYPED_ARRAY_SUPPORT
                      ? ((this[e] = 255 & t),
                        (this[e + 1] = t >>> 8),
                        (this[e + 2] = t >>> 16),
                        (this[e + 3] = t >>> 24))
                      : O(this, t, e, !0),
                    e + 4
                  )
                }),
                (r.prototype.writeInt32BE = function (t, e, i) {
                  return (
                    (t = +t),
                    (e |= 0),
                    i || L(this, t, e, 4, 2147483647, -2147483648),
                    t < 0 && (t = 4294967295 + t + 1),
                    r.TYPED_ARRAY_SUPPORT
                      ? ((this[e] = t >>> 24),
                        (this[e + 1] = t >>> 16),
                        (this[e + 2] = t >>> 8),
                        (this[e + 3] = 255 & t))
                      : O(this, t, e, !1),
                    e + 4
                  )
                }),
                (r.prototype.writeFloatLE = function (t, e, i) {
                  return M(this, t, e, !0, i)
                }),
                (r.prototype.writeFloatBE = function (t, e, i) {
                  return M(this, t, e, !1, i)
                }),
                (r.prototype.writeDoubleLE = function (t, e, i) {
                  return R(this, t, e, !0, i)
                }),
                (r.prototype.writeDoubleBE = function (t, e, i) {
                  return R(this, t, e, !1, i)
                }),
                (r.prototype.copy = function (t, e, i, n) {
                  if (
                    (i || (i = 0),
                    n || 0 === n || (n = this.length),
                    e >= t.length && (e = t.length),
                    e || (e = 0),
                    n > 0 && n < i && (n = i),
                    n === i)
                  ) {
                    return 0
                  }
                  if (0 === t.length || 0 === this.length) return 0
                  if (e < 0) throw new RangeError('targetStart out of bounds')
                  if (i < 0 || i >= this.length) throw new RangeError('sourceStart out of bounds')
                  if (n < 0) throw new RangeError('sourceEnd out of bounds')
                  n > this.length && (n = this.length),
                    t.length - e < n - i && (n = t.length - e + i)
                  var o,
                    s = n - i
                  if (this === t && i < e && e < n) {
                    for (o = s - 1; o >= 0; --o) t[o + e] = this[o + i]
                  } else if (s < 1e3 || !r.TYPED_ARRAY_SUPPORT) {
                    for (o = 0; o < s; ++o) t[o + e] = this[o + i]
                  } else Uint8Array.prototype.set.call(t, this.subarray(i, i + s), e)
                  return s
                }),
                (r.prototype.fill = function (t, e, i, n) {
                  if ('string' == typeof t) {
                    if (
                      ('string' == typeof e
                        ? ((n = e), (e = 0), (i = this.length))
                        : 'string' == typeof i && ((n = i), (i = this.length)),
                      1 === t.length)
                    ) {
                      var o = t.charCodeAt(0)
                      o < 256 && (t = o)
                    }
                    if (void 0 !== n && 'string' != typeof n) {
                      throw new TypeError('encoding must be a string')
                    }
                    if ('string' == typeof n && !r.isEncoding(n)) {
                      throw new TypeError('Unknown encoding: ' + n)
                    }
                  } else 'number' == typeof t && (t &= 255)
                  if (e < 0 || this.length < e || this.length < i) {
                    throw new RangeError('Out of range index')
                  }
                  if (i <= e) return this
                  var s
                  if (
                    ((e >>>= 0),
                    (i = void 0 === i ? this.length : i >>> 0),
                    t || (t = 0),
                    'number' == typeof t)
                  ) {
                    for (s = e; s < i; ++s) this[s] = t
                  } else {
                    var a = r.isBuffer(t) ? t : I(new r(t, n).toString()),
                      c = a.length
                    for (s = 0; s < i - e; ++s) this[s + e] = a[s % c]
                  }
                  return this
                })
              var N = /[^+\/0-9A-Za-z-_]/g
            }.call(
              this,
              'undefined' != typeof global
                ? global
                : 'undefined' != typeof self
                ? self
                : 'undefined' != typeof window
                ? window
                : {},
            ))
          },
          { 'base64-js': 30, ieee754: 32, isarray: 34 },
        ],
        30: [
          function (t, e, i) {
            function n(t) {
              var e = t.length
              if (e % 4 > 0) throw new Error('Invalid string. Length must be a multiple of 4')
              return '=' === t[e - 2] ? 2 : '=' === t[e - 1] ? 1 : 0
            }
            function o(t) {
              return s[(t >> 18) & 63] + s[(t >> 12) & 63] + s[(t >> 6) & 63] + s[63 & t]
            }
            function r(t, e, i) {
              for (var n, r = [], s = e; s < i; s += 3) {
                ;(n = (t[s] << 16) + (t[s + 1] << 8) + t[s + 2]), r.push(o(n))
              }
              return r.join('')
            }
            ;(i.byteLength = function (t) {
              return (3 * t.length) / 4 - n(t)
            }),
              (i.toByteArray = function (t) {
                var e,
                  i,
                  o,
                  r,
                  s,
                  l,
                  h = t.length
                ;(s = n(t)), (l = new c((3 * h) / 4 - s)), (o = s > 0 ? h - 4 : h)
                var u = 0
                for (e = 0, i = 0; e < o; e += 4, i += 3) {
                  ;(r =
                    (a[t.charCodeAt(e)] << 18) |
                    (a[t.charCodeAt(e + 1)] << 12) |
                    (a[t.charCodeAt(e + 2)] << 6) |
                    a[t.charCodeAt(e + 3)]),
                    (l[u++] = (r >> 16) & 255),
                    (l[u++] = (r >> 8) & 255),
                    (l[u++] = 255 & r)
                }
                return (
                  2 === s
                    ? ((r = (a[t.charCodeAt(e)] << 2) | (a[t.charCodeAt(e + 1)] >> 4)),
                      (l[u++] = 255 & r))
                    : 1 === s &&
                      ((r =
                        (a[t.charCodeAt(e)] << 10) |
                        (a[t.charCodeAt(e + 1)] << 4) |
                        (a[t.charCodeAt(e + 2)] >> 2)),
                      (l[u++] = (r >> 8) & 255),
                      (l[u++] = 255 & r)),
                  l
                )
              }),
              (i.fromByteArray = function (t) {
                for (
                  var e, i = t.length, n = i % 3, o = '', a = [], c = 16383, l = 0, h = i - n;
                  l < h;
                  l += c
                ) {
                  a.push(r(t, l, l + c > h ? h : l + c))
                }
                return (
                  1 === n
                    ? ((e = t[i - 1]), (o += s[e >> 2]), (o += s[(e << 4) & 63]), (o += '=='))
                    : 2 === n &&
                      ((e = (t[i - 2] << 8) + t[i - 1]),
                      (o += s[e >> 10]),
                      (o += s[(e >> 4) & 63]),
                      (o += s[(e << 2) & 63]),
                      (o += '=')),
                  a.push(o),
                  a.join('')
                )
              })
            for (
              var s = [],
                a = [],
                c = 'undefined' != typeof Uint8Array ? Uint8Array : Array,
                l = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
                h = 0,
                u = l.length;
              h < u;
              ++h
            ) {
              ;(s[h] = l[h]), (a[l.charCodeAt(h)] = h)
            }
            ;(a['-'.charCodeAt(0)] = 62), (a['_'.charCodeAt(0)] = 63)
          },
          {},
        ],
        31: [
          function (t, e, i) {
            !(function (t) {
              function i(t) {
                for (var e in s) t[e] = s[e]
                return t
              }
              function n(t, e) {
                function i(t) {
                  return t !== e && t.originalListener !== e
                }
                var s,
                  a = this
                if (arguments.length) {
                  if (e) {
                    if ((s = o(a, t, !0))) {
                      if (!(s = s.filter(i)).length) return n.call(a, t)
                      a[r][t] = s
                    }
                  } else if ((s = a[r]) && (delete s[t], !Object.keys(s).length)) return n.call(a)
                } else delete a[r]
                return a
              }
              function o(t, e, i) {
                if (!i || t[r]) {
                  var n = t[r] || (t[r] = {})
                  return n[e] || (n[e] = [])
                }
              }
              void 0 !== e && (e.exports = t)
              var r = 'listeners',
                s = {
                  on: function (t, e) {
                    return o(this, t).push(e), this
                  },
                  once: function (t, e) {
                    function i() {
                      n.call(r, t, i), e.apply(this, arguments)
                    }
                    var r = this
                    return (i.originalListener = e), o(r, t).push(i), r
                  },
                  off: n,
                  emit: function (t, e) {
                    function i(t) {
                      t.call(s)
                    }
                    function n(t) {
                      t.call(s, e)
                    }
                    function r(t) {
                      t.apply(s, l)
                    }
                    var s = this,
                      a = o(s, t, !0)
                    if (!a) return !1
                    var c = arguments.length
                    if (1 === c) a.forEach(i)
                    else if (2 === c) a.forEach(n)
                    else {
                      var l = Array.prototype.slice.call(arguments, 1)
                      a.forEach(r)
                    }
                    return !!a.length
                  },
                }
              i(t.prototype), (t.mixin = i)
            })(function n() {
              if (!(this instanceof n)) return new n()
            })
          },
          {},
        ],
        32: [
          function (t, e, i) {
            ;(i.read = function (t, e, i, n, o) {
              var r,
                s,
                a = 8 * o - n - 1,
                c = (1 << a) - 1,
                l = c >> 1,
                h = -7,
                u = i ? o - 1 : 0,
                f = i ? -1 : 1,
                d = t[e + u]
              for (
                u += f, r = d & ((1 << -h) - 1), d >>= -h, h += a;
                h > 0;
                r = 256 * r + t[e + u], u += f, h -= 8
              );
              for (
                s = r & ((1 << -h) - 1), r >>= -h, h += n;
                h > 0;
                s = 256 * s + t[e + u], u += f, h -= 8
              );
              if (0 === r) r = 1 - l
              else {
                if (r === c) return s ? NaN : (1 / 0) * (d ? -1 : 1)
                ;(s += Math.pow(2, n)), (r -= l)
              }
              return (d ? -1 : 1) * s * Math.pow(2, r - n)
            }),
              (i.write = function (t, e, i, n, o, r) {
                var s,
                  a,
                  c,
                  l = 8 * r - o - 1,
                  h = (1 << l) - 1,
                  u = h >> 1,
                  f = 23 === o ? Math.pow(2, -24) - Math.pow(2, -77) : 0,
                  d = n ? 0 : r - 1,
                  p = n ? 1 : -1,
                  m = e < 0 || (0 === e && 1 / e < 0) ? 1 : 0
                for (
                  e = Math.abs(e),
                    isNaN(e) || e === 1 / 0
                      ? ((a = isNaN(e) ? 1 : 0), (s = h))
                      : ((s = Math.floor(Math.log(e) / Math.LN2)),
                        e * (c = Math.pow(2, -s)) < 1 && (s--, (c *= 2)),
                        (e += s + u >= 1 ? f / c : f * Math.pow(2, 1 - u)) * c >= 2 &&
                          (s++, (c /= 2)),
                        s + u >= h
                          ? ((a = 0), (s = h))
                          : s + u >= 1
                          ? ((a = (e * c - 1) * Math.pow(2, o)), (s += u))
                          : ((a = e * Math.pow(2, u - 1) * Math.pow(2, o)), (s = 0)));
                  o >= 8;
                  t[i + d] = 255 & a, d += p, a /= 256, o -= 8
                );
                for (s = (s << o) | a, l += o; l > 0; t[i + d] = 255 & s, d += p, s /= 256, l -= 8);
                t[i + d - p] |= 128 * m
              })
          },
          {},
        ],
        33: [
          function (t, e, i) {
            ;(function (t) {
              !(function (e) {
                function i(t, i, b) {
                  function k(t, e, i, n) {
                    return this instanceof k
                      ? (function (t, e, i, n, o) {
                          if (
                            (y &&
                              g &&
                              (e instanceof g && (e = new y(e)), n instanceof g && (n = new y(n))),
                            !(e || i || n || d))
                          ) {
                            return void (t.buffer = c(v, 0))
                          }
                          if (!s(e, i)) {
                            ;(o = i), (n = e), (i = 0), (e = new (d || Array)(8))
                          }
                          ;(t.buffer = e),
                            (t.offset = i |= 0),
                            p !== typeof n &&
                              ('string' == typeof n
                                ? (function (t, e, i, n) {
                                    var o = 0,
                                      r = i.length,
                                      s = 0,
                                      a = 0
                                    '-' === i[0] && o++
                                    for (var c = o; o < r; ) {
                                      var l = parseInt(i[o++], n)
                                      if (!(l >= 0)) break
                                      ;(a = a * n + l), (s = s * n + Math.floor(a / w)), (a %= w)
                                    }
                                    c && ((s = ~s), a ? (a = w - a) : s++),
                                      _(t, e + A, s),
                                      _(t, e + S, a)
                                  })(e, i, n, o || 10)
                                : s(n, o)
                                ? a(e, i, n, o)
                                : 'number' == typeof o
                                ? (_(e, i + A, n), _(e, i + S, o))
                                : n > 0
                                ? H(e, i, n)
                                : n < 0
                                ? M(e, i, n)
                                : a(e, i, v, 0))
                        })(this, t, e, i, n)
                      : new k(t, e, i, n)
                  }
                  function C() {
                    var t = this.buffer,
                      e = this.offset,
                      i = E(t, e + A),
                      n = E(t, e + S)
                    return b || (i |= 0), i ? i * w + n : n
                  }
                  function _(t, e, i) {
                    ;(t[e + O] = 255 & i),
                      (i >>= 8),
                      (t[e + T] = 255 & i),
                      (i >>= 8),
                      (t[e + L] = 255 & i),
                      (i >>= 8),
                      (t[e + B] = 255 & i)
                  }
                  function E(t, e) {
                    return t[e + B] * x + (t[e + L] << 16) + (t[e + T] << 8) + t[e + O]
                  }
                  var A = i ? 0 : 4,
                    S = i ? 4 : 0,
                    B = i ? 0 : 3,
                    L = i ? 1 : 2,
                    T = i ? 2 : 1,
                    O = i ? 3 : 0,
                    H = i ? l : u,
                    M = i ? h : f,
                    R = k.prototype,
                    P = 'is' + t,
                    I = '_' + P
                  return (
                    (R.buffer = void 0),
                    (R.offset = 0),
                    (R[I] = !0),
                    (R.toNumber = C),
                    (R.toString = function (t) {
                      var e = this.buffer,
                        i = this.offset,
                        n = E(e, i + A),
                        o = E(e, i + S),
                        r = '',
                        s = !b && 2147483648 & n
                      for (s && ((n = ~n), (o = w - o)), t = t || 10; ; ) {
                        var a = (n % t) * w + o
                        if (
                          ((n = Math.floor(n / t)),
                          (o = Math.floor(a / t)),
                          (r = (a % t).toString(t) + r),
                          !n && !o)
                        ) {
                          break
                        }
                      }
                      return s && (r = '-' + r), r
                    }),
                    (R.toJSON = C),
                    (R.toArray = n),
                    m && (R.toBuffer = o),
                    y && (R.toArrayBuffer = r),
                    (k[P] = function (t) {
                      return !(!t || !t[I])
                    }),
                    (e[t] = k),
                    k
                  )
                }
                function n(t) {
                  var e = this.buffer,
                    i = this.offset
                  return (d = null), !1 !== t && 0 === i && 8 === e.length && b(e) ? e : c(e, i)
                }
                function o(e) {
                  var i = this.buffer,
                    n = this.offset
                  if (((d = m), !1 !== e && 0 === n && 8 === i.length && t.isBuffer(i))) return i
                  var o = new m(8)
                  return a(o, 0, i, n), o
                }
                function r(t) {
                  var e = this.buffer,
                    i = this.offset,
                    n = e.buffer
                  if (((d = y), !1 !== t && 0 === i && n instanceof g && 8 === n.byteLength)) {
                    return n
                  }
                  var o = new y(8)
                  return a(o, 0, e, i), o.buffer
                }
                function s(t, e) {
                  var i = t && t.length
                  return (e |= 0), i && e + 8 <= i && 'string' != typeof t[e]
                }
                function a(t, e, i, n) {
                  ;(e |= 0), (n |= 0)
                  for (var o = 0; o < 8; o++) t[e++] = 255 & i[n++]
                }
                function c(t, e) {
                  return Array.prototype.slice.call(t, e, e + 8)
                }
                function l(t, e, i) {
                  for (var n = e + 8; n > e; ) (t[--n] = 255 & i), (i /= 256)
                }
                function h(t, e, i) {
                  var n = e + 8
                  for (i++; n > e; ) (t[--n] = (255 & -i) ^ 255), (i /= 256)
                }
                function u(t, e, i) {
                  for (var n = e + 8; e < n; ) (t[e++] = 255 & i), (i /= 256)
                }
                function f(t, e, i) {
                  var n = e + 8
                  for (i++; e < n; ) (t[e++] = (255 & -i) ^ 255), (i /= 256)
                }
                var d,
                  p = 'undefined',
                  m = p !== typeof t && t,
                  y = p !== typeof Uint8Array && Uint8Array,
                  g = p !== typeof ArrayBuffer && ArrayBuffer,
                  v = [0, 0, 0, 0, 0, 0, 0, 0],
                  b =
                    Array.isArray ||
                    function (t) {
                      return !!t && '[object Array]' == Object.prototype.toString.call(t)
                    },
                  w = 4294967296,
                  x = 16777216
                i('Uint64BE', !0, !0),
                  i('Int64BE', !0, !1),
                  i('Uint64LE', !1, !0),
                  i('Int64LE', !1, !1)
              })('object' == typeof i && 'string' != typeof i.nodeName ? i : this || {})
            }.call(this, t('buffer').Buffer))
          },
          { buffer: 29 },
        ],
        34: [
          function (t, e, i) {
            var n = {}.toString
            e.exports =
              Array.isArray ||
              function (t) {
                return '[object Array]' == n.call(t)
              }
          },
          {},
        ],
      },
      {},
      [1],
    )(1)
  })
  var fo = Object.create(null),
    po = window.msgpack
  delete window.msgpack
  var mo = null,
    yo = null,
    go = [],
    vo = null,
    bo = null
  function wo(t) {
    if (Array.isArray(t) && 0 !== t.length) {
      t.forEach(function (t) {
        ;-1 === go.indexOf(t) && go.push(t)
      })
    }
  }
  function xo() {
    return (
      !(!mo || !yo) &&
      -1 !== ['hsw', 'hsj', 'hsl'].indexOf(mo.type) &&
      (!('n' in yo.payload) || yo.payload.n === mo.type)
    )
  }
  var ko = function (t) {
      if ((St('Set spec', 'proof', 'info', t), t)) {
        ;(mo = t), (yo = null)
        try {
          Bo((yo = Ht.decode(t.req)))['catch'](function () {})
        } catch (Qr) {
          At('proof', Qr)
        }
      }
    },
    Co = function (t) {
      t && (vo = t)
    },
    _o = function () {
      return new Promise(function (t) {
        var e = mo,
          i = yo
        if (e) {
          try {
            if ((St('Solve Proof', 'proof', 'info', e), !xo())) {
              return (
                Et('Asset script invalid file', 'error', 'proof', { seen: e.type, wanted: i.n }),
                void t({ solved: null, spec: e })
              )
            }
            Promise.resolve()
              .then(function () {
                return Bo(i)
              })
              .then(function (t) {
                if ('function' != typeof t) {
                  return Promise.reject(new Error('Script is not a function'))
                }
                var i = {
                  assethost: ft.assethost,
                  fetchAsset: function (t) {
                    return Be.retrieve(t)
                      .then(function (e) {
                        return e || Be.file(t, { responseType: 'arraybuffer' })
                      })
                      .then(function (t) {
                        return t.data
                      })
                  },
                  href: vo,
                  ardata: bo,
                }
                return (
                  go.length && (i.errors = go),
                  ui.messages.length && (i.messages = ui.messages),
                  t(e.req, i)
                )
              })
              .then(function (i) {
                t({ solved: i, spec: e })
              })
              ['catch'](function (i) {
                'string' == typeof i && -1 !== i.indexOf('http')
                  ? Et('Asset Script Failed', 'error', 'proof', { error: i })
                  : At('proof', i),
                  t({ solved: 'fail', spec: e })
              })
          } catch (Qr) {
            At('proof', Qr), t({ solved: null, spec: e })
          }
        } else t({ solved: null, spec: null })
      })
    },
    Eo = function (t) {
      return new Promise(function (e) {
        if ((St('d0', 'proof', 'info', mo), !xo())) {
          return (
            Et('Asset script invalid file', 'error', 'proof', {
              seen: !!mo && mo.type,
              wanted: !!yo && yo.n,
            }),
            e(undefined)
          )
        }
        Bo(yo)
          .then(function (e) {
            return 'function' != typeof e
              ? Promise.reject(new Error('Script is not a function'))
              : e(0, t)
          })
          .then(function (t) {
            e(po.decode(t))
          })
          ['catch'](function (t) {
            At('d0', t), e(undefined)
          })
      })
    },
    Ao = function (t) {
      return new Promise(function (e) {
        if ((St('e1', 'proof', 'info', mo), !xo())) {
          return (
            Et('Asset script invalid file', 'error', 'proof', {
              seen: !!mo && mo.type,
              wanted: !!yo && yo.n,
            }),
            e(undefined)
          )
        }
        Bo(yo)
          .then(function (e) {
            return 'function' != typeof e
              ? Promise.reject(new Error('Script is not a function'))
              : e(1, po.encode(t))
          })
          .then(function (t) {
            e(t)
          })
          ['catch'](function (t) {
            At('e1', t), e(undefined)
          })
      })
    },
    So = function (t) {
      return po.encode(t)
    }
  function Bo(t) {
    var e = t.payload.l
    '/' === e[0] && (e = ht.assetDomain + e)
    var i = t.payload.i,
      n = t.payload.n,
      o = fo[n]
    if (o && o.location === e) return o.promise
    var r = Be.script(e + '/' + n + '.js', { integrity: i }).then(function () {
      var t = window[n]
      try {
        t('IiI=.eyJzIjowLCJmIjowLCJjIjowfQ==.')['catch'](function () {})
      } catch (ts) {}
      return t
    })
    return (fo[n] = { location: e, promise: r }), r
  }
  var Lo = null,
    To = null
  function Oo(t) {
    To && ((To.e = Date.now() - To.s), (To.r = t), (Lo = To))
  }
  function Ho() {
    try {
      return Object.keys(window).sort().join(',')
    } catch (ts) {
      return null
    }
  }
  var Mo = 100
  function Ro(t) {
    if ('en' === t) return Promise.resolve()
    var e = t + '.json'
    return new Promise(function (i, n) {
      Be.retrieve(e)
        .then(function (i) {
          return (
            i ||
            Be.file(e, {
              prefix: 'https://newassets.hcaptcha.com/captcha/v1/a8cd801/static/i18n',
            }).then(function (e) {
              return ue.addTable(t, e.data), e
            })
          )
        })
        .then(function (t) {
          i(t.data)
        })
        ['catch'](function (t) {
          n(t)
        })
    })
  }
  var Po = [
      '10000000-ffff-ffff-ffff-000000000001',
      '20000000-ffff-ffff-ffff-000000000002',
      '30000000-ffff-ffff-ffff-000000000003',
    ],
    Io = {
      sitekey: function (t) {
        return Zt.UUIDv4(t) || '00000000-0000-0000-0000-000000000000' === t || -1 !== Po.indexOf(t)
      },
      dummykey: function (t) {
        return -1 !== Po.indexOf(t)
      },
      logo: function (t) {
        if ('string' == typeof t) return Zt.IMAGE(t)
        if (t && 'object' == typeof t && !Array.isArray(t)) {
          for (var e in t) {
            var i = t[e]
            if ('string' == typeof i && !Zt.IMAGE(i)) return !1
          }
          return !0
        }
        return !1
      },
    }
  function Vo() {
    var t,
      e,
      i,
      n,
      o,
      r = Io.dummykey(ht.sitekey)
    if ('localhost' === ht.host && !r) {
      var s = 'Warning: localhost detected. Please use a valid host.'
      return console.error(s), Promise.reject(new Error(s))
    }
    return ((t = ht.sitekey),
    (e = ht.host),
    (i = tt.Browser.supportsCanvas() >>> 0),
    (n = tt.Browser.supportsWebAssembly() >>> 0),
    (o = tt.Browser.supportsPST() >>> 0),
    new Promise(function (r, s) {
      var a = { v: 'a8cd801', host: e, sitekey: t, sc: i, swa: n, spst: o }
      ft.se && (a.se = ft.se)
      var c = 0
      be({
        url: function () {
          var e = ft.endpoint
          return (
            e === ot &&
              !Do() &&
              Math.random() < 0.5 &&
              -1 === t.indexOf('-0000-0000-0000-') &&
              (e = rt),
            c > 0 && (a.r = c),
            e + '/checksiteconfig?' + Pt(a)
          )
        },
        responseType: 'json',
        withCredentials: !0,
        timeout: function (t) {
          return t && -1 !== t.indexOf(rt) ? 3e3 : 5e3
        },
        headers: { Accept: 'application/json', 'Content-Type': 'text/plain' },
        retry: {
          attempts: 4,
          delay: Mo,
          onFail: function (t, e) {
            ;(c += 1), St('challenge', 'api', 'debug', t)
            var i = t && 0 === t.status
            return e > 1 && !i
              ? { retry: !0, delay: Mo }
              : 0 === e && -1 !== ct.indexOf(ft.endpoint)
              ? ((ft.endpoint = nt), { retry: !0, delay: 0 })
              : ft.endpoint === st || ft.endpoint === nt
              ? ((ft.endpoint = ot), { retry: !0, delay: 0 })
              : ft.endpoint === ot
              ? Do()
                ? { retry: !0, delay: Mo }
                : ((ft.endpoint = rt), { retry: !0, delay: 0 })
              : ft.endpoint === rt
              ? ((ft.endpoint = ot), { retry: !0, delay: 0 })
              : (Et('api:checksiteconfig failed', 'error', 'challenge', { error: t }),
                { retry: t instanceof Error || 400 === t.status, delay: Mo })
          },
        },
      })
        .then(function (t) {
          var e = t.body || null
          if (e) {
            if (!1 === e.success) {
              var i = (e['error-codes'] || []).join(', ')
              s(new Error(i))
            } else !e.pass && e.error ? s(new Error(e.error)) : r(e)
          } else s(new Error('Missing response body.'))
        })
        ['catch'](s)
    })).then(function (t) {
      return (
        St('/checksiteconfig success', 'request', 'info', t),
        t.endpoint && -1 !== ct.indexOf(ft.endpoint)
          ? ((ft.endpoint = t.endpoint), Vo())
          : (t.endpoint && -1 !== ct.indexOf(ft.endpoint) && (ft.endpoint = t.endpoint),
            delete t.endpoint,
            t)
      )
    })
  }
  function Do() {
    return -1 !== ['pt-BR', 'es-BR'].indexOf(navigator.language)
  }
  var Fo,
    $o,
    Uo,
    jo,
    No,
    zo,
    Zo,
    Wo = null,
    qo = null,
    Ko = null,
    Yo = null,
    Go = {},
    Jo = null,
    Xo = !1,
    Qo = !1,
    tr = !1,
    er = null,
    ir = !1,
    nr = 100,
    or = {
      logAction: function (t) {
        Jo = t
      },
      setEncryptionSupport: function (t) {
        Xo = t
      },
      getTaskData: function (t, e, i, n, o) {
        t === undefined && (t = {})
        var r = e.proof,
          s = { v: 'a8cd801', sitekey: ht.sitekey, host: ht.host, hl: ue.getLocale() }
        o && (s.r = o),
          ft.se && (s.se = ft.se),
          !0 === ht.a11y_tfe && (s.a11y_tfe = !0),
          null !== Jo && ((s.action = Jo), (Jo = null)),
          null !== Yo && ((s.extraData = JSON.stringify(Yo)), (Yo = null)),
          t && (s.motionData = JSON.stringify(t)),
          i && (s.pd = JSON.stringify(i)),
          n && (s.pdc = JSON.stringify(n))
        var a = (function () {
          if (!performance || !performance.getEntriesByType) return null
          var t,
            e,
            i = {},
            n = performance.getEntriesByType('resource')
          for (t = 0; t < n.length; t += 1) {
            ;-1 !== (e = n[t]).name.indexOf('checksiteconfig')
              ? (i.csc = e.duration)
              : -1 !== e.name.indexOf('getcaptcha') && (i.gc = e.duration)
          }
          return i
        })()
        return (
          a && (s.pem = JSON.stringify(a)),
          null !== Wo && ((qo = Wo), (s.old_ekey = Wo)),
          null !== er && (s.rqdata = er),
          r && ((s.n = r.solved || null), (s.c = r.spec ? JSON.stringify(r.spec) : null)),
          e.authToken && (s.auth_token = e.authToken),
          e.hasPst !== undefined && (s.pst = e.hasPst),
          new Promise(function (t, i) {
            try {
              var n = 'arraybuffer',
                o = 'query',
                r = {
                  accept: 'application/json, application/octet-stream',
                  'content-type': 'application/x-www-form-urlencoded',
                }
              Qo && ((n = 'json'), (r.accept = 'application/json'))
              var a,
                c = s
              if (('ArrayBuffer' in window || (Xo = !1), Xo)) {
                To && ((To.gces = Date.now() - To.s), (To.gcee = null))
                var l = JSON.parse(JSON.stringify(s))
                delete l.c,
                  (a = Ao(l).then(function (t) {
                    t
                      ? (To && (To.gcee = Date.now() - To.s),
                        (c = So([s.c, t])),
                        (o = 'arraybuffer'),
                        (r['content-type'] = 'application/octet-stream'))
                      : (Xo = !1)
                  }))
              } else a = Promise.resolve()
              a.then(function () {
                return be({
                  url: ft.endpoint + '/getcaptcha/' + s.sitekey,
                  data: c,
                  dataType: o,
                  responseType: n,
                  withCredentials: !0,
                  pst: e.hasPst ? 'send-redemption-record' : null,
                  headers: r,
                })
              })
                .then(function (t) {
                  var e = t.body || null
                  if (!e) throw new Error('Missing response body.')
                  if ('ArrayBuffer' in window && e instanceof ArrayBuffer) {
                    return (
                      To && ((To.gcds = Date.now() - To.s), (To.gcde = null)),
                      Eo(new Uint8Array(e)).then(function (t) {
                        if (!t) throw new Error('error-parse-body')
                        return To && (To.gcde = Date.now() - To.s), t
                      })
                    )
                  }
                  if ('string' == typeof e) throw new Error('unhandled-getcaptcha-res-type-string')
                  return e
                })
                .then(function (e) {
                  if (!1 === e.success) {
                    var i = e['error-codes'] || []
                    return (
                      !1 === tr &&
                        !0 === Qo &&
                        0 === i.length &&
                        (i.push('expired-session'), (tr = !0)),
                      -1 !== i.indexOf('invalid-data') &&
                        Et('invalid-data', 'error', 'api', { motionData: s.motionData }),
                      void t(e)
                    )
                  }
                  or.setData(e), t(e)
                })
                ['catch'](function (t) {
                  ;(Qo = !0), (Xo = !1), i(t)
                })
            } catch (ts) {
              i(ts)
            }
          })
        )
      },
      loadBundle: function (t) {
        return new Promise(function (e, i) {
          if (Go[t]) e(Go[t])
          else {
            var n = or.createBundleUrl(t)
            Be.script(n)
              .then(function () {
                ;(Go[t] = window[t]), e(Go[t])
              })
              ['catch'](function (t) {
                i({ event: it.BUNDLE_ERROR, message: 'Failed to get challenge bundle.', reason: t })
              })
          }
        })
      },
      createBundleUrl: function (t) {
        return (
          (ft.assethost || ht.assetDomain) + '/captcha/challenge/' + t + '/a8cd801/challenge.js'
        )
      },
      checkAnswers: function (t, e, i) {
        var n = {
          v: 'a8cd801',
          job_mode: Yo.request_type,
          answers: t,
          serverdomain: ht.host,
          sitekey: ht.sitekey,
          motionData: JSON.stringify(e),
        }
        ft.se && (n.se = ft.se), i && ((n.n = i.solved), (n.c = JSON.stringify(i.spec)))
        var o = 0
        return new Promise(function (t, e) {
          try {
            be({
              url: function () {
                return ft.endpoint + '/checkcaptcha/' + n.sitekey + '/' + Yo.key
              },
              data: function () {
                return o > 0 && (n.r = o), n
              },
              dataType: 'json',
              responseType: 'json',
              withCredentials: !0,
              headers: { 'Content-type': 'application/json;charset=UTF-8' },
              retry: {
                attempts: 4,
                delay: nr,
                onFail: function (t, e) {
                  ;(o += 1), St('checkcaptcha', 'api', 'debug', t)
                  var i = t && 0 === t.status
                  return e > 1 && !i
                    ? { retry: !0, delay: nr }
                    : 0 === e && -1 !== ct.indexOf(ft.endpoint)
                    ? ((ft.endpoint = nt), { retry: !0, delay: 0 })
                    : ft.endpoint === st || ft.endpoint === nt
                    ? ((ft.endpoint = ot), { retry: !0, delay: 0 })
                    : ft.endpoint === ot
                    ? Do()
                      ? { retry: !0, delay: nr }
                      : ((ft.endpoint = rt), { retry: !0, delay: 0 })
                    : ft.endpoint === rt
                    ? ((ft.endpoint = ot), { retry: !0, delay: 0 })
                    : (Et('api:checkcaptcha failed', 'error', 'challenge', { error: t }),
                      { retry: !0, delay: nr })
                },
              },
            })
              .then(function (e) {
                var i = e.body || null
                if (!i) throw new Error('Missing response body.')
                if (!1 === i.success) {
                  var o = i['error-codes'] || ['']
                  ;-1 !== o.indexOf('invalid-data') &&
                    Et('invalid-data', 'error', 'api', { motionData: n.motionData })
                  var r = o.join(', ')
                  throw new Error(r)
                }
                t(i)
              })
              ['catch'](e)
          } catch (ts) {
            e(ts)
          }
        })
      },
      reportIssue: function (t, e, i) {
        var n = { taskdata: Yo, on_url: ht.url, report_category: t, sid: Ko }
        if (
          (e && (n.user_comments = e),
          qo && (n.last_ekey = qo),
          i && Yo && 'fallback' !== Yo.request_type)
        ) {
          for (var o = Yo.tasklist, r = null, s = -1; ++s < o.length && !r; ) {
            o[s].task_key === i && (r = o[s])
          }
          n.taskdata.tasklist = [r]
        }
        return be({
          url: ft.reportapi + '/bug-report',
          data: n,
          dataType: 'json',
          responseType: 'json',
          withCredentials: !0,
          headers: { 'Content-type': 'application/json;charset=UTF-8' },
        })
      },
      getEKey: function () {
        return Wo
      },
      setData: function (t) {
        ;(Yo = t), (Wo = t.key), (ir = !!t.rq), Ko || (Ko = Wo)
      },
      setRqData: function (t) {
        er = t
      },
      getRqData: function () {
        return er
      },
      hasPrivateStateToken: function () {
        return document.hasPrivateToken
          ? new Promise(function (t) {
              document
                .hasRedemptionRecord(ft.pstIssuer)
                .then(function (e) {
                  e
                    ? t(!0)
                    : document
                        .hasPrivateToken(ft.pstIssuer, 'private-state-token')
                        .then(function (e) {
                          if (e) {
                            var i = { v: 'a8cd801', sitekey: ht.sitekey, host: ht.host }
                            be({
                              url: ft.pstIssuer + '/pst/redemption',
                              data: i,
                              dataType: 'json',
                              responseType: 'json',
                              timeout: 1500,
                              pst: 'token-redemption',
                              headers: {
                                Accept: 'application/json',
                                'Content-Type': 'application/json',
                              },
                            })
                              .then(function () {
                                t(!0)
                              })
                              ['catch'](function (e) {
                                kt(e), t(undefined)
                              })
                          } else t(!1)
                        })
                        ['catch'](function (e) {
                          kt(e), t(undefined)
                        })
                })
                ['catch'](function (e) {
                  kt(e), t(undefined)
                })
            })
          : Promise.resolve(undefined)
      },
      isRqChl: function () {
        return ir
      },
      getData: function () {
        return Yo
      },
      authenticate: function (t) {
        var e = { v: 'a8cd801', sitekey: ht.sitekey, host: ht.host }
        return (
          ft.se && (e.se = ft.se),
          t && ((e.n = t.solved || null), (e.c = t.spec ? JSON.stringify(t.spec) : null)),
          be({
            url: ft.endpoint + '/authenticate',
            data: e,
            dataType: 'json',
            responseType: 'json',
            withCredentials: !0,
            timeout: 1500,
            headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
          })
            .then(function (t) {
              return t.body
            })
            ['catch'](function (t) {
              if (401 === t.status) return t.response
              throw t
            })
        )
      },
    },
    rr =
      ((Fo = []),
      ($o = null),
      (Uo = !1),
      (jo = []),
      (No = function (t) {
        try {
          if (Fo.length >= 10) return
          var e = t.stack
          if ('string' != typeof e) return
          var i = e.trim().split('\n')
          'Error' === i[0] && (i = i.slice(1))
          var n = wt((i = i.slice(-2)))
          n && -1 === Fo.indexOf(n) && Fo.push(n)
        } catch (t) {
          return
        }
      }),
      (zo = function () {
        if (Uo) {
          try {
            for (var t = 0; t < jo.length; t++) jo[t]()
            null !== $o && clearTimeout($o)
          } catch (e) {
            No(e)
          } finally {
            ;(jo = []), ($o = null), (Uo = !1)
          }
        }
      }),
      (Zo = function (t, e) {
        var i = Object.getOwnPropertyDescriptor(t, e)
        if (!i || !1 !== i.writable) {
          var n = Object.prototype.hasOwnProperty.call(t, e),
            o = t[e]
          ;(t[e] = function () {
            return Uo && (Fo.length >= 10 && zo(), No(new Error())), o.apply(t, arguments)
          }),
            jo.push(function () {
              n ? (t[e] = o) : delete t[e]
            })
        }
      }),
      {
        run: function (t) {
          if (!Uo) {
            ;(Uo = !0),
              isFinite(t) &&
                ($o = setTimeout(function () {
                  zo()
                }, t))
            try {
              Zo(document, 'getElementsByClassName'),
                Zo(document, 'getElementById'),
                Zo(document, 'querySelector'),
                Zo(document, 'querySelectorAll')
            } catch (e) {
              zo(), No(e)
            }
          }
        },
        collect: function () {
          return Fo.concat(bt)
        },
      })
  var sr = new Bi()
  sr.add('contrast', {}),
    sr.add('grey-red', { component: { checkbox: { main: { border: '#6a6a6a' } } } })
  function ar() {
    ie.self(this, ne, '#a11y-label'),
      (this.state = { ticked: !1 }),
      this.setAttribute('aria-hidden', !0),
      this.css({ display: 'none' }),
      this.translate()
  }
  function cr(t) {
    var e = t.get(),
      i = e.palette,
      n = e.component,
      o = 'light' === i.mode
    return Bi.merge(
      {
        main: { fill: i.grey[100], border: i.grey[o ? 600 : 200] },
        focus: {
          fill: i.grey[200],
          border: i.grey[o ? 800 : 100],
          outline: 'dark' === t.active() ? i.secondary.main : i.primary.main,
        },
      },
      n.input,
    )
  }
  function lr() {
    ie.self(this, ne, '#checkbox'),
      (this.state = { focused: !1, visible: !0, passed: !1 }),
      (this._style = cr(sr)),
      this.setAttribute('aria-haspopup', !0),
      this.setAttribute('aria-checked', !1),
      this.setAttribute('role', 'checkbox'),
      this.setAttribute('tabindex', '0'),
      this.setAttribute('aria-live', 'assertive'),
      this.setAttribute('aria-labelledby', 'a11y-label'),
      (this.onOver = this.onOver.bind(this)),
      (this.onOut = this.onOut.bind(this)),
      (this.onFocus = this.onFocus.bind(this)),
      (this.onBlur = this.onBlur.bind(this)),
      this.addEventListener('over', this.onOver),
      this.addEventListener('out', this.onOut),
      this.addEventListener('focus', this.onFocus),
      this.addEventListener('blur', this.onBlur)
  }
  ie.proto(ar, ne),
    (ar.prototype.setState = function (t) {
      ;(this.state.ticked = 'passed' === t), this.translate()
    }),
    (ar.prototype.translate = function () {
      var t = this.state.ticked
        ? "hCaptcha checkbox with text 'I am human' is now checked. You are verified"
        : "hCaptcha checkbox with text 'I am human'. Select in order to trigger the challenge, or to bypass it if you have an accessibility cookie."
      this.content(ue.translate(t))
    }),
    ie.proto(lr, ne),
    (lr.prototype.style = function () {
      this._style = cr(sr)
      var t = this.state.visible ? this._style.main.fill : 'transparent',
        e = this.state.focused ? this._style.focus.border : this._style.main.border,
        i = this.state.visible ? e : 'transparent',
        n = this._style.focus.outline
      this.css({
        position: 'absolute',
        width: 28,
        height: 28,
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: i,
        borderRadius: 4,
        backgroundColor: t,
        outlineColor: n,
        top: 0,
        left: 0,
      })
    }),
    (lr.prototype.onOver = function (t) {
      this.state.focused ||
        ((this.state.focused = 'focus' === t.action),
        this.css({ borderColor: this._style.focus.border }))
    }),
    (lr.prototype.onOut = function (t) {
      if ('blur' === t.action) this.state.focused = !1
      else if (this.state.focused) return
      this.css({ borderColor: this._style.main.border })
    }),
    (lr.prototype.onFocus = function (t) {
      var e = this._style.focus.outline
      this.css({ outline: '2px solid ' + e })
    }),
    (lr.prototype.onBlur = function (t) {
      this.css({ outline: 'none' })
    }),
    (lr.prototype.display = function (t) {
      ;(this.state.visible = t), this.setAttribute('tabindex', t ? 0 : -1), this.style()
    }),
    (lr.prototype.setState = function (t) {
      ;(this.state.passed = 'passed' === t),
        (this.state.visible = 'loading' !== t && 'passed' !== t),
        this.setAttribute('tabindex', 'loading' === t || 'solving' === t ? -1 : 0),
        this.setAttribute('aria-checked', this.state.passed),
        this.style()
    })
  function hr() {
    ie.self(this, Pi, {
      selector: '.pulse',
      src: "data:image/svg+xml,%3c%3fxml version='1.0' encoding='utf-8'%3f%3e%3c!-- Generator: Adobe Illustrator 21.0.2%2c SVG Export Plug-In . SVG Version: 6.00 Build 0) --%3e%3csvg version='1.1' id='Layer_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 44 44' style='enable-background:new 0 0 44 44%3b' xml:space='preserve'%3e%3cstyle type='text/css'%3e .st0%7bfill:none%3bstroke:%23FF7B00%3bstroke-width:2%3b%7d%3c/style%3e%3cg%3e %3ccircle class='st0' cx='22' cy='22' r='1'%3e %3canimate accumulate='none' additive='replace' attributeName='r' begin='0s' calcMode='spline' dur='1.8s' fill='remove' keySplines='0.165%2c 0.84%2c 0.44%2c 1' keyTimes='0%3b 1' repeatCount='indefinite' restart='always' values='1%3b 20'%3e %3c/animate%3e %3canimate accumulate='none' additive='replace' attributeName='stroke-opacity' begin='0s' calcMode='spline' dur='1.8s' fill='remove' keySplines='0.3%2c 0.61%2c 0.355%2c 1' keyTimes='0%3b 1' repeatCount='indefinite' restart='always' values='1%3b 0'%3e %3c/animate%3e %3c/circle%3e %3ccircle class='st0' cx='22' cy='22' r='1'%3e %3canimate accumulate='none' additive='replace' attributeName='r' begin='-0.9s' calcMode='spline' dur='1.8s' fill='remove' keySplines='0.165%2c 0.84%2c 0.44%2c 1' keyTimes='0%3b 1' repeatCount='indefinite' restart='always' values='1%3b 20'%3e %3c/animate%3e %3canimate accumulate='none' additive='replace' attributeName='stroke-opacity' begin='-0.9s' calcMode='spline' dur='1.8s' fill='remove' keySplines='0.3%2c 0.61%2c 0.355%2c 1' keyTimes='0%3b 1' repeatCount='indefinite' restart='always' values='1%3b 0'%3e %3c/animate%3e %3c/circle%3e%3c/g%3e%3c/svg%3e",
      width: 30,
      fallback: 'https://newassets.hcaptcha.com/captcha/v1/a8cd801/static/images/pulse.png',
    }),
      (this.state = { visible: !1 })
  }
  ie.proto(hr, Pi),
    (hr.prototype.style = function () {
      this.size(),
        this.css({
          display: this.state.visible ? 'block' : 'none',
          position: 'absolute',
          top: 0,
          left: 0,
        })
    }),
    (hr.prototype.display = function (t) {
      ;(this.state.visible = t), this.style()
    })
  function ur() {
    ie.self(this, Pi, {
      selector: '.check',
      src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABmJLR0QA/wD/AP+gvaeTAAAC00lEQVR4nO2aTU8TQRyHn39bIdXEm3jwLQhefPkAJorYLYslIF64ohwM8eQH0A/gzYSLIRooxBORKJr4Ultq4smz8YgQb3ow4YAmUHY8IEpgd7vQ3e0smee4+5/uPL+daXdmCwaDwWAwGAwGg8FgMBgM+wBr0u7JFe17QWrTUXcmbqxJuwdhTpDejsHO7Ne5hbJf/b4KYFMeJAuAcKleCPsmgB3ymwiX2m901BZfLHx0a5eKpXcR4ykPgPqdEvnk1Vai7Fgc1JMXkevlm+88p0CiA2hUHhIcQBjykNAAwpKHBAYQpjwkLICw5SFBAUQhDwkJICp5SEAAUcqD5gFELQ8aBxCHPGgaQFzyoGEAccpDwNXgxZmhLCr6sPJTvXk/eRSDYcpDgAAGxgcOZleW31hF+1GUIViTdo9S6qXfna+MlN6HfV3fAApjhdZfrauzInIFkdGoQoh72G/FM4ChmaGW1cPOM+Dav4MRhNBMefAJ4OfK8hjQv+OEyKhV7H0YRgjNmPPb8QxgndQDYMn1pHC30ZHQrDm/Hc8APoy8XVK1dDew6FrQwHTIFe0uRJ43a9hvpW7nc0/6TklmvQq0uxYoNV65VbqDoIJcMFe0uwR5DRxy+bBY5SHgg1B+On9SOZkqqNOuBQFD0E0edvEkuBFCeh7ocC2oE4KO8rCL9wLl4fK3tKOuAguuBT7fCbrKwx7WAvaEfcJJybyCTteCbSNBZ3nY42Ko+2nheKbmVOuFkJuyL+ssDw2sBnNT/cdErVWBMx4ls6D6/B5y4vidr0dDT3PWY+soBzLzwNngrfS485s09HK0crvynbVaDvgSrIVe8hDShsjfkVABznlX6ScPIe4I2dN2W82RisD5nWf1lIeQt8Tsabtt3aEMcuH/UX3lIeQ/SJSGSz9anLQF6vPGEb3lIaJN0cJE4ciaOK9IcV9n+WiJYRPVYDAYDAaDoRH+ALzfixyrasnFAAAAAElFTkSuQmCC',
      width: 30,
    }),
      (this.state = { visible: !1 })
  }
  function fr() {
    ie.self(this, ne, '#anchor-wr'), (this.state = { loading: !1, checked: !1 })
    var t = this.createElement('#anchor-td'),
      e = t.createElement('#anchor-tc'),
      i = e.createElement('#anchor-state')
    ;(this.a11y = this.initComponent(ar)),
      (this.input = this.initComponent(lr, null, i)),
      (this.loading = this.initComponent(hr, null, i)),
      (this.checked = this.initComponent(ur, null, i)),
      (this.table = t),
      (this.cell = e),
      (this.wrapper = i)
  }
  ie.proto(ur, Pi),
    (ur.prototype.style = function () {
      this.size(),
        this.css({
          display: this.state.visible ? 'block' : 'none',
          position: 'absolute',
          top: 0,
          left: 0,
          animation: this.state.visible ? 'pop 0.4s linear' : 'auto',
        })
    }),
    (ur.prototype.display = function (t) {
      ;(this.state.visible = t), this.style()
    }),
    ie.proto(fr, ne),
    (fr.prototype.style = function (t) {
      var e = t ? 60 : '100%',
        i = t ? '0px 12px' : '0px 15px'
      this.css({
        position: 'relative',
        display: 'inline-block',
        height: e,
        '-ms-high-contrast-adjust': 'none',
      }),
        this.table.css({ position: 'relative', display: 'table', top: 0, height: '100%' }),
        this.cell.css({ display: 'table-cell', verticalAlign: 'middle' })
      this.wrapper.css({ position: 'relative', width: 30, height: 30, margin: i }),
        this.input.style(),
        this.loading.style(),
        this.checked.style()
    }),
    (fr.prototype.describeBy = function (t) {
      t && t.dom && t.dom.id
        ? this.input.setAttribute('aria-describedby', t.dom.id)
        : this.input.removeAttribute('aria-describedby')
    }),
    (fr.prototype.setState = function (t) {
      var e = 'loading' === t,
        i = 'passed' === t
      this.checked.display(i),
        this.loading.display(e),
        this.a11y.setState(t),
        this.input.setState(t),
        (this.state.loading = e),
        (this.state.checked = i)
    }),
    (fr.prototype.focus = function () {
      this.input.focus()
    }),
    (fr.prototype.getLocation = function () {
      var t = this.input.dom.getBoundingClientRect(),
        e = t.bottom - t.top,
        i = t.right - t.left
      return {
        left: t.left,
        right: t.right,
        top: t.top,
        bottom: t.bottom,
        width: i,
        height: e,
        x: t.left + i / 2,
        y: t.top + e / 2,
      }
    }),
    (fr.prototype.translate = function () {
      this.a11y.translate()
    })
  function dr() {
    ie.self(this, ne, 'label-container'),
      (this.table = this.createElement('label-td')),
      (this.cell = this.table.createElement('label-tc')),
      (this.text = this.cell.createElement('#label')),
      this.translate()
  }
  ie.proto(dr, ne),
    (dr.prototype.style = function (t) {
      var e = t ? 60 : '100%',
        i = t ? 100 : 170,
        n = sr.get().palette
      this.css({ position: 'relative', display: 'inline-block', height: e, width: i }),
        this.table.css({ position: 'relative', display: 'table', top: 0, height: '100%' }),
        this.cell.css({ display: 'table-cell', verticalAlign: 'middle' }),
        this.text.css({ color: n.text.body, fontSize: 14 })
    }),
    (dr.prototype.translate = function () {
      var t = ue.translate('I am human')
      this.text.content(t)
    })
  var pr = 'Privacy',
    mr = 'https://hcaptcha.com/privacy',
    yr = 'hCaptcha Privacy Policy',
    gr = 'Terms',
    vr = 'https://hcaptcha.com/terms',
    br = 'hCaptcha Terms of Service'
  function wr(t) {
    ie.self(this, ne, 'anchor-links'),
      (this.state = { theme: t.theme, size: t.size }),
      (this.privacy = this.initComponent(Hi, {
        theme: sr,
        text: pr,
        url:
          (t.privacyUrl || mr) +
          '?ref=' +
          ht.host +
          '&utm_campaign=' +
          ht.sitekey +
          '&utm_medium=checkbox',
      })),
      (this.hyphen = this.initComponent(Mi, { text: ' - ' })),
      (this.terms = this.initComponent(Hi, {
        theme: sr,
        text: gr,
        url:
          (t.termsUrl || vr) +
          '?ref=' +
          ht.host +
          '&utm_campaign=' +
          ht.sitekey +
          '&utm_medium=checkbox',
      })),
      this.translate()
  }
  ie.proto(wr, ne),
    (wr.prototype.style = function () {
      var t = (function (t) {
          var e = t.palette,
            i = t.component,
            n = 'light' === e.mode
          return Bi.merge({ main: e.grey[n ? 700 : 200] }, i.link)
        })(sr.get()),
        e = { fontSize: 8, color: t.main }
      this.privacy.style(e), this.hyphen.style(e), this.terms.style(e)
    }),
    (wr.prototype.translate = function () {
      this.privacy.translate(),
        this.terms.translate(),
        this.privacy.setAttribute('aria-label', ue.translate(yr)),
        this.terms.setAttribute('aria-label', ue.translate(br))
    })
  var xr = 'https://www.hcaptcha.com/what-is-hcaptcha-about',
    kr = 'Visit hcaptcha.com to learn more about the service and its accessibility options.'
  function Cr(t) {
    ie.self(this, ne, 'anchor-brand'),
      (this.state = {
        url:
          t.logoUrl ||
          xr + '?ref=' + ht.host + '&utm_campaign=' + ht.sitekey + '&utm_medium=checkbox',
        theme: 'dark' === t.theme ? 'dark' : 'light',
        display: t.displayLogo,
        label: 'hCaptcha',
      })
    var e =
        'light' === this.state.theme
          ? "data:image/svg+xml,%3csvg width='44' height='46' viewBox='0 0 44 46' role='img' aria-hidden='true' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3cpath opacity='0.5' d='M30 28H26V32H30V28Z' fill='%230074BF'/%3e%3cpath opacity='0.7' d='M26 28H22V32H26V28Z' fill='%230074BF'/%3e%3cpath opacity='0.7' d='M22 28H18V32H22V28Z' fill='%230074BF'/%3e%3cpath opacity='0.5' d='M18 28H14V32H18V28Z' fill='%230074BF'/%3e%3cpath opacity='0.7' d='M34 24H30V28H34V24Z' fill='%230082BF'/%3e%3cpath opacity='0.8' d='M30 24H26V28H30V24Z' fill='%230082BF'/%3e%3cpath d='M26 24H22V28H26V24Z' fill='%230082BF'/%3e%3cpath d='M22 24H18V28H22V24Z' fill='%230082BF'/%3e%3cpath opacity='0.8' d='M18 24H14V28H18V24Z' fill='%230082BF'/%3e%3cpath opacity='0.7' d='M14 24H10V28H14V24Z' fill='%230082BF'/%3e%3cpath opacity='0.5' d='M38 20H34V24H38V20Z' fill='%23008FBF'/%3e%3cpath opacity='0.8' d='M34 20H30V24H34V20Z' fill='%23008FBF'/%3e%3cpath d='M30 20H26V24H30V20Z' fill='%23008FBF'/%3e%3cpath d='M26 20H22V24H26V20Z' fill='%23008FBF'/%3e%3cpath d='M22 20H18V24H22V20Z' fill='%23008FBF'/%3e%3cpath d='M18 20H14V24H18V20Z' fill='%23008FBF'/%3e%3cpath opacity='0.8' d='M14 20H10V24H14V20Z' fill='%23008FBF'/%3e%3cpath opacity='0.5' d='M10 20H6V24H10V20Z' fill='%23008FBF'/%3e%3cpath opacity='0.7' d='M38 16H34V20H38V16Z' fill='%23009DBF'/%3e%3cpath d='M34 16H30V20H34V16Z' fill='%23009DBF'/%3e%3cpath d='M30 16H26V20H30V16Z' fill='%23009DBF'/%3e%3cpath d='M26 16H22V20H26V16Z' fill='%23009DBF'/%3e%3cpath d='M22 16H18V20H22V16Z' fill='%23009DBF'/%3e%3cpath d='M18 16H14V20H18V16Z' fill='%23009DBF'/%3e%3cpath d='M14 16H10V20H14V16Z' fill='%23009DBF'/%3e%3cpath opacity='0.7' d='M10 16H6V20H10V16Z' fill='%23009DBF'/%3e%3cpath opacity='0.7' d='M38 12H34V16H38V12Z' fill='%2300ABBF'/%3e%3cpath d='M34 12H30V16H34V12Z' fill='%2300ABBF'/%3e%3cpath d='M30 12H26V16H30V12Z' fill='%2300ABBF'/%3e%3cpath d='M26 12H22V16H26V12Z' fill='%2300ABBF'/%3e%3cpath d='M22 12H18V16H22V12Z' fill='%2300ABBF'/%3e%3cpath d='M18 12H14V16H18V12Z' fill='%2300ABBF'/%3e%3cpath d='M14 12H10V16H14V12Z' fill='%2300ABBF'/%3e%3cpath opacity='0.7' d='M10 12H6V16H10V12Z' fill='%2300ABBF'/%3e%3cpath opacity='0.5' d='M38 8H34V12H38V8Z' fill='%2300B9BF'/%3e%3cpath opacity='0.8' d='M34 8H30V12H34V8Z' fill='%2300B9BF'/%3e%3cpath d='M30 8H26V12H30V8Z' fill='%2300B9BF'/%3e%3cpath d='M26 8H22V12H26V8Z' fill='%2300B9BF'/%3e%3cpath d='M22 8H18V12H22V8Z' fill='%2300B9BF'/%3e%3cpath d='M18 8H14V12H18V8Z' fill='%2300B9BF'/%3e%3cpath opacity='0.8' d='M14 8H10V12H14V8Z' fill='%2300B9BF'/%3e%3cpath opacity='0.5' d='M10 8H6V12H10V8Z' fill='%2300B9BF'/%3e%3cpath opacity='0.7' d='M34 4H30V8H34V4Z' fill='%2300C6BF'/%3e%3cpath opacity='0.8' d='M30 4H26V8H30V4Z' fill='%2300C6BF'/%3e%3cpath d='M26 4H22V8H26V4Z' fill='%2300C6BF'/%3e%3cpath d='M22 4H18V8H22V4Z' fill='%2300C6BF'/%3e%3cpath opacity='0.8' d='M18 4H14V8H18V4Z' fill='%2300C6BF'/%3e%3cpath opacity='0.7' d='M14 4H10V8H14V4Z' fill='%2300C6BF'/%3e%3cpath opacity='0.5' d='M30 0H26V4H30V0Z' fill='%2300D4BF'/%3e%3cpath opacity='0.7' d='M26 0H22V4H26V0Z' fill='%2300D4BF'/%3e%3cpath opacity='0.7' d='M22 0H18V4H22V0Z' fill='%2300D4BF'/%3e%3cpath opacity='0.5' d='M18 0H14V4H18V0Z' fill='%2300D4BF'/%3e%3cpath d='M16.5141 14.9697L17.6379 12.4572C18.0459 11.8129 17.9958 11.0255 17.5449 10.5745C17.4876 10.5173 17.416 10.46 17.3444 10.4171C17.0366 10.2238 16.6572 10.1808 16.3065 10.2954C15.9199 10.4171 15.5835 10.6748 15.3687 11.0184C15.3687 11.0184 13.8297 14.6046 13.2642 16.2153C12.6987 17.8259 12.9206 20.7822 15.1254 22.987C17.4661 25.3277 20.8448 25.8575 23.0066 24.2397C23.0997 24.1967 23.1784 24.1395 23.2572 24.0751L29.9072 18.5202C30.2293 18.2554 30.7089 17.7042 30.2794 17.0743C29.8642 16.4586 29.0697 16.881 28.7404 17.0886L24.9107 19.8731C24.8391 19.9304 24.7318 19.9232 24.6673 19.8517C24.6673 19.8517 24.6673 19.8445 24.6602 19.8445C24.56 19.7228 24.5456 19.4079 24.696 19.2862L30.5657 14.304C31.074 13.8459 31.1456 13.1802 30.7304 12.7292C30.3295 12.2854 29.6924 12.2997 29.1842 12.7578L23.9157 16.881C23.8155 16.9597 23.6652 16.9454 23.5864 16.8452L23.5793 16.838C23.4719 16.7235 23.4361 16.5231 23.5506 16.4014L29.535 10.596C30.0074 10.1522 30.036 9.4149 29.5922 8.94245C29.3775 8.72054 29.084 8.59169 28.7762 8.59169C28.4612 8.59169 28.1606 8.70623 27.9387 8.92813L21.8255 14.6691C21.6823 14.8122 21.396 14.6691 21.3602 14.4973C21.3459 14.4328 21.3674 14.3684 21.4103 14.3255L26.0918 8.99972C26.5571 8.56306 26.5858 7.83292 26.1491 7.36763C25.7124 6.90234 24.9823 6.87371 24.517 7.31036C24.4955 7.32468 24.4812 7.34615 24.4597 7.36763L17.3659 15.2203C17.1082 15.478 16.736 15.4851 16.557 15.342C16.4425 15.2489 16.4282 15.0843 16.5141 14.9697Z' fill='white'/%3e%3cpath d='M4.99195 43.6627H3.32946V40.8306C3.32946 40.1764 3.2488 39.6073 2.55423 39.6073C1.85966 39.6073 1.64905 40.2167 1.64905 41.0144V43.6627H0V36.112H1.64905V37.9045C1.64905 38.4512 1.64008 39.0427 1.64008 39.0427C1.89999 38.5632 2.38395 38.1689 3.13677 38.1689C4.61106 38.1689 4.99195 39.1637 4.99195 40.4766V43.6627Z' fill='%23555555'/%3e%3cpath d='M12.081 42.762C11.7181 43.1563 10.9652 43.7882 9.51337 43.7882C7.42069 43.7882 5.77612 42.3228 5.77612 39.8941C5.77612 37.4564 7.43861 36 9.50889 36C10.9742 36 11.7674 36.6453 11.9556 36.8514L11.4402 38.3167C11.3058 38.1285 10.544 37.5281 9.60299 37.5281C8.39757 37.5281 7.4655 38.3795 7.4655 39.8582C7.4655 41.337 8.43342 42.175 9.60299 42.175C10.4902 42.175 11.131 41.803 11.5209 41.3773L12.081 42.762Z' fill='%23555555'/%3e%3cpath d='M17.3016 43.6627H15.7242L15.6928 43.0936C15.4777 43.3221 15.0655 43.7837 14.2365 43.7837C13.3403 43.7837 12.3903 43.2684 12.3903 42.0674C12.3903 40.8665 13.4344 40.4587 14.3709 40.4139L15.6525 40.3601V40.2391C15.6525 39.67 15.2716 39.3743 14.6084 39.3743C13.9586 39.3743 13.3089 39.679 13.049 39.8538L12.6143 38.72C13.049 38.4915 13.8421 38.1733 14.7921 38.1733C15.7421 38.1733 16.2888 38.4019 16.6921 38.7962C17.082 39.1906 17.3016 39.7148 17.3016 40.6245V43.6627ZM15.657 41.2877L14.8414 41.3415C14.3351 41.3639 14.0348 41.5924 14.0348 41.9957C14.0348 42.4125 14.353 42.6634 14.8101 42.6634C15.2537 42.6634 15.5539 42.3587 15.657 42.1705V41.2877Z' fill='%23555555'/%3e%3cpath d='M21.6034 43.7792C20.8506 43.7792 20.3129 43.4835 19.9947 42.9816V45.6389H18.3456V38.2674H19.914L19.9051 38.9575H19.9275C20.2994 38.487 20.8461 38.1689 21.6213 38.1689C23.0867 38.1689 24.0142 39.3832 24.0142 40.9696C24.0142 42.5559 23.0777 43.7792 21.6034 43.7792ZM21.1284 39.549C20.4249 39.549 19.9409 40.1181 19.9409 40.9471C19.9409 41.7762 20.4249 42.3453 21.1284 42.3453C21.8409 42.3453 22.3249 41.7762 22.3249 40.9471C22.3249 40.1181 21.8409 39.549 21.1284 39.549Z' fill='%23555555'/%3e%3cpath d='M27.8321 39.6028H26.7074V41.5386C26.7074 42.0002 26.7701 42.1077 26.8508 42.2063C26.9225 42.296 27.0255 42.3363 27.2406 42.3363C27.4109 42.3318 27.5767 42.3004 27.738 42.2377L27.8187 43.6044C27.4378 43.7165 27.039 43.7747 26.6446 43.7792C26.0576 43.7792 25.6633 43.591 25.4079 43.2773C25.1524 42.9636 25.0449 42.511 25.0449 41.691V39.6028H24.3234V38.2809H25.0449V36.8156H26.7074V38.2809H27.8321V39.6028Z' fill='%23555555'/%3e%3cpath d='M32.7121 43.1339C32.6583 43.1787 32.1251 43.7792 30.7718 43.7792C29.3781 43.7792 28.0876 42.771 28.0876 40.9785C28.0876 39.1726 29.3961 38.1689 30.7897 38.1689C32.0892 38.1689 32.6762 38.738 32.6762 38.738L32.3133 40.0599C31.9458 39.7507 31.4843 39.5804 31.0048 39.5804C30.3013 39.5804 29.7456 40.0957 29.7456 40.9471C29.7456 41.7986 30.252 42.3363 31.0272 42.3363C31.8024 42.3363 32.3178 41.812 32.3178 41.812L32.7121 43.1339Z' fill='%23555555'/%3e%3cpath d='M38.3986 43.6627H36.7361V40.8306C36.7361 40.1764 36.6555 39.6073 35.9609 39.6073C35.2663 39.6073 35.0512 40.2212 35.0512 41.0188V43.6672H33.4067V36.112H35.0557V37.9045C35.0557 38.4512 35.0468 39.0427 35.0468 39.0427C35.3067 38.5632 35.7906 38.1689 36.5435 38.1689C38.0177 38.1689 38.3986 39.1637 38.3986 40.4766V43.6627Z' fill='%23555555'/%3e%3cpath d='M44 43.6627H42.4226L42.3913 43.0936C42.1762 43.3221 41.7639 43.7837 40.9349 43.7837C40.0387 43.7837 39.0887 43.2684 39.0887 42.0674C39.0887 40.8665 40.1328 40.4587 41.0693 40.4139L42.3509 40.3601V40.2391C42.3509 39.67 41.97 39.3743 41.3068 39.3743C40.6571 39.3743 40.0073 39.679 39.7474 39.8538L39.3127 38.7156C39.7474 38.487 40.5406 38.1689 41.4906 38.1689C42.4405 38.1689 42.9872 38.3974 43.3905 38.7917C43.7804 39.1861 44 39.7104 44 40.62V43.6627ZM42.3599 41.2877L41.5443 41.3415C41.038 41.3639 40.7377 41.5924 40.7377 41.9957C40.7377 42.4125 41.0559 42.6634 41.513 42.6634C41.9566 42.6634 42.2568 42.3587 42.3599 42.1705V41.2877V41.2877Z' fill='%23555555'/%3e%3c/svg%3e"
          : "data:image/svg+xml,%3csvg width='44' height='46' viewBox='0 0 44 46' role='img' aria-hidden='true' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3cpath opacity='0.5' d='M30 28H26V32H30V28Z' fill='%230074BF'/%3e%3cpath opacity='0.7' d='M26 28H22V32H26V28Z' fill='%230074BF'/%3e%3cpath opacity='0.7' d='M22 28H18V32H22V28Z' fill='%230074BF'/%3e%3cpath opacity='0.5' d='M18 28H14V32H18V28Z' fill='%230074BF'/%3e%3cpath opacity='0.7' d='M34 24H30V28H34V24Z' fill='%230082BF'/%3e%3cpath opacity='0.8' d='M30 24H26V28H30V24Z' fill='%230082BF'/%3e%3cpath d='M26 24H22V28H26V24Z' fill='%230082BF'/%3e%3cpath d='M22 24H18V28H22V24Z' fill='%230082BF'/%3e%3cpath opacity='0.8' d='M18 24H14V28H18V24Z' fill='%230082BF'/%3e%3cpath opacity='0.7' d='M14 24H10V28H14V24Z' fill='%230082BF'/%3e%3cpath opacity='0.5' d='M38 20H34V24H38V20Z' fill='%23008FBF'/%3e%3cpath opacity='0.8' d='M34 20H30V24H34V20Z' fill='%23008FBF'/%3e%3cpath d='M30 20H26V24H30V20Z' fill='%23008FBF'/%3e%3cpath d='M26 20H22V24H26V20Z' fill='%23008FBF'/%3e%3cpath d='M22 20H18V24H22V20Z' fill='%23008FBF'/%3e%3cpath d='M18 20H14V24H18V20Z' fill='%23008FBF'/%3e%3cpath opacity='0.8' d='M14 20H10V24H14V20Z' fill='%23008FBF'/%3e%3cpath opacity='0.5' d='M10 20H6V24H10V20Z' fill='%23008FBF'/%3e%3cpath opacity='0.7' d='M38 16H34V20H38V16Z' fill='%23009DBF'/%3e%3cpath d='M34 16H30V20H34V16Z' fill='%23009DBF'/%3e%3cpath d='M30 16H26V20H30V16Z' fill='%23009DBF'/%3e%3cpath d='M26 16H22V20H26V16Z' fill='%23009DBF'/%3e%3cpath d='M22 16H18V20H22V16Z' fill='%23009DBF'/%3e%3cpath d='M18 16H14V20H18V16Z' fill='%23009DBF'/%3e%3cpath d='M14 16H10V20H14V16Z' fill='%23009DBF'/%3e%3cpath opacity='0.7' d='M10 16H6V20H10V16Z' fill='%23009DBF'/%3e%3cpath opacity='0.7' d='M38 12H34V16H38V12Z' fill='%2300ABBF'/%3e%3cpath d='M34 12H30V16H34V12Z' fill='%2300ABBF'/%3e%3cpath d='M30 12H26V16H30V12Z' fill='%2300ABBF'/%3e%3cpath d='M26 12H22V16H26V12Z' fill='%2300ABBF'/%3e%3cpath d='M22 12H18V16H22V12Z' fill='%2300ABBF'/%3e%3cpath d='M18 12H14V16H18V12Z' fill='%2300ABBF'/%3e%3cpath d='M14 12H10V16H14V12Z' fill='%2300ABBF'/%3e%3cpath opacity='0.7' d='M10 12H6V16H10V12Z' fill='%2300ABBF'/%3e%3cpath opacity='0.5' d='M38 8H34V12H38V8Z' fill='%2300B9BF'/%3e%3cpath opacity='0.8' d='M34 8H30V12H34V8Z' fill='%2300B9BF'/%3e%3cpath d='M30 8H26V12H30V8Z' fill='%2300B9BF'/%3e%3cpath d='M26 8H22V12H26V8Z' fill='%2300B9BF'/%3e%3cpath d='M22 8H18V12H22V8Z' fill='%2300B9BF'/%3e%3cpath d='M18 8H14V12H18V8Z' fill='%2300B9BF'/%3e%3cpath opacity='0.8' d='M14 8H10V12H14V8Z' fill='%2300B9BF'/%3e%3cpath opacity='0.5' d='M10 8H6V12H10V8Z' fill='%2300B9BF'/%3e%3cpath opacity='0.7' d='M34 4H30V8H34V4Z' fill='%2300C6BF'/%3e%3cpath opacity='0.8' d='M30 4H26V8H30V4Z' fill='%2300C6BF'/%3e%3cpath d='M26 4H22V8H26V4Z' fill='%2300C6BF'/%3e%3cpath d='M22 4H18V8H22V4Z' fill='%2300C6BF'/%3e%3cpath opacity='0.8' d='M18 4H14V8H18V4Z' fill='%2300C6BF'/%3e%3cpath opacity='0.7' d='M14 4H10V8H14V4Z' fill='%2300C6BF'/%3e%3cpath opacity='0.5' d='M30 0H26V4H30V0Z' fill='%2300D4BF'/%3e%3cpath opacity='0.7' d='M26 0H22V4H26V0Z' fill='%2300D4BF'/%3e%3cpath opacity='0.7' d='M22 0H18V4H22V0Z' fill='%2300D4BF'/%3e%3cpath opacity='0.5' d='M18 0H14V4H18V0Z' fill='%2300D4BF'/%3e%3cpath d='M16.5141 14.9697L17.6379 12.4572C18.0459 11.8129 17.9958 11.0255 17.5449 10.5745C17.4876 10.5173 17.416 10.46 17.3444 10.4171C17.0366 10.2238 16.6572 10.1808 16.3065 10.2954C15.9199 10.4171 15.5835 10.6748 15.3687 11.0184C15.3687 11.0184 13.8297 14.6046 13.2642 16.2153C12.6987 17.8259 12.9206 20.7822 15.1254 22.987C17.4661 25.3277 20.8448 25.8575 23.0066 24.2397C23.0997 24.1967 23.1784 24.1395 23.2572 24.0751L29.9072 18.5202C30.2293 18.2554 30.7089 17.7042 30.2794 17.0743C29.8642 16.4586 29.0697 16.881 28.7404 17.0886L24.9107 19.8731C24.8391 19.9304 24.7318 19.9232 24.6673 19.8517C24.6673 19.8517 24.6673 19.8445 24.6602 19.8445C24.56 19.7228 24.5456 19.4079 24.696 19.2862L30.5657 14.304C31.074 13.8459 31.1456 13.1802 30.7304 12.7292C30.3295 12.2854 29.6924 12.2997 29.1842 12.7578L23.9157 16.881C23.8155 16.9597 23.6652 16.9454 23.5864 16.8452L23.5793 16.838C23.4719 16.7235 23.4361 16.5231 23.5506 16.4014L29.535 10.596C30.0074 10.1522 30.036 9.4149 29.5922 8.94245C29.3775 8.72054 29.084 8.59169 28.7762 8.59169C28.4612 8.59169 28.1606 8.70623 27.9387 8.92813L21.8255 14.6691C21.6823 14.8122 21.396 14.6691 21.3602 14.4973C21.3459 14.4328 21.3674 14.3684 21.4103 14.3255L26.0918 8.99972C26.5571 8.56306 26.5858 7.83292 26.1491 7.36763C25.7124 6.90234 24.9823 6.87371 24.517 7.31036C24.4955 7.32468 24.4812 7.34615 24.4597 7.36763L17.3659 15.2203C17.1082 15.478 16.736 15.4851 16.557 15.342C16.4425 15.2489 16.4282 15.0843 16.5141 14.9697Z' fill='white'/%3e%3cpath d='M4.99195 43.6627H3.32946V40.8306C3.32946 40.1764 3.2488 39.6073 2.55423 39.6073C1.85966 39.6073 1.64905 40.2167 1.64905 41.0144V43.6627H0V36.112H1.64905V37.9045C1.64905 38.4512 1.64008 39.0427 1.64008 39.0427C1.89999 38.5632 2.38395 38.1689 3.13677 38.1689C4.61106 38.1689 4.99195 39.1637 4.99195 40.4766V43.6627Z' fill='white'/%3e%3cpath d='M12.081 42.762C11.7181 43.1563 10.9652 43.7882 9.51337 43.7882C7.42069 43.7882 5.77612 42.3228 5.77612 39.8941C5.77612 37.4564 7.43861 36 9.50889 36C10.9742 36 11.7674 36.6453 11.9556 36.8514L11.4402 38.3167C11.3058 38.1285 10.544 37.5281 9.60299 37.5281C8.39757 37.5281 7.4655 38.3795 7.4655 39.8582C7.4655 41.337 8.43342 42.175 9.60299 42.175C10.4902 42.175 11.131 41.803 11.5209 41.3773L12.081 42.762Z' fill='white'/%3e%3cpath d='M17.3016 43.6627H15.7242L15.6928 43.0936C15.4777 43.3221 15.0655 43.7837 14.2365 43.7837C13.3403 43.7837 12.3903 43.2684 12.3903 42.0674C12.3903 40.8665 13.4344 40.4587 14.3709 40.4139L15.6525 40.3601V40.2391C15.6525 39.67 15.2716 39.3743 14.6084 39.3743C13.9586 39.3743 13.3089 39.679 13.049 39.8538L12.6143 38.72C13.049 38.4915 13.8421 38.1733 14.7921 38.1733C15.7421 38.1733 16.2888 38.4019 16.6921 38.7962C17.082 39.1906 17.3016 39.7148 17.3016 40.6245V43.6627ZM15.657 41.2877L14.8414 41.3415C14.3351 41.3639 14.0348 41.5924 14.0348 41.9957C14.0348 42.4125 14.353 42.6634 14.8101 42.6634C15.2537 42.6634 15.5539 42.3587 15.657 42.1705V41.2877Z' fill='white'/%3e%3cpath d='M21.6035 43.7792C20.8506 43.7792 20.3129 43.4835 19.9948 42.9816V45.6389H18.3457V38.2674H19.9141L19.9051 38.9575H19.9275C20.2995 38.487 20.8462 38.1689 21.6214 38.1689C23.0867 38.1689 24.0143 39.3832 24.0143 40.9696C24.0143 42.5559 23.0778 43.7792 21.6035 43.7792ZM21.1285 39.549C20.4249 39.549 19.941 40.1181 19.941 40.9471C19.941 41.7762 20.4249 42.3453 21.1285 42.3453C21.841 42.3453 22.3249 41.7762 22.3249 40.9471C22.3249 40.1181 21.841 39.549 21.1285 39.549Z' fill='white'/%3e%3cpath d='M27.8322 39.6028H26.7074V41.5386C26.7074 42.0002 26.7702 42.1077 26.8508 42.2063C26.9225 42.296 27.0256 42.3363 27.2407 42.3363C27.411 42.3318 27.5768 42.3004 27.7381 42.2377L27.8188 43.6044C27.4379 43.7165 27.039 43.7747 26.6447 43.7792C26.0577 43.7792 25.6633 43.591 25.4079 43.2773C25.1525 42.9636 25.0449 42.511 25.0449 41.691V39.6028H24.3235V38.2809H25.0449V36.8156H26.7074V38.2809H27.8322V39.6028Z' fill='white'/%3e%3cpath d='M32.712 43.1339C32.6583 43.1787 32.125 43.7792 30.7717 43.7792C29.3781 43.7792 28.0875 42.771 28.0875 40.9785C28.0875 39.1726 29.396 38.1689 30.7896 38.1689C32.0892 38.1689 32.6762 38.738 32.6762 38.738L32.3132 40.0599C31.9458 39.7507 31.4842 39.5804 31.0047 39.5804C30.3012 39.5804 29.7455 40.0957 29.7455 40.9471C29.7455 41.7986 30.2519 42.3363 31.0271 42.3363C31.8024 42.3363 32.3177 41.812 32.3177 41.812L32.712 43.1339Z' fill='white'/%3e%3cpath d='M38.3986 43.6627H36.7361V40.8306C36.7361 40.1764 36.6554 39.6073 35.9608 39.6073C35.2663 39.6073 35.0512 40.2212 35.0512 41.0188V43.6672H33.4066V36.112H35.0557V37.9045C35.0557 38.4512 35.0467 39.0427 35.0467 39.0427C35.3066 38.5632 35.7906 38.1689 36.5434 38.1689C38.0177 38.1689 38.3986 39.1637 38.3986 40.4766V43.6627Z' fill='white'/%3e%3cpath d='M44 43.6627H42.4227L42.3913 43.0936C42.1762 43.3221 41.764 43.7837 40.935 43.7837C40.0387 43.7837 39.0887 43.2684 39.0887 42.0674C39.0887 40.8665 40.1328 40.4587 41.0694 40.4139L42.351 40.3601V40.2391C42.351 39.67 41.9701 39.3743 41.3069 39.3743C40.6571 39.3743 40.0074 39.679 39.7475 39.8538L39.3128 38.7156C39.7475 38.487 40.5406 38.1689 41.4906 38.1689C42.4406 38.1689 42.9873 38.3974 43.3906 38.7917C43.7805 39.1861 44 39.7104 44 40.62V43.6627ZM42.3599 41.2877L41.5444 41.3415C41.038 41.3639 40.7378 41.5924 40.7378 41.9957C40.7378 42.4125 41.0559 42.6634 41.513 42.6634C41.9566 42.6634 42.2569 42.3587 42.3599 42.1705V41.2877V41.2877Z' fill='white'/%3e%3c/svg%3e",
      i =
        'https://newassets.hcaptcha.com/captcha/v1/a8cd801/static/images/logo_combination-' +
        this.state.theme +
        '.png'
    t.logo &&
      ((i = 'png'),
      (e = 'object' == typeof t.logo ? t.logo[this.state.theme] || t.logo.light : t.logo))
    var n = { theme: sr, url: this.state.url, src: e, fallback: i, autoLoad: this.state.display }
    this.logo = this.initComponent(fn, n)
  }
  function _r(t) {
    ie.self(this, ne, 'anchor-info'),
      (this.state = { size: t.size }),
      (this.brand = this.initComponent(Cr, t)),
      t.linksOff || (this.links = this.initComponent(wr, t))
  }
  function Er() {
    ie.self(this, ne, '#status'),
      (this.state = { visible: !1, copy: '' }),
      this.translate(),
      this.setAttribute('aria-hidden', !0),
      this.setAttribute('aria-live', 'polite')
  }
  function Ar() {
    ie.self(this, ne, '#warning'),
      (this.state = { visible: !1, copy: '' }),
      (this.$copy = this.initComponent(Ri, { selector: '.warning-text', theme: sr })),
      this.setAttribute('aria-hidden', !0),
      this.setAttribute('aria-live', 'polite')
  }
  function Sr(t) {
    var e = t.palette,
      i = t.component,
      n = 'light' === e.mode
    return Bi.merge(
      {
        main: { fill: e.grey[n ? 100 : 800], border: e.grey[n ? 300 : 200] },
        hover: { fill: e.grey[n ? 200 : 900] },
      },
      i.checkbox,
    )
  }
  function Br(t) {
    ie.self(this, ln, { selector: '#anchor', theme: sr, tabbable: !1 }),
      (this.state = {
        selected: !1,
        warning: !1,
        error: !1,
        ticked: !1,
        defaultVisible: 'invisible' !== t.size,
      }),
      (this.config = t),
      (this._style = Sr(sr.get())),
      this.setVisible(this.state.defaultVisible),
      (this.onClick = this.onClick.bind(this)),
      (this.onHover = this.onHover.bind(this)),
      (this.anchor = this.initComponent(fr)),
      (this.label = this.initComponent(dr)),
      (this.info = this.initComponent(_r, this.config)),
      (this.status = this.initComponent(Er)),
      (this.warning = this.initComponent(Ar)),
      this.addEventListener('enter', this.onClick),
      this.addEventListener('click', this.onClick),
      this.addEventListener('over', this.onHover),
      this.addEventListener('out', this.onHover)
  }
  function Lr(t, e) {
    var i = this
    t instanceof ee || (t = new ee(t)),
      (ht.host = e.host ? e.host : ''),
      (ht.sitekey = e.sitekey ? e.sitekey : '')
    var n = new ci(),
      o = new Br(e)
    return (
      o.style(),
      o.reset(),
      t.appendElement(o),
      t.css({ display: 'block' }),
      t.addEventListener('down', function () {
        t.hasClass('using-kb') && t.removeClass('using-kb')
      }),
      t.addEventListener('keyup', function (e) {
        9 === e.keyNum && t.addClass('using-kb')
      }),
      o.on('select', function (t) {
        o.select(), n.emit('select', t.action)
      }),
      (i.tick = function () {
        o.tick()
      }),
      (i.reset = function () {
        o.reset(), o.anchor.focus()
      }),
      (i.translate = function () {
        o.translate()
      }),
      (i.setStatus = function (t, e) {
        t
          ? (o.status.set(t, e), o.anchor.describeBy(o.status))
          : (o.status.reset(), o.anchor.describeBy(null))
      }),
      (i.setWarning = function (t) {
        o.warning.set(t),
          o.warning.isVisible() ? o.anchor.describeBy(o.warning) : o.anchor.describeBy(null)
      }),
      (i.on = function (t, e) {
        n.on(t, e)
      }),
      (i.off = function (t, e) {
        n.off(t, e)
      }),
      (i.getLocation = function () {
        return o.anchor.getLocation()
      }),
      (i.setLoading = function (t) {
        return o.setLoading(t)
      }),
      (i.getLogoUrl = function () {
        return o.getLogoUrl()
      }),
      (i.theme = function (t, e) {
        e ? (sr.add(t, sr.extend(sr.active(), e)), sr.use(t)) : sr.use(t), o.style()
      }),
      i
    )
  }
  function Tr(t, e) {
    ;(this.cause = t), (this.message = e)
  }
  function Or(t) {
    Tr.call(this, it.INVALID_CAPTCHA_ID, 'Invalid hCaptcha id: ' + t)
  }
  function Hr() {
    Tr.call(this, it.MISSING_CAPTCHA, 'No hCaptcha exists.')
  }
  function Mr() {
    Tr.call(
      this,
      it.MISSING_SITEKEY,
      'Missing sitekey - https://docs.hcaptcha.com/configuration#javascript-api',
    )
  }
  ie.proto(Cr, ne),
    (Cr.prototype.style = function () {
      if (this.state.display) {
        this.logo.size(44, 50), this.logo.css({ margin: '0 auto' })
      }
    }),
    (Cr.prototype.translate = function () {
      this.logo.setAttribute('aria-label', ue.translate(kr)),
        this.setAttribute('title', this.state.label)
    }),
    (Cr.prototype.getLogoUrl = function () {
      return this.state.url
    }),
    ie.proto(_r, ne),
    (_r.prototype.style = function () {
      var t = this.state.size,
        e = { display: 'inline-block', height: '100%', width: 65 },
        i = { margin: '0 auto', top: this.links ? 6 : 10, position: 'relative' },
        n = { textAlign: 'right', position: 'fixed', bottom: 9, right: 12 }
      'compact' === t &&
        ((e.width = '100%'),
        (e.height = 'auto'),
        (e.marginTop = 5),
        (i.top = this.links ? 0 : 10),
        (n.textAlign = 'center'),
        (n.position = 'relative'),
        (n.bottom = 5),
        (n.right = 'auto')),
        this.css(e),
        this.links && (this.links.style(), this.links.css(n)),
        this.brand.style(),
        this.brand.css(i)
    }),
    (_r.prototype.setVisible = function (t) {
      if (this.links) {
        var e = '-1'
        t && (e = '0'),
          this.brand.logo.setAttribute('tabindex', e),
          this.links.privacy.setAttribute('tabindex', e),
          this.links.terms.setAttribute('tabindex', e)
      }
    }),
    (_r.prototype.translate = function () {
      this.links && this.links.translate(), this.brand.translate()
    }),
    (_r.prototype.getLogoUrl = function () {
      return this.brand.getLogoUrl()
    }),
    ie.proto(Er, ne),
    (Er.prototype.style = function () {
      var t = sr.get().palette
      this.css({
        display: this.state.visible ? 'block' : 'none',
        color: t.warn.main,
        fontSize: 10,
        top: 5,
        left: 5,
        position: 'absolute',
      })
    }),
    (Er.prototype.set = function (t, e) {
      if (t && t.indexOf('invalid-challenge') >= 0) {
        var i = t.replace(/-/g, ' ')
        t = i.charAt(0).toUpperCase() + i.slice(1) + '.'
      }
      ;(this.state.visible = t && '' !== t && !e),
        (this.state.copy = t),
        this.state.visible
          ? (this.translate(), this.setAttribute('aria-hidden', e || !t))
          : this.removeAttribute('aria-label'),
        this.css({ display: this.state.visible ? 'block' : 'none' })
    }),
    (Er.prototype.reset = function () {
      ;(this.state.visible = !1),
        (this.state.copy = ''),
        this.removeAttribute('aria-label'),
        this.setAttribute('aria-hidden', !0),
        this.css({ display: 'none' })
    }),
    (Er.prototype.translate = function () {
      if ('' !== this.state.copy) {
        var t = ue.translate(this.state.copy)
        this.setAttribute('aria-label', t), this.content(t)
      }
    }),
    (Er.prototype.isVisible = function () {
      return this.state.visible
    }),
    ie.proto(Ar, ne),
    (Ar.prototype.style = function (t) {
      var e = t ? '95%' : '75%',
        i = t ? 50 : 5,
        n = sr.get().palette
      this.css({
        display: this.state.visible ? 'block' : 'none',
        color: n.warn.main,
        fontSize: 10,
        bottom: i,
        left: 5,
        width: e,
        position: 'absolute',
      })
    }),
    (Ar.prototype.set = function (t) {
      ;(this.state.visible = t && '' !== t),
        (this.state.copy = t),
        this.state.visible ? this.translate() : this.removeAttribute('aria-label'),
        this.css({ display: this.state.visible ? 'block' : 'none' })
    }),
    (Ar.prototype.translate = function () {
      if ('' !== this.state.copy) {
        var t = ue.translate(this.state.copy)
        this.setAttribute('aria-label', t), this.$copy.parseText(t)
      }
    }),
    (Ar.prototype.isVisible = function () {
      return this.state.visible
    }),
    ie.proto(Br, ln),
    (Br.prototype.style = function () {
      var t = 'compact' === this.config.size
      ;(this._style = Sr(sr.get())),
        this.info.style(),
        this.anchor.style(t),
        this.label.style(t),
        this.status.style(),
        this.warning.style(t)
      var e = t ? 156 : 300,
        i = t ? 136 : 74,
        n = {
          backgroundColor: this._style.main.fill,
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: this._style.main.border,
          borderRadius: 4,
          cursor: this.state.ticked ? 'default' : 'pointer',
          width: e,
          height: i,
        }
      this.setStyle(n)
    }),
    (Br.prototype.onHover = function (t) {
      var e = 'over' === t.action ? 'hover' : 'main'
      this.css({ backgroundColor: this._style[e].fill })
    }),
    (Br.prototype.onClick = function (t) {
      var e = t.target || t.srcElement,
        i = 'string' == typeof e.className ? e.className : '',
        n = i.indexOf('logo') >= 0 || i.indexOf('link') >= 0
      if (this.state.selected || t.defaultPrevented || n) return !0
      this.emit('select', t)
    }),
    (Br.prototype.select = function () {
      ;(this.state.selected = !0),
        this.setLoading(!0),
        this.setAttribute('aria-hidden', !0),
        this.setAttribute('tabindex', '-1'),
        this.anchor.setAttribute('aria-checked', 'mixed'),
        this.anchor.setAttribute('tabindex', '-1'),
        this.info.setVisible(!1)
    }),
    (Br.prototype.reset = function () {
      ;(this.state.ticked = !1),
        (this.state.selected = !1),
        this.setVisible(this.state.defaultVisible),
        this.info.setVisible(this.state.defaultVisible),
        this.anchor.setState(null),
        this.css({ cursor: 'pointer' })
    }),
    (Br.prototype.setLoading = function (t) {
      this.state.loading = t
      var e = t ? 'loading' : this.state.selected ? 'solving' : null
      this.anchor.setState(e), this.css({ cursor: 'default' })
    }),
    (Br.prototype.tick = function () {
      ;(this.state.ticked = !0), this.anchor.setState('passed'), this.css({ cursor: 'default' })
    }),
    (Br.prototype.translate = function () {
      this.anchor.translate(),
        this.info.translate(),
        this.label.translate(),
        this.status.translate(),
        this.warning.translate()
    }),
    (Br.prototype.getLogoUrl = function () {
      return this.info.getLogoUrl()
    }),
    (Tr.prototype = Error.prototype)
  var Rr = [],
    Pr = [],
    Ir = {
      add: function (t) {
        Rr.push(t)
      },
      remove: function (t) {
        for (var e = !1, i = Rr.length; --i > -1 && !1 === e; ) {
          Rr[i].id === t.id && ((e = Rr[i]), Rr.splice(i, 1))
        }
        return e
      },
      each: function (t) {
        for (var e = -1; ++e < Rr.length; ) t(Rr[e])
      },
      isValidId: function (t) {
        for (var e = !1, i = -1; ++i < Rr.length && !1 === e; ) Rr[i].id === t && (e = !0)
        return e
      },
      getByIndex: function (t) {
        for (var e = !1, i = -1; ++i < Rr.length && !1 === e; ) i === t && (e = Rr[i])
        return e
      },
      getById: function (t) {
        for (var e = !1, i = -1; ++i < Rr.length && !1 === e; ) Rr[i].id === t && (e = Rr[i])
        return e
      },
      getCaptchaIdList: function () {
        var t = []
        return (
          Ir.each(function (e) {
            t.push(e.id)
          }),
          t
        )
      },
      pushSession: function (t, e) {
        Pr.push([t, e]), Pr.length > 10 && Pr.splice(0, Pr.length - 10)
      },
      getSession: function () {
        return Pr
      },
    }
  function Vr(t, e) {
    'object' != typeof t || e || ((e = t), (t = null))
    var i,
      n,
      o,
      r = !0 === (e = e || {}).async,
      s = new Promise(function (t, e) {
        ;(n = t), (o = e)
      })
    if (((s.resolve = n), (s.reject = o), (i = t ? Ir.getById(t) : Ir.getByIndex(0)))) {
      St('Execute called', 'hCaptcha', 'info'),
        Je.setData('exec', 'api'),
        r && i.setPromise(s),
        i.onReady(i.initChallenge, e)
    } else if (t) {
      if (!r) throw new Or(t)
      s.reject(it.INVALID_CAPTCHA_ID)
    } else {
      if (!r) throw new Hr()
      s.reject(it.MISSING_CAPTCHA)
    }
    if (r) return s
  }
  function Dr(t) {
    var e = '',
      i = null
    i = t ? Ir.getById(t) : Ir.getByIndex(0)
    try {
      for (var n = Ir.getSession(), o = n.length, r = !1; --o > -1 && !r; ) {
        ;(r = n[o][1] === i.id) && (e = n[o][0])
      }
    } catch (s) {
      e = ''
    }
    return e
  }
  function Fr(t) {
    var e = t ? Ir.getById(t) : Ir.getByIndex(0)
    if (!e) throw t ? new Or(t) : new Hr()
    Ir.remove(e), e.destroy(), (e = null)
  }
  var $r = ['light', 'dark', 'contrast', 'grey-red'],
    Ur = new Bi()
  Ur.add('contrast', {}),
    Ur.add('grey-red', { component: { challenge: { main: { border: '#6a6a6a' } } } })
  function jr(t, e) {
    var i = this
    ;(this.id = t),
      (this.width = null),
      (this.height = null),
      (this.mobile = !1),
      (this.ready = !1),
      (this.listeners = []),
      (this.config = e),
      (this._visible = !1),
      (this._selected = !1),
      (this.$iframe = new ee('iframe')),
      (this._host = ht.host || window.location.hostname)
    var n = ht.assetUrl
    ft.assethost && (n = ft.assethost + ht.assetUrl.replace(ht.assetDomain, ''))
    var o = n.match(/^.+\:\/\/[^\/]+/),
      r = o ? o[0] : null,
      s =
        n +
        '/hcaptcha.html#frame=challenge&id=' +
        this.id +
        '&host=' +
        this._host +
        (e ? '&' + Pt(this.config) : ''),
      a = tt.Browser.supportsPST()
    this.setupParentContainer(e),
      (this.chat = ui.createChat(this.$iframe.dom, t, r)),
      this.chat.setReady(!1),
      (this._timeoutFailedToInitialize = setTimeout(function () {
        i.$iframe && i.$iframe.isConnected()
          ? Et('Failed to initialize. Iframe attached', 'error', 'frame:challenge', {
              contentWindow: !!i.$iframe.dom.contentWindow,
              iframeSrc: s,
              supportsPST: a,
              customContainer: i._hasCustomContainer,
            })
          : Et('Failed to initialize. Iframe detached', 'error', 'frame:challenge')
      }, 6e4)),
      (this.$iframe.dom.src = s),
      (this.$iframe.dom.frameBorder = 0),
      (this.$iframe.dom.scrolling = 'no'),
      tt.Browser.supportsPST() &&
        (this.$iframe.dom.allow =
          "private-state-token-issuance 'src'; private-state-token-redemption 'src'"),
      this.translate(),
      this._hasCustomContainer
        ? (this._hideIframe(), this._parent.appendChild(this.$iframe.dom))
        : ((this.$container = new ee('div')),
          (this.$wrapper = this.$container.createElement('div')),
          (this.$overlay = this.$container.createElement('div')),
          (this.$arrow = this.$container.createElement('div')),
          (this.$arrow.fg = this.$arrow.createElement('div')),
          (this.$arrow.bg = this.$arrow.createElement('div')),
          this.style.call(this),
          this.$wrapper.appendElement(this.$iframe),
          this._parent.appendChild(this.$container.dom),
          this.$container.setAttribute('aria-hidden', !0)),
      this.style()
  }
  ;(jr.prototype.setupParentContainer = function (t) {
    var e,
      i = t['challenge-container']
    i && (e = 'string' == typeof i ? document.getElementById(i) : i),
      e
        ? ((this._hasCustomContainer = !0), (this._parent = e))
        : ((this._hasCustomContainer = !1), (this._parent = document.body))
  }),
    (jr.prototype._hideIframe = function () {
      var t = {}
      'ie' !== tt.Browser.type || ('ie' === tt.Browser.type && 8 !== tt.Browser.version)
        ? ((t.opacity = 0), (t.visibility = 'hidden'))
        : (t.display = 'none'),
        this.$iframe.setAttribute('aria-hidden', !0),
        this.$iframe.css(t)
    }),
    (jr.prototype._showIframe = function () {
      var t = {}
      'ie' !== tt.Browser.type || ('ie' === tt.Browser.type && 8 !== tt.Browser.version)
        ? ((t.opacity = 1), (t.visibility = 'visible'))
        : (t.display = 'block'),
        this.$iframe.removeAttribute('aria-hidden'),
        this.$iframe.css(t)
    }),
    (jr.prototype.style = function () {
      var t = (function (t) {
        var e = t.palette,
          i = t.component
        return Bi.merge({ main: { fill: e.common.white, border: e.grey[400] } }, i.challenge)
      })(Ur.get())
      if (this._hasCustomContainer) {
        this.$iframe.css({ border: 0, position: 'relative', backgroundColor: t.main.fill })
      } else {
        var e = {
          backgroundColor: t.main.fill,
          border: '1px solid ' + t.main.border,
          boxShadow: 'rgba(0, 0, 0, 0.1) 0px 0px 4px',
          borderRadius: 4,
          left: 'auto',
          top: -1e4,
          zIndex: -9999999999999,
          position: 'absolute',
          pointerEvents: 'auto',
        }
        'ie' !== tt.Browser.type || ('ie' === tt.Browser.type && 8 !== tt.Browser.version)
          ? ((e.transition = 'opacity 0.15s ease-out'), (e.opacity = 0), (e.visibility = 'hidden'))
          : (e.display = 'none'),
          this.$container.css(e),
          this.$wrapper.css({ position: 'relative', zIndex: 1 }),
          this.$overlay.css({
            width: '100%',
            height: '100%',
            position: 'fixed',
            pointerEvents: 'none',
            top: 0,
            left: 0,
            zIndex: 0,
            backgroundColor: t.main.fill,
            opacity: 0.05,
          }),
          this.$arrow.css({
            borderWidth: 11,
            position: 'absolute',
            pointerEvents: 'none',
            marginTop: -11,
            zIndex: 1,
            right: '100%',
          }),
          this.$arrow.fg.css({
            borderWidth: 10,
            borderStyle: 'solid',
            borderColor: 'transparent rgb(255, 255, 255) transparent transparent',
            position: 'relative',
            top: 10,
            zIndex: 1,
          }),
          this.$arrow.bg.css({
            borderWidth: 11,
            borderStyle: 'solid',
            borderColor: 'transparent ' + t.main.border + ' transparent transparent',
            position: 'relative',
            top: -11,
            zIndex: 0,
          }),
          this.$iframe.css({ border: 0, zIndex: 2e9, position: 'relative' })
      }
    }),
    (jr.prototype.setup = function (t) {
      return this.chat.send('create-challenge', t)
    }),
    (jr.prototype.sendTranslation = function (t) {
      var e = { locale: t, table: ue.getTable(t) || {} }
      this.chat && this.chat.send('challenge-translate', e), this.translate()
    }),
    (jr.prototype.translate = function () {
      this.$iframe.dom.title = ue.translate('Main content of the hCaptcha challenge')
    }),
    (jr.prototype.isVisible = function () {
      return this._visible
    }),
    (jr.prototype.getDimensions = function (t, e) {
      return this._visible
        ? this.chat.contact('resize-challenge', { width: t, height: e })
        : Promise.resolve(null)
    }),
    (jr.prototype.show = function () {
      if (!0 !== this._visible) {
        if (((this._visible = !0), this._hasCustomContainer)) this._showIframe()
        else {
          var t = { zIndex: 9999999999999, display: 'block' }
          ;('ie' !== tt.Browser.type || ('ie' === tt.Browser.type && 8 !== tt.Browser.version)) &&
            ((t.opacity = 1), (t.visibility = 'visible')),
            this.$container.css(t),
            this.$container.removeAttribute('aria-hidden'),
            this.$overlay.css({ pointerEvents: 'auto', cursor: 'pointer' })
        }
      }
    }),
    (jr.prototype.focus = function () {
      this.$iframe.dom.focus()
    }),
    (jr.prototype.close = function (t) {
      if (!1 !== this._visible) {
        if (((this._visible = !1), this._hasCustomContainer)) {
          return this._hideIframe(), void this.chat.send('close-challenge', { event: t })
        }
        var e = { left: 'auto', top: -1e4, zIndex: -9999999999999 }
        'ie' !== tt.Browser.type || ('ie' === tt.Browser.type && 8 !== tt.Browser.version)
          ? ((e.opacity = 0), (e.visibility = 'hidden'))
          : (e.display = 'none'),
          this.$container.css(e),
          this._hasCustomContainer ||
            this.$overlay.css({ pointerEvents: 'none', cursor: 'default' }),
          this.chat.send('close-challenge', { event: t }),
          this.$container.setAttribute('aria-hidden', !0)
      }
    }),
    (jr.prototype.size = function (t, e, i) {
      ;(this.width = t),
        (this.height = e),
        (this.mobile = i),
        this.$iframe.css({ width: t, height: e }),
        this._hasCustomContainer ||
          (this.$wrapper.css({ width: t, height: e }),
          i ? this.$overlay.css({ opacity: 0.5 }) : this.$overlay.css({ opacity: 0.05 }))
    }),
    (jr.prototype.position = function (t) {
      if (!this._hasCustomContainer && t) {
        var e = 10,
          i = window.document.documentElement,
          n = tt.Browser.scrollY(),
          o = tt.Browser.width(),
          r = tt.Browser.height(),
          s =
            this.mobile ||
            'invisible' === this.config.size ||
            t.offset.left + t.tick.x <= t.tick.width / 2,
          a = Math.round(t.bounding.top) + n !== t.offset.top,
          c = s ? (o - this.width) / 2 : t.bounding.left + t.tick.right + 10
        ;(c + this.width + e > o || c < 0) && ((c = (o - this.width) / 2), (s = !0))
        var l =
            (i.scrollHeight < i.clientHeight ? i.clientHeight : i.scrollHeight) - this.height - e,
          h = s ? (r - this.height) / 2 + n : t.bounding.top + t.tick.y + n - this.height / 2
        a && h < n && (h = n + e),
          a && h + this.height >= n + r && (h = n + r - (this.height + e)),
          (h = Math.max(Math.min(h, l), 10))
        var u = t.bounding.top + t.tick.y + n - h - 10,
          f = this.height - 10 - 30
        ;(u = Math.max(Math.min(u, f), e)),
          this.$container.css({ left: c, top: h }),
          this.$arrow.fg.css({ display: s ? 'none' : 'block' }),
          this.$arrow.bg.css({ display: s ? 'none' : 'block' }),
          this.$arrow.css({ top: u }),
          (this.top = h),
          this.$container.dom.getBoundingClientRect()
      }
    }),
    (jr.prototype.destroy = function () {
      this._timeoutFailedToInitialize &&
        (clearTimeout(this._timeoutFailedToInitialize), (this._timeoutFailedToInitialize = null)),
        this._visible && this.close.call(this),
        ui.removeChat(this.chat),
        (this.chat = this.chat.destroy()),
        this._hasCustomContainer
          ? this._parent.removeChild(this.$iframe.dom)
          : (this._parent.removeChild(this.$container.dom),
            (this.$container = this.$container.__destroy())),
        (this.$iframe = this.$iframe.__destroy())
    }),
    (jr.prototype.setReady = function () {
      var t
      this._timeoutFailedToInitialize &&
        (clearTimeout(this._timeoutFailedToInitialize), (this._timeoutFailedToInitialize = null)),
        this.chat && this.chat.setReady(!0),
        (this.ready = !0)
      for (var e = this.listeners.length; --e > -1; ) {
        ;(t = this.listeners[e]), this.listeners.splice(e, 1), t()
      }
    }),
    (jr.prototype.onReady = function (t) {
      var e = Array.prototype.slice.call(arguments, 1),
        i = function () {
          t.apply(null, e)
        }
      this.ready ? i() : this.listeners.push(i)
    }),
    (jr.prototype.onOverlayClick = function (t) {
      this._hasCustomContainer || this.$overlay.addEventListener('click', t)
    }),
    (jr.prototype.setData = function (t) {
      this.chat && this.chat.send('challenge-data', t)
    })
  function Nr(t, e, i) {
    var n = this
    ;(this.id = e),
      (this.response = null),
      (this.location = { tick: null, offset: null, bounding: null }),
      (this.config = i),
      (this._ticked = !0),
      (this.$container = t instanceof ee ? t : new ee(t)),
      (this._host = ht.host || window.location.hostname),
      (this.$iframe = new ee('iframe'))
    var o = ht.assetUrl
    ft.assethost && (o = ft.assethost + ht.assetUrl.replace(ht.assetDomain, ''))
    var r = o.match(/^.+\:\/\/[^\/]+/),
      s = r ? r[0] : null,
      a =
        o +
        '/hcaptcha.html#frame=checkbox&id=' +
        this.id +
        '&host=' +
        this._host +
        (i ? '&' + Pt(this.config) : '')
    ;(this.chat = ui.createChat(this.$iframe.dom, e, s)),
      this.chat.setReady(!1),
      (this._timeoutFailedToInitialize = setTimeout(function () {
        n.$iframe && n.$iframe.isConnected()
          ? Et('Failed to initialize. Iframe attached', 'error', 'frame:checkbox', {
              contentWindow: !!n.$iframe.dom.contentWindow,
              iframeSrc: a,
            })
          : Et('Failed to initialize. Iframe detached', 'error', 'frame:checkbox')
      }, 6e4)),
      (this.$iframe.dom.src = a),
      (this.$iframe.dom.tabIndex = this.config.tabindex || 0),
      (this.$iframe.dom.frameBorder = '0'),
      (this.$iframe.dom.scrolling = 'no'),
      tt.Browser.supportsPST() &&
        (this.$iframe.dom.allow =
          "private-state-token-issuance 'src'; private-state-token-redemption 'src'"),
      this.translate(),
      this.config.size &&
        'invisible' === this.config.size &&
        this.$iframe.setAttribute('aria-hidden', 'true'),
      this.$iframe.setAttribute('data-hcaptcha-widget-id', e),
      this.$iframe.setAttribute('data-hcaptcha-response', ''),
      this.$container.appendElement(this.$iframe),
      'off' !== ft.recaptchacompat &&
        ((this.$textArea0 = this.$container.createElement(
          'textarea',
          '#g-recaptcha-response-' + e,
        )),
        (this.$textArea0.dom.name = 'g-recaptcha-response'),
        this.$textArea0.css({ display: 'none' })),
      (this.$textArea1 = this.$container.createElement('textarea', '#h-captcha-response-' + e)),
      (this.$textArea1.dom.name = 'h-captcha-response'),
      this.$textArea1.css({ display: 'none' }),
      (this.ready = new Promise(function (t) {
        n.chat.listen('checkbox-ready', t)
      }).then(function () {
        n._timeoutFailedToInitialize &&
          (clearTimeout(n._timeoutFailedToInitialize), (n._timeoutFailedToInitialize = null)),
          n.chat && n.chat.setReady(!0)
      })),
      (this.clearLoading = this.clearLoading.bind(this)),
      this.style()
  }
  function zr(t, e, i) {
    ;(this.id = e),
      (this.response = null),
      (this.location = { tick: null, offset: null, bounding: null }),
      (this.config = i),
      (this.$container = t instanceof ee ? t : new ee(t)),
      (this.$iframe = new ee('iframe')),
      this.$iframe.setAttribute('aria-hidden', 'true'),
      this.$iframe.css({ display: 'none' }),
      this.$iframe.setAttribute('data-hcaptcha-widget-id', e),
      this.$iframe.setAttribute('data-hcaptcha-response', ''),
      this.$container.appendElement(this.$iframe),
      'off' !== ft.recaptchacompat &&
        ((this.$textArea0 = this.$container.createElement(
          'textarea',
          '#g-recaptcha-response-' + e,
        )),
        (this.$textArea0.dom.name = 'g-recaptcha-response'),
        this.$textArea0.css({ display: 'none' })),
      (this.$textArea1 = this.$container.createElement('textarea', '#h-captcha-response-' + e)),
      (this.$textArea1.dom.name = 'h-captcha-response'),
      this.$textArea1.css({ display: 'none' })
  }
  function Zr(t, e, i) {
    if (!i.sitekey) throw new Mr()
    ;(this.id = e),
      (this.visible = !1),
      (this.overflow = { override: !1, cssUsed: !0, value: null, scroll: 0 }),
      (this.onError = null),
      (this.onPass = null),
      (this.onExpire = null),
      (this.onChalExpire = null),
      (this.onOpen = null),
      (this.onClose = null),
      (this._ready = !1),
      (this._active = !1),
      (this._listeners = []),
      (this.config = i),
      $r.indexOf(i.theme) >= 0 && Ur.use(i.theme),
      (this._state = { escaped: !1, passed: !1, expiredChallenge: !1, expiredResponse: !1 }),
      (this._origData = null),
      (this._langSet = !1),
      (this._promise = null),
      (this._responseTimer = null),
      (this.initChallenge = this.initChallenge.bind(this)),
      (this.closeChallenge = this.closeChallenge.bind(this)),
      (this.displayChallenge = this.displayChallenge.bind(this)),
      (this.getGetCaptchaManifest = this.getGetCaptchaManifest.bind(this)),
      (this.challenge = new jr(e, i)),
      'invisible' == this.config.size
        ? (St('Invisible mode is set', 'hCaptcha', 'info'), (this.checkbox = new zr(t, e, i)))
        : (this.checkbox = new Nr(t, e, i))
  }
  ;(Nr.prototype.setResponse = function (t) {
    ;(this.response = t),
      this.$iframe.dom.setAttribute('data-hcaptcha-response', t),
      'off' !== ft.recaptchacompat && (this.$textArea0.dom.value = t),
      (this.$textArea1.dom.value = t)
  }),
    (Nr.prototype.style = function () {
      var t = this.config.size
      switch ((this.$iframe.css({ pointerEvents: 'auto' }), t)) {
        case 'compact':
          this.$iframe.css({ width: 164, height: 144 })
          break
        case 'invisible':
          this.$iframe.css({ display: 'none' })
          break
        default:
          this.$iframe.css({ width: 303, height: 78, overflow: 'hidden' })
      }
    }),
    (Nr.prototype.reset = function () {
      ;(this._ticked = !1),
        this.$iframe &&
          this.$iframe.dom.contentWindow &&
          this.chat &&
          this.chat.send('checkbox-reset')
    }),
    (Nr.prototype.clearLoading = function () {
      this.chat && this.chat.send('checkbox-clear')
    }),
    (Nr.prototype.sendTranslation = function (t) {
      var e = { locale: t, table: ue.getTable(t) || {} }
      this.chat && this.chat.send('checkbox-translate', e), this.translate()
    }),
    (Nr.prototype.translate = function () {
      this.$iframe.dom.title = ue.translate(
        'Widget containing checkbox for hCaptcha security challenge',
      )
    }),
    (Nr.prototype.status = function (t, e) {
      this.$iframe &&
        this.$iframe.dom.contentWindow &&
        this.chat &&
        this.chat.send('checkbox-status', { text: t || null, a11yOnly: e || !1 })
    }),
    (Nr.prototype.tick = function () {
      ;(this._ticked = !0), this.chat && this.chat.send('checkbox-tick')
    }),
    (Nr.prototype.getTickLocation = function () {
      return this.chat.contact('checkbox-location')
    }),
    (Nr.prototype.getOffset = function () {
      var t = this.$iframe.dom
      t.offsetParent || (t = t.parentElement)
      for (var e = 0, i = 0; t; ) (e += t.offsetLeft), (i += t.offsetTop), (t = t.offsetParent)
      return { top: i, left: e }
    }),
    (Nr.prototype.getBounding = function () {
      return this.$iframe.dom.getBoundingClientRect()
    }),
    (Nr.prototype.destroy = function () {
      this._timeoutFailedToInitialize &&
        (clearTimeout(this._timeoutFailedToInitialize), (this._timeoutFailedToInitialize = null)),
        this._ticked && this.reset(),
        ui.removeChat(this.chat),
        (this.chat = this.chat.destroy()),
        this.$container.removeElement(this.$iframe),
        this.$container.removeElement(this.$textArea1),
        'off' !== ft.recaptchacompat &&
          (this.$container.removeElement(this.$textArea0),
          (this.$textArea0 = this.$textArea0.__destroy())),
        (this.$textArea1 = this.$textArea1.__destroy()),
        (this.$container = this.$container.__destroy()),
        (this.$iframe = this.$iframe.__destroy())
    }),
    (zr.prototype.setResponse = function (t) {
      ;(this.response = t),
        this.$iframe.dom.setAttribute('data-hcaptcha-response', t),
        'off' !== ft.recaptchacompat && (this.$textArea0.dom.value = t),
        (this.$textArea1.dom.value = t)
    }),
    (zr.prototype.reset = function () {}),
    (zr.prototype.clearLoading = function () {}),
    (zr.prototype.sendTranslation = function (t) {}),
    (zr.prototype.status = function (t, e) {}),
    (zr.prototype.tick = function () {}),
    (zr.prototype.getTickLocation = function () {
      return Promise.resolve({
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        width: 0,
        height: 0,
        x: 0,
        y: 0,
      })
    }),
    (zr.prototype.getOffset = function () {
      var t = this.$iframe.dom
      t.offsetParent || (t = t.parentElement)
      for (var e = 0, i = 0; t; ) (e += t.offsetLeft), (i += t.offsetTop), (t = t.offsetParent)
      return { top: i, left: e }
    }),
    (zr.prototype.getBounding = function () {
      return this.$iframe.dom.getBoundingClientRect()
    }),
    (zr.prototype.destroy = function () {
      this._ticked && this.reset(),
        this.$container.removeElement(this.$iframe),
        this.$container.removeElement(this.$textArea1),
        'off' !== ft.recaptchacompat &&
          (this.$container.removeElement(this.$textArea0),
          (this.$textArea0 = this.$textArea0.__destroy())),
        (this.$textArea1 = this.$textArea1.__destroy()),
        (this.$container = this.$container.__destroy()),
        (this.$iframe = this.$iframe.__destroy())
    }),
    (Zr.prototype._resetTimer = function () {
      null !== this._responseTimer &&
        (clearTimeout(this._responseTimer), (this._responseTimer = null))
    }),
    (Zr.prototype.initChallenge = function (t) {
      t || (t = {}), St('Initiate challenge', 'hCaptcha', 'info'), (this._origData = t)
      var e = this.getGetCaptchaManifest(),
        i = t.charity || null,
        n = t.a11yChallenge || !1,
        o = t.link || null,
        r = t.action || '',
        s = t.rqdata || null,
        a = t.errors || [],
        c = tt.Browser.width(),
        l = tt.Browser.height()
      ;(this._active = !0),
        this._resetTimer(),
        this._resetState(),
        this.checkbox.setResponse(''),
        this.challenge.setup({
          a11yChallenge: n,
          manifest: e,
          width: c,
          height: l,
          charity: i,
          link: o,
          action: r,
          rqdata: s,
          wdata: Ho(),
          errors: a.concat(rr.collect()),
        })
    }),
    (Zr.prototype.getGetCaptchaManifest = function () {
      var t = (this._origData || {}).manifest || null
      return (
        t || ((t = Object.create(null)).st = Date.now()),
        (t.v = 1),
        (t.topLevel = Je.getData()),
        (t.session = Ir.getSession()),
        (t.widgetList = Ir.getCaptchaIdList()),
        (t.widgetId = this.id),
        (t.href = window.location.href),
        (t.prev = JSON.parse(JSON.stringify(this._state))),
        t
      )
    }),
    (Zr.prototype.displayChallenge = function (t) {
      if (this._active) {
        var e = this
        this.visible = !0
        var i = this.checkbox,
          n = this.challenge,
          o = tt.Browser.height()
        if (!('ie' === tt.Browser.type && 8 === tt.Browser.version)) {
          var r = window.getComputedStyle(document.body).getPropertyValue('overflow-y')
          ;(this.overflow.override = 'hidden' === r),
            this.overflow.override &&
              ((this.overflow.cssUsed =
                '' === document.body.style.overflow && '' === document.body.style.overflowY),
              this.overflow.cssUsed || (this.overflow.value = '' === r ? 'auto' : r),
              (this.overflow.scroll = tt.Browser.scrollY()),
              (document.body.style.overflowY = 'auto'))
        }
        return new Promise(function (r) {
          i.status(),
            i.getTickLocation().then(function (s) {
              if (e._active) {
                if (
                  (n.size(t.width, t.height, t.mobile),
                  n.show(),
                  i.clearLoading(),
                  (i.location.bounding = i.getBounding()),
                  (i.location.tick = s),
                  (i.location.offset = i.getOffset()),
                  n.position(i.location),
                  n.focus(),
                  n.height > window.document.documentElement.clientHeight)
                ) {
                  ;(
                    window.document.scrollingElement || document.getElementsByTagName('html')[0]
                  ).scrollTop = Math.abs(n.height - o) + n.top
                }
                r()
              }
            })
        }).then(function () {
          St('Challenge is displayed', 'hCaptcha', 'info'), e.onOpen && Nt(e.onOpen)
        })
      }
    }),
    (Zr.prototype.resize = function (t, e, i) {
      var n = this,
        o = this.checkbox,
        r = this.challenge
      r.getDimensions(t, e)
        .then(function (t) {
          t && r.size(t.width, t.height, t.mobile),
            (o.location.bounding = o.getBounding()),
            (o.location.offset = o.getOffset()),
            (tt.System.mobile && !i) || r.position(o.location)
        })
        ['catch'](function (t) {
          n.closeChallenge.call(n, {
            event: it.CHALLENGE_ERROR,
            message: 'Captcha resize caused error.',
            error: t,
          })
        })
    }),
    (Zr.prototype.position = function () {
      var t = this.checkbox,
        e = this.challenge
      tt.System.mobile || ((t.location.bounding = t.getBounding()), e.position(t.location))
    }),
    (Zr.prototype.reset = function () {
      St('Captcha Reset', 'hCaptcha', 'info')
      try {
        this.checkbox.reset(), this.checkbox.setResponse(''), this._resetTimer(), this._resetState()
      } catch (t) {
        At('hCaptcha', t)
      }
    }),
    (Zr.prototype._resetState = function () {
      for (var t in this._state) this._state[t] = !1
    }),
    (Zr.prototype.closeChallenge = function (t) {
      ;(this.visible = !1), (this._active = !1)
      var e = this,
        i = this.checkbox,
        n = this.challenge
      this.overflow.override &&
        (((window.document.scrollingElement || document.getElementsByTagName('html')[0]).scrollTop =
          this.overflow.scroll),
        (this.overflow.override = !1),
        (this.overflow.scroll = 0),
        (document.body.style.overflowY = this.overflow.cssUsed ? null : this.overflow.value))
      var o = t.response || ''
      switch (
        (i.setResponse(o),
        n.close(t.event),
        i.$iframe.dom.focus(),
        St('Challenge has closed', 'hCaptcha', 'info', {
          event: t.event,
          response: t.response,
          message: t.message,
        }),
        t.event)
      ) {
        case et.CHALLENGE_ESCAPED:
          ;(this._state.escaped = !0),
            i.reset(),
            e.onClose && Nt(e.onClose),
            e._promise && e._promise.reject(et.CHALLENGE_CLOSED)
          break
        case et.CHALLENGE_EXPIRED:
          ;(this._state.expiredChallenge = !0),
            i.reset(),
            i.status('hCaptcha window closed due to timeout.', !0),
            e.onChalExpire && Nt(e.onChalExpire),
            e._promise && e._promise.reject(et.CHALLENGE_EXPIRED)
          break
        case it.CHALLENGE_ERROR:
        case it.BUNDLE_ERROR:
        case it.NETWORK_ERROR:
          var r = t.event
          i.reset(),
            t.event === it.NETWORK_ERROR
              ? (i.status(t.message),
                429 === t.status
                  ? (r = it.RATE_LIMITED)
                  : 'invalid-data' === t.message && (r = it.INVALID_DATA))
              : t.event === it.BUNDLE_ERROR
              ? (r = it.CHALLENGE_ERROR)
              : t.event === it.CHALLENGE_ERROR &&
                'Answers are incomplete' === t.message &&
                (r = it.INCOMPLETE_ANSWER),
            Et('Failed to execute', 'error', 'hCaptcha', {
              error: r,
              event: t.event,
              message: t.message,
            }),
            this.onError && Nt(this.onError, r),
            e._promise && e._promise.reject(r)
          break
        case et.CHALLENGE_PASSED:
          ;(this._state.passed = !0),
            i.tick(),
            this.onPass && Nt(this.onPass, o),
            e._promise && e._promise.resolve({ response: o, key: Dr(this.id) }),
            'number' == typeof t.expiration &&
              (e._resetTimer(),
              (e._responseTimer = setTimeout(function () {
                try {
                  i.$iframe &&
                    (i.$iframe.dom.contentWindow
                      ? (i.reset(),
                        i.setResponse(''),
                        i.status(
                          'hCaptcha security token has expired. Please complete the challenge again.',
                          !0,
                        ))
                      : Fr(e.id))
                } catch (Qr) {
                  At('global', Qr)
                }
                e.onExpire && Nt(e.onExpire),
                  (e._responseTimer = null),
                  (e._state.expiredResponse = !0)
              }, 1e3 * t.expiration)))
      }
      e._promise = null
    }),
    (Zr.prototype.updateTranslation = function (t) {
      ;(this.config.hl = t),
        (this._langSet = !0),
        this.checkbox && this.checkbox.sendTranslation(t),
        this.challenge && this.challenge.sendTranslation(t)
    }),
    (Zr.prototype.isLangSet = function () {
      return this._langSet
    }),
    (Zr.prototype.isReady = function () {
      return this._ready
    }),
    (Zr.prototype.setReady = function (t) {
      if (((this._ready = t), this._ready)) {
        var e
        St('Instance is ready', 'hCaptcha', 'info')
        for (var i = this._listeners.length; --i > -1; ) {
          ;(e = this._listeners[i]), this._listeners.splice(i, 1), e()
        }
      }
    }),
    (Zr.prototype.setPromise = function (t) {
      this._promise = t
    }),
    (Zr.prototype.onReady = function (t) {
      var e = Array.prototype.slice.call(arguments, 1),
        i = function () {
          t.apply(null, e)
        }
      this._ready ? i() : this._listeners.push(i)
    }),
    (Zr.prototype.destroy = function () {
      ;(St('Captcha Destroy', 'hCaptcha', 'info'), this._resetTimer(), this.overflow.override) &&
        (((window.document.scrollingElement || document.getElementsByTagName('html')[0]).scrollTop =
          this.overflow.scroll),
        (this.overflow.override = !1),
        (this.overflow.scroll = 0),
        (document.body.style.overflowY = this.overflow.cssUsed ? null : this.overflow.value))
      this.challenge.destroy(),
        this.checkbox.destroy(),
        (this.challenge = null),
        (this.checkbox = null)
    }),
    (Zr.prototype.setSiteConfig = function (t) {
      var e = this
      if ('ok' in t) {
        var i = t.ok.features || {}
        if (this.config.themeConfig && i.custom_theme) {
          var n = 'custom-' + this.id
          Ur.add(n, Ur.extend(Ur.active(), this.config.themeConfig)),
            Ur.use(n),
            this.challenge.style()
        }
      }
      return 'invisible' === this.config.size
        ? Promise.resolve()
        : this.checkbox.ready.then(function () {
            return (
              e.checkbox.chat.send('site-setup', t),
              new Promise(function (t) {
                e.checkbox.chat.listen('checkbox-loaded', function () {
                  t()
                })
              })
            )
          })
    })
  var Wr = 0,
    qr = [
      'hl',
      'custom',
      'tplinks',
      'sitekey',
      'theme',
      'size',
      'tabindex',
      'challenge-container',
      'confirm-nav',
      'orientation',
      'mode',
    ]
  function Kr(t, e) {
    if (t) {
      try {
        t.updateTranslation(e)
      } catch (Qr) {
        At('translation', Qr)
      }
    }
  }
  var Yr = {
    render: function (t, e) {
      if (('string' == typeof t && (t = document.getElementById(t)), t && 1 === t.nodeType)) {
        if (
          (function (t) {
            if (!t || !('challenge-container' in t)) return !0
            var e = t['challenge-container']
            return 'string' == typeof e && (e = document.getElementById(e)), !!e && 1 === e.nodeType
          })(e)
        ) {
          if (!1 !== ui.isSupported()) {
            for (var i, n, o = t.getElementsByTagName('iframe'), r = -1; ++r < o.length && !i; ) {
              ;(n = o[r].getAttribute('data-hcaptcha-widget-id')) && (i = !0)
            }
            if (i) return console.error('Only one captcha is permitted per parent container.'), n
            St('Render instance', 'hCaptcha', 'info')
            var s = (function (t, e) {
                for (
                  var i = [
                      'hl',
                      'custom',
                      'tplinks',
                      'sitekey',
                      'theme',
                      'type',
                      'size',
                      'tabindex',
                      'callback',
                      'expired-callback',
                      'chalexpired-callback',
                      'error-callback',
                      'open-callback',
                      'close-callback',
                      'endpoint',
                      'challenge-container',
                      'confirm-nav',
                      'orientation',
                      'mode',
                    ],
                    n = {},
                    o = 0;
                  o < i.length;
                  o++
                ) {
                  var r = i[o],
                    s = e && e[r]
                  s || (s = t.getAttribute('data-' + r)), s && (n[r] = s)
                }
                return n
              })(t, e),
              a = Wr++ + Math.random().toString(36).substr(2),
              c = Object.create(null)
            ;(c.sentry = ft.sentry),
              (c.reportapi = ft.reportapi),
              (c.recaptchacompat = ft.recaptchacompat),
              (c.custom = ft.custom),
              null !== ft.language && (c.hl = ue.getLocale()),
              ft.assethost && (c.assethost = ft.assethost),
              ft.imghost && (c.imghost = ft.imghost),
              ft.mode && (c.mode = ft.mode),
              ft.tplinks && (c.tplinks = ft.tplinks),
              ft.se && (c.se = ft.se),
              'off' === ft.pat && (c.pat = ft.pat),
              (c.pstissuer = ft.pstIssuer),
              'landscape' === ft.orientation && (c.orientation = ft.orientation)
            for (var l = 0; l < qr.length; l++) {
              var h = qr[l]
              h in s && (c[h] = s[h])
            }
            var u = ft.endpoint,
              f = c.sitekey
            '78c843a4-f80d-4a14-b3e5-74b492762487' === f && (u = rt),
              u === ot &&
                !Do() &&
                Math.random() < 0.005 &&
                f &&
                -1 === f.indexOf('-0000-0000-0000-') &&
                (u = rt),
              u !== ot && (c.endpoint = u),
              (c.theme = ft.theme)
            var d = window.location,
              p = d.origin || d.protocol + '//' + d.hostname + (d.port ? ':' + d.port : '')
            if (('null' !== p && (c.origin = p), s.theme)) {
              try {
                var m = s.theme
                'string' == typeof m && (m = JSON.parse(m)), (c.themeConfig = m), (c.custom = !0)
              } catch (ts) {
                c.theme = m
              }
            }
            if (t instanceof HTMLButtonElement || t instanceof HTMLInputElement) {
              var y = new ee('div', '.h-captcha')
              y.css({ display: 'none' })
              for (var g = null, v = 0; v < t.attributes.length; v++) {
                ;(g = t.attributes[v]).name.startsWith('data-') && y.setAttribute(g.name, g.value)
              }
              var b = t.tagName.toLowerCase() + "[data-hcaptcha-widget-id='" + a + "']"
              t.setAttribute('data-hcaptcha-widget-id', a),
                y.setAttribute('data-hcaptcha-source-id', b),
                t.parentNode.insertBefore(y.dom, t),
                (t.onclick = function (t) {
                  return t.preventDefault(), St('User initiated', 'hCaptcha', 'info'), Vr(a)
                }),
                (t = y),
                (c.size = 'invisible')
            }
            c.mode === at.AUTO &&
              'invisible' === c.size &&
              (console.warn(
                "[hCaptcha] mode='auto' cannot be used in combination with size='invisible'.",
              ),
              delete c.mode)
            try {
              var w = new Zr(t, a, c)
            } catch (Qr) {
              var x =
                'Your browser plugins or privacy policies are blocking the hCaptcha service. Please disable them for hCaptcha.com'
              return (
                Qr instanceof Mr &&
                  ((x =
                    'hCaptcha has failed to initialize. Please see the developer tools console for more information.'),
                  console.error(Qr.message)),
                yt(t, x),
                void At('api', Qr)
              )
            }
            s.callback && (w.onPass = s.callback),
              s['expired-callback'] && (w.onExpire = s['expired-callback']),
              s['chalexpired-callback'] && (w.onChalExpire = s['chalexpired-callback']),
              s['open-callback'] && (w.onOpen = s['open-callback']),
              s['close-callback'] && (w.onClose = s['close-callback']),
              s['error-callback'] && (w.onError = s['error-callback'])
            try {
              Je.setData('inv', 'invisible' === c.size),
                Je.setData('size', c.size),
                Je.setData(
                  'theme',
                  (function (t) {
                    var e,
                      i,
                      n = 'string' == typeof t ? t : JSON.stringify(t),
                      o = -1
                    for (
                      zt =
                        zt ||
                        (function () {
                          var t,
                            e,
                            i,
                            n = []
                          for (e = 0; e < 256; e++) {
                            for (t = e, i = 0; i < 8; i++) {
                              t = 1 & t ? 3988292384 ^ (t >>> 1) : t >>> 1
                            }
                            n[e] = t
                          }
                          return n
                        })(),
                        e = 0,
                        i = n.length;
                      e < i;
                      e += 1
                    ) {
                      o = (o >>> 8) ^ zt[255 & (o ^ n.charCodeAt(e))]
                    }
                    return (-1 ^ o) >>> 0
                  })(c.themeConfig || c.theme),
                ),
                Je.setData('pel', (t.outerHTML || '').replace(t.innerHTML, ''))
            } catch (k) {
              At('api', k)
            }
            return (
              (function (t, e) {
                if ('invisible' === e.size) return
                t.checkbox.chat.listen('checkbox-selected', function (e) {
                  St('User initiated', 'hCaptcha', 'info')
                  var i = 'enter' === e.action ? 'kb' : 'm'
                  Je.setData('exec', i), t.onReady(t.initChallenge, e)
                }),
                  t.checkbox.chat.listen('checkbox-loaded', function (i) {
                    St('Loaded', 'frame:checkbox', 'info'),
                      (t.checkbox.location.bounding = t.checkbox.getBounding()),
                      (t.checkbox.location.tick = i),
                      (t.checkbox.location.offset = t.checkbox.getOffset()),
                      t.checkbox.sendTranslation(e.hl)
                  }),
                  e.mode === at.AUTO &&
                    t.onReady(function () {
                      Vr(t.id)
                    }, e)
              })(w, c),
              (function (t, e) {
                function i(e, i) {
                  if (e.locale) {
                    var n = ue.resolveLocale(e.locale)
                    Ro(n)
                      .then(function () {
                        i
                          ? Kr(t, n)
                          : (ue.setLocale(n),
                            Ir.each(function (t) {
                              Kr(t, n)
                            }))
                      })
                      ['catch'](function (t) {
                        At('api', t, { locale: n })
                      })
                  }
                }
                t.challenge.chat.listen('site-setup', function (e) {
                  var i = t.setSiteConfig(e)
                  t.challenge.onReady(function () {
                    i.then(function () {
                      t.setReady(!0)
                    })
                  })
                }),
                  t.challenge.chat.listen('challenge-loaded', function () {
                    St('Loaded', 'frame:challenge', 'info'),
                      t.challenge.setReady(),
                      t.challenge.sendTranslation(e.hl)
                  }),
                  t.challenge.chat.answer('challenge-ready', function (e, i) {
                    t.displayChallenge(e).then(i.resolve)
                  }),
                  t.challenge.chat.listen('challenge-resize', function () {
                    var e = tt.Browser.width(),
                      i = tt.Browser.height()
                    t.resize(e, i)
                  }),
                  t.challenge.chat.listen(et.CHALLENGE_CLOSED, function (e) {
                    Je.setData('lpt', Date.now()), t.closeChallenge(e)
                  }),
                  t.challenge.chat.answer('get-url', function (t) {
                    t.resolve(window.location.href)
                  }),
                  t.challenge.chat.answer('getcaptcha-manifest', function (e) {
                    e.resolve(t.getGetCaptchaManifest())
                  }),
                  t.challenge.chat.answer('check-api', function (t) {
                    t.resolve(Je.getData())
                  }),
                  t.challenge.chat.listen('challenge-key', function (e) {
                    Ir.pushSession(e.key, t.id)
                  }),
                  t.challenge.onOverlayClick(function () {
                    t.closeChallenge({ event: et.CHALLENGE_ESCAPED })
                  }),
                  t.challenge.chat.listen('challenge-language', i),
                  i({ locale: e.hl }, !0),
                  t.challenge.chat.answer('get-ac', function (t) {
                    t.resolve(Bt.hasCookie('hc_accessibility'))
                  })
              })(w, c),
              Ir.add(w),
              a
            )
          }
          yt(
            t,
            "Your browser is missing or has disabled Cross-Window Messaging. Please <a style='color:inherit;text-decoration:underline; font: inherit' target='_blank' href='https://www.whatismybrowser.com/guides/how-to-update-your-browser/auto'>upgrade your browser</a> or enable it for hCaptcha.com",
          )
        } else {
          console.log(
            "[hCaptcha] render: invalid challenge container '" + e['challenge-container'] + "'.",
          )
        }
      } else console.log("[hCaptcha] render: invalid container '" + t + "'.")
    },
    reset: function (t) {
      var e
      if (t) {
        if (!(e = Ir.getById(t))) throw new Or(t)
        e.reset()
      } else {
        if (!(e = Ir.getByIndex(0))) throw new Hr()
        e.reset()
      }
    },
    remove: Fr,
    execute: Vr,
    getResponse: function (t) {
      var e, i
      if (
        ((i = t ? Ir.getById(t) : Ir.getByIndex(0)) && (e = i.checkbox.response || ''),
        void 0 !== e)
      ) {
        return e
      }
      throw t ? new Or(t) : new Hr()
    },
    getRespKey: Dr,
    close: function (t) {
      var e = !1
      if (!(e = t ? Ir.getById(t) : Ir.getByIndex(0))) throw t ? new Or(t) : new Hr()
      e.closeChallenge({ event: et.CHALLENGE_ESCAPED })
    },
    setData: function (t, e) {
      if (('object' != typeof t || e || ((e = t), (t = null)), !e || 'object' != typeof e)) {
        throw Error('[hCaptcha] invalid data supplied')
      }
      var i = !1
      if (!(i = t ? Ir.getById(t) : Ir.getByIndex(0))) throw t ? new Or(t) : new Hr()
      St('Set data', 'hCaptcha', 'info')
      var n = i.challenge.setData.bind(i.challenge)
      i.onReady(n, e)
    },
    nodes: Ir,
  }
  var Gr = 'hcaptcha-frame-a8cd801' === document.documentElement.getAttribute('data-id'),
    Jr = window.location.hash.slice(1),
    Xr = Rt(Jr).frame
  Gr && 'challenge' === Xr
    ? (function () {
        var t,
          e = undefined,
          i = 0,
          n = null,
          o = null,
          r = null,
          s = [et.CHALLENGE_ALREADY_CLOSED, et.CHALLENGE_EXPIRED],
          a = (function () {
            var t = document.currentScript
            if (t) return t
            for (var e = document.getElementsByTagName('script'), i = e.length; i--; ) {
              if (-1 !== (t = e[i]).src.indexOf('hcaptcha.js')) return t
            }
          })()
        if (a) {
          var c = a.src.split('#i=')[1]
          c && (t = c) && (bo = t)
        }
        window._sharedLibs = {
          packages: {
            config: { Options: ft, Color: ut },
            utils: { MathUtil: Ut, Query: It, Render: Mt, Color: Tt, Shuffle: Lt, JWT: Ht },
            canvas: { Canvas: ai, Path: ti, Segment: Qe, Point: Xe, PathSVG: ni, ReticlePoint: si },
            constants: lt,
            device: tt,
            language: ue,
            theme: Li,
            core: De,
            ui: mn,
          },
        }
        var l = window.location.hash.slice(1),
          h = Rt(l)
        !(function (t) {
          ;(ht.host = t.host),
            (ht.sitekey = t.sitekey),
            (ht.file = 'challenge'),
            (ft.sentry = !1 !== t.sentry),
            _t(!0),
            t.endpoint !== undefined && 'undefined' !== t.endpoint && (ft.endpoint = t.endpoint),
            t.reportapi !== undefined &&
              'undefined' !== t.reportapi &&
              (ft.reportapi = t.reportapi),
            t.assethost !== undefined &&
              'undefined' !== t.assethost &&
              (Zt.URL(t.assethost)
                ? (ft.assethost = t.assethost)
                : console.error('Invalid assethost uri.')),
            t.imghost !== undefined && 'undefined' !== t.imghost && (ft.imghost = t.imghost),
            t.hl !== undefined &&
              'undefined' !== t.hl &&
              ((ft.language = t.hl), ue.setLocale(ft.language)),
            t.se !== undefined && 'undefined' !== t.se && (ft.se = t.se),
            t.pstissuer !== undefined &&
              'undefined' !== t.pstissuer &&
              (ft.pstIssuer = t.pstissuer),
            t.pat !== undefined && 'undefined' !== t.pat && (ft.pat = t.pat),
            (ft.theme = t.theme || ft.theme),
            t.themeConfig && (ft.themeConfig = t.themeConfig),
            t['confirm-nav'] && (ft.confirmNav = !0)
        })(h)
        var u = setTimeout(function () {
          Et('Slow iframe initialization', 'error', 'frame:challenge', {
            readyState: document.readyState,
          })
        }, 6e4)
        function f(t, o) {
          Co(t && t.href),
            null !== n && (clearTimeout(n), (n = null)),
            r.lockInterface(!0),
            To && (To.p = Date.now() - To.s),
            _o()
              .then(function (t) {
                return (function (t, e) {
                  return e || 'on' !== ft.pat || !tt.supportsPAT()
                    ? Promise.resolve({ proof: t, pass: !1 })
                    : or
                        .authenticate(t)
                        .then(function (t) {
                          return (
                            ko(t.c),
                            _o().then(function (e) {
                              return { proof: e, pass: t.pass, authToken: t.auth_token }
                            })
                          )
                        })
                        ['catch'](function (t) {
                          kt(t), or.logAction(it.AUTHENTICATION_ERROR)
                          var e = t && t.response,
                            i = e && e.body
                          return (
                            ko(i.c),
                            _o().then(function (t) {
                              return { proof: t, pass: i.pass || !1 }
                            })
                          )
                        })
                })(t, o)
              })
              .then(function (t) {
                return or.hasPrivateStateToken().then(function (e) {
                  return (t.hasPst = e), t
                })
              })
              .then(function (e) {
                return (
                  To && (To.gcs = Date.now() - To.s),
                  or.getTaskData(t, e, ((n = Lo), (Lo = null), n), To, i)
                )
                var n
              })
              .then(function (t) {
                return (
                  To && (To.gce = Date.now() - To.s),
                  t.pass || !1 === t.success
                    ? d(t)
                    : ((e = { c: t.c, rq: t.rq, key: t.key, challengeType: t.request_type }),
                      e.challengeType
                        ? (e.key && fi.send('challenge-key', { key: e.key }),
                          r.create({ rq: e.rq }),
                          ko(e.c),
                          (i = e.challengeType),
                          To && ((To.l = Date.now() - To.s), (To.t = i)),
                          or
                            .loadBundle(e.challengeType)
                            .then(function (t) {
                              var i = or.getData()
                              return (
                                r.lockInterface(!1),
                                To && (To.o = Date.now() - To.s),
                                r.show({
                                  width: ht.browserWidth,
                                  height: ht.browserHeight,
                                  bundle: t,
                                  bundleData: i,
                                  expiration: 1e3 * (i.expiration || 120),
                                  challengeType: e.challengeType,
                                })
                              )
                            })
                            .then(function (t) {
                              return new Promise(function (e) {
                                Promise.all([_o(), fi.contact('check-api')]).then(function (i) {
                                  e({ answers: t, proof: i[0], motionData: i[1] })
                                })
                              })
                            })
                            .then(function (t) {
                              Je.stop()
                              var e = t.answers,
                                i = t.proof,
                                n = Je.getData()
                              return (
                                (n.topLevel = t.motionData),
                                (n.v = 1),
                                To && (To.c = Date.now() - To.s),
                                or.checkAnswers(e, n, i)
                              )
                            })
                            ['catch'](function (t) {
                              if (r.isVisible() || (t && -1 === s.indexOf(t.message))) {
                                throw (r.lockInterface(!0), t)
                              }
                            }))
                        : Promise.resolve({ c: e.c, skip: !0 })).then(d)
                )
                var e, i
              })
              ['catch'](function (t) {
                var n =
                  t instanceof Error || 'string' == typeof t
                    ? {
                        event: it.CHALLENGE_ERROR,
                        message: ('string' == typeof t ? t : t.message) || '',
                      }
                    : t
                or.logAction(n.event)
                var o = 429 === t.status,
                  r = t.response && t.response['error-codes'],
                  s = r && -1 !== r.indexOf('invalid-data')
                St('challenge', 'api', 'debug', t),
                  e ||
                  o ||
                  s ||
                  (n.event !== it.NETWORK_ERROR &&
                    n.event !== it.CHALLENGE_ERROR &&
                    n.event !== it.BUNDLE_ERROR) ||
                  !(i <= 3)
                    ? (i > 3 &&
                        0 !== t.status &&
                        429 !== t.status &&
                        403 !== t.status &&
                        400 !== t.status &&
                        Et('api:getcaptcha failed', 'error', 'challenge', { error: t }),
                      (i = 0),
                      s && (n = { event: it.NETWORK_ERROR, message: (r || ['']).join(', ') }),
                      e &&
                        ((n = { event: it.NETWORK_ERROR, message: e }),
                        console.error('[hCaptcha] ' + e),
                        (e = undefined)),
                      Oo(n.event),
                      fi.send(et.CHALLENGE_CLOSED, n))
                    : (i < 2 ||
                        (i < 3
                          ? ft.endpoint === st || ft.endpoint === nt
                            ? (ft.endpoint = ot)
                            : ft.endpoint === ot
                            ? Do() || (ft.endpoint = rt)
                            : ft.endpoint === rt && (ft.endpoint = ot)
                          : -1 !== ct.indexOf(ft.endpoint) && (ft.endpoint = nt)),
                      (i += 1),
                      p())
              })
        }
        function d(t) {
          if ((ko(t.c), t.skip)) {
            Oo(et.CHALLENGE_ESCAPED), fi.send(et.CHALLENGE_CLOSED, { event: et.CHALLENGE_ESCAPED })
          } else if (t.pass) {
            Oo(et.CHALLENGE_PASSED),
              fi.send(et.CHALLENGE_CLOSED, {
                event: et.CHALLENGE_PASSED,
                response: t.generated_pass_UUID,
                expiration: t.expiration,
              }),
              t.generated_pass_UUID || Et('no pass id', 'error', 'frame:challenge')
          } else if (!1 === t.success) {
            var e = t['error-codes'] || []
            if (-1 !== e.indexOf('expired-session') || -1 !== e.indexOf('client-fail')) {
              return void p()
            }
            Oo(it.NETWORK_ERROR),
              fi.send(et.CHALLENGE_CLOSED, {
                event: it.NETWORK_ERROR,
                message: (t['error-codes'] || ['']).join(', '),
              })
          } else r.displayTryAgain(!0), or.logAction('challenge-failed'), p()
        }
        function p() {
          if ((To && (To = { s: Date.now(), n: To.n + 1 }), or.isRqChl() && !ft.a11yChallenge)) {
            return (
              r.lockInterface(!0),
              void (n = setTimeout(function () {
                Oo(it.CHALLENGE_ERROR),
                  fi.send(et.CHALLENGE_CLOSED, {
                    event: it.CHALLENGE_ERROR,
                    message: 'Challenge Retry Failed',
                  })
              }, 2e3))
            )
          }
          fi.contact('getcaptcha-manifest').then(function (t) {
            f(t, !0)
          })
        }
        function m(t, e) {
          ;(ht.browserWidth = t.width),
            (ht.browserHeight = t.height),
            r.size(t.width, t.height).then(function (t) {
              e.resolve(t), St('challenge resized', 'challenge', 'info', t)
            })
        }
        function y() {
          St('challenge refresh', 'challenge', 'info'), or.logAction('challenge-refresh'), p()
        }
        function g() {
          wo(rr.collect()),
            r
              .submit()
              .then(function (t) {
                or.logAction(t), 'challenge-skip' !== t || p()
              })
              ['catch'](function (t) {
                kt(t), or.logAction(it.CHALLENGE_ERROR), p()
              })
        }
        function v() {
          var t = or.getData()
          r.displayReport(t)
            .then(function (t) {
              if (t) {
                var e = function () {
                  y(), r.getModal().off('refresh', e)
                }
                r.getModal().display('report_image', { key: t }), r.getModal().on('refresh', e)
              }
            })
            ['catch'](function (t) {
              kt(t), y()
            })
        }
        window.addEventListener('load', function () {
          u && (clearTimeout(u), (u = null)), St('iframe:load', 'challenge', 'info')
        }),
          document.addEventListener('DOMContentLoaded', function () {
            St('iframe:DOMContentLoaded', 'challenge', 'info')
          }),
          document.addEventListener('readystatechange', function () {
            St('iframe:readystatechange', 'challenge', 'info', { readyState: document.readyState })
          }),
          rr.run(),
          (r = new uo(document.body, {
            host: ht.host,
            sitekey: ht.sitekey,
            orientation: h.orientation || 'portrait',
          })),
          document.addEventListener('securitypolicyviolation', function (t) {
            'img-src' === t.violatedDirective &&
              (e = 'CSP blocks images (' + t.originalPolicy + ').')
          }),
          ft.themeConfig && r.addTheme('custom', ft.themeConfig),
          fi.init(h.id, h.origin),
          (o = new ee(document.body)),
          fi.answer('create-challenge', function (t) {
            To = { s: Date.now(), n: 0 }
            var e,
              i = {}
            t &&
              (or.setRqData(t.rqdata || or.getRqData()),
              t.wdata && ((e = t.wdata), (window.__wdata = e)),
              wo(t.errors),
              t.width && ((ht.browserWidth = t.width), (ht.browserHeight = t.height)),
              t.manifest && (i = t.manifest),
              'enter' === t.action
                ? o.addClass('using-kb')
                : o.hasClass('using-kb') && o.removeClass('using-kb'),
              r.init(t)),
              r.setFocus('info'),
              f(i, !1)
          }),
          fi.answer('close-challenge', function (t) {
            Oo(t.event),
              null !== n && (clearTimeout(n), (n = null)),
              t && t.event === et.CHALLENGE_ESCAPED && or.logAction('challenge-abandon-retry'),
              or.setRqData(null),
              r.close()
          }),
          fi.answer('resize-challenge', m),
          fi.answer('challenge-translate', function (t) {
            r.translateInterface(t),
              r.isVisible() &&
                ('en' !== t.locale
                  ? (or.logAction('challenge-language-change'), p())
                  : r.translateBundle())
          }),
          fi.contact('get-url').then(function (t) {
            ht.url = t
          }),
          fi.answer('challenge-data', function (t) {
            t.rqdata && or.setRqData(t.rqdata)
          }),
          r.events.on('refresh', y),
          r.events.on('submit', g),
          r.events.on('report', v),
          r.events.on('report-submission', function (t) {
            or.reportIssue(t.reason, t.comment, t.key)['catch'](function (t) {})
          }),
          r.events.on('resize', function () {
            fi.send('challenge-resize')
          }),
          r.events.on('focus-check', function () {
            o.addClass('using-kb'), r.triggerFocus('submit')
          }),
          o.addEventListener('down', function (t) {
            r.isInterfaceLocked() || r.displayTryAgain(!1)
          }),
          o.addEventListener('keydown', function (t) {
            27 === t.keyNum &&
              (r.getModal().isOpen()
                ? (r.getModal().close(), r.hideReport())
                : (Oo(et.CHALLENGE_ESCAPED),
                  fi.send(et.CHALLENGE_CLOSED, { event: et.CHALLENGE_ESCAPED }),
                  r.close()))
          }),
          o.addEventListener(
            'down',
            function () {
              'menu' !== r.getActiveElement() && o.hasClass('using-kb') && o.removeClass('using-kb')
            },
            !0,
          ),
          o.addEventListener(
            'keydown',
            function (t) {
              9 === t.keyNum &&
                (o.addClass('using-kb'),
                t.shiftKey ||
                  ('submit' === r.getActiveElement() &&
                    (r.triggerFocus('challenge', 0), t.preventDefault && t.preventDefault())))
            },
            !0,
          ),
          o.addEventListener('keydown', function (t) {
            if ('submit' === r.getActiveElement()) {
              var e = t.keyNum
              37 === e || 38 === e
                ? (o.addClass('using-kb'),
                  r.triggerFocus('challenge', -1),
                  t.preventDefault && t.preventDefault())
                : (39 !== e && 40 !== e) ||
                  (o.addClass('using-kb'),
                  r.triggerFocus('challenge', 0),
                  t.preventDefault && t.preventDefault())
            }
          }),
          Vo()
            .then(
              function (t) {
                var e = t.features
                return (
                  'object' != typeof e && (e = {}),
                  r.setWhiteLabel(!!t.custom),
                  ko(t.c),
                  ft.themeConfig && e.custom_theme ? r.useTheme('custom') : r.useTheme(ft.theme),
                  e.a11y_challenge && ((ft.a11yChallenge = !0), r.enableA11yChallenge(!0)),
                  !0 === e.enc_get_req && or.setEncryptionSupport(!0),
                  { ok: t }
                )
              },
              function (t) {
                return { err: t instanceof Error ? { name: t.name, message: t.message } : t }
              },
            )
            .then(function (t) {
              fi.send('site-setup', t)
            }),
          fi.send('challenge-loaded')
      })()
    : Gr && 'checkbox' === Xr
    ? (function () {
        var t = !1,
          e = window.location.hash.slice(1),
          i = Rt(e),
          n = ui.createChat(window.parent, i.id, i.origin)
        !(function (t) {
          ;(ht.id = t.id),
            (ht.host = t.host),
            (ht.sitekey = t.sitekey),
            (ht.file = 'checkbox'),
            (ft.sentry = !1 !== t.sentry),
            _t(!0),
            (ft.size = t.size || ft.compact),
            (ft.custom = t.custom || ft.custom),
            (ft.mode = t.mode || ft.mode),
            (ft.se = t.se || null),
            t.endpoint !== undefined && 'undefined' !== t.endpoint && (ft.endpoint = t.endpoint),
            t.assethost !== undefined &&
              'undefined' !== t.assethost &&
              (Zt.URL(t.assethost)
                ? (ft.assethost = t.assethost)
                : console.error('Invalid assethost uri.')),
            t.imghost !== undefined && 'undefined' !== t.imghost && (ft.imghost = t.imghost),
            t.hl !== undefined &&
              'undefined' !== t.hl &&
              ((ft.language = t.hl), ue.setLocale(t.hl)),
            t.tplinks !== undefined && 'undefined' !== t.tplinks && (ft.tplinks = t.tplinks),
            t.pat !== undefined && 'undefined' !== t.pat && (ft.pat = t.pat),
            t.pstissuer !== undefined &&
              'undefined' !== t.pstissuer &&
              (ft.pstIssuer = t.pstissuer),
            (ft.theme = t.theme || ft.theme),
            (ft.themeConfig = t.themeConfig),
            ft.themeConfig && (t.custom = !0)
        })(i)
        var o = setTimeout(function () {
          Et('Slow iframe initialization', 'error', 'frame:checkbox', {
            readyState: document.readyState,
          })
        }, 6e4)
        window.addEventListener('load', function () {
          o && (clearTimeout(o), (o = null)), St('iframe:load', 'checkbox', 'info')
        }),
          document.addEventListener('DOMContentLoaded', function () {
            St('iframe:DOMContentLoaded', 'checkbox', 'info')
          }),
          document.addEventListener('readystatechange', function () {
            St('iframe:readystatechange', 'checkbox', 'info', { readyState: document.readyState })
          })
        var r = Io.sitekey(ht.sitekey),
          s = Io.dummykey(ht.sitekey)
        rr.run()
        var a = null,
          c = null,
          l = new Promise(function (t) {
            c = t
          }),
          h = null
        function u(e, i) {
          var n = {
              host: ht.host,
              sitekey: ht.sitekey,
              size: ft.size,
              theme: ft.theme,
              mode: ft.mode,
              linksOff: 'off' === ft.tplinks,
              displayLogo: 'invisible' !== ft.size,
              logo: null,
              logoUrl: null,
              privacyUrl: null,
              termsUrl: null,
            },
            o = e && e.custom
          if (o) {
            Io.logo(o.logo) && (n.logo = o.logo),
              o.links &&
                ((n.logoUrl = o.links.logo),
                (n.privacyUrl = o.links.privacy),
                (n.termsUrl = o.links.terms))
            var a = o.copy
            if (a) {
              var c = {
                checkbox_prompt: 'I am human',
                checkbox_a11y:
                  "hCaptcha checkbox with text 'I am human'. Select in order to trigger the challenge, or to bypass it if you have an accessibility cookie.",
              }
              for (var h in c) {
                var u = a[h]
                for (var f in u) {
                  var d = {}
                  ;(d[c[h]] = u[f]), ue.addTable(f, d)
                }
              }
              l.then(function (t) {
                t.translate()
              })
            }
          }
          var p = new Lr(document.body, n),
            m = e && e.features && e.features.custom_theme
          return (
            ft.themeConfig && m ? p.theme('custom', ft.themeConfig) : p.theme(ft.theme),
            p.setStatus(!1),
            r || s
              ? s &&
                p.setWarning(
                  'This hCaptcha is for testing only. Please contact the site admin if you see this.',
                )
              : p.setWarning(
                  'The sitekey for this hCaptcha is incorrect. Please contact the site admin if you see this.',
                ),
            p.on('select', function (e) {
              p.setStatus(!1),
                setTimeout(function () {
                  i.send('checkbox-selected', {
                    manifest: Je.getData(),
                    charity: t,
                    a11yChallenge: ft.a11yChallenge || !1,
                    link: p.getLogoUrl(),
                    action: e,
                    errors: rr.collect(),
                  })
                }, 1)
            }),
            p
          )
        }
        new Promise(function (t) {
          h = t
        })
          .then(function (t) {
            if ('ok' in t) return t.ok
            throw t.err
          })
          .then(
            function (e) {
              a || ((a = u(e, n)), c(a))
              var i = e.features || {}
              ;(ft.a11yChallenge = i.a11y_challenge || !1),
                (t = e.charity || !1),
                e.status_message && r && !s && a.setWarning(e.status_message)
            },
            function (t) {
              a || ((a = u(null, n)), c(a)), t.message && a.setStatus(t.message)
            },
          )
          .then(function () {
            Je.resetData(), Je.record(!0, !0, !0, !1), n.send('checkbox-loaded', a.getLocation())
          }),
          (function (t, e, i) {
            i.listen('site-setup', e),
              i.listen('checkbox-tick', function () {
                t.then(function (t) {
                  t.tick()
                })
              }),
              i.listen('checkbox-translate', function (e) {
                try {
                  if (!e || !e.locale || !e.table) return
                  ue.setLocale(e.locale),
                    ue.addTable(e.locale, e.table),
                    t.then(function (t) {
                      t.translate()
                    }),
                    document.documentElement.setAttribute('lang', ue.getLocale())
                } catch (Qr) {
                  At('translation', Qr)
                }
              }),
              i.listen('checkbox-status', function (e) {
                t.then(function (t) {
                  t.setStatus(e.text, e.a11yOnly)
                })
              }),
              i.listen('checkbox-reset', function () {
                t.then(function (t) {
                  t.reset(), Je.resetData(), Je.record()
                })
              }),
              i.listen('checkbox-clear', function () {
                t.then(function (t) {
                  t.setLoading(!1)
                })
              }),
              i.listen('checkbox-location', function (e) {
                t.then(function (t) {
                  var i = t.getLocation()
                  e.resolve(i)
                })
              })
          })(l, h, n),
          n.send('checkbox-ready'),
          i.custom || ((a = u(null, n)), c(a))
      })()
    : (function (t) {
        ht.file = 'hcaptcha'
        var e = document.currentScript,
          i = !1,
          n = !1,
          o = 'on',
          r = tt.Browser.width() / tt.Browser.height(),
          s = !(!window.hcaptcha || !window.hcaptcha.render)
        function a() {
          var t = tt.Browser.width(),
            e = tt.Browser.height(),
            i = tt.System.mobile && r !== t / e
          ;(r = t / e),
            h(),
            Yr.nodes.each(function (n) {
              n.visible && n.resize(t, e, i)
            })
        }
        function c(t) {
          l(),
            Yr.nodes.each(function (t) {
              t.visible && t.position()
            })
        }
        function l() {
          Je.circBuffPush('xy', [
            tt.Browser.scrollX(),
            tt.Browser.scrollY(),
            document.documentElement.clientWidth / tt.Browser.width(),
            Date.now(),
          ])
        }
        function h() {
          Je.circBuffPush('wn', [
            tt.Browser.width(),
            tt.Browser.height(),
            tt.System.dpr(),
            Date.now(),
          ])
        }
        ;(window.hcaptcha = {
          render: function () {
            return (
              s ||
                console.warn(
                  '[hCaptcha] should not render before js api is fully loaded. `render=explicit` should be used in combination with `onload`.',
                ),
              Yr.render.apply(this, arguments)
            )
          },
          remove: Yr.remove,
          execute: Yr.execute,
          reset: Yr.reset,
          close: Yr.close,
          setData: Yr.setData,
          getResponse: Yr.getResponse,
          getRespKey: Yr.getRespKey,
        }),
          rr.run(3e3),
          He(function () {
            var r
            s ||
              ((function () {
                var r
                r = e ? [e] : document.getElementsByTagName('script')
                for (var s = -1, a = !1, c = null, l = null; ++s < r.length && !1 === a; ) {
                  r[s] &&
                    r[s].src &&
                    ((l = (c = r[s].src.split('?'))[0]),
                    /\/(hcaptcha|1\/api)\.js$/.test(l) &&
                      ((a = r[s]),
                      l &&
                        -1 !== l.toLowerCase().indexOf('www.') &&
                        console.warn(
                          '[hCaptcha] JS API is being loaded from www.hcaptcha.com. Please use https://js.hcaptcha.com/1/api.js',
                        )))
                }
                !1 !== a &&
                  ((t = t || Rt(c[1])),
                  (i = t.onload || !1),
                  (n = t.render || !1),
                  'off' === t.tplinks && (o = 'off'),
                  (ft.tplinks = o),
                  (ft.language = t.hl || null),
                  t.endpoint && (ft.endpoint = t.endpoint),
                  (ft.reportapi = t.reportapi || ft.reportapi),
                  (ft.imghost = t.imghost || null),
                  (ft.custom = t.custom || ft.custom),
                  (ft.se = t.se || null),
                  (ft.pat = t.pat || ft.pat),
                  (ft.pstIssuer = t.pstissuer || ft.pstIssuer),
                  (ft.orientation = t.orientation || null),
                  (ft.assethost = t.assethost || null),
                  ft.assethost &&
                    !Zt.URL(ft.assethost) &&
                    ((ft.assethost = null), console.error('Invalid assethost uri.')),
                  (ft.recaptchacompat = t.recaptchacompat || ft.recaptchacompat),
                  (ht.host = t.host || window.location.hostname),
                  (ft.sentry = !1 !== t.sentry),
                  _t(!1),
                  (ft.language =
                    ft.language || window.navigator.userLanguage || window.navigator.language),
                  ue.setLocale(ft.language),
                  'off' === ft.recaptchacompat
                    ? console.log('recaptchacompat disabled')
                    : (window.grecaptcha = window.hcaptcha))
              })(),
              'en' !== (r = ue.getLocale()) &&
                Ro(r)
                  .then(function () {
                    Yr.nodes.each(function (t) {
                      if (t) {
                        try {
                          t.isLangSet() || t.updateTranslation(r)
                        } catch (Qr) {
                          At('translation', Qr)
                        }
                      }
                    })
                  })
                  ['catch'](function (t) {
                    At('api', t, { locale: r })
                  }),
              !1 === n || 'onload' === n
                ? gt(Yr.render)
                : 'explicit' !== n &&
                  console.log(
                    "hcaptcha: invalid render parameter '" + n + "', using 'explicit' instead.",
                  ),
              (s = !0),
              i &&
                setTimeout(function () {
                  Nt(i)
                }, 1),
              (function () {
                try {
                  Je.record(),
                    Je.setData('sc', tt.Browser.getScreenDimensions()),
                    Je.setData('wi', tt.Browser.getWindowDimensions()),
                    Je.setData('nv', tt.Browser.interrogateNavigator()),
                    Je.setData('dr', document.referrer),
                    h(),
                    l()
                } catch (Qr) {}
              })(),
              Ve.addEventListener('resize', a),
              Ve.addEventListener('scroll', c))
          })
      })()
})()
