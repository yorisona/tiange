<!--
 * @Author: 肖槿
 * @Date: 2020-04-26 11:18:27
 * @Description: 
 * @LastEditors: 肖槿
 * @LastEditTime: 2020-04-26 14:16:40
 * @FilePath: \goumee-star-frontend\src\views\medium\components\uploadFile.vue
 -->
<script>
export default {
  name: 'uploadFile',
  props: {
    value: {
      type: Array,
      default: () => [],
    },
    showFileList: {
      type: Boolean,
      default: false,
    },
    action: {
      type: String,
      default: '',
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
  render(h) {
    return h('div', {}, [
      h(
        'el-upload',
        {
          class: 'kol-upload',
          ref: 'kolCaseUpload',
          props: {
            action: this.action,
            httpRequest: this.uploadFile,
            showFileList: this.showFileList,
          },
        },
        [
          h(
            'el-button',
            {
              class: 'mr10 btn-blue big-button upload-btn',
              props: {
                size: 'small',
                type: 'primary',
                loading: this.loading,
              },
              slot: 'trigger',
            },
            [h('i', { class: 'iconfont icon-zhongxinshangchuan' }), h('span', {}, '上传文件')],
          ),
          h(
            'span',
            {
              class: 'el-upload__tip',
              slot: 'tip',
            },
            '支持扩展名：.docx .pdf .jpg .xlsx',
          ),
        ],
      ),
      this.value.map((v, k) => {
        return h(
          'div',
          {
            class: 'fujian-list clearfix',
            props: {
              key: v,
            },
          },
          [
            h('i', { class: 'iconfont iconfujian mr5' }),
            h('span', { class: 'brand-color mr5' }, v.split('/')[v.split('/').length - 1] || '--'),
            h('i', {
              class: 'el-icon-error',
              on: {
                click: () => {
                  this.removeCase(k);
                },
              },
            }),
          ],
        );
      }),
    ]);
  },
  methods: {
    removeCase(idx) {
      this.$emit('delete', idx);
    },
    /**
     * 上传文件成功时回调
     */
    uploadFile(params) {
      this.$emit('success', params);
    },
  },
};
</script>
<style lang="scss" scoped></style>
