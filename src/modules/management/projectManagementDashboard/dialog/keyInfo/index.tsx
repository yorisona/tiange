import {
  Query_Operate_Manage_Poject_Operating_Project_comment,
  Add_Operate_Manage_Poject_Operating_Project_comment,
  Delete_Operate_Manage_Poject_Operating_Project_comment,
} from '@/services/management';
import { AsyncConfirm } from '@/use/asyncConfirm';
import { useRequest } from '@gm/hooks/ahooks';
import { defineComponent, h, ref } from '@vue/composition-api';
import { Message } from 'element-ui';
export default defineComponent({
  setup(props, ctx) {
    const formData = ref<{ project_id: number | undefined; comment: string | undefined }>({
      project_id: undefined,
      comment: undefined,
    });
    const reqList = useRequest(Query_Operate_Manage_Poject_Operating_Project_comment, {
      manual: true,
    });
    const reqAdd = useRequest(Add_Operate_Manage_Poject_Operating_Project_comment, {
      manual: true,
      onSuccess(data, oData) {
        Message.success((oData as any).message);
        reqList.reload();
        formData.value.comment = undefined;
      },
    });
    const reqDelete = useRequest(Delete_Operate_Manage_Poject_Operating_Project_comment, {
      manual: true,
      onSuccess(data, oData) {
        Message.success((oData as any).message);
        reqList.reload();
      },
    });
    const methods = {
      show(project_id: number) {
        formData.value.project_id = project_id;
        reqList.runAsync({
          project_id,
        });
      },
      onSaveBtnClick() {
        ctx.emit('close');
        ctx.emit('submit');
      },
      async onDeleteHandler(id: number) {
        const result = await AsyncConfirm(ctx, {
          title: '确定要删除该条信息吗？',
        });
        if (result) {
          reqDelete.runAsync({
            id,
          });
        }
      },
    };

    return {
      reqList,
      reqAdd,
      reqDelete,
      formData,
      ...methods,
    };
  },
  render() {
    const list = this.reqList.data || [];
    return (
      <div class="tg-key-info-page-container">
        <section class="input-field">
          <el-input
            vModel_trim={this.formData.comment}
            resize="none"
            type="textarea"
            placeholder="请输入关键信息（限100字）"
            maxlength={100}
          ></el-input>
          <tg-button
            class="add-btn"
            type="link"
            disabled={(this.formData.comment?.length || 0) === 0}
            onClick={() => {
              this.reqAdd.runAsync({
                comment: this.formData.comment,
                project_id: this.formData.project_id,
              });
            }}
          >
            添加
          </tg-button>
        </section>
        <div class="middle-line"></div>
        <section class="key-info-list">
          {list.length ? (
            list.map((el: any) => {
              return (
                <div key={el} class="key-info-item">
                  <div class="header">
                    <div class="left">
                      <span class="name">{el.add_by_username}</span>
                      <span class="time">{el.gmt_created?.replace(/-/g, '.')}</span>
                    </div>
                    <tg-icon
                      name="ico-common-shanchu-linear"
                      onClick={() => {
                        this.onDeleteHandler(el.id);
                      }}
                    ></tg-icon>
                  </div>
                  <div class="content">{el.comment}</div>
                </div>
              );
            })
          ) : (
            <div>
              <empty-common
                class="empty-container"
                style="margin-top: 60px;"
                detail-text="暂无信息"
              ></empty-common>
            </div>
          )}
        </section>
      </div>
    );
  },
});
