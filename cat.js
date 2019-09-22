((apex) => {
  "use strict";

  let _ = function (x, y) {
    return Object.create(x != null && (_.Types[x.constructor.name] || _.Types[x.constructor.constructor.name]) || _.prototype, {
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
    Types: (
      [Object, String, Number, Boolean, (function* () {}).constructor, Date, Promise]
      .map(v => v.name)
      .reduce((p, c) => Object.assign(p, {[c]: Object.create(_.prototype)}), {})
    ),
    id: v => v,
    pipe: (...fs) => fs.reduceRight((f, g) => (...v) => (v.unshift(g(...v)), f(...v)), _.id),
    loop: (...fs) => fs.reduceRight((f, g) => (...v) => (v.push(g(...v)), f(...v)), _.id),
    Skelton: (...a) => a.map(
      v => _
        .if(v instanceof Array)
        .then(_.Skelton(_.assign(v, {key: v.shift()})))
        .else(v)
      .$
    ),
    promote: (promoter, key, promotee) => _.define(
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
    if: _,
    case: _,
    upto: Object.create,
    assign: Object.assign,
    define: Object.defineProperty,
    defines: Object.defineProperties,
    entries: Object.entries,
    keys: Object.keys,
    vals: Object.values
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
    join_: {
      configurable: true,
      get () {
        return this.$;
      }
    },
    flatR: {
      configurable: true,
      value (...f) {
        return this._ == null ? this._ : _.pipe(...f)(this._);
      }
    },
    flatL: {
      configurable: true,
      value (...f) {
        return this.$ == null ? _.loop(...f)(this._) : _.loop(...f)(this.$);
      }
    },
    R: {
      configurable: true,
      value (...f) {
        return _(this.flatR(...f), this.$_);
      }
    },
    L: {
      configurable: true,
      value (...f) {
        return _(this._, this.flatL(...f));
      }
    },
    as: {
      configurable: true,
      value (v) {
        return {then: w => _(this._, v === this._ ? w : null)};
      }
    },
    swap: {
      configurable: true,
      get () {
        return _(this.$, this._);
      }
    },
    json: {
      configurable: true,
      get () {
        return this.R(JSON.stringify);
      }
    }
  });

  _.defines(_.Types.Object, {
    re: {
      configurable: true,
      get () {
        return this.swap;
      }
    },
    filter: {
      configurable: true,
      value (f) {
        return this.R(
          o => Object
          .entries(o)
          .reduce((p, [k, v]) => f(k, v) && _.promote(p, k, o), {})
        );
      }
    },
    map: {
      configurable: true,
      value (...f) {
        return this.R(
          _.entries,
          a => a.reduce((p, [k, v]) => p.put({[k]: _.pipe(...f)(k, v)}), this)
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
        return this.R(p => _.assign(p, ...o));
      }
    },
    define: {
      configurable: true,
      value (o) {
        return this.R(p => _.defines(p, o));
      }
    },
    append: {
      configurable: true,
      value (o) {
        return this.R(p => _.upto(p, o));
      }
    },
    depend: {
      configurable: true,
      value (o) {
        return this.R(p => _.upto(o, p));
      }
    },
    get: {
      configurable: true,
      value (...k) {
        return this.R(o => k.reduce(
          (p, c) => _
            .if ( p == null )
            .then ( null )
            .else ( p[c] )
          .join_,
          o
        ));
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
    call: {
      configurable: true,
      value (...k) {
        return (...v) => this.R(o => k.reduce(
          (p, c) => _
            .it ( p[c] )
            .as ( null ) .in ( null )
            .else (_
              .if ( typeof p[c] === "function" )
              .then ( p[c].call(p, ...v) )
              .else ( p[c] )
            .join_)
          .join_,
          o
        ));
      }
    },
    cast: {
      configurable: true,
      value (...k) {
        return (...v) => this.L(o => k.reduce(
          (p, c) => (
            p[c] == null
            ? null
            : (
              typeof p[c] === "function"
              ? p[c].call(p, ...v)
              : p[c]
            )
          ),
          o
        ));
      }
    },
    pick: {
      configurable: true,
      value (...k) {
        return this.R(o => this
          .skelton
          .pick(_.Skelton(...k))
          .fold(
            (p, c) => (
              c instanceof Array
              ? this.get(c.key).pick(c)._
              : _.promote(p, c, o)
            ),
            {}
          )
        );
      }
    },
    drop: {
      configurable: true,
      value (...k) {
        return this.R(o => this
          .skelton
          .drop(_.Skelton(...k))
          .fold(
            (p, c) => (
              c instanceof Array
              ? this.get(c.key).drop(c)._
              : _.promote(p, c, o)
            ),
            {}
          )
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
            ? _(o[k]).skelton.assign({key: k})._
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

  _.assign(_.Types, {Array: _.upto(_.Types.Object)});
  _.defines(_.Types.Array, {
    map: {
      configurable: true,
      value (...f) {
        return this.call("map")(_.pipe(...f));
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
        return this.call("reduce")(f, ...v);
      }
    },
    foldR: {
      configurable: true,
      value (f, ...v) {
        return this.call("reduceRight")(f, ...v);
      }
    },
    filter: {
      configurable: true,
      value (f) {
        return this.call("filter")(f);
      }
    },
    pick: {
      configurable: true,
      value (...a) {
        return this.filter(
          v => (
            v instanceof Array
            ? this
              .filter(v => v instanceof Array)
              .map(_, (v, k) => v.pick(a.filter(v => v instanceof Array)[k]))
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
            v instanceof Array
            ? this
              .filter(v => v instanceof Array)
              .map(_, (v, k) => v.drop(a.filter(v => v instanceof Array)[k]))
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
        return this.fold((p, c) => c != null && p, true)._
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
        return this.cast("unshift")(...v);
      }
    },
    pushR: {
      configurable: true,
      value (...v) {
        return this.cast("push")(...v);
      }
    },
    popL: {
      configurable: true,
      get () {
        return this.call("shift")();
      }
    },
    popR: {
      configurable: true,
      get () {
        return this.call("pop")();
      }
    },
    fMap: {
      configurable: true,
      value (...f) {
        return this.call("flatMap")(_.pipe(...f));
      }
    },
    flat: {
      configurable: true,
      value (v) {
        return this.call("flat")(v);
      }
    },
    back: {
      configurable: true,
      get () {
        return this.call("reverse");
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
        return this.call("concat");
      }
    },
    replace: {
      configurable: true,
      get () {
        return this.call("splice");
      }
    },
    slice: {
      configurable: true,
      get () {
        return this.call("slice");
      }
    },
    sort: {
      configurable: true,
      get () {
        return this.call("sort");
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
  _.defines(_.Types.Boolean, {
    then: {
      configurable: true,
      value (v) {
        return _(this._, this._ && v);
      }
    },
    else: {
      configurable: true,
      value (v) {
        return _(this._, this._ || v);
      }
    }
  });
  "process" in apex ? (module.exports = _) : (apex._ = _);
})((this || 0).self || global);
