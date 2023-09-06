/**
 * 图片上传
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-10-31 17:26:49
 */
import { defineComponent, h, ref, watch } from '@vue/composition-api';
import type { PropType } from '@vue/composition-api';
import { getCode, getToken } from '@/utils/token';
import { getRect } from './fileFunctions';
import { fixFileToken } from '@/utils/http';
import { getFileExtension } from '@/utils/func';

/**
 * Uploader
 * tsx + composition-api version
 * @author Jerry <superzcj_001@163.com>
 * @since  2020-08-25 13:57:21
 */
export default defineComponent({
  name: 'TgUploader',
  props: {
    action: {
      type: String,
    },
    /** 初始化的图片URL */
    value: String,
    /** 上传前回调 */
    onBeforeUpload: {
      type: Function as PropType<(file: File) => void>,
    },
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
      default: 2048,
    },
    /** 无上传图时提示文本 */
    emptyText: {
      type: String,
      default: '上传图片',
    },
    /** 最小宽高范围 */
    minSizeRange: {
      type: Array as unknown as PropType<[number, number]>,
    },
    /** 最大宽高范围 */
    maxSizeRange: {
      type: Array as unknown as PropType<[number, number]>,
    },
    /** 自定义上传实现 */
    httpRequest: {
      type: Function as PropType<(value: any) => void | Promise<any>>,
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

    // 检测图片宽高
    const interceptFileSizeRange = async (file: File) => {
      const { width, height } = await getRect(file);

      if (props.minSizeRange !== undefined) {
        const [minWidth, minHeight] = props.minSizeRange;

        if (width >= minWidth && height >= minHeight) {
          return true;
        } else {
          ctx.root.$message.warning(
            `图片大小至少${minWidth} * ${minHeight}, 当前${width} * ${height}`,
          );
          return false;
        }
      } else if (props.maxSizeRange !== undefined) {
        const [maxWidth, maxHeight] = props.maxSizeRange;

        if (width <= maxWidth && height <= maxHeight) {
          return true;
        } else {
          ctx.root.$message.warning(
            `图片大小不能超过${maxWidth} * ${maxHeight}, 当前${width} * ${height}`,
          );
          return false;
        }
      } else {
        return true;
      }
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
      interceptFileSizeRange,
    };
  },
  render() {
    const uploaderProps = {
      class: ['tg-uploader'],
      props: {
        action: this.action,
        drag: true,
        headers: {
          Authorization: getToken(),
          Actcode: getCode(),
        },
        accept: '.jpg,.jpeg,.png',
        withCredentials: true,
        multiple: false,
        showFileList: false,
        onPreview: () => {
          /** do nth */
        },
        onRemove: () => {
          /** do nth */
        },
        onSuccess: (
          response: { data: { preview: string; size: number; source: string } },
          file: File,
        ) => {
          if (response === undefined) {
            return;
          }

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
        beforeUpload: async (file: File) => {
          this.loading = true;
          if (file.size > this.maxSize * 1024 * 1024) {
            this.$message.error(
              `${file.name} ${(file.size / 1024 / 1024).toFixed(2)}MB 请限制在${Math.ceil(
                this.maxSize / 1024,
              )}MB以内`,
            );
            this.loading = false;
            return Promise.reject();
          }
          if (
            !['image/jpeg', 'image/jpg', 'image/png'].includes(file.type) &&
            !['.jpeg', '.jpg', '.png'].includes(getFileExtension(file.name))
          ) {
            this.$message.warning('图片格式不正确，请使用 jpg / jpeg / png');
            this.loading = false;

            return Promise.reject();
          }

          if (!(await this.interceptFileSizeRange(file))) {
            return Promise.reject();
          }

          return (await (this?.onBeforeUpload?.(file) ?? Promise.resolve(true)))
            ? true
            : Promise.reject();
        },
        httpRequest: this?.httpRequest
          ? async (value: {
              file: File;
              filename: string;
              onSuccess: (
                response: { data: { preview: string; size: number; source: string } },
                file: File,
              ) => any;
            }) => {
              value?.onSuccess(await this.httpRequest?.(value), value.file);
            }
          : undefined,
      },
    };

    if (this.url && !this.loading) {
      const imgProps = {
        domProps: {
          src: fixFileToken(this.url),
          alt: this.file?.name,
          loading: 'lazy',
        },
      };

      const iProps = {
        class: ['tg-circle-close-btn'],
        attrs: {
          name: 'ico-frm-delete',
          hoverName: 'ico-frm-delete-active',
        },
        nativeOn: {
          click: this.remove,
        },
        slot: 'tip',
      };

      uploaderProps.class.push('uploaded');

      return (
        <el-upload {...uploaderProps}>
          <img {...imgProps} />
          <tg-icon {...iProps} />
        </el-upload>
      );
    } else {
      const empty = h('div', { class: 'upload-empty' }, [
        this.$slots.empty ? this.$slots.empty : <tg-icon props={{ name: 'ico-add-thin' }} />,
        h('span', [this.emptyText]),
      ]);

      return <el-upload {...uploaderProps}>{empty}</el-upload>;
    }
  },
});
