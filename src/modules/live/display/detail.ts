/**
 * 店铺代播 - 直播场次 - 场次详情
 */
import {
  defineComponent,
  ref,
  SetupContext,
  provide,
  computed,
  reactive,
  onBeforeMount,
  inject,
} from '@vue/composition-api';
import { RouterNameProjectManage } from '@/const/router';

import liveDisplayAddDialog from './dialog/live.display.add.vue';
import {
  DisplayDetail,
  DisplayDelete,
  DisplayClose,
  QueryShopLiveRecordDataList,
  RemoveShopLiveRecordDataService,
  GetTaobaoLiveInfo,
  QueryInProjectTeam,
  SetLiveDisplayNotLived,
  GetShopLiveStatistic,
} from '@/services/live';
import { AsyncConfirm } from '@/use/asyncConfirm';
import {
  KolSchedule,
  LiveDisplay,
  LiveDisplayDetail,
  LiveDisplayStatus,
  // LiveDisplayStatusMap,
  OperatorSchedule,
  ShopLiveDouyinDataForm,
  ShopLiveRecordData,
  ShopLiveRecordDataForm,
  ShopLiveStatistic,
  TaobaoLiveInfo,
} from '@/types/tiange/live';
import { RIGHT_CODE } from '@/const/rightCode';
import { HasPermission } from '@/use/permission';
import { usePermission } from '@/use/permission';
import { downloadFileFromBlob, wait } from '@/utils/func';
import { useRouter } from '@/use/vue-router';
import TgLiveDisplayDataInputDialog from '@/modules/live/display/dialog/LiveDisplayDataDialog.vue';
import { getToken } from '@/utils/token';

import TgLiveScheduleDialog from '@/modules/live/project/dialog/livedisplay/LiveScheduleForm.vue';
import moment from 'moment';
import { GetLiveAnalyse } from '@/services/live.replay';
import { BusinessTypeEnum } from '@/types/tiange/common';
import { formatAmount } from '@/utils/string';
import { useSchedules } from './use/schedule';
import liveData from '@/modules/live/display/dialog/liveData/index.vue';
import { LiveDataType } from './dialog/liveData';
import { useProjectBaseInfo } from '@/modules/settlement/use/project';

const JWToken = getToken();

export default defineComponent({
  name: 'TgLiveDisplay',
  components: {
    liveDisplayAddDialog,
    TgLiveDisplayDataInputDialog,
    TgLiveScheduleDialog,
    liveData,
  },
  props: {
    id: {
      type: Number,
      required: true,
    },
  },
  setup(props, ctx) {
    const permission = usePermission();
    const router = useRouter();
    /** 本地生活 */
    const project_id = parseInt(
      router.currentRoute.params.id || router.currentRoute.query.id + '',
      10,
    );
    const { isFromLocalLife, business_type, isFromSupplyChain, isFromLiveDouyin } =
      useProjectBaseInfo();
    const shop_live_id = router.currentRoute.params.liveId;
    const _displayInfoData = displayInfoData(
      ctx,
      project_id + '',
      shop_live_id,
      business_type.value || E.project.BusinessType.douyin,
    );
    const routes = [
      {
        name: isFromLocalLife.value
          ? RouterNameProjectManage.localLife.project.list
          : isFromSupplyChain.value
          ? RouterNameProjectManage.supplyChain.list
          : RouterNameProjectManage.live.project.list,
        title: '项目管理',
      },
      {
        name: isFromLocalLife.value
          ? RouterNameProjectManage.localLife.detail.info
          : isFromSupplyChain.value
          ? RouterNameProjectManage.supplyChain.detail
          : isFromLiveDouyin.value
          ? RouterNameProjectManage.tiktokLive.project.detail
          : RouterNameProjectManage.live.project.detail,
        params: {
          id: router.currentRoute.params.id,
          tab: 'live',
          liveType: isFromSupplyChain.value
            ? 'SupplyChainDetail'
            : router.currentRoute.params.liveType || 'calendar',
        },
        title: '项目详情',
      },
      {
        path: '',
        title: '场次详情',
      },
    ];
    if (isFromLocalLife.value || isFromLiveDouyin.value) {
      routes.splice(2, 0, {
        name: isFromLiveDouyin.value
          ? RouterNameProjectManage.tiktokLive.project.detail.display
          : RouterNameProjectManage.localLife.detail.display,
        params: {
          id: router.currentRoute.params.id,
          tab: 'live',
          liveType: 'calendar',
        },
        title: '直播场次',
      });
    }
    const showBackTitleHandle = inject('showBackTitleHandle') as Function;
    showBackTitleHandle(routes);
    return reactive({
      isFromLocalLife,
      isFromLiveDouyin,
      routes,
      permission,
      ..._displayInfoData,
    });
  },
});
/**  */
// 顶部信息LiveDisplay
function displayInfoData(
  ctx: SetupContext,
  project_id: string,
  shop_live_id: string,
  business_type: number,
) {
  const displayInfo = ref<LiveDisplay | undefined>(undefined);
  const LiveScheduleType = ref<string>('anchor');

  provide('liveDisplay', displayInfo);

  const isExpand = ref<boolean>(false);
  const closeLoading = ref<boolean>(false);
  const deleteLoading = ref<boolean>(false);

  const shouldEditing = ref<boolean>(false);
  const liveDataRef = ref<LiveDataType | undefined>(undefined);
  const shopLiveStatistic = ref<ShopLiveStatistic | undefined>(undefined);

  const router = useRouter();

  // 删除按钮事件
  const handleDeleteDisplayAction = async () => {
    const result = await AsyncConfirm(ctx, '确认删除本场直播？');
    if (result) {
      deleteLoading.value = true;
      const res = await DisplayDelete(shop_live_id, business_type);
      deleteLoading.value = false;
      if (res.data.success) {
        ctx.root.$message.success('删除成功');
        ctx.root.$router.push({
          name:
            business_type === E.project.BusinessType.supplyChain
              ? RouterNameProjectManage.supplyChain.detail
              : business_type === E.project.BusinessType.locallife
              ? RouterNameProjectManage.localLife.detail.display
              : RouterNameProjectManage.live.project.detail,
          params: {
            id: project_id,
            tab:
              business_type === E.project.BusinessType.supplyChain
                ? 'live'
                : business_type === E.project.BusinessType.locallife
                ? 'localLife'
                : router.currentRoute.params.tab,
            liveType:
              business_type === E.project.BusinessType.supplyChain
                ? 'SupplyChainDetail'
                : router.currentRoute.params.liveType,
            is_from_project: '1',
            business_type: business_type + '',
          },
        });
      } else {
        ctx.root.$message.error(res.data.message ?? '删除失败，稍后重试');
      }
    }
  };
  // 关闭按钮事件
  const handleCloseDisplayAction = async () => {
    const result = await AsyncConfirm(ctx, '关闭后场次相关信息无法修改，确认是否关闭');
    if (result) {
      closeLoading.value = true;
      const res = await DisplayClose(shop_live_id, '', business_type);
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
    const { data: response } = await DisplayDetail(shop_live_id, business_type);
    if (response.success) {
      displayInfo.value = response.data;
    } else {
      ctx.root.$message.error(response.message ?? '查询失败，稍后重试');
    }
  };
  const sendGetShopLiveStatisticRequest = async () => {
    if (isTaobaoDisplay.value) {
      return;
    }
    const res = await GetShopLiveStatistic(shop_live_id, business_type);
    if (res.data.success) {
      shopLiveStatistic.value = res.data.data;
    } else {
      ctx.root.$message.error(res.data.message ?? '查询失败，稍后重试');
    }
  };

  // ReloadDetailLoading
  const ReloadDetailLoading = ref(false);
  // 弹框关闭事件
  const handleCloseAction = () => {
    shouldEditing.value = false;
  };
  // 直播场次 弹框保存成功回调
  const handleSaveSucceedAction = async () => {
    shouldEditing.value = false;
    await reload();
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
    if (status === LiveDisplayStatus.lived) {
      return '已归档';
    }
    return '未归档';
    // return LiveDisplayStatusMap.get(status);
  };

  const statusClasses = (status: LiveDisplayStatus) => {
    if (status === LiveDisplayStatus.lived) {
      return 'status-green-color';
    }
    return 'status-light-color';
    // switch (status) {
    //   case LiveDisplayStatus.waitingLive:
    //     return 'status-green-color';
    //   case LiveDisplayStatus.lived:
    //     return 'status-dark-color';
    //   default:
    //     return 'status-light-color';
    // }
  };

  /** 权限检查 */
  const Permission = computed(() => {
    const canEdit =
      business_type === E.project.BusinessType.supplyChain
        ? HasPermission(RIGHT_CODE.supply_edit_shop_live)
        : business_type === E.project.BusinessType.locallife
        ? HasPermission(RIGHT_CODE.local_life_display_save)
        : HasPermission(RIGHT_CODE.live_display_save);
    const canEditLived =
      business_type === E.project.BusinessType.supplyChain
        ? HasPermission(RIGHT_CODE.supply_edit_shop_live_not_archive)
        : business_type === E.project.BusinessType.locallife
        ? HasPermission(RIGHT_CODE.local_life_display_lived_edit)
        : HasPermission(RIGHT_CODE.live_display_lived_edit);
    const canEditKOLSchedule =
      business_type === E.project.BusinessType.supplyChain
        ? HasPermission(RIGHT_CODE.supply_edit_kol_schedule)
        : business_type === E.project.BusinessType.locallife
        ? HasPermission(RIGHT_CODE.local_life_streamer_schedule)
        : HasPermission(RIGHT_CODE.live_streamer_schedule);
    const canEditOperatorSchedule =
      business_type === E.project.BusinessType.supplyChain
        ? HasPermission(RIGHT_CODE.supply_edit_assistant_schedule)
        : business_type === E.project.BusinessType.locallife
        ? HasPermission(RIGHT_CODE.local_life_operation_schedule)
        : HasPermission(RIGHT_CODE.live_operation_schedule);
    const canEditArchive =
      business_type === E.project.BusinessType.supplyChain
        ? HasPermission(RIGHT_CODE.supply_view_shop_live_archive)
        : business_type === E.project.BusinessType.locallife
        ? HasPermission(RIGHT_CODE.local_life_view_shop_live_archive)
        : HasPermission(RIGHT_CODE.view_shop_live_archive);
    return { canEdit, canEditLived, canEditArchive, canEditKOLSchedule, canEditOperatorSchedule };
  });

  const business_icon = (new_business_type: number | undefined) => {
    if (business_type === E.project.BusinessType.locallife) {
      new_business_type = business_type;
    }
    if (!new_business_type) return undefined;
    switch (new_business_type) {
      case 2:
        //  淘宝
        return 'ico-taobao';
      case 3:
        //  抖音
        return 'ico-douyin';
      case 7:
        //  抖音
        return 'ico-douyin';
      case 9:
        //  供应链
        return 'ico-douyin';
      default:
        return undefined;
    }
  };

  // 发送获取场次详情接口
  const { loadScheduleData, ScheduleData, ...rest } = useSchedules();
  const reload = async () => {
    ReloadDetailLoading.value = true;
    await sendGetDisplayDetailRequesast();

    await LoadShopLiveRecordDataList();
    await LoadLiveData();
    await ReloadTaobaoLiveInfoData();
    await loadScheduleData(shop_live_id, business_type);
    await sendGetShopLiveStatisticRequest();
    ReloadDetailLoading.value = false;
  };
  provide('reload', reload);

  const ShopLiveRecordDataList = ref<ShopLiveRecordData[]>([]);

  // 直播留档列表
  const LoadShopLiveRecordDataList = async () => {
    const { data: res } = await QueryShopLiveRecordDataList(shop_live_id, business_type);
    if (res.success) {
      ShopLiveRecordDataList.value = res.data;
    } else {
      ctx.root.$message.warning('直播留档数据获取失败');
    }
  };

  // 直播数据
  const LiveStatData = ref({
    contrast_live_id: '',
    promote_order_amount: '',
    promote_order_num: '',
    promote_order_person: '',
    promote_order_conversion_rate: '',
    view_link: '',
    fans_order_amount_percent: '',
  });

  const LoadLiveData = () => {
    const queryLiveReplayData = (liveId: number) => {
      GetLiveAnalyse(liveId, business_type).then(res => {
        const order_analyse = res.order_analyse;
        LiveStatData.value.view_link = res.view_link;
        LiveStatData.value.contrast_live_id = res.contrast_live_id;

        const promote_order_amount = formatAmount(order_analyse.promote_order_amount);
        LiveStatData.value.promote_order_amount =
          promote_order_amount === '￥' ? '--' : promote_order_amount;
        LiveStatData.value.promote_order_num = order_analyse.promote_order_num ?? '--';
        LiveStatData.value.promote_order_person = order_analyse.promote_order_person ?? '--';

        const promote_order_conversion_rate =
          order_analyse.promote_order_conversion_rate === ''
            ? null
            : order_analyse.promote_order_conversion_rate;
        LiveStatData.value.promote_order_conversion_rate = promote_order_conversion_rate
          ? promote_order_conversion_rate + ' %'
          : '--';

        const fans_order_amount_percent = order_analyse.fans_order_amount_percent;
        LiveStatData.value.fans_order_amount_percent = fans_order_amount_percent
          ? fans_order_amount_percent + ' %'
          : '--';
      });
    };
    queryLiveReplayData(parseInt(shop_live_id, 10));
  };

  /** 淘宝插件 场记 直播数据 */
  const TaobaoLiveLogs = ref<TaobaoLiveInfo[]>([]);

  const DisplayBusinessType = computed(() => displayInfo.value?.business_type);

  const ReloadTaobaoLiveInfoData = async () => {
    if (DisplayBusinessType.value === BusinessTypeEnum.taobao) {
      const GetTaobaoLiveInfoData = async () => {
        const response = await GetTaobaoLiveInfo(shop_live_id, business_type);
        TaobaoLiveLogs.value = response.data.data;
      };
      GetTaobaoLiveInfoData();
    }
  };

  /** 场次ID */
  const AddLiveDataInputVisible = ref(false);

  const AddLiveRecordHandler = () => {
    if (isTaobaoDisplay.value) {
      LiveDisplayInfoData.value = {
        id: -1,
        live_url: '',
        /* 开始时间 */
        real_start_time: '',
        /* 结束时间 */
        real_end_time: '',
        /** 直播时长截图 */
        duration_screenshot: '',
        /** 直播数据截图 */
        data_screenshot: '',
        /** 实际直播时长 */
        real_duration: '',
      };

      AddLiveDataInputVisible.value = true;
      return;
    }
    // LiveDisplayInfoData.value.duration_screenshot = liveData.duration_screenshot;
    // LiveDisplayInfoData.value.data_screenshot = liveData.data_screenshot;
    // LiveDisplayInfoData.value.live_url = liveData.live_url;
    // LiveDisplayInfoData.value.id = liveData.id;
    // LiveDisplayInfoData.value.real_start_time = liveData.real_start_time;
    // LiveDisplayInfoData.value.real_end_time = liveData.real_end_time;
    // LiveDisplayInfoData.value.real_duration = liveData.real_duration;

    let form: ShopLiveDouyinDataForm | undefined = undefined;
    if (displayInfo.value?.live_start_time && displayInfo.value.live_end_time) {
      form = {
        real_end_time: displayInfo.value.live_end_time
          ? moment(displayInfo.value.live_end_time).format('X')
          : '',
        real_start_time: displayInfo.value.live_start_time
          ? moment(displayInfo.value.live_start_time).format('X')
          : '',
        duration_screenshot: '',
        detail_file: [],
      };
    }
    liveDataRef.value?.show(form);
  };

  /** 关闭弹窗 */
  const onAddDataInputModalClose = async (data: LiveDisplayDetail | undefined) => {
    AddLiveDataInputVisible.value = false;
    if (data) {
      await LoadShopLiveRecordDataList();
    }
  };

  const onLiveDataSave = async () => {
    await LoadShopLiveRecordDataList();
  };

  const LiveDisplayInfoData = ref<ShopLiveRecordDataForm>({
    id: -1,
    live_url: '',
    /* 开始时间 */
    real_start_time: '',
    /* 结束时间 */
    real_end_time: '',
    /** 直播时长截图 */
    duration_screenshot: '',
    /** 直播数据截图 */
    data_screenshot: '',
    /** 实际直播时长 */
    real_duration: '',
  });

  const LiveScheduleDialogVisible = ref(false);

  const LiveSchedules = ref<{ kol: KolSchedule[]; operator: OperatorSchedule[] }>({
    kol: [],
    operator: [],
  });

  // 主播排班 运营排班
  const handleEditDisplayScheduleAction = (schedule_type: string) => {
    LiveScheduleDialogVisible.value = true;
    LiveScheduleType.value = schedule_type;
    if (schedule_type === 'anchor') {
      LiveSchedules.value.kol = ScheduleData.value.kolSchedules.map(el => {
        el.id = el.kol_id;
        return el;
      });
    } else {
      LiveSchedules.value.operator = ScheduleData.value.operatorSchedules.map(el => {
        el.id = el.user_id;
        return el;
      });
    }
  };

  const formDateRangeStr = (live_start_time: string, live_end_time: string) => {
    const startDate = moment(live_start_time);
    const endDate = moment(live_end_time);
    const isSameDay = startDate.isSame(endDate, 'd');
    let live_time = `${startDate.format('HH:mm')} ~ ${endDate.format('HH:mm')}`;
    if (!isSameDay) {
      live_time = `${live_time}(次日)`;
    }
    return live_time;
  };

  const GetDateRangeStr = (live_start_time: number, live_end_time: number) => {
    if (live_start_time && live_end_time) {
      live_start_time = live_start_time * 1000;
      live_end_time = live_end_time * 1000;
      const startDate = moment(live_start_time);
      const endDate = moment(live_end_time);
      const isSameDay = startDate.isSame(endDate, 'd');
      let live_time = `${startDate.format('YYYY.MM.DD HH:mm')} ~ ${endDate.format('HH:mm')}`;
      if (!isSameDay) {
        live_time = `${live_time}(次日)`;
      }
      return live_time;
    }
  };

  // 直播留档 删除
  const handleDeleteDisplayInfoDataAction = async (id: number) => {
    const confirm = await AsyncConfirm(ctx, '确认删除留档数据吗？');
    if (!confirm) {
      return;
    }

    const [{ data: res }] = await wait(200, RemoveShopLiveRecordDataService(id, business_type));
    if (res.success) {
      ctx.root.$message.success(res.message ?? '删除成功');
      await LoadShopLiveRecordDataList();
    } else {
      ctx.root.$message.error(res.message ?? '删除失败');
    }
  };
  // 直播时间
  const display_live_date_range_str = computed(() => {
    if (displayInfo.value?.live_start_time && displayInfo.value?.live_end_time) {
      const startDate = moment(displayInfo.value?.live_start_time);
      const endDate = moment(displayInfo.value?.live_end_time);

      const isSameDay = startDate.isSame(endDate, 'd');
      let live_time = `${startDate.format('YYYY.MM.DD HH:mm')} ~ ${endDate.format('HH:mm')}`;
      if (!isSameDay) {
        live_time = `${live_time}(次日)`;
      }
      return live_time;
    } else {
      return '';
    }
  });

  // 直播留档编辑
  const handleUpdateDisplayInfoDataAction = async (liveData: ShopLiveRecordData) => {
    if (isTaobaoDisplay.value) {
      AddLiveDataInputVisible.value = true;
      LiveDisplayInfoData.value.duration_screenshot = liveData.duration_screenshot;
      LiveDisplayInfoData.value.data_screenshot = liveData.data_screenshot;
      LiveDisplayInfoData.value.live_url = liveData.live_url;
      LiveDisplayInfoData.value.id = liveData.id;
      LiveDisplayInfoData.value.real_start_time = liveData.real_start_time;
      LiveDisplayInfoData.value.real_end_time = liveData.real_end_time;
      LiveDisplayInfoData.value.real_duration = liveData.real_duration;
      return;
    }
    const { detail_file, ...rest } = liveData;
    liveDataRef.value?.show({
      detail_file: detail_file?.length ? [detail_file] : [],
      ...rest,
    });
  };

  // 排班更新
  const handleUpdateScheduleAction = async () => {
    await loadScheduleData(shop_live_id, business_type);
  };

  // 可以编辑的状态 （已直播）状态所有按钮都不可编辑
  const CanEditStatus = computed(() => displayInfo.value?.live_status !== LiveDisplayStatus.lived);

  // 排班数据列表
  const kolScheduleList = computed(() => {
    const DataMap = new Map();
    const datalist: { date_range_str: string; users_str: string }[] = [];

    ScheduleData.value.kolSchedules.forEach(item => {
      const timestr = formDateRangeStr(item.start_time, item.end_time);
      const real_name = '(' + (item.real_name ?? '--') + ')';
      const combine_name = item.kol_name ? item.kol_name + real_name : '';

      if (DataMap.get(timestr)) {
        const users = DataMap.get(timestr);
        users.push(combine_name);

        DataMap.set(timestr, users);
      } else {
        DataMap.set(timestr, [combine_name]);
      }
    });
    DataMap.forEach(function (value, key) {
      datalist.push({ date_range_str: key, users_str: value.join('、') });
    });

    return datalist;
  });
  const OperatorScheduleList = computed(() => {
    const DataMap = new Map();
    const datalist: { date_range_str: string; users_str: string }[] = [];

    ScheduleData.value.operatorSchedules.forEach(item => {
      const timestr = formDateRangeStr(item.start_time, item.end_time);
      if (DataMap.get(timestr)) {
        const users = DataMap.get(timestr);
        users.push(item.operator_name);
        DataMap.set(timestr, users);
      } else {
        DataMap.set(timestr, [item.operator_name]);
      }
    });

    DataMap.forEach(function (value, key) {
      datalist.push({ date_range_str: key, users_str: ' ' + value.join('、') });
    });

    return datalist;
  });

  const isTaobaoDisplay = computed(
    () => displayInfo.value?.business_type === BusinessTypeEnum.taobao,
  );
  const inProjectTeam = ref<boolean | undefined>(undefined);
  const PermissionCheckLoading = ref(false);

  const methods = {
    queryInProjectTeam: async () => {
      PermissionCheckLoading.value = true;
      const res = await QueryInProjectTeam(
        project_id.toString(),
        business_type || E.project.BusinessType.douyin,
      );
      PermissionCheckLoading.value = false;
      if (res.data.success) {
        inProjectTeam.value = res.data.data.in_project ? true : false;
        if (inProjectTeam.value) {
          reload();
        }
      }
    },
  };

  // 编辑按钮事件
  const handleEditDisplayAction = async () => {
    if (Permission.value.canEdit && displayInfo.value?.live_status !== LiveDisplayStatus.lived) {
      shouldEditing.value = true;
    } else if (
      Permission.value.canEditLived &&
      displayInfo.value?.live_status === LiveDisplayStatus.lived
    ) {
      const confirm = await AsyncConfirm(ctx, {
        title: '是否设置成未归档？',
        cancelText: '否',
        confirmText: '是',
      });
      if (confirm) {
        // 设置为未归档
        const res = await SetLiveDisplayNotLived(
          {
            shop_live_id: shop_live_id,
          },
          business_type,
        );
        if (res.data.success) {
          ctx.root.$message.success(res.data.message);
          reload();
        } else {
          ctx.root.$message.error(res.data.message);
        }
      }
    }
  };

  const downloadFile = (url: string, name: string | undefined = undefined) => {
    const requestOptions = {
      headers: {
        Authorization: getToken() ?? '',
      },
    };
    fetch(url, requestOptions).then(async response => {
      const result = response.clone();
      try {
        const data = await result.json();
        ctx.root.$message.error(data.message);
      } catch {
        if (response.status === 200) {
          const data = await response.blob();
          const filename = name ?? decodeURIComponent(url.split('/')[url.split('/').length - 1]);
          downloadFileFromBlob(data, filename);
        } else {
          ctx.root.$message.error('下载失败');
        }
      }
    });
  };

  const onDownloadLiveData = (liveData: ShopLiveRecordData) => {
    if (!liveData.detail_file?.length) {
      ctx.root.$message.error('文件不存在，下载失败');
      return;
    }
    let name = liveData.detail_file?.split('/').pop();
    if (name) {
      name = decodeURI(name);
    } else {
      ctx.root.$message.error('文件不存在，下载失败');
      return;
    }

    downloadFile(liveData.detail_file, name);
  };

  onBeforeMount(() => {
    methods.queryInProjectTeam();
  });

  const formatNum = (num: number | undefined, decimal: boolean, percent = false) => {
    if (num === undefined || num === null) {
      return '--';
    }
    if (percent) {
      return num;
    }
    return formatAmount(num, 'None', !decimal);
  };
  // const isAutoObtain = computed(() => {
  //   if (displayInfo.value?.allow_update_kol_schedule) {
  //     return false;
  //   }
  //   return displayInfo.value?.compass_shop_live_room_id ? true : false;
  // });

  // const isDataImport = computed(() =>
  //   displayInfo.value?.compass_shop_live_room_id ? true : false,
  // );

  return {
    ReloadDetailLoading,
    PermissionCheckLoading,
    inProjectTeam,
    isTaobaoDisplay,
    TaobaoLiveLogs,
    OperatorScheduleList,
    kolScheduleList,
    CanEditStatus,
    formDateRangeStr,
    LiveStatData,
    handleUpdateScheduleAction,
    LiveSchedules,
    handleUpdateDisplayInfoDataAction,
    display_live_date_range_str,
    handleDeleteDisplayInfoDataAction,
    GetDateRangeStr,
    Permission,
    reload,
    isExpand,
    displayInfo,
    closeLoading,
    deleteLoading,
    shouldEditing,
    liveDataRef,

    handleEditDisplayAction,
    handleCloseDisplayAction,
    handleDeleteDisplayAction,
    handleCloseAction,
    handleSaveSucceedAction,
    liveTime,
    liveStatus,
    LiveDisplayStatus,
    statusClasses,
    business_icon,

    ScheduleData,
    ShopLiveRecordDataList,
    LiveDisplayInfoData,
    AddLiveDataInputVisible,
    onAddDataInputModalClose,
    AddLiveRecordHandler,
    handleEditDisplayScheduleAction,
    LiveScheduleDialogVisible,
    JWToken,
    LiveScheduleType,
    onDownloadLiveData,
    shopLiveStatistic,
    onLiveDataSave,
    formatAmount,
    formatNum,
    // isAutoObtain,
    // isDataImport,
  };
}
