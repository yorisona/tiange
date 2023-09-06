/**
 * 店铺代播 - 直播场次 - 场次详情
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2020-12-26 11:41:33
 */
import {
  defineComponent,
  ref,
  SetupContext,
  provide,
  computed,
  watch,
  reactive,
  set,
} from '@vue/composition-api';
import { RouterNameProjectManage } from '@/const/router';
import { useTabs } from '@/use/tab';
import { Tab } from '@/types/components/tabs';
import pane1 from './tabs/pane1.vue';
import kolDataTable from './tabs/kol.data.vue';
import pane3 from './tabs/pane3.vue';
import liveDisplayAddDialog from './dialog/live.display.add.vue';
import { DisplayDetail, DisplayDelete, DisplayClose } from '@/services/live';
import { AsyncConfirm } from '@/use/asyncConfirm';
import { LiveDisplay, LiveDisplayStatus, LiveDisplayStatusMap } from '@/types/tiange/live';
import { RIGHT_CODE } from '@/const/rightCode';
import { HasPermission } from '@/use/permission';
import Money, { MoneyUnit } from '@/utils/money';
import { LiveDisplaySelectionGoalDetail } from '@/types/tiange/live';
import replay from './replay/index.vue';
import { usePermission } from '@/use/permission';

const routes = [
  // {
  //   name: RouterNameProjectManage.live.project.list,
  //   title: '店铺代播',
  // },
  {
    name: RouterNameProjectManage.live.display.list,
    title: '直播场次',
  },
  {
    path: '',
    title: '场次详情',
  },
];

export default defineComponent({
  name: 'TgLiveDisplay',
  components: {
    pane1,
    kolDataTable,
    pane3,
    liveDisplayAddDialog,
    replay,
  },
  props: {
    id: {
      type: Number,
      required: true,
    },
    tab: {
      type: String,
      default: 'pane1',
    },
  },
  setup(props, ctx) {
    const permission = usePermission();
    const tabs = useTabs(
      [
        { label: '人员排班', value: 'pane1' },
        { label: '主播数据', value: 'kolDataTable' },
        { label: '直播数据', value: 'pane3' },
        { label: '', value: 'replay' },
      ].filter(Boolean) as any,
      props.tab,
    );
    const onTabChange = (tab: Tab) => {
      tabs.checkedTab.value = tab.value;
      const newRouteConfig =
        tabs.tabs[0].value === tab.value
          ? { name: RouterNameProjectManage.live.display.detail }
          : {
              name: RouterNameProjectManage.live.display.detail,
              params: { tab: tab.value },
            };

      ctx.root.$router.push(newRouteConfig);
    };

    const _displayInfoData = displayInfoData(ctx, props.id);

    watch(
      () => _displayInfoData.displayInfo.value,
      () => {
        if (permission.live_display_view) {
          if (_displayInfoData.displayInfo.value?.business_type === 2) {
            set(tabs.tabs[3], 'label', '直播复盘');
          }
        }
      },
    );

    return reactive({
      routes,
      ...tabs,
      onTabChange,
      ..._displayInfoData,
    });
  },
});

// 顶部信息LiveDisplay
function displayInfoData(ctx: SetupContext, id: number) {
  const money = new Money();

  const displayInfo = ref<LiveDisplay | undefined>(undefined);

  provide('liveDisplay', displayInfo);

  const isExpand = ref<boolean>(false);
  const closeLoading = ref<boolean>(false);
  const deleteLoading = ref<boolean>(false);

  const shouldEditing = ref<boolean>(false);
  // 编辑按钮事件
  const handleEditDisplayAction = () => {
    shouldEditing.value = true;
  };
  // 删除按钮事件
  const handleDeleteDisplayAction = async () => {
    const result = await AsyncConfirm(ctx, '确认删除本场直播？');
    if (result) {
      deleteLoading.value = true;
      const res = await DisplayDelete(id);
      deleteLoading.value = false;
      if (res.data.success) {
        ctx.root.$message.success('删除成功');
        ctx.root.$router.push({
          name: RouterNameProjectManage.live.display.list,
        });
      } else {
        ctx.root.$message.error(res.data.message ?? '删除失败，稍后重试');
      }
    }
  };
  // 关闭按钮事件
  const handleCloseDisplayAction = async () => {
    const result = await AsyncConfirm(ctx, '提交前请确认已正确录入主播数据和直播数据');
    if (result) {
      closeLoading.value = true;
      const res = await DisplayClose(id);
      closeLoading.value = false;
      if (res.data.success) {
        ctx.root.$message.success('关闭成功');
        sendGetDisplayDetailRequesast();
      } else {
        ctx.root.$message.error(res.data.message ?? '关闭失败，稍后重试');
      }
    }
  };
  // 获取场次详情的请求
  const sendGetDisplayDetailRequesast = async () => {
    const { data: response } = await DisplayDetail(id);
    if (response.success) {
      displayInfo.value = response.data;
    } else {
      ctx.root.$message.error(response.message ?? '查询失败，稍后重试');
      // ctx.root.$message({
      //   type: 'warning',
      //   message: response.message ?? '查询失败，稍后重试',
      //   duration: 2000,
      //   showClose: true,
      // });
    }
  };

  // 弹框关闭事件
  const handleCloseAction = () => {
    shouldEditing.value = false;
  };
  // 弹框保存成功回调
  const handleSaveSucceedAction = () => {
    shouldEditing.value = false;
    sendGetDisplayDetailRequesast();
  };

  // 直播时间生成
  const liveTime = (startTime: string, endTime: string) => {
    if (!startTime || !endTime) {
      return '';
    }
    // const [startTimePrefix, _] = startTime.split(' ');
    // const [endTimePrefix, endTimeSurfix] = endTime.split(' ');

    const newLiveTime = `${startTime} ~ ${endTime}`;
    // if (startTimePrefix !== endTimePrefix) {
    //   newLiveTime = `${startTime} ~ 次日 ${endTimeSurfix}`;
    // } else {
    //   newLiveTime = `${startTime} ~ ${endTimeSurfix}`;
    // }
    return newLiveTime.replace(/-/g, '.');
  };

  // 直播状态字符串
  const liveStatus = (status: LiveDisplayStatus) => {
    return LiveDisplayStatusMap.get(status);
  };

  const statusClasses = (status: LiveDisplayStatus) => {
    switch (status) {
      case LiveDisplayStatus.waitingLive:
        return 'status-green-color';
      case LiveDisplayStatus.lived:
        return 'status-dark-color';
      default:
        return 'status-light-color';
    }
  };

  // 发送获取场次详情接口
  sendGetDisplayDetailRequesast();

  const reload = () => {
    sendGetDisplayDetailRequesast();
  };

  /** 权限检查 */
  const Permission = computed(() => {
    const canEdit = HasPermission(RIGHT_CODE.live_display_save);
    const canDelete = HasPermission(RIGHT_CODE.live_display_save);
    const canClose = HasPermission(RIGHT_CODE.live_display_save);
    return { canDelete, canEdit, canClose };
  });

  const business_icon = (business_type: number | undefined) => {
    if (!business_type) return undefined;
    switch (business_type) {
      case 2:
        //  淘宝
        return 'ico-taobao';
        break;
      case 3:
        //  抖音
        return 'ico-douyin';
        break;
      default:
        return undefined;
        break;
    }
  };

  const selection_target_format = (type: number, index: number) => {
    let target_obj: LiveDisplaySelectionGoalDetail | undefined = undefined;
    switch (type) {
      case 1:
        target_obj = displayInfo.value?.selection_goal?.fuli;
        break;
      case 2:
        target_obj = displayInfo.value?.selection_goal?.yinliu;
        break;
      case 3:
        target_obj = displayInfo.value?.selection_goal?.richang;
        break;
      case 4:
        target_obj = displayInfo.value?.selection_goal?.xingxiang;
        break;
      default:
        break;
    }
    if (!target_obj) return '--';
    switch (index) {
      case 0:
        return formatNumberDisplay(target_obj.plan_sale_count);
      case 1:
        return formatNumberDisplay(target_obj.plan_sale_amount, '￥');
      case 2:
        return formatNumberDisplay(target_obj.plan_live_goods);
      case 3:
        if (!target_obj.pre_unit_price) {
          return '--';
        }
        // const plan_price = Number.parseFloat(`${target_obj.plan_sale_amount}`) / Number.parseInt(`${target_obj.plan_sale_count}`)
        return `￥${target_obj.pre_unit_price}`;
      case 4:
        if (!target_obj.pre_unit_sales) {
          return '--';
        }
        // const amount = Number.parseFloat(`${target_obj.plan_sale_count}`) / Number.parseInt(`${target_obj.plan_live_goods}`)
        return target_obj.pre_unit_sales;
      default:
        break;
    }
  };

  const goToProjectDetail = () => {
    const { href } = ctx.root.$router.resolve({
      name: RouterNameProjectManage.live.project.detail,
      params: {
        id: `${displayInfo?.value?.project_id}`,
        type: '1',
        step: '2',
      },
    });
    window.open(href, '_blank');
  };

  const formatNumberDisplay = (
    value: number | string | undefined,
    prefix: string | undefined = undefined,
    surfix: string | undefined = undefined,
  ) => {
    if (!value) return '--';
    let newValue = undefined;

    const valueStr = `${value}`;
    if (valueStr.indexOf('.') !== -1) {
      newValue = money.format(Number(value), MoneyUnit.Yuan);
    } else {
      newValue = money.addThousand(valueStr);
    }

    if (prefix) {
      newValue = `${prefix} ${newValue}`;
    }
    if (surfix) {
      newValue = `${newValue}${surfix}`;
    }
    return newValue;
  };

  const selection_target_tag_background = (type: number) => {
    return `selection-target-tag selection-target-tag-background-${type}`;
  };

  const selection_target_tag_name = (type: number) => {
    switch (type) {
      case 1:
        return '福利款';
      case 2:
        return '引流款';
      case 3:
        return '日常款';
      case 4:
        return '形象款';
      default:
        break;
    }
  };

  provide('reload', reload);

  return {
    Permission,
    reload,
    isExpand,
    displayInfo,
    closeLoading,
    deleteLoading,
    shouldEditing,
    handleEditDisplayAction,
    handleCloseDisplayAction,
    handleDeleteDisplayAction,
    handleCloseAction,
    handleSaveSucceedAction,
    goToProjectDetail,
    liveTime,
    liveStatus,
    LiveDisplayStatus,
    statusClasses,
    business_icon,
    formatNumberDisplay,
    selection_target_format,
    selection_target_tag_background,
    selection_target_tag_name,
  };
}
