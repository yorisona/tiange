/**
 * 卡片式预览文件
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-12-14 13:51:22
 */
import { downloadFileFromBlob } from '@/utils/func';
import { getToken } from '@/utils/token';
import { computed, defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'TgFileCard',
  props: {
    /** 文件名称 */
    filename: {
      type: String,
      required: true,
    },
    /** 文件全称 */
    url: {
      type: String,
      required: true,
    },
    /** 是否能删除  */
    editable: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, ctx) {
    const url = computed(() => `${props.url}?Authorization=${getToken()}`);
    const filename = props.filename;
    const requestOptions = {
      headers: {
        Authorization: getToken() ?? '',
      },
    };

    /** 下载 */
    const downloadFile = () => {
      const urlString = url.value;
      fetch(urlString, requestOptions).then(async response => {
        const result = response.clone();
        try {
          const data = await result.json();
          ctx.root.$message.error(data.message);
        } catch {
          if (response.status === 200) {
            const data = await response.blob();
            const url = new URL(urlString);
            const url_filename = url.pathname.split('/').pop();
            downloadFileFromBlob(data, filename ? filename : url_filename);
          } else {
            ctx.root.$message.error('下载失败');
          }
        }
      });
    };

    /** 预览 */
    const preview = () => {
      const type_reg = /\.(?:doc|ppt|xls)x?$/u;
      const wrUrl = type_reg.test(props.url)
        ? `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(url.value)}`
        : url.value;

      window.open(wrUrl);
    };
    const iconName = computed(() => {
      const [_, extName] = props.filename.split('.');
      switch (extName.toLowerCase()) {
        case 'docx':
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        case 'application/msword':
        case 'doc':
          return 'ico-word';
        case 'xlsx':
        case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        case 'xls':
        case 'csv':
          return 'ico-excel';
        case 'pdf':
        case 'application/pdf':
          return 'ico-pdf';
        default:
          return 'ico-file-icon';
      }
    });

    return { downloadFile, preview, iconName };
  },
  render(h) {
    const nodes = [
      <tg-icon name={this.iconName} onClick={this.preview} />,
      <div class="tg-file-card-filename" onClick={this.preview}>
        {this.filename}
      </div>,
      <a
        class="tg-file-card-download-btn"
        onClick={(event: MouseEvent) => {
          event.stopPropagation();
          this.downloadFile();
        }}
      >
        下载
      </a>,
    ];

    if (this.editable) {
      nodes.push(
        <tg-icon
          class="close-btn"
          name="ico-cross"
          hover-name="ico-cross-red"
          onClick={(event: MouseEvent) => {
            event.stopPropagation();
            this.$emit('remove');
          }}
        />,
      );
    }

    return <div class="tg-file-card">{nodes}</div>;
  },
});
