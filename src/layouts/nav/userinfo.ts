/**
 * 导航条 - 用户信息部分
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-04-28 19:50:36
 */
import { computed, defineComponent, onBeforeUnmount, onMounted, ref } from '@vue/composition-api';
import Store from '@/store';
import type { UserInfo } from '@/types/tiange/system';
import { removeToken } from '@/utils/token';

export default defineComponent({
  setup(props, ctx) {
    /** 用户信息 */
    const userinfo = computed<UserInfo | null>(() => Store.getters['user/getUserInfo']);
    /** 用户名称(花名) */
    const nickname = computed(() => userinfo.value?.username);
    /** 角色 */
    const role = computed(() => `${userinfo.value?.department_name}-${userinfo.value?.job_name}`);

    /** 是否已登录 */
    const isLogin = computed(() => userinfo.value);

    /** 下拉菜单是否可见 */
    const dropdownMenuVisible = ref(false);

    const dropdownMenuLeaving = ref(false);

    /** 设置下拉菜单是否可见 */
    const setDropdownMenuVisible = (visible = false) => {
      if (visible === false) {
        dropdownMenuLeaving.value = true;
      }
      dropdownMenuVisible.value = visible;
    };

    const onDropdownMenuLeaveEnd = () => {
      dropdownMenuLeaving.value = false;
    };

    /** 切换下拉菜单是否可见 */
    const toggleDropdownMenuVisible = () => {
      setDropdownMenuVisible(!dropdownMenuVisible.value);
    };

    /** 打开重置密码弹窗 */
    const openResetPasswordDialog = () => {
      ctx.emit('reset:start');
      setDropdownMenuVisible();
    };

    /** 全局点击事件监听 */
    const bodyClickEventListener = () => {
      if (dropdownMenuVisible.value) {
        setDropdownMenuVisible();
      }
    };

    onMounted(() => {
      document.body.addEventListener('click', bodyClickEventListener);
    });

    onBeforeUnmount(() => {
      document.body.removeEventListener('click', bodyClickEventListener);
    });

    /** 登出 */
    const logout = () => {
      setDropdownMenuVisible();
      removeToken();
      Store.commit('user/logout');
      ctx.root.$router.push({
        name: 'Login',
        // query: { redirect: window.location.pathname + window.location.search },
      });
    };

    return {
      isLogin,
      nickname,
      role,
      dropdownMenuVisible,
      toggleDropdownMenuVisible,
      openResetPasswordDialog,
      dropdownMenuLeaving,
      onDropdownMenuLeaveEnd,
      logout,
    };
  },
});
