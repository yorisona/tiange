<!--
 * @Author: 肖槿
 * @Date: 2020-04-26 15:34:18
 * @Description:
 * @LastEditors: 肖槿
 * @LastEditTime: 2020-04-26 16:55:31
 * @FilePath: \goumee-star-frontend\src\views\medium\components\uploadPicture.vue
 -->
<script>
export default {
  name: 'uploadPicture',
  props: {
    value: {
      type: String,
      default: '',
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
    keyData: {
      type: Object,
      default: () => {
        /* do nth */
      },
    },
    token: {
      type: String,
      default: '',
    },
    listType: {
      type: String,
      default: 'picture-card',
    },
    limit: {
      type: Number,
      default: 2,
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
          class: this.value && 'has-img',
          ref: 'kolCaseUpload',
          props: {
            action: this.action,
            httpRequest: this.uploadFile,
            showFileList: this.showFileList,
            data: this.keyData,
            size: this.limit,
            listType: this.listType,
          },
        },
        [
          this.value
            ? h('span', {}, [
                h('img', {
                  attrs: {
                    src: this.value + '?Authorization=' + this.token,
                  },
                }),
                h('i', {
                  class: 'el-icon-error',
                  on: {
                    click: $event => {
                      this.removePic($event);
                    },
                  },
                }),
              ])
            : h('i', { class: 'iconfont iconshangchuantupian grey-color' }),
          !this.value &&
            h('span', {
              class: 'el-upload__tip line-height251 grey-color',
              slot: 'tip',
              domProps: { innerHTML: '图片大小：不高于2M<br />支持扩展名：.jpg .jpeg' },
            }),
        ],
      ),
    ]);
  },
  methods: {
    removePic(e) {
      e.stopPropagation();
      this.$emit('delete-img');
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
<style lang="less" scoped>
.grey-color {
  color: #cdcecf;
}
.line-height251 {
  line-height: 25px;
  width: calc(100% - 70px);
  float: right;
  margin-top: 0;
}
</style>
