import store from '@/store';
import { computed, Ref } from '@vue/composition-api';

export const useStore = (): any => {
  return store;
};

export const useState = (fn: (arg: any) => any): any => {
  const store = useStore();
  const _computed = computed(() => {
    return fn(store.state);
  });
  return _computed;
};

export const useUserInfo = (): Ref<any> => {
  const store = useStore();
  const userinfo = computed(() => store.getters['user/getUserInfo']);

  return userinfo;
};

export const useMarkeup = () => {
  const userinfo = useUserInfo();
  const hasMareup = computed(() => {
    return userinfo.value.feishu_user_info?.job_title === '形象设计师';
  });
  return hasMareup;
};
