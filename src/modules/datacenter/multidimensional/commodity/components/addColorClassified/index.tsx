import { defineComponent, nextTick, ref } from '@vue/composition-api';
import { TgTableColumn } from '@/types/vendor/column';
import { useRequest } from '@gm/hooks/ahooks';
import { FD } from '@/utils/formatData';
import { edit_item_color_classify_list } from '@/services/datacenter';
import { ItemColorClassifyModel } from '@/types/tiange/datacenter';
type Col = TgTableColumn<ItemColorClassifyModel>;
type EditItemColorClassifyModel = ItemColorClassifyModel & { editabled?: boolean };
// interface FormData {
// }
export default defineComponent({
  setup: (props, ctx) => {
    const initFormData = () => ({});
    const formData = ref<any>(initFormData());
    // const reqColorCategoryList = useRequest(query_item_color_classify_list);
    const reqSave = useRequest(edit_item_color_classify_list, { manual: true });
    const tableDataList = ref<EditItemColorClassifyModel[]>([]);
    const methods = {
      show(data?: ItemColorClassifyModel[]) {
        tableDataList.value = data || [];
      },
      async onSaveBtnClick() {
        const res = await reqSave.runAsync({
          color_classify_list: tableDataList.value
            .filter(el => el.after_classification_color && el.keyword)
            .map((el: any) => ({
              after_classification_color: el.after_classification_color,
              keyword: el.keyword,
            })),
        });
        if (res.data.success) {
          ctx.emit('close');
          ctx.emit('submit');
        }
      },
      onDelete(index: number) {
        tableDataList.value.splice(index, 1);
      },
      onAdd() {
        tableDataList.value.push({
          keyword: undefined,
          after_classification_color: undefined,
          editabled: true,
        });

        nextTick(() => {
          const el = document.querySelector(
            '.tg-add-color-classified-page-container .el-table__body-wrapper',
          );
          if (el) {
            el.scrollTop = el.scrollHeight;
          }
        });
      },
    };
    const columns = ref<Col[]>([
      {
        label: '关键字',
        width: 179,
        align: 'center',
        showOverflowTooltip: true,
        formatter: (row, column, value, index) => {
          const model = tableDataList.value[index];
          if (model.editabled) {
            return (
              <el-input
                size="mini"
                value={model.keyword}
                placeholder="请输入"
                onInput={(val: string) => {
                  model.keyword = val;
                }}
              ></el-input>
            );
          }
          return FD.formatEmpty(model.keyword);
        },
      },
      {
        label: '颜色分类',
        width: 179,
        align: 'center',
        showOverflowTooltip: true,
        formatter: (row, column, value, index) => {
          const model = tableDataList.value[index];
          if (model.editabled) {
            return (
              <el-input
                size="mini"
                value={model.after_classification_color}
                placeholder="请输入"
                onInput={(val: string) => {
                  model.after_classification_color = val;
                }}
              ></el-input>
            );
          }
          return FD.formatEmpty(model.after_classification_color);
        },
      },
      {
        label: '操作',
        width: 60,
        align: 'center',
        formatter: (row, column, value, index) => {
          return (
            <tg-button type="link" onClick={() => methods.onDelete(index)}>
              删除
            </tg-button>
          );
        },
      },
    ]);
    return { formData, tableDataList, columns, reqSave, ...methods };
  },
  render() {
    const { columns, tableDataList, reqSave } = this;
    return (
      <div class="tg-add-color-classified-page-container">
        <section class="table-field">
          <tg-table border height="100%" data={tableDataList} columns={columns}></tg-table>
        </section>

        <section class="add-field">
          {tableDataList.length > 0 && (
            <tg-button
              type="link"
              icon="ico-common-tianjia-linear"
              onClick={() => {
                this.onAdd();
              }}
            >
              <i class="el-icon-plus"></i>
              {/*<tg-icon name="ico-btn-add"></tg-icon>*/}
              <span>新增</span>
            </tg-button>
          )}
        </section>
        <tg-mask-loading visible={reqSave.loading} content="正在保存，请稍候..." />
      </div>
    );
  },
});
