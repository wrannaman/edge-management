import { action, observable, toJS } from 'mobx';

class InviteStore {
  @observable invited = [];
  @observable counts = [];

  @action.bound update = (k, v) => {
    this[k] = v;
  }
}

export default InviteStore;
