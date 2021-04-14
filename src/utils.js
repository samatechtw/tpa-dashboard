
export function debounce(func, wait) {
  let timer;
  return (...args) => {
    if(!timer) {
      timer = setTimeout(() => {
        func.apply(this, args);
        timer = null;
      }, wait);
    }
  };
}

class UidSingleton {
  constructor() {
    this._counter = 0;
  }

  next() {
    this._counter += 1;
    return this._counter;
  }
}

export const uidSingleton = new UidSingleton();

export const UidMixin = {
  beforeCreate() {
    this._uid = uidSingleton.next();
  },
};
