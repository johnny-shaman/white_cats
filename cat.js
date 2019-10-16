((apex) => {
  'use strict';

  let _ = function (x, y) {
    return _.upto(x == null ? _.prototype : _['#'][_.type(x)], {
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
      }
    });
  };

  Object.assign(_, {
    '#': (
      [Object, String, Number, Boolean, (function* () {}).constructor, Date, Promise, RegExp]
      .map(v => v.name)
      .reduce((p, c) => Object.assign(p, {[c]: Object.create(_.prototype)}), {})
    ),
    id: v => v,
    lift: (...fs) => fs.reduceRight((f, g) => (...v) => {
      try {
        return v[0] == null ? null : (v.unshift(g(...v)), f(...v));
      } catch (e) {
        console.error(e);
        v.unshift(null);
        v.push(e);
        return null;
      }
    }, _.id),
    flat: (...fs) => fs.reduceRight((f, g) => (...v) => {
      try {
        return v[0] == null ? null : (v.push(g(...v)), f(...v));
      } catch (e) {
        console.error(e);
        v.push(e);
        return null;
      }
    }, _.id),
    promote: (key, promoter, promotee) => _.define(
      promoter,
      key,
      {
        configurable: true,
        enumerable: true,
        set (v) {
          _.define(this, k, {
            configurable: true,
            writable: true,
            value: v
          });
          return true;
        },
        get () {
          return promotee[k];
        }
      }
    ),
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
    refine: a => [...a].map(v => v == null ? undefined : v),
    adapt: (...b) => a => _.refine(a).map(v => v == null ? b.shift() : v),
    fullen: a => !_.refine(a).includes(undefined),
    less: a => a.filter(v => v != null),
    exist: a => a.includes,
    type: o => {
      switch (o) {
        case null:
        case undefined: return '';
        default: switch (typeof o) {
          case 'object': switch (o.constructor) {
            case Array : return 'Array';
            case Promise : return 'Promise';
            case (function* () {})().constructor : return 'GeneratorFunction';
            case RegExp : return 'RegExp';
            case Date : return 'Date';
            default: return 'Object';
          }
          default: return (typeof o).charAt(0).toUpperCase() + (typeof o).slice(1);
        }
      }
    },
    by: o => o == null ? undefined : o.constructor,
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
    }
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
    lift_: {
      configurable: true,
      value (...f) {
        return _.lift(...f)(this._$);
      }
    },
    lift$: {
      configurable: true,
      value (...f) {
        return _.lift(...f)(this.$_);
      }
    },
    flat_: {
      configurable: true,
      value (...f) {
        return _.flat(...f)(this._$);
      }
    },
    flat$: {
      configurable: true,
      value (...f) {
        return _.flat(...f)(this.$_);
      }
    },
    liftR: {
      configurable: true,
      value (...f) {
        return _(_.lift(...f)(this._$), this.$_);
      }
    },
    flatR: {
      configurable: true,
      value (...f) {
        return _(_.flat(...f)(this._$), this.$_);
      }
    },
    flatL: {
      configurable: true,
      value (...f) {
        return _(this._$, _.flat(...f)(this.$_));
      }
    },
    swap: {
      configurable: true,
      get () {
        return _(this.$, this._);
      }
    },
    get: {
      configurable: true,
      value (s) {
        return this.liftR(o => s.split('.').reduce((p, c) => p == null ? null : p[c] , o));
      }
    },
    set: {
      configurable: true,
      value (s) {
        return (v) => this.put(
          _(s.split(".")).lift_(a => a.reduceRight((p, c) => ({[c]: p}), {[a.pop()]: v}))
        );
      }
    },
    mod: {
      configurable: true,
      value (s) {
        return (...f) => this.put(
          this
          .get(s)
          .lift_(...f, v => _(s.split(".")).endo(a => a.reduceRight((p, c) => ({[c]: p}), {[a.pop()]: v})))
        );
      }
    },
    callTo: {
      configurable: true,
      value (s) {
        return (...v) => this.liftR(o => s.split('.').reduce((p, c) => {
          switch (_.type(p[c])) {
            case '': return p;
            case 'Function' : return p[c].call(p, ...v);
            default: return p[c];
          }
        }, o));
      }
    },
    castOf: {
      configurable: true,
      value (s) {
        return (...v) => this.flatR(o => s.split('.').reduce((p, c) => {
          switch (_.type(p[c])) {
            case '': return p;
            case 'Function' : return p[c].call(p, ...v);
            default: return p[c];
          }
        }, o));
      }
    },
    call: {
      configurable: true,
      get () {
        return new Proxy(this, {
          get (t, k) {
            switch (k) {
              case "_": return t._;
              case "to": return t;
              default: return (...v) => {
                switch (t.get(k).type_) {
                  case "Function": return t.result(k)(...v).call;
                  default: return t.mod(k)(...v).call;
                }
              }
            }
          }
        });
      }
    },
    cast: {
      configurable: true,
      get () {
        return new Proxy(this, {
          get (t, k) {
            switch (k) {
              case "_": return t._;
              case "of": return t;
              default: return (...v) => {
                switch (t.get(k).type_) {
                  case "Function": return t.review(k)(...v).cast;
                  default: return t.mod(k)(...v).cast;
                }
              }
            }
          }
        });
      }
    },
    toJSON: {
      configurable: true,
      get () {
        return this.liftR(JSON.stringify);
      }
    },
    type_: {
      configurable: true,
      get () {
        return this.flat_(_.type);
      }
    }
  });

  _.defines(_['#'].Object, {
    filter: {
      configurable: true,
      value (f) {
        return this.liftR(
          o => _.entries(o).reduce((p, [k, v]) => f({k, v}) ? _.put(p, {[k]: v}) : _.put(p, {[k]: undefined}), _.upto(o, {}))
        );
      }
    },
    each: {
      configurable: true,
      value (...f) {
        return this.flatR(
          _.entries,
          a => a.reduce((p, [k, v]) => _.lift(...f)({k, v}))
        );
      }
    },
    put: {
      configurable: true,
      value (...o) {
        return this.liftR(p => _.put(p, ...o));
      }
    },
    define: {
      configurable: true,
      value (o) {
        return this.liftR(p => _.defines(p, o));
      }
    },
    depend: {
      configurable: true,
      value (o = {}) {
        return this.liftR(p => _.upto(p, o));
      }
    },
    append: {
      configurable: true,
      value (o = {}) {
        return this.liftR(p => _.upto(o, p));
      }
    },
    pick: {
      configurable: true,
      value (s) {
        return this.filter(
          ({k}) => s.trim().split(/\s*,\s*/).includes(k)
        );
      }
    },
    drop: {
      configurable: true,
      value (s) {
        return this.filter(
          ({k}) => !s.trim().split(/\s*,\s*/).includes(k)
        );
      }
    },
    keys: {
      configurable: true,
      get () {
        return this.liftR(_.keys);
      }
    },
    vals: {
      configurable: true,
      get () {
        return this.liftR(_.vals);
      }
    },
    entries: {
      configurable: true,
      get () {
        return this.liftR(_.entries);
      }
    },
    fullen_: {
      configurable: true,
      get () {
        return this.flat_(_.vals, _.fullen);
      }
    }
  });

  _.put(_['#'], {Function: _.upto(_['#'].Object)});
  _.defines(_['#'].Function, {
    deligates: {
      configurable: true,
      value (s) {
        return this.flatR(c => _.put(c, {prototype: _.upto(s.prototype, {
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
        return this.flatR(c => _.put(c.prototype, o));
      }
    },
    configures: {
      configurable: true,
      value (o) {
        return this.flatR(c => _.defines(c.prototype, o));
      }
    },
    apply: {
      configurable: true,
      value (a) {
        return this.liftR(a.map.bind(a));
      }
    },
    collect_: {
      configurable: true,
      value (...a) {
        return this.lift_(f => f(...a));
      }
    },
    to: {
      configurable: true,
      value (v) {
        return (...w) => _.fullen(v) ? this.lazy(...v) : this.to(_.adapt(...w)(v));
      }
    },
    lazy: {
      configurable: true,
      value (...v) {
        return () => this.collect_(f => f(...v));
      }
    },
    of: {
      configurable: true,
      value (...v) {
        return this.liftR(v.map.bind(v));
      }
    }
  });

  _.put(_['#'], {Array: _.upto(_['#'].Object)});
  _.defines(_['#'].Array, {
    each: {
      configurable: true,
      value (...f) {
        return this.review('forEach')(_.lift(...f));
      }
    },
    map: {
      configurable: true,
      value (...f) {
        return this.result('map')(_.lift(...f));
      }
    },
    endo: {
      configurable: true,
      value (...f) {
        return this.liftR(...f);
      }
    },
    aMap: {
      configurable: true,
      value (...v) {
        return this.fMap(f => v.map(g => _.type(f) === 'Function' ? f(g) : g(f)));
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
        return this.result('reduce')(f, ...v);
      }
    },
    foldR: {
      configurable: true,
      value (f, ...v) {
        return this.result('reduceRight')(f, ...v);
      }
    },
    filter: {
      configurable: true,
      value (f) {
        return this.result('filter')(f);
      }
    },
    '@skelton': {
      configurable: true,
      get () {
        return this.map(v => (
          v instanceof Array
          ? _(v).put({key: v.shift()})['@skelton']._
          : v
        ))
      }
    },
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
            v instanceof Object
            ? this
              .filter(v => v instanceof Object)
              .map((v, k) => _(v).pick(a.filter(v => v instanceof Array)[k]))
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
            v instanceof Object
            ? this
              .filter(v => v instanceof Object)
              .map((v, k) => _(v).drop(a.filter(v => v instanceof Array)[k]))
              ._
            : !a.includes(v)
          )
        );
      }
    },
    chunk: {
      configurable: true,
      value (n) {
        return this.liftR(a => a.length == 0 ? [] : [a.slice( 0, n )].concat(a.slice(n).chunk(n)));
      }
    },
    uniq: {
      configurable: true,
      get () {
        return this.liftR(a => [...new Set(a)]);
      }
    },
    union: {
      configurable: true,
      value (...b) {
        return this.liftR(a => [...new Set(a.concat(...b))]);
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
        return this.review('unshift')(...v);
      }
    },
    pushR: {
      configurable: true,
      value (...v) {
        return this.review('push')(...v);
      }
    },
    popL: {
      configurable: true,
      get () {
        return this.result('shift')();
      }
    },
    popR: {
      configurable: true,
      get () {
        return this.result('pop')();
      }
    },
    fMap: {
      configurable: true,
      value (...f) {
        return this.result('flatMap')(_.lift(...f));
      }
    },
    flat: {
      configurable: true,
      value (v) {
        return this.result('flat')(v);
      }
    },
    back: {
      configurable: true,
      get () {
        return this.result('reverse')();
      }
    },
    adaptL: {
      configurable: true,
      value (...v) {
        return this.liftR(_.adapt(...v))
      }
    },
    adaptR: {
      configurable: true,
      value (...w) {
        return this.liftR(
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
        return this.result('concat')(...v);
      }
    },
    replace: {
      configurable: true,
      valuue (...v) {
        return this.result('splice')(...v);
      }
    },
    slice: {
      configurable: true,
      value (...v) {
        return this.result('slice')(...v);
      }
    },
    sort: {
      configurable: true,
      value (...v) {
        return this.result('sort')(...v);
      }
    },
    spread: {
      configurable: true,
      value (...f) {
        return this.liftR(a => f(...a));
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
        return this.liftR(_.refine);
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
        return this.flat_(_.fullen);
      }
    },
    swapRC: {
      configurable: true,
      get () {
        return this.liftR(a => _([...a[0].keys]).map((_, c) => a.map(r => r[c])));
      }
    }
  });
  _.defines(_['#'].Number, {
    order: {
      configurable: true,
      get () {
        return this.liftR(v => [..._._(0, v)]);
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
        return this.liftR(Math.abs);
      }
    }
  });

  _.defines(_['#'].String, {
    ofJSON: {
      configurable: true,
      get () {
        return this.liftR(JSON.parse);
      }
    },
    date: {
      configurable: true,
      get () {
        return this.liftR(s => new Date(Date.parse(s)));
      }
    }
  });

  'process' in apex ? (module.exports = _) : (apex._ = _);

})((this || 0).self || global);
