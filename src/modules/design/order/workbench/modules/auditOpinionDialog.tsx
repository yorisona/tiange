import { defineComponent, ref } from '@vue/composition-api';
import { Set_Design_Order_Get_Comment, Set_Design_Order_add_comment } from '@/services/design';
import { useRouter } from '@/use/vue-router';

export default defineComponent({
  // props: {
  //   info: {
  //     type: Object,
  //   },
  // },
  setup(props, ctx) {
    const type = ref('');
    const comments = ref<any>([]);
    const show = (value: string, commentsList?: any[]) => {
      type.value = value;
      commentsList?.length && (comments.value = commentsList);
    };

    const formData = ref({
      comment: '',
    } as any);
    const router = useRouter();
    const onSaveBtnClick = async () => {
      formRef.value?.validate(success => {
        if (success) {
          Set_Design_Order_add_comment({
            order_id: router.currentRoute.query.order_id as any,
            comment: formData.value.comment,
          }).then(res => {
            if (res.data.error_code === 0) {
              loadComment();
              formData.value.comment = '';
              ctx.root.$message.success(res.data.message ?? '保存成功');
            } else {
              ctx.root.$message.error(res.data.message ?? '保存失败');
            }
          });
          // ctx.emit('submit', {
          //   type: type.value,
          //   message: formData.value.comment,
          // });
        }
      });
    };
    const loadComment = async () => {
      const res = await Set_Design_Order_Get_Comment({
        order_id: router.currentRoute.query.order_id as any,
      });
      if (res.data.error_code === 0) {
        comments.value = res.data.data;
      }
    };
    loadComment();
    const formRef = ref<IFormRef>();
    return { onSaveBtnClick, show, formData, formRef, type, comments };
  },
  render() {
    const { formData } = this;
    return (
      <div class="dialog-container">
        <el-form
          size="small"
          ref="formRef"
          hide-required-asterisk={true}
          attrs={{
            model: formData,
          }}
        >
          <el-form-item
            prop="comment"
            class="textarea-box"
            rules={{ required: true, message: '请填写' + this.type, trigger: 'blur' }}
          >
            <el-input
              type="textarea"
              class="textarea"
              rows="4"
              show-word-limit
              v-model={formData.comment}
              placeholder={`请输入${this.type}`}
            ></el-input>
            <span class="btn" onClick={this.onSaveBtnClick}>
              发表意见
            </span>
          </el-form-item>
        </el-form>
        <div class="comments-box">
          <div class="line"></div>
          <empty-common v-show={!this.comments?.length} class="empty" detail-text={'暂无意见'} />
          {this.comments?.length > 0 &&
            this.comments.map((item: any, index: number) => {
              return (
                <div>
                  <div class="name">
                    {item.add_by_name}
                    <span class="mgl-10">{item.gmt_create}</span>
                  </div>
                  <div>{item.comment}</div>
                  <div class="line" v-show={index + 1 !== this.comments?.length}></div>
                </div>
              );
            })}
        </div>
        <div class="btn-box">
          <tg-button
            class="mgl-10 tg-btn tg-btn-primary"
            type="primary"
            onClick={() => this.$emit('close')}
          >
            确定
          </tg-button>
        </div>
      </div>
    );
  },
});
