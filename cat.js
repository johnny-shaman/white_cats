((apex) => {
  'use strict';

  let _ = function (x, y, origin, c = []) {
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
      },
      '@': {
        configurable: true,
        get () {
          return origin == null ? y : origin
        }
      },
      '#': {
        configurable: true,
        get () {
          return c;
        }
      }
    });
  };

  Object.assign(_, {
    '#': (
      [Object, String, Number, Boolean, (function* () {}).constructor, Date, Promise]
      .map(v => v.name)
      .reduce((p, c) => Object.assign(p, {[c]: Object.create(_.prototype)}), {})
    ),
    id: v => v,
    pipe: (...fs) => fs.reduceRight((f, g) => (...v) => {
      try {
        return v[0] == null ? null : (v.unshift(g(...v)), f(...v));
      } catch (e) {
        console.error(e);
        v.unshift(null)
        v.push(e)
        return v;
      }
    }, _.id),
    loop: (...fs) => fs.reduceRight((f, g) => (...v) => {
      try {
        return v[0] == null ? null : (v.push(g(...v)), f(...v));
      } catch (e) {
        console.error(e);
        v.push(e);
        return v;
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
    type: o => {
      switch (o) {
        case null:
        case undefined: return '';
        default: switch (typeof o) {
          case 'object': switch (true) {
            case o instanceof Array : return 'Array';
            case o instanceof Promise : return 'Promise';
            case o instanceof (function* () {}).constructor: return 'GeneratorFunction';
            default: return 'Object'
          }
          default: return (typeof o).charAt(0).toUpperCase() + (typeof o).slice(1);
        }
      }
    },
    by: o => o == null ? undefined : o.constructor,
    _: function* (a, b = 0, s = 1) {
      while (a !== b) {
        switch (true) {
          case a < b : {
            yield a += s;
            break;
          }
          case a > b : {
            yield a -= s;
            break;
          }
        }
      }
      return a;
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
    origin_: {
      configurable: true,
      get () {
        return this['@'] == null ? this._ : this['@'];
      }
    },
    yield_: {
      configurable: true,
      get () {
        return this['#'];
      }
    },
    '##': {
      configurable: true,
      value (...fs) {
        fs.reduceRight(
          (f, g) => (...v) => {
            try {
              v.unshift(this['#'][this['#'].push(g(...v)) - 1]);
              return f(...v);
            } catch (e) {
              console.error(this['#'][this['#'].push(e) - 1]);
              v.unshift(null);
              v.push(e);
              return v;
            }
          }
        );
      }
    },
    '@@': {
      configurable: true,
      value (...fs) {
        fs.reduceRight(
          (f, g) => (...v) => {
            try {
              v.push(this['#'][this['#'].push(g(...v)) - 1]);
              return f(...v);
            } catch (e) {
              console.error(this['#'][this['#'].push(e) - 1]);
              v.push(e);
              return v;
            }
          }
        );
      }
    },
    flatR: {
      configurable: true,
      value (...fs) {
        return this._ == null
        ? this['##'](...fs)(this.$, this._)
        : this['##'](...fs)(this._, this.$);
      }
    },
    flatL: {
      configurable: true,
      value (...f) {
        return this.$ == null
        ? this['@@'](...fs)(this.$, this._)
        : this['@@'](...fs)(this._, this.$);
      }
    },
    R: {
      configurable: true,
      value (...f) {
        return _(this.flatR(...f), this.$_, this['@'], this['#']);
      }
    },
    L: {
      configurable: true,
      value (...f) {
        return _(this.flatL(...f), this.$_, this['@'], this['#']);
      }
    },
    origin: {
      configurable: true,
      get () {
        return _(this['@'], this.$, this['@'], this['#']);
      }
    },
    yield: {
      configurable: true,
      get () {
        return _(this['#'], this.$, this['@'], this['#']);
      }
    },
    swap: {
      configurable: true,
      get () {
        return _(this.$, this._);
      }
    },
    call: {
      configurable: true,
      value (...k) {
        return (...v) => this.R(o => k.reduce((p, c) => {
          switch (_.is(p)) {
            case '': return p;
            case 'Function' : return p[c].call(p, ...v);
            default: return p[c]
          }
        }, o));
      }
    },
    cast: {
      configurable: true,
      value (...k) {
        return (...v) => this.L(o => k.reduce((p, c) => {
          switch (_.is(p)) {
            case '': return p;
            case 'Function' : return p[c].call(p, ...v);
            default: return p[c]
          }
        }, o));
      }
    },
    been: {
      configurable: true,
      get () {
        return new Proxy(this, {
          get (t, k) {
            return k === 'to' ? t : t.cast(k).been
          }
        });
      }
    },
    json: {
      configurable: true,
      get () {
        return this.R(JSON.stringify);
      }
    }
  });

  _.defines(_['#'].Object, {
    re: {
      configurable: true,
      get () {
        return this.origin;
      }
    },
    filter: {
      configurable: true,
      value (f) {
        return this.R(
          _.entries,
          a => a.reduce((p, [k, v]) => f(k, v) && _.promote(k, p, o), {})
        );
      }
    },
    map: {
      configurable: true,
      value (...f) {
        return this.R(
          _.entries,
          a => a.reduce((p, [k, v]) => p.put({[k]: _.pipe(...f)(k, v)}), this.depend())._
        );
      }
    },
    endo: {
      configurable: true,
      value (...f) {
        return this.R(
          _.entries,
          a => a.reduce((p, [k, v]) => p.put({[k]: _.pipe(...f)(k, v)}), this)._
        );
      }
    },
    each: {
      configurable: true,
      value (...f) {
        return this.L(
          _.entries,
          a => a.reduce((p, [k, v]) => _.pipe(...f)(k, v), this)
        );
      }
    },
    put: {
      configurable: true,
      value (...o) {
        return this.R(p => _.put(p, ...o));
      }
    },
    define: {
      configurable: true,
      value (o) {
        return this.R(p => _.defines(p, o));
      }
    },
    depend: {
      configurable: true,
      value (o) {
        return this.R(p => _.upto(p, o));
      }
    },
    append: {
      configurable: true,
      value (o) {
        return this.R(p => _.upto(o, p));
      }
    },
    get: {
      configurable: true,
      value (...k) {
        return this.R(o => k.reduce((p, c) => p == null ? null : p[c] , o));
      }
    },
    set: {
      configurable: true,
      value (...k) {
        return (v) => this.put(
          _({[k.pop()]: v}).flatR(b => k.reduceRight((p, c) => ({[c]: p}), b))
        );
      }
    },
    pick: {
      configurable: true,
      value (...k) {
        return this.R(o => this
          .skelton
          .pick(..._(k)['@skelton']._)
          .fold((p, c) => (
            c instanceof Array
            ? this.get(c.key).pick(c)._
            : _.promote(c, p, o)
          ), {})
        );
      }
    },
    drop: {
      configurable: true,
      value (...k) {
        return this.R(o => this
          .skelton
          .drop(..._(k)['@skelton']._)
          .fold((p, c) => (
            c instanceof Array
            ? this.get(c.key).drop(c)._
            : _.promote(c, p, o)
          ), {})
        );
      }
    },
    keys: {
      configurable: true,
      get () {
        return this.R(_.keys);
      }
    },
    skelton: {
      configurable: true,
      get () {
        return this.R(o => _.keys(o).reduce((p, k) => (
          p.push(
            o[k] instanceof Object
            ? _(o[k]).skelton.put({key: k})._
            : k
          ),
          p
        ), []));
      }
    },
    vals: {
      configurable: true,
      get () {
        return this.R(_.vals);
      }
    },
    entries: {
      configurable: true,
      get () {
        return this.R(_.entries);
      }
    },
    fullen: {
      configurable: true,
      get () {
        return this.vals.fold((p, c) => c != null && p, true)._
      }
    }
  });

  _.put(_['#'], {Function: _.upto(_['#'].Object)});
  _.defines(_['#'].Function, {
    deligates: {
      configurable: true,
      value (s) {
        return this.L(c => _.put(c, {prototype: _.upto(s.prototype, {
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
        return this.L(c => _.put(c.prototype, o));
      }
    },
    configures: {
      configurable: true,
      value (o) {
        return this.L(c => _.defines(c.prototype, o));
      }
    },
    part: {
      configurable: true,
      value (a) {

      }
    },
  });

  _.put(_['#'], {Array: _.upto(_['#'].Object)});
  _.defines(_['#'].Array, {
    map: {
      configurable: true,
      value (...f) {
        return this.call('map')(_.pipe(...f));
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
        return this.R(a => a.length == 0 ? [] : [a.slice( 0, n )].concat(a.slice(n).chunk(n)));
      }
    },
    uniq: {
      configurable: true,
      get () {
        return this.R(a => [...new Set(a)]);
      }
    },
    union: {
      configurable: true,
      value (...b) {
        return this.R(a => [...new Set(a.concat(...b))]);
      }
    },
    exist: {
      configurable: true,
      value (v) {
        return this._.includes(v);
      }
    },
    fullen: {
      configurable: true,
      get () {
        return this.fold((p, c) => c != null && p, true)
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
        return this.call('reverse');
      }
    },
    adaptL: {
      configurable: true,
      value (...v) {
        return this.R(
          a => Array(a.length).fill(undefined).map((_, k) => a[k] == null ? v.shift() : a[k])
        )
      }
    },
    adaptR: {
      configurable: true,
      value (...w) {
        return this.R(
          a => a.reverse(),
          a => Array(a.length).fill(undefined).map((_, k) => a[k] == null ? v.shift() : a[k]),
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
      get () {
        return this.call('concat');
      }
    },
    replace: {
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
        return this.call('sort');
      }
    },
    spread: {
      configurable: true,
      value (...f) {
        return this.R(a => f(...a));
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
    }
  });
  _.defines(_['#'].Number, {
    order: {
      configurable: true,
      get () {
        return this.R(v => [..._._(0, v)]);
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
        this.order.filter(v => this._ % 2 === 1 ? v % 2 === 1 : v % 2 === 0).fold((p, c) => p * c)
      }
    },
    abs: {
      configurable: true,
      get () {
        return this.R(Math.abs);
      }
    },
    max: {
      configurable: true,
      value (...v) {
        return this.R()
      }
    },
    min: {
      configurable: true,
      value (...v) {
        return this.R()
      }
    },
  });

  'process' in apex ? (module.exports = _) : (apex._ = _);
})((this || 0).self || global);
