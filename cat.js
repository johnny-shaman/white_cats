((apex) => {
  'use strict';

  let _ = function (x, y, c) {
    return _.upto(
      x == null
      ? _.prototype
      : _['#'][_['#'][x.constructor.name] == null ? 'Object' : x.constructor.name],
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
      [Object, String, Number, Boolean, (function* () {}).constructor, Date, Promise]
      .map(v => v.name)
      .reduce((p, c) => Object.assign(p, {[c]: Object.create(_.prototype)}), {})
    ),
    version: '0.0.1',
    id: v => v,
    pipe: (...fs) => fs.reduceRight((f, g) => (...v) => {
      try {
        return v[0] == null ? null : (v.unshift(g(...v)), f(...v));
      } catch (e) {
        console.error(e);
        v.unshift(null);
        v.push(e);
        return null;
      }
    }, _.id),
    loop: (...fs) => fs.reduceRight((f, g) => (...v) => {
      try {
        return v[0] == null ? null : (v.push(g(...v)), f(...v));
      } catch (e) {
        console.error(e);
        v.push(e);
        return null;
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
    fullen: a => !([...a].includes(undefined) || [...a].includes(null)),
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
    re: {
      configurable: true,
      get () {
        return _(this.$, this._, this['@']);
      }
    },
    get: {
      configurable: true,
      value (...s) {
        return this.pipe(
          o => s
          .flatMap(w => w.split('.'))
          .reduce((p, c) => p == null ? null : p[c], o)
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
      value (...o) {
        return this.pipe(p => _.put(p, ...o));
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
    callTo: {
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
    castOf: {
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
    call: {
      configurable: true,
      get () {
        return new Proxy(this, {
          get (t, k) {
            return k === 'To'
            ? t
            : (
              (...v) => typeof t._[k] === 'function'
              ? t.callTo(k)(...v)
              : t.mod(k)(...v)
            ).call;
          }
        });
      }
    },
    cast: {
      configurable: true,
      get () {
        return new Proxy(this, {
          get (t, k) {
            return k === 'Of'
            ? t
            : (
              (...v) => typeof t._[k] === 'function'
              ? t.castOf(k)(...v)
              : t.mod(k)(...v)
            ).cast;
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
        return this.done
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
        return this.pipe(_.vals, _.fullen)._;
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
    implements: {
      configurable: true,
      value (o) {
        return this.loop(c => _.put(c.prototype, o));
      }
    },
    configures: {
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
    plot: {
      configurable: true,
      value (v) {
        return _(v, this.$_, this._);
      }
    },
    of: {
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
    uniq: {
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
        return this.castOf('unshift')(...v);
      }
    },
    pushR: {
      configurable: true,
      value (...v) {
        return this.castOf('push')(...v);
      }
    },
    popL: {
      configurable: true,
      get () {
        return this.callTo('shift')();
      }
    },
    popR: {
      configurable: true,
      get () {
        return this.callTo('pop')();
      }
    },
    omitL: {
      configurable: true,
      get () {
        return this.castOf('shift')();
      }
    },
    omitR: {
      configurable: true,
      get () {
        return this.castOf('pop')();
      }
    },
    each: {
      configurable: true,
      value (...f) {
        return this.castOf('forEach')(_.pipe(...f));
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
        return this.callTo('reduce')(f, ...v);
      }
    },
    foldR: {
      configurable: true,
      value (f, ...v) {
        return this.callTo('reduceRight')(f, ...v);
      }
    },
    filter: {
      configurable: true,
      value (f) {
        return this.callTo('filter')(f);
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
        return this.callTo('map')(_.pipe(...f));
      }
    },
    fMap: {
      configurable: true,
      value (...f) {
        return this.callTo('flatMap')(_.pipe(...f));
      }
    },
    flat: {
      configurable: true,
      value (v) {
        return this.callTo('flat')(v);
      }
    },
    back: {
      configurable: true,
      get () {
        return this.callTo('reverse')();
      }
    },
    adaptL: {
      configurable: true,
      value (...v) {
        return this.pipe(_.adapt(...v))
      }
    },
    adaptR: {
      configurable: true,
      value (...w) {
        return this.pipe(
          a => a.reverse(),
          _.adapt(...v),
          a => a.reverse()
        );
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
        return this.callTo('concat')(...v);
      }
    },
    replace: {
      configurable: true,
      valuue (...v) {
        return this.callTo('splice')(...v);
      }
    },
    slice: {
      configurable: true,
      value (...v) {
        return this.callTo('slice')(...v);
      }
    },
    sort: {
      configurable: true,
      value (...v) {
        return this.callTo('sort')(...v);
      }
    },
    indexL_: {
      configurable: true,
      value (...v) {
        return this.callTo('indexOf')(...v)._;
      }
    },
    indexR_: {
      configurable: true,
      value (...v) {
        return this.callTo('lastIndexOf')(...v)._;
      }
    },
    some_: {
      configurable: true,
      value (...v) {
        return this.callTo('some')(...v)._;
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
        return this.sort.R(
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
        return this.pipe(a => _([...a[0].keys]).map((_, c) => a.map(r => r[c])));
      }
    },
    to: {
      configurable: true,
      value (...w) {
        return this.pipe(
          a => _.adapt(a)(...w),
          a => _((_.fullen(a) && this['@']) ? this['@'](...a) : a,
            this.$,
            _.fullen(a) ? null : this['@']
          )
        )._
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
    ofJSON: {
      configurable: true,
      get () {
        return this.pipe(JSON.parse);
      }
    },
    date: {
      configurable: true,
      get () {
        return this.pipe(s => new Date(Date.parse(s)));
      }
    }
  });
  'process' in apex ? (module.exports = _) : (apex._ = _);
})((this || 0).self || global);
