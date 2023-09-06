import { defineComponent, computed, PropType } from '@vue/composition-api';
import utils from '@/utils';
const enum UploadFileTheme {
  default = 1,
}
export default defineComponent({
  name: 'UploadFileList',
  props: {
    value: Array,
    /** 是否显示左侧icon */
    icon: {
      type: Boolean,
      default: true,
    },
    /** 是否显示删除 */
    delete: {
      type: Boolean,
      default: true,
    },
    /** 是否一行展示(辣椒)  */
    inline: {
      type: Boolean,
      default: false,
    },
    /** 一行展示有几列 **/
    column: {
      type: Number,
      default: 1,
    },
    /** 主题风格 暂时只有1 **/
    theme: {
      type: Number as PropType<UploadFileTheme>,
      default: 1,
    },
    /** 是否溢出隐藏 */
    ellipsis: {
      type: String,
      default: '',
    },
  },
  setup(prop) {
    const className = computed(() => {
      return (
        'upload-file-list' +
        (prop.inline ? ' upload-file-list-inline' : '') +
        (prop.column === 3 ? ' column-3' : '') +
        (prop.column === 2 ? ' column-2' : '')
      );
    });
    return {
      className,
    };
  },
  render() {
    const value: any = this.value;
    return (
      <div class={this.className}>
        {value?.map((item: string, key: number) => {
          const iconDom = this.icon && <tg-icon name={utils.getFileInfo(item).icoName} />;
          const filenameDom = this.ellipsis ? (
            <p class="file-name" v-ellipsis={this.ellipsis}>
              {utils.basename(item)}
            </p>
          ) : (
            <p class="file-name">{utils.basename(item)}</p>
          );
          const deleteDom = this.delete && (
            <tg-icon
              className="icon-delete"
              name="ico-a-quseguanbiicon2x"
              onClick={() => {
                value.splice(key, 1);
                this.$emit('delete');
              }}
            />
          );
          return (
            <div class="file-item" key={key}>
              {iconDom}
              {filenameDom}
              {this.$scopedSlots.append && this.$scopedSlots.append(item)}
              {deleteDom}
            </div>
          );
        })}
      </div>
    );
  },
});
