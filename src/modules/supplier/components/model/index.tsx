/*
 * @Author: 肖槿
 * @Date: 2021-11-09 11:14:46
 * @Description: 模特卡片
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-12-06 16:07:14
 * @FilePath: \goumee-star-frontend\src\modules\supplier\components\model\index.tsx
 */
import { defineComponent } from '@vue/composition-api';
export default defineComponent({
  props: {
    item: {
      type: Object,
      default: () => {},
    },
    cover: {
      type: String,
      default: '',
    },
    isEdit: {
      type: Boolean,
      default: false,
    },
    isShow: {
      type: Boolean,
      default: true,
    },
    showPreview: {
      type: Boolean,
      default: false,
    },
    isReview: {
      type: Boolean,
      default: false,
    },
    isDelete: {
      type: Boolean,
      default: false,
    },
  },
  render() {
    return (
      <div class="model-picture">
        <div class="cover">
          <tg-image src={this.cover} alt={this.item.flower_name} />
        </div>
        <div class="name">
          {'verify_status' in this.item && (
            <span class={'point ' + 'point-' + this.item.verify_status}></span>
          )}
          <span class="nickname">{this.item.flower_name}</span>
          <span class="realname">({this.item.real_name})</span>
        </div>
        <div class="action">
          {this.showPreview && (
            <tg-icon
              name="ico-icon_zhaopian"
              title="预览"
              onClick={() => {
                this.$emit('preview', this.item);
              }}
            />
          )}
          {this.isShow && (
            <tg-icon
              name="ico-icon_chakan"
              title="查看"
              onClick={() => {
                this.$emit('show', this.item);
              }}
            />
          )}
          {this.isEdit && (
            <tg-icon
              name="ico-icon_bianji"
              title="编辑"
              onClick={() => {
                this.$emit('edit', this.item);
              }}
            />
          )}
          {this.isReview && (
            <tg-icon
              name="ico-icon_shenhe"
              title="审核"
              onClick={() => {
                this.$emit('review', this.item);
              }}
            />
          )}
          {this.isDelete && (
            <tg-icon
              name="ico-btn-delete"
              title="删除"
              onClick={() => {
                this.$emit('delete', this.item);
              }}
            />
          )}
        </div>
      </div>
    );
  },
});
