(() => {
  "use strict";

  let _ = function (v, c) {
    return Object.create(_.Types[v.constructor.name] || _.Types[v.constructor.constructor.name] || _.Types.Object, {
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
    })
  };

  Object.defineProperties(_.prototype, {
    lift: {
      configurable: true,
      value (s, ...f) {
        return _(this, s).endo(...f)
      }
    },
    endo: {
      configurable: true,
      value (...f) {
        return _(this.flat(...f), this.$);
      }
    },
    flat: {
      configurable: true,
      value (...f) {
        return this._ == null ? this : f.reduce((a, g) => g(a), this._);
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
    id: v => v
  });

  Object.defineProperties(_.Types.Object, {
    fold: {
      configurable: true,
      value (f) {
        return this.lift(this._, t => t.flat(
          Object.entries, a => a.reduce((p, [k, v]) => f(p, k, v))
        ));
      }
    },
    keys: {
      configurable: true,
      get () {
        return this.lift(this._, t => t.flat(Object.keys));
      }
    },
    vals: {
      configurable: true,
      get () {
        return this.lift(this._, t => t.flat(Object.values));
      }
    },
    sets: {
      configurable: true,
      get () {
        return this.lift(this._, t => t.flat(Object.entries));
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
        return this.lift(this._, t => t.flat(
          o => k.reduce((p, c) => p.put({[c]: o[c]}), _({}))
        ));
      }
    },
    drop: {
      //Not Implemented!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      configurable: true,
      value (...k) {
        return this.lift(this._, t => t.flat(
          o => k.reduce((p, c) => p.put({[c]: o[c]}), _({}))
        ));
      }
    },
    put: {
      configurable: true,
      value (...o) {
        return this.endo(p => Object.assign(p, ...o));
      }
    },
    call: {
      configurable: true,
      value (k, ...v) {
        return this.lift(this._, t => t.flat(o => o[k](...v)));
      }
    },
    collect: {
      configurable: true,
      value ({get, call}) {
        return this.lift(this._, t => t.lift(
          t._, u => u.get(get).swap.endo(
            o => _(call).sets._.reduce((p, [k, a]) => p.set({[k]: o[k].apply(o, a)}), _({}))
          ),
          u => u.put(u.$)
        ));
      }
    },
    map: {
      configurable: true,
      value (f) {
        return this.endo(Object.entries, a => a.reduce((p, [k, v]) => p.put({[k]: f(k, v)}), this));
      }
    },
    been: {
      configurable: true,
      get () {
        return new Proxy(this._, {
          to: this,
          _:  this._,
          get (t, k, r) {
            return r[k] != null ? r[k] : (...v) => this.endo(o => t[k](...v), () => t);
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
    filter: {
      configurable: true,
      value (...f) {
        return this.lift(this._, t => f.reduce((a, g) => a.filter(g), t._));
      }
    },
    pushL: {
      configurable: true,
      value (...v) {
        return this.call("unshift", ...v).swap;
      }
    },
    pushR: {
      configurable: true,
      value (...v) {
        return this.call("push", ...v).swap;
      }
    },
    popL: {
      configurable: true,
      get () {
        return this.call("shift").swap;        
      }
    },
    popR: {
      configurable: true,
      get () {
        return this.call("pop").swap;        
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
        return this.map(w => w == null && v.shift())
      }
    },
    adaptR: {
      configurable: true,
      value (...w) {
        return this.endo(
          a => a.reverse(),
          a => a.map(w => w == null && v.shift()),
          a.reverse()
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
        return this.endo(a => a.concat(...v));
      }
    }
  });
})();