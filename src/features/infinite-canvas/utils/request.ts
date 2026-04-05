import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { message } from 'antd';

const request: AxiosInstance = axios.create({
  baseURL: '/v1',
  timeout: 300000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const apiKey = localStorage.getItem('apiKey');
    const apiBaseUrl = localStorage.getItem('apiBaseUrl');

    if (apiKey && config.headers) {
      config.headers['Authorization'] = `Bearer ${apiKey}`;
    }

    if (apiBaseUrl) {
      config.baseURL = apiBaseUrl;
    }

    return config;
  },
  (error: AxiosError) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// 错误消息映射表 - 将服务端英文错误转换为中文
const errorMessageMap: Record<string, string> = {
  'For i2i model, the last message must contain exactly one text content item': '图生图模式需要输入提示词描述',
  'Got 0 text items': '请输入提示词描述',
  'rate limit exceeded': '请求过于频繁，请稍后重试',
  'invalid api key': 'API Key 无效，请检查配置',
  'insufficient quota': '配额不足，请检查账户余额',
};

// 翻译错误消息
const translateErrorMessage = (message: string): string => {
  // 完全匹配
  if (errorMessageMap[message]) {
    return errorMessageMap[message];
  }
  // 部分匹配
  for (const [key, value] of Object.entries(errorMessageMap)) {
    if (message.toLowerCase().includes(key.toLowerCase())) {
      return value;
    }
  }
  return message;
};

// Response interceptor
request.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  (error: AxiosError<any>) => {
    const rawMessage = error.response?.data?.error?.message || error.message || '请求失败';
    const errorMessage = translateErrorMessage(rawMessage);
    message.error(errorMessage);
    return Promise.reject(new Error(errorMessage));
  }
);

export default request;
