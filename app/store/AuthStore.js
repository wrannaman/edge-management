import { action, observable, computed, toJS } from 'mobx';
import { getUser, saveProfile, tokenCheck } from '../src/apiCalls/user';
import { maybeSetToken } from '../src/api';
const _userObject = {
  token: '',
  name: '',
  role: '',
  id: '',
  picture: '',
  email: '',
  idToken: '',
  username: '',
  teams: [],
};

class AuthStore {

  @observable user = _userObject
  @observable orderHistory = [];
  @observable allSpecialty = [];
  @observable customer = {};
  @observable backgrounds = [];

  @computed get me() {
    return this.user;
  }

  @action.bound update = (k, v) => this[k] = v;

  @action.bound async checkTokenAndSetUser({ id_token }) {
    const res = await tokenCheck(id_token);
    if (res && res.user) {
      const { email, first_name, last_name, id, teams, role, walkthroughs } = res.user;
      this.user.email = email;
      this.user.first_name = first_name;
      this.user.last_name = last_name;
      this.user.id = id;
      this.user.walkthoughs = walkthroughs;
      this.user.teams = teams;
      this.user.role = role;
      localStorage.setItem('@SUGAR-USER', JSON.stringify(res.user));
      maybeSetToken(id_token);
    }

  }

  @action.bound setUserKey(key, value) {
    this.user[key] = value;
  }

}

export default AuthStore;
