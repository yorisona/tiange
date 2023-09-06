import { defineComponent, ref, set } from '@vue/composition-api';
import { anchorTypeOptions } from '@/const/options';
import { RouterNameSupplier } from '@/const/router';
import { useFormData } from './use';
import { Message } from 'element-ui';
import caseDialog from '../case/index.vue';
import { useRouter } from '@/use/vue-router';
import FormValidation from '../../common/FormValidation';
import { wait as AwaitFn } from '@/utils/func';
import supplierService from '@/services/supplier';

export default defineComponent({
  components: {
    caseDialog,
  },
  setup(props, ctx) {
    const useFD = useFormData();
    const { formData, catesData, tagsData, saveAnchor } = useFD;
    const formRef = ref<{ validate: (value: any) => void } | undefined>(undefined);
    const router = useRouter();
    const anchor_id = router.currentRoute.params.id;
    if (anchor_id !== undefined) {
      useFD.getEditInfo(anchor_id);
    }
    const onSubmit = () => {
      formRef.value?.validate((pass: any) => {
        if (!pass) return;
        saveAnchor()
          .then(() => {
            Message.success(anchor_id !== undefined ? '修改成功' : '添加成功');
            if (anchor_id === undefined) {
              router.push({ name: RouterNameSupplier.player });
            }
          })
          .catch(ex => {
            Message.error(ex.message);
          });
      });
    };
    const dialogRef = ref<{ show: (title: string, data?: any) => void } | null>(null);

    const exceedFun = () => {
      Message.warning('最多只能上传8张照片');
    };
    const getdata = async (wechat: any) => {
      const [{ data: response }] = await AwaitFn(
        500,
        supplierService.GetCheckAnchorWechat(wechat, anchor_id),
      );
      if (response.data) {
        const data: any = response.data;
        return data.is_exist || false;
      }
      return false;
    };
    return {
      getdata,
      dialogRef,
      formData,
      catesData,
      tagsData,
      onSubmit,
      formRef,
      exceedFun,
    };
  },
  render() {
    const { formData, catesData, tagsData } = this;
    return (
      <div style="height:100%; overflow-y: hidden;">
        <div class="base-info">
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
              model: this.formData,
            }}
          >
            <div class="form-container">
              <div class="base-item-title">
                <span class="star">*</span>
                <span class="title">基本信息</span>
              </div>
              <div class="flex-line-box" style="margin-top: -8px">
                <div class="flex-line-item">
                  <el-form-item
                    label="主播名称"
                    prop="flower_name"
                    rules={{ required: true, message: '请输入主播名称', trigger: 'blur' }}
                  >
                    <el-input
                      placeholder="请输入主播名称"
                      maxlength={20}
                      show-word-limit={true}
                      v-model={formData.flower_name}
                    />
                  </el-form-item>
                </div>
                <div class="flex-line-item">
                  <el-form-item
                    label="微信号"
                    prop="wechat"
                    rules={[
                      { required: true, message: '请输入微信号', trigger: 'blur' },
                      {
                        validator: async (rule: any, value: any, callback: any) => {
                          const result: any = await AwaitFn(500, this.getdata(value));
                          if (result && result.length > 0 && result[0] === true) {
                            callback(new Error('主播已存在'));
                          } else {
                            callback();
                          }
                        },
                        trigger: ['blur'],
                      },
                    ]}
                  >
                    <el-input
                      placeholder="请输入微信号"
                      maxlength={20}
                      show-word-limit={true}
                      v-model={formData.wechat}
                    />
                  </el-form-item>
                </div>
                <div class="flex-line-item">
                  <el-form-item
                    label="真名"
                    prop="real_name"
                    rules={[{ required: true, message: '请输入真名' }]}
                  >
                    <el-input
                      placeholder="请输入真名"
                      maxlength={20}
                      show-word-limit={true}
                      v-model={formData.real_name}
                    />
                  </el-form-item>
                </div>
                <div class="flex-line-item">
                  <el-form-item
                    label="性别"
                    prop="gender"
                    rules={[{ required: true, message: '请选择性别' }]}
                  >
                    <el-select
                      popper-class="el-select-popper-mini"
                      placeholder="请选择性别"
                      style={{ width: '100%' }}
                      v-model={formData.gender}
                    >
                      <el-option label="男" value={1} />
                      <el-option label="女" value={2} />
                    </el-select>
                  </el-form-item>
                </div>
                <div class="flex-line-item">
                  <el-form-item
                    label="身高"
                    prop="height"
                    rules={[{ required: true, message: '请输入身高' }]}
                  >
                    <el-input
                      className="input-more"
                      style={{ width: '100%' }}
                      placeholder="请输入身高"
                      v-model={formData.height}
                    >
                      <fragments slot="append">CM</fragments>
                    </el-input>
                  </el-form-item>
                </div>
              </div>
              <div class="flex-line-box">
                <div class="flex-line-item">
                  <el-form-item
                    label="体重"
                    rules={[{ required: true, message: '请输入体重' }]}
                    prop="weight"
                  >
                    <el-input
                      className="input-more"
                      placeholder="请输入体重"
                      v-model={formData.weight}
                    >
                      <fragments slot="append">KG</fragments>
                    </el-input>
                  </el-form-item>
                </div>
                <div class="flex-line-item">
                  <el-form-item
                    label="鞋码"
                    prop="shoes_size"
                    rules={[{ required: true, message: '请输入鞋码' }]}
                  >
                    <el-input
                      placeholder="请输入鞋码"
                      v-model={formData.shoes_size}
                      maxLength={2}
                    />
                  </el-form-item>
                </div>
                <div class="flex-line-item">
                  <el-form-item
                    label="主播类型"
                    prop="anchor_type"
                    rules={[{ required: true, message: '请选择主播类型' }]}
                  >
                    <el-select
                      popper-class="el-select-popper-mini"
                      style={{ width: '100%' }}
                      placeholder="请选择主播类型"
                      v-model={formData.anchor_type}
                    >
                      {anchorTypeOptions.map((item, key) => (
                        <el-option label={item.label} value={item.value} key={key} />
                      ))}
                    </el-select>
                  </el-form-item>
                </div>
                <div class="flex-line-item">
                  <el-form-item
                    label="直播经验"
                    prop="live_year"
                    rules={[{ required: true, message: '请输入经验年限' }]}
                  >
                    <el-input
                      className="input-more"
                      placeholder="请输入经验年限"
                      v-model={formData.live_year}
                    >
                      <fragments slot="append">年</fragments>
                    </el-input>
                  </el-form-item>
                </div>
                <div class="flex-line-item">
                  <el-form-item
                    label="达人经验"
                    prop="has_kol_exp"
                    rules={[{ required: true, message: '请选择有无达人经验' }]}
                  >
                    <el-select
                      popper-class="el-select-popper-mini"
                      style={{ width: '100%' }}
                      placeholder="请选择有无达人经验"
                      v-model={formData.has_kol_exp}
                    >
                      <el-option label="有" value={true} />
                      <el-option label="无" value={false} />
                    </el-select>
                  </el-form-item>
                </div>
              </div>
              <el-form-item
                prop="images"
                rules={[
                  { required: true, message: '请上传照片', trigger: ['blur', 'change'] },
                  {
                    validator: (rule: any, value: any, callback: any) => {
                      if (formData.images.length < 3) {
                        callback(new Error('请至少上传3张照片'));
                      } else {
                        callback();
                      }
                    },
                    trigger: ['blur', 'change'],
                  },
                ]}
              >
                <span slot="label" class="base-item-title mgt-30">
                  <span class="title">上传照片</span>
                  <span class="tips">（3-8张，支持PNG、JPG格式，单张不超过5MB）</span>
                </span>
                <div class="file-list" style="margin-top: 24px">
                  {formData.images.map((item, key) => {
                    return (
                      <div class="file-wrapper mgt-30">
                        <div class="file" key={key}>
                          <tg-image src={item} />
                        </div>
                        <tg-icon
                          name="ico-a-quseguanbiicon2x"
                          onClick={() => {
                            formData.images.splice(key, 1);
                          }}
                        />
                      </div>
                    );
                  })}
                  {formData.images.length < 8 && (
                    <tg-upload
                      accept=".jpg,.jpeg,.png,.JPG,.JPEG,.PNG"
                      action="/api/medium/upload_file"
                      multiple
                      ref="TgUpload"
                      limit={8}
                      show-file-list={false}
                      // file-list={formData.images.map((item, key) => {
                      //   return { name: key + '1', url: item, uid: key + '1', status: 'success' };
                      // })}
                      beforeUpload={FormValidation.ValidationFileUpload({
                        fileSize: 5,
                        image: true,
                      })}
                      success={(res: { data: { source: string }; success: boolean }) => {
                        if (res.success) {
                          if (formData.images.length < 8) {
                            formData.images.push(res.data.source);
                          }
                        }
                      }}
                      OnExceed={this.exceedFun}
                    >
                      <div class="upload-btn mgt-30">
                        <i class="el-icon-plus avatar-uploader-icon" />
                        <span>上传照片</span>
                      </div>
                    </tg-upload>
                  )}
                </div>
              </el-form-item>
              <div>
                <el-form-item
                  label="擅长类目"
                  prop="cates"
                  rules={[{ required: true, message: '至少选一个擅长类目', trigger: 'blur' }]}
                >
                  <span slot="label" class="base-item-title mgt-30">
                    <span class="title">擅长类目</span>
                    <span class="tips">（最多选3项）</span>
                  </span>
                  <el-checkbox-group
                    style="margin-top: 24px;margin-left: 2px"
                    v-model={formData.cates}
                    max={3}
                  >
                    {catesData.catesList.map(item => {
                      return (
                        <el-checkbox label={item.value} key={item.value}>
                          <p class="checkbox-p">{item.label}</p>
                        </el-checkbox>
                      );
                    })}
                  </el-checkbox-group>
                </el-form-item>
              </div>
              <div>
                <el-form-item label="个人标签">
                  <span slot="label" class="base-item-title mgt-30">
                    <span class="title">个人标签</span>
                    <span class="tips">（最多选5项）</span>
                  </span>
                  <el-checkbox-group
                    style="margin-top: 24px;margin-left: 2px"
                    v-model={formData.tags}
                    max={5}
                  >
                    {tagsData.tagsList.map(item => {
                      return (
                        <el-checkbox label={item.value} key={item.value}>
                          <p class="checkbox-p">{item.label}</p>
                        </el-checkbox>
                      );
                    })}
                  </el-checkbox-group>
                </el-form-item>
              </div>
              <el-form-item
                label="优秀案例"
                prop="cases"
                rules={[
                  {
                    required: formData.live_year && formData.live_year > 0,
                    message: '请上传优秀案例',
                    trigger: 'blur',
                  },
                ]}
              >
                <span slot="label" class="base-item-title mgt-30">
                  <span class="title">优秀案例</span>
                </span>
                {formData.cases.length < 10 && (
                  <tg-button
                    icon="ico-btn-add"
                    style="margin-top: 32px"
                    className="mgb-12"
                    onClick={() => {
                      this.dialogRef?.show('新增案例');
                    }}
                  >
                    新增案例
                  </tg-button>
                )}

                <el-row gutter={50}>
                  {formData.cases.map((item, key) => {
                    return (
                      <el-col span={8}>
                        <div class="cases" key={key}>
                          <p class="labels">案例{key + 1}：</p>
                          <p class="text">{item.title}</p>
                          <span
                            class="mgr-12 operation"
                            onClick={() => {
                              if ((item as any).lid === undefined) {
                                (item as any).lid = Date.now();
                              }
                              this.dialogRef?.show('编辑案例', {
                                ...item,
                              });
                            }}
                          >
                            <tg-icon name="ico-edit" class="case-edit" />
                          </span>
                          <span
                            class="operation"
                            onClick={() => {
                              formData.cases.splice(key, 1);
                            }}
                          >
                            <tg-icon name="ico-btn-delete" class="case-delete" />
                          </span>
                        </div>
                      </el-col>
                    );
                  })}
                </el-row>
              </el-form-item>
            </div>
          </el-form>

          <case-dialog
            ref="dialogRef"
            onSaveCommissinRate={(data: any) => {
              if (data.lid === undefined) {
                formData.cases.push(data);
              } else {
                const index = formData.cases.findIndex((item: any) => item.lid === data.lid);
                if (index !== -1) {
                  set(formData.cases, index, data);
                } else {
                  formData.cases.push(data);
                }
              }
            }}
          />
        </div>
        <div class="options">
          <el-button
            onClick={() => {
              this.$router.push({ name: RouterNameSupplier.player });
            }}
          >
            返回列表
          </el-button>
          <el-button style="margin-left: 12px" size="mini" type="primary" onClick={this.onSubmit}>
            保存基本信息
          </el-button>
        </div>
      </div>
    );
  },
});
