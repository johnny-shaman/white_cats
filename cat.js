(() => {
  "use strict";

  let _ = function (x, y) {
    return Object.create(x != null && (_.Types[x.constructor.name] || _.Types[x.constructor.constructor.name]) || _.prototype, {
      ["#"]: {
        configurable: true,
        get () {
          return x;
        }
      },
      ["@"]: {
        configurable: true,
        get () {
          return y;
        }
      }
    });
  };

  Object.defineProperties(_.prototype, {
    _: {
      configurable: true,
      get () {
        return this["#"];
      }
    },
    $: {
      configurable: true,
      get () {
        return this["@"];
      }
    },
    $_: {
      configurable: true,
      get () {
        return this["@"] == null ? this["#"] : this["@"];
      }
    },
    _$: {
      configurable: true,
      get () {
        return this["#"] == null ? this["@"] : this["#"];
      }
    },
    flat_: {
      configurable: true,
      value (...f) {
        return this._ == null ? this._ : _.pipe(...f)(this._);
      }
    },
    flat$: {
      configurable: true,
      value (...f) {
        return this.$ == null ? this.$ : _.pipe(...f)(this.$);
      }
    },
    R: {
      configurable: true,
      value (...f) {
        return _(this.flat_(...f), this.$_);
      }
    },
    L: {
      configurable: true,
      value (...f) {
        return _(this._$, this.flat_(...f));
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

  Object.assign(_, {
    Types: (
      [Object, String, Number, (function* () {}).constructor, Date, Promise]
      .map(v => v.name)
      .reduce((p, c) => Object.assign(p, {[c]: Object.create(_.prototype)}), {})
    ),
    id: v => v,
    compose: (...a) => (
      a.length === 0 && a.push(_.id),
      a.reduce((f, g) => (...v) => f(g(...v)))
    ),
    pipe: (...a) => (
      a.length === 0 && a.push(_.id),
      a.reduceRight((f, g) => (...v) => f(g(...v)))
    ),
    lift: (f, o) => (...p) => f(o, ...p)
  });

  Object.defineProperties(_.Types.Object, {
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
          Object.entries,
          a => a.reduce((p, [k, v]) => f(k, v) && Object.assign(p, {[k]: v}), {})
        );
      }
    },
    map: {
      configurable: true,
      value (...f) {
        return _(_.pipe(...f)).flat_(
          g => this.R(
            Object.entries,
            a => a.reduce((p, [k, v]) => p.take({[k]: g(k, v)}), this)
          )
        );
      }
    },
    each: {
      configurable: true,
      value (...f) {
        return _(_.pipe(...f)).flat_(
          g => this.L(
            Object.entries,
            a => a.reduce((p, [k, v]) => g(k, v), this)
          )
        );
      }
    },
    give: {
      configurable: true,
      value (...o) {
        return this.L(p => Object.assign(...o, p));
      }
    },
    take: {
      configurable: true,
      value (...o) {
        return this.R(p => Object.assign(p, ...o));
      }
    },
    define: {
      configurable: true,
      value (o) {
        return this.R(p => Object.defineProperties(p, o));
      }
    },
    append: {
      configurable: true,
      value (o) {
        return this.R(p => Object.create(p, o))
      }
    },
    depend: {
      configurable: true,
      value (o) {
        return this.R(p => Object.create(o, p))
      }
    },
    get: {
      configurable: true,
      value (...k) {
        return this.R(o => k.reduce((p, c) => p == null ? null : p[c], o[k.shift()]));
      }
    },
    set: {
      configurable: true,
      value (v, ...k) {
        return this.flatTake(
          _({[k.pop()]: v}).R(b => k.reduceRight((p, c) => ({[c]: p}), b))
        );
      }
    },
    call: {
      configurable: true,
      value (...k) {
        return (...v) => this.R(o => this.get(...k)._.call(o, ...v));
      }
    },
    send: {
      configurable: true,
      value (...k) {
        return (...v) => this.L(o => this.get(...k)._.call(o, ...v));
      }
    },
    pick: {
      configurable: true,
      value (...k) {
        return _({}, this.$_).take(
          ...this.allKey
          .filter(v => v instanceof Array ? true : k.includes(v))
          .map(
            w => w instanceof Array ? {[w.shift()]: this.pick(...w)._} : {[w]: this.get(w)._}
          )
        );
      }
    },
    drop: {
      configurable: true,
      value (...k) {
        return _({}, this.$_).take(
          ...this.allKey
          .filter(v => v instanceof Array ? true : !k.includes(v))
          .map(
            w => w instanceof Array ? {[w.shift()]: this.drop(...w)._} : {[w]: this.get(w)._}
          )
        );
      }
    },
    keys: {
      configurable: true,
      get () {
        return this.flat_(Object.keys);
      }
    },
    allKey: {
      configurable: true,
      get () {
        return this.keys.map(
          k => this.get(k).flat_(
            o => o instanceof Object ? this.get(k).allKey.unshift(k) : k
          )
        );
      }
    },
    vals: {
      configurable: true,
      get () {
        return this.flat_(Object.values);
      }
    },
    pairs: {
      configurable: true,
      get () {
        return this.flat_(Object.entries);
      }
    }
  });

  Object.assign(_.Types, {Array: Object.create(_.Types.Object)});
  Object.defineProperties(_.Types.Array, {
    map: {
      configurable: true,
      value (...f) {
        return this.R(a => a.map(_.pipe(...f)));
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
        return this.call("reduce", f, ...v);
      }
    },
    foldR: {
      configurable: true,
      value (f, ...v) {
        return this.call("reduceRight", f, ...v);
      }
    },
    filter: {
      configurable: true,
      value (f) {
        return this.R(a => a.filter(f));
      }
    },
    chunk: {
      configurable: true,
      value (n) {
        return this.R(a => a.length == 0 ? [] : [a.slice( 0, n )].concat(a.slice(n).chunk(n)))
      }
    },
    group: {
      configurable: true,
      value (...k) {
        return this.fold(
          (p, c) => p[k].push(c[k]), k.reduce((o, w) => p.give({[w]: []}), _({}))._
        );
      } 
    },
    pushL: {
      configurable: true,
      value (...v) {
        return this.send("unshift", ...v);
      }
    },
    pushR: {
      configurable: true,
      value (...v) {
        return this.send("push", ...v);
      }
    },
    popL: {
      configurable: true,
      get () {
        return this.call("shift");
      }
    },
    popR: {
      configurable: true,
      get () {
        return this.call("pop");
      }
    },
    fMap: {
      configurable: true,
      value (...f) {
        return this.R(a => a.flatMap(_.pipe(...f)));
      }
    },
    back: {
      configurable: true,
      get () {
        return this.R(a => a.reverce());
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
      value (...v) {
        return this.call("concat", ...v);
      }
    },
    replace: {
      configurable: true,
      value (...v) {
        return this.call("splice", ...v);
      }
    },
    slice: {
      configurable: true,
      value (...v) {
        return this.call("slice", ...v);
      }
    },
    sort: {
      configurable: true,
      get () {
        return this.call("sort");
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
        return this.fold((p, c) => p < c ? c : p);
      }
    },
    min: {
      configurable: true,
      get () {
        return this.fold((p, c) => p > c ? c : p);
      }
    },
    mid: {
      configurable: true,
      get () {
        return this.lift(this.slice()._, t.sort.flat(
          a => (
            a.length === 0
            ? null
            : (
              a.length % 2 === 0
              ? (a[a.length / 2 - 1] + a[a.length / 2]) / 2
              : a[a.length / 2 - 0.5]
            )
          )
        ));
      }
    }
  });
})();