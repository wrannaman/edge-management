import { call } from '../../api';

export default async (invites) => {
  const res = await call('POST', 'user/invite', invites);
  return res.json();
};
