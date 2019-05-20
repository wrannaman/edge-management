import { call } from '../../api';
const queryString = require('query-string');

export default async (opts) => {
  const stringified = queryString.stringify(opts);
  const res = await call('GET', `user/invites?${stringified}`);
  return res.json();
};
