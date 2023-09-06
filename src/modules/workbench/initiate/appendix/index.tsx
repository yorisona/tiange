import { defineComponent, SetupContext } from '@vue/composition-api';
import { downloadFileFromBlob } from '@/utils/func';
import { getToken } from '@/utils/token';

const requestOptions = {
  headers: {
    Authorization: getToken() ?? '',
  },
};

export default defineComponent({
  name: 'Appendix',
  props: {
    list: {
      type: Array,
      default: () => {
        return [];
      },
    },
    isDelete: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, ctx: SetupContext) {
    const fileTypeIconMap = new Map([
      ['image/jpeg', 'picture'],
      ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'excel'],
      ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'word'],
      ['application/msword', 'word'],
      ['application/pdf', 'pdf'],
      ['xlsx', 'excel'],
      ['docx', 'word'],
      ['doc', 'word'],
      ['pdf', 'pdf'],
      ['jpeg', 'picture'],
    ]);

    const caseFun = () => {
      const list = props.list.map((item: any) => {
        const nameArr = item.split('/');
        const filename_suffix = item.split('.')[item.split('.').length - 1];
        return {
          fileName: nameArr[nameArr.length - 1],
          link: item,
          icon: fileTypeIconMap.get(filename_suffix) ?? 'picture',
        };
      });
      return list;
    };

    const downloadCaseBtnClick = async (filepath: string) => {
      const filename = decodeURIComponent(filepath.split('/')[filepath.split('/').length - 1]);
      fetch(filepath, requestOptions).then(async response => {
        const result = response.clone();
        try {
          const data = await result.json();
          ctx.root.$message.error(data.message);
        } catch {
          if (response.status === 200) {
            const data = await response.blob();
            downloadFileFromBlob(data, filename);
          } else {
            ctx.root.$message.error('下载失败');
          }
        }
      });
    };

    const deleteItem = (item: any) => {
      ctx.emit('deleteItem', item);
    };
    return {
      caseFun,
      downloadCaseBtnClick,
      deleteItem,
    };
  },
  render() {
    const list = this.caseFun();
    return (
      <div>
        {list.map((item: any, key: number) => {
          return (
            <div key={key} class="case-item">
              <tg-icon class="case-icon" slot="icon" name={`ico-${item.icon}`} />
              <p class="case-name">{decodeURI(item.fileName)}</p>
              <a class="case-down" onclick={() => this.downloadCaseBtnClick(item.link)}>
                下载
              </a>
              {this.isDelete ? (
                <tg-icon
                  className="icon-delete"
                  name="ico-a-quseguanbiicon2x"
                  onClick={() => {
                    // value.splice(key, 1);
                    this.deleteItem(item);
                  }}
                />
              ) : null}
            </div>
          );
        })}
      </div>
    );
  },
});
