import { call } from '../../api';

export default async (body) => {
  try {
    const res = await call('PUT', `assets/multi-annotate/${body.id}`, body);
    return res.json();
  } catch (e) {
    console.error('create asset', e);
    if (e) return e;
  }
};
