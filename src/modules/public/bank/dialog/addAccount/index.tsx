import { REG_REMOVE_PREFIX_ZERO } from '@/const/regexp';
import FormValidation from '@/modules/supplier/playerManager/common/FormValidation';
import { CreateBankAccount, UpdateBankAccount } from '@/services/public';
import { AccountType, BankAccount } from '@/types/tiange/finance/finance';
import { wait } from '@/utils/func';
import { defineComponent, ref } from '@vue/composition-api';
import Decimal from 'decimal.js';
import { Message } from 'element-ui';
import { ElForm } from 'element-ui/types/form';

export interface AddAccountType {
  show: (account?: BankAccount) => void;
}

export default defineComponent({
  setup(props, ctx) {
    const visible = ref(false);
    const saveLoading = ref(false);
    const isModify = ref(false);
    const initForm = () => {
      return {
        account_number: undefined,
        account_name: undefined,
        bank_type: AccountType.bank,
        bank_detail_name: undefined,
        bank_code: undefined,
        status: 0,
        amount: undefined,
        logoList: [],
        bank_name: undefined,
        id: undefined,
      } as Partial<Omit<BankAccount, 'logo'>> & { logoList: string[] };
    };
    const dataForm = ref(initForm());
    const elFormRef = ref<ElForm | undefined>(undefined);
    const isEdit = ref(false);

    const refMethods: AddAccountType = {
      show(account?: BankAccount) {
        isModify.value = account ? true : false;
        visible.value = true;
        isEdit.value = account ? true : false;
        if (account) {
          const { amount, logo, ...rest } = account;
          const amountNum =
            amount !== undefined && amount !== null && amount !== ''
              ? new Decimal(amount ?? 0).div(new Decimal(100)).toFixed(2)
              : '';
          dataForm.value = { amount: amountNum, logoList: logo ? [logo] : [], ...rest };
        } else {
          dataForm.value = initForm();
        }
      },
    };
    const methods = {
      onCloseHandler() {
        visible.value = false;
        setTimeout(() => {
          dataForm.value = initForm();
          elFormRef.value?.clearValidate();
        }, 500);
      },
      onSubmitHandler() {
        // methods.onCloseHandler();
        elFormRef.value?.validate(isValid => {
          if (isValid) {
            methods.submitAccount();
          }
        });
      },
      onAmountInput(value: string) {
        // isEdited.value = true;
        const result = (/(?:0|[1-9]\d{0,7})(?:\.\d{0,2})?/u.exec(
          value.replace(/[^.\d]+/gu, '').replace(REG_REMOVE_PREFIX_ZERO, ''),
        ) ?? [''])[0];
        dataForm.value.amount = result ? result : undefined;
      },
      async submitAccount() {
        saveLoading.value = true;
        let result = undefined;
        const { amount, logoList, ...rest } = dataForm.value;
        const amountNum = +(amount ?? 0);
        const logo = logoList[0];
        if (isModify.value) {
          const [res] = await wait(500, UpdateBankAccount({ amount: amountNum, logo, ...rest }));
          result = res;
        } else {
          const [res] = await wait(500, CreateBankAccount({ amount: amountNum, logo, ...rest }));
          result = res;
        }
        saveLoading.value = false;
        if (result.data.success) {
          ctx.root.$message.success(result.data.message);
          ctx.emit('save');
          methods.onCloseHandler();
        } else {
          ctx.root.$message.error(result.data.message);
        }
      },
    };
    return {
      isEdit,
      saveLoading,
      elFormRef,
      dataForm,
      visible,
      ...refMethods,
      ...methods,
    };
  },
  render() {
    return (
      <div>
        <el-dialog
          title={this.isEdit ? '编辑账户' : '新增账户'}
          class="tg-dialog-classic tg-dialog-vcenter-new tg-public-add-account-container"
          width="400px"
          visible={this.visible}
          close-on-click-modal={false}
          close-on-press-escape={false}
          onClose={this.onCloseHandler}
        >
          <el-form props={{ model: this.dataForm }} ref="elFormRef" size="mini" label-width="88px">
            <el-form-item
              label="账户名称："
              prop="account_name"
              rules={[{ required: true, message: '请输入账户名称', trigger: 'blur' }]}
            >
              <el-input
                v-model={this.dataForm.account_name}
                on-input={(val: string) => (this.dataForm.account_name = val.trim())}
              ></el-input>
            </el-form-item>
            <el-form-item
              label="账号："
              prop="account_number"
              rules={[{ required: true, message: '请输入账号', trigger: 'blur' }]}
            >
              <el-input
                v-model={this.dataForm.account_number}
                on-input={(val: string) => (this.dataForm.account_number = val.trim())}
              ></el-input>
            </el-form-item>
            <el-form-item
              label="账户别名："
              prop="bank_name"
              rules={[{ required: true, message: '请输入账户别名', trigger: 'blur' }]}
            >
              <el-input
                v-model={this.dataForm.bank_name}
                on-input={(val: string) => (this.dataForm.bank_name = val.trim())}
              ></el-input>
            </el-form-item>
            <el-form-item class="account-item text-item" label="账户类型：">
              <el-radio-group v-model={this.dataForm.bank_type}>
                <el-radio label={AccountType.bank}>银行账户</el-radio>
                <el-radio label={AccountType.zfb}>支付宝</el-radio>
              </el-radio-group>
            </el-form-item>
            {this.dataForm.bank_type === AccountType.bank && (
              <fragments>
                <el-form-item
                  label="开户支行："
                  prop="bank_detail_name"
                  rules={[{ required: true, message: '请输入开户支行', trigger: 'blur' }]}
                >
                  <el-input
                    v-model={this.dataForm.bank_detail_name}
                    on-input={(val: string) => (this.dataForm.bank_detail_name = val.trim())}
                  ></el-input>
                </el-form-item>
                <el-form-item
                  label="联行号："
                  prop="bank_code"
                  rules={[{ required: true, message: '请输入联行号', trigger: 'blur' }]}
                >
                  <el-input
                    v-model={this.dataForm.bank_code}
                    on-input={(val: string) => (this.dataForm.bank_code = val.trim())}
                  ></el-input>
                </el-form-item>
              </fragments>
            )}
            <el-form-item class="account-item text-item" label="账户状态：">
              <el-radio-group v-model={this.dataForm.status}>
                <el-radio label={0}>启用</el-radio>
                <el-radio label={1}>停用</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              label="初始化余额："
              prop="amount"
              rules={[{ required: true, message: '请输入初始化余额', trigger: 'blur' }]}
            >
              <el-input
                value={this.dataForm.amount}
                placeholder="包含可用余额和理财金额"
                on-input={this.onAmountInput}
              ></el-input>
            </el-form-item>
            {this.dataForm.bank_type === AccountType.bank && (
              <el-form-item label="账户LOGO：">
                <div>
                  <tg-upload
                    disabled={this.dataForm.logoList.length > 0}
                    show-file-list={false}
                    action="/api/resources/upload_file"
                    data={{ type: 'photo' }}
                    style="margin-bottom:16px"
                    beforeUpload={FormValidation.ValidationFileUpload({
                      extensions: ['.jpg', '.jpeg', '.png'],
                    })}
                    success={(res: any) => {
                      if (!res.success) {
                        Message.error(res.message);
                        return;
                      }
                      this.dataForm.logoList = res.data.source ? [res.data.source] : [];
                      Message.success(res.message);
                    }}
                  >
                    <tg-button disabled={this.dataForm.logoList.length > 0} icon="ico-upload-lite">
                      上传
                    </tg-button>
                  </tg-upload>
                  {this.dataForm.logoList.length > 0 && (
                    <upload-file-list style="margin-top:-8px" v-model={this.dataForm.logoList} />
                  )}
                  {/* {
                    (this.dataForm.logo?.length ?? 0) > 0 && (
                      <el-image src={this.dataForm.logo}></el-image>
                    )
                  } */}
                </div>
              </el-form-item>
            )}
          </el-form>
          <template slot="footer">
            <tg-button onClick={this.onCloseHandler}>取消</tg-button>
            <tg-button type="primary" onClick={this.onSubmitHandler}>
              保存
            </tg-button>
          </template>
        </el-dialog>
        <tg-mask-loading visible={this.saveLoading} content="正在保存，请稍候..." />
      </div>
    );
  },
});
