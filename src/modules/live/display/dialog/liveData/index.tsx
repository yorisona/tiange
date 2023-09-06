import { ValidationFileUpload } from '@/modules/supplier/playerManager/common/FormValidation';
import { UpdateShopLiveRecordDataService } from '@/services/live';
import { LiveDisplay, ShopLiveDouyinDataForm, ShopLiveRecordDataForm } from '@/types/tiange/live';
import { getToken } from '@/utils/token';
import { computed, defineComponent, inject, Ref, ref } from '@vue/composition-api';
import Decimal from 'decimal.js';
import { ElForm } from 'element-ui/types/form';
import moment from 'moment';
import { useProjectBaseInfo } from '@/modules/settlement/use/project';

export interface LiveDataType {
  show: (liveData?: ShopLiveDouyinDataForm) => void;
}

export default defineComponent({
  setup(props, ctx) {
    const initFormData = (): ShopLiveDouyinDataForm => {
      return {
        id: undefined,
        shop_live_id: undefined,
        real_start_time: '',
        real_end_time: '',
        /** 直播详情url */
        detail_file: [],
        /** 直播数据截图 */
        duration_screenshot: '',
        real_duration: undefined,
      };
    };
    const liveDisplay = inject<Ref<LiveDisplay>>('liveDisplay');
    const formData = ref<ShopLiveDouyinDataForm>(initFormData());
    const visible = ref(false);
    const loading = ref(false);
    const formRef = ref<ElForm | undefined>(undefined);
    const { business_type } = useProjectBaseInfo();
    const methods = {
      show(liveData?: ShopLiveDouyinDataForm) {
        visible.value = true;
        if (liveData) {
          const { real_start_time, real_end_time, ...rest } = liveData;
          formData.value = {
            ...initFormData(),
            real_start_time: parseInt(`${real_start_time}`, 10) * 1000,
            real_end_time: parseInt(`${real_end_time}`, 10) * 1000,
            ...rest,
          };
        } else {
          formData.value = initFormData();
        }
      },
      onClose() {
        visible.value = false;
        methods.clearValid();
      },
      onSave() {
        formRef.value?.validate(valid => {
          if (valid) {
            methods.submit();
          }
        });
      },
      beforeDataUpload(config: any) {
        return ValidationFileUpload({ excel: true, fileSize: 10 })(config);
      },
      beforePicUpload(config: any) {
        return ValidationFileUpload({ image: true, fileSize: 2 })(config);
      },
      dataSuccessHandle(res: any) {
        if (res.success !== true) {
          ctx.root.$message.error(res.message ?? '上次失败');
        } else {
          const url = res.data.source;
          formData.value.detail_file = [url];
          formRef.value?.clearValidate('detail_file');
        }
      },
      picSuccessHandle(res: any) {
        if (res.success !== true) {
          ctx.root.$message.error(res.message ?? '上次失败');
        } else {
          const url = res.data.source;
          formData.value.duration_screenshot = url;
        }
      },
      clearValid() {
        // formData.value = initFormData();
        setTimeout(() => {
          formRef.value?.clearValidate();
        }, 300);
      },
      onPicDelete(event: MouseEvent) {
        formData.value.duration_screenshot = '';
        event.stopPropagation();
      },
      imageTokenUrl(imageUrl: string | undefined) {
        return `${imageUrl}?Authorization=${getToken()}`;
      },

      /** 点击保存 */
      submit: async () => {
        const format = 'yyyy-MM-DD HH:mm';
        const params = ref<ShopLiveRecordDataForm & { business_type: number | undefined }>({
          duration_screenshot: formData.value.duration_screenshot ?? '',
          real_start_time: formData.value.real_start_time
            ? moment(formData.value.real_start_time).format(format)
            : '',
          real_end_time: formData.value.real_end_time
            ? moment(formData.value.real_end_time).format(format)
            : '',
          detail_file: formData.value.detail_file?.[0],
          business_type: liveDisplay?.value.business_type,
          real_duration: formData.value.real_duration ?? methods.reloadDuration(),
        });

        const record_id = computed(() => {
          return formData.value.id ?? -1;
        });

        if (record_id.value !== -1) {
          params.value.id = record_id.value;
        } else {
          params.value.shop_live_id = liveDisplay?.value.id;
        }
        loading.value = true;
        const { data: response } = await UpdateShopLiveRecordDataService(
          params.value,
          business_type.value,
        );
        loading.value = false;
        if (response.success) {
          ctx.root.$message.success(response.message);
          ctx.emit('save');
          methods.onClose();
        } else {
          ctx.root.$message.error(response.message);
        }
      },
      /** 时间差计算 */
      calcDuration: (start_date_str: string | number, end_date_str: string | number) => {
        // const startDate = new Date(start_date_str);
        // const endDate = new Date(end_date_str);
        const startDate = moment(start_date_str).toDate();
        const endDate = moment(end_date_str).toDate();

        const diff = (endDate.getTime() - startDate.getTime()) / (3600 * 1000);
        const diffstr = new Decimal(diff.toString()).toFixed(1);

        return diffstr;
      },
      reloadDuration: () => {
        /** 计算时长 */
        if (formData.value.real_start_time && formData.value.real_end_time) {
          return methods.calcDuration(formData.value.real_start_time, formData.value.real_end_time);
        }
      },
    };
    return {
      loading,
      visible,
      formData,
      formRef,
      ...methods,
    };
  },
  render() {
    const { loading, visible, formData } = this;
    return (
      <div class="live-display-live-daata-page-container">
        <el-dialog
          visible={visible}
          title="直播数据留档"
          width="376px"
          close-on-click-modal={false}
          onClose={this.onClose}
          close-on-press-escape={false}
          class="tg-dialog-classic workbench-use-seal-dialog tg-dialog-vcenter-new"
        >
          <el-form size="mini" label-position="top" ref="formRef" props={{ model: formData }}>
            <el-form-item
              label="电商罗盘直播间详情导出数据"
              prop="detail_file"
              rules={{ required: true, message: '请上传文件', trigger: 'change' }}
            >
              <div class="upload-box-data">
                <tg-upload
                  disabled={formData.detail_file.length >= 1}
                  action="/api/resources/upload_file"
                  data={{ type: 'shop_live_detail_file' }}
                  beforeUpload={this.beforeDataUpload}
                  success={this.dataSuccessHandle}
                  show-file-list={false}
                >
                  <tg-button disabled={formData.detail_file.length >= 1} icon="ico-btn-upload">
                    上传文件
                  </tg-button>
                </tg-upload>
              </div>
              <div class="file-list-box">
                <upload-file-list v-model={formData.detail_file} />
              </div>
            </el-form-item>
            {/* <el-form-item label="直播开始时间" style="margin-top: 14px">
              <el-date-picker
                v-model={formData.real_start_time}
                type="datetime"
                value-format="timestamp"
                format="yyyy.MM.dd HH:mm:ss"
                disabled={true}
                placeholder="选择时间"
              ></el-date-picker>
            </el-form-item>
            <el-form-item class="mgt-18" label="直播结束时间">
              <el-date-picker
                v-model={formData.real_end_time}
                type="datetime"
                value-format="timestamp"
                format="yyyy.MM.dd HH:mm:ss"
                disabled={true}
                placeholder="选择时间"
              ></el-date-picker>
            </el-form-item> */}
            <el-form-item style="margin-top: 24px;" label="直播留档截图">
              <div class="upload-box-pic" style="margin-top: 4px;">
                <tg-upload
                  action="/api/resources/upload_file"
                  data={{ type: 'shop_live_screenshot' }}
                  beforeUpload={this.beforePicUpload}
                  success={this.picSuccessHandle}
                  show-file-list={false}
                >
                  <div class="update-item">
                    <div class="update-item-add">
                      {/* <tg-icon class="update-add-icon" name="el-icon-plus"></tg-icon> */}
                      {(formData.duration_screenshot?.length ?? 0) > 0 ? (
                        <img
                          class="update-item-img"
                          src={this.imageTokenUrl(formData.duration_screenshot)}
                          alt=""
                        />
                      ) : (
                        <fragments>
                          <i class="update-add-icon el-icon-plus"></i>
                          <div class="update-add-desc">上传图片</div>
                        </fragments>
                      )}
                    </div>
                    {(formData.duration_screenshot?.length ?? 0) > 0 && (
                      <tg-icon
                        class="update-item-delete"
                        name="ico-cross-sm"
                        hoverName="ico-cross-red-sm"
                        on-click={this.onPicDelete}
                      ></tg-icon>
                    )}
                  </div>
                </tg-upload>
                <div class="upload-box-pic-desc">大小不超过2M</div>
              </div>
            </el-form-item>
          </el-form>
          <template slot="footer">
            <tg-button onClick={this.onClose}>取消</tg-button>
            <tg-button type="primary" onClick={this.onSave}>
              保存
            </tg-button>
          </template>
        </el-dialog>
        <tg-mask-loading visible={loading && visible} content="正在保存，请稍候..." />
      </div>
    );
  },
});
