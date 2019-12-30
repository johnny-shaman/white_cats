((apex) => {
  'use strict';
  let _ = function (x, y, c) {
    return _.upto(
      x == null
      ? _.prototype
      : _['#'][
        x.constructor.constructor.name === 'GeneratorFunction'
        ? '*'
        : _['#'][x.constructor.name] == null ? 'Object' : x.constructor.name
      ],
      {
        _: {
          configurable: true,
          get () {
            return x;
          }
        },
        $: {
          configurable: true,
          get () {
            return y;
          }
        },
        '@': {
          configurable: true,
          get () {
            return c;
          }
        }
      }
    );
  };

  Object.assign(_, {
    WhiteCats: '0.1.14',
    '#': (
      ['Object', 'String', '*', 'Promise']
      .reduce((p, c) => Object.assign(p, {[c]: Object.create(_.prototype)}), {})
    ),
    id: v => v,
    pipe: (...m) => m.reduceRight((f, g) => (...v) => {
      try {
        return (v.unshift(g(...v)), f(...v));
      } catch (e) {
        console.error(e);
        return v;
      }
    }, _.id),
    loop: (...m) => m.reduceRight((f, g) => (...v) => {
      try {
        return (v.push(g(...v)), f(...v));
      } catch (e) {
        console.error(e);
        return v[0];
      }
    }, _.id),
    apply: a => f => f(...a),
    lazy: f => a => f(...a),
    alter: (...a) => a.pop(),
    upto: Object.create,
    put: Object.assign,
    set: (...o) => p => _.put(p, ...o),
    define: Object.defineProperty,
    defines: Object.defineProperties,
    keys: Object.keys,
    vals: Object.values,
    entries: Object.entries,
    equal: Object.is,
    owns: o => Object.getOwnPropertyNames(o).concat(Object.getOwnPropertySymbols(o)),
    descripting: Object.getOwnPropertyDescriptors,
    adaptL: (...b) => a => [...a].map(v => v == null ? b.shift() : v),
    adaptR: (...b) => a => _.adapt(...b)(a.reverse()).reverse(),
    less: a => a.filter(v => v != null),
    sure: a => [...a],
    by: o => o == null ? undefined : o.constructor,
    isObject: o => o instanceof Object,
    isArray: o => o instanceof Array,
    _: function *(a, b, s = 1) {
      let f = true;
      b == null && (b = a, a = 0);
      while (f) {
        switch (true) {
          case a < b : {
            yield a;
            f = (a += Math.abs(s)) < b;
            break;
          }
          case a > b : {
            yield a;
            f = (a -= Math.abs(s)) > b;
            break;
          }
        }
      }
      yield a > b ? b : a;
    },
    async: f => new Promise(f),
    asyncAll: (...a) => Promise.all(a),
    give: o => p => (_.entries(o).reduce(
      (q, [k, v]) => _.isObject(v) && _.isObject(q[k]) ? (_.give(v)(q[k]), q) : _.put(q, {[k]: v}), p
    ), p),
    take: p => o => (_.entries(o).reduce(
      (q, [k, v]) => _.isObject(v) && _.isObject(q[k]) ? (_.give(v)(q[k]), q) : _.put(q, {[k]: v}), p
    ), p),
    xS: /\s+/g,
    xComma: /,+/g,
    xCs: /[\s|,]+/g,
    xQBsplit: /[[|,|\]]/g,
    xQBmatch: /[$|.|\w]+\[+[$|.|\w|,]+\]/g
  });

  Object.assign(_, {
    adapt: _.adaptL,
    Q: _.pipe(
      s => s.replace(_.xS, ''),
      s => ({s, r: s.match(_.xQBmatch) || []}),
      o => o.r.reduce(
        (p, c) => _.put(p, {
          s: o.s.replace(c, c.split(_.xQBsplit)
          .filter(v => v.length > 0)
          .reduce(
            (p, c, k) => k === 0 ? _.put(p, {c}) : (p.push(`${p.c}.${c}`), p),
            []
          )
          .join(','))
        }),
        o
      ).s,
      s => s.includes('[') ? _.Q(s) : s.split(_.xComma)
    ),
    MyPrime: 57
  });

  _.defines(_.prototype, {
    $_: {
      configurable: true,
      get () {
        return this.$ == null ? this._ : this.$;
      }
    },
    _$: {
      configurable: true,
      get () {
        return this._ == null ? this.$ : this._;
      }
    },
    flat: {
      configurable: true,
      value (f) {
        return _(
          _.pipe(f)(this._)._,
          this.$_,
          this['@']
        );
      }
    },
    pipe: {
      configurable: true,
      value (...f) {
        return _(_.pipe(...f)(this._), this.$_, this['@']);
      }
    },
    loop: {
      configurable: true,
      value (...f) {
        return _(_.loop(...f)(this._), this.$_, this['@']);
      }
    },
    done: {
      configurable: true,
      value () {
        return this;
      }
    },
    call: {
      configurable: true,
      value (s) {
        return (...v) => this
        .pipe(
          o => s
          .split('.')
          .reduce(
            (p, c) => (p == null || p[c] == null)
            ? undefined
            : (
              typeof p[c] === 'function'
              ? p[c].call(p, ...v)
              : p[c]
            )
            , o
          )
        );
      }
    },
    s_r: {
      configurable: true,
      value (s) {
        return (...v) => (...f) => this
        .loop(
          o => s
          .split('.')
          .reduce(
            (p, c) => (p == null || p[c] == null)
            ? undefined
            : (
              typeof p[c] === 'function'
              ? _.pipe(...f)(p[c].call(p, ...v))
              : _.pipe(...f)(p[c], ...v)
            )
            , o
          )
        );
      }
    },
    cast: {
      configurable: true,
      value (s) {
        return (...v) => this.s_r(s)(...v)();
      }
    },
    Been: {
      configurable: true,
      get () {
        return new Proxy(this, {
          get (t, k) {
            return k === 'To'
            ? t
            : (...v) => (...f) => (
              typeof t._[k] === 'function'
              ? t.s_r(k)(...v)(...f)
              : t.modify(k)(...v)(...f)
            ).Been;
          }
        });
      }
    },
    re: {
      configurable: true,
      get () {
        return _(this.$_, this._$, this['@']);
      }
    },
    to: {
      configurable: true,
      value () {
        return this;
      }
    },
    of: {
      configurable: true,
      value () {
        return this;
      }
    },
    toJSON: {
      configurable: true,
      get () {
        return this.pipe(JSON.stringify);
      }
    },
    toObject: {
      configurable: true,
      get () {
        return this;
      }
    }
  });

  _.defines(_['#'].Promise, {
    then: {
      configurable: true,
      value (...m) {
        return this.loop(p => m.map(f => p.then(f)));
      }
    }
  });

  _.defines(_['#']['*'], {
    take: {
      configurable: true,
      value (v) {
        return this.pipe(i => [...Array(v)].map(() => i.next().value));
      }
    }
  });

  _.defines(_['#'].Object, {
    filter: {
      configurable: true,
      value (f) {
        return this.pipe(
          _.entries,
          a => a.reduce(
            (p, [k, v]) => f(v, k) ? _.put(p, {[k]: v}) : p,
            {}
          )
        );
      }
    },
    each: {
      configurable: true,
      value (...f) {
        return this.loop(
          o => _.entries(o).forEach(([k, v]) => _.loop(...f)(k, v))
        );
      }
    },
    map: {
      configurable: true,
      value (...f) {
        return this.pipe(
          o => _.entries(o).reduce((p, [k, v]) => _.put(p, {[k]: _.pipe(...f)(v, k)}), {})
        );
      }
    },
    get: {
      configurable: true,
      value (...s) {
        return this.pipe(
          o => s.flatMap(s => s.split('.')).reduce((p, c) => p == null ? undefined : p[c], o)
        );
      }
    },
    set: {
      configurable: true,
      value (...s) {
        return v => this.loop(
            o => _(s).pipe(
            a => a.flatMap(s => s.split('.')),
            a => ({a, l: a.pop()}),
            ({a, l}) => a.reduce((p, c) => _.isObject(p[c]) ? p[c] : _.put(p, {[c]: {}})[c], o)[l] = v
          )
        );
      }
    },
    put: {
      configurable: true,
      value (...o) {
        return this.pipe(_.set(...o));
      }
    },
    cut: {
      configurable: true,
      value (...s) {
        return this.loop(
          o => _(s).pipe(
            a => a.flatMap(s => s.split('.')),
            a => ({a, l: a.pop()}),
            ({a, l}) => delete a.reduce((p, c) => (p == null || p[c] == null) ? {} : p[c], o)[l]
          )
        );
      }
    },
    mend: {
      configurable: true,
      value (...s) {
        return (...f) => this.modify(...s)()(...f);
      }
    },
    modify: {
      configurable: true,
      value (...s) {
        return (...v) => (...f) => this.set(...s)(
          this.get(...s)
          .pipe(p => _.pipe(...f)(p, ...v))
          ._
        );
      }
    },
    give: {
      configurable: true,
      value (...o) {
        return this.pipe(...(o.map(_.take)));
      }
    },
    take: {
      configurable: true,
      value (...o) {
        return this.loop(...(o.map(_.give)));
      }
    },
    define: {
      configurable: true,
      value (o) {
        return this.pipe(p => _.defines(p, o));
      }
    },
    depend: {
      configurable: true,
      value (o = {}) {
        return this.pipe(p => _.upto(o, p));
      }
    },
    append: {
      configurable: true,
      value (o = {}) {
        return this.pipe(p => _.upto(p, o));
      }
    },
    pick: {
      configurable: true,
      value (s) {
        return this.pipe(
          t => _.Q(s).reduce((o, w) => o.set(w)(_(t).get(w)._), _({}))._
        );
      }
    },
    drop: {
      configurable: true,
      value (s) {
        return this.pipe(
          t => _.Q(s).reduce((o, w) => o.cut(w), _({}).put(t))._
        );
      }
    },
    keys: {
      configurable: true,
      get () {
        return this.pipe(_.keys);
      }
    },
    vals: {
      configurable: true,
      get () {
        return this.pipe(_.vals);
      }
    },
    entries: {
      configurable: true,
      get () {
        return this.pipe(_.entries);
      }
    },
    fullen: {
      configurable: true,
      get () {
        return this.pipe(o => !(_.vals(o).includes(undefined) || _.vals(o).includes(null)));
      }
    },
    toDate: {
      configurable: true,
      get () {
        return this.pipe(
          ({
            yr = 1970,
            mo = 1,
            dt = 1,
            hr = 0,
            min = _.zone,
            sec = 0,
            ms = 0
          }) => new Date(yr, mo - 1, dt, hr, min, sec, ms)
        );
      }
    },
    toDateUTC: {
      configurable: true,
      get () {
        return this.pipe(
          ({
            yrUTC = 1970,
            moUTC = 1,
            dtUTC = 1,
            hrUTC = 0,
            minUTC = 0,
            secUTC = 0,
          }) => _(new Date(0))
          .put({yrUTC, moUTC: moUTC, dtUTC, hrUTC, minUTC, secUTC})._
        );
      }
    }
  });

  _.put(_['#'], {
    Function: _.upto(_['#'].Object, {
      delegate: {
        configurable: true,
        value (s) {
          return this.set('prototype')(_.upto(s.prototype, {
            constructor: {
              configurable: true,
              writable: true,
              enumerable: false,
              value: this._
            }
          }));
        }
      },
      prepends: {
        configurable: true,
        value (o) {
          return this.loop(c => _.put(c.prototype, o));
        }
      },
      implements: {
        configurable: true,
        value (o) {
          return this.loop(c => _.defines(c.prototype, o));
        }
      },
      done: {
        configurable: true,
        value (...v) {
          return this.pipe(_.apply(v));
        }
      },
      take: {
        configurable: true,
        value (v) {
          return _(v, this.$_, this._);
        }
      },
      each: {
        configurable: true,
        value (...v) {
          return this.pipe(v.map.bind(v));
        }
      }
    })
  });

  _.put(_['#'], {
    Array: _.upto(_['#'].Object, {
      liken: {
        configurable: true,
        value (a) {
          return this.pick(...a);
        }
      },
      equaly: {
        configurable: true,
        value (a) {
          return this.pipe(a => [...a]).filter((v, k) => a[k] === v);
        }
      },
      toggle: {
        configurable: true,
        value (...d) {
          return this.pipe(
            s => ({
              s: s.filter(v => !d.includes(v)),
              d: d.filter(v => !s.includes(v))
            }),
            ({s, d}) => s.concat(d)
          );
        }
      },
      pick: {
        configurable: true,
        value (...a) {
          return this.filter(v => a.includes(v));
        }
      },
      drop: {
        configurable: true,
        value (...a) {
          return this.filter(v => !a.includes(v));
        }
      },
      chunk: {
        configurable: true,
        value (n) {
          return this.pipe(a => a.length == 0 ? [] : [a.slice( 0, n )].concat(_(a).slice(n).chunk(n)._));
        }
      },
      unique: {
        configurable: true,
        get () {
          return this.pipe(a => [...new Set(a)]);
        }
      },
      union: {
        configurable: true,
        value (...b) {
          return this.pipe(a => [...new Set(a.concat(...b))]);
        }
      },
      put: {
        configurable: true,
        value (a) {
          return this.map((v, k) => a[k] == null ? v : a[k]);
        }
      },
      exist: {
        configurable: true,
        get () {
          return this.call('includes');
        }
      },
      pickKey: {
        configurable: true,
        value (s) {
          return this.map(o => _(o).pick(s)._);
        }
      },
      dropKey: {
        configurable: true,
        value (s) {
          return this.map(o => _(o).drop(s)._);
        }
      },
      pushL: {
        configurable: true,
        get () {
          return this.cast('unshift');
        }
      },
      pushR: {
        configurable: true,
        get () {
          return this.cast('push');
        }
      },
      popL: {
        configurable: true,
        get () {
          return this.call('shift')();
        }
      },
      popR: {
        configurable: true,
        get () {
          return this.call('pop')();
        }
      },
      omitL: {
        configurable: true,
        get () {
          return this.cast('shift')();
        }
      },
      omitR: {
        configurable: true,
        get () {
          return this.cast('pop')();
        }
      },
      each: {
        configurable: true,
        value (...f) {
          return this.cast('forEach')(_.pipe(...f));
        }
      },
      lift: {
        configurable: true,
        value (...f) {
          return this.pipe(...f);
        }
      },
      fold: {
        configurable: true,
        get () {
          return this.foldL;
        }
      },
      foldL: {
        configurable: true,
        get () {
          return this.call('reduce');
        }
      },
      foldR: {
        configurable: true,
        get () {
          return this.call('reduceRight');
        }
      },
      filter: {
        configurable: true,
        get () {
          return this.call('filter');
        }
      },
      rotate: {
        get () {
          return this.pipe(a => _.keys(a[0]).map(c => a.map(r => r[c])));
        }
      },
      aMap: {
        configurable: true,
        value (a) {
          return this.map(f => a.map(g => typeof f === 'function' ? f(g) : g(f)));
        }
      },
      map: {
        configurable: true,
        value (...f) {
          return this.call('map')(_.pipe(...f));
        }
      },
      fMap: {
        configurable: true,
        value (...f) {
          return this.call('flatMap')(_.pipe(...f));
        }
      },
      flatten: {
        configurable: true,
        get () {
          return this.call('flat');
        }
      },
      back: {
        configurable: true,
        get () {
          return this.call('reverse')();
        }
      },
      adapt: {
        configurable: true,
        get () {
          return this.adaptL;
        }
      },
      adaptL: {
        configurable: true,
        value (...v) {
          return this.pipe(_.adaptL(...v));
        }
      },
      adaptR: {
        configurable: true,
        value (...v) {
          return this.pipe(_.adaptR(...v));
        }
      },
      concat: {
        configurable: true,
        get () {
          return this.call('concat');
        }
      },
      replace: {
        configurable: true,
        get () {
          return this.cast('splice');
        }
      },
      splice: {
        configurable: true,
        get () {
          return this.call('splice');
        }
      },
      slice: {
        configurable: true,
        get () {
          return this.call('slice');
        }
      },
      sort: {
        configurable: true,
        get () {
          return this.pipe(_.sure).call('sort');
        }
      },
      indexL: {
        configurable: true,
        get () {
          return this.call('indexOf');
        }
      },
      indexR: {
        configurable: true,
        get () {
          return this.call('lastIndexOf');
        }
      },
      any: {
        configurable: true,
        get () {
          return this.call('some');
        }
      },
      all: {
        configurable: true,
        get () {
          return this.call('every');
        }
      },
      apply: {
        configurable: true,
        value (f) {
          return this.pipe(_.lazy(f));
        }
      },
      sum: {
        configurable: true,
        get () {
          return this.fold((p, c) => p + c);
        }
      },
      pi: {
        configurable: true,
        get () {
          return this.fold((p, c) => p * c);
        }
      },
      average: {
        configurable: true,
        get () {
          return this.pipe(a => a.reduce((p, c) => p + c) / a.length);
        }
      },
      max: {
        configurable: true,
        get () {
          return this.apply(Math.max);
        }
      },
      min: {
        configurable: true,
        get () {
          return this.apply(Math.min);
        }
      },
      mid: {
        configurable: true,
        get () {
          return this.sort((v, w) => v < w).pipe(
            a => (
              a.length === 0
              ? undefined
              : (
                a.length % 2 === 0
                ? (a[a.length / 2 - 1] + a[a.length / 2]) / 2
                : a[a.length / 2 - 0.5]
              )
            )
          );
        }
      },
      less: {
        configurable: true,
        get () {
          return this.vals;
        }
      },
      sure: {
        configurable: true,
        get () {
          return this.pipe(_.sure);
        }
      },
      fullen: {
        configurable: true,
        get () {
          return this.pipe(a => !([...a].includes(undefined) || [...a].includes(null)));
        }
      },
      pair: {
        configurable: true,
        value (...v) {
          return this.fold((p, c, k) => _.put(p, {[v[k]]: c}), {});
        }
      },
      to: {
        configurable: true,
        value (...w) {
          return this['@'] ? this.pipe(
            _.adaptL(...w),
            a => _((_(a).fullen._ && this['@']) ? this['@'](...a) : a,
              this.$,
              _(a).fullen._ ? null : this['@']
            )
          )._ : this;
        }
      },
      of: {
        configurable: true,
        value (...w) {
          return this['@'] ? this.pipe(
            _.adaptR(...w),
            a => _((_(a).fullen._ && this['@']) ? this['@'](...a) : a,
              this.$,
              _(a).fullen._ ? null : this['@']
            )
          )._ : this;
        }
      }
    })
  });

  _.defines(_['#'].String, {
    toObject: {
      configurable: true,
      get () {
        return this.pipe(s => {try {return JSON.parse(s)} catch (e) {return s}});
      }
    },
    toDate: {
      configurable: true,
      get () {
        return this.pipe(
          _,
          t => t.pipe(
            s => new Date(s),
            d => isNaN(d.getFullYear())
            ? t.toObject.toDate._
            : d
          )._
        );
      }
    },
    toDateUTC: {
      get () {
        return this.pipe(s => _(JSON.parse(s)).toDateUTC._);
      }
    }
  });

  Object.assign(_, {
    zone : _(new Date(0)).pipe(
      d => d.getDate === 31
      ? -(d.getHours() * 60 + d.getMinutes())
      : d.getHours() * 60 + d.getMinutes())._
  });

  _.put(_['#'], {
    Date: _.upto(_['#'].Object, {
      get: {
        configurable: true,
        value (s) {
          return this.pipe(
            d => _({
              yr:     d.getFullYear(),
              mo:     d.getMonth() + 1,
              dt:     d.getDate(),
              dy:     d.getDay(),
              hr:     d.getHours(),
              min:    d.getMinutes(),
              sec:    d.getSeconds(),
              ms:     d.getMilliseconds(),
              yrUTC:  d.getUTCFullYear(),
              moUTC:  d.getUTCMonth() + 1,
              dtUTC:  d.getUTCDate(),
              dyUTC:  d.getUTCDay(),
              hrUTC:  d.getUTCHours(),
              minUTC: d.getUTCMinutes(),
              secUTC: d.getUTCSeconds()
            }),
            o => s.includes(',') ? o.pick(s)._ : o.get(s)._
          );
        }
      },
      put: {
        configurable: true,
        value (o) {
          return this.loop(
            _.pipe(
              d => ({
                yr:     v => d.setFullYear(v),
                mo:     v => d.setMonth(v - 1),
                dt:     v => d.setDate(v),
                hr:     v => d.setHours(v),
                min:    v => d.setMinutes(v),
                sec:    v => d.setSeconds(v),
                ms:     v => d.setMilliseconds(v),
                yrUTC:  v => d.setUTCFullYear(v),
                moUTC:  v => d.setUTCMonth(v - 1),
                dtUTC:  v => d.setUTCDate(v),
                hrUTC:  v => d.setUTCHours(v),
                minUTC: v => d.setUTCMinutes(v),
                secUTC: v => d.setUTCSeconds(v)
              }),
              p => _.entries(o).forEach(([k, v]) => p[k](v))
            )
          );
        }
      },
      map: {
        configurable: true,
        value (s) {
          return (...f) => this.put(
            this.get(s).pipe(
              ...f,
              o => s.includes(',')
              ? o
              : {[s]: o}
            )._
          );
        }
      },
      endOfMo: {
        configurable: true,
        get () {
          return this
          .put({dt: 1})
          .map('mo, dt')(
            ({mo, dt}) => ({mo: mo + 1, dt: dt - 1})
          );
        }
      },
      endOfMoUTC: {
        configurable: true,
        get () {
          return this
          .put({dtUTC: 1})
          .map('moUTC, dtUTC')(
            ({moUTC, dtUTC}) => ({moUTC: moUTC + 1, dtUTC: dtUTC - 1})
          );
        }
      },
      zone: {
        configurable: true,
        get () {
          return this.pipe(o => o.getTimezoneOffset());
        }
      },
      raw: {
        configurable: true,
        get () {
          return this.pipe(o => o.getTime());
        }
      },
      ISO: {
        configurable: true,
        get () {
          return this.pipe(o => o.toISOString());
        }
      },
      UTC: {
        configurable: true,
        get () {
          return this.pipe(o => o.toUTCString());
        }
      },
      toObject: {
        configurable: true,
        get () {
          return this.get('yr, mo, dt, dy, hr, min, sec, ms');
        }
      },
      toObjectUTC: {
        configurable: true,
        get () {
          return this.get('yrUTC, moUTC, dtUTC, dyUTC, hrUTC, minUTC, secUTC');
        }
      },
      toJSON: {
        configurable: true,
        get () {
          return this.toObject.toJSON;
        }
      },
      toJSONUTC: {
        configurable: true,
        get () {
          return this.toObjectUTC.toJSON;
        }
      }
    })
  });
  'process' in apex ? (module.exports = _) : (apex._ = _);
})((this || 0).self || global);
