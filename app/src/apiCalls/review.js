import { call } from '../api';
const queryString = require('query-string');

export const saveReview = async(payload) => {
  try {
    const res = await call('POST', `review`, payload);
    return res.json();
  } catch (e) {
    if (e) return e;
    return { error: 'Unknown Error'};
  }
};
