Function.prototype.before = function (fun) {
  const self = this;
  return (...args) => {
    fun.apply(this, args);
    return self.apply(this, args);
  };
};

Function.prototype.after = function (fun) {
  const self = this;
  return (...args) => {
    const ret = self.apply(this, args);
    fun.apply(this, args);
    return ret;
  };
};
