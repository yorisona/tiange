import moment, { Moment } from 'moment';
/**
 * 班次设置
 */
import { defineComponent, ref, watch } from '@vue/composition-api';
import { AddPerfromanceComment } from '@/services/datacenter/shoplive';

export default defineComponent({
  props: {
    // 编辑的系统角色对象
    performanceId: {
      type: Number,
      default: 0,
    },
    visiable: {
      type: Boolean,
      default: false,
    },
    projectData: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props, ctx) {
    const saveLoading = ref(false);
    const commentaryContent = ref('');
    const dates = ref(['', '']);
    dates.value = [
      props.projectData.start_time ? props.projectData.start_time : '',
      props.projectData.end_time ? props.projectData.end_time : '',
    ];
    const start = moment(dates.value[0]);
    const end = moment(dates.value[1]);

    const disabledDate = (current: Moment) => {
      current = moment(current);
      const dt2 = current.clone().startOf('day');
      if (dt2.valueOf() !== current.valueOf()) {
        return current.isBefore(start) || current.isAfter(end);
      } else {
        return (
          current.isBefore(start.clone().startOf('day')) ||
          current.isAfter(end.clone().endOf('day'))
        );
      }
    };
    // const changeDate = () => {
    // };
    // const selectableRange = () => {
    //   const start = dates.value[0];
    //   const end = dates.value[1];
    //   return [
    //     `${moment(start).format('hh')}:${moment(start).format('mm')}:${moment(start).format(
    //       'ss',
    //     )} - ${moment(end).format('hh')}:${moment(end).format('mm')}:${moment(end).format('ss')}`,
    //   ];
    // };
    // 关闭
    const handleCloseAction = () => {
      ctx.emit('closeAction');
    };
    // 保存
    const daytrendLoading = ref(false);
    const handleSaveAction = () => {
      if (dates.value[0] && dates.value[1] && commentaryContent.value) {
        daytrendLoading.value = true;
        AddPerfromanceComment({
          live_start_time: dates.value[0],
          live_end_time: dates.value[1],
          comment: commentaryContent.value,
          shop_live_id: props.performanceId === 0 ? undefined : props.performanceId,
        }).then(({ data }) => {
          daytrendLoading.value = false;
          if (data.success) {
            ctx.emit('closeAction', true);
            ctx.root.$message.success(data.message || '添加批注成功');
          } else {
            ctx.root.$message.error(data.message || '添加批注失败');
          }
        });
      } else {
        ctx.root.$message.warning('请完善数据！！！');
      }
    };
    watch(
      () => props.visiable,
      () => {
        dates.value = [
          props.projectData.start_time ? props.projectData.start_time : '',
          props.projectData.end_time ? props.projectData.end_time : '',
        ];
        commentaryContent.value = '';
      },
    );
    return {
      disabledDate,
      // selectableRange,
      daytrendLoading,
      dates,
      commentaryContent,
      saveLoading,
      handleSaveAction,
      handleCloseAction,
    };
  },
});
