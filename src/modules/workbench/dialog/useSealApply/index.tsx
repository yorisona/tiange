import { REG_REMOVE_PREFIX_ZERO, REG_RMEOVE_NON_DIGITAL } from '@/const/regexp';
import { defineComponent, ref } from '@vue/composition-api';
import { ElForm } from 'element-ui/types/form';
import { GetUser } from '@/services/system';
import { UserInfo } from '@/types/tiange/system';
import {
  UseSealApplyForm,
  UseSealApplyParams,
  UseSealCompanyMap,
  SealTypeMap,
  UseSealMatterMap,
  UseSealBusinessMap,
} from '@/types/tiange/workbench';
import { SaveNotContractUseSeal } from '@/services/workbentch';
import { ValidationFileUpload } from '@/modules/supplier/playerManager/common/FormValidation';
import { deepClone } from '@/utils/tools';
export interface UseSealApplyType {
  show: (info?: UseSealApplyParams) => void;
}

interface Option {
  value: number;
  label: string;
}

export default defineComponent({
  components: {},
  setup(props, ctx) {
    const initFormData = (): UseSealApplyForm => {
      return {
        is_take_out: undefined,
        is_express: undefined,
        cooperation_company_name: undefined,
        company_name_code: undefined,
        seal_type: undefined,
        amount_involved: undefined,
        take_out_dates: undefined,
        matter_type: undefined,
        file_name: undefined,
        file_number: undefined,
        reason: undefined,
        addressee: undefined,
        phone: undefined,
        address: undefined,
        sender: undefined,
        sender_name: undefined,
        approval_id: undefined,
        attachment: [],
        scan: [],
        business_type: undefined,
      };
    };

    const loading = ref<boolean>(false);
    const userQueryLoading = ref<boolean>(false);

    const formData = ref<UseSealApplyForm>(initFormData());
    const visible = ref<boolean>(false);
    const formRef = ref<ElForm | undefined>(undefined);

    const company_list = ref<Option[]>(
      (() => {
        const temp_list: Option[] = [];
        UseSealCompanyMap.forEach((el, key) => {
          temp_list.push({
            value: key,
            label: el,
          });
        });
        return temp_list;
      })(),
    );

    const seal_list = ref<Option[]>(
      (() => {
        const temp_list: Option[] = [];
        SealTypeMap.forEach((el, key) => {
          temp_list.push({
            value: key,
            label: el,
          });
        });
        return temp_list;
      })(),
    );

    const matter_list = ref<Option[]>(
      (() => {
        const temp_list: Option[] = [];
        UseSealMatterMap.forEach((el, key) => {
          temp_list.push({
            value: key,
            label: el,
          });
        });
        return temp_list;
      })(),
    );

    const business_type_list = ref<Option[]>(
      (() => {
        const temp_list: Option[] = [];
        UseSealBusinessMap.forEach((el, key) => {
          temp_list.push({
            value: key,
            label: el,
          });
        });
        return temp_list;
      })(),
    );

    const user_list = ref<UserInfo[]>([]);

    const methods = {
      show(info?: UseSealApplyParams) {
        if (info) {
          const { take_out_start_date, take_out_end_date, ...rest } = deepClone(
            info,
          ) as UseSealApplyParams;
          formData.value = {
            take_out_dates:
              info.is_take_out && take_out_start_date && take_out_end_date
                ? [take_out_start_date * 1000, take_out_end_date * 1000]
                : undefined,
            ...rest,
          };
        }
        visible.value = true;
      },
      onClose() {
        visible.value = false;
        methods.clearValid();
      },
      onSave() {
        formRef.value?.validate(valid => {
          if (valid) {
            methods.saveNotContractUseSeal();
          }
        });
      },
      clearValid() {
        formData.value = initFormData();
        setTimeout(() => {
          formRef.value?.clearValidate();
        }, 300);
      },
      beforeUpload(config: any) {
        return ValidationFileUpload({
          doc: true,
          excel: true,
          pdf: true,
          image: true,
          fileSize: 20,
        })(config);
      },
      attachmentSuccessHandle(res: { data: { source: string } }) {
        formData.value.attachment?.push(res.data.source);
        formRef.value?.validateField('attachment');
      },
      scanSuccessHandle(res: { data: { source: string } }) {
        formData.value.scan?.push(res.data.source);
      },
      onNeedOuterChanged(val: number) {
        formData.value.is_take_out = val;
      },
      onNeedPostChanged(val: number) {
        formData.value.is_express = val;
      },
      onCooCompanyNameChanged(val: string) {
        formData.value.cooperation_company_name = val;
      },
      onCompanyIdChanged(val: number) {
        formData.value.company_name_code = val;
      },
      onSealIdChanged(val: number) {
        formData.value.seal_type = val;
      },
      onAmountChanged(val: string) {
        formData.value.amount_involved = methods.getPositiveNumber(val);
      },
      onMatterIdChanged(val: number) {
        formData.value.matter_type = val;
      },
      onFileNameChanged(val: string) {
        formData.value.file_name = val;
      },
      onFileNumChanged(val: string) {
        formData.value.file_number = methods.getGetDigitalNumber(val);
      },
      onReasonChanged(val: string) {
        formData.value.reason = val;
      },
      onReceiverChanged(val: string) {
        formData.value.addressee = val;
      },
      onConnectWayChanged(val: string) {
        formData.value.phone = val;
      },
      onPostAddrChanged(val: string) {
        formData.value.address = val;
      },
      onApprovalIdChanged(val: number) {
        formData.value.approval_id = val;
      },
      onOuterDatesChanged(val: number[]) {
        formData.value.take_out_dates = val;
      },
      onSenderChanged(val: string) {
        formData.value.sender_name = val;
        const finder = user_list.value.find(el => val === el.username);
        formData.value.sender = finder?.id;
      },
      async queryUser(keyworkd: string | undefined) {
        if (!keyworkd) {
          user_list.value = [];
          return;
        }
        userQueryLoading.value = true;
        const res = await GetUser({
          search_type: 2,
          is_checked: 1,
          search_value: keyworkd,
          num: 1000,
          page_num: 1,
        });
        userQueryLoading.value = false;
        if (res.data.success) {
          user_list.value = res.data.data.data;
        }
      },
      async saveNotContractUseSeal() {
        const { take_out_dates, ...rest } = formData.value;
        const [start, end] = take_out_dates ?? [];
        const paraams: UseSealApplyParams = {
          take_out_start_date: formData.value.is_take_out ? start / 1000 : undefined,
          take_out_end_date: formData.value.is_take_out ? end / 1000 : undefined,
          ...rest,
        };
        loading.value = true;
        const res = await SaveNotContractUseSeal(paraams);
        loading.value = false;
        if (res.data.success) {
          ctx.root.$message.success(res.data.message ?? '保存成功');
          ctx.emit('success');
          methods.onClose();
        } else {
          ctx.root.$message.error(res.data.message ?? '保存失败');
        }
      },
      getGetDigitalNumber(value: string) {
        const reg = /\d+/u;
        const non_digital = /[^\d]+/gu;
        return (reg.exec(value.replace(non_digital, '').replace(REG_REMOVE_PREFIX_ZERO, '')) ?? [
          '',
        ])[0];
      },
      getPositiveNumber(value: string) {
        const reg = /\d{0,8}(?:\.\d{0,2})?|\.\d{0,2}/u;
        return (reg.exec(
          value.replace(REG_RMEOVE_NON_DIGITAL, '').replace(REG_REMOVE_PREFIX_ZERO, ''),
        ) ?? [''])[0];
      },
    };

    return {
      formData,
      visible,
      formRef,
      loading,
      company_list,
      seal_list,
      matter_list,
      userQueryLoading,
      user_list,
      business_type_list,
      ...methods,
    };
  },
  render() {
    const {
      formData,
      seal_list,
      company_list,
      matter_list,
      user_list,
      userQueryLoading,
      business_type_list,
    } = this;
    return (
      <div>
        <el-dialog
          visible={this.visible}
          title="非合同用印申请"
          width="668px"
          close-on-click-modal={false}
          onClose={this.onClose}
          close-on-press-escape={false}
          class="tg-dialog-classic workbench-use-seal-dialog tg-dialog-vcenter-new"
        >
          <div>
            <el-form ref="formRef" size="mini" label-position="top" props={{ model: formData }}>
              <div class="grid-three-column">
                <el-form-item
                  label="合作方公司全称"
                  prop="cooperation_company_name"
                  rules={{ required: true, message: `请输入合作方公司全称`, trigger: 'blur' }}
                >
                  <el-input
                    value={formData.cooperation_company_name}
                    placeholder="请输入"
                    maxlength={256}
                    on-input={this.onCooCompanyNameChanged}
                  ></el-input>
                </el-form-item>
                <el-form-item
                  label="公司名称"
                  prop="company_name_code"
                  rules={{ required: true, message: `请选择公司`, trigger: 'change' }}
                >
                  <el-select
                    popper-class="el-select-popper-mini"
                    value={formData.company_name_code}
                    placeholder="请选择"
                    on-change={this.onCompanyIdChanged}
                  >
                    {company_list.map(el => (
                      <el-option label={el.label} value={el.value} key={el.value}></el-option>
                    ))}
                  </el-select>
                </el-form-item>
                <el-form-item
                  label="印章名称"
                  prop="seal_type"
                  rules={{ required: true, message: `请选择印章`, trigger: 'change' }}
                >
                  <el-select
                    popper-class="el-select-popper-mini"
                    // multiple
                    // collapse-tags
                    value={formData.seal_type}
                    placeholder="请选择"
                    on-change={this.onSealIdChanged}
                  >
                    {seal_list.map(el => (
                      <el-option label={el.label} value={el.value} key={el.value}></el-option>
                    ))}
                  </el-select>
                </el-form-item>
                <el-form-item
                  label="涉及金额"
                  prop="amount_involved"
                  rules={{ required: true, message: `请输入金额`, trigger: 'blur' }}
                >
                  <el-input
                    value={formData.amount_involved}
                    placeholder="请输入"
                    on-input={this.onAmountChanged}
                  ></el-input>
                </el-form-item>
                <el-form-item
                  label="是否需要外带"
                  prop="is_take_out"
                  rules={{ required: true, message: `请选择是否需要外带`, trigger: 'change' }}
                >
                  <el-select
                    popper-class="el-select-popper-mini"
                    placeholder="请选择"
                    value={formData.is_take_out}
                    on-change={this.onNeedOuterChanged}
                  >
                    <el-option label="是" value={1}></el-option>
                    <el-option label="否" value={0}></el-option>
                  </el-select>
                </el-form-item>
                {formData.is_take_out === 1 && (
                  <el-form-item
                    label="外带日期"
                    prop="take_out_dates"
                    rules={{ required: true, message: `请选择外带日期`, trigger: 'change' }}
                  >
                    <el-date-picker
                      v-model={formData.take_out_dates}
                      type="daterange"
                      range-separator="～"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      value-format="timestamp"
                      format="yyyy.MM.dd"
                      editable={false}
                    ></el-date-picker>
                  </el-form-item>
                )}
                <el-form-item
                  label="所属事项"
                  prop="matter_type"
                  rules={{ required: true, message: `请选择所属事项`, trigger: 'change' }}
                >
                  <el-select
                    popper-class="el-select-popper-mini"
                    placeholder="请选择"
                    value={formData.matter_type}
                    on-change={this.onMatterIdChanged}
                  >
                    {matter_list.map(el => {
                      if (el.value !== 3) {
                        return (
                          <el-option label={el.label} value={el.value} key={el.value}></el-option>
                        );
                      }
                    })}
                  </el-select>
                </el-form-item>
                {formData.matter_type === 2 && (
                  <el-form-item
                    label="业务类型"
                    prop="business_type"
                    rules={{ required: true, message: `请选择业务类型`, trigger: 'change' }}
                  >
                    <el-select
                      popper-class="el-select-popper-mini"
                      placeholder="请选择"
                      v-model={formData.business_type}
                    >
                      {business_type_list.map(el => (
                        <el-option label={el.label} value={el.value} key={el.value}></el-option>
                      ))}
                    </el-select>
                  </el-form-item>
                )}
                <el-form-item
                  label="文件名称"
                  prop="file_name"
                  rules={{ required: true, message: `情输入文件名称`, trigger: 'blur' }}
                >
                  <el-input
                    placeholder="请输入"
                    maxlength={256}
                    value={formData.file_name}
                    on-input={this.onFileNameChanged}
                  ></el-input>
                </el-form-item>
                <el-form-item
                  label="盖章文件份数"
                  prop="file_number"
                  rules={{ required: true, message: `请输入盖章文件份数`, trigger: 'blur' }}
                >
                  <el-input
                    placeholder="请输入"
                    maxlength={256}
                    value={formData.file_number}
                    on-input={this.onFileNumChanged}
                  ></el-input>
                </el-form-item>
              </div>
              <div>
                <el-form-item
                  style="margin-right:0px  !important;"
                  label="使用原因说明"
                  prop="reason"
                  rules={{ required: true, message: `请输入使用原因说明`, trigger: 'blur' }}
                >
                  <el-input
                    type="textarea"
                    maxlength={256}
                    placeholder="请输入"
                    value={formData.reason}
                    on-input={this.onReasonChanged}
                  ></el-input>
                </el-form-item>
              </div>
              <div
                class={
                  formData.is_express === 1 ? 'grid-three-area mgt-16' : 'grid-three-column mgt-16'
                }
              >
                <el-form-item
                  label="是否需要邮寄"
                  class={formData.is_express === 1 ? 'grid-one' : ''}
                  prop="is_express"
                  rules={{ required: true, message: `请选择是否需要邮寄`, trigger: 'change' }}
                >
                  <el-select
                    popper-class="el-select-popper-mini"
                    placeholder="请选择"
                    value={formData.is_express}
                    on-change={this.onNeedPostChanged}
                  >
                    <el-option label="是" value={1}></el-option>
                    <el-option label="否" value={0}></el-option>
                  </el-select>
                </el-form-item>
                {formData.is_express === 1 && (
                  <fragments>
                    <el-form-item
                      label="收件人"
                      class="grid-two"
                      prop="addressee"
                      rules={{ required: true, message: `请输入收件人`, trigger: 'blur' }}
                    >
                      <el-input
                        placeholder="请输入"
                        maxlength={256}
                        value={formData.addressee}
                        on-input={this.onReceiverChanged}
                      ></el-input>
                    </el-form-item>
                    <el-form-item
                      label="联系方式"
                      class="grid-three"
                      prop="phone"
                      rules={{ required: true, message: `请输入联系方式`, trigger: 'blur' }}
                    >
                      <el-input
                        placeholder="请输入"
                        maxlength={256}
                        value={formData.phone}
                        on-input={this.onConnectWayChanged}
                      ></el-input>
                    </el-form-item>
                    <el-form-item
                      label="邮寄地址"
                      class="grid-four"
                      prop="address"
                      rules={{ required: true, message: `请输入邮寄地址`, trigger: 'blur' }}
                    >
                      <el-input
                        type="textarea"
                        maxlength={256}
                        placeholder="请输入"
                        value={formData.address}
                        on-input={this.onPostAddrChanged}
                      ></el-input>
                    </el-form-item>
                  </fragments>
                )}
                {formData.is_express === 1 && (
                  <el-form-item
                    label="寄件人/商务处理人"
                    class={formData.is_express === 1 ? 'grid-five' : ''}
                    prop="sender_name"
                    rules={{
                      required: true,
                      message: `请选择寄件人/商务处理人`,
                      trigger: 'change',
                    }}
                  >
                    <el-select
                      popper-class="el-select-popper-mini"
                      remote
                      clearable={false}
                      filterable
                      remote-method={this.queryUser}
                      placeholder="请选择"
                      value={formData.sender_name}
                      loading={userQueryLoading}
                      on-change={this.onSenderChanged}
                    >
                      {user_list.map(el => (
                        <el-option label={el.username} value={el.username} key={el.id}></el-option>
                      ))}
                    </el-select>
                  </el-form-item>
                )}
                {/* <el-form-item
                  label="关联审批"
                  class={formData.needPost === 1 ? 'grid-five' : ''}
                  prop="approval_id"
                >
                  <el-select
                    placeholder="请选择"
                    value={formData.approval_id}
                    on-change={this.onApprovalIdChanged}
                  >
                    <el-option label="是" value="1"></el-option>
                    <el-option label="否" value="0"></el-option>
                  </el-select>
                </el-form-item> */}
              </div>
              <div class="upload-form">
                <el-form-item
                  style="margin-right:0 !important"
                  label="附件"
                  prop="attachment"
                  rules={{ required: true, message: `请上传附件`, trigger: 'change' }}
                >
                  <div class="upload-box">
                    <tg-upload
                      disabled={(formData.attachment?.length ?? 0) >= 10}
                      action="/api/approval/upload_approval_attachment"
                      beforeUpload={this.beforeUpload}
                      success={this.attachmentSuccessHandle}
                      show-file-list={false}
                    >
                      <tg-button
                        disabled={(formData.attachment?.length ?? 0) >= 10}
                        size="medium"
                        icon="ico-btn-upload"
                      >
                        上传附件
                      </tg-button>
                    </tg-upload>
                    <span class="update-desc">最多上传10份文件，每份不超过20M。</span>
                  </div>
                  <div class="file-list-box">
                    <upload-file-list v-model={formData.attachment} />
                  </div>
                </el-form-item>
                {/* <el-form-item label="用印扫描件" class="mgt-24">
                  <div class="upload-box">
                    <tg-upload
                      disabled={(formData.scan?.length ?? 0) >= 10}
                      action="/api/approval/upload_approval_attachment"
                      beforeUpload={this.beforeUpload}
                      success={this.scanSuccessHandle}
                      show-file-list={false}
                    >
                      <tg-button
                        disabled={(formData.scan?.length ?? 0) >= 10}
                        size="medium"
                        icon="ico-btn-upload"
                      >
                        上传附件
                      </tg-button>
                    </tg-upload>
                    <span class="update-desc">最多上传10份文件，每份不超过20M。</span>
                  </div>
                  <div class="file-list-box">
                    <upload-file-list v-model={formData.scan} />
                    <span>{formData.scan}</span>
                  </div>
                </el-form-item> */}
              </div>
            </el-form>
          </div>
          <template slot="footer">
            <tg-button onClick={this.onClose}>取消</tg-button>
            <tg-button type="primary" onClick={this.onSave}>
              保存
            </tg-button>
          </template>
        </el-dialog>
        <tg-mask-loading visible={this.loading && this.visible} content="正在保存，请稍候..." />
      </div>
    );
  },
});
