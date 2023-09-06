const TokenKey = 'Auth-Token';

export const getToken = () => localStorage.getItem(TokenKey);

export const setToken = (token: string) => {
  localStorage.setItem(TokenKey, `jwt ${token}`);
};

export const removeToken = () => {
  localStorage.removeItem(TokenKey);
};

export const getCode = () => localStorage.getItem('actcode');

export const setCode = (code: string) => {
  localStorage.setItem('actcode', code);
};

export const urlAppendToken = (url: string) => {
  if (url === null || url === undefined) return url;
  // 这里也可以做成, 如果有则替换里面的token
  if (/Authorization=/.test(url)) return url;
  const append = `Authorization=${getToken()}`;
  const searchSymbol = url.includes('?') ? '' : '?';
  return `${url}${searchSymbol}${append}`;
};
