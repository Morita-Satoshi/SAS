import axios from "axios";
import config from "../assets/config";

//const baseURL = config.api.baseURL;
const baseURL = "https://13bg49njm7.execute-api.ap-northeast-1.amazonaws.com/dev"

// 最大ログイン時間(操作をすることで継続される)
const maxIntervalSec = config.api.maxIntervalSec;

export default {
  get: (url, query) => {
    const headers = {
      "Content-Type": "application/json;charset=UTF-8"
    };
    const store = window.$nuxt.$store;
    const router = window.$nuxt.$router;
    const accessToken = store.getters["user/accessToken"];
    if (accessToken) {
      headers["Authorization"] = accessToken;
      if (
        new Date() - new Date(store.getters["user/lastAPICalledAt"]) >
        maxIntervalSec * 1000
      ) {
        store.commit("user/reset");
        router.push("/login?error=401");
        return Promise.reject(new Object());
      }
    }

    return new Promise((resolve, reject) => {
      axios
        .get(`${baseURL}${url}`, {
          query: query,
          headers: headers
        })
        .then(resp => {
          if (
            resp.data &&
            resp.data.ResponseMetadata &&
            resp.data.ResponseMetadata.HTTPHeaders &&
            resp.data.ResponseMetadata.HTTPHeaders.date
          )
            store.commit("user/update", {
              lastAPICalledAt: resp.data.ResponseMetadata.HTTPHeaders.date
            });
          resolve(resp);
        })
        .catch(error => {
          if (error.response) {
            if (error.response && error.response.status == "401") {
              // HTTP 401の場合，RefreshTokenを利用してAccessTokenを取得
              const b = {
                RefreshToken: store.getters["user/refreshToken"],
                ClientId: config.api.ClientId
              };
              axios
                .post(`${baseURL}/auth/refresh`, b, {
                  headers: headers
                })
                .then(resp => {
                  // AccessTokenの更新
                  store.commit("user/update", {
                    accessToken: resp.data.AuthenticationResult.AccessToken,
                    authenticated: true
                  });
                  // 更新したAccessTokenで最初のリクエストをもう一度実行する
                  headers["Authorization"] = store.getters["user/accessToken"];
                  axios
                    .get(`${baseURL}${url}`, {
                      headers: headers
                    })
                    .then(resp => {
                      if (
                        resp.data &&
                        resp.data.ResponseMetadata &&
                        resp.data.ResponseMetadata.HTTPHeaders &&
                        resp.data.ResponseMetadata.HTTPHeaders.date
                      )
                        store.commit("user/update", {
                          lastAPICalledAt: resp.data.ResponseMetadata.HTTPHeaders.date
                        });
                      resolve(resp);
                    })
                    .catch(error => {
                      if (error.response && error.response.status == 401) {
                        store.commit("user/reset");
                        router.push("/login?error=401");
                      }
                      reject(error);
                    });
                })
                .catch(error => {
                  if (error.response && error.response.status == 401) {
                    store.commit("user/reset");
                    router.push("/login?error=401");
                  }
                  reject(error);
                });
            } else {
              reject(error);
            }
          } else {
            reject(error);
          }
        });
    });
  },
  post: (url, body) => {
    const headers = {
      "Content-Type": "application/json;charset=UTF-8"
    };
    const store = window.$nuxt.$store;
    const router = window.$nuxt.$router;
    const accessToken = store.getters["user/accessToken"];
    if (accessToken) {
      headers["Authorization"] = accessToken;
      if (
        new Date() - new Date(store.getters["user/lastAPICalledAt"]) >
        maxIntervalSec * 1000
      ) {
        store.commit("user/reset");
        router.push("/login?error=401");
        return Promise.reject(new Object());
      }
    }

    return new Promise((resolve, reject) => {
      axios
        .post(`${baseURL}${url}`, body, {
          headers: headers
        })
        .then(resp => {
          if (
            resp.data &&
            resp.data.ResponseMetadata &&
            resp.data.ResponseMetadata.HTTPHeaders &&
            resp.data.ResponseMetadata.HTTPHeaders.date
          )
            store.commit("user/update", {
              lastAPICalledAt: resp.data.ResponseMetadata.HTTPHeaders.date
            });
          resolve(resp);
        })
        .catch(error => {
          if (error.response && error.response.status == "401") {
            // HTTP 401の場合，RefreshTokenを利用してAccessTokenを取得
            const b = {
              RefreshToken: store.getters["user/refreshToken"],
              ClientId: config.api.ClientId
            };
            axios
              .post(`${baseURL}/auth/refresh`, b, {
                headers: headers
              })
              .then(resp => {
                // AccessTokenの更新
                store.commit("user/update", {
                  accessToken: resp.data.AuthenticationResult.AccessToken,
                  authenticated: true
                });
                // 更新したAccessTokenで最初のリクエストをもう一度実行する
                headers["Authorization"] = store.getters["user/accessToken"];
                axios
                  .post(`${baseURL}${url}`, body, {
                    headers: headers
                  })
                  .then(resp => {
                    if (
                      resp.data &&
                      resp.data.ResponseMetadata &&
                      resp.data.ResponseMetadata.HTTPHeaders &&
                      resp.data.ResponseMetadata.HTTPHeaders.date
                    )
                      store.commit("user/update", {
                        lastAPICalledAt: resp.data.ResponseMetadata.HTTPHeaders.date
                      });
                    resolve(resp);
                  })
                  .catch(error => {
                    if (error.response && error.response.status == 401) {
                      store.commit("user/reset");
                      router.push("/login?error=401");
                    }
                    reject(error);
                  });
              })
              .catch(error => {
                if (error.response && error.response.status == 401) {
                  store.commit("user/reset");
                  router.push("/login?error=401");
                }
                reject(error);
              });
          } else {
            reject(error);
          }
        });
    });
  },
  put: (url, body) => {
    const headers = {
      "Content-Type": "application/json;charset=UTF-8"
    };
    const store = window.$nuxt.$store;
    const router = window.$nuxt.$router;
    const accessToken = store.getters["user/accessToken"];
    if (accessToken) {
      headers["Authorization"] = accessToken;
      if (
        new Date() - new Date(store.getters["user/lastAPICalledAt"]) >
        maxIntervalSec * 1000
      ) {
        store.commit("user/reset");
        router.push("/login?error=401");
        return Promise.reject(new Object());
      }
    }

    return new Promise((resolve, reject) => {
      axios
        .put(`${baseURL}${url}`, body, {
          headers: headers
        })
        .then(resp => {
          if (
            resp.data &&
            resp.data.ResponseMetadata &&
            resp.data.ResponseMetadata.HTTPHeaders &&
            resp.data.ResponseMetadata.HTTPHeaders.date
          )
            store.commit("user/update", {
              lastAPICalledAt: resp.data.ResponseMetadata.HTTPHeaders.date
            });
          resolve(resp);
        })
        .catch(error => {
          if (error.response && error.response.status == "401") {
            // HTTP 401の場合，RefreshTokenを利用してAccessTokenを取得
            const b = {
              RefreshToken: store.getters["user/refreshToken"],
              ClientId: config.api.ClientId
            };
            axios
              .post(`${baseURL}/auth/refresh`, b, {
                headers: headers
              })
              .then(resp => {
                // AccessTokenの更新
                store.commit("user/update", {
                  accessToken: resp.data.AuthenticationResult.AccessToken,
                  authenticated: true
                });
                // 更新したAccessTokenで最初のリクエストをもう一度実行する
                headers["Authorization"] = store.getters["user/accessToken"];
                axios
                  .put(`${baseURL}${url}`, body, {
                    headers: headers
                  })
                  .then(resp => {
                    if (
                      resp.data &&
                      resp.data.ResponseMetadata &&
                      resp.data.ResponseMetadata.HTTPHeaders &&
                      resp.data.ResponseMetadata.HTTPHeaders.date
                    )
                      store.commit("user/update", {
                        lastAPICalledAt: resp.data.ResponseMetadata.HTTPHeaders.date
                      });
                    resolve(resp);
                  })
                  .catch(error => {
                    if (error.response && error.response.status == 401) {
                      store.commit("user/reset");
                      router.push("/login?error=401");
                    }
                    reject(error);
                  });
              })
              .catch(error => {
                if (error.response && error.response.status == 401) {
                  store.commit("user/reset");
                  router.push("/login?error=401");
                }
                reject(error);
              });
          } else {
            reject(error);
          }
        });
    });
  },
  delete: (url, body) => {
    const headers = {
      "Content-Type": "application/json;charset=UTF-8"
    };
    const store = window.$nuxt.$store;
    const router = window.$nuxt.$router;
    const accessToken = store.getters["user/accessToken"];
    if (accessToken) {
      headers["Authorization"] = accessToken;
      if (
        new Date() - new Date(store.getters["user/lastAPICalledAt"]) >
        maxIntervalSec * 1000
      ) {
        store.commit("user/reset");
        router.push("/login?error=401");
        return Promise.reject(new Object());
      }
    }

    // console.log(`${baseURL}${url}`, body, { headers: headers })

    return new Promise((resolve, reject) => {
      axios
        .delete(`${baseURL}${url}`, {
          data: body,
          headers: headers
        })
        .then(resp => {
          if (
            resp.data &&
            resp.data.ResponseMetadata &&
            resp.data.ResponseMetadata.HTTPHeaders &&
            resp.data.ResponseMetadata.HTTPHeaders.date
          )
            store.commit("user/update", {
              lastAPICalledAt: resp.data.ResponseMetadata.HTTPHeaders.date
            });
          resolve(resp);
        })
        .catch(error => {
          console.log(error);
          if (error.response && error.response.status == "401") {
            // HTTP 401の場合，RefreshTokenを利用してAccessTokenを取得
            const b = {
              RefreshToken: store.getters["user/refreshToken"],
              ClientId: config.api.ClientId
            };
            axios
              .post(`${baseURL}/auth/refresh`, b, {
                headers: headers
              })
              .then(resp => {
                // AccessTokenの更新
                store.commit("user/update", {
                  accessToken: resp.data.AuthenticationResult.AccessToken,
                  authenticated: true
                });
                // 更新したAccessTokenで最初のリクエストをもう一度実行する
                headers["Authorization"] = store.getters["user/accessToken"];
                axios
                  .delete(`${baseURL}${url}`, {
                    data: body,
                    headers: headers
                  })
                  .then(resp => {
                    if (
                      resp.data &&
                      resp.data.ResponseMetadata &&
                      resp.data.ResponseMetadata.HTTPHeaders &&
                      resp.data.ResponseMetadata.HTTPHeaders.date
                    )
                      store.commit("user/update", {
                        lastAPICalledAt: resp.data.ResponseMetadata.HTTPHeaders.date
                      });
                    resolve(resp);
                  })
                  .catch(error => {
                    if (error.response && error.response.status == 401) {
                      store.commit("user/reset");
                      router.push("/login?error=401");
                    }
                    reject(error);
                  });
              })
              .catch(error => {
                if (error.response && error.response.status == 401) {
                  store.commit("user/reset");
                  router.push("/login?error=401");
                }
                reject(error);
              });
          } else {
            reject(error);
          }
        });
    });
  }
};