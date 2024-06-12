import Axios from "axios";
import { AUTH_TOKEN } from "constants/AuthConstant";

const SERVER_API_URL =
  process.env.NEXT_PUBLIC_APP_SERVER_API || "http://localhost:4000/";

export function axiosGet(url, params = {}) {
  return new Promise(async (resolve, reject) => {
    const token = localStorage.getItem("auth_token");
    const headers = { authorization: "Bearer " + token };
    var config = {
      headers,
    };
    await Axios.get(SERVER_API_URL + url, config)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
}
export function axiosPost(url, body = {}) {
  return new Promise(async (resolve, reject) => {
    const token = localStorage.getItem("auth_token");
    const headers = { authorization: "Bearer " + token };
    var config = {
      headers,
    };
    await Axios.post(SERVER_API_URL + url, body, config)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
}
export function axiosPut(url, body = {}) {
  return new Promise(async (resolve, reject) => {
    const token = localStorage.getItem("auth_token");
    const headers = { authorization: "Bearer " + token };
    var config = {
      headers,
    };
    await Axios.put(SERVER_API_URL + url, body, config)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
}
export function axiosPatch(url, body = {}) {
  return new Promise(async (resolve, reject) => {
    const token = localStorage.getItem("auth_token");
    const headers = { authorization: "Bearer " + token };
    var config = {
      headers,
    };
    await Axios.patch(SERVER_API_URL + url, body, config)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
}
export function axiosDelete(url) {
  return new Promise(async (resolve, reject) => {
    const token = localStorage.getItem("auth_token");
    const headers = { authorization: "Bearer " + token };
    var config = {
      headers,
    };
    await Axios.delete(SERVER_API_URL + url, config)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
}
