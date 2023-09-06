import { ref, defineComponent, h } from '@vue/composition-api';
import { Select } from '@gm/component/select';
import { ValidationFileUpload } from '@/modules/supplier/playerManager/common/FormValidation';
import { urlAppendToken } from '@/utils/token';
import { useComonOptions } from '@/modules/fixedAssets/use';
import { GetFixedAssetDetail } from '@/services/fixedAssets';

interface Asset {
  asset_class: number | undefined; // 资产分类ID
  asset_code: string; // 资产编码
  asset_model: string; // 规格型号
  tax_amount: string | number; // 税额（分）
  asset_name: string; // 资产名称
  asset_type: number | undefined; // 资产类型ID
  expected_useful_life: number | undefined; // 预计使用期限（年）
  id: number | undefined; // 资产ID
  image: string; // 图片
  purchase_date: string | undefined; // 购买日期
  unit_price: number | undefined; // 单价（分）
  warehouse_position: number | undefined; // 存放地点ID
  warranty_deadline: string; // 保修到期日期
}
export default defineComponent({
  props: {
    isShowTable: {
      type: Boolean,
      default: false,
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
  },
  setup: (props, ctx) => {
    const formData = ref<Asset>({
      asset_class: undefined,
      asset_model: '',
      asset_name: '',
      asset_type: undefined,
      expected_useful_life: undefined,
      id: undefined,
      image: '',
      purchase_date: undefined,
      unit_price: undefined,
      warehouse_position: undefined,
      warranty_deadline: '',
      asset_code: '',
      tax_amount: '',
    });
    const detailData = ref<any>([]);
    const loading = ref(false);
    const show = (val: any) => {
      if (val) {
        formData.value = { ...val };
        loading.value = true;
        GetFixedAssetDetail({
          id: val.id,
        }).then(res => {
          loading.value = false;
          if (res.data.success) {
            detailData.value = res.data.data?.operation_list ?? [];
          }
        });
        if (formData.value.unit_price) {
          formData.value.unit_price = Number((val.unit_price / 100).toFixed(2));
          formData.value.tax_amount = Number((val.tax_amount / 100).toFixed(2));
        }
      }
    };
    const close = () => {
      ctx.emit('close');
    };
    /* 上传头像 */
    const uploadMethod = {
      beforeDataUpload(config: any) {
        return ValidationFileUpload({ image: true, fileSize: 20 })(config);
      },
      dataSuccessHandle(res: any) {
        if (res.success !== true) {
          ctx.root.$message.error(res.message ?? '上传失败');
        } else {
          const url = res.data.source;
          // formData.value.detail_file = [url];
          formData.value.image = url;

          // formRef.value?.clearValidate('detail_file');
        }
      },
    };
    const managementEditFrom = ref<any>(null);
    const onSaveBtnClick = async () => {
      // if (!formData.value.image) return ctx.root.$message.warning('请上传资产照片');
      const formValid = await managementEditFrom.value.validate();
      if (formValid) {
        ctx.emit('submit', formData.value);
      }
    };
    const { assetClassOption, assetTypeOption, AssetWarehousePositionOption } = useComonOptions();
    const columns = [
      {
        align: 'center',
        'show-overflow-tooltip': true,
        label: '时间',
        prop: 'operator_datetime',
        dataType: {
          type: 'date',
        },
      },
      {
        align: 'center',
        'show-overflow-tooltip': true,
        label: '操作类型',
        prop: 'operator_type',
        dataType: {
          type: 'enum',
          enum: E.fixedassets.OperationTypeMap,
        },
      },
      {
        align: 'center',
        'show-overflow-tooltip': true,
        label: '人员',
        prop: 'user_name',
      },
      {
        align: 'center',
        'show-overflow-tooltip': true,
        label: '部门/项目',
        minWidth: 150,
        prop: 'project_name',
        formatter: (row: any) => {
          const department_name = row.department_name ? row.department_name : '';
          const project_name = row.project_name ? '项目：' + row.project_name : '';
          if (!department_name && !project_name) return '--';
          return (
            <div style="text-overflow: ellipsis;overflow: hidden;">{`${
              row.department_name ? row.department_name : ''
            }${row.project_name ? '项目：' + row.project_name : ''}`}</div>
          );
        },
      },
      {
        align: 'center',
        minWidth: 120,
        'show-overflow-tooltip': true,
        label: '备注',
        prop: 'remark',
      },
    ];
    return {
      formData,
      show,
      close,
      managementEditFrom,
      onSaveBtnClick,
      assetClassOption,
      assetTypeOption,
      AssetWarehousePositionOption,
      columns,
      detailData,
      loading,
      ...uploadMethod,
    };
  },
  render() {
    return (
      <div class="managementEdit-box">
        <tg-upload
          action="/api/resources/upload_file"
          data={{ type: 'fixed_asset', storage: 2 }}
          beforeUpload={this.beforeDataUpload}
          success={this.dataSuccessHandle}
          show-file-list={false}
        >
          <div class="headPortrait">
            {this.formData.image ? (
              <img
                src={
                  this.formData.image.indexOf('tiange-oss') > -1
                    ? this.formData.image
                    : urlAppendToken(this.formData.image)
                }
                style="width: 100%;height: 100%;"
                alt="avatar"
              />
            ) : (
              <fragments>
                <i class="el-icon-plus avatar-uploader-icon" />
                <span>上传资产照片</span>
              </fragments>
            )}
          </div>
        </tg-upload>
        <el-form
          class="form-wrap"
          ref="managementEditFrom"
          inline={true}
          label-position="top"
          attrs={{ model: this.formData }}
        >
          <el-form-item
            label="资产编号"
            prop="asset_code"
            rules={[{ required: true, message: '请输入资产编号', trigger: 'blur' }]}
          >
            <el-input
              size="mini"
              v-model={this.formData.asset_code}
              v-auto-placeholder
              disabled={this.isDisabled}
              onInput={(e: any) => {
                const inputValue = e;
                const regex = /^[a-zA-Z0-9!@#$%^&*()-_]+$/; // 正则表达式：只允许输入英文和数字

                if (!regex.test(inputValue)) {
                  this.formData.asset_code = inputValue.replace(/[^a-zA-Z0-9]/g, '');
                }
              }}
            />
          </el-form-item>
          <el-form-item
            label="资产名称"
            prop="asset_name"
            rules={[{ required: true, message: '请输入资产名称', trigger: 'blur' }]}
          >
            <el-input
              size="mini"
              v-model={this.formData.asset_name}
              v-auto-placeholder
              disabled={this.isDisabled}
            />
          </el-form-item>
          <el-form-item label="规格型号">
            <el-input
              size="mini"
              v-model={this.formData.asset_model}
              v-auto-placeholder
              disabled={this.isDisabled}
            />
          </el-form-item>
          <el-form-item
            label="资产分类"
            prop="asset_class"
            rules={[{ required: true, message: '请选择资产分类', trigger: 'change' }]}
          >
            <Select
              popper-class="el-select-popper-mini"
              v-model={this.formData.asset_class}
              v-auto-placeholder
              options={this.assetClassOption}
              clearable={false}
              disabled={this.isDisabled}
              onChange={(v: any) => {
                const asset_class_age = this.assetClassOption.find(
                  (item: any) => item.value === v,
                )?.asset_class_age;
                this.formData.expected_useful_life = asset_class_age;
              }}
            />
          </el-form-item>
          <el-form-item
            label="资产类型"
            prop="asset_type"
            rules={[{ required: true, message: '请选择资产类型', trigger: 'change' }]}
          >
            <Select
              popper-class="el-select-popper-mini"
              v-model={this.formData.asset_type}
              v-auto-placeholder
              options={this.assetTypeOption}
              clearable={false}
              disabled={this.isDisabled}
            />
          </el-form-item>
          <el-form-item
            label="存放地点"
            prop="warehouse_position"
            rules={[{ required: true, message: '请选择存放地点', trigger: 'change' }]}
          >
            <Select
              popper-class="el-select-popper-mini"
              v-model={this.formData.warehouse_position}
              // v-auto-placeholder
              options={this.AssetWarehousePositionOption}
              clearable={false}
              disabled={this.isDisabled}
            />
          </el-form-item>
          <el-form-item
            label="购买日期"
            prop="purchase_date"
            rules={[{ required: true, message: '请选择购买日期', trigger: 'change' }]}
          >
            <el-date-picker
              type="date"
              size="mini"
              // placeholder="请选择购买日期"
              v-auto-placeholder
              v-model={this.formData.purchase_date}
              format="yyyy.MM.dd"
              value-format="yyyy-MM-dd"
              style="width:100%"
              disabled={this.isDisabled}
              picker-options={{
                disabledDate: (time: any) => {
                  // 不能选择未来时间
                  return time.getTime() > Date.now();
                },
              }}
            />
          </el-form-item>
          <el-form-item
            label="单价"
            prop="unit_price"
            rules={[
              {
                validator: (rule: any, value: any, callback: any) => {
                  const threshold = 1; // 设置阈值
                  if (!value) return callback(new Error('金额必须大于等于1'));
                  if (parseFloat(value) < threshold) {
                    callback(new Error('金额必须大于等于1'));
                  } else {
                    callback();
                  }
                },
                required: true,
                message: '请输入单价且大于等于1',
                trigger: 'blur',
              },
            ]}
          >
            <el-input
              size="mini"
              v-only-number={{ precision: 2, min: 1 }}
              v-model={this.formData.unit_price}
              v-auto-placeholder
              disabled={this.isDisabled}
            >
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item
            label="税额"
            prop="tax_amount"
            rules={[{ required: true, message: '请输入资产名称', trigger: 'blur' }]}
          >
            <el-input
              size="mini"
              v-only-number={{ precision: 2, min: 0 }}
              v-model={this.formData.tax_amount}
              v-auto-placeholder
              disabled={this.isDisabled}
            ></el-input>
            {/* <el-date-picker
              type="date"
              size="mini"
              // placeholder="请选择购买日期"
              v-auto-placeholder
              v-model={this.formData.warranty_deadline}
              format="yyyy.MM.dd"
              value-format="yyyy-MM-dd"
              style="width:100%"
              disabled={this.isDisabled}
            /> */}
          </el-form-item>
          <el-form-item
            class="one-line"
            label="预计使用期限"
            prop="expected_useful_life"
            rules={[{ required: true, message: '请选择预计使用期限', trigger: 'blur' }]}
          >
            <el-input
              size="mini"
              v-only-number={{ precision: 0, max: 30 }}
              v-model={this.formData.expected_useful_life}
              v-auto-placeholder
              disabled={this.isDisabled}
            >
              <template slot="append">年</template>
            </el-input>
          </el-form-item>
        </el-form>
        {this.isShowTable && (
          <div class="pdr-16" v-loading={this.loading}>
            <tg-table max-height={'400px'} border data={this.detailData} columns={this.columns}>
              <template slot="empty">
                {/* <span>暂无数据</span> */}
                <fragments></fragments>
              </template>
            </tg-table>
          </div>
        )}
        <div class="footer">
          <el-button
            size="mini"
            style="margin-right: 4px;"
            on-click={() => {
              this.$emit('close');
            }}
          >
            {this.isDisabled ? '关闭' : '取消'}
          </el-button>
          <el-button
            style="margin-right: 4px;"
            size="mini"
            type="primary"
            on-click={this.onSaveBtnClick}
            v-show={!this.isDisabled}
          >
            保存
          </el-button>
          {this.isShowTable && (
            <el-button
              size="mini"
              type="primary"
              on-click={() => {
                this.onSaveBtnClick();
                this.$emit('print', this.formData);
              }}
              v-show={!this.isDisabled}
            >
              保存并打印
            </el-button>
          )}
        </div>
      </div>
    );
  },
});
