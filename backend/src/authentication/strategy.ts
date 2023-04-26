/**
 * This file should never need to be changed
 */

import axios, { AxiosResponse } from "axios";
import qs from "qs";
import { Base64 } from "js-base64";
import express from "express";
import * as passport from "passport";

interface StrategyOptions {
  authorizationURL: string;
  tokenURL?: string;
  profileURL: string;
  clientID: string;
  clientSecret?: string;
  callbackURL: string;
}

export interface Authority {
  id: string;
  authority: string;
}

interface GammaUser {
  cid: string;
  phone?: string;
  authorities: Authority[];
  groups: { superGroup: { name: string; type: string } }[];
  language: string;
}

type VerifyFunction = (
  accessToken: string,
  user: GammaUser,
  verify: (err: Error | null, profile: Express.User, info: any) => void,
) => void;

interface TokenResponse {
  access_token: string;
}

class Strategy extends passport.Strategy {
  options: StrategyOptions;
  _verify: VerifyFunction;
  _authorization: string;

  /**
   * `Strategy` constructor.
   *
   * Options:
   *   - `authorizationURL` /api/oauth/authorize
   *   - `tokenURL`         /api/oauth/token
   *   - `profileURL`       /api/users/me
   *   - `clientID`         client ID
   *   - `clientSecret`     client secret
   *   - `callbackURL`      return address after login
   *
   * @constructor
   * @param {object} options
   * @param {function} verify
   * @access public
   */
  constructor(options: StrategyOptions, verify: VerifyFunction) {
    super();
    this.options = {
      tokenURL: "https://gamma.chalmers.it/api/oauth/token",
      clientSecret: "secret",
      ...options,
    };

    this._verify = verify;
    this.name = "gamma";
    this._authorization =
      "Basic " +
      Base64.encode(this.options.clientID + ":" + this.options.clientSecret);
  }

  /**
   * Authenticate request by delegating to Gamma using OAuth 2.0.
   *
   * @param {http.IncomingMessage} req
   * @param {object} options
   * @access protected
   */
  authenticate(req: express.Request, options: passport.AuthenticateOptions) {
    if (req.query && req.query.error) {
      return this.error(req.query.error_description);
    }

    if (req.query && req.query.code) {
      this._exchange(req.query.code)
        .then(res => this._loadProfile(res.data.access_token))
        .catch(err => this.error(err.message));
      return;
    }

    this._redirectToLogin();
  }

  _loadProfile(accessToken: string) {
    const self = this;
    var done = (err: Error | null, profile: any, info: any) => {
      if (err) {
        self.error(err);
        return;
      }
      if (!profile) {
        self.fail(info);
        return;
      }
      self.success(profile, undefined);
    };

    var verify = (err: Error, user: any) => {
      if (err) {
        self.error(err);
        return;
      }
      self._verify(accessToken, user, done);
    };

    self.userProfile(accessToken, verify);
  }

  _redirectToLogin() {
    var uri = new URL(this.options.authorizationURL);
    uri.searchParams.append("response_type", "code");
    uri.searchParams.append("client_id", this.options.clientID);
    uri.searchParams.append("redirect_uri", this.options.callbackURL);
    this.redirect(uri.href);
  }

  _exchange(code: any): Promise<AxiosResponse<TokenResponse>> {
    return axios.post(
      this.options.tokenURL +
        "?" +
        qs.stringify({
          grant_type: "authorization_code",
          redirect_uri: this.options.callbackURL,
          code: code,
        }),
      null,
      {
        headers: {
          Authorization: this._authorization,
        },
      },
    );
  }

  userProfile(
    accessToken: string,
    done: (error: any, data: GammaUser | null) => void,
  ) {
    axios
      .get(this.options.profileURL, {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      })
      .then(res => done(null, res.data))
      .catch(err => done(err, null));
  }
}

export default Strategy;
