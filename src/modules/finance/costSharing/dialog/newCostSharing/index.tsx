import { defineComponent, ref, computed } from '@vue/composition-api';
import { ElForm } from 'element-ui/types/form';
import InputLimit from '@/utils/inputLimit';
import { useRequest } from '@gm/hooks/ahooks';
import { AddSettlementAllocated, ImprotedEmployeeNumMonth } from '@/services/finance';
import moment from 'moment';
import { Select } from '@gm/component';
import { GetAuthQueryUser } from '@/services/supplier';
import { usePermission } from '@/use/permission';
import { useUserInfo } from '@/use/vuex';
import { debounce } from '@/utils/func';

interface FormData {
  allocated_time?: string;
  expense_type_biz_code?: number;
  allocated_amount?: string;
  add_by?: number;
}
export default defineComponent({
  setup(props, ctx) {
    const initFormData = (): FormData => {
      return {
        allocated_time: undefined,
        expense_type_biz_code: undefined,
        allocated_amount: undefined,
        add_by: undefined,
      };
    };
    const userInfo = useUserInfo();
    const permission = usePermission();
    const formRef = ref<ElForm>();
    const formRules = ref({
      allocated_time: [{ required: true, message: '请选择日期', trigger: 'change' }],
      expense_type_biz_code: [{ required: true, message: '请选择类别', trigger: 'change' }],
      allocated_amount: [{ required: true, message: '请输入金额', trigger: 'blur' }],
      add_by: [{ required: true, message: '请选择人员', trigger: 'change' }],
    });
    const formData = ref({
      ...initFormData(),
      add_by: userInfo.value?.id,
    });
    const saveReq = useRequest(AddSettlementAllocated, {
      manual: true,
      onSuccess: () => {
        ctx.emit('close');
        ctx.emit('submit');
      },
    });
    const importedMonthReq = useRequest(ImprotedEmployeeNumMonth, { manual: true });
    const userList = ref<any[]>([
      {
        label: userInfo.value?.username,
        value: userInfo.value?.id,
      },
    ]);
    const methods = {
      show() {},
      onSaveBtnClick() {
        formRef.value?.validate(valid => {
          const { allocated_amount, allocated_time, expense_type_biz_code, add_by } =
            formData.value;
          if (valid) {
            saveReq.runAsync({
              allocated_amount,
              allocated_time,
              expense_type_biz_code,
              add_by,
            });
          }
        });
      },
      async queryUserList(keyword: string | undefined) {
        const res = await GetAuthQueryUser({
          search_type: 2,
          search_value: keyword,
          page_num: 1,
          num: 1000,
        });
        if (res?.data) {
          userList.value =
            (res?.data as any)?.map((el: any) => {
              return {
                label: el.username,
                value: el.id,
              };
            }) || [];
        }
      },
    };
    const debounceQueryUserList = debounce(methods.queryUserList, 200);
    const pickerOptions = computed(() => ({
      disabledDate(time: Date) {
        const timeMoment = moment(time);
        if (formData.value.expense_type_biz_code === E.finance.NewCostSharingType.PROPERTY_FEE) {
          return !timeMoment.isSameOrBefore(moment(), 'month');
        }
        if (importedMonthReq.data) {
          const finder = importedMonthReq.data?.find((el: any) => {
            return moment(el.allocated_month).isSame(timeMoment, 'month');
          });
          return finder ? false : true;
        }
        return true;
      },
    }));
    return {
      saveReq,
      formRef,
      formRules,
      formData,
      pickerOptions,
      importedMonthReq,
      userList,
      permission,
      debounceQueryUserList,
      ...methods,
    };
  },
  render() {
    return (
      <div class="tg-new-cost-sharing-container">
        <el-form
          size="mini"
          rules={this.formRules}
          label-width="44px"
          ref="formRef"
          props={{ model: this.formData }}
        >
          <el-form-item label="类别：" prop="expense_type_biz_code">
            <el-select
              placeholder="请选择"
              v-model={this.formData.expense_type_biz_code}
              on-change={(val: any) => {
                // this.importedMonthReq.params = [
                //   {
                //     expense_type_biz_code: this.formData.expense_type_biz_code || undefined,
                //   },
                // ];
                this.formData.allocated_time = undefined;
                if (val === E.finance.NewCostSharingType.PROPERTY_FEE) return;
                this.importedMonthReq.runAsync(
                  val === E.finance.NewCostSharingType.DECORATION_FEE ? 'rent' : 'all',
                  {
                    expense_type_biz_code: val || undefined,
                  },
                );
              }}
              style="width: 100%"
            >
              {E.finance.NewCostSharingTypeOption.filter((el, idx) => idx < 7).map(el => (
                <el-option label={el.label} value={el.value} key={el.value}></el-option>
              ))}
            </el-select>
          </el-form-item>
          <el-form-item label="日期：" prop="allocated_time">
            <el-date-picker
              type="month"
              editable={false}
              v-model={this.formData.allocated_time}
              placeholder="请选择"
              format="yyyy.MM"
              value-format="yyyy-MM"
              style="width: 100%"
              picker-options={this.pickerOptions}
            />
          </el-form-item>

          <el-form-item label="金额：" prop="allocated_amount">
            <el-input
              placeholder="请输入"
              v-model={this.formData.allocated_amount}
              style="width: 100%"
              onInput={(val: any) => {
                this.formData.allocated_amount = InputLimit.EightIntergerAndDecimals(val);
              }}
            >
              <fragments slot="append">元</fragments>
            </el-input>
          </el-form-item>
          <el-form-item label="人员：" prop="add_by">
            {/*<el-input*/}
            {/*  v-key-enter={this.reload}*/}
            {/*  clearable*/}
            {/*  placeholder="请输入述职人花名"*/}
            {/*  v-model={this.formData.user_name}*/}
            {/*/>*/}
            <Select
              style="width: 100%"
              disabled={!this.permission.cost_share_modify_operator}
              options={this.userList}
              v-model={this.formData.add_by}
              filterable
              remote
              remote-method={this.debounceQueryUserList}
              placeholder="请选择人员"
              // remote-method={(name: string) => this.groupOptions.pagination.reQuery({ name })}
            />
          </el-form-item>
        </el-form>
        <div class="tips">
          <div class="label">说明：</div>
          <div>
            <div>1、物业费请在导入当月房租后录入；</div>
            <div>2、按人数自动分摊的成本，请在导入人力成本后录入；</div>
          </div>
        </div>
        <tg-mask-loading visible={this.saveReq.loading} content="  正在保存，请稍候..." />
      </div>
    );
  },
});
