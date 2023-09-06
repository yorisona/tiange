/*
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2021-11-29 09:36:49
 */
/**
 * 网络相关函数
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-04-09 13:40:11
 */
import { getToken } from '@/utils/token';

/**
 * 给URL添加 token
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-04-09 13:41:06
 */
export const fixFileToken = (url: string, only_path = true) => {
  const token = getToken();
  try {
    if (only_path) {
      return `${new URL(url).pathname}?Authorization=${token}`;
    } else {
      return `${new URL(url).toString()}?Authorization=${token}`;
    }
  } catch {
    return `${url}?Authorization=${token}`;
  }
};

/**
 * 从网络读取图片的base64
 * @author Jerry <superzcj_001@163.com>
 * @since  2020-07-23 17:33:27
 */
export const getNetImageBase64 = async (url: string) => {
  const response = await fetch(url);
  const blob = await response.blob();

  const data: string = await new Promise(resolve => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as string);
    };

    reader.readAsDataURL(blob);
  });

  return data;
};
