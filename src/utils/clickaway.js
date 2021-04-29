const clickEventType = document.ontouchstart !== null ? 'click' : 'touchstart';
const UNIQUE_ID = '__vue_click_away__';

const unmount = (el) => {
  document.removeEventListener(clickEventType, el[UNIQUE_ID], false);
  delete el[UNIQUE_ID];
};

const mount = (el, binding) => {
  unmount(el);

  const vm = binding.instance;
  const callback = binding.value;

  let nextTick = false;
  setTimeout(() => {
    nextTick = true;
  }, 0);

  el[UNIQUE_ID] = (event) => {
    if(
      (!el || !el.contains(event.target))
      && callback
      && nextTick
      && typeof callback === 'function'
    ) {
      return callback.call(vm, event);
    }
    return null;
  };

  document.addEventListener(clickEventType, el[UNIQUE_ID], false);
};

export default {
  unmounted(el) {
    unmount(el);
  },
  mounted(el, binding, _vnode) {
    mount(el, binding);
  },
  updated(el, binding, _vnode) {
    if(binding.value === binding.oldValue) {
      return;
    }
    mount(el, binding);
  },
};
