/**
 * 营销业务 - 导入日志 详情 弹窗
 * @author  wuyou <wuyou@goumee.com>
 * @since   2021-04-12 16:53:34
 */
import { ImportLogDetail } from '@/types/tiange/marketing/importlog';
import { computed, defineComponent, h, PropType } from '@vue/composition-api';
import { TableColumn } from '@/types/vendor/column';

export default defineComponent({
  name: 'TgMarketingImportLogDialog',
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    importLogDetail: {
      type: Object as PropType<ImportLogDetail>,
      require: true,
    },
  },
  setup(props, ctx) {
    const onCancelBtnClick = () => {
      ctx.emit('dialog:close');
    };

    const datalist = computed(() => {
      const addItem = props.importLogDetail?.add_item ?? [];
      const updateItem = props.importLogDetail?.update_item ?? [];
      const maxLength = addItem.length > updateItem.length ? addItem.length : updateItem.length;
      const tmplist = [];
      for (let index = 0; index < maxLength; index++) {
        tmplist.push({ added: addItem[index], update: updateItem[index] });
      }

      return tmplist;
    });

    const columns = computed<TableColumn<any>[]>(() => [
      {
        label: '新增信息列表',
        property: 'added',
        align: 'left',
        headerAlign: 'left',
        minWidth: 282,
        formatter: row => {
          if (row.added) {
            return row.added;
          } else {
            return h('span', { style: { color: '#A4B2C2' } }, ['暂无']);
          }
        },
      },
      {
        label: '更新信息列表',
        align: 'left',
        headerAlign: 'left',
        minWidth: 282,
        property: 'update',
        formatter: row => {
          if (row.update) {
            return row.update;
          } else {
            return h('span', { style: { color: '#A4B2C2' } }, ['暂无']);
          }
        },
      },
    ]);

    return { columns, datalist, onCancelBtnClick };
  },
});
