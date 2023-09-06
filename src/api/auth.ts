// @ts-nocheck
import request from '@/utils/request';

/** @deprecated */
export function login(username: string, password: string, loginType: number) {
  const userpass = { username, password };
  if (loginType) userpass['login_type'] = loginType;
  return request({
    url: '/api/auth/login',
    method: 'post',
    data: userpass,
  });
}

export function register(userpass) {
  return request({
    url: '/api/auth/register',
    method: 'post',
    data: userpass,
  });
}

/** @deprecated */
export function getCode() {
  return request({
    url: '/api/auth/get_code',
    method: 'get',
  });
}

// export function getLoginPhoneCode (userpass) {
//   return request({
//     url: '/api/auth/send_login_sms',
//     method: 'post',
//     data: userpass
//   })
// }

/** @deprecated */
export function getPhoneCode(userpass) {
  return request({
    url: '/api/auth/send_sms',
    method: 'post',
    data: userpass,
  });
}

// export function getChangePwdPhoneCode (userpass) {
//   return request({
//     url: '/api/auth/send_edit_password_sms',
//     method: 'post',
//     data: userpass
//   })
// }

export function validCode(userpass) {
  return request({
    url: '/api/auth/valid_code',
    method: 'post',
    data: userpass,
  });
}

export function changePwd(userpass) {
  return request({
    url: '/api/auth/edit_password',
    method: 'post',
    data: userpass,
  });
}

// 获取部门和角色
export function getAllRoles() {
  return request({
    url: '/api/auth/get_all_roles',
    method: 'get',
  });
}

// 获取角色
export function queryRole(rolepass) {
  return request({
    url: '/api/auth/query_role',
    method: 'get',
    params: rolepass,
  });
}

/**
 * 获取所有权限
 * @deprecated
 */
export function getAllRights() {
  return request({
    url: '/api/auth/get_all_rights',
    method: 'get',
  });
}

// 更新角色
export function UpdateRole(rolepass) {
  return request({
    url: '/api/auth/update_role',
    method: 'post',
    data: rolepass,
  });
}
