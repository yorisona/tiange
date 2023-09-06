/*
 * @Brief: 店铺代播-场次详情-直播数据tab页
 * @author  wuyou <wuyou@goumee.com>
 * @since   2021-01-15 11:12:34
 */
import { LiveDisplayDetail, LiveDisplayStatus } from '@/types/tiange/live';
import { getToken } from '@/utils/token';
import { computed, defineComponent, inject, Ref, ref } from '@vue/composition-api';
import TgLiveDisplayDataInputDialog from '../dialog/live.datainput.dialog.vue';
import { format as DateTimeFormat } from '@/utils/time';
import { HasPermission } from '@/use/permission';
import { RIGHT_CODE } from '@/const/rightCode';
import { BusinessTypeEnum } from '@/types/tiange/common';
import { GetTaobaoLiveInfo } from '@/services/live';
import { downloadFileFromBlob } from '@/utils/func';
import { DOWNLOAD_TAOBAO_SHOP_LIVE_STUDIO_DATA_API } from '@/apis/live';
import { useProjectBaseInfo } from '@/modules/settlement/use/project';

const requestOptions = {
  headers: {
    Authorization: getToken() ?? '',
  },
};

export default defineComponent({
  name: 'LiveDataInputPane',
  components: {
    TgLiveDisplayDataInputDialog,
  },
  setup(props, ctx) {
    /** 权限检查 */
    const { isFromLocalLife, isFromSupplyChain } = useProjectBaseInfo();
    const Permission = computed(() => {
      const canEdit = isFromSupplyChain.value
        ? HasPermission(RIGHT_CODE.supply_view_shop_live_archive)
        : isFromLocalLife.value
        ? HasPermission(RIGHT_CODE.local_life_view_shop_live_archive)
        : HasPermission(RIGHT_CODE.view_shop_live_archive);

      /** 下载淘宝直播间 实时数据 */
      const canDownloadTaobaoLiveStudioData = true;
      return { canEdit, canDownloadTaobaoLiveStudioData };
    });

    /** 下载淘宝直播间数据 */
    const handleDownloadTaobaoLiveStudioData = async (tb_live: any) => {
      const apiurl =
        DOWNLOAD_TAOBAO_SHOP_LIVE_STUDIO_DATA_API + '?tb_live_id=' + tb_live.tb_live_id;
      const date_str = tb_live.start_time.split(' ')[0];
      const fileName = tb_live.title + date_str + '直播间实时数据';

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

    /** 场次ID */
    const AddLiveDataInputVisible = ref(false);

    const liveDisplay = inject<Ref<LiveDisplayDetail>>('liveDisplay');

    if (liveDisplay?.value.business_type === BusinessTypeEnum.taobao) {
      const GetTaobaoLiveInfoData = async () => {
        const response = await GetTaobaoLiveInfo(liveDisplay.value.id);
        TaobaoLiveLogs.value = response.data.data;
      };

      GetTaobaoLiveInfoData();
    }

    const DisplayInfo = ref<LiveDisplayDetail>({
      id: liveDisplay?.value.id ?? -1,
      live_url: liveDisplay?.value.live_url,
      /* 开始时间 */
      real_start_time: liveDisplay?.value.real_start_time ?? '',
      /* 结束时间 */
      real_end_time: liveDisplay?.value.real_end_time ?? '',
      /** 直播时长截图 */
      duration_screenshot: liveDisplay?.value.duration_screenshot,
      /** 直播数据截图 */
      data_screenshot: liveDisplay?.value.data_screenshot,
      /** 实际直播时长 */
      real_duration: liveDisplay?.value.real_duration,

      business_type: liveDisplay?.value.business_type ?? 0,
    });

    const NoDisplayInfoData = ref(false);

    const DisplayDataImageUrl = ref('');
    const DisplayTimeImageUrl = ref('');

    const reloadDisplayData = () => {
      DisplayDataImageUrl.value =
        DisplayInfo.value?.data_screenshot + `?Authorization=${getToken()}`;
      DisplayTimeImageUrl.value =
        DisplayInfo.value?.duration_screenshot + `?Authorization=${getToken()}`;

      NoDisplayInfoData.value =
        !DisplayInfo.value.live_url &&
        !DisplayInfo.value.real_duration &&
        !DisplayInfo.value.duration_screenshot &&
        !DisplayInfo.value.data_screenshot &&
        !DisplayInfo.value.real_start_time &&
        !DisplayInfo.value.real_end_time;
    };

    reloadDisplayData();

    /** 关闭弹窗 */
    const onAddDataInputModalClose = async (data: LiveDisplayDetail | undefined) => {
      AddLiveDataInputVisible.value = false;
      if (data) {
        DisplayInfo.value.live_url = data.live_url;
        DisplayInfo.value.real_start_time = data.real_start_time;
        DisplayInfo.value.real_end_time = data.real_end_time;
        DisplayInfo.value.data_screenshot = data.data_screenshot;
        DisplayInfo.value.duration_screenshot = data.duration_screenshot;
        DisplayInfo.value.real_duration = data.real_duration;

        reloadDisplayData();
        ctx.emit('detailPageReload');
      }
    };

    const real_duration_str = computed(() => {
      if (DisplayInfo.value.real_duration) {
        return DisplayInfo.value.real_duration.toString() + '小时';
      } else {
        return '';
      }
    });

    // 直播时间格式化
    const liveTimeFormat = (startTimestamp: number, endTimestamp: number) => {
      if (!startTimestamp || !endTimestamp) {
        return '';
      }
      const startTime = DateTimeFormat(new Date(startTimestamp * 1000), 'YYYY-mm-dd HH:ii');
      const endTime = DateTimeFormat(new Date(endTimestamp * 1000), 'YYYY-mm-dd HH:ii');

      const [startTimePrefix, _] = startTime.split(' ');
      const [endTimePrefix, endTimeSurfix] = endTime.split(' ');

      let newLiveTime = undefined;
      if (startTimePrefix !== endTimePrefix) {
        if (endTimestamp - startTimestamp > 86400) {
          newLiveTime = `${startTime} ~ ${endTime} ${endTimeSurfix}`;
        } else {
          newLiveTime = `${startTime} ~ 次日 ${endTimeSurfix}`;
        }
      } else {
        newLiveTime = `${startTime} ~ ${endTimeSurfix}`;
      }
      return newLiveTime.replace(/-/g, '.');
    };

    const toggleLiveDataInputModalVisible = (visible = false) => {
      AddLiveDataInputVisible.value = visible;
    };

    /** 表单 是否可编辑 */
    const canEditFormData = computed(() => {
      return [LiveDisplayStatus.waitingLive, LiveDisplayStatus.waitingTypeIn].includes(
        liveDisplay?.value.live_status ?? -1,
      );
    });

    return {
      handleDownloadTaobaoLiveStudioData,
      TaobaoLiveLogs,
      Permission,
      canEditFormData,
      NoDisplayInfoData,
      real_duration_str,
      liveTimeFormat,
      DisplayInfo,
      liveDisplay,
      DisplayDataImageUrl,
      DisplayTimeImageUrl,
      AddLiveDataInputVisible,
      toggleLiveDataInputModalVisible,
      onAddDataInputModalClose,
    };
  },
});
