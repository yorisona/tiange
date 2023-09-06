import {
  computed,
  defineComponent,
  onBeforeMount,
  provide,
  reactive,
  ref,
  toRefs,
  watch,
} from '@vue/composition-api';
import type { SetupContext } from '@vue/composition-api';
import { RouteConfig, RouteMeta } from 'vue-router';
import Store from '@/store';
import Sider from '@/layouts/sider/index.vue';
import { useNetwork, useVersion, useDevNotice, useRefreshUserInfo } from '@/use/app.global';
import { ValidateCallback } from '@/types/vendor/form';
import { ElForm } from 'element-ui/types/form';
import { UpdatePassword } from '@/services/auth';
import NavUserInfo from '@/layouts/nav/userinfo.vue';
import GlobalConfig from './config.vue';
import { isExternal } from '@/router/routeGuard/index';
import { RouterNameProjectManage } from '@/const/router';

const useResetPw = (ctx: SetupContext) => {
  const resetPwFrmRef = ref<null | ElForm>(null);
  const resetPasswordDialogVisible = ref(false);

  watch(
    () => resetPasswordDialogVisible.value,
    next => {
      if (next) {
        resetPwFrmRef.value?.clearValidate();
      }
    },
  );

  const toggleResetPasswordDialog = (visible = true) => {
    resetPasswordDialogVisible.value = visible;
  };

  const resetPwFrm = ref({
    password: '',
    new_password: '',
    password_confirm: '',
  });

  const resetPwFrmRules = {
    password: [
      {
        required: true,
        message: '请输入旧密码',
        trigger: 'blur',
      },
    ],
    new_password: [
      {
        required: true,
        message: '请输入新密码',
        trigger: 'blur',
      },
      {
        validator: (_: any, value: string, callback: ValidateCallback) => {
          if (resetPwFrm.value.password === value) {
            callback(new Error('新密码不能与旧密码一致'));
          }
          callback();
        },
        trigger: 'blur',
      },
    ],
    password_confirm: [
      {
        required: true,
        message: '请确认新密码',
        trigger: 'blur',
      },
      {
        validator: (_: any, value: string, callback: ValidateCallback) => {
          if (resetPwFrm.value.new_password !== value) {
            callback(new Error('两次输入的新密码不一致'));
          }
          callback();
        },
        trigger: 'blur',
      },
    ],
  };

  const resetFrmData = () => {
    resetPwFrm.value.password = '';
    resetPwFrm.value.new_password = '';
    resetPwFrm.value.password_confirm = '';
  };

  const closeResetPasswordDialog = () => {
    toggleResetPasswordDialog(false);
    resetFrmData();
  };

  const resetPassword = async () => {
    const result = await new Promise(resolve => {
      resetPwFrmRef.value?.validate(valid => {
        resolve(valid);
      });
    });

    if (result) {
      const { password, new_password } = resetPwFrm.value;

      const { data: response } = await UpdatePassword({ password, new_password });
      if (response.success) {
        ctx.root.$message.success('修改密码成功');
        closeResetPasswordDialog();
      } else {
        ctx.root.$message.error(response.message ?? '修改密码失败');
      }
    }
  };
  return {
    toggleResetPasswordDialog,
    resetPasswordDialogVisible,
    closeResetPasswordDialog,
    resetPwFrm,
    resetPwFrmRules,
    resetPassword,
    resetPwFrmRef,
  };
};

export default defineComponent({
  components: {
    Sider,
    UserInfo: NavUserInfo,
    GlobalConfig,
  },
  setup(props, ctx) {
    const menuIsMini = ref((localStorage.getItem('menu_mini') ?? '0') === '1');
    const state = reactive<{
      openeds: string[];
      sysUserName: string;
      submenuClass: string;
      menuPages: RouteConfig[];
    }>({
      openeds: ['/customer', '/operation-center', '/medium', '/supplier', '/marketing'],
      sysUserName: '未登录',
      submenuClass: '',
      menuPages: [],
    });

    const RedDots = computed(() => Store.getters['cooperative/RedDots']);
    const userRoles = computed(() => Store.getters['user/getUserRole']);
    const userinfo = computed(() => Store.getters['user/getUserInfo']);

    const initUsername = () => {
      if (userinfo.value) {
        state.sysUserName = `${userinfo.value.username}（${userinfo.value.department_name}-${userinfo.value.job_name}）`;
      }
    };

    // 收缩侧边栏
    const handleCollapse = () => {
      menuIsMini.value = !menuIsMini.value;

      localStorage.setItem('menu_mini', menuIsMini.value ? '1' : '0');
    };

    onBeforeMount(() => {
      initUsername();
    });

    provide('menuIsMini', menuIsMini);

    useNetwork(ctx);

    useDevNotice(ctx);

    useRefreshUserInfo();

    const backIconShow = computed(() => {
      /*if (window.history.length <= 1) {
        return 3;
      }*/
      const metaObj: RouteMeta = ctx.root.$route.meta as RouteMeta;
      /*const activePath: string = ctx.root.$route.path || metaObj.activePath || '/';
      const pathArr = activePath.split('/');
      return pathArr.length;*/
      if (metaObj.isNoShowBack === true) {
        return false;
      }
      return metaObj.hidden;
    });
    const backClick = () => {
      if (backIconShow.value === true) {
        const metaObj: RouteMeta = ctx.root.$route.meta as RouteMeta;
        const activePath: string = ctx.root.$route.path || metaObj.activePath || '/';
        /** 合同详情-跳转*/
        if (activePath.indexOf('/contract') > 0) {
          const isContractDetail =
            activePath.indexOf('/contract/customer') > 0 ||
            activePath.indexOf('/contract/supplier') > 0 ||
            activePath.indexOf('/contract/anchor') > 0;
          const projectArr = activePath.split(
            isContractDetail
              ? '/contract'
              : activePath.indexOf('/localLife') > 0 || activePath.indexOf('/tiktokLive') > 0
              ? '/contract'
              : '/project/',
          );
          ctx.root.$router.push({
            path:
              projectArr[0] +
                (isContractDetail
                  ? '/contract'
                  : activePath.indexOf('/localLife') > 0 || activePath.indexOf('/tiktokLive') > 0
                  ? ''
                  : '/project') || '/',
            params: {
              id: isContractDetail ? ctx.root.$route.params.project_id : ctx.root.$route.params.id,
              liveType:
                activePath.indexOf('/supplyChain') > 0
                  ? 'SupplyChainDetail'
                  : activePath.indexOf('/localLife') > 0
                  ? 'localLife'
                  : '',
            },
          });
          return;
        }

        /** ctr分析 ，直播场次详情 */
        const split_str =
          activePath.indexOf('ctr/project/') > 0
            ? '/project'
            : activePath.indexOf('/display') > 0
            ? activePath.indexOf('/live/SupplyChainDetail/') > 0
              ? '/display'
              : activePath.indexOf('/live/list/display') > 0
              ? '/list/display'
              : ''
            : '';

        if (split_str !== '') {
          const projectArr = activePath.split(split_str);
          ctx.root.$router.push({
            path: projectArr[0] || '/',
          });
          return;
        }
        if (
          (activePath.indexOf('localLife/project/') >= 0 &&
            ctx.root.$route.name !== RouterNameProjectManage.localLife.detail.info) ||
          (activePath.indexOf('tiktokLive/project/') >= 0 &&
            ctx.root.$route.name !== RouterNameProjectManage.tiktokLive.project.detail.info)
        ) {
          const pathArr: any = activePath.split('/');
          pathArr.pop();
          ctx.root.$router.push({
            path: (pathArr || []).join('/'),
          });
          return;
        }
        /** 项目详情跳转列表*/
        if (
          activePath.indexOf('live/project/') > 0 ||
          activePath.indexOf('marketing/project/') > 0 ||
          activePath.indexOf('commonbusiness/project/') > 0 ||
          (activePath.indexOf('localLife/project/') >= 0 &&
            ctx.root.$route.name === RouterNameProjectManage.localLife.detail.info) ||
          activePath.indexOf('supplyChain/project') > 0 ||
          activePath.indexOf('/SupplyChainDetail') > 0
        ) {
          const projectArr = activePath.split('/project/');
          ctx.root.$router.push({
            path: projectArr[0] + '/project' || '/',
          });
          return;
        }
        if (
          activePath.indexOf('tiktokLive/project/') >= 0 &&
          ctx.root.$route.name === RouterNameProjectManage.tiktokLive.project.detail.info
        ) {
          ctx.root.$router.push({
            name: RouterNameProjectManage.live.project.list,
          });
          return;
        }

        const pathArr = activePath.split('/');
        /* 添加判断是不是新开页面 */
        if (window.history.length <= 1 || metaObj.isNewPage) {
          if (metaObj.activePath) {
            ctx.root.$router.push({
              path: metaObj.activePath,
            });
          }
          return;
        }

        if (pathArr.length > 3 || (pathArr.length > 1 && pathArr[1] === 'workbench')) {
          ctx.root.$router.go(-1);
          return;
        }
      }
    };
    const routes = ref<any>(null);
    const showBackTitleHandle = (val: any) => {
      routes.value = val ? val : null;
    };
    provide('showBackTitleHandle', showBackTitleHandle);
    watch(
      () => ctx.root.$route.meta,
      () => {
        routes.value = null;
      },
    );
    const isDev = process.env.NODE_ENV === 'development';
    return {
      routes,
      ...toRefs(state),
      isDev,
      menuIsMini,
      RedDots,
      userRoles,
      handleCollapse,
      ...useVersion(ctx),
      ...useResetPw(ctx),
      backIconShow,
      backClick,
      isExternal,
    };
  },
});
