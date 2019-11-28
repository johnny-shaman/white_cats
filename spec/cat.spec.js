describe("White Cats", function () {
  'use strict';

  const _ = reqire('../cat.js');

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
    )
    .toEqual( {
      a: 19,
      b: 227,
      c: 4387
    } )
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
      expect( _.define(target, {c: {value: 1}, d: {value: 2}}) ).toBe( target );
      expect( target.c ).toBe( 1 );
      expect( target.d ).toBe( 2 );
    }
  );

  it('_.entries',
    () => expect(
      _
      .entries({a: 5, b: 6})
      .flat()
    )
    .toEqual( ['a', 5, 'b', 6] )
  );

  it('_.keys',
    () => expect(
      _.keys({a: 5, b: 6})
    )
    .toEqual( ['a', 'b'] )
  );

  it('_.vals',
    () => expect(
      _.keys({a: 5, b: 6})
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

  it('_.fullen',
    () => {
        const nulledAry0 = [null,2,3];
        const nulledAry1 = [1,null,3];
        const nulledAry2 = [1,2,null];
        const voidAry0 = [void 0,2,3];
        const voidAry1 = [1,void 0,3];
        const voidAry2 = [1,2,void 0];

        const nulledObj0 = {a: null, b: 2, c: 3};
        const nulledObj1 = {a: 1, b: null, c: 3};
        const nulledObj2 = {a: 1, b: 2, c: null};
        const voidObj0 = {a: void 0, b: 2, c: 3};
        const voidObj1 = {a: 1, b: void 0, c: 3};
        const voidObj2 = {a: 1, b: 2, c: void 0};

        const fulfillObj = {a: 0, b: true, c: false};
        const fulfillAry = [0, true, false];

        expect(
          _.fullen(nulledAry0)
        ).toBe(
          false
        );
        expect(
          _.fullen(nulledAry1)
        ).toBe(
          false
        );
        expect(
          _.fullen(nulledAry2)
        ).toBe(
          false
        );
        expect(
          _.fullen(voidAry0)
        ).toBe(
          false
        );
        expect(
          _.fullen(voidAry1)
        ).toBe(
          false
        );
        expect(
          _.fullen(voidAry2)
        ).toBe(
          false
        );
        expect(
          _.fullen(nulledObj0)
        ).toBe(
          false
        );
        expect(
          _.fullen(nulledObj1)
        ).toBe(
          false
        );
        expect(
          _.fullen(nulledObj2)
        ).toBe(
          false
        );
        expect(
          _.fullen(voidObj0)
        ).toBe(
          false
        );
        expect(
          _.fullen(voidObj1)
        ).toBe(
          false
        );
        expect(
          _.fullen(voidObj2)
        ).toBe(
          false
        );
        expect(
          _.fullen(fulfillAry)
        ).toBe(
          true
        );
        expect(
          _.fullen(fulfillObj)
        ).toBe(
          true
        );
    }
  );

  it('',
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
      )
    }
  );

  it('',
    () => {
      expect(
        
      )
      .toBe(  )
    }
  );

  it('',
    () => expect(
      
    ).toBe(
      
    )
  );

  it('',
    () => expect(

    ).toEqual(

    )
  );
});
