import { Modify_Reservation_Form, Query_Image_Designer } from '@/services/design';
import { defineComponent, onMounted, ref } from '@vue/composition-api';
import { ElForm } from 'element-ui/types/form';

interface FormDataType {
  designerId: number | undefined;
}

export default defineComponent({
  setup(props, ctx) {
    const orderId = ref<number | undefined>(undefined);
    const loading = ref(false);
    const formData = ref<FormDataType>({
      designerId: undefined,
    });
    const formRef = ref<ElForm | undefined>(undefined);
    const designerList = ref<{ real_name: string; username: string; id: number }[]>([]);
    const methods = {
      show(id: number) {
        orderId.value = id;
      },
      onSaveBtnClick() {
        formRef.value?.validate(valid => {
          if (valid) {
            methods.modifyReservationForm();
          }
        });
      },
      async queryImageDesigner() {
        const res = await Query_Image_Designer(
          {
            num: 20,
            page_num: 1,
          },
          {},
        );
        if (res.data.success) {
          designerList.value = res.data.data.data ?? [];
        }
      },
      async modifyReservationForm() {
        if (!orderId.value || !formData.value.designerId) {
          return;
        }
        loading.value = true;
        const res = await Modify_Reservation_Form({
          id: orderId.value,
          operation_type: 8,
          image_design_id: formData.value.designerId,
        });
        loading.value = false;
        if (res.data.success) {
          ctx.root.$message.success(res.data.message);
          ctx.emit('submit');
          ctx.emit('close');
        } else {
          ctx.root.$message.error(res.data.message);
        }
      },
    };

    onMounted(() => {
      methods.queryImageDesigner();
    });

    return {
      loading,
      formData,
      formRef,
      designerList,
      ...methods,
    };
  },
  render() {
    return (
      <div class="tg-image-designer-adjust-container">
        <el-form
          size="small"
          ref="formRef"
          label-width="56px"
          attrs={{
            model: this.formData,
          }}
        >
          <el-form-item
            label="妆造师："
            prop="designerId"
            rules={{ required: true, message: '请选择妆造师', trigger: ['change'] }}
          >
            <el-select
              style="width: 100%"
              v-model={this.formData.designerId}
              placeholder="请选择妆造师"
            >
              {this.designerList.map(el => (
                <el-option key={el.id} label={el.username} value={el.id}></el-option>
              ))}
            </el-select>
          </el-form-item>
        </el-form>
        <tg-mask-loading visible={this.loading} content="  正在保存，请稍候..." />
      </div>
    );
  },
});
