/**
 * 卡片式预览文件(组)
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-12-14 15:05:51
 */

import { defineComponent, PropType } from '@vue/composition-api';
import TgFileCard from './file.card';

export default defineComponent({
  name: 'TgFileCardGroup',
  components: { TgFileCard },
  props: {
    /** 文件列表 */
    filelist: {
      type: Array as PropType<{ filename: string; url: string }[]>,
      default: () => [],
    },
    /** 是否能删除  */
    editable: {
      type: Boolean,
      default: false,
    },
  },
  render() {
    return (
      <div class="tg-file-card-group">
        {this.filelist.map(file => {
          const props = {
            attrs: {
              filename: file.filename,
              url: file.url,
              editable: this.editable,
            },
            on: {
              remove: () => {
                this.$emit('remove', file.url);
              },
            },
          };
          return <TgFileCard {...props} />;
        })}
        {this.$slots.default}
      </div>
    );
  },
});
