import { defineComponent, ref } from '@vue/composition-api';
import { RouterNameSupplier } from '@/const/router';
import { useFormData } from './use';
import { Message } from 'element-ui';
import caseDialog from '../case/index.vue';
import { useRouter } from '@/use/vue-router';
import FormValidation from '@/modules/supplier/playerManager/common/FormValidation';
import { AsyncConfirm } from '@/use/asyncConfirm';

export default defineComponent({
  components: {
    caseDialog,
  },
  setup(props, ctx) {
    const useFD = useFormData();
    const { formData, saveAnchor } = useFD;
    const formRef = ref<{ validate: (value: any) => void } | undefined>(undefined);
    const router = useRouter();
    const anchor_id = router.currentRoute.params.id;
    const verify = router.currentRoute.params.verify;

    if (anchor_id !== undefined) {
      useFD.getEditInfo(anchor_id);
    }
    const onSubmit = () => {
      formRef.value?.validate(async (pass: any) => {
        if (!pass) return;
        if (verify === 'success') {
          const result = await AsyncConfirm(ctx, '该信息已审核通过，是否确认提交重新进行审核?');
          if (!result) {
            return false;
          }
        }
        saveAnchor()
          .then(() => {
            ctx.root.$message.success('操作成功，即将返回主播列表');
            setTimeout(() => {
              ctx.root.$router.push({ name: RouterNameSupplier.player });
            }, 2000);
          })
          .catch(ex => {
            Message.error(ex.message);
          });
      });
    };
    const dialogRef = ref<{ show: (title: string, data?: any) => void } | null>(null);

    return {
      useFD,
      dialogRef,
      formData,
      onSubmit,
      formRef,
    };
  },
  render() {
    const { formData } = this.useFD;
    return (
      <div style="height:100%; overflow-y: hidden;">
        <div class="other-info">
          {formData.verify_status === -1 && formData.verify_message && (
            <div class="warning-box">
              <i class="el-icon-warning"></i>
              <span>{formData.verify_message}</span>
            </div>
          )}
          <el-form
            ref="formRef"
            size="mini"
            labelPosition="top"
            attrs={{
              model: formData,
            }}
          >
            <div class="form-container">
              <div class="block-title star" style="margin-top: 0">
                其他信息
              </div>
              <div class="flex-line-box">
                <div class="flex-line-item">
                  <el-form-item
                    label="主播类型"
                    prop="anchor_platform"
                    rules={[
                      { required: true, message: '请选择主播类型', trigger: ['blur', 'change'] },
                    ]}
                  >
                    <el-select
                      popper-class="el-select-popper-mini"
                      style={{ width: '100%' }}
                      placeholder="请选择主播类型"
                      v-model={formData.anchor_platform}
                    >
                      <el-option label="机构主播" value={1} />
                      <el-option label="个人主播" value={2} />
                    </el-select>
                  </el-form-item>
                </div>
                <div class="flex-line-item">
                  <el-form-item
                    label="结算公司"
                    prop="settlement_company_id"
                    rules={[
                      { required: true, message: '请输入结算公司', trigger: ['blur', 'change'] },
                    ]}
                  >
                    <el-select
                      popper-class="el-select-popper-mini"
                      style={{ width: '100%' }}
                      placeholder="请输入结算公司"
                      remote
                      filterable
                      v-model={formData.settlement_company_id}
                      remote-method={(query: string) => {
                        this.useFD.queryCompanies(query);
                      }}
                    >
                      {this.useFD.company_list.map((item, key) => (
                        <el-option key={key} label={item.company_name} value={item.id} />
                      ))}
                    </el-select>
                  </el-form-item>
                </div>
                <div class="flex-line-item">
                  <el-form-item
                    label="期望时薪"
                    prop="hourly_wage"
                    rules={[
                      { required: true, message: '请选择期望时薪', trigger: ['blur', 'change'] },
                    ]}
                  >
                    <el-select
                      popper-class="el-select-popper-mini"
                      style={{ width: '100%' }}
                      placeholder="请选择期望时薪"
                      v-model={formData.hourly_wage}
                    >
                      <el-option label="130及以下" value={1} />
                      <el-option label="130-150" value={2} />
                      <el-option label="150-180" value={3} />
                      <el-option label="180-220" value={4} />
                      <el-option label="220-250" value={5} />
                      <el-option label="250以上" value={6} />
                    </el-select>
                  </el-form-item>
                </div>
                <div class="flex-line-item">
                  <el-form-item
                    label="期望综合薪资"
                    prop="salary"
                    rules={[
                      { required: true, message: '请输入综合薪资', trigger: ['blur', 'change'] },
                    ]}
                  >
                    <el-input
                      className="input-more"
                      placeholder="请输入综合薪资"
                      v-model={formData.salary}
                    >
                      <fragments slot="append">元/月</fragments>
                    </el-input>
                  </el-form-item>
                </div>
              </div>
              <div class="block-title star">收款信息</div>
              <div class="flex-line-box">
                <div class="flex-line-item">
                  <el-form-item
                    label="户名"
                    prop="collection_bank_account"
                    rules={[{ required: true, message: '请输入户名', trigger: 'blur' }]}
                  >
                    <el-input placeholder="请输入户名" v-model={formData.collection_bank_account} />
                  </el-form-item>
                </div>
                <div class="flex-line-item">
                  <el-form-item
                    label="开户行"
                    prop="collection_bank_name"
                    rules={[{ required: true, message: '请输入开户行', trigger: 'blur' }]}
                  >
                    <el-input placeholder="请输入开户行" v-model={formData.collection_bank_name} />
                  </el-form-item>
                </div>
                <div class="flex-line-item">
                  <el-form-item
                    label="银行卡号"
                    prop="collection_bank_no"
                    rules={[{ required: true, message: '请输入银行卡号', trigger: 'blur' }]}
                  >
                    <el-input placeholder="请输入银行卡号" v-model={formData.collection_bank_no} />
                  </el-form-item>
                </div>
                <div class="flex-line-item">
                  <el-form-item
                    label="手机号"
                    prop="collection_phone"
                    rules={[{ required: true, message: '请输入手机号', trigger: 'blur' }]}
                  >
                    <el-input placeholder="请输入手机号" v-model={formData.collection_phone} />
                  </el-form-item>
                </div>
              </div>
              <div class="form-block-container">
                <el-form-item
                  prop="bank_card_front"
                  rules={[{ required: true, message: '请上传银行卡正面', trigger: 'blur' }]}
                >
                  <div class="file-list">
                    <tg-upload
                      action="/api/medium/upload_file"
                      show-file-list={false}
                      beforeUpload={FormValidation.ValidationFileUpload({
                        image: true,
                        fileSize: 5,
                      })}
                      success={(res: { data: { source: string } }) => {
                        formData.bank_card_front = res.data.source;
                      }}
                    >
                      {!formData.bank_card_front ? (
                        <div class="upload-btn">
                          <i class="el-icon-plus avatar-uploader-icon" />
                          <span class="star">上传银行卡正面</span>
                        </div>
                      ) : (
                        <div class="upload-preview">
                          <tg-image src={formData.bank_card_front} />
                        </div>
                      )}
                    </tg-upload>
                  </div>
                </el-form-item>
                <el-form-item
                  prop="bank_card_back"
                  rules={[{ required: true, message: '请上传银行卡背面', trigger: 'blur' }]}
                >
                  <div class="file-list" style="margin-left: 97px">
                    <tg-upload
                      action="/api/medium/upload_file"
                      show-file-list={false}
                      beforeUpload={FormValidation.ValidationFileUpload({
                        image: true,
                        fileSize: 5,
                      })}
                      success={(res: { data: { source: string } }) => {
                        formData.bank_card_back = res.data.source;
                      }}
                    >
                      {!formData.bank_card_back ? (
                        <div class="upload-btn">
                          <i class="el-icon-plus avatar-uploader-icon" />
                          <span class="star">上传银行卡背面</span>
                        </div>
                      ) : (
                        <div class="upload-preview">
                          <tg-image src={formData.bank_card_back} />
                        </div>
                      )}
                    </tg-upload>
                  </div>
                </el-form-item>
              </div>
              <div class="block-title star">实名信息</div>
              <div class="flex-line-box">
                <div class="single">
                  <el-form-item
                    label="身份证号"
                    prop="id_card"
                    rules={[{ required: true, message: '请输入身份证号', trigger: 'blur' }]}
                  >
                    <el-input placeholder="请输入身份证号" v-model={formData.id_card} />
                  </el-form-item>
                </div>
              </div>
              <div class="form-block-container">
                <el-form-item
                  prop="id_card_front"
                  rules={[{ required: true, message: '请上传身份证正面', trigger: 'blur' }]}
                >
                  <div class="file-list">
                    <tg-upload
                      action="/api/medium/upload_file"
                      show-file-list={false}
                      beforeUpload={FormValidation.ValidationFileUpload({
                        image: true,
                        fileSize: 5,
                      })}
                      success={(res: { data: { source: string } }) => {
                        formData.id_card_front = res.data.source;
                      }}
                    >
                      {!formData.id_card_front ? (
                        <div class="upload-btn">
                          <i class="el-icon-plus avatar-uploader-icon" />
                          <span class="star">上传身份证正面</span>
                        </div>
                      ) : (
                        <div class="upload-preview">
                          <tg-image src={formData.id_card_front} />
                        </div>
                      )}
                    </tg-upload>
                  </div>
                </el-form-item>
                <el-form-item
                  prop="id_card_back"
                  rules={[{ required: true, message: '上传身份证背面', trigger: 'blur' }]}
                >
                  <div class="file-list" style="margin-left: 97px">
                    <tg-upload
                      action="/api/medium/upload_file"
                      show-file-list={false}
                      beforeUpload={FormValidation.ValidationFileUpload({
                        image: true,
                        fileSize: 5,
                      })}
                      // file-list={[new Array(3).fill({})]}
                      success={(res: { data: { source: string } }) => {
                        formData.id_card_back = res.data.source;
                      }}
                    >
                      {!formData.id_card_back ? (
                        <div class="upload-btn">
                          <i class="el-icon-plus avatar-uploader-icon" />
                          <span class="star">上传身份证背面</span>
                        </div>
                      ) : (
                        <div class="upload-preview">
                          <tg-image src={formData.id_card_back} />
                        </div>
                      )}
                    </tg-upload>
                  </div>
                </el-form-item>
              </div>
              <div class="block-title">合同</div>
              <div class="form-container" style="margin-top: 12px; padding: 0 10px">
                <el-form-item>
                  <div class="resume">
                    {formData.contracts.length < 10 && (
                      <tg-upload
                        action="/api/medium/upload_file"
                        show-file-list={false}
                        beforeUpload={FormValidation.ValidationFileUpload({
                          fileSize: 30,
                          image: true,
                          file: true,
                        })}
                        success={(res: { data: { source: string } }) => {
                          formData.contracts.push(res.data.source);
                        }}
                      >
                        <tg-button icon="ico-upload-lite">上传合同</tg-button>
                      </tg-upload>
                    )}

                    <div class="tips">
                      支持扩展名：.docx .doc .pdf .jpg .png；最多上传10个文件
                      <br />
                      （单个文件大小不超过30M）
                    </div>
                  </div>
                  <upload-file-list v-model={formData.contracts} />
                </el-form-item>
              </div>
            </div>
          </el-form>
        </div>
        <div class="options">
          <el-button
            size="mini"
            onClick={() => {
              this.$router.push({ name: RouterNameSupplier.player });
            }}
          >
            返回列表
          </el-button>
          <el-button style="margin-left: 18px" type="primary" onclick={this.onSubmit}>
            提交审核
          </el-button>
        </div>
      </div>
    );
  },
});
