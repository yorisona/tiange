/**
 * 请求封装
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-10-21 19:36:32
 */
import { getToken, getCode, removeToken } from '@/utils/token';
import { Message } from 'element-ui';
import axios, { AxiosRequestConfig } from 'axios';
import { ObjectMap } from './func';
import router from '@/router';

const instance = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? '' : process.env.VUE_APP_BASE_API,
  timeout: 60000,
  validateStatus: status => status < 500,
});

// 请求拦截
instance.interceptors.request.use(
  config => {
    config.headers = {
      ...config.headers,
      Authorization: getToken(),
      Actcode: getCode(),
    };

    return config;
  },
  error => Promise.reject(error),
);

instance.interceptors.response.use(
  response => {
    // 4种需要重新登录的场景
    if ([100, 101, 104, 105].includes(response.data.error_code)) {
      if (window.location.pathname !== '/login') {
        Message.error({
          message: '会话超时，请重新登录',
          duration: 1500,
          onClose: () => {
            removeToken();

            router.push({
              name: 'Login',
              query: { redirect: window.location.pathname + window.location.search },
            });
          },
        });
        throw new Error('会话超时，请重新登录');
      }
    }

    return response;
  },
  error => {
    let msg = '';
    if (error.message.includes('timeout')) {
      msg = '请求超时了,请重新尝试';
    } else {
      msg = error.message ?? '服务器出错了';
    }

    Message.error(msg);
    return Promise.reject(error);
  },
);

const isSimpleArray = (obj: any) => {
  if (!Array.isArray(obj)) {
    return false;
  }
  if (obj.length === 0) {
    return false;
  }

  return obj.every(el => typeof el === 'string' || typeof el === 'number');
};

// 参数序列化
export const serialization = (params?: Record<string, any>): Record<string, any> | undefined => {
  return params === undefined
    ? params
    : ObjectMap(params, ([key, val]: [string, any]) => {
        if (Array.isArray(val) && val.length > 0 && isSimpleArray(val)) {
          return [key, val.join(',')];
        } else if (typeof val === 'object') {
          return [key, JSON.stringify(val)];
        } else {
          return [key, val];
        }
      });
};

/**
 * Get 请求
 * @author Jerry <superzcj_001@163.com>
 * @since  2020-06-10 15:32:24
 */
export const Get = <T = any>(url: string, options?: AxiosRequestConfig) =>
  instance.get<T>(url, options);

/**
 * Post 请求
 * @author Jerry <superzcj_001@163.com>
 * @since  2020-06-10 15:33:20
 */
export const Post = <T = any>(
  url: string,
  data?: Record<string, any>,
  options?: AxiosRequestConfig,
) => instance.post<T>(url, data, options);

/**
 * Patch 请求
 * @author Jerry <superzcj_001@163.com>
 * @since  2020-06-10 15:33:22
 */
export const Patch = <T = any>(
  url: string,
  data?: Record<string, any>,
  options?: AxiosRequestConfig,
) => instance.patch<T>(url, data, options);

/**
 * Put 请求
 * @author 棠棣
 * @since  2020-06-17 16:13:45
 */
export const Put = <T = any>(
  url: string,
  data?: Record<string, any>,
  options?: AxiosRequestConfig,
) => instance.put<T>(url, data, options);

/**
 * Delete 请求
 * @author Jerry <superzcj_001@163.com>
 * @since  2020-06-10 15:33:23
 */
export const Delete = <T = any>(url: string, options?: AxiosRequestConfig) =>
  instance.delete<T>(url, options);

export const catchError = (res: any) => {
  if (res.data.success !== true) {
    Message.error(res.data.message || '无错误信息');
    throw new Error(res.data.message);
  }
  return res.data.data;
};

export default instance;
