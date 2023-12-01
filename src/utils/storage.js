const storagePrefix = 'value_';

const storage = {
  getToken: () => {
    const token = window.sessionStorage.getItem(`${storagePrefix}token`);
    return !Object.is(token, null) ? JSON.parse(token)['token'] : null;
  },
  setToken: (token) => {
    window.sessionStorage.setItem(`${storagePrefix}token`, JSON.stringify(token));
  },
  clearToken: () => {
    window.sessionStorage.removeItem(`${storagePrefix}token`);
  }
};

export default storage;
