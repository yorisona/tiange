import { ref, defineComponent, h } from '@vue/composition-api';
import { FunctionSelect } from '@gm/component/select';
import { EFunctionSelectType } from '@gm/component/select/FunctionSelect';
import { comonColumn } from '@/modules/fixedAssets/use';
import { queryCompanyList } from '@/api/medium';
import { Select } from '@gm/component/select';

export default defineComponent({
  setup(props, ctx) {
    const formData = ref<any>({
      asset_id_list: undefined,
      user_id: undefined,
      company_id: undefined,
    });
    const tableData = ref<any>([]);
    const show = (val: any | any[]) => {
      // formData.value.asset_id = val.id;
      // tableData.value = [val];
      if (Array.isArray(val)) {
        formData.value.asset_id_list = val.map(item => item.id);
        tableData.value = val;
      } else {
        formData.value.asset_id_list = [val.id];
        tableData.value = [val];
      }
    };
    const close = () => {
      ctx.emit('close');
    };
    const formRef = ref<any>(null);
    const onSaveBtnClick = async () => {
      const formValid = await formRef.value.validate();
      if (formValid) {
        ctx.emit('submit', formData.value);
      }
    };
    const companyList = ref<any>([]);
    queryCompanyList({
      platforms: 0,
      areas: 0,
      num: 100,
      page: 1,
      approval_status: 1,
    }).then(res => {
      if (res.data.success) {
        companyList.value = res.data.data.data.map((item: any) => {
          return {
            label: item.name,
            value: item.id,
          };
        });
      }
    });
    return {
      formData,
      show,
      close,
      onSaveBtnClick,
      formRef,
      tableData,
      companyList,
    };
  },
  render() {
    const { formData } = this;
    return (
      <el-form class="form-wrap" ref="formRef" attrs={{ model: formData }}>
        <el-form-item
          style="display:flex"
          label="报修人："
          prop="user_id"
          rules={[{ required: true, message: '请选择报修人', trigger: 'change' }]}
        >
          <FunctionSelect
            size="mini"
            modeType={EFunctionSelectType.FLOWER_NAME}
            v-model={formData.user_id}
            placeholder="请选择报修人"
            otherParams={{ is_contain_goumee: true }}
            ref="projectSelect"
            onChange={(val: any) => {
              console.log(val, 'vvvv');
            }}
          />
        </el-form-item>
        <el-form-item>
          <div class="mgb-6">维修明细：</div>
          <tg-table max-height="300px" border data={this.tableData} columns={comonColumn}>
            <template slot="empty">
              {/* <span>暂无数据</span> */}
              <fragments></fragments>
            </template>
          </tg-table>
        </el-form-item>
        <el-form-item
          style="display:flex"
          label="送修单位："
          // prop="company_id"
          // rules={[{ required: true, message: '请选择送修单位', trigger: 'change' }]}
        >
          <Select
            popper-class="el-select-popper-mini"
            style={{ width: '268px' }}
            v-model={this.formData.company_id}
            v-auto-placeholder
            options={this.companyList}
            clearable={false}
            filterable={true}
            remote={true}
            remote-method={(val: string) => {
              queryCompanyList({
                name: val,
                approval_status: 1,
              }).then(res => {
                this.companyList = res.data.data.data.map((item: any) => {
                  return {
                    label: item.name,
                    value: item.id,
                  };
                });
              });
            }}
          />
        </el-form-item>
      </el-form>
    );
  },
});
