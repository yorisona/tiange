/**
 * 场景对比
 */
import { defineComponent, ref, watch } from '@vue/composition-api';
import emptyGoods from '@/assets/img/goods-empty.png';
import moment from 'moment';
import { imgTokenUrl } from '@/utils/string';
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
    const formList = ref<any>(props.list || []);
    // 关闭
    const handleCloseAction = () => {
      ctx.emit('closeAction');
    };
    watch(
      () => props.visiable,
      () => {
        if (props.visiable) {
          formList.value = [];
          props.list.map((item: any) => {
            formList.value.push(item);
          });
        }
      },
    );
    const gettimeStr = (start: number | undefined, end: number | undefined) => {
      if (start && end) {
        const start_date_moment = moment(start * 1000);
        const end_date_moment = moment(end * 1000);
        return (
          start_date_moment.format('yyyy.MM.DD HH:mm:ss') +
          ' ~ ' +
          end_date_moment.format('yyyy.MM.DD HH:mm:ss')
        );
      }
      return '--';
    };
    return {
      imgTokenUrl,
      gettimeStr,
      handleCloseAction,
      formList,
      emptyGoods,
    };
  },
});
