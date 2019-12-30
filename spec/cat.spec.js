describe("White Cats", function () {
  'use strict';
  const _ = require('../cat.js');

  const sp = function (a, b, c) {
    _.put(this, {a, b, c});
  }
  _.put(sp.prototype, {
    ad (v) {
      this.a = this.a + v;
      this.b = this.a + this.b;
      this.c = this.b + this.c;
      return [this.a, this.b, this.c];
    },
    mt (v) {
      this.a = this.a * v;
      this.b = this.a * this.b;
      this.c = this.b * this.c;
      return [this.a, this.b, this.c];
    },
    sb (v) {
      this.a = this.a - v;
      this.b = this.a - this.b;
      this.c = this.b - this.c;
      return [this.a, this.b, this.c];
    },
    dv (v) {
      this.a = this.a / v;
      this.b = this.a / this.b;
      this.c = this.b / this.c;
      return [this.a, this.b, this.c];
    },
    prog (...v) {
      return [...v, this.c]
    }
  });

  const O = (a, b, c) => Object.create(
    sp.prototype,
    {
      a:{
        configurable: true,
        writable: true,
        enumerable: true,
        value: a
      },
      b:{
        configurable: true,
        writable: true,
        enumerable: true,
        value: b
      },
      c:{
        configurable: true,
        writable: true,
        enumerable: true,
        value: c
      },
    }
  );

  const fixed = Object.freeze({a: true, b: true});
  const TA = [..._._(15)];


  it('_.id',
    () => expect(
      _.id(57)
    )
    .toBe( 57 )
  );

  it('_.pipe',
    () => {
      const f = v => v * 2,
            g = v => v + 5,
            h = v => v * 10;

      expect(
        _.pipe(f, g, h)(5)
      )
      .toBe( 150 );

      expect(
        isNaN(_.pipe(f, g, h)())
      )
      .toBe(true);

      expect(
        _.pipe(
          f,
          v => ({}).push(v),
          h
        )(1)[0]
      )
      .toBe(2);
    }
  );

  it('_.loop',
    () => {
      const f = o => o.ad( 5 ),
            g = o => o.mt( 2 ),
            h = o => o.ad( 3 );

      expect(
        _.loop(f, g, h)( O(3, 5, 7) )
        .c
      ).toBe(
        4387
      );

      expect(
        _.loop(f, g, h)()
      ).toBe();

      expect(
        _.loop(
          f,
          o => ({}).push(o),
          h
        )( O(3, 5, 7) ).c
      ).toBe( 20 );
    }
  );

  it('_.upto',
    () => {
      const target = _.upto(fixed, {c: {value: false}});
      expect( target.c ).toBe( false );
      expect( Object.getPrototypeOf(target) ).toBe( fixed );
    }
  );

  it('_.put',
    () => {
      const target = {a: 5, b: 3};
      expect( _.put(target, {c: 7}) ).toBe( target );
      expect( target.c ).toBe( 7 );
    }
  );

  it('_.give',
    () => {
      expect(JSON.stringify(
        _.give(
          {a: 4, b: {d: {f: 8, g: {h: 9, i: 10}}}}
        )(
          {a: 3, b: {c: 4, d: {e: 6}}}
        )
      )).toBe(JSON.stringify(
        {a: 4, b: {c: 4, d: {e: 6, f: 8, g: {h: 9, i: 10}}}}
      ));

      expect(JSON.stringify(
        _.give(
          {a: 4, b: {d: {f: 8}, g: {h: 9, i: 10}}}
        )(
          {a: 3, b: {c: 4, d: {e: 6}}}
        )
      )).toBe(JSON.stringify(
        {a: 4, b: {c: 4, d: {e: 6, f: 8}, g: {h: 9, i: 10}}}
      ));

      expect(JSON.stringify(
        _.give(
          {a: 3, b: {c: 4, d: {e: 6}}}
        )(
          {a: 4, b: {d: {f: 8, g: {h: 9, i: 10}}}}
        )
      )).toBe(JSON.stringify(
        {a: 3, b: {d: {f: 8, g: {h: 9, i: 10}, e: 6}, c: 4}}
      ));

      expect(JSON.stringify(
        _.give(
          {a: 3, b: {c: 4, d: {e: 6}}}
        )(
          {a: 4, b: {d: {f: 8}, g: {h: 9, i: 10}}}
        )
      )).toBe(JSON.stringify(
        {a: 3, b: {d: {f: 8, e: 6}, g: {h: 9, i: 10}, c: 4}}
      ));
    }
  )

  it('_.define',
    () => {
      const target = {a: 5, b: 3};
      expect( _.define(target, 'c', {value: 1}) ).toBe( target );
      expect( target.c ).toBe( 1 );
    }
  );

  it('_.defines',
    () => {
      const target = {a: 5, b: 3};
      expect( _.defines(target, {c: {value: 1}, d: {value: 2}}) ).toBe( target );
      expect( target.c ).toBe( 1 );
      expect( target.d ).toBe( 2 );
    }
  );

  it('_.keys',
    () => expect(
      _.keys({a: 5, b: 6})
    )
    .toEqual( ['a', 'b'] )
  );

  it('_.vals',
    () => expect(
      _.vals({a: 5, b: 6})
    )
    .toEqual( [5, 6] )
  );

  it('_.entries',
    () => expect(
      _.entries({a: 5, b: 6})
    ).toEqual(
      [['a', 5], ['b', 6]]
    )
  );

  it('_.equal',
    () => {
      const foo = { a: 1 };
      const bar = { a: 1 };
      expect( _.equal('foo', 'foo') ).toBe( Object.is('foo', 'foo') );
      expect( _.equal('foo', 'bar') ).toBe( Object.is('foo', 'bar') );
      expect( _.equal([], []) ).toBe( Object.is([], []) );
      expect( _.equal(foo, foo) ).toBe( Object.is(foo, foo) );
      expect( _.equal(foo, bar) ).toBe( Object.is(foo, bar) );
      expect( _.equal(null, null) ).toBe( Object.is(null, null) );
      expect( _.equal(0, -0) ).toBe( Object.is(0, -0) );
      expect( _.equal(-0, -0) ).toBe( Object.is(-0, -0) );
      expect( _.equal(NaN, 0/0) ).toBe( Object.is(NaN, 0/0) );
    }
  );

  it('_.owns',
    () => {
      const target = O(3, 4, 5);

      expect(
        _.owns(target)
      ).toEqual(
        Object.getOwnPropertyNames(target)
        .concat(
          Object.getOwnPropertySymbols(target)
        )
      );
    }
  );

  it('_.descripting',
    () => expect(
      _.descripting({
        a: 5,
        b: 6
      })
    ).toEqual(
      Object.getOwnPropertyDescriptors({
        a: 5,
        b: 6
      })
    )
  );

  it('_.adapt',
    () => expect(
      _.adapt(1, 2, 5)([,,3,4,,6])
    ).toEqual(
      [1, 2, 3, 4, 5, 6]
    )
  );

  it('_.adaptL',
    () => expect(
      _.adaptL(1, 2, 5)([,,3,4,,6])
    ).toEqual(
      [1, 2, 3, 4, 5, 6]
    )
  );

  it('_.adaptR',
    () => expect(
      _.adaptR(1, 2, 5)([,,3,4,,6])
    ).toEqual(
      [5, 2, 3, 4, 1, 6]
    )
  );

  it('_.less',
    () => expect(
      _.less([,null,void 0, 3, 4, 5])
    ).toEqual(
      [3, 4, 5]
    )
  );

  it('_.sure',
    () => expect(
      _.sure([ , , ,0 , 3, 4, 5])
    ).toEqual(
      [undefined, undefined, undefined, 0, 3, 4, 5]
    )
  );

  it('_.by',
    () => {
      expect(
        _.by([])
      ).toBe(
        [].constructor
      );

      expect(
        _.by()
      ).toBe();
    }
  );

  it('_.isObject',
    () => {
      expect(
        _.isObject({})
      )
      .toBe(
        true
      );
      expect(
        _.isObject(8)
      )
      .toBe(
        false
      );
    }
  );

  it('_.isArray',
    () => {
      expect(
        _.isArray([])
      )
      .toBe(
        true
      );
      expect(
        _.isArray({})
      )
      .toBe(
        false
      );
    }
  );

  it('_._',
    () => {
      expect(
        [..._._(0, 8, 2)]
      )
      .toEqual(
        [0, 2, 4, 6, 8]
      );

      expect(
        [..._._(8, 0, -2)]
      )
      .toEqual(
        [8, 6, 4, 2, 0]
      );

      expect(
        [..._._(5)]
      )
      .toEqual(
        [0, 1, 2, 3, 4, 5]
      );
    }
  );

  it('_.async',
    () => _.async(r => r(3)).then(
      v => expect(
        v
      )
      .toBe(
        3
      )
    )
  );

  it('_.asyncAll',
    () => _.asyncAll(
      _.async(r => r(3)),
      _.async(r => r(4)),
      _.async(r => r(5))
    )
    .then(
      a => expect(
      a
      ).toEqual(
        [3, 4, 5]
      )
    )
  );

  it('_().$_',
    () => {
      expect(
        _(3).$_
      ).toBe(
        3
      );
      expect(
        _(3, 4).$_
      ).toBe(
        4
      );
    }
  );

  it('_()._$',
    () => {
      expect(
        _(3)._$
      ).toBe(
        3
      );
      expect(
        _(3, 4)._$
      ).toBe(
        3
      );
      expect(
        _(null, 4)._$
      ).toBe(
        4
      )
    }
  );

  it('_().re',
    () => expect(
      _(3, 4).re._
    ).toBe(
      4
    )
  );

  it('_().flat has Kleisli Triple and function piping',
    () => {
      expect(
        _({a: 5}).flat(o => _({a: o.a * 3}))._
      ).toEqual(
        (o => _({a: o.a * 3}))({a: 5})._
      );

      expect(
        _({a: 5}).flat(_).flat(_)._
      ).toEqual(
        {a: 5}
      );

      expect(
        _({a: 5}).flat(o => _({a: o.a * 3})).flat(o => _({a: o.a + 5}))._
      ).toEqual(
        _({a: 5}).flat(o => _({a: o.a * 3}).flat(o => _({a: o.a + 5})))._
      );
    }
  );

  it('_().pipe',
    () => expect(
      _({a: 5})
      .pipe(
        o => ({a: o.a * 3}),
        o => ({a: o.a + 5})
      )
      ._
    ).toEqual(
      {a: 20}
    )
  );

  it('_().loop',
    () => expect(
      _(O(3, 5, 7))
      .loop(
        o => o.ad( 5 ),
        o => o.mt( 2 ),
        o => o.ad( 3 )
      )
      ._
      .c
    ).toBe(
      4387
    )
  );

  it('_().call',
    () => {
      expect(
        _(O(3, 5, 7)).call('prog')(5, 6)._
      ).toEqual(
        [5, 6, 7]
      );

      expect(
        _(O(3, 5, 7)).call('a')(5, 6)._
      ).toBe(
        3
      );

      expect(
        _(O(3, 5, 7)).call('d')(5, 6)._
      ).toBe(
        undefined
      );
    }
  );

  it('_().s_r',
    () => {
      const o = O(3, 5, 7);
      const t = [];
      expect(
        _(o).s_r('prog')(5, 6)(a => a.map(v => t.push(v)))._
      ).toBe(
        o
      );

      expect(
        _(o).s_r('a')(5)((w, v) => t.push(v + w))._
      ).toBe(
        o
      );

      expect(
        _(o).s_r('d')()()._
      ).toBe(
        o
      );

      expect(
        t
      ).toEqual(
        [5, 6, 7, 8]
      );
    }
  );

  it('_().cast',
    () => {
      const o = O(3, 5, 7);
      expect(
        _(o).cast('prog')(5, 6)._
      ).toBe(
        o
      );

      expect(
        _(o).cast('a')(5, 6)._
      ).toBe(
        o
      );

      expect(
        _(o).cast('d.e')(5, 6)._
      ).toBe(
        o
      );

      expect(
        o.a
      ).toBe(
        3
      );
    }
  );

  it('_().Been',
    () => {
      const r = [];
      expect(
      _(O(0, 5, 2))
        .Been
        .a(3)(_.alter)
        .b(10)()
        .c(5)((v, w) => v + w)
        .ad( 5 )(a => a.map(v => r.push(v)))
        .mt( 2 )(a => a.map(v => r.push(v)))
        .ad( 3 )(a => a.map(v => r.push(v)))
        .To
        ._
        .c
      ).toBe(
        4387
      );

      expect(
        r
      ).toEqual(
        [8, 13, 20, 16, 208, 4160, 19, 227, 4387]
      )
    }
  );

  it('_().toJSON',
    () => {
      expect(
        _(O(3, 5, 7)).toJSON._
      ).toBe(
        JSON.stringify(O(3, 5, 7))
      );
      expect(
        _(null).toJSON._
      ).toBe(
        'null'
      )
    }
  );

  it('_(async).then',
    () => _(_.async(r => r([3, 5, 7]))).then(
      a => _.async(r => r(a.push(11))),
      a => a.push(13),
      a => _.async(r => r(a.push(17))),
      a => _.async(r => r(a.push(19))),
      a => expect(
        a
      ).toEqual(
        [3, 5, 7, 11, 13, 17, 19]
      )
    )._
  );

  it('_(function*).take',
    () => expect(
      _((function* (x) {
        while (true) {
          yield x++;
        }
      })(0)).take(5)._
    ).toEqual(
      [0, 1, 2, 3, 4]
    )
  );

  it('_({}).filter',
    () => expect(
      _({a: 5, b: 4, c: 3, d: 2, e : 1})
      .filter(v => v < 4)
      .keys
      ._
    ).toEqual(
      ['c', 'd', 'e']
    )
  );

  it('_({}).each',
    () => {
      const x = {d: 3, e: 4, f: 5};
      const y = {};
      const z = {};

      expect(
        _(x)
        .each(
          (k, v) => _.put(y, {[`${k.toUpperCase()}`]: v + 5}),
          (k, v) => _.put(z, {[`${k}z`]: v})
        )
        .take(y, z)
        ._
      ).toBe(
        x
      );

      expect(
        _(x).keys._
      ).toEqual(
        ['d','e','f', 'D', 'E', 'F', 'dz', 'ez', 'fz']
      );
    }
  );

  it('_({}).map',
    () => expect(
      _({a: 5, b: 4, c: 6}).map(v => v + 5).vals._
    ).toEqual(
      [10, 9, 11]
    )
  );

  it('_({}).get',
    () => {
      expect(
        _({a: 3, b: {c: 4, d: {e: 6}}}).get('b.d.e')._
      ).toBe(
        6
      );

      expect(
        _({a: 3, b: {c: 4, d: {e: 6}}}).get('b.e.f')._
      ).toBe(
        undefined
      );
    }
  );

  it('_({}).set',
    () => {
      expect(
        _({a: 3, b: {c: 4, d: {e: 6}}}).set('b.d.e')(3)._.b.d.e
      ).toBe(
        3
      );

      expect(
        _({a: 3, b: {c: 4, d: {e: 6}}}).set('b.c.f')(3)._.b.c.f
      ).toBe(
        3
      );
    }
  );

  it('_({}).put',
    () => expect(
      _({a: 3, b: {c: 4, d: {e: 6}}}).get('b.d').put({f: 7}).$_
    ).toEqual(
      {a: 3, b: {c: 4, d: {e: 6, f: 7}}}
    )
  );

  it('_({}).cut',
    () => {
      expect(
        _({a: 3, b: {c: 4, d: {e: 6}}}).cut('b.d')._
      ).toEqual(
        {a: 3, b: {c: 4}}
      );

      expect(
        _({a: 3, b: {c: 4, d: {e: 6}}}).cut('b.e')._
      ).toEqual(
        {a: 3, b: {c: 4, d: {e: 6}}}
      );

      expect(
        _({a: 3, b: {c: 4, d: {e: 6}}}).cut('c.d.e')._
      ).toEqual(
        {a: 3, b: {c: 4, d: {e: 6}}}
      );
    }
  );

  it('_({}).mend',
    () => expect(
      _({a: 3, b: {c: 4, d: {e: 6}}}).mend('b.d.e')(v => v * 3)._.b.d.e
    ).toBe(
      18
    )
  );

  it('_({}).modify',
    () => expect(
      _({a: 3, b: {c: 4, d: {e: 6}}}).modify('b.d.e')(4)((v, w) => v * w)._.b.d.e
    ).toBe(
      24
    )
  );

  it('_({}).give',
    () => expect(
      _({a: 3, b: {c: 4, d: {e: 6}}})
      .give(
        {a: 4, b: {d: {f: 8}, g: {h: 9, i: 10}}},
        {b: {d: {g: {j: 11, k: {l: 12}}}}},
        {b: {g: {j: 13, k: {l: 14}}}}
      )
      ._
    ).toEqual({
      b : {
        g : { j : 13, k : { l : 14 }, h : 9, i : 10 },
        d : { g : { j : 11, k : { l : 12 } }, f : 8, e : 6 },
        c : 4
      }, a : 3
    })
  );

  it('_({}).take',
    () => expect(
      _({a: 3, b: {c: 4, d: {e: 6}}})
      .take(
        {a: 4, b: {d: {f: 8}, g: {h: 9, i: 10}}},
        {b: {d: {g: {j: 11, k: {l: 12}}}}},
        {b: {g: {j: 13, k: {l: 14}}}}
      )
      .toJSON
      ._
    ).toBe(
      JSON.stringify({
        a: 4, b: {
          c: 4, d: {
            e: 6, f: 8, g: {
              j: 11, k: {l: 12}
            }
          },
          g: {
            h: 9, i: 10, j: 13, k: {l: 14}
          }
        }
      })
    )
  );

  it('_({}).define',
    () => {
      const target = {a: 5, b: 3};
      expect( _(target).define({c: {value: 1}, d: {value: 2}})._ ).toBe( target );
      expect( target.c ).toBe( 1 );
      expect( target.d ).toBe( 2 );
    }
  );

  it('_({}).append',
    () => {
      const target = _(fixed).append({c: {value: false}})._;
      expect( target.c ).toBe( false );
      expect( Object.getPrototypeOf(target) ).toBe( fixed );
    }
  );

  it('_({}).depend',
    () => {
      const target = _({c: {value: false}}).depend(fixed)._;
      expect( target.c ).toBe( false );
      expect( Object.getPrototypeOf(target) ).toBe( fixed );
    }
  );

  it('_({}).pick',
    () => {
      expect(
        _({
          a: 4, b: {
            c: 4, d: {
              e: 6, f: 8, g: {
                j: 11, k: {l: 12}
              }
            },
            g: {
              h: 9, i: 10, j: 13, k: {l: 14}
            }
          }
        })
        .pick('a, b[c, d[e, g.k], g[j, k]]')
        .toJSON
        ._
      ).toBe(
        JSON.stringify({
          a: 4, b: {
            c: 4, d: {
              e: 6, g: {
                k: {l: 12}
              }
            },
            g: {
              j: 13, k: {l: 14}
            }
          }
        })
      );
      expect(
        _({
          a: 4, b: {
            c: 4, d: {
              e: 6, f: 8, g: {
                j: 11, k: {l: 12}
              }
            },
            g: {
              h: 9, i: 10, j: 13, k: {l: 14}
            }
          }
        })
        .pick('a, b.g')
        .toJSON
        ._
      ).toBe(
        JSON.stringify({
          a: 4, b: {
            g: {
              h: 9, i: 10, j: 13, k: {l: 14}
            }
          }
        })
      );
    }
  );

  it('_({}).drop',
    () => expect(
      _({
        a: 4, b: {
          c: 4, d: {
            e: 6, f: 8, g: {
              j: 11, k: {l: 12}
            }
          },
          g: {
            h: 9, i: 10, j: 13, k: {l: 14}
          }
        }
      })
      .drop('a, b[c, d[e, g.k], g[j, k]]')
      .toJSON
      ._
    ).toBe(
      JSON.stringify({
        b: {
          d: {
            f: 8, g: {
              j: 11
            }
          },
          g: {
            h: 9, i: 10,
          }
        }
      })
    )
  );

  it('_().keys',
    () => expect(
      _({a: 5, b: 6}).keys._
    ).toEqual(
      ['a', 'b']
    )
  );

  it('_().vals',
    () => expect(
      _({a: 5, b: 6}).vals._
    ).toEqual(
      [5, 6]
    )
  );

  it('_().entries',
    () => expect(
      _({a: 5, b: 6}).entries._
    ).toEqual(
      [['a', 5], ['b', 6]]
    )
  );

  it('_().toDate',
    () => expect(
      _({}).toDate._.valueOf()
    ).toBe(
      new Date(0).valueOf()
    )
  );

  it('_().toDateUTC',
  () => expect(
    _({}).toDateUTC._.getTime()
  ).toBe(
    new Date(0).getTime()
  )
);

  (() => {
    let csp = _(function (...a) {
      sp.call(this, ...a)
    })
    .delegate(sp)
    .prepends({
      admt (x) {
        this.mt(x);
        this.ad(x);
      }
    })
    .implements({
      sbdv : {
        configurable: true,
        value (x) {
          this.dv(x);
          this.sb(x);
        }
      }
    })
    ._;

    let t = new csp(1,2,3);

    it('_(constructor) methods',
      () =>{
        expect(
          t.constructor
        ).toBe(
          csp
        );

        t.admt(4);

        expect(
          t.a
        ).toBe(
          8
        );

        t.sbdv(2)

        expect(
          t.a
        ).toBe(
          2
        )
      }
    );
  })()

  it('_(function).take([]) is partial applying and .of means args.push .to means args.unshift what cut to overflow args and run once it',
    () => {
      expect(
        _((...a) => a.reduce((p, c) => p + c))
        .take([,,3,,,])
        .to(1, 2)
        .of(4, 5)
        .to(..._._(14))
        .of(..._._(11))
        ._
      ).toBe(
        15
      );

      expect(
        _((...a) => a.reduce((p, c) => p + c))
        .take([,,3,,,])
        .of(4, 5)
        .to(1, 2)
        .of(..._._(11))
        .to(..._._(14))
        ._
      ).toBe(
        15
      );
    }
  );

  it('_(function).each is applying each value',
    () => expect(
      _(v => v * 3).each(3, 5, 7)._
    ).toEqual(
      [9, 15, 21]
    )
  );

  it('_(function).done is manageing onto delaying and forceing or applying',
    () => {
      expect(
      _(v => v * 5)
      .done(3)
      .done(4)
      .done(5)
      ._
      ).toBe(
        15
      );
    }
  );

  it('_([]).liken',
    () => {
      expect(
        _(TA).liken([1, 100, 2, 200, 3, 300])._
      ).toEqual(
        [1, 2, 3]
      );

      expect(
        TA
      ).toEqual(
        [..._._(15)]
      );
    }
  );

  it('_([]).equaly',
    () => {
      expect(
        _(TA).equaly([1, 1, 2, 3, 5, 8])._
      ).toEqual(
        [1, 2, 3]
      );

      expect(
        TA
      ).toEqual(
        [..._._(15)]
      );
    }
  );

  it('_([]).toggle',
    () => {
      expect(
        _(TA).toggle(..._._(0, 15, 2), ..._._(16, 18))._
      ).toEqual(
        [1, 3, 5, 7, 9, 11, 13, 16, 17, 18]
      );

      expect(
        TA
      ).toEqual(
        [..._._(15)]
      );
    }
  );

  it('_([]).pick',
    () => {
      expect(
        _(TA).pick(-1, 2 ,5 ,6)._
      ).toEqual(
        [2, 5, 6]
      );

      expect(
        TA
      ).toEqual(
        [..._._(15)]
      );
    }
  );

  it('_([]).drop',
    () => {
      expect(
        _(TA).drop(..._._(0, 19, 2))._
      ).toEqual(
        [1, 3, 5, 7, 9, 11, 13, 15]
      );

      expect(
        TA
      ).toEqual(
        [..._._(15)]
      );
    }
  );

  it('_([]).chunk',
    () => {
      expect(
        _(TA).drop(..._._(0, 19, 2)).chunk(2)._
      ).toEqual(
        [[1, 3], [5, 7], [9, 11], [13, 15]]
      );

      expect(
        TA
      ).toEqual(
        [..._._(15)]
      );
    }
  );

  it('_([]).unique',
    () => {
      expect(
        _(TA).filter(v => v < 6).concat([..._._(2, 8, 2)]).unique._
      ).toEqual(
        [0, 1, 2, 3, 4, 5, 6, 8]
      );

      expect(
        TA
      ).toEqual(
        [..._._(15)]
      );
    }
  );

  it('_([]).union',
    () => {
      expect(
        _(TA).filter(v => v < 6).union([..._._(2, 8, 2)])._
      ).toEqual(
        [0, 1, 2, 3, 4, 5, 6, 8]
      );

      expect(
        TA
      ).toEqual(
        [..._._(15)]
      );
    }
  );

  it('_([]).put',
    () => {
      expect(
        _([3, 4, 5, 6, 7]).put([,,3,4,,,8,9])._
      ).toEqual(
        [3, 4, 3, 4, 7]
      )

      expect(
        _([3,,5,,7]).put([7, 8, 9, 10])._
      ).toEqual(
        [7, undefined, 9, undefined, 7]
      )

      expect(
        _(TA).filter(v => v < 6).put([..._._(2, 8, 2)])._
      ).toEqual(
        [2, 4, 6, 8, 4, 5]
      );

      expect(
        TA
      ).toEqual(
        [..._._(15)]
      );
    }
  );

  it('_([]).exist is includes',
    () => {
      expect(
        _(TA).exist(8)._
      ).toBe(
        true
      );

      expect(
        _(TA).exist(20)._
      ).toBe(
        false
      );

      expect(
        TA
      ).toEqual(
        [..._._(15)]
      );
    }
  );

  it('_([]).pickKey',
    () => {
      expect(
        _([
          {a: 30, b: 40, c: 50},
          {a: 31, b: 41, c: 51},
          {a: 32, b: 42, c: 52},
          {a: 33, b: 43, c: 53}
        ])
        .pickKey('a, c')
        ._
      ).toEqual(
        [
          {a: 30, c: 50},
          {a: 31, c: 51},
          {a: 32, c: 52},
          {a: 33, c: 53}
        ]
      );
    }
  );

  it('_([]).dropKey',
    () => {
      expect(
        _([
          {a: 30, b: 40, c: 50},
          {a: 31, b: 41, c: 51},
          {a: 32, b: 42, c: 52},
          {a: 33, b: 43, c: 53}
        ])
        .dropKey('a, c')
        ._
      ).toEqual(
        [
          {b: 40},
          {b: 41},
          {b: 42},
          {b: 43}
        ]
      );
    }
  );

  it('_([]).pushL',
    () => expect(
      _([1, 2, 3]).pushL(-1, 0)._
    ).toEqual(
      [-1, 0, 1, 2, 3]
    )
  );

  it('_([]).pushR',
    () => expect(
      _([1, 2, 3]).pushR(4, 5)._
    ).toEqual(
      [1, 2, 3, 4, 5]
    )
  );

  it('_([]).popL',
    () => expect(
      _([1, 2, 3]).popL._
    ).toBe(
      1
    )
  );

  it('_([]).popR',
    () => expect(
      _([1, 2, 3]).popR._
    ).toBe(
      3
    )
  );

  it('_([]).omitL',
    () => expect(
      _([1, 2, 3]).omitL._
    ).toEqual(
      [2, 3]
    )
  );

  it('_([]).omitR',
    () => expect(
      _([1, 2, 3]).omitR._
    ).toEqual(
      [1, 2]
    )
  );

  it('_([]).each',
    () => {
      const a = [0]
      _(TA).each((v, k) => a.push(a[k] + v))._

      expect(
        a
      ).toEqual(
        [0, 0, 1, 3, 6, 10, 15, 21, 28, 36, 45, 55, 66, 78, 91, 105, 120]
      );

      expect(
        TA
      ).toEqual(
        [..._._(15)]
      );
    }
  );

  it('_([]).lift',
    () => expect(
      _([1,2,3,4,5]).lift(
        a => a
        .map(v => v + 8)
        .reduce((p, c) => p + c)
      )._
    ).toBe(
      55
    )
  );

  it('_([]).fold',
    () => {
      expect(
        _(TA).fold((p, c) => `${p}, ${c}`)._
      ).toEqual(
        TA.join(', ')
      );
      expect(
        TA
      ).toEqual(
        [..._._(15)]
      );
    }
  );

  it('_([]).foldL',
    () => {
      expect(
        _(TA).foldL((p, c) => `${p}, ${c}`)._
      ).toEqual(
        TA.join(', ')
      );
      expect(
        TA
      ).toEqual(
        [..._._(15)]
      );
    }
  );

  it('_([]).foldR',
    () => {
      expect(
        _(TA).foldR((p, c) => `${p}, ${c}`)._
      ).toEqual(
        TA.reverse().join(', ')
      );

      expect(
        TA.reverse()
      ).toEqual(
        [..._._(15)]
      );
    }
  );

  it('_([]).filter',
    () => {
      expect(
        _(TA).filter(v => v < 8)._
      ).toEqual(
        TA.filter(v => v < 8)
      );

      expect(
        TA
      ).toEqual(
        [..._._(15)]
      );
    }
  );

  it('_([]).rotate',
    () => expect(
      _([
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9]
      ]).rotate._
    ).toEqual(
      [
        [1, 4, 7],
        [2, 5, 8],
        [3, 6, 9],
      ]
    )
  )

  it('_([]).aMap',
    () => {
      expect(
        _([v => v + 5, v => v * 5]).aMap(TA)._
      ).toEqual(
        [TA.map(v => v + 5), TA.map(v => v * 5)]
      );

      expect(
        _(TA).aMap([v => v + 5, v => v * 5]).rotate._
      ).toEqual(
        [TA.map(v => v + 5), TA.map(v => v * 5)]
      );

      expect(
        TA
      ).toEqual(
        [..._._(15)]
      );
    }
  );

  it('_([]).map',
    () => {
      expect(
        _(TA).map(v => v * 5)._
      ).toEqual(
        TA.map(v => v * 5)
      );

      expect(
        TA
      ).toEqual(
        [..._._(15)]
      );
    }
  );

  it('_([]).fMap',
    () => {
      expect(
        _(TA).fMap(v => [v * 5])._
      ).toEqual(
        TA.flatMap(v => [v * 5])
      );

      expect(
        TA
      ).toEqual(
        [..._._(15)]
      );
    }
  );

  it('_([]).flatten',
    () => {
      expect(
        _(TA).map(v => [v * 5]).flatten()._
      ).toEqual(
        TA.map(v => [v * 5]).flat()
      );

      expect(
        TA
      ).toEqual(
        [..._._(15)]
      );
    }
  );

  it('_([]).back',
    () => {
      expect(
        _(TA).back._
      ).toEqual(
        TA.reverse()
      );

      expect(
        TA
      ).toEqual(
        [..._._(15)]
      );
    }
  );

  it('_([]).adapt',
    () => {
      const T = [ , ,3 , , ,]
      expect(
        _(T).adapt(1, 2, 4, 5)._
      ).toEqual(
        [1, 2, 3, 4, 5]
      );

      expect(
        T
      ).toEqual(
        [ , ,3 , , ,]
      );
    }
  );

  it('_([]).adaptL',
    () => {
      const T = [ , ,3 , , ,]
      expect(
        _(T).adaptL(1, 2, 4, 5)._
      ).toEqual(
        [1, 2, 3, 4, 5]
      );

      expect(
        T
      ).toEqual(
        [ , ,3 , , ,]
      );
    }
  );

  it('_([]).adaptR',
    () => {
      const T = [ , ,3 , , ,]
      expect(
        _(T).adaptR(1, 2, 4, 5)._
      ).toEqual(
        [5, 4, 3, 2, 1]
      );

      expect(
        T
      ).toEqual(
        [ , ,3 , , ,]
      );
    }
  );

  it('_([]).concat',
    () => {
      expect(
        _(TA).concat([..._._(16, 20)])._
      ).toEqual(
        TA.concat([..._._(16, 20)])
      );

      expect(
        TA
      ).toEqual(
        [..._._(15)]
      );
    }
  );

  it('_([]).replace',
    () => expect(
      _([1, 2, 3, 4, 5]).replace(1, 3, 3)._
    ).toEqual(
      [1, 3, 5]
    )
  );

  it('_([]).splice',
    () => expect(
      _([1, 2, 3, 4, 5]).splice(1, 3, 3)._
    ).toEqual(
      [2, 3, 4]
    )
  );

  it('_([]).slice',
    () => {
      expect(
        _(TA).slice(5, 8)._
      ).toEqual(
        TA.slice(5, 8)
      );

      expect(
        TA
      ).toEqual(
        [..._._(15)]
      );
    }
  );

  it('_([]).sort',
    () => expect(
      _([4, 2, 5, 1, 3]).sort()._
    ).toEqual(
      [1, 2, 3, 4, 5]
    )
  );

  it('_([]).indexL',
    () => expect(
      _([1, 2, 3, 2, 5]).indexL(2)._
    ).toBe(
      1
    )
  );

  it('_([]).indexR',
    () => expect(
      _([1, 2, 3, 2, 5]).indexR(2)._
    ).toBe(
      3
    )
  );

  it('_([]).any',
    () => expect(
      _([1, 2, 3, 2, 5]).any(v => v > 4)._
    ).toBe(
      [1, 2, 3, 4, 5].some(v => v > 4)
    )
  );

  it('_([]).all',
    () => expect(
      _([1, 2, 3, 2, 5]).all(v => v > 4)._
    ).toBe(
      [1, 2, 3, 4, 5].every(v => v > 4)
    )
  );

  it('_([]).apply',
    () => expect(
      _([1, 2, 3]).apply((a, b, c) => (a + b) * c)._
    ).toBe(
      9
    )
  );

  it('_([]).sum',
    () => expect(
      _(TA).sum._
    ).toBe(
      120
    )
  );

  it('_([]).pi',
    () => expect(
      _([1,2,3,4,5]).pi._
    ).toBe(
      120
    )
  );

  it('_([]).average',
    () => expect(
      _(TA).average._
    ).toBe(
      7.5
    )
  );

  it('_([]).max',
    () => expect(
      _(TA).max._
    ).toBe(
      15
    )
  );

  it('_([]).min',
    () => expect(
      _(TA).min._
    ).toBe(
      0
    )
  );

  it('_([]).mid',
    () => {
      expect(
        _(TA).mid._
      ).toBe(
        7.5
      );

      expect(
        _([..._._(14)]).mid._
      ).toBe(
        7
      );

      expect(
        _([]).mid._
      ).toBe();
    }
  );

  it('_([]).less',
    () => expect(
      _([ , ,3 ,4 , , ,5 , ,]).less._
    ).toEqual(
      [3, 4, 5]
    )
  );

  it('_([]).sure',
    () => expect(
      _([ , ,3 ,4 , , ,5 , ,]).sure._
    ).toEqual(
      [undefined ,undefined ,3 ,4 ,undefined ,undefined ,5 ,undefined]
    )
  );

  it('_([]).pair',
    () => expect(
      _([1, 2, 3, 4, 5]).pair(...'a, b, c, d, e'.split(', '))._
    ).toEqual(
      {
        a: 1,
        b: 2,
        c: 3,
        d: 4,
        e: 5
      }
    )
  );

  it('_([]).to',
    () => expect(
      _(TA).to(3, 4, 5)._
    ).toEqual(
      [..._._(15)]
    )
  );

  it('_([]).of',
    () => expect(
      _(TA).of(3, 4, 5)._
    ).toEqual(
      [..._._(15)]
    )
  );

  it('_().fullen',
    () => {
      const emptyAry0 = [,2,3]
      const emptyAry1 = [1,,3]
      const emptyAry2 = [1,2,,]

      const nulledAry0 = [null, 2, 3];
      const nulledAry1 = [1, null, 3];
      const nulledAry2 = [1, 2, null];

      const voidAry0 = [void 0, 2, 3];
      const voidAry1 = [1, void 0, 3];
      const voidAry2 = [1, 2, void 0];

      const nulledObj0 = {a: null, b: 2, c: 3};
      const nulledObj1 = {a: 1, b: null, c: 3};
      const nulledObj2 = {a: 1, b: 2, c: null};

      const voidObj0 = {a: void 0, b: 2, c: 3};
      const voidObj1 = {a: 1, b: void 0, c: 3};
      const voidObj2 = {a: 1, b: 2, c: void 0};

      const fulfillObj = {a: 0, b: true, c: false};
      const fulfillAry = [0, true, false];

      expect(
        _(emptyAry0).fullen._
      ).toBe(
        false
      );

      expect(
        _(emptyAry1).fullen._
      ).toBe(
        false
      );

      expect(
        _(emptyAry2).fullen._
      ).toBe(
        false
      );

      expect(
        _(nulledAry0).fullen._
      ).toBe(
        false
      );

      expect(
        _(nulledAry1).fullen._
      ).toBe(
        false
      );

      expect(
        _(nulledAry2).fullen._
      ).toBe(
        false
      );

      expect(
        _(voidAry0).fullen._
      ).toBe(
        false
      );

      expect(
        _(voidAry1).fullen._
      ).toBe(
        false
      );

      expect(
        _(voidAry2).fullen._
      ).toBe(
        false
      );

      expect(
        _(nulledObj0).fullen._
      ).toBe(
        false
      );

      expect(
        _(nulledObj1).fullen._
      ).toBe(
        false
      );

      expect(
        _(nulledObj2).fullen._
      ).toBe(
        false
      );

      expect(
        _(voidObj0).fullen._
      ).toBe(
        false
      );

      expect(
        _(voidObj1).fullen._
      ).toBe(
        false
      );

      expect(
        _(voidObj2).fullen._
      ).toBe(
        false
      );

      expect(
        _(fulfillAry).fullen._
      ).toBe(
        true
      );

      expect(
        _(fulfillObj).fullen._
      ).toBe(
        true
      );
    }
  );

  it("_('').toObject",
    () => {
      expect(
        _({a: 5}).toJSON.toObject._
      ).toEqual(
        {a: 5}
      );
      expect(
        _(null).toObject._
      ).toBe(
        null
      );
      expect(
        _({a: 5}).toObject._
      ).toEqual(
        {a: 5}
      );
    }
  );

  it("_('').toDate",
    () => expect(
      _(new Date(0).toString()).toDate._.toString()
    ).toBe(
      new Date(0).toString()
    )
  );

  it('_(Date).get',
    () => {
      expect(
        _(new Date(0)).get('yr')._
      ).toBe(
        1970
      );

      expect(
        _(new Date(0)).get('yr, mo, dt, dy, hr, min, sec, ms')._
      ).toEqual(
        {
          yr: 1970,
          mo: 1,
          dt: 1,
          dy: 4,
          hr: Math.trunc(_.zone / 60),
          min: _.zone % 60,
          sec: 0,
          ms: 0
        }
      );

      expect(
        _(new Date(0)).get('yrUTC, moUTC, dtUTC, dyUTC, hrUTC, minUTC, secUTC')._
      ).toEqual(
        {
          yrUTC: 1970,
          moUTC: 1,
          dtUTC: 1,
          dyUTC: 4,
          hrUTC: 0,
          minUTC: 0,
          secUTC: 0
        }
      );
    }
  );

  it('_(Date).put',
    () =>{
      expect(
        _(new Date(0))
        .put({
          yr: 2020,
          mo: 5,
          dt: 28,
          hr: 15,
          min: 28,
          sec: 16,
          ms: 330
        })
        .get('yr, mo, dt, dy, hr, min, sec, ms')
        ._
      ).toEqual(
        {
          yr: 2020,
          mo: 5,
          dt: 28,
          dy: 4,
          hr: 15,
          min: 28,
          sec: 16,
          ms: 330
        }
      );

      expect(
        _(new Date(0))
        .put({
          yrUTC: 2020,
          moUTC: 5,
          dtUTC: 28,
          hrUTC: 15,
          minUTC: 28,
          secUTC: 16
        })
        .get('yrUTC, moUTC, dtUTC, dyUTC, hrUTC, minUTC, secUTC')
        ._
      ).toEqual(
        {
          yrUTC: 2020,
          moUTC: 5,
          dtUTC: 28,
          dyUTC: 4,
          hrUTC: 15,
          minUTC: 28,
          secUTC: 16,
        }
      );
    }
  );

  it('_(Date).map',
    () =>{
      expect(
        _(new Date(0))
        .map(
          'min, sec'
        )(
          ({min, sec}) => ({min: min + 1, sec: sec + 30})
        )
        .get('min, sec')
        ._
      ).toEqual(
        {
          min: 1,
          sec: 30
        }
      );

      expect(
        _(new Date(0))
        .map(
          'sec'
        )(
          s => s + 15
        )
        .get('sec')
        ._
      ).toBe(
        15
      );
    }
  );

  it('_(Date).endOfMo',
    () => expect(
      _(new Date(0)).endOfMo.get('mo, dt')._
    ).toEqual(
      {
        mo: 1,
        dt: 31
      }
    )
  );

  it('_(Date).endOfMoUTC',
    () => expect(
      _(new Date(0)).endOfMoUTC.get('moUTC, dtUTC')._
    ).toEqual(
      {
        moUTC: 1,
        dtUTC: 31
      }
    )
  );

  it('_(Date).zone',
    () => expect(
      _(new Date(0)).zone._
    ).toBe(
      new Date(0).getTimezoneOffset()
    )
  );

  it('_(Date).raw',
    () => expect(
      _(new Date(0)).raw._
    ).toBe(
      0
    )
  );

  it('_(Date).ISO',
    () => expect(
      _(new Date(0)).ISO._
    ).toBe(
      new Date(0).toISOString()
    )
  );

  it('_(Date).UTC',
    () => expect(
      _(new Date(0)).UTC._
    ).toBe(
      new Date(0).toUTCString()
    )
  );

  it('_(Date).toObject',
    () => expect(
      _(new Date(0)).toObject._
    ).toEqual(
      {
        yr: 1970,
        mo: 1,
        dt: 1,
        dy: 4,
        hr: Math.trunc(_.zone / 60),
        min: _.zone % 60,
        sec: 0,
        ms: 0
      }
    )
  );

  it('_(Date).toObjectUTC',
    () => expect(
      _(new Date(0)).toObjectUTC._
    ).toEqual(
      {
        yrUTC: 1970,
        moUTC: 1,
        dtUTC: 1,
        dyUTC: 4,
        hrUTC: 0,
        minUTC: 0,
        secUTC: 0
      }
    )
  );

  it('_(Date).toJSON',
    () => expect(
      _(new Date(0)).toJSON._
    ).toBe(
      JSON.stringify({
        yr: 1970,
        mo: 1,
        dt: 1,
        dy: 4,
        hr: Math.trunc(_.zone / 60),
        min: _.zone % 60,
        sec: 0,
        ms: 0
      })
    )
  );

  it('_(Date).toJSONUTC',
    () => expect(
      _(new Date(0)).toJSONUTC._
    ).toBe(
      JSON.stringify({
        yrUTC: 1970,
        moUTC: 1,
        dtUTC: 1,
        dyUTC: 4,
        hrUTC: 0,
        minUTC: 0,
        secUTC: 0
      })
    )
  );

  it('_(JSON).toDate',
    () => expect(
      _(new Date(0)).toJSON.toDate.toObject._
    ).toEqual(
      {
        yr: 1970,
        mo: 1,
        dt: 1,
        dy: 4,
        hr: Math.trunc(_.zone / 60),
        min: _.zone % 60,
        sec: 0,
        ms: 0
      }
    )
  );

  it('_(Date).toJSONUTC',
    () => expect(
      _(new Date(0)).toJSONUTC.toDateUTC.toObjectUTC._
    ).toEqual(
      {
        yrUTC: 1970,
        moUTC: 1,
        dtUTC: 1,
        dyUTC: 4,
        hrUTC: 0,
        minUTC: 0,
        secUTC: 0
      }
    )
  );
});
