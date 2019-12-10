describe("White Cats", function () {
  'use strict';

  const _ = require('../cat.js');
  const O = (a, b, c) => Object.create(
    {
      ad (v) {
        this.a = this.a + v;
        this.b = this.a + this.b;
        this.c = this.b + this.c;
      },
      mt (v) {
        this.a = this.a * v;
        this.b = this.a * this.b;
        this.c = this.b * this.c;
      },
      sb (v) {
        this.a = this.a - v;
        this.b = this.a - this.b;
        this.c = this.b - this.c;
      },
      dv (v) {
        this.a = this.a / v;
        this.b = this.a / this.b;
        this.c = this.b / this.c;
      },
      end () {
        return this.c;
      },
      prog (...v) {
        return [...v, this.c]
      }
    },
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

  it('_.id',
    () => expect(
      _.id(57)
    )
    .toBe( 57 )
  );

  it('_.pipe',
    () => expect(
      _.pipe(
        v => v * 2,
        v => v + 5,
        v => v * 10
      )(5)
    )
    .toBe( 150 )
  );

  it('_.loop',
    () => expect(
      _.loop(
        o => o.ad( 5 ),
        o => o.mt( 2 ),
        o => o.ad( 3 )
      )( O(3, 5, 7) )
      .c
    ).toBe(
      4387
    )
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

  it('_.entries',
    () => expect(
      _.entries({a: 5, b: 6})
    ).toEqual(
      [['a', 5], ['b', 6]]
    )
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
      _.adapt([,,3,4,,6])(1, 2, 5)
    ).toEqual(
      [1, 2, 3, 4, 5, 6]
    )
  );

  it('_.less',
    () => expect(
      _.less([,null,void 0, 3, 4, 5])
    ).toEqual(
      [3, 4, 5]
    )
  );

  it('_.exist',
    () => {
      expect(
        _.exist([1, 2, 3])(1)
      ).toBe(
        true
      );
      expect(
        _.exist([1, 2, 3])(4)
      ).toBe(
        false
      );
    }
  );

  it('_.by',
    () => expect(
      _.by([])
    ).toBe(
      [].constructor
    )
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
        [..._._(1, 5)]
      )
      .toEqual(
        [1, 2, 3, 4, 5]
      );
      expect(
        [..._._(5, 1)]
      )
      .toEqual(
        [5, 4, 3, 2, 1]
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
    async () => expect(
      await _.async(r => r(3))
    )
    .toBe(
      3
    )
  );

  it('_.asyncAll',
    async () => expect(
      await _.asyncAll(
        r => r(3),
        4,
        _.async(r => r(5))
      )
    )
    .toEqual(
      [3, 4, 5]
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

  it('_()._pipe has Kleisli Triple and function piping',
    () => {
      expect(
        _({a: 5})._pipe(o => _({a: o.a * 3}))._
      ).toEqual(
        (o => _({a: o.a * 3}))({a: 5})._
      );
      expect(
        _({a: 5})._pipe(_)._
      ).toEqual(
        {a: 5}
      );
      expect(
        _({a: 5})._pipe(o => _({a: o.a * 3}))._pipe(o => _({a: o.a + 5}))._
      ).toEqual(
        _({a: 5})._pipe(o => _({a: o.a * 3})._pipe(o => _({a: o.a + 5})))._
      );
      expect(
        _({a: 5})._pipe(o => _({a: o.a * 3}), o => _({a: o.a + 5}))._
      ).toEqual(
        _({a: 5})._pipe(o => _({a: o.a * 3}))._pipe(o => _({a: o.a + 5}))._
      );
    }
  );

  it('_().pipe',
    () => expect(
      _({a: 5}).pipe(o => ({a: o.a * 3}), o => ({a: o.a + 5}))._
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
    }
  );

  it('_().cast',
    () => {
      const o = O(3, 5, 7);
      expect(
        _(o).cast('prog')(5, 6)._
      ).toBe(
        o
      )
    }
  );

  it('_().been',
    () => expect(
      _(O(3, 5, 7))
      .Been
      .ad( 5 )
      .mt( 2 )
      .ad( 3 )
      .To
      ._
      .c
    ).toBe(
      4387
    )
  );

  it('_().toJSON',
    () => expect(
      _(O(3, 5, 7)).toJSON._      
    ).toBe(
      JSON.stringify(O(3, 5, 7))
    )
  );

  it('_(async).then',
    async () => expect(
      await _(_.async(r => r([3, 5, 7]))).then(
        a => _.async(r => r(a.push(11))),
        a => a.push(13),
        a => _.async(r => r(a.push(17))),
        a => _.async(r => r(a.push(19)))
      )._
    ).toEqual(
      [3, 5, 7, 11, 13, 17, 19]
    )
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

  it('',
    () => {
      const x = {d: 3, e: 4, f: 5};
      const y = {};
      const z = {};

      expect(
        _(x)
        .each(
          (k, v) => _.put(y, {[`${k.toUpperCase()}`]: v + 5}),
          (k, v) => _.put(z, {[`${k}z`]: v}),
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
    () => expect(
      _({a: 3, b: {c: 4, d: {e: 6}}}).get('b.d.e')._
    ).toBe(
      6
    )
  );

  it('_({}).set',
    () => expect(
      _({a: 3, b: {c: 4, d: {e: 6}}}).set('b.d.e')(3)._.b.d.e
    ).toBe(
      3
    )
  );

  it('_({}).mend',
    () => expect(
      _({a: 3, b: {c: 4, d: {e: 6}}}).mend('b.d.e')(v => v * 3)._.b.d.e
    ).toBe(
      18
    )
  );

  it('_({}).take',
    () => expect(
      _({a: 3, b: {c: 4, d: {e: 6}}})
      .take(
        {a: 4, b: {d: {f: 8}, g: {h: 9, i: 10}}},
        {b: {d: {g: {j: 11, k: {l: 12}}}}},
        {b: {g: {j: 13, k: {l: 14}}}},
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
    )
  );

  it('',
    () => expect(

    ).toEqual(

    )
  );

  it('',
    () => {
      expect(
        
      ).toBe(
        
      );
    }
  );

  it('',
    () => expect(

    ).toEqual(

    )
  );

  it('',
    () => expect(

    ).toEqual(

    )
  );

  it('',
    () => expect(

    ).toEqual(

    )
  );

  it('_().fullen_',
    () => {
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
        _(nulledAry0).fullen_
      ).toBe(
        false
      );

      expect(
        _(nulledAry1).fullen_
      ).toBe(
        false
      );

      expect(
        _(nulledAry2).fullen_
      ).toBe(
        false
      );

      expect(
        _(voidAry0).fullen_
      ).toBe(
        false
      );

      expect(
        _(voidAry1).fullen_
      ).toBe(
        false
      );

      expect(
        _(voidAry2).fullen_
      ).toBe(
        false
      );

      expect(
        _(nulledObj0).fullen_
      ).toBe(
        false
      );

      expect(
        _(nulledObj1).fullen_
      ).toBe(
        false
      );

      expect(
        _(nulledObj2).fullen_
      ).toBe(
        false
      );

      expect(
        _(voidObj0).fullen_
      ).toBe(
        false
      );

      expect(
        _(voidObj1).fullen_
      ).toBe(
        false
      );

      expect(
        _(voidObj2).fullen_
      ).toBe(
        false
      );

      expect(
        _(fulfillAry).fullen_
      ).toBe(
        true
      );

      expect(
        _(fulfillObj).fullen_
      ).toBe(
        true
      );
    }
  );
});
