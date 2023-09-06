import { defineComponent, ref } from '@vue/composition-api';
import { ElForm } from 'element-ui/types/form';
import { useRequest } from '@gm/hooks/ahooks';
import { enumEndType } from '@/utils/enumFunc';
import FormValidation from '@/modules/supplier/playerManager/common/FormValidation';
import { Message } from 'element-ui';
import { postEndProject } from '@/api/shop.project';
import { useProjectBaseInfo } from '@/modules/settlement/use/project';

interface FormData {
  id: number | undefined;
  end_type?: number;
  remark?: string;
  cycle_month?: number;
  attachment_urls?: string[];
  end_time: string | undefined;
}
export default defineComponent({
  setup(props, ctx) {
    const initFormData = () => ({
      id: undefined,
      end_type: undefined,
      remark: undefined,
      cycle_month: undefined,
      attachment_urls: [],
      end_time: undefined,
    });
    const formRef = ref<ElForm>();
    const formData = ref<FormData>(initFormData());
    const rules = {
      end_type: [
        {
          required: true,
          message: '请选择执行结果',
          trigger: ['change'],
        },
      ],
      end_time: [
        {
          required: true,
          message: '请选择结束日期',
          trigger: ['change'],
        },
      ],
      remark: [
        {
          required: true,
          message: '请输入备注说明',
          trigger: ['blur'],
        },
      ],
      cycle_month: [
        {
          required: true,
          message: '请选择清算周期',
          trigger: ['change'],
        },
      ],
      attachment_urls: [
        {
          required: true,
          message: '请上传项目复盘报告',
          trigger: ['change'],
        },
      ],
    };
    const saveReq = useRequest(postEndProject, { manual: true });
    const { business_type } = useProjectBaseInfo();
    const methods = {
      show(project_id: number, data?: any) {
        formData.value = {
          ...initFormData(),
          id: project_id,
          ...(data || {}),
        };
      },
      onSaveBtnClick() {
        formRef.value?.validate(async valid => {
          if (valid) {
            const res = await saveReq.runAsync(
              {
                ...formData.value,
              },
              business_type.value || E.project.BusinessType.douyin,
            );
            if (res.data.success) {
              Message.success(res.data.message || '保存成功');
              ctx.emit('close');
              ctx.emit('submit');
            } else {
              Message.error(res.data.message || '保存失败');
            }
          }
        });
      },
    };
    const enumEndOptions = (() => {
      return ((enumEndType() as any[]) || []).filter((el: any) => el.value < 3);
    })();
    const liquidationPeriodOptions = (() => {
      return Array(6)
        .fill(0)
        .map((el, index) => ({
          label: `${index + 1}个月`,
          value: index + 1,
        }));
    })();
    return {
      formRef,
      rules,
      formData,
      saveReq,
      enumEndOptions,
      liquidationPeriodOptions,
      ...methods,
    };
  },
  render() {
    const { formData, rules, enumEndOptions, liquidationPeriodOptions } = this;
    return (
      <div class="tg-live-finish-project-dialog">
        <el-form
          rules={rules}
          label-width="68px"
          ref="formRef"
          props={{ model: formData }}
          size="mini"
        >
          <el-form-item label="执行结果：" prop="end_type">
            <el-select v-model={formData.end_type} placeholder="请选择" style="width: 100%">
              {enumEndOptions.map(el => (
                <el-option label={el.label} value={el.value} key={el.value}></el-option>
              ))}
            </el-select>
          </el-form-item>
          <el-form-item label="结束日期：" prop="end_time">
            <el-date-picker
              style="width: 100%"
              v-model={formData.end_time}
              type="date"
              placeholder="选择日期"
              format="yyyy.MM.dd"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="备注说明：" prop="remark">
            <el-input
              type="textarea"
              maxlength={100}
              style="width: 100%"
              v-model={formData.remark}
              placeholder="请填写项目背景、结束原因等信息（限100字）"
            ></el-input>
          </el-form-item>
          <el-form-item label="清算周期：" prop="cycle_month">
            <el-select v-model={formData.cycle_month} placeholder="请选择" style="width: 100%">
              {liquidationPeriodOptions.map(el => (
                <el-option label={el.label} value={el.value} key={el.value}></el-option>
              ))}
            </el-select>
            <div class="liquidation-period-tips">清算期结束后不允许发起结算</div>
          </el-form-item>
          <el-form-item label="上传附件：" prop="attachment_urls">
            <tg-upload
              action="/api/resources/upload_file"
              data={{ type: 'end_project' }}
              show-file-list={false}
              beforeUpload={FormValidation.ValidationFileUpload({
                // excel: true,
                fileSize: 30,
                // doc: true,
                // pdf: true,
              })}
              success={(res: any) => {
                if (!res.success) {
                  Message.error(res.message);
                  return;
                }
                formData.attachment_urls?.push(res.data.source);
                this.formRef?.validateField('attachment_urls');
              }}
            >
              <div class="upload-operator">
                <tg-button disabled={(formData.attachment_urls?.length || 0) >= 10}>
                  项目复盘报告
                </tg-button>
                <div class="upload-tips">需包含业务数据与财务结算数据</div>
              </div>
            </tg-upload>
            <upload-file-list v-model={formData.attachment_urls} />
          </el-form-item>
        </el-form>
        <tg-mask-loading visible={this.saveReq.loading} content="  正在保存，请稍候..." />
      </div>
    );
  },
});
