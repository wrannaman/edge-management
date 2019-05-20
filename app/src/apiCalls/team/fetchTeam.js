import { call } from '../../api';

export default async (id) => {
  try {
    const res = await call('GET', `team/${id}`);
    return res.json();
  } catch (e) {
    if (e) return e;
    return { error: 'Unknown Error'};
  }
};
