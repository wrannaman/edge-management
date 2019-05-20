import { amplitude_token, amplitude_prefix } from '../config';
import uuid from 'uuid';

let Amplitude = null;
let amplitude = null;

let env_check = process.env.NODE_ENV === 'production';
const prefix = `${process.env.NODE_ENV || "DEV"}-${amplitude_prefix}`;

env_check = true;

let user = null;


let isSetUp = false;
const setup = () => {
  Amplitude = require('amplitude-js');
  amplitude = Amplitude.getInstance();
  amplitude.init(amplitude_token);
  isSetUp = true;
  user = localStorage.getItem('user');
  if (user) {
    user = JSON.parse(user);
    user = user.id;
  }
  if (!user) {
    // logged out users get trcking
    user = localStorage.getItem('USR_TRK');
    if (!user) {
      user = uuid.v4();
      localStorage.setItem('USR_TRK', user);
    }
  }
};

const interval = setInterval(() => {
  if (typeof window !== 'undefined') {
    setup();
    clearInterval(interval);
  }
}, 500);

const actions = {
  setup: () => {
    setup();
  },
  isSetUp: () => {
    return isSetUp;
  },
  track: (name, props = {}) => {
    if (!Amplitude) return setup();
    if (env_check) {
      amplitude.setUserId(user);
      amplitude.logEvent(`${prefix}-${name}`, props);
    }
  },
};

export default actions;
