(() => {
  "use strict";
  let _ = function (p) {
    return Object.create(_.Types[p.constructor.name] || _.prototype, {
      _: {
        get () {
          return p;
        }
      }
    });
  }
  Object.defineProperties(_.prototype, {
    lift: {
      value (...f) {
        return _(this).endo(...f);
      }
    },
    endo: {
      value (...f) {
        return _(this.flat(...f))
      }
    },
    flat: {
      value (...f) {
        return this._ == null ? this : f.reduce((a, g) => g(a), this._)
      }
    }
  });
  Object.assign(_, {
    Types: Object.create(Object.prototype, {
      Object: {
        value: Object.create(_.prototype, {
          fold: {
            value (f) {
              return this.endo(Object.entries, (a) => a.reduce((p, [k, v]) => f(p, k, v)))
            }
          },
          keys: {
            get () {
              return this.endo(Object.keys);
            }
          },
          vals: {
            get () {
              return this.endo(Object.values);
            }
          },
          entries: {
            get () {
              return this.endo(Object.entries);
            }
          },
          define: {
            value (o) {
              return this.endo(p => Object.defineProperties(p, o));
            }
          },
          get: {
            value (...k) {
              return this.lift(t => k.reduce((p, c) => p.set));
            }
          },
          set: {
            value (...o) {
              return this.endo(p => Object.assign(p, ...o));
            }
          },
          call: {
            value (k, ...v) {
              return this.endo(o => o[k](...v));
            }
          },
          been: {
            get () {
              return new Proxy(this._, {
                get (t, k) {
                  switch (k) {
                    case 'to': return this;
                    case '_': return this._;
                    default: return (...v) => t[k].constructor === Function && t[k](...v) , t;
                  }
                }
              })
            }
          }
        })
      },
      Array: {

      }
    })
  });
})();