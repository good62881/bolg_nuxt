import axios from 'axios';
import qs from 'qs';

let baseUrl = 'http://127.0.0.1:3000';

class HTTP {
  constructor() {
    this.xhr = axios.create({
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      withCredentials: true,
    });

    this.xhr.interceptors.request.use((opts) => {
      opts.url = baseUrl + opts.url;
      return opts;
    }, function (error) {
      return Promise.reject(error);
    });

    this.xhr.interceptors.response.use((response) => {
      return response
    }, (error) => {
      return Promise.resolve(error)
    });
  }
  request(opts) {
    return this.xhr.request(opts)
      .then(this.checkStatus)
      .then(this.checCode);
  }
  get(url, opts) {
    opts = opts || {};
    opts.method = 'get';
    opts.url = url;

    return this.request(opts);
  }
  post(url, data, opts) {
    opts = opts || {};
    opts.method = 'post';
    opts.url = url;
    opts.data = qs.stringify(data,{allowDots: true});

    return this.request(opts);
  }
  checkStatus(response) {
    if (response.status === 200 || response.status === 304) {
      return response
    }
    return {
      data: {
        code: 404,
        msg: response.statusText || '404 NOT FOUND',
        data: response.statusText || '',
      }
    }
  }
  checCode(response) {
    const data = response.data;
    if (data.code == -1) {
      if (process.client) {
        $nuxt.$router.push("/admin/login")
      }
    }
    return response
  }
}

export default new HTTP();
