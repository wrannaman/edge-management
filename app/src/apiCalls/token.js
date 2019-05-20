import { call } from '../api';
const queryString = require('query-string');

export const fetchTokens = async (opts) => {
  try {
    const stringified = queryString.stringify(opts);
    const res = await call('GET', `tokens?${stringified}`)
    return res.json();
  } catch (e) {
    if (e) return e;
    return { error: 'Unknown Error'};
  }
}

export const fetchToken = async (opts) => {
  try {
    const stringified = queryString.stringify(opts);
    const res = await call('GET', `token?${stringified}`)
    return res.json();
  } catch (e) {
    if (e) return e;
    return { error: 'Unknown Error'};
  }
}
