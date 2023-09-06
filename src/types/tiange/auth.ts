/**
 * auth
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-01-04 09:56:35
 */

/**
 * 获取图片验证码响应
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-01-04 10:20:24
 */
export interface VerifyCodeResponse {
  /** actcode */
  actcode: string;
  /** 图片验证码 */
  img: string;
}

/**
 * 发动短信验证码请求参数
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-01-04 13:23:56
 */
export interface SMSVerifyCodeParams {
  phone: string;
  usercode: string;
}

/**
 * 登录参数
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-01-04 13:15:17
 */
export interface LoginParams {
  /** 用户名/手机号 */
  username: string;
  /** 密码/短信验证码 */
  password: string;
  /** 登录类型: 1---用户名+密码 2---手机号+短信验证码 */
  login_type: number;
}

/**
 * 修改密码参数
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-04-12 14:39:19
 */
export interface UpdatePasswordParams {
  /** 旧密码 */
  password: string;
  /** 新密码 */
  new_password: string;
}
