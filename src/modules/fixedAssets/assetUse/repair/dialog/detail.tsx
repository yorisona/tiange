import { ref, defineComponent, h } from '@vue/composition-api';
import { comonColumn } from '@/modules/fixedAssets/use';

export default defineComponent({
  setup(props, ctx) {
    const formData = ref<any>({});
    const show = (val: any) => {
      formData.value = val;
    };
    const close = () => {
      ctx.emit('close');
    };
    const onSaveBtnClick = async () => {
      ctx.emit('submit', {
        id: formData.value.id,
        maintenance_amount: formData.value.maintenance_amount,
      });
    };
    return {
      formData,
      show,
      close,
      onSaveBtnClick,
    };
  },
  render() {
    const { formData } = this;
    return (
      <el-form class="from-wrap" model={this.formData}>
        <el-form-item label="申请人：">
          <span style="color:var(--text-color)">{formData.add_by_name}</span>
        </el-form-item>
        <el-form-item>
          <div class="mgb-6">维修明细：</div>
          <tg-table border data={[formData]} columns={comonColumn}>
            <template slot="empty">
              {/* <span>暂无数据</span> */}
              <fragments></fragments>
            </template>
          </tg-table>
        </el-form-item>
        <el-form-item label="送修单位：">
          <span>{formData.company_name ?? '--'}</span>
        </el-form-item>
        <el-form-item label="维修金额：">
          {formData.maintenance_status === E.fixedassets.AssetCompletionStatusEnum.not_returned ? (
            <el-input
              style="width:268px"
              size="mini"
              v-only-number={{ precision: 2 }}
              v-model={this.formData.maintenance_amount}
            >
              <template slot="append">元</template>
            </el-input>
          ) : (
            <span>{this.formData.maintenance_amount / 100}</span>
          )}
        </el-form-item>
      </el-form>
    );
  },
});
