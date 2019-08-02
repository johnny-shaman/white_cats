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
      value (...f) {
        return _(this).endo(...f)
      }
    },
    endo: {
      configurable: true,
      value (...f) {
        return _(this.flat(...f));
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
    fork: {
      configurable: true,
      value (...f) {
        return (...g) => _(this.flat(...f), this.flat(...g));
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
        return this.endo(Object.entries, a => a.reduce((p, [k, v]) => f(p, k, v)));
      }
    },
    keys: {
      configurable: true,
      get () {
        return this.endo(Object.keys);
      }
    },
    vals: {
      configurable: true,
      get () {
        return this.endo(Object.values);
      }
    },
    sets: {
      configurable: true,
      get () {
        return this.endo(Object.entries);
      }
    },
    define: {
      configurable: true,
      value (o) {
        return this.mapR(p => Object.defineProperties(p, o));
      }
    },
    get: {
      configurable: true,
      value (...k) {
        return this.endo(o => k.reduce((p, c) => p.set({[c]: o[c]}), _({})));
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
        return this.endo(o => o[k](...v));
      }
    },
    collect: {
      configurable: true,
      value ({get, call}) {
        return _(
          this._,
          this
          .fork(
            o => get.reduce((p, c) => p.set({[c]: o[c]}), _({}))
          )(
            o => _(call).sets.R._.reduce((p, [k, a]) => p.set({[k]: o[k].apply(o, a)}), _({}))
          )
          .put(this.$)
        );
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
        return new Proxy(this.fork(_.id)(_.id).$, {
          to: this.swap,
          _:  this._,
          get (t, k, r) {
            return r[k] != null ? r[k] : (...v) => (t[k](...v), this.been);
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
      value (f) {
        return this.endo(a => a.reduce(f));
      }
    },
    foldR: {
      configurable: true,
      value (f) {
        return this.endo(a => a.reduceRight(f));
      }
    },
    pushL: {
      configurable: true,
      value (...v) {
        return this.endo(a => a.unshift(...v));
      }
    },
    pushR: {
      configurable: true,
      value (...v) {
        return this.endo(a => a.push(...v));
      }
    },
    popL: {
      configurable: true,
      get () {
        
      }
    },
    popR: {
      configurable: true,
    },
    flat: {
      configurable: true,
    }
  });
})();