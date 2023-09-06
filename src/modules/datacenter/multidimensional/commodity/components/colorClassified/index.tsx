import { defineComponent, ref, watchEffect } from '@vue/composition-api';
import { TgTableColumn } from '@/types/vendor/column';
import addColorClassified from '../addColorClassified/index.vue';
import { useDialog } from '@/use/dialog';
import { useRequest } from '@gm/hooks/ahooks';
import { GetUser } from '@/services/system';
import {
  edit_item_color_classify_list,
  query_item_color_classify_list,
} from '@/services/datacenter';
type Col = TgTableColumn<any>;
interface FormData {
  color_classified_id?: number;
}
export default defineComponent({
  setup: (props, ctx) => {
    const initFormData = (): FormData => ({
      color_classified_id: undefined,
    });
    const formData = ref<FormData>(initFormData());
    const reqColorCategoryList = useRequest(GetUser);
    const reqColorClassifiedList = useRequest(query_item_color_classify_list);
    const reqSave = useRequest(edit_item_color_classify_list, { manual: true });
    const tableDataList = ref();
    const methods = {
      async onSaveBtnClick() {
        // const res = await reqSave.runAsync({});
        // if (res.data.success) {
        //   ctx.emit('close');
        //   ctx.emit('submit');
        // }
      },
    };
    const columns = ref<Col[]>([
      {
        label: '颜色',
        width: 209,
        align: 'center',
        prop: 'template_name',
        showOverflowTooltip: true,
      },
      {
        label: '颜色分类',
        width: 209,
        align: 'center',
        formatter: (row, column, value, index) => {
          const user = tableDataList.value[index];
          return (
            <el-select
              size="mini"
              style="width: 100%"
              filterable
              loading={reqColorCategoryList.loading}
              value={user.category_leaf_id}
              onChange={(val: number) => {
                user.category_leaf_id = val;
              }}
            >
              {(reqColorCategoryList.data?.data || []).map(el => (
                <el-option label={el.username} value={el.id} key={el.id}></el-option>
              ))}
            </el-select>
          );
        },
      },
    ]);
    const dialogAddColorClassified = useDialog({
      component: addColorClassified,
      title: '增加分类',
      width: 455,
      class: 'tg-color-classified-dialog-custom',
      on: {
        submit() {
          reqColorCategoryList.runAsync({});
          reqColorClassifiedList.runAsync();
        },
      },
    });

    watchEffect(() => {
      const data = reqColorClassifiedList.data || [];
      // const { color_classified_id } = formData.value;
      // tableDataList.value = color_classified_id
      //   ? data.filter(el => el.id === color_classified_id)
      //   : data;
      tableDataList.value = data;
    });

    return {
      formData,
      columns,
      reqColorCategoryList,
      reqColorClassifiedList,
      tableDataList,
      dialogAddColorClassified,
      reqSave,
      ...methods,
    };
  },
  render() {
    const { reqColorCategoryList, reqColorClassifiedList, tableDataList, reqSave } = this;
    const { formData, columns } = this;
    return (
      <div class="tg-color-classified-page-container">
        <section class="query-field">
          <div>
            <span>颜色分类：</span>
            <el-select
              size="mini"
              style="width: 275px"
              filterable
              clearable
              loading={reqColorCategoryList.loading}
              v-model={formData.color_classified_id}
            >
              {(reqColorCategoryList.data?.data || []).map(el => (
                <el-option label={el.username} value={el.id} key={el.id}></el-option>
              ))}
            </el-select>
          </div>
          <tg-button
            on-click={() => {
              this.dialogAddColorClassified.show();
            }}
          >
            增加分类
          </tg-button>
        </section>
        <section class="table-field">
          <tg-table
            v-loading={reqColorClassifiedList.loading}
            border
            height="100%"
            data={tableDataList}
            columns={columns}
          ></tg-table>
        </section>
        <tg-mask-loading visible={reqSave.loading} content="正在保存，请稍候..." />
      </div>
    );
  },
});
