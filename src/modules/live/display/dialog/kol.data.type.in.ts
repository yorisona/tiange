/*
 * @Brief: 录入主播数据弹框
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2021-01-15 11:39:56
 */

import { defineComponent, ref, SetupContext, PropType, watch } from '@vue/composition-api';
import { KolQuery, LiveScheduleQuery, KolDataSave } from '@/services/live';
import { Kol, KolDataForm, KolSchedule } from '@/types/tiange/live';
import { ElForm } from 'element-ui/types/form';
import moment from 'moment';

export default defineComponent({
  props: {
    liveDisplayID: {
      type: Number,
    },
    visible: {
      type: Boolean,
      default: false,
    },
    typeInKols: {
      type: Array as PropType<KolDataForm[]>,
      default: undefined,
    },
  },
  setup(props, ctx) {
    return { ...typeInDataSetup(props, ctx) };
  },
});

function typeInDataSetup(props: any, ctx: SetupContext) {
  // 保存加载
  const saveLoading = ref<boolean>(false);
  //
  const loading = ref(false);
  const originKolList = ref<Kol[]>([]);
  const kolList = ref<Kol[]>([]);

  const formRef = ref<ElForm | undefined>(undefined);

  const form = ref<{ list: KolDataForm[] }>({
    list: [
      {
        live_start_date: '',
        live_start_time: '',
        live_end_date: '',
        live_end_time: '',
        // live_time: undefined,
        /* 时长 */
        real_duration: undefined,
        /* 主播id */
        kol_id: undefined,
        kol_name: '',
      },
    ],
  });
  // 查询主播排期请求
  const queryKolSchedule = async (id: number) => {
    const { data: response } = await LiveScheduleQuery(id);
    if (response.success) {
      const kolScheduleList = response.data.kol_schedule_list;
      if (kolScheduleList.length) {
        form.value.list = kolScheduleList.map((kol: KolSchedule) => {
          const [startDate, startTime] = kol.start_time ? kol.start_time.split(' ') : ['', ''];
          const [endDate, endTime] = kol.end_time ? kol.end_time.split(' ') : ['', ''];
          return {
            // live_time: [kol.start_time, kol.end_time],
            live_start_date: startDate,
            live_start_time: startTime,
            live_end_date: endDate,
            live_end_time: endTime,
            /* 时长 */
            real_duration: kol.duration,
            /* 主播id */
            kol_id: kol.kol_id,
            kol_name: kol.kol_name,
          };
        });
        queryKolRequest(undefined, true);
      }
    }
  };
  //   保存主播数据请求
  const saveKolDataRequest = async () => {
    const infos = form.value.list.map((item: KolDataForm) => {
      return {
        kol_id: item.kol_id,
        real_duration: item.real_duration,
        real_start_time: `${item.live_start_date} ${item.live_start_time}`,
        real_end_time: `${item.live_end_date} ${item.live_end_time}`,
      };
    });
    for (let index = 0; index < infos.length; index++) {
      const item = infos[index];
      if (!item.kol_id) {
        ctx.root.$message.warning('请输入主播名称');
        return;
      } else if (!item.real_start_time || !item.real_end_time) {
        ctx.root.$message.warning('请选择直播时间');
        return;
      } else if (!item.real_duration) {
        ctx.root.$message.warning('请输入直播时长');
        return;
      } else if (parseInt(`${item.real_duration}`, 10) >= 10000) {
        ctx.root.$message.warning('请输入10000以内的直播时长');
        return;
      }
    }
    const params = {
      shop_live_id: props.liveDisplayID,
      kol_data_infos: infos,
    };

    saveLoading.value = true;
    const { data: response } = await KolDataSave(params);
    saveLoading.value = false;
    if (response.success) {
      ctx.root.$message.success(response.message ?? '录入成功');
      ctx.emit('save');
    } else {
      ctx.root.$message.error(response.message ?? '录入失败');
    }
  };
  // 关闭
  const close = () => {
    ctx.emit('close');
  };
  // 保存
  const save = () => {
    // ctx.refs['formRef'].validate((valid: boolean) => {
    formRef.value?.validate((valid: boolean) => {
      if (valid) {
        saveKolDataRequest();
      }
    });
  };
  // 添加主播
  const addKol = () => {
    form.value.list.push({
      live_start_date: '',
      live_start_time: '',
      live_end_date: '',
      live_end_time: '',
      // live_time: undefined,
      /* 时长 */
      real_duration: undefined,
      /* 主播id */
      kol_id: undefined,
      kol_name: '',
    });
  };
  // 删除主播
  const deleteKol = (index: number) => {
    form.value.list.splice(index, 1);
  };
  // 重置表单
  const resetForm = () => {
    loading.value = false;
    kolList.value = [];
    saveLoading.value = false;
    // formRef.value?.resetFields();
    formRef.value?.clearValidate();
  };
  // 查询主播请求
  const queryKolRequest = async (query?: string, force = false) => {
    if (!query && !force) {
      kolList.value = [];
      return;
    }
    const { data: response } = await KolQuery({ kol_name: query });
    if (response.success) {
      kolList.value = response.data.filter(el => el.kol_id < 0);
      originKolList.value = response.data;
    }
  };
  // 直播时间选择回调-计算直播时长
  const liveTimeChange = (index: number) => {
    const dateForm = form.value.list[index];
    if (dateForm.real_duration) {
      return;
    }
    const { live_start_date, live_start_time, live_end_date, live_end_time } = { ...dateForm };
    if (!live_start_date || !live_start_time || !live_end_date || !live_end_time) {
      return;
    }
    const start = `${live_start_date} ${live_start_time}`;
    const end = `${live_end_date} ${live_end_time}`;
    // const startDate = new Date(start);
    // const endtDate = new Date(end);
    const startDate = moment(start).toDate();
    const endtDate = moment(end).toDate();
    const time = (endtDate.getTime() - startDate.getTime()) / 1000 / 60 / 60;

    if (time > 0) {
      form.value.list[index].real_duration = time;
    }
  };

  const kolValueChanged = (value: string, index: number) => {
    const filter = kolList.value.filter((item: Kol) => {
      return item.kol_name === value;
    });
    if (filter.length > 0) {
      form.value.list[index].kol_id = filter[0].kol_id;
    } else {
      form.value.list[index].kol_id = undefined;
    }
  };

  watch([() => props.visible, () => props.typeInKols], ([newVisiable, newTypeInKols]) => {
    if (newVisiable) {
      resetForm();
      if (newTypeInKols) {
        queryKolRequest(undefined, true);
        form.value.list = [...newTypeInKols];
      } else {
        queryKolSchedule(props.liveDisplayID);
      }
    }
  });

  const durationChange = (value: string | number, index: number) => {
    const item = form.value.list[index];
    let tempValue = `${value}`;
    tempValue = tempValue.replace(/[^\d.]/g, '');
    tempValue = tempValue.replace(/\.{2,}/g, '.');
    tempValue = tempValue.replace(/^\./g, '0.');
    tempValue = tempValue.replace(/^\d*\.\d*\./g, tempValue.substring(0, tempValue.length - 1));
    tempValue = tempValue.replace(/^0[^.]+/g, '0');
    tempValue = tempValue.replace(/^(\d+)\.(\d).*$/, '$1.$2');

    item.real_duration = tempValue;
  };

  return {
    formRef,
    close,
    save,
    saveLoading,
    addKol,
    kolList,
    form,
    queryKolRequest,
    loading,
    deleteKol,
    liveTimeChange,
    durationChange,
    kolValueChanged,
  };
}
