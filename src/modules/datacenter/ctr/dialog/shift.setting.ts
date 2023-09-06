/**
 * 班次设置
 */
import { defineComponent, ref, watch } from '@vue/composition-api';
import { PostShiftInfo } from '@/services/datacenter';
// import { useRouter } from '@/use/vue-router';

export default defineComponent({
  props: {
    // 编辑的系统角色对象
    list: {
      type: Array,
      default: () => {
        return [];
      },
    },
    visiable: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, ctx) {
    const saveLoading = ref(false);
    const formList = ref<any>([]);
    props.list.map((item: any) => {
      formList.value.push({
        shift_id: item.shift_id || '',
        shift_name: item.shift_name,
        dates: [item.shift_start_time, item.shift_end_time],
      });
    });
    formList.value =
      formList.value.length < 1 ? [{ shift_name: '', dates: ['', ''] }] : formList.value;
    // 关闭
    const handleCloseAction = () => {
      ctx.emit('closeAction');
    };
    // 保存
    const handleSaveAction = async () => {
      const shifts: any = ref([]);
      const isresult = ref(true);
      console.log(props.list);
      formList.value.map((item: any) => {
        if (item.shift_name && item.dates) {
          shifts.value.push({
            shift_id: item.shift_id || undefined,
            shift_name: item.shift_name,
            shift_start_time:
              String(item.dates[0]).length < 3 ? item.dates[0] + ':00:00' : item.dates[0],
            shift_end_time:
              String(item.dates[1]).length < 3 ? item.dates[1] + ':00:00' : item.dates[1],
          });
        } else {
          isresult.value = false;
        }
      });
      if (isresult.value) {
        // const router = useRouter();
        // const project_id = router.currentRoute.params.id;
        const res = await PostShiftInfo({
          // project_id: project_id,
          shifts: shifts.value || [],
        });
        if (res.data.success) {
          ctx.root.$message.success(res.data.message);
          ctx.emit('closeAction', true);
        } else {
          ctx.root.$message.error(res.data.message);
        }
      } else {
        ctx.root.$message.warning('请将班次数据完善完整！！！');
      }
    };
    const AddShiftItem = () => {
      const arr: any = formList.value;
      arr.push({ shift_name: '', dates: ['', ''] });
      formList.value = arr;
    };
    const deleteClick = (index: number) => {
      const arr: any = formList.value;
      arr.splice(index, 1);
      formList.value = arr;
    };
    watch(
      () => props.visiable,
      () => {
        if (props.visiable) {
          formList.value = [];
          props.list.map((item: any) => {
            formList.value.push({
              shift_id: item.shift_id || '',
              shift_name: item.shift_name,
              dates: [item.shift_start_time, item.shift_end_time],
            });
          });
          formList.value =
            formList.value.length < 1 ? [{ shift_name: '', dates: ['', ''] }] : formList.value;
        }
      },
    );
    return {
      deleteClick,
      AddShiftItem,
      formList,
      saveLoading,
      handleSaveAction,
      handleCloseAction,
    };
  },
});
