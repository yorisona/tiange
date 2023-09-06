import { computed, defineComponent, h } from '@vue/composition-api';
import { downloadFileFromLink } from '@/utils/func';
// import { fixFileToken } from '@/utils/http';
import { getToken } from '@/utils/token';
import { Confirm } from '@/use/asyncConfirm';
import utils from '@/utils';

export default defineComponent({
  name: 'uploadName',
  props: {
    filepath: {
      type: String,
      required: true,
    },
    display: {
      type: String,
      default: 'inline-block',
    },
    previewFormat: {
      type: Array,
      default: () => [
        'jpg',
        'jpeg',
        'png',
        // 'gif',预览不支持
        'bmp',
        'xls',
        'xlsx',
        'csv',
        'doc',
        'docx',
        'pdf',
        'ppt',
        'pptx',
      ],
    },
  },
  setup(props, ctx) {
    const url = computed<URL>(() => {
      if (!props.filepath) return new URL('www.baidu.com');
      try {
        return new URL(props.filepath);
      } catch {
        return new URL(process.env.VUE_APP_BASE_API + props.filepath);
      }
    });
    const filename = computed(() => decodeURIComponent(url.value.pathname.split('/').pop() ?? ''));

    const name = computed(() => {
      const basenamestr = filename.value.substring(0, filename.value.lastIndexOf('.'));
      const extname: string = filename.value.substring(filename.value.lastIndexOf('.') + 1);
      const basename = utils.basename(basenamestr);
      return { basename, extname };
    });
    const onClickDownload = () => {
      downloadFileFromLink(props.filepath, /tiange-oss/g.test(props.filepath) ? false : true);
      // console.log(
      //   props.filepath,
      //   /https?:\/\/tiange-oss.goumee.com/g.test(
      //     'htt://tiange-oss.goumee.com/prod/upload/visual_design/20221208/1670475508354/%E7%82%B9%E5%87%BB%E4%B8%8B%E5%8D%95.gif',
      //   ),
      //   '111',
      // );

      // downloadFileFromLink(props.filepath, false,filename.value);
      // fetch(fixFileToken(props.filepath, false)).then(async response => {
      //   const result = response.clone();
      //   try {
      //     const data = await result.json();
      //     console.log(data, 'data');

      //     ctx.root.$message.error(data.message);
      //   } catch {
      //     if (response.status === 200) {
      //       const data = await response.blob();
      //       downloadFileFromLink(data, filename.value);
      //     } else {
      //       ctx.root.$message.error('下载失败');
      //     }
      //   }
      // });
    };
    const onDelete = () => {
      Confirm('是否确定删除该附件？').then(() => {
        ctx.emit('delete', props.filepath);
      });
    };
    const canYouPreview = () => {
      return props.previewFormat.includes(name.value.extname);
    };
    return {
      name,
      onClickDownload,
      onDelete,
      canYouPreview,
    };
  },
  render() {
    const on = {
      click: () => {
        this.onClickDownload();
      },
    };
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
    const style = {
      display: this.display,
    };

    return (
      <div style="display: flex;align-items: center;">
        <div class="mgr-8" style="display: inline-block;">
          {/* <tg-textPopover
            text={`${this.name.basename}.${this.name.extname}`}
            // style="margin-left: 6px; color: #343F4C; font-size: 12px; width: 70px;"
            maxWidth={240}
            minWidth={80}
          ></tg-textPopover> */}
          <div v-ellipsis={'130px'}>{`${this.name.basename}.${this.name.extname}`}</div>
        </div>
        <div style={style}>
          <span class="mgr-6 btn" on={proviewOn} v-show={this.canYouPreview()}>
            预览
          </span>
          <span class="mgr-6 btn" on={on}>
            下载
          </span>
          <span v-show={this.$attrs.showDelete} class="btn" onClick={this.onDelete}>
            删除
          </span>
        </div>
      </div>
    );
  },
});
