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
          get: {
            value (k) {
              return this.endo(o => o[k]);
            }
          },
          set: {
            value (k, v) {
              return this.endo(o => (o[k] = v, o));
            }
          },
        })
      },
      Array: {

      }
    })
  });
})();