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
    eq: {
      configurable: true,
      value (f) {
        return (...g) => this.flat(f) ? this.endo(...g) : this;
      }
    },
    nt: {
      configurable: true,
      value (f) {
        return (...g) => this.flat(f) ? this : this.endo(...g);
      }
    },
    is: {
      configurable: true,
      value (t) {
        return this.eq(o => o.constructor === t);
      }
    },
    of: {
      configurable: true,
      value (t) {
        return this.eq(o => o instanceof t);
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
    entries: {
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
          get (t, k) {
            switch (k) {
              case 'to': return this;
              case '_': return this._;
              default: return (...v) => t[k].constructor === Function && t[k](...v) , this.been;
            }
          }
        });
      }
    }
  });
})();