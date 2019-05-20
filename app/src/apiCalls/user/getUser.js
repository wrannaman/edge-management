import { call } from '../../api';

export default async () => {
  const res = await call('GET', 'user');
  const json = await res.json();
  return json;
};
