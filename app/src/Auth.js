// src/Auth/Auth.js

import auth0 from 'auth0-js';
import { auth0Config } from '../config';
import { Auth0LockPasswordless } from 'auth0-lock';
import { primary } from '../utils/colors';

export default class Auth {
  constructor() {
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.renewalInProgress = false;

    const passwordlessOptions = {
      allowedConnections: ['email', 'google'],
      passwordlessMethod: 'code',
      auth: {
        redirectUrl: auth0Config.redirectUrl,
        responseType: 'token id_token',
        params: {
          scope: 'openid email'
        }
      },
      closable: true,
      languageDictionary: {
        signUpTerms: "I agree to the <a href='/terms' target='_new'>terms of service</a> and <a href='/privacy' target='_new'>privacy policy</a>.",
        title: "Sugar Analytics",
      },
      theme: {
        labeledSubmitButton: true,
        logo: "https://s3.us-west-1.wasabisys.com/public.sugarkubes/kubes_only_square.png",
        primaryColor: primary,
      }
    };

    const lockPasswordless = new Auth0LockPasswordless(
      auth0Config.clientId,
      auth0Config.domain,
      passwordlessOptions
    );

    this.lock = lockPasswordless;
    this.auth0 = new auth0.WebAuth({
      domain: auth0Config.domain,
      clientID: auth0Config.clientId,
      redirectUri: auth0Config.redirectUrl,
      responseType: 'token id_token',
      scope: 'openid email'
    });
  }

  login() {
    this.lock.show();
  }

  handleAuthentication(history) {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult, history);
        history.push({
          pathname: '/dashboard',
          query: { }
        });
      } else if (err) {
        if (err.error) err = err.error;
        history.push({
          pathname: '/',
          query: { error: err }
        });
      }
    });
  }

  getSession() { // eslint-disable-line
    const access_token = localStorage.getItem('@SUGAR_ANALYTICS-access_token');
    const id_token = localStorage.getItem('@SUGAR_ANALYTICS-id_token');
    return { access_token, id_token };
  }

  setSession(authResult, history, navigate = true) {
    const expiresAt = JSON.stringify((authResult.idTokenPayload.exp * 1000));
    localStorage.setItem('@SUGAR_ANALYTICS-access_token', authResult.accessToken);
    localStorage.setItem('@SUGAR_ANALYTICS-id_token', authResult.idToken);
    localStorage.setItem('@SUGAR_ANALYTICS-expires_at', expiresAt);
    this.scheduleRenewal();
    // navigate to the home route
    if (history && navigate) {
      history.push({
        pathname: '/dashboard',
      });
    }
  }

  logout(history) { // eslint-disable-line
    // Clear Access Token and ID Token from local storage
    localStorage.removeItem('@SUGAR_ANALYTICS-access_token');
    localStorage.removeItem('@SUGAR_ANALYTICS-id_token');
    localStorage.removeItem('@SUGAR_ANALYTICS-expires_at');
    // navigate to the home route
    history.push({
      pathname: '/',
    });
    window.location = `https://${auth0Config.domain}/v2/logout?returnTo=${auth0Config.redirectUrl.replace('/callback', '')}&client_id=${auth0Config.clientId}`;
  }

  renewToken() {
    this.auth0.checkSession({},
      (err, result) => {
        if (err) {
          console.error(`Could not get a new token (${err.error}: ${err.error_description}).`);
        } else {
          this.setSession(result, null, false);
          // console.log('renewed auth');
          // alert(`Successfully renewed auth!`);
        }
      }
    );
  }

  scheduleRenewal() {
    if (this.renewalInProgress) return;
    this.renewalInProgress = true;
    setTimeout(() => {
      this.renewalInProgress = false;
    }, 10000)
    const expiresAt = JSON.parse(localStorage.getItem('@SUGAR_ANALYTICS-expires_at'));
    const delay = expiresAt - Date.now();
    if (delay > 0) {
      this.tokenRenewalTimeout = setTimeout(() => {
        this.renewToken();
      }, delay);
    }
  }

  isAuthenticated() {
    // Check whether the current time is past the
    // Access Token's expiry time
    let expiresAt = JSON.parse(localStorage.getItem('@SUGAR_ANALYTICS-expires_at'));
    // console.log('EXPIRESAT', expiresAt)
    // console.log('is okay? ', new Date().getTime() < expiresAt);
    return new Date().getTime() < expiresAt;
  }
}
