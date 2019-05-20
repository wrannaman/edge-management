import { useStaticRendering } from 'mobx-react';
import AuthStore from './AuthStore';
import ProjectStore from './ProjectStore';
import MediaStore from './MediaStore';
import DashboardStore from './DashboardStore';
import InviteStore from './InviteStore';

let store = null;
const isServer = !process.browser;

useStaticRendering(isServer);

export default (initialData) => {
  // Always make a new store if server, otherwise state is shared between requests
  if (isServer) {
    return {
      auth: new AuthStore(isServer, initialData),
      project: new ProjectStore(isServer, initialData),
      media: new MediaStore(isServer, initialData),
      dashboard: new DashboardStore(isServer, initialData),
      invite: new InviteStore(isServer, initialData)
    };
  }
  if (store === null) {
    store = {
      auth: new AuthStore(isServer, initialData),
      project: new ProjectStore(isServer, initialData),
      media: new MediaStore(isServer, initialData),
      dashboard: new DashboardStore(isServer, initialData),
      invite: new InviteStore(isServer, initialData)
    };
  }
  return store;
};
