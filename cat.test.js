(() => {
  let _ = {
    endo: o => (...f) => _.pipe(...f)(o),
    pipe: (...f) => f.reduceRight((g, h) => (...v) => g(h(...v))),
    id: v => v,
    C: 
  }
})()

class Adjunction {
  constructor (U, F, O) {
    this.id = () => O;
    this.r = U;
    this.l = F;
  }
  L (f) {return this.l(f(this.id)), this}
  R (f) {return this.r(f(this.id)), this}
  U () {return this.L(this.R(this.id)), this}
  C () {return this.R(this.L(this.id)), this}
}