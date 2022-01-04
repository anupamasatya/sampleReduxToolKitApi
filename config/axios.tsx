/* eslint-disable no-shadow */
import axios, {AxiosRequestConfig, AxiosResponse} from 'axios';

//===============Stagging=============

const BASE_URL = 'https://fakestoreapi.com';

axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.post.Accept = 'application/json';
const config: AxiosRequestConfig = {
  baseURL: BASE_URL,
  timeout: 1000,
};

const instance = axios.create(config);

// Interceptors

const requestInterceptorId: number = instance.interceptors.request.use(
  (config: AxiosRequestConfig) => config,
  (error: any) => Promise.reject(error),
);

instance.interceptors.request.use(
  async (config: AxiosRequestConfig) => {
    return Promise.resolve(config);
  },
  (error: any) => Promise.reject(error),
);

instance.interceptors.request.eject(requestInterceptorId);

instance.interceptors.request.use(
  (config: AxiosRequestConfig) => Promise.resolve(config),
  (error: any) => Promise.reject(error),
);

instance.interceptors.response.use(
  response => response,
  async (error: any) => {
    return Promise.reject(error);
  },
);

instance.interceptors.request.use((config: AxiosRequestConfig) => config);
instance.interceptors.request.use((config: AxiosRequestConfig) =>
  Promise.resolve(config),
);

const responseInterceptorId: number = axios.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: any) => Promise.reject(error),
);

axios.interceptors.response.eject(responseInterceptorId);

axios.interceptors.response.use(
  (response: AxiosResponse) => Promise.resolve(response),
  (error: any) => Promise.reject(error),
);

axios.interceptors.response.use((response: AxiosResponse) => response);
axios.interceptors.response.use((response: AxiosResponse) =>
  Promise.resolve(response),
);

export interface AxiosProps {
  type: any;
  url: any;
  params?: any;
  headers?: any;
}

/** function that returns an axios call */
export const requestApi = ({
  type,
  url,
  params,
  headers,
}: AxiosProps): Promise<AxiosResponse> => {
  console.log('url', url);
  return instance.request({
    method: type,
    url: url,
    data: params,
    headers: headers,
  });
};

export default instance;
