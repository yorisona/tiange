import { ref, defineComponent, h } from '@vue/composition-api';
import { Select, FunctionSelect } from '@gm/component/select';
import S from './common.module.less';
import { EFunctionSelectType } from '@gm/component/select/FunctionSelect';
import { useRequest } from '@gm/hooks/ahooks';
import { QueryallowScrapped } from '@/services/fixedAssets';
interface Expense {
  type: '1' | '2'; // 类型；项目，部门
  amount: number | undefined; // 费用金额（元）
  asset_id?: number | undefined; // 资产ID
  confirm_date: string; // 月份
  department_id?: number | undefined; // 部门ID
  expense_type: '1' | '2' | undefined; // 费用类型；1-折旧，2-公摊
  project_id?: number | undefined; // 项目ID
  id?: number | undefined; // ID
  project_name?: string; // 项目名称
}

export default defineComponent({
  setup(props, ctx) {
    const formData = ref<Expense>({
      type: '1',
      asset_id: undefined,
      confirm_date: '',
      expense_type: undefined,
      amount: undefined,
      department_id: undefined,
      project_id: undefined,
      project_name: '',
    });
    const show = (val: any) => {
      console.log(val, 'val');

      if (val?.asset_code) {
        formData.value = {
          ...val,
          type: val.department_id ? '1' : '2',
          confirm_date: `${val.year}-${val.month}`,
          amount: val.amount / 100,
        };
        QueryFixedAssetListReq.runAsync({} as any, {
          asset_code: val.asset_code,
        }).then(res => {
          asset_options.value = res.data.data.data.map((item: any) => {
            return { ...item, label: item.asset_code, value: item.id };
          });
        });
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
    const QueryFixedAssetListReq = useRequest(QueryallowScrapped, {
      manual: true,
    });
    const asset_options = ref<any[]>([]);
    return {
      formData,
      show,
      close,
      formRef,
      onSaveBtnClick,
      QueryFixedAssetListReq,
      asset_options,
    };
  },
  render() {
    return (
      <el-form
        ref="formRef"
        attrs={{ model: this.formData }}
        label-width="55px"
        class={[S.transfer, S['allocation-wrap']]}
      >
        <el-form-item
          label="月份："
          prop="confirm_date"
          rules={[
            {
              required: true,
              message: '请选择月份',
              trigger: 'change',
            },
          ]}
        >
          <el-date-picker
            v-model={this.formData.confirm_date}
            disabled={this.formData.id}
            type="month"
            format="yyyy 年 第 MM 月"
            value-format="yyyy-MM"
            v-auto-placeholder
            size="mini"
            style="width: 100%;"
          />
        </el-form-item>
        <el-form-item
          label="分摊至："
          prop={this.formData.type === '1' ? 'department_id' : 'project_id'}
          rules={[{ required: true, message: '请选择部门或项目', trigger: 'bulr' }]}
        >
          <div class={[S.flexBox]}>
            <Select
              style={{ width: '80px' }}
              class="mgr-8"
              popper-class="el-select-popper-mini"
              v-model={this.formData.type}
              placeholder="请选择"
              disabled={this.formData.id}
              options={[
                { label: '部门', value: '1' },
                { label: '项目', value: '2' },
              ]}
              onChange={() => {
                this.formData.department_id = undefined;
                this.formData.project_id = undefined;
              }}
              clearable={false}
            />
            {this.formData.type === '1' ? (
              <department-select
                // style="--default-height: 40px"
                style={{ flex: 1 }}
                disabled={this.formData.id}
                placeholder="请选择部门"
                queryForm={{ is_contain_goumee: true }}
                checkOnClickNode={true}
                // disabledLevel={2}
                // levelDisabled={(level: number) => level !== 2}
                defaultExpandedKeys={
                  this.formData.department_id ? [this.formData.department_id] : []
                }
                levelHidden={(level: number) => level > 3}
                clearable
                v-model={this.formData.department_id}
              />
            ) : (
              <FunctionSelect
                style="width:100%;flex: 1;"
                size="mini"
                disabled={this.formData.id}
                modeType={EFunctionSelectType.SEARCH_PROFIT_LOSS}
                v-model={this.formData.project_id}
                placeholder="请选择项目"
                clearable={true}
                defaultValue={
                  this.formData.project_id
                    ? [
                        {
                          label: this.formData.project_name,
                          value: this.formData.project_id,
                        },
                      ]
                    : []
                }
              />
            )}
          </div>
        </el-form-item>
        <el-form-item label="资产：">
          <Select
            size="mini"
            disabled={this.formData.id}
            filterable={true}
            remote={true}
            v-model={this.formData.asset_id}
            placeholder="请输入资产编号"
            clearable={false}
            style="width: 100%;"
            remote-method={(val: string) => {
              this.QueryFixedAssetListReq.runAsync({} as any, {
                asset_code: val,
              }).then(res => {
                this.asset_options = res.data.data.data.map((item: any) => {
                  return { ...item, label: item.asset_code, value: item.id };
                });
              });
            }}
            options={this.asset_options || []}
          />
        </el-form-item>
        <el-form-item label="类别：">
          <Select
            style={{ width: '100%' }}
            disabled={this.formData.id}
            popper-class="el-select-popper-mini"
            v-model={this.formData.expense_type}
            placeholder="请选择"
            options={E.fixedassets.AssetExpenseTypeOption}
            clearable={false}
          />
        </el-form-item>
        <el-form-item
          label="金额："
          prop="amount"
          rules={[
            {
              // validator: (rule: any, value: any, callback: any) => {
              //   const threshold = 1; // 设置阈值
              //   if (!value) return callback(new Error('金额必须大于等于1'));
              //   if (parseFloat(value) < threshold) {
              //     callback(new Error('金额必须大于等于1'));
              //   } else {
              //     callback();
              //   }
              // },
              required: true,
              message: '请输入金额且大于等于1',
              trigger: 'blur',
            },
          ]}
        >
          <el-input
            size="mini"
            // v-number-validation={{ decimalPlaces: 2, threshold: 0 }}
            v-only-number={{ precision: 2, min: 0 }}
            v-model={this.formData.amount}
            v-auto-placeholder
          >
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
      </el-form>
    );
  },
});
