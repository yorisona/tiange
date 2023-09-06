/*
 * @Brief: 简介
 * @Author: tingzhu <tingzhu@goumee.com>
 * @Date: 2022-04-12 18:05:25
 */
import { computed, defineComponent, PropType, ref } from '@vue/composition-api';
import { IAnchorInfo } from '@/types/tiange/supplier';
import utils, { URLHelper } from '@/utils';
import { DateHelper } from '@/utils/time';
import moment from 'moment';
import { getToken } from '@/utils/token';
import { downloadFileFromBlob, downloadFileFromLink } from '@/utils/func';
import { TgTableColumn } from '@/types/vendor/column';
import { supplier_permission_info } from '../../common/utils/utils';

type Col = TgTableColumn<any>;

export default defineComponent({
  name: 'CooperationInfo',
  props: {
    operation: {
      type: Object as PropType<{
        add: () => void;
        edit: (info: any) => void;
        delete: (id: number) => void;
      }>,
    },
    info: {
      type: Object as PropType<IAnchorInfo>,
      default: () => {
        return { cooperations: [] };
      },
      require: true,
    },
  },
  setup: (props, ctx) => {
    const urlHelper = new URLHelper();
    /** 新窗口跳转 */
    const handleSchedulingView = () => {
      const anchorId = props.info?.id;
      const [start_date, end_date] = DateHelper.getRecent7Days();
      const id = anchorId ? (anchorId * -1).toString() : anchorId?.toString();
      const path =
        '/live/roster-query?' +
        'kol_id=' +
        id +
        '&start_date=' +
        start_date +
        '&end_date=' +
        end_date;
      window.open(path);
    };
    const gotoContractClick = (item: any) => {
      // 主播合同
      /*    const detailTemplate = RouterNameSupplier.player_contract;
      console.log(detailTemplate);
      ctx.root.$router.push({
        name: detailTemplate,
        params: { id: `${item.id}` },
        query: {
          anchorId: ctx.root.$router.currentRoute.params.id,
          parent_tab: ctx.root.$router.currentRoute.params.tab,
        },
      });*/
      const path =
        '/supplier/playermanager/contract/anchorTemplate/' +
        item.id +
        '?' +
        'anchorId=' +
        ctx.root.$router.currentRoute.params.id +
        '&parent_tab=' +
        ctx.root.$router.currentRoute.params.tab;
      window.open(path);
    };

    const contract_isValid = (contract: any) => {
      if (!contract.end_date) {
        return false;
      }
      const now_moment = moment().startOf('day');
      const end_moment = moment(contract.end_date);
      return end_moment.isSameOrAfter(now_moment);
    };

    const url_with_token = (url: string) => {
      downloadFileFromLink;
      return `${url}?Authorization=${getToken()}&timestamp=${new Date().getTime()}`;
    };

    const downloadAPIFileHandler = (urlString: string, filename: string) => {
      fetch(url_with_token(urlString)).then(async response => {
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

    const columns = ref<Col[]>([
      {
        label: '合作时间',
        align: 'center',
        minWidth: 102,
        prop: 'time',
        formatter: (row: any) =>
          `${row.start_date ? row.start_date.replace(/-/g, '.') : ''} ~ ${
            row.end_date ? row.end_date.replace(/-/g, '.') : ''
          }`,
      },
      {
        label: '服务费计算法方式',
        align: 'center',
        minWidth: 160,
        prop: 'time',
        formatter: (row: any) => (row.settlement_type_label ? row.settlement_type_label : '--'),
      },
      {
        label: '合作状态',
        align: 'center',
        minWidth: 80,
        prop: 'time',
        formatter: (row: any) => {
          let text = '--';
          let className = '';
          if (row.release_status === 1) {
            text = '已解除';
            className = 'invalid';
          } else if (row.cooperation_status === 2 && contract_isValid(row)) {
            text = '合作中';
            className = 'normal';
          } else if (row.cooperation_status === 2 && !contract_isValid(row)) {
            text = '已过期';
            className = 'invalid';
          } else if (row.cooperation_status === 4) {
            text = '审核中';
            className = 'approving';
          } else if (row.cooperation_status === 3) {
            text = '审核不通过';
            className = 'failed';
          }
          return <span class={className}>{text}</span>;
        },
      },
      {
        label: '详情',
        align: 'center',
        minWidth: 56,
        prop: 'time',
        formatter: (row: any) => (
          <tg-button
            type="link"
            onclick={() => {
              gotoContractClick(row);
            }}
          >
            查看
          </tg-button>
        ),
      },
    ]);

    const canSign = computed(() => supplier_permission_info.supplier_kol_sign_contract);

    return {
      columns,
      urlHelper,
      utils,
      handleSchedulingView,
      gotoContractClick,
      contract_isValid,
      downloadAPIFileHandler,
      canSign,
    };
  },
});
