import { defineComponent, onMounted, PropType, ref } from '@vue/composition-api';
import { QueryShopProductParams } from '@/types/tiange/live';
import { usePagination } from '@gm/hooks/ahooks';
import { query_shop_product } from '@/services/live';
import { IGPageQuery } from '@/types/tiange/general';
import shopItem from './shopItem.vue';
import { debounce } from '@/utils/func';
import { LiveToolProductUpdateType } from './shopItem';

export default defineComponent({
  components: {
    shopItem,
  },
  props: {
    queryForm: {
      type: Object as PropType<QueryShopProductParams>,
    },
  },
  setup(props, ctx) {
    const total = ref(0);
    const reqList = usePagination(query_shop_product, {
      manual: true,
      onSuccess(_, oData) {
        const res = oData as any;
        if (res.success) {
          total.value = res.data.total;
        }
      },
    });
    const pagerForm = ref<IGPageQuery>({
      num: 20,
      page_num: 1,
    });
    const methods = {
      reload(resetPageNum: boolean = true) {
        if (resetPageNum) pagerForm.value.page_num = 1;
        submit();
      },
      sendSaveRequest() {
        reqList.runAsync(
          {
            ...pagerForm.value,
          },
          {
            ...props.queryForm,
          },
        );
      },
      emitUpdated(type?: LiveToolProductUpdateType) {
        ctx.emit('updated', type);
      },
    };
    const submit = debounce(methods.sendSaveRequest, 200);
    onMounted(() => {
      methods.reload();
    });
    return { total, reqList, pagerForm, ...methods };
  },
  render() {
    const { reqList, pagerForm, queryForm } = this;
    return (
      <div class="tg-shop-goods-list-page-container">
        <section class="header-field">
          <div class="header">
            <span class="title">小店商品（{this.total || 0}）</span>
          </div>
        </section>
        <div
          v-loading={reqList.loading}
          style="flex: 1;  display: flex; flex-direction: column; overflow: hidden; margin-top: 12px; background-color: white; align-items: center; justify-content: center;"
        >
          {!reqList.data?.length ? (
            <div class="tg-page-empty" slot="empty">
              <empty-common detail-text={'暂无数据'} />
            </div>
          ) : (
            <fragments>
              <section class="goods-field">
                {reqList.data?.map(el => (
                  <shopItem
                    isStored={el.is_stored}
                    showRank={true}
                    class="goods-item"
                    data={el}
                    sortType={queryForm?.order_by_type}
                    key={el}
                    onUpdated={(type: LiveToolProductUpdateType) => {
                      this.emitUpdated(type);
                    }}
                  ></shopItem>
                ))}
              </section>
              <section class="pagination-field">
                <el-pagination
                  on-size-change={(val: number) => {
                    pagerForm.num = val;
                    this.reload();
                  }}
                  on-current-change={(val: number) => {
                    pagerForm.page_num = val;
                    this.reload(false);
                  }}
                  on-prev-click={(val: number) => {
                    pagerForm.page_num = val;
                    this.reload(false);
                  }}
                  on-next-click={(val: number) => {
                    pagerForm.page_num = val;
                    this.reload(false);
                  }}
                  page-sizes={[10, 20, 50, 100]}
                  page-size={pagerForm.num}
                  current-page={pagerForm.page_num}
                  layout="total, prev, pager, next, sizes"
                  total={this.total}
                ></el-pagination>
              </section>
            </fragments>
          )}
        </div>
      </div>
    );
  },
});
