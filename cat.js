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
    },
    fork: {
      value (f = _.id, g = _.id) {
        return _.Pair(this.flat(f), this.flat(g));
      }
    }
  });

  _.Pair = function (R, L) {
    return Object.create(_.Types.Pair, {
      R_: {
        get () {
          return R;
        }
      },
      L_: {
        get () {
          return L;
        }
      }
    });_(f(this))
  }

  _.Types = {
    Pair: Object.create(_.prototype, {
      constructor: {
        configurable: true,
        writable: true,
        value: _.Pair
      },
      join: {
        value (...f) {
          return f(this);
        }
      },
      swap: {
        value (f = _.id, g = _.id) {
          return _.Pair(f(this.L_), g(this.R_));
        }
      },
      flat: {
        value (...f) {
          return this.fork()
        }
      },
    })
  }

  _.id = v => v;
  _.of = v => v.constructor;
  
})();