((apex) => {
  "use strict";

  let _ = function (x, y, orgin, c = []) {
    return _.upto(x != null && (_["#"][x.constructor.name] || _["#"][x.constructor.constructor.name]) || _.prototype, {
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
      "@": {
        configurable: true,
        get () {
          return origin
        }
      },
      "#": {
        configurable: true,
        get () {
          return c;
        }
      }
    });
  };

  Object.assign(_, {
    "#": (
      [Object, String, Number, Boolean, (function* () {}).constructor, Date, Promise]
      .map(v => v.name)
      .reduce((p, c) => Object.assign(p, {[c]: Object.create(_.prototype)}), {})
    ),
    id: v => v,
    pipe: (...fs) => fs.reduceRight((f, g) => (...v) => (v.unshift(g(...v)), f(...v)), _.id),
    loop: (...fs) => fs.reduceRight((f, g) => (...v) => (v.push(g(...v)), f(...v)), _.id),
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

    if: function (b, v) {
      return _.upto(_.if.prototype, {
        "#": {
          configurable: true,
          get () {
            return b;
          }
        },
        _: {
          configurable: true,
          get () {
            return v;
          }
        }
      })
    },

    when: function (o, p, v, t) {
      return _.upto(_.when.prototype, {
        "#": {
          configurable: true,
          get () {
            return o;
          }
        },
        _: {
          configurable: true,
          get () {
            return v;
          }
        },
        from: {
          configurable: true,
          get () {
            return t;
          }
        },
        "@": {
          configurable: true,
          get () {
            return p;
          }
        }
      });
    },

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
    is: o => o == null ? "" : o instanceof Array ? "array" : typeof o,
    by: o => o == null ? undefined : o.constructor
  });

  _.defines(_.if.prototype, {
    then: {
      configurable: true,
      value (v) {
        return this["#"] ? _.if(this["#"], v) : _.if(this["#"], this._);
      }
    },
    else: {
      configurable: true,
      value (v) {
        return this["#"] ? _.if(this["#"], this._) : _.if(this["#"], v);
      }
    }
  });

  _.defines(_.when.prototype, {
    as: {
      configurable: true,
      value (v) {
        return ({
          then: w => (
            _.equal(this["#"], v)
            ? _.when(this["#"], _.equal(this["#"], v), w, this)
            : _.when(this["#"], _.equal(this["#"], v), this._, this)
          ),
          else: w => (
            _.equal(this["#"], v)
            ? _.when(this["#"], _.equal(this["#"], v), this._, this)
            : _.when(this["#"], _.equal(this["#"], v), w, this)
          )
        });
      }
    },
    then: {
      configurable: true,
      value (v) {
        return (
          this["@"]
          ? _.when(this["#"], this["@"], v, this)
          : _.when(this["#"], this["@"], this._, this)
        )
      }
    },
    else: {
      configurable: true,
      value (v) {
        return (
          this["@"]
          ? _.when(this["#"], this["@"], this._, this)
          : _.when(this["#"], this["@"], v, this)
        )
      }
    },
    that: {
      configurable: true,
      get () {
        return _.when(this._)
      }
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
        return this["@"] == null ? this._ : this["@"];
      }
    },
    yield_: {
      configurable: true,
      get () {
        return this["#"];
      }
    },
    flatR: {
      configurable: true,
      value (...fs) {
        return this._ == null ? this._ : fs.reduceRight(
          (f, g) => (...v) => {
            try {
              v.unshift(this["#"][this["#"].push(g(...v))]);
              return f(...v);
            } catch (e) {
              console.error(e);
              return null
            }
          }
        )(this._, this.$);
      }
    },
    flatL: {
      configurable: true,
      value (...f) {
        return this.$ == null
        ? fs.reduceRight(
          (f, g) => (...v) => {
            try {
              v.push(this["#"][this["#"].push(g(...v)) - 1]);
              return f(...v);
            } catch (e) {
              console.error(e);
              return null
            }
          }
        )(this._, this.$)
        : fs.reduceRight(
          (f, g) => (...v) => {
            try {
              v.push(this["#"][this["#"].push(g(...v)) - 1]);
              return f(...v);
            } catch (e) {
              console.error(e);
              return null
            }
          }
        )(this.$, this._);
      }
    },
    R: {
      configurable: true,
      value (...f) {
        return _(this.flatR(...f), this.$_, this["@"], this["#"]);
      }
    },
    L: {
      configurable: true,
      value (...f) {
        return _(this.flatL(...f), this.$_, this["@"], this["#"]);
      }
    },
    origin: {
      configurable: true,
      get () {
        return _(this["@"], this.$, this["@"], this["#"]);
      }
    },
    done: {
      configurable: true,
      get () {
        return _(this["#"], this.$, this["@"], this["#"]);
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

  _.defines(_["#"].Object, {
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
          .reduce((p, [k, v]) => f(k, v) && _.promote(k, p, o), {})
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
        return this.R(o => k.reduce(
          (p, c) => _.if ( p == null ) .then ( null ) .else ( p[c] ) ._, o
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
        return (...v) => this.R(o => k.reduce((p, c) => _
          .when ( _.is(p) )
          .as ( "" ) .then (p) .else ( p[c] )
          .that
          .as ( "function" ) .then ( p[c].call(p, ...v) )
        ._, o));
      }
    },
    cast: {
      configurable: true,
      value (...k) {
        return (...v) => this.L(o => k.reduce((p, c) => _
          .when ( _.is(p) )
          .as ( "" ) .then (p) .else ( p[c] )
          .that
          .as ( "function" ) .then ( p[c].call(p, ...v) )
        ._, o));
      }
    },
    pick: {
      configurable: true,
      value (...k) {
        return this.R(o => this
          .skelton
          .pick(..._(k).skelton._)
          .fold((p, c) => _
            .if ( c instanceof Array )
            .then ( this.get(c.key).pick(c)._ )
            .else ( _.promote(c, p, o) )
          ._, {})
        );
      }
    },
    drop: {
      configurable: true,
      value (...k) {
        return this.R(o => this
          .skelton
          .drop(..._(k).skelton._)
          .fold(
            (p, c) => (
              c instanceof Array
              ? this.get(c.key).drop(c)._
              : _.promote(c, p, o)
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

  _.put(_["#"], {Function: _.upto(_["#"].Object)});
  _.defines(_["#"].Function, {
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
    strictImplements: {
      configurable: true,
      value (o) {
        return this.L(c => _.defines(c.prototype, o));
      }
    }
  });

  _.put(_["#"], {Array: _.upto(_["#"].Object)});
  _.defines(_["#"].Array, {
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
    skelton: {
      configurable: true,
      get () {
        return this.map(
          v => _
            .if ( v instanceof Array )
            .then ( _(v).skelton(_.put(v, {key: v.shift()}))._ )
            .else ( v )
          ._
        )
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
  _.defines(_["#"].Number, {
    l: {
      configurable: true,
      get () {
        this.R(n => [...Array(n).keys()]);
      }
    },
    fact: {
      configurable: true,
      get () {
        this.R(n => [...Array(n).keys()].reduce((p, c) => p * c));
      }
    },
    abs: {
      get () {
        return this.R(Math.abs);
      }
    },
    arccos: {}
  });

  "process" in apex ? (module.exports = _) : (apex._ = _);
})((this || 0).self || global);
