(() => {
  let _ = {
    endo: o => (...f) => _.pipe(...f)(o),
    pipe: (...f) => f.reduceRight((g, h) => (...v) => g(h(...v))),
    id: v => v,
    pure: v => Object.create(_.M, {join: {
      value () {
        return v;
      }
    }}),
    M: {
      bind (...f) {
        
      }
    },
    St: Object.create(_.M, {});
  }
})()