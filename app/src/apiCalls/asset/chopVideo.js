import { call } from '../../api';
const queryString = require('query-string');

export default async (opts) => {
  try {
    const stringified = queryString.stringify(opts);
    let tail = `asset/chop-video/${opts.id}`;
    if (opts) tail += `?${stringified}`;
    const res = await call('GET', tail);
    return res.json();
  } catch (e) {
    console.error('create asset', e);
    if (e) return e;
  }
};
