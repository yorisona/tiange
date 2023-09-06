/*
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2022-07-18 11:10:29
 */
import FormValidation from '@/modules/supplier/playerManager/common/FormValidation';
import { GetOurBankAccounts, ParseBankExcelData } from '@/services/finance';
import { AccountType, BankAccount } from '@/types/tiange/finance/finance';
import { defineComponent, onMounted, ref, computed } from '@vue/composition-api';
import { ElForm } from 'element-ui/types/form';
import { ElUpload } from 'element-ui/types/upload';

export interface IncomeDetailImportType {
  show: () => void;
}

export default defineComponent({
  name: 'projectFundStatement',
  setup(props, ctx) {
    const initForm = (): {
      account: number | undefined;
      detailFile: any[];
    } => {
      return {
        account: undefined,
        detailFile: [],
      };
    };
    const visible = ref(false);
    const saveLoading = ref(false);
    const bankTemplateList = ref<BankAccount[]>([]);
    const incomeDetailForm = ref(initForm());

    const fileList = ref<string[]>([]);
    const elFormRef = ref<ElForm | undefined>(undefined);
    const eluploadRef = ref<ElUpload | undefined>(undefined);

    const refMethods: IncomeDetailImportType = {
      show() {
        visible.value = true;
      },
    };

    const methods = {
      onCloseHandler() {
        visible.value = false;
        setTimeout(() => {
          incomeDetailForm.value = initForm();
          fileList.value = [];
          elFormRef.value?.clearValidate();
        }, 500);
      },
      onSubmitHandler() {
        elFormRef.value?.validate(valid => {
          if (valid) {
            methods.parseBankExcelData();
          }
        });
      },
      async bankTemplate() {
        const res = await GetOurBankAccounts({
          is_show: 1,
          bank_type: AccountType.bank,
          status: 0,
        });
        if (res.data.success) {
          bankTemplateList.value = res.data.data ?? [];
        }
      },
      async parseBankExcelData() {
        if (fileList.value.length <= 0) {
          ctx.root.$message.warning('请先上传银行流水文件');
          return;
        }
        const form = new FormData();
        form.append('file', incomeDetailForm.value.detailFile[0].raw);
        form.append('kind', `${incomeDetailForm.value.account}`);
        saveLoading.value = true;
        const res = await ParseBankExcelData(form);
        saveLoading.value = false;
        if (res.data.success) {
          ctx.root.$message.success(res.data.message);
          ctx.emit('save');
          methods.onCloseHandler();
        } else {
          ctx.root.$message.error(res.data.message);
        }
      },
    };
    onMounted(() => {
      methods.bankTemplate();
    });

    const template_list = computed(() => {
      if (incomeDetailForm.value.account !== undefined && incomeDetailForm.value.account !== null) {
        const finder = bankTemplateList.value.find(el => el.id === incomeDetailForm.value.account);
        return finder?.template_name ? [finder] : [];
      }
      return bankTemplateList.value.filter(
        (el, index, self) =>
          el.template_name &&
          self.findIndex(subEL => subEL.template_name === el.template_name) === index,
      );
    });

    return {
      elFormRef,
      eluploadRef,
      saveLoading,
      incomeDetailForm,
      bankTemplateList,
      template_list,
      visible,
      fileList,
      ...refMethods,
      ...methods,
    };
  },
  render() {
    return (
      <div>
        <el-dialog
          title="流水导入"
          class="tg-dialog-classic tg-dialog-vcenter-new tg-income-detail-import-container"
          width="420px"
          visible={this.visible}
          close-on-click-modal={false}
          close-on-press-escape={false}
          onClose={this.onCloseHandler}
        >
          <el-form
            ref="elFormRef"
            props={{ model: this.incomeDetailForm }}
            size="mini"
            label-width="80px"
          >
            <el-form-item
              label="对公账户："
              prop="account"
              rules={[{ required: true, message: '请选择对公账户', trigger: ['change'] }]}
            >
              <el-select
                popper-class="el-select-popper-mini"
                style="width: 278px;"
                v-model={this.incomeDetailForm.account}
                placeholder="请选择"
              >
                {this.bankTemplateList.map(el => (
                  <el-option label={el.bank_name} value={el.id} key={el.id}></el-option>
                ))}
              </el-select>
            </el-form-item>
            <el-form-item label="银行流水：">
              <div>
                <tg-upload
                  // data={{kind: this.incomeDetailForm.account}}
                  disabled={this.fileList.length > 0}
                  show-file-list={false}
                  auto-upload={false}
                  // action="/api/settlement/parse_bank_excel_data"
                  // style="margin-bottom:16px"
                  // beforeUpload={FormValidation.ValidationFileUpload({ excel: true, fileSize: 30 })}
                  // success={(res: any) => {
                  //   if (!res.success) {
                  //     Message.error(res.message);
                  //     return;
                  //   }
                  //   Message.success(res.message);
                  // }}
                  {...{
                    ref: 'eluploadRef',
                    attrs: {
                      'on-change': (file: any, fileList: any) => {
                        const result = FormValidation.ValidationFileUpload({
                          excel: true,
                          fileSize: 30,
                        })(file.raw);
                        if (result) {
                          this.incomeDetailForm.detailFile = file ? [file] : [];
                          // host部分仅仅作为文件列表显示用
                          this.fileList = file.name ? [`https://www.goumee.com/${file.name}`] : [];
                        }
                      },
                    },
                  }}
                  http-request={this.parseBankExcelData}
                >
                  <tg-button disabled={this.fileList.length > 0} icon="ico-upload-lite">
                    上传
                  </tg-button>
                </tg-upload>
                <upload-file-list v-model={this.fileList} />
              </div>
            </el-form-item>
            <el-form-item label="模板下载：">
              <div style="margin-top: 3px">
                {this.template_list.map((el, elIdx) => (
                  <tg-button
                    class={elIdx < this.template_list.length - 1 ? 'mgr-12' : ''}
                    type="link"
                    download
                    href={el.template_path}
                  >
                    {el.template_name}
                  </tg-button>
                ))}
              </div>
            </el-form-item>
          </el-form>
          <template slot="footer">
            <tg-button type="primary" onClick={this.onSubmitHandler}>
              提交
            </tg-button>
            <tg-button onClick={this.onCloseHandler}>取消</tg-button>
          </template>
        </el-dialog>
        <tg-mask-loading visible={this.saveLoading} content="正在保存，请稍候..." />
      </div>
    );
  },
});
