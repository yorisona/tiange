/*
 * @Brief: 主播数据
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2021-01-15 10:34:59
 */

import { defineComponent, ref, Ref, SetupContext, inject, computed } from '@vue/composition-api';
import { TableColumn } from '@/types/vendor/column';
import {
  KolData,
  KolDataForm,
  LiveDisplay,
  LiveDisplayDetail,
  LiveDisplayStatus,
} from '@/types/tiange/live';
import { GetTaobaoLiveInfo, KolDataQuery } from '@/services/live';
import kolDataTypeIn from '../dialog/kol.data.type.in.vue';
import { HasPermission } from '@/use/permission';
import { RIGHT_CODE } from '@/const/rightCode';
import { BusinessTypeEnum } from '@/types/tiange/common';
import { downloadFileFromBlob } from '@/utils/func';
import { DOWNLOAD_TAOBAO_SHOP_LIVE_DATA_API } from '@/apis/live';
import { getToken } from '@/utils/token';
import { useProjectBaseInfo } from '@/modules/settlement/use/project';

const requestOptions = {
  headers: {
    Authorization: getToken() ?? '',
  },
};

export default defineComponent({
  components: {
    kolDataTypeIn,
  },
  setup(props, ctx) {
    const { isFromLocalLife, isFromSupplyChain } = useProjectBaseInfo();
    /** 权限检查 */
    const Permission = computed(() => {
      /** 主播数据录入 */
      const canEdit = isFromSupplyChain.value
        ? HasPermission(RIGHT_CODE.supply_view_shop_live_archive)
        : isFromLocalLife.value
        ? HasPermission(RIGHT_CODE.local_life_view_shop_live_archive)
        : HasPermission(RIGHT_CODE.view_shop_live_archive);

      /** 下载淘宝直播间 场记 */
      const canDownloadTaobaoLiveLog = true;
      return { canEdit, canDownloadTaobaoLiveLog };
    });

    /** 下载淘宝场记数据 */
    const handleDownloadTaobaoLiveLog = async (tb_live: any) => {
      const apiurl = DOWNLOAD_TAOBAO_SHOP_LIVE_DATA_API + '?tb_live_id=' + tb_live.tb_live_id;

      const date_str = tb_live.start_time.split(' ')[0];
      const fileName = tb_live.title + date_str + '直播间场记';

      fetch(apiurl, requestOptions).then(async response => {
        const result = response.clone();
        try {
          const data = await result.json();
          ctx.root.$message.error(data.message);
        } catch {
          if (response.status === 200) {
            const data = await response.blob();
            downloadFileFromBlob(data, fileName + '.xlsx');
          } else {
            ctx.root.$message.error('下载失败');
          }
        }
      });
    };

    /** 淘宝插件 场记 直播数据 */
    const TaobaoLiveLogs = ref<any>([]);

    const liveDisplay = inject<Ref<LiveDisplayDetail>>('liveDisplay');
    if (liveDisplay?.value.business_type === BusinessTypeEnum.taobao) {
      const GetTaobaoLiveInfoData = async () => {
        const response = await GetTaobaoLiveInfo(liveDisplay.value.id);
        TaobaoLiveLogs.value = response.data.data;
      };

      GetTaobaoLiveInfoData();
    }

    return { ...kolDataSetup(ctx), Permission, TaobaoLiveLogs, handleDownloadTaobaoLiveLog };
  },
});

function kolDataSetup(ctx: SetupContext) {
  // 场次id
  const id = ctx.root.$router.currentRoute.params.id
    ? parseInt(ctx.root.$router.currentRoute.params.id, 10)
    : undefined;
  // 获取注入的场次数据
  const liveDisplay = inject<Ref<LiveDisplay>>('liveDisplay');
  //   是否显示 录入主播数据 按钮
  const showTypeIn = computed(() => {
    switch (liveDisplay?.value.live_status) {
      case LiveDisplayStatus.waitingSchedule:
        return false;
      case LiveDisplayStatus.lived:
        return false;
      case undefined:
        return false;
      default:
        return true;
    }
  });
  // 录入弹框是否显示
  const typeInVisiable = ref<boolean>(false);
  // 列表数据
  const list = ref<KolData[]>([]);
  // 带入弹框中的数据
  const typeInKols = ref<Partial<KolDataForm>[] | undefined>(undefined);

  const columns = ref<TableColumn<KolData>[]>([
    {
      type: 'index',
      label: '序号',
      align: 'center',
      width: 52,
    },
    {
      label: '主播',
      prop: 'kol_name',
      align: 'left',
      minWidth: 435,
    },
    {
      label: '直播时间',
      minWidth: 435,
      align: 'center',
      formatter: row => {
        return liveTime(row.real_start_time, row.real_end_time);
      },
    },
    {
      label: '直播时长(时)',
      prop: 'real_duration',
      minWidth: 100,
      align: 'center',
    },
  ]);
  // 录入主播数据 按钮事件
  const typeInAction = () => {
    if (list.value.length) {
      typeInKols.value = list.value.map((kol: KolData) => {
        const [startDate, startTime] = kol.real_start_time
          ? kol.real_start_time.split(' ')
          : [undefined, undefined];
        const [endDate, endTime] = kol.real_end_time
          ? kol.real_end_time.split(' ')
          : [undefined, undefined];
        return {
          live_start_date: startDate,
          live_start_time: startTime,
          live_end_date: endDate,
          live_end_time: endTime,
          // live_time: [kol.real_start_time, kol.real_end_time],
          /* 时长 */
          real_duration: kol.real_duration,
          /* 主播id */
          kol_id: kol.kol_id,
          kol_name: kol.kol_name,
        };
      });
    }
    typeInVisiable.value = true;
  };
  // 主播数据 列表请求
  const queryKolDataRequest = async () => {
    if (!id) {
      return;
    }
    const { data: response } = await KolDataQuery(id);
    if (response.success) {
      list.value = response.data;
    }
  };

  // 直播时间生成
  const liveTime = (startTime: string, endTime: string) => {
    if (!startTime || !endTime) {
      return '--';
    }
    const newLiveTime = `${startTime} ~ ${endTime}`;
    return newLiveTime.replace(/-/g, '.');
    // const [startTimePrefix, _] = startTime.split(' ');
    // const [endTimePrefix, endTimeSurfix] = endTime.split(' ');

    // let newLiveTime = undefined;
    // if (startTimePrefix !== endTimePrefix) {
    //   newLiveTime = `${startTime} ~ 次日 ${endTimeSurfix}`;
    // } else {
    //   newLiveTime = `${startTime} ~ ${endTimeSurfix}`;
    // }
    // return newLiveTime.replace(/-/g, '.');
  };
  // 弹框 保存成功回调
  const save = () => {
    typeInVisiable.value = false;
    queryKolDataRequest();
  };

  queryKolDataRequest();

  return {
    liveDisplay,
    id,
    typeInVisiable,
    list,
    typeInAction,
    columns,
    save,
    showTypeIn,
    typeInKols,
  };
}
