import { defineComponent, reactive, ref } from '@vue/composition-api';
import { save_integral_m_give_record, Query_Listed_Integral_Goods } from '@/services/integral';
import { ElForm } from 'element-ui/types/form';
import inputLimit from '@/utils/inputLimit';
import { useRequest } from '@gm/hooks/ahooks';
import { Message } from 'element-ui';
// import { Confirm } from '@/use/asyncConfirm';
import { OptionType } from '@/types/base/advanced';
import { GetAuthQueryUser } from '@/services/supplier';

type GoodInfo = TG.HttpListResultType<typeof Query_Listed_Integral_Goods>;
export default defineComponent({
  setup(props, ctx) {
    const reqSave = useRequest(save_integral_m_give_record, { manual: true });

    const show = (value: GoodInfo) => {};
    const formData = reactive<{
      m_num: number | undefined;
      executor: number | undefined;
      comment: string;
    }>({
      m_num: undefined,
      executor: undefined,
      comment: '',
    });
    const formRef = ref<ElForm>();
    const onSaveBtnClick = () => {
      formRef.value?.validate(err => {
        if (!err) return;
        reqSave
          .runAsync({
            m_num: formData.m_num,
            to_user_id: formData.executor,
            reason: formData.comment,
          })
          .then((e: any) => {
            if (e.data.success) {
              Message.success(e.data.message || '赠送成功');
            } else {
              Message.error(e.data.message || '赠送失败');
            }
            ctx.emit('submit');
            ctx.emit('close');
          });
        // const service = Loading.service({ background: 'rgba(0,0,0,0.1)' });
        // Promise.resolve(Confirm('确定兑换吗?'))
        //   .then(() => {
        //     return reqSave.runAsync({
        //       m_num: formData.m_num,
        //       to_user_id: info.value.id,
        //       reason: formData.comment,
        //     });
        //   })
        //   .then(() => {
        //     Message.success('兑换成功');
        //     ctx.emit('submit');
        //     ctx.emit('close');
        //   })
        //   .finally(() => {
        //     service.close();
        //   });
      });
    };
    /* 搜索花名 */
    const search_executor_list = ref<OptionType<number>[]>([]);
    const search_executor = async (search: string) => {
      GetAuthQueryUser({
        search_value: search,
        search_type: 2,
        is_checked: 1,
      }).then((res: any) => {
        search_executor_list.value = res.data.map((item: any) => {
          return {
            label: item.username,
            value: item.id,
          };
        });
      });
    };
    return {
      show,
      formRef,
      formData,
      onSaveBtnClick,
      search_executor_list,
      search_executor,
    };
  },
  render() {
    const { formData } = this;
    return (
      <div class="givingAway">
        <el-form
          ref="formRef"
          size="mini"
          label-width="70px"
          attrs={{ model: this.formData }}
          class="m-currency-edit-goods-dialog-content"
        >
          <el-form-item
            prop="executor"
            label="受赠人："
            rules={{ required: true, message: '请输入并选择花名', trigger: 'change' }}
          >
            <el-select
              placeholder="请输入花名"
              v-model={formData.executor}
              filterable={true}
              remote={true}
              style={'width:100%'}
              // disabled={isDisable_contract_id}
              remote-method={this.search_executor}
            >
              {this.search_executor_list.map((item, key) => (
                <el-option key={key} value={item.value} label={item.label} />
              ))}
            </el-select>
          </el-form-item>
          <el-form-item
            prop="m_num"
            label="赠送金额："
            rules={{ required: true, message: '请输入金额', trigger: 'change' }}
          >
            <el-input
              v-model={formData.m_num}
              // maxLength={5}
              placeholder={`请输入金额`}
              onInput={(val: string) => {
                formData.m_num = inputLimit.Interger(val) as any;
              }}
            />
          </el-form-item>
          <el-form-item
            prop="comment"
            class="textarea-box"
            label="赠送理由："
            rules={{ required: true, message: '请输入赠送理由', trigger: 'change' }}
          >
            <el-input
              type="textarea"
              class="textarea"
              rows="3"
              show-word-limit
              maxlength="50"
              v-model={formData.comment}
              placeholder={`请输入请输入赠送理由`}
            ></el-input>
          </el-form-item>
          <el-form-item label="审核人员：" class="audit" style="color:#888">
            {/* <div class="reviewer">
              <span></span> */}
            <span>苦瓜，黛拉</span>
            {/* </div> */}
          </el-form-item>
        </el-form>
      </div>
    );
  },
});
