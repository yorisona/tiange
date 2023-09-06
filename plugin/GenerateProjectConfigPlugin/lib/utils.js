module.exports.genTemplate = (tmp = '', data) => {
  return tmp.replace(/@\[([^\[]+)\]/g, (match, name) => {
    return data[name];
  });
};

module.exports.hashCode = (str = '') => {
  var hash = 0, i, chr;
  if (str.length === 0) return hash;
  for (i = 0; i < str.length; i++) {
    chr   = str.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};


// 防抖
module.exports.debounce = (fn, delay = 50) => {
  let timer = null;
  return (...args) => {
    if (timer !== null) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

