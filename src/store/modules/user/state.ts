import { UserInfo } from '@/types/tiange/system';

/**
 * 用户信息
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-04-12 11:35:26
 */
export interface UserState {
  /** 用户信息 */
  userinfo: null | UserInfo;
  /** ?? 暂时不确定 */
  menuPages: any[];
}

const state = {
  userinfo: null,
  menuPages: [],
};

export default state;
