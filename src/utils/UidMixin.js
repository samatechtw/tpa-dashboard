class UidSingleton {
  constructor() {
    this._counter = 0;
  }

  next() {
    this._counter += 1;
    return this._counter;
  }
}

const uidSingleton = new UidSingleton();

const UidMixin = {
  beforeCreate() {
    this._uid = uidSingleton.next();
  },
};

export default UidMixin;
