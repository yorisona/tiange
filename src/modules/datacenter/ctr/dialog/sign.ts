/**
 * 变更标记
 */
import { defineComponent, ref, watch } from '@vue/composition-api';
import { PostChangesTips } from '@/services/datacenter';

export default defineComponent({
  props: {
    // 编辑的系统角色对象
    list: {
      type: Array,
      default: () => {
        return [];
      },
    },
    visiableSign: {
      type: Boolean,
      default: false,
    },
    sessionId: {
      type: Number,
      default: 0,
    },
  },
  setup(props, ctx) {
    const saveLoading = ref(false);
    const selectSigns: any = ref([]);
    selectSigns.value = [];
    props.list.map((item: any) => {
      selectSigns.value.push(item);
    });
    const formList = ref<any>([
      {
        label: '硬装',
        value: 1,
      },
      {
        label: '灯光',
        value: 2,
      },
      {
        label: '机位',
        value: 3,
      },
      {
        label: '陈列',
        value: 4,
      },
      {
        label: '贴片',
        value: 5,
      },
      {
        label: '调色',
        value: 6,
      },
    ]);
    // 关闭
    const handleCloseAction = () => {
      ctx.emit('closeAction');
    };
    // 保存标记变更
    const handleSaveAction = async () => {
      const res = await PostChangesTips({
        id: props.sessionId,
        change_tips: selectSigns.value || [],
      });
      if (res.data.success) {
        ctx.root.$message.success(res.data.message);
        ctx.emit('closeAction', true);
      } else {
        ctx.root.$message.error(res.data.message);
      }
    };
    watch(
      () => props.visiableSign,
      () => {
        if (props.visiableSign) {
          selectSigns.value = [];
          props.list.map((item: any) => {
            selectSigns.value.push(item);
          });
        }
      },
    );

    return {
      selectSigns,
      formList,
      saveLoading,
      handleSaveAction,
      handleCloseAction,
    };
  },
});
