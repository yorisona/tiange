/**
 * global 全局设置
 */
import type { ActionContext } from 'vuex';

/** 滚动条设置的可选页面名称 */
export type ScrollbarSettingPagename =
  | 'marketing_project'
  | 'live_project'
  | 'common_bussiness_project'
  | 'sales_follow'
  | 'customer_shop'
  | 'customer_company'
  | 'legal_contract'
  | 'supplier_company'
  | 'finance_invoice'
  | 'finance_settlementc_cost';

/**
 * 滚动设置
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-05-17 16:01:40
 */
export interface ScrollbarSetting {
  /** 模块名(中文) */
  name: string;
  /** 模块名(英文) */
  key: ScrollbarSettingPagename;
  /** 是否启用表格内滚动 true---表格内滚动 false---工作区滚动 */
  value: boolean;
}

/**
 * 二次确认对话框设置
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-05-25 23:12:45
 */ export interface ConfirmDialogSetting {
  /** 确认/取消快捷键 */
  enableConfirmDialogHotkey: boolean;
  /** 快捷键显示在按钮上 */
  enableConfirmDialogHotkeyShowInButton: boolean;
}

/**
 * 全局设置
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-05-17 16:01:59
 */
export interface GlobalState extends ConfirmDialogSetting {
  /** 滚动设置列表 */
  scrollbarSetting: ScrollbarSetting[];
}

type Action = ActionContext<GlobalState, Record<string, Record<string, any>>>;

const Types = {
  SET_SCROLLBAR_SETTING: 'SET_SCROLLBAR_SETTING',
  SET_CONFIRM_DIALOG_SETTING: 'SET_CONFIRM_DIALOG_SETTING',
};

/**
 * 全局设置
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-05-17 16:01:59
 */
const state: GlobalState = {
  scrollbarSetting: [],
  enableConfirmDialogHotkey: false,
  enableConfirmDialogHotkeyShowInButton: false,
};

const getters = {
  /** 滚动条设置 */
  scrollbarSetting: (state: GlobalState) => state.scrollbarSetting,
  /** 二次确认对话框设置 */
  confirmDialogSetting: (state: GlobalState) => ({
    enableConfirmDialogHotkey: state.enableConfirmDialogHotkey,
    enableConfirmDialogHotkeyShowInButton: state.enableConfirmDialogHotkeyShowInButton,
  }),
};

const actions = {
  /** 保存滚动条设置 */
  setScrollbarSetting: (action: Action, payload: ScrollbarSetting[]) => {
    action.commit(Types.SET_SCROLLBAR_SETTING, payload);
  },
  /** 保存二次确认对话框设置 */
  setConfirmDialogSetting: (action: Action, payload: ConfirmDialogSetting) => {
    action.commit(Types.SET_CONFIRM_DIALOG_SETTING, payload);
  },
};

const mutations = {
  [Types.SET_SCROLLBAR_SETTING]: (state: GlobalState, payload: ScrollbarSetting[]) => {
    state.scrollbarSetting = payload;
  },
  [Types.SET_CONFIRM_DIALOG_SETTING]: (state: GlobalState, payload: ConfirmDialogSetting) => {
    state.enableConfirmDialogHotkey = payload.enableConfirmDialogHotkey;
    state.enableConfirmDialogHotkeyShowInButton = payload.enableConfirmDialogHotkeyShowInButton;
  },
};

const global = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};

export default global;
