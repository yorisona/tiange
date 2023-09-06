import {
  BusinessTypeMap,
  CooperationTypeMap,
  CustomerCategoryMAP,
  CooperationTypeEnum,
  SettlementCycleTypeMap,
  BusinessTypeEnum,
} from '@/types/tiange/common';
import { LiveProject } from '@/types/tiange/live.project';
import { computed, defineComponent, inject, ref, Ref } from '@vue/composition-api';
import AddLiveProject from '@/modules/live/project/dialog/projectform/index.vue';
import { RIGHT_CODE } from '@/const/rightCode';
import { HasPermission } from '@/use/permission';

export default defineComponent({
  name: 'LiveProjectDetailInfo',
  components: {
    AddLiveProject,
  },
  setup(props, ctx) {
    const AddProjectVisible = ref(false);
    const toggleAddProjectModalVisible = (visible = false) => {
      AddProjectVisible.value = visible;
    };
    const onAddProjectModalClose = async (success: boolean) => {
      toggleAddProjectModalVisible(false);
      if (success) {
        ctx.emit('editProjectReload');
      }
    };

    const project =
      inject<Ref<LiveProject | undefined>>('project') ?? ref<LiveProject | undefined>(undefined);

    const currentProject = computed(() => project.value);

    const category_str = computed(
      () => CustomerCategoryMAP.get(project.value?.category ?? -1) ?? '',
    );

    const price_per_hour_str = computed(() => project.value?.price_per_hour + '元/小时' ?? '');
    const commission_rate_str = computed(() => project.value?.commission_rate + '%' ?? '');

    /** 每月场次 */
    const live_num_per_month_str = computed(() => {
      const live_num_per_month = project.value?.live_num_per_month;
      if (live_num_per_month === null || live_num_per_month === '') {
        return '';
      } else {
        return live_num_per_month + '场';
      }
    });

    /** 每场时长 */
    const duration_per_live_str = computed(() => {
      const duration_per_live = project.value?.duration_per_live;
      if (duration_per_live === null || duration_per_live === '') {
        return '';
      } else {
        return duration_per_live + '个小时';
      }
    });

    /** 月度时长 */
    const month_duration_str = computed(() => {
      const month_duration = project.value?.month_duration;
      if (month_duration === null || month_duration === '') {
        return '';
      } else {
        return month_duration + '小时';
      }
    });

    /** 项目周期 */
    const project_date_range = computed(() => {
      const start_date_str = project.value?.start_date.replace(/-/g, '.') ?? '';
      const end_date_str = project.value?.end_date.replace(/-/g, '.') ?? '';

      if (start_date_str === '' || end_date_str === '') {
        return '';
      } else {
        return start_date_str + ' ～ ' + end_date_str;
      }
    });

    /** 合作类型 */
    const cooperation_type_str = computed(
      () => CooperationTypeMap.get(project.value?.cooperation_type ?? -1) ?? '',
    );

    const SelfSupportCooperation = computed(
      () => project.value?.cooperation_type === CooperationTypeEnum.selfSupport,
    );

    /** 业务类型 */
    const business_type_str = computed(() => {
      const business_type = project.value?.business_type;

      return BusinessTypeMap.get(business_type ?? -1) ?? '';
    });

    const settlement_cycle_type_str = computed(
      () => SettlementCycleTypeMap.get(project.value?.settlement_cycle_type ?? -1) ?? '',
    );

    /** 权限检查 */
    const Permission = computed(() => {
      const canEdit = HasPermission(RIGHT_CODE.live_project_save);
      return { canEdit };
    });

    const live_account_ids_str = computed(() =>
      currentProject.value?.live_account_ids &&
      currentProject.value.business_type === BusinessTypeEnum.taobao
        ? currentProject.value?.live_account_ids
            ?.split(',')
            .filter(el => el)
            .join('/')
        : '',
    );

    /** 跳转到客户详情 */
    const jumptoShopDetailPage = (shop_id: number) => {
      const path = '/customer/shop/' + shop_id.toString();
      window.open(path);
    };

    /** 跳转到公司详情 */
    const jumptoCompanyDetailPage = (customer_company_id: number) => {
      const path = '/customer/company/' + customer_company_id.toString();
      window.open(path);
    };

    return {
      BusinessTypeEnum,
      live_account_ids_str,
      jumptoShopDetailPage,
      Permission,
      SelfSupportCooperation,
      AddProjectVisible,
      toggleAddProjectModalVisible,
      onAddProjectModalClose,
      project,
      currentProject,
      category_str,
      price_per_hour_str,
      commission_rate_str,
      live_num_per_month_str,
      duration_per_live_str,
      month_duration_str,
      project_date_range,
      cooperation_type_str,
      business_type_str,
      settlement_cycle_type_str,
      jumptoCompanyDetailPage,
    };
  },
});
