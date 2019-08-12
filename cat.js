(() => {
  "use strict";

  let _ = UF = function (v, c) {
    return Object.create(_.prototype, {
      _: {
        get () {
          return v;
        }
      },
      $: {
        get () {
          return c;
        }
      }
    });
  };

  Object.defineProperties(_.prototype, {
    F: {
      configurable: true,
      value (...f) {
        return _(this, this.flat(...f));
      }
    },
    R: {
      configurable: true,
      value (...f) {
        return _(this.flat(...f), this._);
      }
    },
    U: {
      configurable: true,
      value (...f = _) {
        return _.pipe(...f)(this);
      }
    },
    C: {
      configurable: true,
      value (...f = _.id) {
        return this.flat(...f)._;
      }
    },
    lift: {
      configurable: true,
      get () {
        return this.U();
      }
    },
    take: {
      get () {
        return this.C();
      }
    },
    flat: {
      configurable: true,
      value (...f) {
        return this._ == null ? this : _.pipe(...f)(this._);
      }
    },
    json: {
      configurable: true,
      get () {
        return this.endo(JSON.stringify);
      }
    }
  });

  Object.assign(_, {
    Types: [Object, String, Number, (function* () {}).constructor, Date, Promise]
      .map(
        v => v.name
      )
      .reduce(
        (p, c) => Object.assign(p, {[c]: Object.create(_.prototype)}),
        {}
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
  });

  Object.defineProperties(_.Types.Object, {
    fold: {
      configurable: true,
      value (f, v) {
        return this.R(Object.entries, a => a.reduce((p, [k, w]) => f(p, k, w), v));
      }
    },
    map: {
      configurable: true,
      value (...f) {
        return this.L(Object.entries, a => a.reduce(p, [k, w]));
      }
    },
    filterT: {
      configurable: true,
      value (f) {
        return this.fold((p, k, v) => f(k, v) && p.give({[k]: f(k, v)}), _({}));
      }
    },
    filterF: {
      configurable: true,
      value (f) {
        return this.fold((p, k, v) => !f(k, v) && p.give({[k]: f(k, v)}), _({}));
      }
    },
    filter: {
      configurable: true,
      get () {
        return this. filterT;
      }
    },
    keys: {
      configurable: true,
      get () {
        return this.doSt(this._, Object.keys);
      }
    },
    vals: {
      configurable: true,
      get () {
        return this.doSt(this._, Object.values);
      }
    },
    pair: {
      configurable: true,
      get () {
        return this.doSt(this._, Object.entries);
      }
    },
    define: {
      configurable: true,
      value (o) {
        return this.endo(p => Object.defineProperties(p, o));
      }
    },
    pick: {
      configurable: true,
      value (...k) {
        return this.filterT(k.includes);
      }
    },
    drop: {
      value (...k) {
        return this.filterF(k.includes);
      }
    },
    give: {
      configurable: true,
      value (...o) {
        return this.L();
      }
    },
    call: {
      configurable: true,
      value (k, ...v) {
        return this.doSt(this._, o => o[k](...v));
      }
    },
    collect: {
      configurable: true,
      value ({get, call}) {
        return this.lift(this._, t => t.lift(
          t._, u => u.get(get).re.endo(
            o => _(call).pair._.reduce((p, [k, a]) => p.set({[k]: o[k].apply(o, a)}), _({}))
          ),
          u => u.give(u.$)
        ));
      }
    },
    been: {
      configurable: true,
      get () {
        return new Proxy(this._, {
          to: this,
          _:  this._,
          get (t, k, r) {
            return r[k] != null ? r[k] : (...v) => this.doSt(t, () => t[k](...v)).re;
          }
        });
      }
    }
  });

  Object.assign(_.Types, {Array: Object.create(_.Types.Object)});
  Object.defineProperties(_.Types.Array, {
    map: {
      configurable: true,
      value (...f) {
        return this.endo(a => f.reduce((a, g) => a.map(g), a));
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
    filterT: {
      configurable: true,
      value (f) {
        return this.doSt(this._, a => a.filter(f));
      }
    },
    filterF: {
      configurable: true,
      value (f) {
        return this.doSt(this._, a => a.filter((v, k) => !f(v, k)));
      }
    },
    filter: {
      configurable: true,
      value (f) {
        return this.call("filter", f);
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
        return this.call("unshift", ...v).re;
      }
    },
    pushR: {
      configurable: true,
      value (...v) {
        return this.call("push", ...v).re;
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
        return this.endo(a => f.reduce((b, g) => b.flatMap(g), a));
      }
    },
    back: {
      configurable: true,
      get () {
        return this.endo(a => a.reverce());
      }
    },
    adaptL: {
      configurable: true,
      value (...v) {
        return this.endo(
          a => Array(a.length).fill(undefined).map((_, k) => a[k] == null ? v.shift() : a[k])
        )
      }
    },
    adaptR: {
      configurable: true,
      value (...w) {
        return this.endo(
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