import { call } from '../api';

export const createUnit = async (name, unit) => {
  try {
    const res = await call('POST', 'meta', { name, unit })
    return res.json();
  } catch (e) {
    if (e) return e;
  }
}
