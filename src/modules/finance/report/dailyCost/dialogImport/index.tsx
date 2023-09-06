import {
  defineComponent,
  ref,
  reactive,
  toRefs,
  toRef,
  computed,
  watch,
} from '@vue/composition-api';
import { MaycurListExpenseTypes } from '@/services/maycur';
import { usePagination, useRequest } from '@gm/hooks/ahooks';
import { GetFeishuDepartmentList } from '@/services/live';
import singleTrees from '@/components/system-set/trees/singleTrees.vue';
import {
  FinancialAddManuallyPayInfo,
  FinancialFinancialQueryAllProject,
  GetOurBankAccounts,
} from '@/services/finance';
import { ElForm } from 'element-ui/types/form';
import moment from 'moment';
import { Message } from 'element-ui';
import FormValidation from '@/modules/supplier/playerManager/common/FormValidation';
import limit from '@/utils/inputLimit';
const useArtificial = () => {
  const formData = reactive({
    settled_at: '',
    expense_type_biz_code: '',
    department_biz_code: '',
    project_uid: '',
    reimburse_name: '',
    payer_bank_account_id: '',
    approved_amount: '',
    has_invoice: undefined,
    tax_rate: '',
    tax_amount: '',
    tax_excluded_amount: '',
    comment: '',
    receiver_bank_account_name: '',
  });

  watch(
    () => [formData.approved_amount, formData.has_invoice, formData.tax_rate],
    () => {
      if (formData.has_invoice === 1) {
        let tax_amount: any = Number(formData.approved_amount) * (Number(formData.tax_rate) / 100);
        if (isNaN(tax_amount)) tax_amount = '';
        else {
          formData.tax_amount = Number(tax_amount).toFixed(2);
          formData.tax_excluded_amount = (Number(formData.approved_amount) - tax_amount) as any;
        }
      } else {
        formData.tax_rate = '';
        formData.tax_amount = '';
        formData.tax_excluded_amount = '';
      }
    },
  );

  // 支出类别
  const reqExpenseType = usePagination(MaycurListExpenseTypes, {
    defaultPageSize: 10000,
  });
  // 部门
  const reqBizCode = useRequest(GetFeishuDepartmentList);
  // 转出路径
  const reqBankAccounts = useRequest(GetOurBankAccounts);
  // 搜索所有项目
  const reqQueryAllProject = usePagination(FinancialFinancialQueryAllProject, {
    manual: true,
  });

  // 手动录入提交
  const reqFinancial = useRequest(FinancialAddManuallyPayInfo, { manual: true });

  const search_project = (project_name: string) => {
    reqQueryAllProject.run({ page_num: 1, num: 20 }, { project_name });
  };

  const submit = () => {
    const _data = { ...formData };
    _data.settled_at = moment(_data.settled_at).format('YYYY-MM-DD');
    if (_data.has_invoice !== 1) {
      _data.tax_excluded_amount = _data.approved_amount;
      _data.tax_amount = '0';
    }
    if (_data.project_uid === '-1') {
      _data.project_uid = undefined as any;
    }
    if (_data.department_biz_code === '-1') {
      _data.department_biz_code = undefined as any;
    }
    return reqFinancial.runAsync(_data as any);
  };

  return reactive({
    ...toRefs(formData),
    expense_type_biz_code_options: toRef(reqExpenseType, 'data'),
    department_biz_code_options: computed(() => {
      return [{ department_id: '-1', name: '构美(公共)' }, ...(reqBizCode.data?.data || [])];
    }),
    payer_bank_account_id_options: toRef(reqBankAccounts, 'data'),
    project_uid_options: computed(() => {
      return [{ project_uid: '-1', project_name: '无' }, ...(reqQueryAllProject.data || [])];
    }),
    search_project,
    submit,
  });
};

const renderOptions = (options: any = [], label: string, value: string) => {
  return options.map((item: any, key: number) => {
    return <el-option key={key} label={item[label]} value={item[value]} />;
  });
};

export default defineComponent({
  components: {
    singleTrees,
  },
  setup(_, ctx) {
    const formRef = ref<ElForm | null>(null);
    const tabs = ref([
      { label: '批量导入', value: '1' },
      { label: '手动录入', value: '2' },
    ]);
    const checkTab = ref('1');
    const artForm = useArtificial();
    const treeRef = ref();
    const departmentForm = reactive({
      input: '',
      show: false,
    });
    const file = ref<string[]>([]);
    const dialogSubmit = () => {
      if (checkTab.value === '2') {
        formRef.value?.validate(async valid => {
          if (!valid) return;
          await artForm.submit();
          Message.success('手动录入成功');
          ctx.emit('close');
          ctx.emit('submit');
        });
      } else {
        if (file.value.length === 0) {
          Message.warning('请选择excel文件');
          return;
        }
      }
    };
    return {
      tabs,
      checkTab,
      artForm,
      formRef,
      dialogSubmit,
      treeRef,
      departmentForm,
      file,
    };
  },
  render() {
    const artForm = this.artForm;
    return (
      <div class="dialog-import">
        <tg-tabs
          tabs={this.tabs}
          v-model={this.checkTab}
          onChange={(value: any) => {
            this.$emit('updateDialog', { footer: value.value === '2' });
            console.log('change', value);
          }}
        />
        <div class="content">
          {this.checkTab === '1' && (
            <div class="batch">
              <div class="side">
                <span class="asterisk">*</span>导入数据：
              </div>
              <div class="file-list">
                <tg-upload
                  show-file-list={false}
                  action="/api/financial/import_pay_info"
                  style="margin-bottom:16px"
                  beforeUpload={FormValidation.ValidationFileUpload({ excel: true, fileSize: 5 })}
                  success={(res: any) => {
                    if (!res.success) {
                      Message.error(res.message);
                      return;
                    }
                    Message.success('批量导入成功');
                    this.$emit('close');
                  }}
                >
                  <tg-button icon="ico-upload-lite">上传文件</tg-button>
                </tg-upload>
                <upload-file-list v-model={this.file} />
                <a
                  class="download"
                  target="_blank"
                  href="https://tiange-oss.oss-cn-hangzhou.aliyuncs.com/upload_template/%E5%85%B6%E5%AE%83%E8%B4%B9%E7%94%A8%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.xlsx"
                  download
                >
                  下载模板
                </a>
              </div>
            </div>
          )}
          {this.checkTab === '2' && (
            <div class="artificial">
              <el-form
                ref="formRef"
                label-width="70px"
                label-position="top"
                size="mini"
                attrs={{
                  model: artForm,
                }}
              >
                <div class="artificial-item">
                  <el-form-item
                    label="支出日期"
                    prop="settled_at"
                    rules={{ required: true, message: '请选择日期', trigger: ['blur'] }}
                  >
                    <el-date-picker
                      style="width:100%"
                      placeholder="选择日期"
                      v-model={artForm.settled_at}
                    />
                  </el-form-item>
                  <el-form-item
                    label="费用类别"
                    prop="expense_type_biz_code"
                    rules={{ required: true, message: '请选择费用类别', trigger: ['blur'] }}
                  >
                    <el-select
                      style="width:100%"
                      placeholder="请选择"
                      v-model={artForm.expense_type_biz_code}
                      filterable
                    >
                      {renderOptions(
                        artForm.expense_type_biz_code_options,
                        'expense_type_name',
                        'expense_type_biz_code',
                      )}
                    </el-select>
                  </el-form-item>
                  <el-form-item
                    label="归属部门"
                    prop="department_biz_code"
                    rules={{ required: true, message: '请选择归属部门', trigger: 'change' }}
                  >
                    <el-popover
                      placement="bottom-start"
                      trigger="click"
                      popper-class="popper-class"
                      v-model={this.departmentForm.show}
                    >
                      <el-input
                        placeholder="请选择"
                        readonly
                        slot="reference"
                        value={this.departmentForm.input}
                      >
                        <template slot="suffix">
                          <i class="select-icon select-icon-user-add el-icon-arrow-down" />
                        </template>
                      </el-input>
                      <el-tree
                        show-checkbox={true}
                        check-strictly={true}
                        node-key="department_id"
                        data={artForm.department_biz_code_options}
                        ref="treeRef"
                        onCheck={(value: any) => {
                          this.treeRef.setCheckedKeys([]);
                          this.treeRef.setCheckedKeys([value.department_id]);
                          artForm.department_biz_code = value.department_id;
                          this.departmentForm.input = value.name;
                          this.departmentForm.show = false;
                        }}
                        {...{
                          props: {
                            props: {
                              label: 'name',
                              children: 'sons',
                            },
                          },
                        }}
                      />
                    </el-popover>
                    {/*<el-select*/}
                    {/*  style="width:100%"*/}
                    {/*  placeholder="请选择"*/}
                    {/*  v-model={artForm.department_biz_code}*/}
                    {/*>*/}
                    {/*  {renderOptions(artForm.department_biz_code_options, 'name', 'department_id')}*/}
                    {/*</el-select>*/}
                  </el-form-item>
                  <el-form-item
                    label="关联项目"
                    prop="project_uid"
                    rules={{ required: true, message: '请选择关联项目', trigger: ['blur'] }}
                  >
                    <el-select
                      style="width:100%"
                      placeholder="请选择"
                      v-model={artForm.project_uid}
                      filterable
                      remote
                      remote-method={artForm.search_project}
                    >
                      {renderOptions(artForm.project_uid_options, 'project_name', 'project_uid')}
                    </el-select>
                  </el-form-item>
                  <el-form-item
                    label="付款事由"
                    prop="reimburse_name"
                    rules={{ required: true, message: '请输入付款事由', trigger: ['blur'] }}
                  >
                    <el-input
                      style="width:100%"
                      placeholder="请输入（限20字）"
                      maxlength={20}
                      v-model={artForm.reimburse_name}
                    />
                  </el-form-item>
                  <el-form-item
                    label="转出路径"
                    prop="payer_bank_account_id"
                    rules={{ required: true, message: '请选择转出路径', trigger: ['blur'] }}
                  >
                    <el-select
                      style="width:100%"
                      placeholder="请选择"
                      v-model={artForm.payer_bank_account_id}
                    >
                      {renderOptions(artForm.payer_bank_account_id_options, 'bank_name', 'id')}
                    </el-select>
                  </el-form-item>

                  <el-form-item label="户名">
                    <el-input
                      style="width:100%"
                      placeholder="请输入"
                      v-model={artForm.receiver_bank_account_name}
                    ></el-input>
                    {/* <el-select
                      style="width:100%"
                      placeholder="请选择"
                      v-model={artForm.payer_bank_account_id}
                    >
                      {renderOptions(artForm.payer_bank_account_id_options, 'bank_name', 'id')}
                    </el-select> */}
                  </el-form-item>

                  <el-form-item
                    label="实付金额"
                    prop="approved_amount"
                    rules={{ required: true, message: '请输入实付金额"', trigger: ['blur'] }}
                  >
                    <el-input
                      style="width:100%"
                      placeholder="请输入"
                      v-model={artForm.approved_amount}
                      onInput={(value: string) =>
                        (artForm.approved_amount = limit.IntergerAndDecimals(value))
                      }
                    >
                      <template slot="append">元</template>
                    </el-input>
                  </el-form-item>
                  <el-form-item
                    label="发票"
                    prop="has_invoice"
                    rules={{ required: true, message: '请选择发票', trigger: ['blur'] }}
                  >
                    <el-select
                      style="width:100%"
                      placeholder="请选择"
                      v-model={artForm.has_invoice}
                    >
                      <el-option label="无" value={0} />
                      <el-option label="有" value={1} />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="税率">
                    <el-input
                      style="width:100%"
                      placeholder="请输入"
                      disabled={artForm.has_invoice !== 1}
                      v-model={artForm.tax_rate}
                      onInput={(value: string) =>
                        (artForm.tax_rate = limit.IntergerAndDecimals(value))
                      }
                    >
                      <template slot="append">%</template>
                    </el-input>
                  </el-form-item>
                  <el-form-item label="税额">
                    <el-input
                      style="width:100%"
                      placeholder="请输入"
                      disabled
                      v-model={artForm.tax_amount}
                      onInput={(value: string) =>
                        (artForm.tax_amount = limit.IntergerAndDecimals(value))
                      }
                    >
                      <template slot="append">元</template>
                    </el-input>
                  </el-form-item>
                  <el-form-item label="不含税金额">
                    <el-input
                      style="width:100%"
                      placeholder="请输入"
                      disabled
                      v-model={artForm.tax_excluded_amount}
                    >
                      <template slot="append">元</template>
                    </el-input>
                  </el-form-item>
                  <el-form-item label="备注">
                    <el-input
                      style="width:100%"
                      placeholder="请输入 (限20字)"
                      maxlength={20}
                      v-model={artForm.comment}
                    />
                  </el-form-item>
                </div>
              </el-form>
            </div>
          )}
        </div>
      </div>
    );
  },
});
