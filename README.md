# white_cats
White Cats define Pure functions

[Node.js CI](https://github.com/johnny-shaman/white_cats/workflows/Node.js%20CI/badge.svg)

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
<script src="https://cdn.jsdelivr.net/npm/white_cats@0.1.28/cat.js"></script>
```

## contents:

### id

```javascript
_.id(57)
// 57
```

###  _.pipe
is function pipe runner

```javascript
_.pipe(
  v => v * 2,
  v => v + 5,
  v => v * 10
)(5)
// 150
```
### _.loop
watch out on argument's first

```javascript
_.loop(
  a => a.forEach(v => v),
  a => a.forEach(v => v)
)(
  [3, 5, 7]
)
// [3, 5, 7]
```

###  _.upto(prototype, descriptor)
is Object.create

```javascript
(() =>  {
  const target = _.upto(Object.freeze({a: true, b: false}), {c: {value: false}});
  target.c === false
})()
```

### _.put(base, assign)
is Object.assign

```javascript
() => {
  const target = {a: 5, b: 3};
  _.put(target, {c: 1, d: 2});
  target.c === 1;
  target.d === 2;
}
```

###  _.define(base, 'key', description)
is Object.defineProperty

```javascript
() => {
  const target = {a: 5, b: 3};
  _.defines(target, 'c', {value: 1});
  target.c === 1;
}
```

###  _.defines(base, descriptions)
is Object.defineProperties

```javascript
() => {
  const target = {a: 5, b: 3};
  _.defines(target, {c: {value: 1}, d: {value: 2}});
  target.c === 1;
  target.d === 2;
}
```

### _.keys
is Object.keys

```javascript
_.keys({a: 5, b: 6})
// ['a', 'b']
```

### _.vals
is Object.values

```javascript
_.vals({a: 5, b: 6})
// [5, 6]
```

### _.entries
is Object.entries

```javascript
_.entries({a: 5, b: 6})
// [['a', 5], ['b', 6]]
```

### _.equal
is Object.is

```javascript
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
```

### _.owns
_.owns(target)

```javascript
// same of
Object.getOwnPropertyNames(target).concat(Object.getOwnPropertySymbols(target))
```

### _.descpipting
is Object.getOwnPropertyDescriptors

```javascript
_.descripting({
  a: 5,
  b: 6
})
```

### _.adapt
assign arguments value in empty to left

```javascript
_.adapt(1, 2, 5)([,,3,4,,6])
// [1, 2, 3, 4, 5, 6]
```

### _.adaptL
assign arguments value in empty to left

```javascript
_.adaptL(1, 2, 5)([,,3,4,,6])
// [1, 2, 3, 4, 5, 6]
```

### _.adaptR
assign arguments value in empty to Right

```javascript
_.adaptR(1, 2, 5)([,,3,4,,6])
// [5, 2, 3, 4, 1, 6]
```

### _.less
omit voidly value
```javascript
_.less([,,null ,undefined ,3 ,4 ,5,,])
// [3, 4, 5]
```

### _.sure
change empty to undefined

```javascript
_.sure([ , , ,0 , 3, 4, 5])
// [undefined, undefined, undefined, 0, 3, 4, 5]
```

### _.by
get's constructor

```javascript
_.by([])
// Array
```

### _.isObject

```javascript
// true
_.isObject({});
_.isObject([]);

// false
_.isObject(8);
```

### _.isArray

```javascript
// true
_.isArray([])

// false
_.isArray({})
```

### _._(start, end, step)

```javascript
[..._._(0, 8, 2)]
// [0, 2, 4, 6, 8]

[..._._(8, 0, -2)]
// [8, 6, 4, 2, 0]

[..._._(5)]
// [0, 1, 2, 3, 4, 5]
```

### _.spin([])
create loop infinite iterator

```javascript
const r = _.spin([1, 2, 3]);
r.now // 1
r.now // 2
r.now // 3
r.now // 1
```

### _.async(resolver)
create Promise

```javascript
async () => await _.async(
  r => setTimeout(t => r('done'), 3000)
)();
// 3sec after return 'done'
```

### _.asyncAll
is Promise.all

```javascript
async () => await _.asyncAll(
      _.async(r => r(3)),
      _.async(r => r(4)),
      _.async(
        r => setTimeout(t => r('done'), 3000)
      )
    )
// 3sec after return [3, 4, 5]
```

### _().$_
return right first

```javascript
_(3).$_
// 3

_(3, 4).$_
// 4
```

### _()._$
return left first

```javascript
_(3)._$
// 3

_(3, 4)._$
// 3

_(null, 4)._$
// 4
```

### _().re
swap starting and ending value

```javascript
_(3, 4).re
// it same at _(4, 3)
```

### _().flat
has Kleisli Triple and function piping

```javascript
// left Identity
_({a: 5})
.flat(o => _({a: o.a * 3}))
._
(o => _({a: o.a * 3}))({a: 5})._

// Right Identity
_({a: 5})
.flat(_)
.flat(_)
._
// {a: 5}

// Associativity
_({a: 5})
.flat(o => _({a: o.a * 3}))
.flat(o => _({a: o.a + 5}))
._
_({a: 5})
.flat(
  o => _({a: o.a * 3})
  .flat(
    o => _({a: o.a + 5})
  )
)._
```

### _().pipe
function's pipeline runner

```javascript
_({a: 5})
.pipe(
  o => ({a: o.a * 3}),
  o => ({a: o.a + 5})
)
._.a
// 20
```

### _().loop
is watch out on argument's first

```javascript
_([3, 4, 5])
.loop(
  o => o.unshift(2, 3),
  o => o.push(2, 3),
  o => o.filter(v => v < 3)
)
._
// [2, 3. 3, 4, 5, 2, 3]
```

### _().call
is Object's method caller in call(self) and return result

```javascript
_([3, 4, 5]).call('push')(5, 6)._
// 5
```

### _().s_r
is Object's method caller in call(self) and callback recieve result and return self

```javascript
_([3, 4, 5]).s_r('push')(5, 6)(v => v === 5)._
// [3, 4, 5, 5, 6]
```
### _().cast
is Object's method caller in call(self) and return self

```javascript
_([3, 4, 5]).call('push')(5, 6)._
// [3, 4, 5, 5, 6]
```

### _().Been
is Chaining method calling in the way to take a Object

```javascript
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
```
### _().As
is Chaining method calling in the way to take a Object

```javascript
_([3, 5, 7])
.As
[0](console.log)       // refer
[1](console.log)      // 
[2](console.log)       // 
.push(5, 6)  // 5
.push(4, 3)  // 7
.As
._
// [3, 5, 7, 5, 6, 4, 3]
```

### _().toJSON
is JSON.stringify

```javascript
_({a: 5, b: 6}).toJSON._ === JSON.stringify({a: 5, b: 6})
```

### _(function*).take
is take generator's valuelist

```javascript
_((function* (x) {
  while (true) {
    yield x++;
  }
})(0))
.take(5)
._
//[0, 1, 2, 3, 4]
```

### _({}).filter
is Object.filter

```javascript
_({a: 5, b: 4, c: 3, d: 2, e : 1})
.filter(v => v < 4)
._
// {c: 3, d: 2, e : 1}
```

### _({}).each
is Object.entries.forEach

```javascript
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
```

### _({}).map
is Object.map

```javascript
_({a: 5, b: 4, c: 6}).map((v, k) => k + v)._
// {a: 'a5', b: 'b4', c: 'c6'}
```

### _({}).get
is getter about Object

```javascript
_({a: 3, b: {c: 4, d: {e: 6}}}).get('b.d.e')._
// 6

_({a: 3, b: {c: 4, d: {e: 6}}}).get('b.e.f')._
// undefined
```

### _({}).set
is setter about Object

```javascript
_({a: 3, b: {c: 4, d: {e: 6}}}).set('b.d.e')(3)._
// {a: 3, b: {c: 4, d: {e: 3}}}

_({a: 3, b: {c: 4, d: {e: 6}}}).set('b.c.f')(3)._
// {a: 3, b: {c: {f: 3}, d: {e: 6}}}
```

### _({}).put
is Object.assign

```javascript
_({a: 3, b: {c: 4, d: {e: 6}}}).get('b.d').put({f: 7}).$_
// {a: 3, b: {c: 4, d: {e: 6, f: 7}}}
```

### _({}).cut
is delete property

```javascript
_({a: 3, b: {c: 4, d: {e: 6}}}).cut('b.d')._
// {a: 3, b: {c: 4}}

_({a: 3, b: {c: 4, d: {e: 6}}}).cut('b.e')._
// {a: 3, b: {c: 4, d: {e: 6}}}
```

### _({}).refer
property referer callback

```javascript
_({a: 3, b: {c: 4, d: {e: 6}}})
.refer('b.d.e')(console.log)
._ // 6
// {a: 3, b: {c: 4, d: {e: 6}}}
```

### _({}).gaze
is refer property and get's more argument

```javascript
_({a: 3, b: {c: 4, d: {e: 6}}})
.gaze('b.d.e')(4, 5, 6)(console.log)
._
// {a: 3, b: {c: 4, d: {e: 6}}}
```

### _({}).mend
is property modifier

```javascript
_({a: 3, b: {c: 4, d: {e: 6}}}).mend('b.d.e')(v => v * 3)._
// {a: 3, b: {c: 4, d: {e: 18}}}
```

### _({}).modify
is modify property and get's more argument

```javascript
_({a: 3, b: {c: 4, d: {e: 6}}})
.modify('b.d.e')(4, 5, 6)(
  (v, w, x, y) => (v - w) * x + y
)
._
// {a: 3, b: {c: 4, d: {e: 16}}}
```

### _({}).give
is deepAssigning Object more safely about Object.assign

!!!Carefuly!!!
give is take of the first argument Object
normaly use _({}).take

```javascript
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
```

### _({}).take
is deepAssigning Object more safely about Object.assign

```javascript
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
```

### _({}).define
is Object.defineProperties applying

```javascript
(() => {
  const target = {a: 5, b: 3};
  _(target).define({c: {value: 1}, d: {value: 2}})._;
  // target like {a: 5, b: 3, c: 1, d: 2}
})
```

### _({}).append
is promoting prototype that Object.create

```javascript
_(Object.prototype).append({c: {value: false}})._;
// {c: false}
```

### _({}).depend
is depending prototype that Object.create

```javascript
_({c: {value: false}}).depend(Object.prototype)._;
// {c: false}
```

### _({}).pick
Object's deepPicker that distinate Query String

```javascript
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
```

### _({}).drop
Object's deepDropper that distinate Query String

```javascript
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
.drop('a, b[c, d[e, g.k], g[j, k]]') // parse to  'a, b.c, b.d.e, b.d.g.k, g.j, g.k'
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
```

### _({}).keys
get's Object.keys

```javascript
_({a: 5, b: 6}).keys._
// ['a', 'b']
```

### _({}).vals
get's Object.values

```javascript
_({a: 5, b: 6}).vals._
// [5, 6]
```

### _({}).entries
get's Object.entries

```javascript
_({a: 5, b: 6}).entries._
// [['a', 5], ['b', 6]]
```

### _({}).toDate
process from Date structure to Date Object

```javascript
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
```

### _({}).toDateUTC
process from DateUTC structure to Date Object

```javascript
_({
  yrUTC: 2020,
  moUTC: 1,
  dtUTC: 1,
  hrUTC: 0,
  minUTC: 0,
  secUTC: 0,
}).toDateUTC._

//Data: 2020-1-1 that have UTC GMT
```

### _(constructor).delegate
constructor function's inheritance Other One's

```javascript
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
```

### _(constructor).prepends
assign methods in this constructor

```javascript
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
```

### _(constructor).implements
define methods in this constructor

```javascript
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
```

### _(function).take([])
is partial applying and
what cut to overflow args and run once it

.of means args.push
.to means args.unshift


```javascript
_((...a) => a.reduce((p, c) => p + c))
.take([,,3,,,])
.to(1, 2)
.of(4, 5)
.to(3, 4)
.of(2, 3)
._
// 15
```

### _(function).each
is applying each value

```javascript
_(v => v * 3).each(3, 5, 7)._
// [9, 15, 21]
```

### _(function).done is manageing onto delaying and forceing or applying

```javascript
_(v => v * 5)
.done(3) // apply it
.done(4) // no action
.done(5) // no action
._

// 15
```

### _([]).liken
to likely value array 

```javascript
_([0, 1, 2, 3, 4, 5]).liken([1, 100, 2, 200, 3, 300])._
// [1, 2, 3]
```

### _([]).equaly
pick of same key value

```javascript
_([0, 1, 2, 3, 4, 5]).equaly([1, 1, 2, 3, 5, 8])._
// [1, 2, 3]
```

### _([]).toggle
exist value remove and unexist value add

```javascript
_([0, 1, 2, 3, 4, 5]).toggle(1, 3, 5, 8)._
// [0, 2, 4, 8]
```

### _([]).pick
pick up exist values

```javascript
_([0, 1, 2, 3, 4, 5, 6, 7, 8]).pick(-1, 2 ,5 ,6)._
// [2, 5, 6]
```

### _([]).drop
omit at exist values

```javascript
_([1, 2, 3, 4, 5]).drop(2, 4, 6)._
// [1, 3, 5]
```

### _([]).chunk
rewrap array in partial array

```javascript
_([0, 1, 2, 3, 4, 5]).chunk(2)._
// [[0, 1], [2, 3], [4, 5]]
```

  ### _([]).unique
is pick up different values

```javascript
_([1, 2, 3, 4, 5, 2, 6, 3]).unique._
// [1, 2, 3, 4, 5, 6]
```

### _([]).union
is concat other Array and pick up different values

```javascript
_([3, 4, 5, 6]).union([0, 1, 2, 3, 4])._
// [0, 1, 2, 3, 4, 5, 6]
```

### _([]).put
is replase other Array;

```javascript
_([3, 4, 5, 6, 7]).put([,,3,4,,,8,9])._
// [3, 4, 3, 4, 7]
```

### _([]).exist
is apply Array.prototype.includes

```javascript
_([2, 8]).exist(8)._
// true

_([2, 8]).exist(3)._
// false
```

### _([]).pickKey
is pick Array in Object can use _({}).pick 's query string

```javascript
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
```

### _([]).dropKey
is drop Array in Object can use _({}).drop 's query string

```javascript
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
```

### _([]).pushL

```javascript
_([1, 2, 3]).pushL(-1, 0)._
// [-1, 0, 1, 2, 3]
```

### _([]).pushR

```javascript
_([1, 2, 3]).pushR(4, 5)._
// [1, 2, 3, 4, 5]
```

### _([]).popL

```javascript
_([1, 2, 3]).popL._
// 1
```

### _([]).popR

```javascript
_([1, 2, 3]).popR._
// 3
```

### _([]).omitL

```javascript
_([1, 2, 3]).omitL._
// [2, 3]
```

_([]).omitR

```javascript
_([1, 2, 3]).omitR._
// [1, 2]
```

### _([]).each
like for ...of iteration

```javascript
_([1, 2, 3, 4, 5]).each(console.log)._
```

### _([]).lift
highly function recieve in this Array

```javascript
_([1 ,2 ,3 ,4 ,5])
.lift(
  a => a
  .map(v => v + 8)
  .reduce((p, c) => p + c)
)._
// 55
```

### _([]).fold
is reduceing to left 

```javascript
_([1, 3, 5]).fold((p, c) => p - c)._
// -7
```

### _([]).foldL
is reduceing to left 

```javascript
_([1, 3, 5]).foldL((p, c) => p - c)._
// -7
```

### _([]).foldR
is reduceing to Right

```javascript
_([1, 3, 5]).foldR((p, c) => p - c)._
// 1
```

### _([]).filter
apply Array.prototype.filter

```javascript
_([1, 2, 3, 4, 5]).filter(v => v < 4)._
// [1, 2, 3]
```

### _([]).rotate
is transeform Array vector 

```javascript
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
```

### _([]).aMap
via applicative map

```javascript
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
```

### _([]).map
is map to other Array

```javascript
_([1, 2, 3, 4, 5])
.map(
  v => v * 5,
  v => v + 3,
)
._
// [8, 13, 18, 23, 28]
```

### _([]).fMap
is Array flatMap 

```javascript
_([1, 2, 3, 4, 5])
.fMap(
  v => [v * 5],
  v => [v + 3],
)
._
// [8, 13, 18, 23, 28]
```

### _([]).mapDeep
is map to other Array it apply deep Array

```javascript
_([1, [2, [3, [4, [5]]]]])
.map(
  v => v * 5,
  v => v + 3,
)
._
// [8, [13, [18, [23, [28]]]]]
```

### _([]).flatten
is Array flatten

```javascript
_([[1, 2], 3, [4, [5]]]).flatten(2)._
// [ 1, 2, 3, 4, 5 ]
```

### _([]).back
apply Array .prototype.reverce
!!!Not Pure!!!

```javascript
_([1, 2, 3, 4, 5]).back._
// [5, 4, 3, 2, 1]
```

### _([]).adapt
assign empty place at left

```javascript
_([ , ,3 , , ,]).adapt(1, 2, 4, 5)._
// [1, 2, 3, 4, 5]
```

### _([]).adaptL
assign empty place at left

```javascript
_([ , ,3 , , ,]).adaptL(1, 2, 4, 5)._
// [1, 2, 3, 4, 5]
```

### _([]).adaptR
assign empty place at right

```javascript
_([ , ,3 , , ,]).adaptR(1, 2, 4, 5)._
// [5, 4, 3, 2, 1]
```

### _([]).concat
marge Array

```javascript
_([1, 2, 3, 4, 5]).concat([6, 7, 8])._
// [1, 2, 3, 4, 5, 6, 7, 8]
```

### _([]).replace
is Array replacement
!!!Not Pure!!!

```javascript
_([1, 2, 3, 4, 5]).replace(2, 2, 6)._
// [1, 2, 6, 5]
```

### _([]).splice
call Array.prototype.splice
!!!Not Pure!!!

```javascript
_([1, 2, 3, 4, 5]).splice(2, 2, 6)._
// [3, 4]
```

### _([]).slice
call Array.prototype.slice

```javascript
_([1, 2, 3, 4, 5]).slice(2, 2)._
// [3, 4]
```

### _([]).sort
apply Array.prototype.sort

```javascript
_([4, 2, 5, 1, 3]).sort()._
// [1, 2, 3, 4, 5]
```

### _([]).indexL
via indexOf

```javascript
_([1, 2, 3, 2, 5]).indexL(2)._
// 1
```

### _([]).indexR
via lastIndexOf

```javascript
_([1, 2, 3, 2, 5]).indexR(2)._
// 3
```

### _([]).any
via Array.prototype.some

```javascript
_([1, 2, 3, 2, 5]).any(v => v > 4)._
// true
```

### _([]).all
via Array.prototype.every

```javascript
_([1, 2, 3, 2, 5]).all(v => v > 4)._
// [1, 2, 3, 4, 5].every(v => v > 4)
```

### _([]).unite
spread and apply to function

```javascript
_([1, 2, 3]).unite((a, b, c) => (a + b) * c)._
// 9
```

### _([]).sum
add all value

```javascript
_([1, 2, 3, 4, 5]).sum._
// 15
```

### _([]).pi
product all value

```javascript
_([1, 2, 3, 4, 5]).pi._
// 120
```

### _([]).average
get average value

```javascript
_([1,1,5,3,8,8,9,10,12,12,13,13,13,14]).average._
// 8.71...
```

### _([]).max
get max value

```javascript
_([1,2,3,4,5,3,8,2]).max._
// 8
```

### _([]).min
get min value

```javascript
_([1,2,3,4,-3,3,8,2]).min._
// -3
```

### _([]).mid
get median value

```javascript
_([3, 4, 2, 7, 6, 5, 1]).mid._
// 4
```

### _([]).less
omit voidly value

```javascript
_([ , ,3 ,4 , , ,5 , ,]).less._
// [3, 4, 5]
```

### _([]).sure
replase from empty to undefined

```javascript
_([ , ,3 ,4 , , ,5 , ,]).sure._
// [undefined ,undefined ,3 ,4 ,undefined ,undefined ,5 ,undefined]
```

### _([]).admix
from Array to Object

```javascript
_([1, 2, 3, 4, 5]).admix(...'abcde')._
/*
  {
    a: 1,
    b: 2,
    c: 3,
    d: 4,
    e: 5
  }
*/
```

### _().fullen
not exist voidly value

```javascript
// *** false ***
_([,2,3]).fullen._
_([1,,3]).fullen._
_([1,2,,]).fullen._
_([null, 2, 3]).fullen._
_([1, null, 3]).fullen._
_([1, 2, null]).fullen._
_([void 0, 2, 3]).fullen._
_([1, void 0, 3]).fullen._
_([1, 2, void 0]).fullen._
_({a: null, b: 2, c: 3}).fullen._
_({a: 1, b: null, c: 3}).fullen._
_({a: 1, b: 2, c: null}).fullen._
_({a: void 0, b: 2, c: 3}).fullen._
_({a: 1, b: void 0, c: 3}).fullen._
_({a: 1, b: 2, c: void 0}).fullen._

// *** true ***
_({a: 0, b: true, c: false}).fullen._
_([0, true, false]).fullen._
```

### _('').toObject
apply JSON.parse

```javascript
_('{"a": 5}').toObject._
// {a: 5}
```

### _('').toDate
date string parse to Date Object

```javascript
_("2000-01-01T00:00:00.000Z").toDate._.getDate()
// 1

_('{"yr": 2000, "mo": 1, "dt": 1}').toDate._.getDate()
// 1
```
​
### _(Date).get
is get whitch 

Get LocalTimeZone
'yr':   fullYear
'mo':   month (not month ID)
'dt':   date
'dy':   day of the week ID
'wk':   number of the week
'hr':   hour
'min':  minute
'sec':  secounds
'ms':   msec

Get UTC
'yrUTC':  fullYear
'moUTC':  month (not month ID)
'dtUTC':  date
'dyUTC':  day of the week ID
'hrUTC':  hour
'minUTC': minute
'secUTC': secounds
'msUTC':  msec

if single kind return value

```javascript
_(new Date(0)).get('yr')._
// 1970
```


if multi kind return Object

```javascript
_(new Date(0)).get('yr, mo, dt, dy, hr, min, sec, ms')._

/*
  {
    yr: 1970,
    mo: 1,
    dt: 1,
    dy: 4,
    wk: 1,
    hr: Math.trunc(_.zone / 60),
    min: _.zone % 60,
    sec: 0,
    ms: 0
  }
*/
```

get UTC

```javascript
_(new Date(0)).get('yrUTC, moUTC, dtUTC, dyUTC, hrUTC, minUTC, secUTC')._

/*
  {
    yrUTC: 1970,
    moUTC: 1,
    dtUTC: 1,
    dyUTC: 4,
    hrUTC: 0,
    minUTC: 0,
    secUTC: 0
  }
*/
```

### _(Date).put
Date Object set value like a Object.assign

```javascript
_(new Date(0))
.put({
  yr: 2020,
  mo: 5, // not Month ID It meen 'May'
  dt: 28,
  hr: 15,
  min: 28,
  sec: 16,
  ms: 330
})
.get('yr, mo, dt, dy, hr, min, sec, ms')
._

/*
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
*/

_(new Date(0))
.put({
  yrUTC: 2020,
  moUTC: 5, // not Month ID It meen 'May'
  dtUTC: 28,
  hrUTC: 15,
  minUTC: 28,
  secUTC: 16
})
.get('yrUTC, moUTC, dtUTC, dyUTC, hrUTC, minUTC, secUTC')
._

/*
  {
    yrUTC: 2020,
    moUTC: 5,
    dtUTC: 28,
    dyUTC: 4,
    hrUTC: 15,
    minUTC: 28,
    secUTC: 16,
  }
*/
```

### _(Date).map
modify Date Object's it works likely Date .get's and set's keys

```javascript
_(new Date(0))
.map('min, sec')(
  ({min, sec}) => ({min: min + 1, sec: sec + 30})
)
.get('min, sec')
._

/*
  {
    min: 1,
    sec: 30
  }
*/

_(new Date(0))
.map(
  'sec'
)(
  s => s + 15
)
.get('sec')
._

// 15
```

### _(Date).endOfMo
get the last month of the date

```javascript
_(new Date(0)).endOfMo.get('mo, dt')._

/*
  {
    mo: 1,
    dt: 31
  }
*/
```

### _(Date).endOfMoUTC
get the last month of the date in UTC GMT

```javascript
_(new Date(0)).endOfMoUTC.get('moUTC, dtUTC')._

/*
  {
    moUTC: 1,
    dtUTC: 31
  }
*/
```

### _(Date).zone
get TimeZone offset value

```javascript
_(new Date(0)).zone._
```

### _(Date).raw
get raw millisec at UTC 0

```javascript
_(new Date(0)).raw._
// 0
```

### _(Date).ISO
get ISO String

```javascript
_(new Date(0)).ISO._
```

### _(Date).UTC
get UTC String

```javascript
_(new Date(0)).UTC._
```


### _(Date).toObject
get Date infomation on Object

```javascript
_(new Date(0)).toObject._

/*
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
*/
```

### _(Date).toObjectUTC
get Date by UTC infomation on Object

```javascript
_(new Date(0)).toObjectUTC._

/*
      {
        yrUTC: 1970,
        moUTC: 1,
        dtUTC: 1,
        dyUTC: 4,
        hrUTC: 0,
        minUTC: 0,
        secUTC: 0
      }
*/
```

### _(Date).toJSON
via _(Date).toObject.toJSON._

```javascript
_(new Date(0)).toJSON._

// expect
JSON.stringify({
  yr: 1970,
  mo: 1,
  dt: 1,
  dy: 4,
  hr: Math.trunc(_.zone / 60),
  min: _.zone % 60,
  sec: 0,
  ms: 0
});
```

### _(Date).toJSONUTC
via _(Date).toObjectUTC.toJSON._

```javascript
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
```

### _(JSON).toDate
Parse from _(Date).toJSON._

```javascript
_(new Date(0)).toJSON.toDate.toObject._

/*
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
*/
```

### _(Date).toJSONUTC
Parse from _(Date).toJSONUTC._

```javascript
_(new Date(0)).toJSONUTC.toDateUTC.toObjectUTC._

/*
  {
    yrUTC: 1970,
    moUTC: 1,
    dtUTC: 1,
    dyUTC: 4,
    hrUTC: 0,
    minUTC: 0,
    secUTC: 0
  }
*/
```

### _.zone
have a Timezone information on minutes base


## Event driven development:

~~~javascript
const EETest = _(EventEmitter).fork(function () {
  EventEmitter.call(this)
})._

const eeTest = new EETest()

//addLitener
_(eeTest).on({
  a: 3,
  "get" () {
    this.a === 3 // true
    this.put() // can call it
  },
  "put": () => {},
  "post": () => {},
  "delete": () => {}
})

//addOnce
_(eeTest).once({
  b: 10,
  "get" () {
    this.b === 10 // true
    this.put() // can call it
  },
  "put": () => {},
  "post": () => {},
  "delete": () => {}
})
~~~

Special Thanks
[mafumafuultu](https://github.com/mafumafuultu)