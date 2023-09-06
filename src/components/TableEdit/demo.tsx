import { defineComponent, h, ref } from '@vue/composition-api';
import EditTable, { ExportData } from '@/components/TableEdit/index';
import EditTableColumn from '@/components/TableEdit/column';

export default defineComponent({
  name: 'TableEditDemo',
  components: {
    EditTable,
    EditTableColumn,
  },
  setup(props, ctx) {
    const tableData = [
      {
        date: '2016-05-03',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
      },
      {
        date: '2016-05-02',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
      },
      {
        date: '2016-05-04',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
      },
      {
        date: '2016-05-01',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
      },
    ];
    const EditTable = ref<ExportData>(null as any);
    return {
      tableData,
      EditTable,
    };
  },
  render() {
    // const validator = (rule: any, value: any, callback: any) => {
    //   // @ts-ignore
    //   console.log(value, 'rule, value, callback');
    //   callback(new Error('请选择业务平台'));
    //   // callback();
    // };
    return (
      <fragments>
        <EditTable stripe border ref="EditTable" class="edit-table" data-source={this.tableData}>
          <edit-table-column
            prop="date"
            label="时间"
            scopedSlots={{
              default: ({ row }: any) => {
                return (
                  <el-input
                    size="mini"
                    onInput={() => {
                      row.name = '123';
                    }}
                    v-model={row.date}
                  />
                );
              },
            }}
          ></edit-table-column>
          <edit-table-column
            prop="name"
            label="姓名"
            rules={[{ required: true, message: '请输入姓名', trigger: 'blur' }]}
            scopedSlots={{
              edit: ({ row }: any) => {
                return <el-input v-model={row.name} />;
              },
            }}
          ></edit-table-column>
          <edit-table-column
            prop="address"
            label="地址"
            // rules={[{ validator, trigger: 'blur' }]}
            scopedSlots={{
              edit: ({ row }: any) => {
                return <el-input v-model={row.address} />;
              },
            }}
          ></edit-table-column>
          <edit-table-column
            label="操作"
            scopedSlots={{
              default: ({ actions, $index }: any) => {
                return (
                  <el-button type="primary" onClick={() => actions.startEditable($index)}>
                    操作
                  </el-button>
                );
              },
              edit: ({ actions, $index }: any) => {
                return (
                  <fragments>
                    <el-button
                      type="primary"
                      class="mgr-8"
                      onClick={() => {
                        actions.saveEditable($index);
                        // @ts-ignore
                        console.log(actions.resultData, this.EditTable.formModel, 'actions');
                      }}
                    >
                      保存
                    </el-button>
                    <el-button type="primary" onClick={() => actions.cancelEditable($index)}>
                      取消
                    </el-button>
                  </fragments>
                );
              },
            }}
          ></edit-table-column>
        </EditTable>
        <el-button
          onClick={() => {
            this?.EditTable?.editActions.addRow(
              {
                date: '2016-05-01',
                name: 'Tom',
                address: 'No. 189, Grove St, Los Angeles',
              },
              {
                isEditing: false,
                isToBottom: true,
              },
            );
            console.log(this?.EditTable?.resultData, '2');
            // this?.EditTable?.editActions.cancelEditableAll();
          }}
        >
          新增
        </el-button>
      </fragments>
    );
  },
});
