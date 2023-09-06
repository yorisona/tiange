/*
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2022-02-28 13:29:14
 */

import { IAnchorInfo } from '@/types/tiange/supplier';
import { usePermission } from '@/use/permission';
import { useStore } from '@/use/vuex';
import { computed, Ref } from '@vue/composition-api';

export enum AnchorKeyViewStatus {
  /** 无法查看 */
  None,
  /** 可以查看，但是被隐藏 */
  ViewMask,
  /** 可以查看，已经显示 */
  ViewWithoutMask,
  /** 可以直接查看 */
  ViewDirectly,
}

export const supplier_permission_info = usePermission();
/**
 * 当前用户是否是创建人或者维护人
 * @param anchorInfo 主播信息
 * @returns
 */
export const is_creator_maintainer = (anchorInfo: Ref<IAnchorInfo | undefined>) => {
  // store.state.user?.userinfo?.id;
  return computed(() => {
    const store = useStore();
    const userinfo = store.state.user?.userinfo;
    const currentUserId = userinfo?.id;
    return (
      anchorInfo?.value?.add_user_id === currentUserId ||
      anchorInfo.value?.maintainer_id === currentUserId
    );
  });
};
/**
 * 主播隐私数据查看状态
 * @param anchorInfo 主播信息
 * @param keyValue
 * @returns
 */
export const anchor_key_view_status = (
  anchorInfo: Ref<IAnchorInfo | undefined>,
  keyValue: Ref<string | undefined>,
) => {
  return computed(() => {
    if (is_creator_maintainer(anchorInfo).value) {
      return AnchorKeyViewStatus.ViewDirectly;
    }
    if (supplier_permission_info.view_anchor_key_info && keyValue.value !== '' && !keyValue.value) {
      return AnchorKeyViewStatus.ViewMask;
    }
    if (
      supplier_permission_info.view_anchor_key_info &&
      (keyValue.value || keyValue.value === '')
    ) {
      return AnchorKeyViewStatus.ViewWithoutMask;
    }
    return AnchorKeyViewStatus.None;
  });
};
