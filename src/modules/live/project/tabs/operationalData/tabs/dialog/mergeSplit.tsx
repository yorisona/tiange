import { defineComponent, h, reactive, ref, watch } from '@vue/composition-api';
import { TgTableColumn } from '@/types/vendor/column';
import moment from 'moment';

export default defineComponent({
  props: {
    data: {
      type: Array,
      default: () => [],
    },
  },
  setup: (props, ctx) => {
    const selectOptions = ref<any[]>([]);
    console.log(props.data, 'props.data');

    const tableData = reactive({
      columns: [
        {
          type: 'selection',
          width: 50,
          align: 'center',
          // 仅有上下数据能勾选,不能跨行勾选
          // selectable: (row: any) => {
          //   if (selectOptions.value.length === 0) {
          //     return true; // 如果没有已勾选行，则所有行都可勾选
          //   } else {
          //     const currentIndex = tableData.data.indexOf(row);
          //     const prevRow = tableData.data[currentIndex - 1];
          //     const nextRow = tableData.data[currentIndex + 1];

          //     // 只有勾选行和其上下行可勾选，其他行禁用
          //     if (
          //       selectOptions.value.includes(row) ||
          //       (prevRow && selectOptions.value.includes(prevRow)) ||
          //       (nextRow && selectOptions.value.includes(nextRow))
          //     ) {
          //       return true;
          //     } else {
          //       return false;
          //     }
          //   }
          // },
        },
        {
          label: '场次时间',
          align: 'left',
          minWidth: 250,
          formatter: (row: any) => {
            return (
              <div class="header-warp">
                <span>{`${moment(row.live_start_time).format('YYYY.MM.DD HH:mm')} ~ ${moment(
                  row.live_end_time,
                ).format('YYYY.MM.DD HH:mm')}`}</span>
                <span class="tag-add" v-show={row.is_multi_live_merge === 1}>
                  合
                </span>
              </div>
            );
          },
        },
        {
          label: '直播账号',
          prop: 'author_id',
          minWidth: 110,
          showOverflowTooltip: true,
        },
        {
          label: '操作',
          // width: 60,
          align: 'center',
          formatter: (row: any) => {
            return (
              <tg-button
                v-show={row.is_multi_live_merge === 1}
                type="link"
                onClick={() => {
                  ctx.emit('split', row);
                }}
              >
                拆分
              </tg-button>
            );
          },
        },
      ] as TgTableColumn<any>,
      data: [] as any[],
    });
    watch(
      () => props.data,
      val => {
        console.log(val, '变化');
        tableData.data = val;
      },
    );
    const show = (val: any) => {
      tableData.data = val;
    };
    const close = () => {
      ctx.emit('close');
    };
    const handleSelectionChange = (rows: any) => {
      // 更新已勾选的行
      selectOptions.value = rows;
    };
    const handleSelectionChangeAll = (rows: any) => {
      selectOptions.value = rows;
    };
    const onSaveBtnClick = () => {
      ctx.emit('submit', selectOptions.value);
    };
    return {
      show,
      close,
      tableData,
      selectOptions,
      handleSelectionChange,
      handleSelectionChangeAll,
      onSaveBtnClick,
    };
  },
  render() {
    return (
      <div class="dialog-wrap">
        <tg-table
          max-height="500"
          border={true}
          columns={this.tableData.columns}
          data={this.tableData.data}
          on-select={this.handleSelectionChange}
          on-select-all={this.handleSelectionChangeAll}
        >
          <div class="tg-page-empty" slot="empty">
            <empty-common img-height="100" img-width="150" />
          </div>
        </tg-table>
      </div>
    );
  },
});
