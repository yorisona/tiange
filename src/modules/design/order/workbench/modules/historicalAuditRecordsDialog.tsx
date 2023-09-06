import { ref, defineComponent, h } from '@vue/composition-api';
import uploadName from './uploadName';
import { History_Structure } from '../../useOrder';

export default defineComponent({
  name: 'historicalAuditRecordsDialog',
  components: {
    uploadName,
  },
  setup(props, ctx) {
    const commentList = ref<History_Structure[]>();
    const show = (value: History_Structure[]) => {
      commentList.value = value;
    };

    const fileList = ref([
      'http://feishu.corp.goumee.com/test2/resources/settlement/20221009/1665293584/company_img.png',
      'http://feishu.corp.goumee.com/test2/resources/settlement/20221009/1665293599/contract_opreate_icon_annex_1.png',
      'http://feishu.corp.goumee.com/test2/resources/settlement/20221009/1665293614/anchor_sprite_icon.png',
      'http://feishu.corp.goumee.com/test2/resources/settlement/20221009/1665293637/anchor_sprite_icon.png',
    ] as any);

    const onSaveBtnClick = async () => {
      ctx.emit('submit');
    };

    return { onSaveBtnClick, show, fileList, commentList };
  },
  render() {
    return (
      <div class="order-detail-box">
        <div class="grid-box grid-one-colums" style="padding: 24px 24px 8px;">
          {this.commentList &&
            this.commentList.map((Item, index) => {
              return (
                <div class="grid-box-item-two-columns">
                  <div class="grid-box-item col-span-full">
                    <div class="grid-box-item-title">设计稿：</div>
                    <div class="grid-box-item-two-columns file-list-item" style="width: 100%">
                      {Item?.attachment?.map(item => {
                        return <uploadName filepath={item.url} />;
                      })}
                    </div>
                  </div>
                  <div class="grid-box-item col-span-full">
                    <div class="grid-box-item-title">审核意见：</div>
                    <div class="grid-box-item-columns">
                      <div class="grid-box-item-columns">
                        <span>{Item.audit_comment}</span>
                        <span class="label-time">
                          {Item.audit_by_name} {Item.gmt_modified}
                        </span>
                      </div>
                      {Item.comment_list.length > 0 ? (
                        Item.comment_list.map(item => {
                          return (
                            <div class="grid-box-item-columns mgb-10">
                              <span style="margin-bottom: 2px;">{item.comment}</span>
                              <span class="label-time">
                                {item.add_by_name} {item.gmt_modified}
                              </span>
                            </div>
                          );
                        })
                      ) : (
                        <span></span>
                      )}
                    </div>
                  </div>
                  <div class="grid-box-item">
                    <div class="grid-box-item-title">审核人：</div>
                    <div class="grid-box-item-content">{Item.audit_by_name}</div>
                  </div>
                  <div class="grid-box-item">
                    <div class="grid-box-item-title">审核时间：</div>
                    <div class="grid-box-item-content">{Item.gmt_modified}</div>
                  </div>
                  <div
                    v-show={index + 1 !== this.commentList?.length}
                    class="line col-span-full mgb-16"
                  ></div>
                </div>
              );
            })}
        </div>
      </div>
    );
  },
});
