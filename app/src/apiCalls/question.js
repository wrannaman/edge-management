import { call } from '../api';
const queryString = require('query-string');

export const createQuestion = async(payload) => {
  try {
    const res = await call('POST', `question`, payload);
    return res.json();
  } catch (e) {
    if (e) return e;
    return { error: 'Unknown Error'};
  }
};

export const getQuestions = async(payload) => {
  try {
    const res = await call('GET', `questions?${queryString.stringify(payload)}`);
    return res.json();
  } catch (e) {
    if (e) return e;
    return { error: 'Unknown Error'};
  }
};

export const saveResponse = async(payload) => {
  try {
    const res = await call('POST', `question/reply`, payload);
    return res.json();
  } catch (e) {
    if (e) return e;
    return { error: 'Unknown Error'};
  }
};

export const patchQuestion = async(payload) => {
  try {
    const res = await call('PUT', `question`, payload);
    return res.json();
  } catch (e) {
    if (e) return e;
    return { error: 'Unknown Error'};
  }
};
