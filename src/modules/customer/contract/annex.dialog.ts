/**
 * 合同附件对话框
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-12-04 11:56:33
 */
import { computed, ComputedRef, defineComponent, h, inject, Ref, ref } from '@vue/composition-api';
import { TableColumn } from '@/types/vendor/column';
import { fixFileToken } from '@/utils/http';
import { downloadFileFromBlob } from '@/utils/func';
import { ApprovalStatus } from '@/types/tiange/system';
import { getToken } from '@/utils/token';

/** 附件文件信息 */
interface RawFile {
  /** 文件名称 */
  file_name: string;
  /** 文件地址 */
  url: string;
  /** 状态 */
  status: number;
  /** 状态 */
  status_str: string;
  /** 文件类型 */
  type: string;
}

type Col = TableColumn<RawFile>;

export default defineComponent({
  name: 'AnnexDialog',
  props: {
    noStatus: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '合同附件',
    },
  },
  setup(props, ctx) {
    const visible = inject<Ref<boolean>>('annex-dialog-visible') ?? ref(false);
    const annex = inject<Ref<RawFile[]> | ComputedRef<RawFile[]>>('annex-data');

    const columns1 = ref<Col[]>([
      {
        label: '附件类型',
        property: 'type',
        align: 'center',
        headerAlign: 'center',
        width: 90,
      },
      {
        label: props.title,
        property: 'file_name',
        align: 'left',
        headerAlign: 'left',
        minWidth: 170,
        showOverflowTooltip: true,
        formatter: (row, column, value) =>
          h(
            'a',
            {
              on: {
                click: () => {
                  preview(row.url);
                },
              },
            },
            [decodeURIComponent(value)],
          ),
      },
    ]);
    const columns2 = ref<Col[]>([
      {
        label: '状态',
        property: 'status_str',
        align: 'center',
        headerAlign: 'center',
        width: 86,
        formatter: ({ status_str, status }) => {
          console.log(status_str, 'status_str');

          return h('span', { class: [`fg-${ApprovalStatus[status]}`.toLowerCase()] }, [status_str]);
        },
      },
    ]);

    const columns3 = ref<Col[]>([
      {
        label: '操作',
        align: 'center',
        headerAlign: 'center',
        minWidth: 64,
        formatter: row => {
          return h('div', { class: 'operation' }, [
            h('tg-icon', {
              props: { name: 'ico-download' },
              on: {
                click: () => {
                  const requestOptions = {
                    headers: {
                      Authorization: getToken() ?? '',
                    },
                  };
                  fetch(row.url, requestOptions).then(async response => {
                    const result = response.clone();
                    try {
                      const data = await result.json();
                      ctx.root.$message.error(data.message);
                    } catch {
                      if (response.status === 200) {
                        const data = await response.blob();
                        const filename = row.url.split('/')[row.url.split('/').length - 1];
                        downloadFileFromBlob(data, row.file_name ? row.file_name : filename);
                      } else {
                        ctx.root.$message.error('下载失败');
                      }
                    }
                  });
                },
              },
            }),
            h('tg-icon', {
              props: { name: 'ico-preview' },
              on: {
                click: () => {
                  preview(row.url);
                },
              },
            }),
          ]);
        },
      },
    ]);

    const columns = computed(() => [
      ...columns1.value,
      ...(props.noStatus ? [] : columns2.value),
      ...columns3.value,
    ]);

    const emitClose = () => {
      ctx.emit('dialog:close');
    };

    const preview = (url: string) => {
      const type_reg = /\.(?:doc|ppt|xls)x?$/u;
      const wrUrl = type_reg.test(url)
        ? `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(
            fixFileToken(url, false),
          )}`
        : fixFileToken(url, false);

      window.open(wrUrl);
    };

    return { visible, emitClose, annex, columns, preview };
  },
});
