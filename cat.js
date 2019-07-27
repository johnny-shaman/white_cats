(() => {
  "use strict";
  let _ = function (p) {
    return Object.create(_.Types[p.constructor.name] || _.Types.Object, {
      _: {
        get () {
          return p;
        }
      }
    });
  }
  Object.defineProperties(_.prototype, {
    lift: {
      configurable: true,
      value (...f) {
        return _(this).endo(...f);
      }
    },
    endo: {
      configurable: true,
      value (...f) {
        return _(this.flat(...f))
      }
    },
    flat: {
      configurable: true,
      value (...f) {
        return this._ == null ? this : f.reduce((a, g) => g(a), this._)
      }
    },
    json: {
      configurable: true,
      get () {
        return this.endo(JSON.stringify);
      }
    }
  });
  Object.assign(_, {Types: {Object: Object.create(_.prototype)}});
  Object.defineProperties(_.Types.Object, {
    fold: {
      configurable: true,
      value (f) {
        return this.endo(Object.entries, (a) => a.reduce((p, [k, v]) => f(p, k, v)))
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
        return this.endo(p => Object.defineProperties(p, o));
      }
    },
    get: {
      configurable: true,
      value (...k) {
        return this.flat(o => k.reduce((p, c) => p.set({[c]: o[c]}), _({})));
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
    been: {
      configurable: true,
      get () {
        return new Proxy(this._, {
          to: this,
          _:  this._,
          get (t, k, r) {
            return r[k] != null ? r[k] : (...v) => (t[k](...v), r[k].been);
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
    foldL: {
      configurable: true,
    },
    foldR: {
      configurable: true,
    },
    pushL: {
      configurable: true,
    },
    pushR: {
      configurable: true,
    },
    popL: {
      configurable: true,
    },
    popR: {
      configurable: true,
    },
    flat: {
      configurable: true,
    }
  });
})();