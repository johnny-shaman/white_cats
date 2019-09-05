(() => {
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

  Object.defineProperties(_.prototype, {
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
    flatR: {
      configurable: true,
      value (...f) {
        return this._ == null ? this._ : _.pipe(...f)(this._);
      }
    },
    flatL: {
      configurable: true,
      value (...f) {
        return this.$ == null ? _.pipe(...f)(this._) : _.pipe(...f)(this.$);
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
    use: {
      configurable: true,
      get () {
        return this.L;
      }
    },
    fit: {
      configurable: true,
      get () {
        return this.R;
      }
    },
    liftR: {
      configurable: true,
      value (...f) {
        return this.R(() => _.pipe(...f)(this).flatR(_.id))
      }
    },
    liftL: {
      configurable: true,
      value (...f) {
        return this.L(() => _.pipe(...f)(this).flatL(_.id))
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
    )
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
        return this.R(
          Object.entries,
          a => a.reduce((p, [k, v]) => p.take({[k]: _.pipe(...f)(k, v)}), this)
        );
      }
    },
    each: {
      configurable: true,
      value (...f) {
        return this.L(
          Object.entries,
          a => a.reduce((p, [k, v]) => _.pipe(...f)(k, v), this)
        );
      }
    },
    put: {
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
      value (...k) {
        return (v) => this.take(
          _({[k.pop()]: v}).flatR(b => k.reduceRight((p, c) => ({[c]: p}), b))
        );
      }
    },
    call: {
      configurable: true,
      value (...k) {
        return (...v) => this.R(o => this.get(...k)._.call(o, ...v));
      }
    },
    cast: {
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
            w => (
              w instanceof Array
              ? {[w.shift()]: this.pick(...w)._}
              : _({}).define({[w]: {get : () => this.get(w)._}})._
            )
          )._
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
            w => (
              w instanceof Array
              ? {[w.shift()]: this.drop(...w)._}
              : _({}).define({[w]: {get : () => this.get(w)._}})._
            )
          )._
        );
      }
    },
    keys: {
      configurable: true,
      get () {
        return this.R(Object.keys);
      }
    },
    allKey: {
      configurable: true,
      get () {
        return this.keys.map(
          k => this.get(k).flatR(
            o => o instanceof Object ? this.get(k).allKey.pushL(k) : k
          )
        );
      }
    },
    vals: {
      configurable: true,
      get () {
        return this.R(Object.values);
      }
    },
    entries: {
      configurable: true,
      get () {
        return this.R(Object.entries);
      }
    },
    fullen: {
      configurable: true,
      get () {
        return this.vals.fold((p, c) => c != null && p, true)._
      }
    }
  });

  Object.assign(_.Types, {Array: Object.create(_.Types.Object)});
  Object.defineProperties(_.Types.Array, {
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
    chunk: {
      configurable: true,
      get () {
        return this.lift;
      }
    },
    lift: {
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
    pick: {
      configurable: true,
      value (...k) {
        return this.fold(
          (p, c) => p.map((d, a) => a.push(c[d]))._,
          k.reduce((o, d) => o.put({[d]: []}), _({}))
        )
      }
    },
    drop: {
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
})();