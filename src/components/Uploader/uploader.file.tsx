/**
 * 文件上传
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-10-31 17:26:49
 */
import { defineComponent, ref, watch } from '@vue/composition-api';
import type { PropType } from '@vue/composition-api';
import { getToken } from '@/utils/token';
import { getFileExtension } from '@/utils/func';

/**
 * Uploader
 * tsx + composition-api version
 * @author Jerry <superzcj_001@163.com>
 * @since  2020-08-25 13:57:21
 */
export default defineComponent({
  name: 'TgFileUploader',
  props: {
    action: {
      type: String,
    },
    /** 初始文件名称 */
    name: {
      type: String,
    },
    /** 初始化的图片URL */
    value: String,
    /** 上传成功回调 */
    onSuccess: {
      type: Function as PropType<(url: string, file: File) => void>,
    },
    /** 上传失败回调 */
    onUploadError: {
      type: Function as PropType<(error: any, file: File) => void>,
    },
    /** 图片最大体积(KB) */
    maxSize: {
      type: Number,
      default: 51200,
    },
    /** 无上传图时提示文本 */
    emptyText: {
      type: String,
      default: '上传图片',
    },
    /** 允许上传的文件类型 */
    accept: {
      type: String,
      default: '.png,.jpg,.jpeg,.pdf',
    },
    /** 按钮内容 */
    buttonText: {
      type: String,
      default: '上传PDF/图片介绍',
    },
    showFileList: {
      type: Boolean,
    },
  },
  setup(props, ctx) {
    const url = ref(props.value);
    const file = ref<File | null>(null);
    const loading = ref(false);

    /**
     * 删除自己
     * @author Jerry <superzcj_001@163.com>
     * @since  2020-08-04 10:43:51
     */
    const remove = () => {
      url.value = '';
      file.value = null;
      ctx.emit('remove');
    };

    watch(
      () => props.value,
      (val, prevVal) => {
        if (val !== prevVal) {
          url.value = val;
        }
      },
    );

    return {
      url,
      file,
      loading,
      remove,
    };
  },
  render() {
    const uploaderProps = {
      class: ['tg-file-uploader'],
      props: {
        action: this.action,
        drag: true,
        headers: {
          Authorization: getToken(),
        },
        accept: this.accept,
        withCredentials: true,
        multiple: false,
        showFileList: this.showFileList ?? undefined,
        fileList: this.url
          ? [
              {
                name: this.name,
                url: this.value,
              },
            ]
          : [],
        onPreview: () => {
          /** do nth */
        },
        onRemove: () => {
          this.$emit('file:remove');
        },
        onSuccess: (
          response: { data: { preview: string; size: number; source: string } },
          file: File,
        ) => {
          this.url = response.data.source;
          this.file = file;
          this.loading = false;

          this?.onSuccess?.(this.url, file);
        },
        onError: () => {
          /** do nth */
        },
        onChange: () => {
          /** do nth */
        },
        onProgress: () => {
          /** do nth */
        },
        beforeUpload: (file: File) => {
          this.loading = true;
          if (file.size > this.maxSize * 1024 * 1024) {
            this.$message.error(
              `${file.name} ${(file.size / 1024 / 1024).toFixed(2)}MB 请限制在${Math.ceil(
                this.maxSize / 1024,
              )}MB以内`,
            );
            this.loading = false;
            return false;
          }
          if (
            !['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'].includes(file.type) &&
            !['.jpeg', '.jpg', '.png', '.pdf'].includes(getFileExtension(file.name))
          ) {
            this.$message.warning('图片格式不正确，请使用 jpg / jpeg / png');
            this.loading = false;

            return false;
          }
        },
      },
    };

    return (
      <el-upload {...uploaderProps}>
        <tg-button icon="ico-btn-upload">{this.buttonText}</tg-button>
        <div class="upload-tips" slot="tip">
          {this.$slots.tip}
        </div>
      </el-upload>
    );
  },
});
