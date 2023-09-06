import { downloadFileFromBlob } from '@/utils/func';
import { fixFileToken } from '@/utils/http';
import { getToken } from '@/utils/token';
import { computed, defineComponent } from '@vue/composition-api';
import utils from '@/utils';

const FileItem = defineComponent({
  name: 'FileItem',
  props: {
    /** 文件名称 */
    filepath: {
      type: String,
      required: true,
    },
    /** 是否只读 */
    readonly: {
      type: Boolean,
      default: false,
    },
    /** 是否显示下载 */
    showDown: {
      type: Boolean,
      default: true,
    },
    /** 是否显示预览 */
    showPreview: {
      type: Boolean,
      default: true,
    },
    /** 是否显示删除文字按钮 */
    showDeleteText: {
      type: Boolean,
      default: false,
    },
    /** 是否显示图标 */
    showIcon: {
      type: Boolean,
      default: true,
    },
    /** name是否可点击,预览 */
    isNameClick: {
      type: Boolean,
      default: false,
    },
    /** 是否手动上传 */
    isManualUpload: {
      type: Boolean,
      default: false,
    },
    /** 限制文件名长度px */
    limitNameWidth: {
      type: Number,
      default: 0,
    },
  },
  setup(props, ctx) {
    const url = computed(() => {
      try {
        return new URL(props.filepath);
      } catch {
        return new URL(process.env.VUE_APP_BASE_API + props.filepath);
      }
    });
    const filename = computed(() => decodeURIComponent(url.value.pathname.split('/').pop() ?? ''));

    const name = computed(() => {
      // const [basenamestr, extname] = filename.value.split('.');
      const basename = utils.basename(filename.value.substring(0, filename.value.lastIndexOf('.')));
      const extname = filename.value.substring(filename.value.lastIndexOf('.') + 1);
      return { basename, extname };
    });

    const iconName = computed(() => {
      const { extname } = name.value;
      switch (extname.toLowerCase()) {
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
          return 'ico-picture';
      }
    });

    const onClickDownload = () => {
      fetch(fixFileToken(props.filepath, false)).then(async response => {
        const result = response.clone();
        try {
          const data = await result.json();
          ctx.root.$message.error(data.message);
        } catch {
          if (response.status === 200) {
            const data = await response.blob();
            downloadFileFromBlob(data, filename.value);
          } else {
            ctx.root.$message.error('下载失败');
          }
        }
      });
    };

    return {
      filename,
      name,
      iconName,
      onClickDownload,
    };
  },
  render() {
    /** 下载事件 */
    const on = {
      click: () => {
        if (this.isManualUpload) {
          this.$emit('download');
          return;
        }
        this.onClickDownload();
      },
    };
    /** 预览事件 */
    const proviewOn = {
      click: () => {
        const file = this.filepath;
        const url = `${file}?Authorization=${getToken()}`;
        if (
          file.includes('.png') ||
          file.includes('.jpg') ||
          file.includes('.jpeg') ||
          file.includes('.pdf')
        ) {
          window.open(url);
        } else {
          window.open(
            'https://view.officeapps.live.com/op/view.aspx?src=' + encodeURIComponent(url),
          );
        }
      },
    };
    return (
      <div class="tg-file-item">
        {this.showIcon && (
          <div
            class="file-icon"
            onclick={() => {
              if (this.isNameClick) {
                proviewOn.click();
              }
            }}
          >
            <tg-icon name={this.iconName} />
          </div>
        )}
        <div
          class="basename line-clamp-1"
          onclick={() => {
            if (this.isNameClick) {
              proviewOn.click();
            }
          }}
        >
          {this.limitNameWidth > 0 ? (
            <tg-textPopover
              text={`${this.name.basename}`}
              // style="margin-left: 6px; color: #343F4C; font-size: 12px; width: 70px;"
              maxWidth={this.limitNameWidth}
            ></tg-textPopover>
          ) : (
            this.name.basename
          )}
        </div>
        <div
          class="extname"
          onclick={() => {
            if (this.isNameClick) {
              proviewOn.click();
            }
          }}
        >
          .{this.name.extname}
        </div>
        {this.showDown && (
          <tg-button class="downlink" type="link" on={on}>
            下载
          </tg-button>
        )}
        {this.showPreview && (
          <tg-button class="downlink" type="link" on={proviewOn}>
            预览
          </tg-button>
        )}
        {this.readonly ? (
          ''
        ) : this.showDeleteText ? (
          <tg-button
            class="downlink"
            type="link"
            on={{
              click: () => {
                this.$emit('remove');
              },
            }}
          >
            删除
          </tg-button>
        ) : (
          <div class="file-remove-icon">
            <tg-icon
              name="ico-frm-delete"
              hover-name="ico-frm-delete-active"
              on={{
                click: () => {
                  this.$emit('remove');
                },
              }}
            />
          </div>
        )}
      </div>
    );
  },
});
export default FileItem;
