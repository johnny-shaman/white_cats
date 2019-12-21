# white_cats
White Cats define Pure functions

## Usage:
### node.js@^LTS

```shell
npm i white_cats
```
and...

```javascript
  const _ = require('white_cats');
```

### browser
```html
<script src="https://cdn.jsdelivr.net/npm/white_cats@0.1.0/cat.js"></script>
```

## contents:
```javascript

### id
_.id(57)
// 57

###  _.pipe
is function pipe runner

_.pipe(
  v => v * 2,
  v => v + 5,
  v => v * 10
)(5)
// 150

### _.loop
watch out on argument's first

_.loop(
  a => a.forEach(v => v),
  a => a.forEach(v => v)
)(
  [3, 5, 7]
)
// [3, 5, 7]

###  _.upto(prototype, descriptor)
is Object.create

(() =>  {
  const target = _.upto(Object.freeze({a: true, b: false}), {c: {value: false}});
  target.c === false
})()

### _.put(base, assign)
is Object.assign

() => {
  const target = {a: 5, b: 3};
  _.put(target, {c: 1, d: 2});
  target.c === 1;
  target.d === 2;
}

###  _.define(base, 'key', description)
is Object.defineProperty

() => {
  const target = {a: 5, b: 3};
  _.defines(target, 'c', {value: 1});
  target.c === 1;
}

###  _.defines(base, descriptions)
is Object.defineProperties

() => {
  const target = {a: 5, b: 3};
  _.defines(target, {c: {value: 1}, d: {value: 2}});
  target.c === 1;
  target.d === 2;
}

### _.keys
is Object.keys

_.keys({a: 5, b: 6})
// ['a', 'b']

### _.vals
is Object.values

_.keys({a: 5, b: 6})
// [5, 6]

### _.entries
is Object.entries

_.keys({a: 5, b: 6})
// [['a', 5], ['b', 6]]

### _.equal
is Object.is

(() => {
  _.equal('foo', 'foo');     // true
  _.equal('foo', 'bar');     // false
  _.equal([], []);           // false

  const foo = { a: 1 };
  const bar = { a: 1 };
  _.equal(foo, foo);         // true
  _.equal(foo, bar);         // false

  _.equal(null, null);       // true

  _.equal(0, -0);            // false
  _.equal(-0, -0);           // true
  _.equal(NaN, 0/0);         // true
})()

### _.owns
_.owns(target)
// sameOf
Object.getOwnPropertyNames(target).concat(Object.getOwnPropertySymbols(target))

### _.descpipting
is Object.getOwnPropertyDescriptors
_.descripting({
  a: 5,
  b: 6
})

### _.adapt
_.adapt(1, 2, 5)([,,3,4,,6])
// [1, 2, 3, 4, 5, 6]

### _.adaptL
_.adaptL(1, 2, 5)([,,3,4,,6])
// [1, 2, 3, 4, 5, 6]

### _.adaptR
_.adaptR(1, 2, 5)([,,3,4,,6])
// [5, 2, 3, 4, 1, 6]

### _.less
_.less([,,null ,undefined ,3 ,4 ,5,,])
// [3, 4, 5]

### _.sure
change empty to undefined

_.sure([ , , ,0 , 3, 4, 5])
// [undefined, undefined, undefined, 0, 3, 4, 5]

### _.exist
is Array.prototype.includes

_.exist([1, 2, 3])(1)
// true
_.exist([1, 2, 3])(4)
// false

### _.by
_.by([])
// Array


### _.isObject
_.isObject({});
_.isObject([]);
// true
_.isObject(8);
// false

### _.isArray
_.isArray([])
// true

_.isArray({})
// false

### _._(start, end, step)
[..._._(0, 8, 2)]
// [0, 2, 4, 6, 8]

[..._._(8, 0, -2)]
// [8, 6, 4, 2, 0]

[..._._(5)]
// [0, 1, 2, 3, 4, 5]

### _.async(resolver)
create Promise

async () => await _.async(
  r => setTimeout(t => r('done'), 3000)
)();
// 3sec after return 'done'

### _.asyncAll
is Promise.all

async () => await _.asyncAll(
      r => r(3),
      4,
      _.async(
        r => setTimeout(t => r('done'), 3000)
      )
    )
// 3sec after return [3, 4, 5]

### _().$_
return right first

_(3).$_
// 3

_(3, 4).$_
// 4

### _()._$
return left first

_(3)._$
// 3

_(3, 4)._$
// 3

_(null, 4)._$
// 4

### _().re
swap starting and ending value

_(3, 4).re
// it same at _(4, 3)


### _()._pipe
has Kleisli Triple and function piping

// left Identity
_({a: 5})._pipe(o => _({a: o.a * 3}))._
(o => _({a: o.a * 3}))({a: 5})._

// Right Identity
_({a: 5})._pipe(_)._pipe(_)._
// {a: 5}

// Associativity
_({a: 5})._pipe(o => _({a: o.a * 3}))._pipe(o => _({a: o.a + 5}))._
_({a: 5})._pipe(o => _({a: o.a * 3})._pipe(o => _({a: o.a + 5})))._

### _().pipe
function's pipeline runner

_({a: 5})
.pipe(
  o => ({a: o.a * 3}),
  o => ({a: o.a + 5})
)
._.a
// 20

### _().loop
is watch out on argument's first

_([3, 4, 5])
.loop(
  o => o.unshift(2, 3),
  o => o.push(2, 3),
  o => o.filter(v => v < 3)
)
._
// [2, 3. 3, 4, 5, 2, 3]

### _().call
is Object's method caller in call(self) and return result

_([3, 4, 5]).call('push')(5, 6)._
// 5

### _().s_r
is Object's method caller in call(self) and callback recieve result and return self

_([3, 4, 5]).s_r('push')(5, 6)(v => v === 5)._
// [3, 4, 5, 5, 6]

### _().cast
is Object's method caller in call(self) and return self

_([3, 4, 5]).call('push')(5, 6)._
// [3, 4, 5, 5, 6]

### _().Been
is Chaining method calling in the way to take a Object

_([3, 5, 7])
.Been
[0](7)((v, w) => w)       // rewrite
[1](10)()                 // nothing to do
[2](5)((v, w) => v + w)   // modify
.push(5, 6)(console.log)  // 5
.push(4, 3)(console.log)  // 7
.To
._
// [7, 5, 12, 5, 6, 4, 3]

### _().toJSON
is JSON.stringify

_({a: 5, b: 6}).toJSON._ === JSON.stringify({a: 5, b: 6})

### _(async).then
is pipe runner on promise

_(_.async(r => r([3, 5, 7]))).then(
    a => _.async(r => r(a, a.push(11))),
    a => (a.push(13), a),
    a => _.async(r => r(a, a.push(17))),
    a => _.async(r => r(a, a.push(19))),
    console.log    // output : [3, 5, 7, 11, 13, 17, 19]
  )
)._

### _(function*).take
is take generator's valuelist

_((function* (x) {
  while (true) {
    yield x++;
  }
})(0))
.take(5)
._
//[0, 1, 2, 3, 4]

### _({}).filter
is Object.filter

_({a: 5, b: 4, c: 3, d: 2, e : 1})
.filter(v => v < 4)
._
// {c: 3, d: 2, e : 1}

### _({}).each
is Object.entries.forEach

_({
  req: undefined,
  res: undefined,
  get (req, res) {
    _.put(this, {req, res});
  },
  post (req, res) {
    _.put(this, {res});
  }
})
.each(
  (k, v) => emitter.on(k, v)
)

### _({}).map
is Object.map

_({a: 5, b: 4, c: 6}).map((v, k) => k + v)._
// {a: 'a5', b: 'b4', c: 'c6'}

### _({}).get
is getter about Object

_({a: 3, b: {c: 4, d: {e: 6}}}).get('b.d.e')._
// 6

_({a: 3, b: {c: 4, d: {e: 6}}}).get('b.e.f')._
// undefined

### _({}).set
is setter about Object

_({a: 3, b: {c: 4, d: {e: 6}}}).set('b.d.e')(3)._
// {a: 3, b: {c: 4, d: {e: 3}}}

_({a: 3, b: {c: 4, d: {e: 6}}}).set('b.c.f')(3)._
// {a: 3, b: {c: {f: 3}, d: {e: 6}}}

### _({}).put
is Object.assign

_({a: 3, b: {c: 4, d: {e: 6}}}).get('b.d').put({f: 7}).$_
// {a: 3, b: {c: 4, d: {e: 6, f: 7}}}

### _({}).cut
is delete property

_({a: 3, b: {c: 4, d: {e: 6}}}).cut('b.d')._
// {a: 3, b: {c: 4}}


_({a: 3, b: {c: 4, d: {e: 6}}}).cut('b.e')._
// {a: 3, b: {c: 4, d: {e: 6}}}

### _({}).mend
is property modifier

_({a: 3, b: {c: 4, d: {e: 6}}}).mend('b.d.e')(v => v * 3)._
// {a: 3, b: {c: 4, d: {e: 18}}}

### _({}).modify
is modify property and get's more argument

_({a: 3, b: {c: 4, d: {e: 6}}})
.modify('b.d.e')(4, 5, 6)(
  (v, w, x, y) => (v - w) * x + y
)
._
// {a: 3, b: {c: 4, d: {e: 16}}}

### _({}).give
is deepAssigning Object more safely about Object.assign

!!!Carefuly!!!
give is take of the first argument Object
normaly use _({}).take

_({a: 3, b: {c: 4, d: {e: 6}}})
.give(
  {a: 4, b: {d: {f: 8}, g: {h: 9, i: 10}}},
  {b: {d: {g: {j: 11, k: {l: 12}}}}},
  {b: {g: {j: 13, k: {l: 14}}}}
)
._

/*
  {
    b : {
      g : { j : 13, k : { l : 14 }, h : 9, i : 10 },
      d : { g : { j : 11, k : { l : 12 } }, f : 8, e : 6 },
      c : 4
    }, a : 3
  }
*/

### _({}).take
is deepAssigning Object more safely about Object.assign

_({a: 3, b: {c: 4, d: {e: 6}}})
.take(
  {a: 4, b: {d: {f: 8}, g: {h: 9, i: 10}}},
  {b: {d: {g: {j: 11, k: {l: 12}}}}},
  {b: {g: {j: 13, k: {l: 14}}}}
)
._

/*
  {
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
  }
*/

### _({}).define
is Object.defineProperties applying

(() => {
  const target = {a: 5, b: 3};
  _(target).define({c: {value: 1}, d: {value: 2}})._;
  // target like {a: 5, b: 3, c: 1, d: 2}
})

### _({}).append
is promoting prototype that Object.create

_(Object.prototype).append({c: {value: false}})._;
// {c: false}

### _({}).depend
is depending prototype that Object.create

_({c: {value: false}}).depend(Object.prototype)._;
// {c: false}

### _({}).pick
Object's deepPicker that distinate Query String

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
.pick('a, b[c, d[e, g.k], g[j, k]]') // parse to 'a, b.c, b.d.e, b.d.g.k, g.j, g.k'
._

/*
  {
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
  }
*/

### _({}).drop
Object's deepDropper that distinate Query String

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
.pick('a, b[c, d[e, g.k], g[j, k]]') // parse to  'a, b.c, b.d.e, b.d.g.k, g.j, g.k'
._
/*
  {
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
  }
*/

### _().keys
get's Object.keys

_({a: 5, b: 6}).keys._
// ['a', 'b']

### _().vals
get's Object.values

_({a: 5, b: 6}).vals._
// [5, 6]

### _().entries
get's Object.entries

_({a: 5, b: 6}).entries._
// [['a', 5], ['b', 6]]

### _().toDate
process from Date structure to Date Object

_({
  yr: 2020,
  mo: 1,
  dt: 1,
  hr: 0,
  min: 0,
  sec: 0,
  ms: 0
}).toDate._

//Data: 2020-1-1 that have Local TimeZone


### _().toDateUTC
process from DateUTC structure to Date Object

_({
  yrUTC: 2020,
  moUTC: 1,
  dtUTC: 1,
  hrUTC: 0,
  minUTC: 0,
  secUTC: 0,
}).toDateUTC._

//Data: 2020-1-1 that have UTC GMT


### _(constructor).delegate
constructor function's inheritance Other One's

const MyEmitter = _(function (a, b) {
  events.EventEmitter.call(this)
  this.a = a;
  this.b = b;
})
.delegate(events.EventEmitter)
._

const MyImage = _(function (src, alt) {
  Image.call(this)
  this.src = src;
  this.alt = alt;
})
.delegate(Image)
._

### _(constructor).prepends
assign methods in this constructor

const MyCtor = _(function (a, b) {
  this.a = a;
  this.b = b;
})
.prepends({
  ad (x) {
    this.a += x;
    this.b += x;
    return this;
  },
  mt (x) {
    this.a *= x;
    this.b *= x;
    return this;
  },
  get result () {
    return a + b;
  }
})
._

### _(constructor).implements
define methods in this constructor

const MyCtor = _(function (a, b) {
  this['@a'] = a;
  this['@b'] = b;
})
.implements({
  a: {
    configurable: true,
    get () {
      return this['@a'];
    }
  },
  b: {
    configurable: true,
    get () {
      return this['@b'];
    }
  },
  ad: {
    configurable: true,
    value (x) {
      return new MyCtor(this.a + x, this.b + x);
    }
  },
  mt: {
    configurable: true,
    value (x) {
      return new MyCtor(this.a * x, this.b * x);
    }
  },
  result: {
    configurable: true,
    get () {
      return this.a + this.b;
    }
  }
})
._

### _(function).take([])
is partial applying and
what cut to overflow args and run once it

.of means args.push
.to means args.unshift


_((...a) => a.reduce((p, c) => p + c))
.take([,,3,,,])
.to(1, 2)
.of(4, 5)
.to(3, 4)
.of(2, 3)
._
// 15

### _(function).each
is applying each value

_(v => v * 3).each(3, 5, 7)._
// [9, 15, 21]

### _(function).done is manageing onto delaying and forceing or applying

_(v => v * 5)
.done(3) // apply it
.done(4) // no action
.done(5) // no action
._

// 15

### _([]).liken
to likely value array 

_([0, 1, 2, 3, 4, 5]).liken([1, 100, 2, 200, 3, 300])._
// [1, 2, 3]


### _([]).equaly
pick of same key value

_([0, 1, 2, 3, 4, 5]).equaly([1, 1, 2, 3, 5, 8])._
// [1, 2, 3]

### _([]).pick
pick up exist values

_([0, 1, 2, 3, 4, 5, 6, 7, 8]).pick(-1, 2 ,5 ,6)._
// [2, 5, 6]

### _([]).drop
omit at exist values

_([1, 2, 3, 4, 5]).drop(2, 4, 6)._
// [1, 3, 5]

### _([]).chunk
rewrap array in partial array

_([0, 1, 2, 3, 4, 5]).chunk(2)._
// [[0, 1], [2, 3], [4, 5]]

  ### _([]).unique
is pick up different values

_([1, 2, 3, 4, 5, 2, 6, 3]).unique._
// [1, 2, 3, 4, 5, 6]

### _([]).union
is concat other Array and pick up different values

_([3, 4, 5, 6]).union([0, 1, 2, 3, 4])._
// [0, 1, 2, 3, 4, 5, 6]

### _([]).put
is replase other Array;

_([3, 4, 5, 6, 7]).put([,,3,4,,,8,9])._
// [3, 4, 3, 4, 7]

### _([]).exist
is apply Array.prototype.includes

_([2, 8]).exist(8)._
// true

_([2, 8]).exist(3)._
// false

### _([]).pickKey
is pick Array in Object can use _({}).pick 's query string

_([
  {a: 30, b: 40, c: 50},
  {a: 31, b: 41, c: 51},
  {a: 32, b: 42, c: 52},
  {a: 33, b: 43, c: 53}
])
.pickKey('a, c')
._

/*
  [
    {a: 30, c: 50},
    {a: 31, c: 51},
    {a: 32, c: 52},
    {a: 33, c: 53}
  ]
*/

### _([]).dropKey
is drop Array in Object can use _({}).drop 's query string

  _([
    {a: 30, b: 40, c: 50},
    {a: 31, b: 41, c: 51},
    {a: 32, b: 42, c: 52},
    {a: 33, b: 43, c: 53}
  ])
  .dropKey('a, c')
  ._
/*
  [
    {b: 40},
    {b: 41},
    {b: 42},
    {b: 43}
  ]
*/

### _([]).pushL

_([1, 2, 3]).pushL(-1, 0)._
// [-1, 0, 1, 2, 3]

### _([]).pushR

_([1, 2, 3]).pushR(4, 5)._
// [1, 2, 3, 4, 5]

### _([]).popL

_([1, 2, 3]).popL._
// 1

### _([]).popR

_([1, 2, 3]).popR._
// 3

### _([]).omitL

_([1, 2, 3]).omitL._
// [2, 3]

_([]).omitR

_([1, 2, 3]).omitR._
// [1, 2]

### _([]).each
like for ...of iteration

_([1, 2, 3, 4, 5]).each(console.log)._

### _([]).lift
highly function recieve in this Array

_([1 ,2 ,3 ,4 ,5])
.lift(
  a => a
  .map(v => v + 8)
  .reduce((p, c) => p + c)
)._
// 55

### _([]).fold
is reduceing to left 

_([1, 3, 5]).fold((p, c) => p - c)._
// -7

### _([]).foldL
is reduceing to left 

_([1, 3, 5]).foldL((p, c) => p - c)._
// -7

### _([]).foldR
is reduceing to Right

_([1, 3, 5]).foldR((p, c) => p - c)._
// 1

### _([]).filter
apply Array.prototype.filter

_([1, 2, 3, 4, 5]).filter(v => v < 4)._
// [1, 2, 3]

### _([]).rotate
is transeform Array vector 

_([
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
])
.rotate
._

/*
  [
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9],
  ]
*/

### _([]).aMap
via applicative map

_([v => v + 5, v => v * 5])
.aMap([1, 2, 3, 4, 5])
._

/*
  [
    [6, 7, 8, 9, 10],
    [5, 10, 15, 20, 25]
  ]
*/

_([1, 2, 3, 4, 5])
.aMap([v => v + 5, v => v * 5])
._
/*
  [
    [6, 5],
    [7, 10],
    [8, 15],
    [9, 20],
    [10, 25]
  ]
*/

### _([]).map
is map to other Array

_([1, 2, 3, 4, 5])
.map(v => v * 5)
._
// [5, 10, 15, 20, 25]

### _([]).fMap
is Array flatMap 

_([1, 2, 3, 4, 5])
.fMap(v => [v * 5])
._
// [5, 10, 15, 20, 25]

### _([]).flat
is Array flatten

_([[1, 2], 3, [4, [5]]]).flat(2)._
// [ 1, 2, 3, 4, 5 ]

### _([]).back
apply Array .prototype.reverce
!!!Not Pure!!!

_([1, 2, 3, 4, 5]).back._
// [5, 4, 3, 2, 1]

### _([]).adapt
assign empty place at left

_([ , ,3 , , ,]).adapt(1, 2, 4, 5)._
// [1, 2, 3, 4, 5]

### _([]).adaptL
assign empty place at left

_([ , ,3 , , ,]).adaptL(1, 2, 4, 5)._
// [1, 2, 3, 4, 5]

### _([]).adaptR
assign empty place at right

_([ , ,3 , , ,]).adaptR(1, 2, 4, 5)._
// [5, 4, 3, 2, 1]

### _([]).concat
marge Array

_([1, 2, 3, 4, 5]).concat([6, 7, 8])._
// [1, 2, 3, 4, 5, 6, 7, 8]

### _([]).replace
is Array replacement
!!!Not Pure!!!

_([1, 2, 3, 4, 5]).replace(2, 2, 6)._
// [1, 2, 6, 5]

### _([]).splice
call Array.prototype.splice
!!!Not Pure!!!

_([1, 2, 3, 4, 5]).splice(2, 2, 6)._
// [3, 4]

### _([]).slice
call Array.prototype.slice

_([1, 2, 3, 4, 5]).slice(2, 2)._
// [3, 4]

### _([]).sort
apply Array.prototype.sort

_([4, 2, 5, 1, 3]).sort()._
// [1, 2, 3, 4, 5]

### _([]).indexL
via indexOf

_([1, 2, 3, 2, 5]).indexL(2)._
// 1

### _([]).indexR
via lastIndexOf

_([1, 2, 3, 2, 5]).indexR(2)._
// 3

### _([]).any
via Array.prototype.some

_([1, 2, 3, 2, 5]).any(v => v > 4)._
// true

### _([]).all
via Array.prototype.every

_([1, 2, 3, 2, 5]).all(v => v > 4)._
// [1, 2, 3, 4, 5].every(v => v > 4)

### _([]).apply
spread and apply to function
_([1, 2, 3]).apply((a, b, c) => (a + b) * c)._
// 9

### _([]).sum
add all value

_([1, 2, 3, 4, 5]).sum._
// 15

### _([]).pi
product all value

_([1, 2, 3, 4, 5]).pi._
// 120

### _([]).average
get average value
_([1,1,5,3,8,8,9,10,12,12,13,13,13,14]).average._
// 8.71...

### _([]).max
get max value

_([1,2,3,4,5,3,8,2]).max._
// 8

### _([]).min
get min value

_([1,2,3,4,-3,3,8,2]).min._
// -3

### _([]).mid


        _(TA).mid._

        7.5
      );


        _([..._._(14)]).mid._

        7
      );


        _([]).mid._
      );
    }
  );

  ### _([]).less
    () =>
      _([ , ,3 ,4 , , ,5 , ,]).less._

      [3, 4, 5]
    )
  );

  ### _([]).sure
    () =>
      _([ , ,3 ,4 , , ,5 , ,]).sure._

      [undefined ,undefined ,3 ,4 ,undefined ,undefined ,5 ,undefined]
    )
  );

  ### _([]).pair
    () =>
      _([1, 2, 3, 4, 5]).pair(...'a, b, c, d, e'.spl### , '))._

      {
        a: 1,
        b: 2,
        c: 3,
        d: 4,
        e: 5
      }
    )
  );

  ### _([]).to
    () =>
      _(TA).to(3, 4, 5)._

      [..._._(15)]
    )
  );

  ### _([]).of
    () =>
      _(TA).of(3, 4, 5)._

      [..._._(15)]
    )
  );

  ### _().fullen

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


        _(emptyAry0).fullen._

        false
      );


        _(emptyAry1).fullen._

        false
      );


        _(emptyAry2).fullen._

        false
      );


        _(nulledAry0).fullen._

        false
      );


        _(nulledAry1).fullen._

        false
      );


        _(nulledAry2).fullen._

        false
      );


        _(voidAry0).fullen._

        false
      );


        _(voidAry1).fullen._

        false
      );


        _(voidAry2).fullen._

        false
      );


        _(nulledObj0).fullen._

        false
      );


        _(nulledObj1).fullen._

        false
      );


        _(nulledObj2).fullen._

        false
      );


        _(voidObj0).fullen._

        false
      );


        _(voidObj1).fullen._

        false
      );


        _(voidObj2).fullen._

        false
      );


        _(fulfillAry).fullen._

        true
      );


        _(fulfillObj).fullen._

        true
      );
    }
  );

  it("_('').toObject",
    () =>
      _({a: 5}).toJSON.toObject._

      {a: 5}
    )
  );

  it("_('').toDate",
    () =>
      _(new Date(0).toString()).toDate._.toString()

      new Date(0).toString()
    )
  );

  ### _(Date).get


        _(new Date(0)).get('yr')._

        1970
      );


        _(new Date(0)).get('yr, mo, dt, dy, hr, min, sec, ms')._

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


        _(new Date(0)).get('yrUTC, moUTC, dtUTC, dyUTC, hrUTC, minUTC, secUTC')._

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

  ### _(Date).put
    () =>{

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

  ### _(Date).map
    () =>{

        _(new Date(0))
        .map(
          'min, sec'
        )(
          ({min, sec}) => ({min: min + 1, sec: sec + 30})
        )
        .get('min, sec')
        ._

        {
          min: 1,
          sec: 30
        }
      );


        _(new Date(0))
        .map(
          'sec'
        )(
          s => s + 15
        )
        .get('sec')
        ._

        15
      );
    }
  );

  ### _(Date).endOfMo
    () =>
      _(new Date(0)).endOfMo.get('mo, dt')._

      {
        mo: 1,
        dt: 31
      }
    )
  );

  ### _(Date).endOfMoUTC
    () =>
      _(new Date(0)).endOfMoUTC.get('moUTC, dtUTC')._

      {
        moUTC: 1,
        dtUTC: 31
      }
    )
  );

  ### _(Date).zone
    () =>
      _(new Date(0)).zone._

      new Date(0).getTimezoneOffset()
    )
  );

  ### _(Date).raw
    () =>
      _(new Date(0)).raw._

      0
    )
  );

  ### _(Date).ISO
    () =>
      _(new Date(0)).ISO._

      new Date(0).toISOString()
    )
  );

  ### _(Date).UTC
    () =>
      _(new Date(0)).UTC._

      new Date(0).toUTCString()
    )
  );

  ### _(Date).toObject
    () =>
      _(new Date(0)).toObject._

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

  ### _(Date).toObjectUTC
    () =>
      _(new Date(0)).toObjectUTC._

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

  ### _(Date).toJSON
    () =>
      _(new Date(0)).toJSON._

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

  ### _(Date).toJSONUTC
    () =>
      _(new Date(0)).toJSONUTC._

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

  ### _(JSON).toDate
    () =>
      _(new Date(0)).toJSON.toDate.toObject._

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

  ### _(Date).toJSONUTC
    () =>
      _(new Date(0)).toJSONUTC.toDateUTC.toObjectUTC._

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
```