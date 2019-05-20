import { call } from '../../api';

export default async (id) => {
  try {
    const res = await call('DELETE', `asset/${id}`);
    return res.json();
  } catch (e) {
    console.error('delete asset', e);
    if (e) return e;
  }
};
