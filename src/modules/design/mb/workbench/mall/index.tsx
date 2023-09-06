import { computed, defineComponent, reactive } from '@vue/composition-api';
import exchange from '../../dialog/exchange/index.vue';
import { useDialog } from '@/use/dialog';
import { usePagination, useRequest } from '@gm/hooks/ahooks';
import {
  Query_Listed_Integral_Goods,
  Query_Owner_Integral_M_Exchange_Record,
} from '@/services/integral';
import detail from '@/modules/design/mb/dialog/detail/index.vue';
import givingAway from '@/modules/design/mb/dialog/givingAway/index.vue';
export default defineComponent({
  setup() {
    const dialogExchange = useDialog({
      component: exchange,
      title: '兑换商品',
      width: 400,
      on: {
        submit() {
          reqRecording.reload();
          reqList.reload();
        },
      },
    });
    const pageForm = reactive({
      page_num: 1,
      num: 20,
    });
    const queryForm = reactive({
      order_by_cost: 0,
    });
    const reqRecording = useRequest(Query_Owner_Integral_M_Exchange_Record, {
      defaultParams: [{ page_num: 1, num: 20 }],
    });
    const currentM = computed(() => {
      if (!reqRecording.data) return 0;
      const data: any = reqRecording.data;
      return data.sum_m_num;
    });
    const reqList = usePagination(Query_Listed_Integral_Goods, {
      defaultParams: [pageForm, queryForm],
    });
    const dialogDetail = useDialog({
      component: detail,
      title: 'M币明细',
      width: '750px',
      footer: false,
    });
    const dialogGivingAway = useDialog({
      component: givingAway,
      title: 'M币赠送',
      width: '330px',
    });
    return {
      dialogExchange,
      reqList,
      pageForm,
      queryForm,
      currentM,
      dialogDetail,
      dialogGivingAway,
    };
  },
  render() {
    const { dialogExchange, reqList, pageForm, queryForm, currentM } = this;
    return (
      <div class="mall-container">
        <div class="top-bar">
          <div class="left">
            <span class="des">兑换M币数量排序：</span>
            <el-radio-group
              v-model={queryForm.order_by_cost}
              onChange={() => {
                reqList.pagination.reQuery(queryForm);
              }}
            >
              <el-radio style="padding-top:4px; display: flex; align-items: center;" label={0}>
                从小到大
              </el-radio>
              <el-radio style="padding-top:4px; display: flex;align-items: center;" label={1}>
                从大到小
              </el-radio>
            </el-radio-group>
          </div>
          <div class="right">
            <span class="label">
              <tg-icon name="ico-Mbi" />
              可用M币：<b>{currentM}</b>
            </span>
            <span
              class="view-detail"
              onClick={() => {
                this.dialogDetail.show(null, 'self');
              }}
            >
              查看明细
            </span>
            <span
              class="view-detail"
              onClick={() => {
                this.dialogGivingAway.show(null, 'self');
              }}
            >
              M币赠送
            </span>
          </div>
        </div>
        <div class="context">
          {this.reqList.data?.length === 0 && (
            <empty-common
              detail-text="商城兑换窗口暂时关闭，请耐心等待哦~"
              style="margin-top:130px"
            />
          )}
          <div class="goods">
            {this.reqList.data?.map(item => {
              return (
                <article class="good" onClick={() => dialogExchange.show(item)}>
                  <tg-image src={item.images[0]} />
                  <span class="good-name">{item.name}</span>
                  <span class="good-desc">{item.comment}</span>
                  <span class="good-mb">
                    <tg-icon name="ico-Mbi" />
                    <span>{item.cost_m}</span>
                  </span>
                  <span class="exchange">
                    <tg-button>立即兑换</tg-button>
                  </span>
                </article>
              );
            })}
          </div>
        </div>
        <div class="pagination">
          <el-pagination
            total={reqList.pagination.total}
            page-size={20}
            layout={'total, prev, pager, next'}
            current-page={pageForm.page_num}
            oncurrent-change={reqList.pagination.onCurrentChange}
          />
        </div>
      </div>
    );
  },
});
