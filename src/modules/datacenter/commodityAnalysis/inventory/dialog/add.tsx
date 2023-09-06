import { ref, defineComponent, h } from '@vue/composition-api';
import { Select } from '@gm/component/select';
import { ValidationFileUpload } from '@/modules/supplier/playerManager/common/FormValidation';
// import { FunctionSelect } from '@gm/component/select';
// import { EFunctionSelectType } from '@gm/component/select/FunctionSelect';
export default defineComponent({
  props: {
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, ctx) {
    const formData = ref<any>({
      inventory_range: 1,
      file_urls: [],
      product_sn: '',
      project_id: undefined,
      product_class: undefined,
    });
    const show = (val: any) => {
      formData.value = {
        inventory_range: 1,
        file_urls: [],
        ...val,
        order_num: '',
      };
      console.log(formData.value, 'formData.value');
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
    return {
      formData,
      formRef,
      show,
      close,
      onSaveBtnClick,
    };
  },
  render() {
    const { formData } = this;
    return (
      <el-form
        attrs={{ model: this.formData }}
        ref="formRef"
        label-width={'70px'}
        class="form-wrap"
      >
        {!this.isEdit && (
          <el-form-item label="盘点范围：" class="item-scope">
            <el-radio size="mini" v-model={formData.inventory_range} label={1}>
              录入下单信息
            </el-radio>
            <el-radio v-model={formData.inventory_range} label={2}>
              导入下单信息
            </el-radio>
          </el-form-item>
        )}
        <el-form-item
          label="选择项目："
          rules={[
            {
              required: true,
              message: '请选择项目',
              trigger: 'change',
            },
          ]}
        >
          <Select
            clearable={false}
            options={formData.project_options}
            v-model={formData.project_id}
            style="width:100%"
            v-auto-placeholder
            filterable={true}
            disabled={this.isEdit}
          />
        </el-form-item>
        {!this.isEdit && (
          <el-form-item
            label="商品类型："
            prop="product_class"
            rules={[
              {
                required: true,
                message: '请选择商品类型',
                trigger: 'change',
              },
            ]}
          >
            <Select
              style={{ width: '100%' }}
              popper-class="el-select-popper-mini"
              v-model={formData.product_class}
              v-auto-placeholder
              options={E.datacenter.CommodityTypeOption}
              clearable={false}
            />
          </el-form-item>
        )}
        {formData.inventory_range === 1 ? (
          <fragments>
            <el-form-item
              key="itemNo"
              label="商品款号："
              prop="product_sn"
              rules={[
                {
                  required: true,
                  message: '请选择商品款号',
                  trigger: 'blur',
                },
              ]}
            >
              <el-input
                disabled={this.isEdit}
                size="mini"
                v-model={this.formData.product_sn}
                v-auto-placeholder
              />
            </el-form-item>
            <el-form-item
              key="orderQuantity"
              label="下单数量："
              prop="order_num"
              rules={[
                {
                  validator: (rule: any, value: any, callback: any) => {
                    const threshold = 0; // 设置阈值
                    if (!value) return callback(new Error('金额必须大于等于0'));
                    if (parseFloat(value) < threshold) {
                      callback(new Error('金额必须大于等于0'));
                    } else {
                      callback();
                    }
                  },
                  required: true,
                  message: '请输入下单数量且大于等于0',
                  trigger: 'blur',
                },
              ]}
            >
              <el-input
                size="mini"
                v-only-number={{ precision: 0, min: 0 }}
                v-model={this.formData.order_num}
                v-auto-placeholder
              />
            </el-form-item>
          </fragments>
        ) : (
          <fragments>
            <el-form-item
              key="file_urls"
              label="上传文件："
              prop="file_urls"
              rules={{ required: true, trigger: 'change', message: '请上传文件' }}
            >
              <div class="upload-box">
                <tg-upload
                  class="col-span-full"
                  multiple={true}
                  action="/api/resources/upload_file"
                  data={{ type: 'item_place_order', storage: 1 }}
                  show-file-list={false}
                  beforeUpload={(config: any) => {
                    return ValidationFileUpload({ fileSize: 10, excel: true })(config);
                  }}
                  limit={1}
                  file-list={formData.file_urls}
                  success={(res: any) => {
                    if (!res.success) {
                      this.$message.error(res.message);
                      return;
                    }
                    formData.file_urls?.push(res.data.source);
                  }}
                >
                  <tg-button
                    icon="ico-upload-lite"
                    disabled={formData.file_urls?.length === 1 ? true : false}
                    v-model={formData.file_urls}
                  >
                    上传文件
                  </tg-button>
                  <a
                    class="download mgl-6"
                    // target="_blank"
                    href="https://tiange-oss.oss-cn-hangzhou.aliyuncs.com/upload_template/shop_live_douyin_item_place_order_template.xlsx"
                    download
                    onClick={(event: any) => {
                      event.stopPropagation();
                    }}
                  >
                    下载模板
                  </a>
                </tg-upload>
                <upload-file-list
                  class="file-box"
                  ellipsis={'150px'}
                  v-model={formData.file_urls}
                />
              </div>
            </el-form-item>
          </fragments>
        )}
      </el-form>
    );
  },
});
