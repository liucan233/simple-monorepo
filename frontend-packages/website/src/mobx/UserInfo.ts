import { makeObservable, observable, runInAction, action } from "mobx";
import { fetchJson, wrappedFetch } from "../libraries/wrappedFetch";
import { serverPrefix } from "../config";

export type TUser = {
  name?: string;
  token?: string;
  email?: string;
  avatar?: string;
};

export type TCaptchaSigninReq = {
  email: string;
  captcha: string;
  avatar?: string;
  name?: string;
  password?: string;
};

export type TUpdateUserInfoReq = {
  avatar: string;
  name: string;
  password: string;
};

export class UserInfo {
  token = "";
  email = "";
  name = "";
  errMsg = "";
  avatar = "";
  signinup = false;
  constructor() {
    makeObservable(this, {
      token: observable.ref,
      email: observable.ref,
      name: observable.ref,
      setUserInfo: action,
    });
  }

  setUserInfo(u: TUser) {
    const { email, token, avatar, name } = u;
    if (email) {
      this.email = email;
    }
    if (name) {
      this.name = name;
    }
    if (avatar) {
      this.avatar = avatar;
    }
    if (token) {
      this.token = token;
      localStorage.setItem("user_token", u.token);
    }
  }
  async signin(email: string, password: string) {
    const token = await fetchJson(`${serverPrefix}/user/signin`, {
      method: "post",
      data: {
        email,
        password,
      },
    });
    if (token) {
      this.setUserInfo({ token });
    }
  }

  async signinByCaptcha(params: TCaptchaSigninReq) {
    const token = await fetchJson(`${serverPrefix}/user/signinByCaptcha`, {
      method: "post",
      data: params,
    });
    if (token) {
      this.setUserInfo({ token });
    }
    await this.fetchUserInfo();
  }

  async sendCaptcha(email: string) {
    const data = await fetchJson(`${serverPrefix}/user/captcha`, {
      method: "post",
      data: { email },
    });
    if (data.registeredUser) {
      runInAction(() => {
        this.signinup = true;
      });
    }
  }

  async fetchUserInfo() {
    if(!this.token){
      return;
    }
    const data = await fetchJson(`${serverPrefix}/user/info`);
    this.setUserInfo(data);
  }
  async updateUserInfo(u: TUpdateUserInfoReq) {
    const data = await fetchJson(`${serverPrefix}/user/update`, {
      method: "post",
      data: u,
    });
    this.fetchUserInfo();
  }
}

export const createUserInfo = () => {
  const userInfo = new UserInfo();
  userInfo.token=localStorage.getItem('user_token');
  userInfo.fetchUserInfo();
  return userInfo;
};
