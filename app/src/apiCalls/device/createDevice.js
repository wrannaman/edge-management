import { call } from '../../api';

export default async (payload) => {
  try {
    const res = await call('POST', 'device', payload);
    return res.json();
  } catch (e) {
    if (e) return e;
    return { error: 'Unknown Error'};
  }
};
