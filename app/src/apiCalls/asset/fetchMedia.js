import { call } from '../../api';
const queryString = require('query-string');

export default async (opts) => {
  try {
    const stringified = queryString.stringify(opts);
    if (!opts.id && !opts.projectID) return {};
    let tail = `assets/${opts.id || opts.projectID}`;
    if (opts) tail += `?${stringified}`;
    const res = await call('GET', tail);
    return res.json();
  } catch (e) {
    if (e) return e;
    return { error: 'Unknown Error'};
  }
};
