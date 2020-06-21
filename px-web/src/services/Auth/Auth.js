import jwtDecode from "jwt-decode";

export default class Auth {

  constructor(host, loginPath) {
    this.host = host;
    this.loginPath = loginPath;
    this.tokenKey = "auth_token";

    // this.setToken = this.setToken.bind(this)
    // this.isTokenValid = this.isTokenValid.bind(this)
    // this.getToken = this.getToken.bind(this)
    // this.isTokenExist = this.isTokenExist.bind(this)
    // this.fetch = this.fetch.bind(this)
  }

  isTokenValid() {
    try {
      const decoded = jwtDecode(this.getToken());
      if (decoded) {

        return true;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  isLoggedIn() {
    console.log("looged in?");
    
    if (this.isTokenValid()) return true;

    return false;
  }

  getUserID() {
    try {
      const decoded = jwtDecode(this.getToken());
      if (decoded) {
        return decoded.userID;
      }
    } catch (error) {
      // console.log(error);
      return undefined;
    }
  }

  getDecodedToken() {
    try {
      const decoded = jwtDecode(this.getToken());
      if (decoded) {
        return decoded;
      }
    } catch (error) {
      // console.log(error);
      return undefined;
    }
  }

  login(credentials) {
    fetch(this.host + this.loginPath, {
      method: "POST",
      body: JSON.stringify({ ...credentials })
    })
      .then(res => res.json())
      .then(res => {
        if (res.token) {
          this.setToken(res.token)
        } else {
          throw new Error("Auth Failed!")
        }
      })
      .catch(err => {
        console.error(err.message);
      })
  }

  logout() {
    localStorage.removeItem(this.tokenKey)
  }

  isTokenExist() {
    const token = this.getToken()
    if (token !== null) {
      return true;
    }

    return false;
  }

  setToken(token) {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken() {
    return localStorage.getItem(this.tokenKey)
  }

  fetch(options) {
    return fetch(this.host,
      {
        headers: {
          "Authorization": "Bearer " + this.getToken()
        },
        ...options
      })
      .then(res => res.json())
  }

}