((apex) => {
  'use strict';
  const Generator = (function*(){}).constructor;
  let _ = function (x, y, c) {
    return _.upto(
      x == null
      ? _.prototype
      : _['#'][
        x instanceof Generator
        ? 'Generator'
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
        },
      }
    );
  };

  Object.assign(_, {
    '#': (
      ['Object', 'String', 'Number', 'Boolean', 'Generator', 'Promise']
      .reduce((p, c) => Object.assign(p, {[c]: Object.create(_.prototype)}), {})
    ),
    version: '0.0.1',
    id: v => v,
    pipe: (...m) => m.reduceRight((f, g, k) => (...v) => {
      try {
        return v[0] == null ? undefined : (v.unshift(g(...v)), f(...v));
      } catch (e) {
        console.error(e);
        v.push(e);
        return k === (m.length - 1) ? v[0] : v;
      }
    }, _.id),
    loop: (...m) => m.reduceRight((f, g, k) => (...v) => {
      try {
        return v[0] == null ? undefined : (v.push(g(...v)), f(...v));
      } catch (e) {
        console.error(e);
        v.push(e);
        return k === (m.length - 1) ? v[0] : v;
      }
    }, _.id),
    upto: Object.create,
    put: Object.assign,
    define: Object.defineProperty,
    defines: Object.defineProperties,
    entries: Object.entries,
    keys: Object.keys,
    vals: Object.values,
    equal: Object.is,
    owns: o => Object.getOwnPropertyNames(o).concat(Object.getOwnPropertySymbols(o)),
    descripting: Object.getOwnPropertyDescriptors,
    adapt: a => (...b) => [...a].map(v => v == null ? b.shift() : v),
    fullen: a => !(Object.values([...a]).includes(undefined) || Object.values([...a]).includes(null)),
    less: a => a.filter(v => v != null),
    exist: a => a.includes,
    by: o => o == null ? undefined : o.constructor,
    isObject: o => o instanceof Object,
    isArray: o => o instanceof Array,
    _: function* (a, b = 0, s = 1) {
      let f = true;
      while (f) {
        switch (true) {
          case a < b : {
            yield a;
            f = (a += s) < b;
            break;
          }
          case a > b : {
            yield b;
            f = a > (b += s);
            break;
          }
        }
      }
      yield a > b ? b : a;
    },
    async: f => new Promise(t => f(t)),
    Q: t => t
    .trim()
    .replace(/\s+/g, '')
    .match(/(\w|\$|_)+(\.\w|\$|_)*\[((\w|\$|_)+(\.\w|\$|_)*,?)+\]|(\w|\$|_)+(\.\w|\$|_)*/g)
    .map(
      s => s
      .split(/\[|\]|,/g)
      .filter(
        s => s !== ''
      )
      .reduce(
        (p, c) => ((
          p.length
          ? p.push(`${p[0]}.${c}`)
          : p.push(c)
        ), p),
        []
      )
    )
    .flatMap(
      a => (
        a.length === 1
        ? a
        : (a.shift() ,a)
      )
    )
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
    _pipe: {
      configurable: true,
      value (...f) {
        return _(_.pipe(...f)(this._), this.$_, this['@']).pipe(v => v instanceof _ ? v._ : v);
      }
    },
    pipe: {
      configurable: true,
      value (...f) {
        return _(_.pipe(...f)(this._$), this.$_, this['@']);
      }
    },
    loop: {
      configurable: true,
      value (...f) {
        return _(_.loop(...f)(this._$), this.$_, this['@']);
      }
    },
    swap: {
      configurable: true,
      get () {
        return _(this.$, this._, this['@']);
      }
    },
    re: {
      configurable: true,
      get () {
        return _(this.$, null, this['@']);
      }
    },
    done: {
      configurable: true,
      value () {
        return this;
      }
    },
    redo: {
      configurable: true,
      get () {
        return _(this['@'], this.$).done
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
            (p, c) => p[c] == null
            ? p 
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
    cast: {
      configurable: true,
      value (s) {
        return (...v) => this
        .loop(
          o => s
          .split('.')
          .reduce(
            (p, c) => p[c] == null
            ? p 
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
    been: {
      configurable: true,
      get () {
        return new Proxy(this, {
          get (t, k) {
            return k === 'to'
            ? t
            : (
              (...v) => typeof t._[k] === 'function'
              ? t.cast(k)(...v)
              : t.mod(k)(...v)
            ).been;
          }
        });
      }
    },
    toJSON: {
      configurable: true,
      get () {
        return this.pipe(JSON.stringify);
      }
    },
    to: {
      configurable: true,
      get () {
        return this.done;
      }
    },
    at: {
      configurable: true,
      get () {
        return this.done;
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

  _.defines(_['#'].Generator, {
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
            (p, [k, v]) => f({k, v}) ? _.put(p, {[k]: v}) : p,
            {}
          )
        );
      }
    },
    each: {
      configurable: true,
      value (...f) {
        return this.loop(
          o => _.entries(o).forEach(([k, v]) => _.pipe(...f)({k, v}))
        );
      }
    },
    map: {
      configurable: true,
      value (...f) {
        return this.pipe(
          _.entries,
          a => a.reduce(
            (p, [k, v]) => _.put(p, {[k]: _.pipe(...f)(v, k)})
            , {}
          )
        );
      }
    },
    get: {
      configurable: true,
      value (...s) {
        return this.pipe(
          o => s
          .flatMap(w => w.split('.'))
          .reduce((p, c) => p == null ? undefined : p[c], o)
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
            ({a, l}) => a.reduce((p, c) => p[c] == null ? _.put(p, {[c]: {}})[c] : p[c], o)[l] = v
          )
        );
      }
    },
    mod: {
      configurable: true,
      value (...s) {
        return (...f) => this.set(...s)(
          this
          .get(...s)
          .pipe(...f)
          ._
        );
      }
    },
    put: {
      configurable: true,
      value (o) {
        return this.loop(
          p => _(o).entries.map(
            ([k, v]) => _.isObject(v) && _.isObject(p[k]) ? _(p[k]).put(v) : _.put(o, {[k]: v})
          )._
        );
      }
    },
    define: {
      configurable: true,
      value (o) {
        return this.pipe(p => _.defines(p, o));
      }
    },
    append: {
      configurable: true,
      value (o = {}) {
        return this.pipe(p => _.upto(o, p));
      }
    },
    depend: {
      configurable: true,
      value (o = {}) {
        return this.pipe(p => _.upto(p, o));
      }
    },
    pick: {
      configurable: true,
      value (s) {
        return this.pipe(
          () => _.Q(s).reduce((p, w) => p.set(w)(this.get(w)._), _({}))._
        );
      }
    },
    drop: {
      configurable: true,
      value (s) {
        return this.pipe(
          t => _.Q(s).reduce((p, w) => p.set(w)(undefined), _({...t}))._
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
    fullen_: {
      configurable: true,
      get () {
        return this.pipe(_.fullen)._;
      }
    },
    toDate: {
      configurable: true,
      get () {
        return this.pipe(
          ({
            year = 1970,
            month = 1,
            date = 1,
            hour= 9,
            minute = 0,
            seconds = 0
          }) => new Date(year, month - 1, date, hour, minute, seconds)
        );
      }
    }
  });

  _.put(_['#'], {Function: _.upto(_['#'].Object)});
  _.defines(_['#'].Function, {
    deligates: {
      configurable: true,
      value (s) {
        return this.loop(c => _.put(c, {prototype: _.upto(s.prototype, {
          constructor: {
            configurable: true,
            writable: true,
            enumerable: false,
            value: c
          }
        })}));
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
    collect: {
      configurable: true,
      value (...a) {
        return this.pipe(f => f(...a));
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
    },
    done: {
      value (...v) {
        return _(this._, this.$, this._).pipe(f => f(...v));
      }
    }
  });

  _.put(_['#'], {Array: _.upto(_['#'].Object)});
  _.defines(_['#'].Array, {
    liken: {
      configurable: true,
      value (a) {
        return this.drop(...a);
      }
    },
    pick: {
      configurable: true,
      value (...a) {
        return this.filter(
          v => (
            _.isObject(v) 
            ? this
              .filter(_.isObject)
              .map((v, k) => _(v).pick(...a.filter(_.isArray)[k]))
              ._
            : a.includes(v)
          )
        );
      }
    },
    drop: {
      configurable: true,
      value (...a) {
        return this.filter(
          v => (
            _.isObject(v)
            ? this
              .filter(_.isObject)
              .map((v, k) => _(v).drop(a.filter(_.isArray)[k]))
              ._
            : !a.includes(v)
          )
        );
      }
    },
    chunk: {
      configurable: true,
      value (n) {
        return this.pipe(a => a.length == 0 ? [] : [a.slice( 0, n )].concat(a.slice(n).chunk(n)));
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
    exist_: {
      configurable: true,
      value (v) {
        return this._.includes(v);
      }
    },
    pickKey: {
      configurable: true,
      value (...k) {
        return this.fold(
          (p, c) => p.map((d, a) => a.push(c[d]))._,
          k.reduce((o, d) => o.put({[d]: []}), _({}))
        )
      }
    },
    dropKey: {
      configurable: true,
      value (...k) {
        return this.fold(
          (p, c) => p.map((d, a) => a.push(c[d]))._,
          k.reduce((o, d) => o.put({[d]: []}), _({}))
        )
      }
    },
    pushL: {
      configurable: true,
      value (...v) {
        return this.cast('unshift')(...v);
      }
    },
    pushR: {
      configurable: true,
      value (...v) {
        return this.cast('push')(...v);
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
      value (f, ...v) {
        return this.call('reduce')(f, ...v);
      }
    },
    foldR: {
      configurable: true,
      value (f, ...v) {
        return this.call('reduceRight')(f, ...v);
      }
    },
    filter: {
      configurable: true,
      value (f) {
        return this.call('filter')(f);
      }
    },
    aMap: {
      configurable: true,
      value (...v) {
        return this.fMap(f => v.map(g => typeof f === 'function' ? f(g) : g(f)));
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
    flat: {
      configurable: true,
      value (v) {
        return this.call('flat')(v);
      }
    },
    back: {
      configurable: true,
      get () {
        return this.call('reverse')();
      }
    },
    adaptL: {
      configurable: true,
      value (...v) {
        return this.pipe(a => _.adapt(a)(...v));
      }
    },
    adaptR: {
      configurable: true,
      value (...v) {
        return this.pipe(a => _.adapt(a.reverse())(...v).reverse());
      }
    },
    adapt: {
      configurable: true,
      get () {
        return this.adaptL;
      }
    },
    concat: {
      configurable: true,
      value (...v) {
        return this.call('concat')(...v);
      }
    },
    replace: {
      configurable: true,
      valuue (...v) {
        return this.call('splice')(...v);
      }
    },
    slice: {
      configurable: true,
      value (...v) {
        return this.call('slice')(...v);
      }
    },
    sort: {
      configurable: true,
      value (...v) {
        return this.call('sort')(...v);
      }
    },
    indexL_: {
      configurable: true,
      value (...v) {
        return this.call('indexOf')(...v)._;
      }
    },
    indexR_: {
      configurable: true,
      value (...v) {
        return this.call('lastIndexOf')(...v)._;
      }
    },
    some_: {
      configurable: true,
      value (...v) {
        return this.call('some')(...v)._;
      }
    },
    spread: {
      configurable: true,
      value (...f) {
        return this.pipe(a => f(...a));
      }
    },
    sum: {
      configurable: true,
      get () {
        return this.fold((p, c) => p + c, 0);
      }
    },
    average: {
      configurable: true,
      get () {
        return this.fold((p, c) => p + c, 0).endo(n => n / this.$.length);
      }
    },
    max: {
      configurable: true,
      get () {
        return this.spread(Math.max);
      }
    },
    min: {
      configurable: true,
      get () {
        return this.spread(Math.min);
      }
    },
    mid: {
      configurable: true,
      get () {
        return this.sort.pipe(
          a => (
            a.length === 0
            ? null
            : (
              a.length % 2 === 0
              ? (a[a.length / 2 - 1] + a[a.length / 2]) / 2
              : a[a.length / 2 - 0.5]
            )
          )
        );
      }
    },
    refine: {
      configurable: true,
      get () {
        return this.pipe(a => [...a]);
      }
    },
    less: {
      configurable: true,
      get () {
        return this.vals
      }
    },
    fullen_: {
      configurable: true,
      get () {
        return this.pipe(_.fullen)._;
      }
    },
    swap: {
      configurable: true,
      get () {
        return this.pipe(
          a => _([...a[0].keys]).map((_, c) => a.map(r => r[c]))
        );
      }
    },
    to: {
      configurable: true,
      value (...w) {
        return this['@'] ? this.pipe(
          a => _.adapt(a)(...w),
          a => _((_.fullen(a) && this['@']) ? this['@'](...a) : a,
            this.$,
            _.fullen(a) ? null : this['@']
          )
        )._ : this;
      }
    },
    of: {
      configurable: true,
      value (...w) {
        return this['@'] ? this.pipe(
          a => _.adapt(a.reverse())(...w).reverse(),
          a => _((_.fullen(a) && this['@']) ? this['@'](...a) : a,
            this.$,
            _.fullen(a) ? null : this['@']
          )
        )._ : this;
      }
    }
  });

  _.defines(_['#'].Number, {
    order: {
      configurable: true,
      get () {
        return this.pipe(v => [..._._(0, v)]);
      }
    },
    fact: {
      configurable: true,
      get () {
        this.order.fold((p, c) => p * c);
      }
    },
    semiFact: {
      configurable: true,
      get () {
        this.order.filter(v => this._ % 2 === 1 ? v % 2 === 1 : v % 2 === 0).fold((p, c) => p * c);
      }
    },
    abs: {
      configurable: true,
      get () {
        return this.pipe(Math.abs);
      }
    }
  });

  _.defines(_['#'].String, {
    toObject: {
      configurable: true,
      get () {
        return this.pipe(JSON.parse);
      }
    },
    toDate: {
      configurable: true,
      get () {
        return this.pipe(
          s => new Date(s),
          d => typeof d === 'string'
          ? _(JSON.parse(d)).toObject.toDate._
          : d
        );
      }
    }
  });

  _.put(_['#'], {Date: _.upto(_['#'].Object)});
  _.defines(_['#'].Date, {
    year: {
      configurable: true,
      get () {
        return this.pipe(o => o.getFullYear());
      }
    },
    month: {
      configurable: true,
      get () {
        return this.pipe(o => o.getMonth() + 1);        
      }
    },
    date: {
      configurable: true,
      get () {
        return this.pipe(o => o.getDate());
      }
    },
    day: {
      configurable: true,
      get () {
        return this.pipe(o => o.getDay());
      }
    },
    hour: {
      configurable: true,
      get () {
        return this.pipe(o => o.getHours());
      }
    },
    minute: {
      configurable: true,
      get () {
        return this.pipe(o => o.getMinutes());
      }
    },
    seconds: {
      configurable: true,
      get () {
        return this.pipe(o => o.getSeconds());
      }
    },
    millis: {
      get () {
        return this.pipe(o => o.getMilliseconds());
      }
    },
    modYear: {
      configurable: true,
      value (f) {
        return this.pipe(o => o.setFullYear(f(o.getFullYear())));
      }
    },
    modMonth: {
      configurable: true,
      value (f) {
        return this.pipe(o => o.setMonth(f(o.getMonth() + 1) - 1));
      }
    },
    modDate: {
      configurable: true,
      value (f) {
        return this.pipe(o => o.setDate(f(o.getDate())));
      }
    },
    modHour: {
      configurable: true,
      value (f) {
        return this.pipe(o => o.setHours(f(o.getHours())));
      }
    },
    modMinute: {
      configurable: true,
      value (f) {
        return this.pipe(o => o.setMinutes(f(o.getMinutes())));
      }
    },
    modSeconds: {
      configurable: true,
      value (f) {
        return this.pipe(o => o.setSeconds(f(o.getSeconds())));
      }
    },
    modMillis: {
      configurable: true,
      value (f) {
        return this.pipe(o => o.setMilliseconds(f(o.getMilliseconds())));
      }
    },
    UTCYear: {
      configurable: true,
      get () {
        return this.pipe(o => o.getUTCFullYear());
      }
    },
    UTCMonth: {
      configurable: true,
      get () {
        return this.pipe(o => o.getUTCMonth() + 1);        
      }
    },
    UTCDate: {
      configurable: true,
      get () {
        return this.pipe(o => o.getUTCDate());
      }
    },
    UTCDay: {
      configurable: true,
      get () {
        return this.pipe(o => o.getUTCDay());
      }
    },
    UTCHour: {
      configurable: true,
      get () {
        return this.pipe(o => o.getUTCHours());
      }
    },
    UTCMinute: {
      configurable: true,
      get () {
        return this.pipe(o => o.getUTCMinutes());
      }
    },
    UTCSeconds: {
      configurable: true,
      get () {
        return this.pipe(o => o.getUTCSeconds());
      }
    },
    modUTCYear: {
      configurable: true,
      value (f) {
        return this.pipe(o => o.setUTCFullYear(f(o.getUTCFullYear())));
      }
    },
    modUTCMonth: {
      configurable: true,
      value (f) {
        return this.pipe(o => o.setUTCMonth(f(getUTCMonth() + 1) - 1));        
      }
    },
    modUTCDate: {
      configurable: true,
      value (f) {
        return this.pipe(o => o.setUTCDate(f(o.getUTCDate())));
      }
    },
    modUTCHour: {
      configurable: true,
      value (f) {
        return this.pipe(o => o.setUTCHours(f(o.getUTCHours())));
      }
    },
    modUTCMinute: {
      configurable: true,
      value (f) {
        return this.pipe(o => o.setUTCMinutes(f(o.getUTCMinutes())));
      }
    },
    modUTCSeconds: {
      configurable: true,
      value (f) {
        return this.pipe(o => o.setUTCSeconds(f(o.getUTCSeconds())));
      }
    },
    zone: {
      configurable: true,
      get () {
        return this.pipe(o =>o.getTimezoneOffset())
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
        return _(
          this
        )
        .pipe(
          ({
            year, month, date, day, hour, minute, seconds, millis
          }) => ({
            year: year._,
            month: month._,
            date: date._,
            day: day._,
            hour: hour._,
            minute: minute._,
            seconds: seconds._,
            millis: millis._
          })
        );
      }
    },
    toJSON: {
      configurable: true,
      get () {
        return this.toObject.toJSON;
      }
    }
  });
  'process' in apex ? (module.exports = _) : (apex._ = _);
})((this || 0).self || global);
