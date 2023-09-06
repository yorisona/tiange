/**
 * 一些全局的逻辑
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-10 13:23:00
 */
import {
  computed,
  onBeforeMount,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from '@vue/composition-api';
import type { SetupContext } from '@vue/composition-api';
import Store from '@/store';
import { GetUserInfo } from '@/services/auth';
import type { UserInfo } from '@/types/tiange/system';
import type { ConfirmDialogSetting, ScrollbarSetting } from '@/store/modules/global';

const isDev = process.env.NODE_ENV === 'development';

/** 网络检测和通知 */
export const useNetwork = (ctx: SetupContext) => {
  /**
   * 断网回调
   * @author  Jerry <superzcj_001@163.com>
   * @since   2020-09-10 09:58:11
   */
  const offlineCallback = () => {
    ctx.root.$notify.warning({
      title: '当前网络不可用',
      message: '',
      duration: 0,
    });
  };
  /**
   * 联网回调
   * @author  Jerry <superzcj_001@163.com>
   * @since   2020-09-10 09:58:19
   */
  const onlineCallback = async () => {
    ctx.root.$notify.closeAll();

    ctx.root.$notify.info({
      title: '网络已经恢复',
      message: '',
      duration: 5000,
    });
  };

  // * 移除断网联网事件监听
  onBeforeUnmount(() => {
    window.removeEventListener('offline', offlineCallback);
    window.removeEventListener('online', onlineCallback);
  });

  // * 初始化断网联网事件监听
  onBeforeMount(() => {
    window.addEventListener('offline', offlineCallback);
    window.addEventListener('online', onlineCallback);
  });
};

// 更新检查间隔时间
const versionCheckTime = parseInt(process.env.VUE_APP_VERSION_CHECK_TIME, 10);

/** 版本更新检测和通知 */
export const useVersion = (ctx: SetupContext) => {
  if (versionCheckTime === 0) {
    // 检查间隔为 0 不检查
    // 终止，退出
    return;
  }

  const appVersionHash = ref(process.env.VUE_APP_VERSION_HASH ?? '');
  /**
   * 检查版本
   * @author  Jerry <superzcj_001@163.com>
   * @since   2020-09-08 14:13:32
   */
  const versionCheck = async () => {
    const hash: string = await fetch(`/version.txt?t=${Date.now()}`)
      .then(res => res.text())
      .then(hash => (hash.length > 32 ? '' : hash));

    if (hash === appVersionHash.value) {
      // * 版本一致
      // * do nth
    } else {
      // * 写入本地存储备份
      localStorage.setItem('version_hash', hash);
      // * 写入组件内
      appVersionHash.value = hash;
      await new Promise(resolve => {
        ctx.root.$notify.info({
          title: '更新通知',
          message: `检查到${process.env.VUE_APP_NAME}有新版本，请刷新页面`,
          duration: 0,
          onClose: () => {
            resolve(true);
          },
        });
      });
    }

    window.setTimeout(() => {
      versionCheck();
    }, versionCheckTime);
  };

  // 非开发环境开启定期查询版本更新
  // 开发环境不检查
  if (process.env.NODE_ENV !== 'development') {
    versionCheck();
  }

  return { appVersionHash };
};

// 用户信息轮询间隔
const userInfoUpdateTime =
  process.env.VUE_APP_USER_INFO_UPDATE_TIME === ''
    ? 10000
    : parseInt(process.env.VUE_APP_USER_INFO_UPDATE_TIME, 10);

/**
 * 用户信息轮询更新
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-04-12 11:47:26
 */
export const useRefreshUserInfo = () => {
  const updateUserInfo = async () => {
    const { data: response } = await GetUserInfo();

    if (response.success) {
      const userInfo = response.data;
      Store.dispatch('user/setUserInfo', userInfo);
    }

    setTimeout(() => {
      updateUserInfo();
    }, userInfoUpdateTime);
  };

  onBeforeMount(() => {
    updateUserInfo();
  });
};

/**
 * 给一个开发者提示
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-11-18 00:09:11
 */
export const useDevNotice = (ctx: SetupContext) => {
  const { VUE_APP_DEV_README_URL, NODE_ENV } = process.env;
  if (NODE_ENV === 'development' && VUE_APP_DEV_README_URL !== undefined) {
    const read = localStorage.getItem('TG_README_READ') ?? undefined;
    if (read && parseInt(read, 10) >= parseInt(process.env.VUE_APP_DEV_README_VER, 10)) {
      return;
    }

    const onClickBtn = () => {
      window.open(VUE_APP_DEV_README_URL);
      localStorage.setItem('TG_README_READ', process.env.VUE_APP_DEV_README_VER);
    };

    ctx.root.$TDialog({
      title: process.env.VUE_APP_DEV_README_TITLE ?? '请先阅读最新的README了解项目基本情况😊',
      onConfirm: onClickBtn,
      onCancel: onClickBtn,
      showCancelBtn: false,
    });
  }
};

/**
 * 用来添加移除权限码(开发环境测试用)
 */
export const useTestRightCode = () => {
  if (process.env.NODE_ENV === 'development') {
    (window as any).setCode = (code: number) => {
      const right_code: number[] = Store.state.user.userinfo.user_rights;
      const index = right_code.indexOf(code);
      if (index !== -1) {
        right_code.splice(index, 1);
      } else {
        right_code.push(code);
      }
      Store.state.user.userinfo.user_rights = right_code;
      localStorage.setItem('vuex', JSON.stringify(Store.state));
    };

    (window as any).setCode.toString = () => 'setCode() { [Not native code] }';
  }
};

export const useGlobalConfig = () => {
  /** 全局配置对话框是否可见 */
  const globalConfigDialogVisible = ref(false);

  /** 设定是否可见 */
  const setGlobalConfigDialog = (visible = false) => {
    globalConfigDialogVisible.value = visible;
  };
  /** 用户信息 */
  const userinfo = computed<UserInfo>(() => Store.getters['user/getUserInfo']);

  /** 滚动条设置key */
  const localStorageScrollSettingKey = computed(() => `scrollbar_setting_uid_${userinfo.value.id}`);

  /** 二次确认对话框设置key */
  const localStorageConfirmDialogSettingKey = computed(
    () => `confirm_dialog_setting_uid_${userinfo.value.id}`,
  );

  /** 切换是否可见 */
  const toggleGlobalConfigDialog = () => {
    setGlobalConfigDialog(!globalConfigDialogVisible.value);
  };

  /** 关闭 */
  const closeGlobalConfigDialog = () => {
    setGlobalConfigDialog(false);
  };

  /** 全局按钮事件监听回调 */
  const onWindowKeyup = (event: KeyboardEvent) => {
    if (['input', 'textarea'].includes((event.target as any).tagName.toLowerCase())) {
      return;
    }

    if (event.code === 'KeyB' && event.ctrlKey === true) {
      // C 键做全局系统配置
      // 仅限开发环境，防止正式环境输入时也触发
      if (isDev) toggleGlobalConfigDialog();
    } else if (event.code === 'F2') {
      toggleGlobalConfigDialog();
    }
  };

  /** 滚动条设置 */
  const scrollbarSettingList = ref<ScrollbarSetting[]>([
    { name: '营销业务 - 项目管理', key: 'marketing_project', value: false },
    { name: '店铺代播 - 项目管理', key: 'live_project', value: false },
    { name: '通用业务 - 项目管理', key: 'common_bussiness_project', value: false },
    { name: '客户列表 - 店铺管理', key: 'customer_shop', value: false },
    { name: '客户列表 - 公司管理', key: 'customer_company', value: false },
    { name: '法务管理 - 合同管理', key: 'legal_contract', value: false },
    { name: '销售管理 - 客户跟进', key: 'sales_follow', value: false },
    { name: '财务 - 成本结算', key: 'finance_settlementc_cost', value: false },
  ]);

  /** 二次确认对话框是否启用确认/取消按钮快捷键 */
  const enableConfirmDialogHotkey = ref(false);
  /** 二次确认对话框快捷键是否显示到按钮上 */
  const enableConfirmDialogHotkeyShowInButton = ref(false);

  /** 从localStorage初始化设置 */
  const initSetting = () => {
    const config = JSON.parse(localStorage.getItem(localStorageScrollSettingKey.value) ?? '{}');
    const confirmDialogSetting: ConfirmDialogSetting = JSON.parse(
      localStorage.getItem(localStorageConfirmDialogSettingKey.value) ?? '{}',
    );

    scrollbarSettingList.value.forEach((el, index) => {
      scrollbarSettingList.value[index].value = config[el.key] ?? true;
    });

    enableConfirmDialogHotkey.value = confirmDialogSetting.enableConfirmDialogHotkey;
    enableConfirmDialogHotkeyShowInButton.value =
      confirmDialogSetting.enableConfirmDialogHotkeyShowInButton;

    Store.dispatch('global/setScrollbarSetting', scrollbarSettingList.value);
    Store.dispatch('global/setConfirmDialogSetting', confirmDialogSetting);
  };

  onMounted(() => {
    window.document.addEventListener('keyup', onWindowKeyup);
    initSetting();
  });

  watch(
    () => globalConfigDialogVisible.value,
    next => {
      if (next) {
        initSetting();
      }
    },
  );

  onBeforeUnmount(() => {
    window.document.removeEventListener('keyup', onWindowKeyup);
  });

  /** 滚动条设置变动回调 */
  const onSwitchChange = () => {
    const config = Object.fromEntries(scrollbarSettingList.value.map(el => [el.key, el.value]));

    localStorage.setItem(localStorageScrollSettingKey.value, JSON.stringify(config));

    Store.dispatch('global/setScrollbarSetting', scrollbarSettingList.value);
  };

  /** 二次确认对话框设置变动回调 */
  const onConfirmDialogHotkeySwitchChange = () => {
    const setting = {
      enableConfirmDialogHotkey: enableConfirmDialogHotkey.value,
      enableConfirmDialogHotkeyShowInButton: enableConfirmDialogHotkeyShowInButton.value,
    };
    localStorage.setItem(localStorageConfirmDialogSettingKey.value, JSON.stringify(setting));
    Store.dispatch('global/setConfirmDialogSetting', setting);
  };

  return {
    globalConfigDialogVisible,
    closeGlobalConfigDialog,
    scrollbarSettingList,
    onSwitchChange,
    enableConfirmDialogHotkey,
    enableConfirmDialogHotkeyShowInButton,
    onConfirmDialogHotkeySwitchChange,
  };
};
