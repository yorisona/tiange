import { computed, defineComponent, inject, Ref, ref } from '@vue/composition-api';
import addDialog from './dialog/index.vue';
import { AsyncConfirm } from '@/use/asyncConfirm';
import { GetPerfromanceComments, DeletePerfromanceComment } from '@/services/datacenter/shoplive';
import { ITabProps } from '@/modules/datacenter/commodityAnalysis/types';
import { usePermission } from '@/use/permission';
import { useProjectBaseInfo } from '@/modules/settlement/use/project';
export default defineComponent({
  name: 'commentaryIndex',
  props: {
    performanceId: {
      type: Number,
      default: 0,
    },
    projectData: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {
    addDialog,
  },
  setup(props, ctx) {
    const permission = usePermission();
    const searchParams = (inject<Ref<ITabProps>>('searchParams') as Ref<ITabProps>) || ref({});
    const is_from_project = computed(() => {
      return props.performanceId === 0
        ? searchParams.value.is_from_project || false
        : props.projectData.from_project || false;
    });
    const list = ref<any[]>([]);
    const dialogVisiable = ref(false);
    const onAddClick = () => {
      dialogVisiable.value = true;
    };
    const closeAction = (isrefresh = false) => {
      dialogVisiable.value = false;
      if (isrefresh) {
        ctx.emit('upDataProjectDeatil');
        getList();
      }
    };
    const deleteClick = async (row: any) => {
      const result = await AsyncConfirm(ctx, '是否确认删除【这条批注数据】吗？');
      if (!result) {
        return;
      }
      DeletePerfromanceComment({
        comment_id: row.id,
      }).then(({ data }) => {
        if (data.success) {
          getList();
          ctx.emit('upDataProjectDeatil');
        } else {
          ctx.root.$message.error(data.message || '数据删除失败');
        }
      });
    };
    const daytrendLoading = ref(false);
    const { business_type } = useProjectBaseInfo();
    const getList = () => {
      daytrendLoading.value = true;
      GetPerfromanceComments(
        {
          is_from_project: is_from_project,
          shop_live_id: props.performanceId === 0 ? undefined : props.performanceId,
        },
        business_type.value,
      ).then(({ data }) => {
        daytrendLoading.value = false;
        if (data.success) {
          list.value = data.data.comments || [];
        } else {
          list.value = [];
          ctx.root.$message.error(data.message || '数据获取失败');
        }
      });
    };
    getList();
    return {
      is_from_project,
      permission,
      list,
      daytrendLoading,
      getList,
      deleteClick,
      onAddClick,
      closeAction,
      dialogVisiable,
    };
  },
});
