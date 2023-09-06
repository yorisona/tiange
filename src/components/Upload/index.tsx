import { defineComponent, PropType, ref } from '@vue/composition-api';
import { getCode, getToken } from '@/utils/token';
import { Message } from 'element-ui';

/**
 * 天鸽上传组件, 基本只需要传递,成功回调和上传前校验就行
 */
export default defineComponent({
  name: 'TgUpload',
  props: {
    /** 成功时回调 **/
    success: {
      type: Function as PropType<(...args: any) => void>,
    },
    /** 是否隐藏上传时loading **/
    'hide-loading': {
      type: Boolean,
    },
    /** 上传前校验 传递file对象 **/
    beforeUpload: {},
  },
  setup() {
    const loading = ref<boolean>(false);
    return {
      loading,
    };
  },
  render() {
    const options = {
      attrs: {
        headers: {
          Authorization: getToken(),
          Actcode: getCode(),
        },
        'on-success': async (...args: any) => {
          const success: any = this.success;
          if (!this.hideLoading) {
            this.loading = false;
          }

          success(...args);
        },
        'on-progress': async (event: any, file: any, fileList: any) => {
          if (!this.hideLoading) {
            this.loading = true;
          }
        },
        'on-exceed': () => {
          Message.error('超出最大数量限制');
        },
        ...this.$attrs,
      },
      on: this.$listeners,
      props: {
        'before-upload': this.beforeUpload,
      },
      slots: this.$slots,
    };
    return (
      <div>
        <el-upload {...options} v-loading={this.loading}>
          {this.$slots.default}
        </el-upload>
      </div>
    );
  },
});
