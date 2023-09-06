import { defineComponent, onMounted, PropType, ref } from '@vue/composition-api';
import { QueryShopProductParams } from '@/types/tiange/live';
import { usePagination } from '@gm/hooks/ahooks';
import { query_store_product } from '@/services/live';
import { IGPageQuery } from '@/types/tiange/general';
import smartSelectionLib from '@/modules/live/project/dialog/smartSelectionLib/index.vue';
import { useDialog } from '@/use/dialog';
import shopItem from '../shopGoodsList/shopItem.vue';
import { LiveToolProductUpdateType } from '../shopGoodsList/shopItem';
import { debounce } from '@/utils/func';
// import FormValidation from '@/modules/supplier/playerManager/common/FormValidation';
import { useRouter } from '@/use/vue-router';
// import { Message } from 'element-ui';
import liveToolImportProduct from '@/modules/live/project/dialog/liveToolImportProduct/index.vue';
// import { Message } from 'element-ui';
export default defineComponent({
  props: {
    queryForm: {
      type: Object as PropType<QueryShopProductParams>,
    },
  },
  components: {
    shopItem,
  },
  setup(props, ctx) {
    const router = useRouter();
    const project_id = router.currentRoute.params.id;
    const total = ref(0);
    const reqList = usePagination(query_store_product, {
      manual: true,
      onSuccess(_, oData) {
        const res = oData as any;
        if (res.success) {
          total.value = res.data.total;
        }
      },
    });
    // const reqUpload = useRequest(import_store_product, { manual: true });
    const pagerForm = ref<IGPageQuery>({
      num: 20,
      page_num: 1,
    });
    const methods = {
      reload(resetPageNum: boolean = true, type: LiveToolProductUpdateType = 'edit') {
        if (resetPageNum) {
          pagerForm.value.page_num = 1;
        } else {
          const offset = type === 'add' ? 1 : type === 'subtract' ? -1 : 0;
          if (offset !== 0) {
            // const totalCount = total.value + offset;
            total.value += offset;
            const currentPageNums = Math.ceil(total.value / pagerForm.value.num);
            pagerForm.value.page_num =
              offset === 1
                ? currentPageNums
                : pagerForm.value.page_num <= currentPageNums
                ? pagerForm.value.page_num
                : currentPageNums;
            pagerForm.value.page_num = pagerForm.value.page_num <= 0 ? 1 : pagerForm.value.page_num;
          }
        }
        submit();
      },
      sendListRequest() {
        reqList.runAsync(
          {
            ...pagerForm.value,
          },
          {
            ...props.queryForm,
          },
        );
      },
      emitUpdated(type?: LiveToolProductUpdateType, resetPageNum: boolean = false) {
        ctx.emit('updated', type, resetPageNum);
      },
    };
    const submit = debounce(methods.sendListRequest, 200);
    // watch(
    //   () => [
    //     props.queryForm?.order_by_type,
    //     props.queryForm?.third_cid,
    //     props.queryForm?.sn,
    //     props.queryForm?.first_cid,
    //     props.queryForm?.product_id,
    //     pagerForm.value.num,
    //     pagerForm.value.page_num,
    //   ],
    //   () => {
    //     submit();
    //   },
    //   {
    //     immediate: true,
    //   },
    // );
    const dialogSelectionLib = useDialog({
      component: smartSelectionLib,
      title: '智能选品库',
      width: 598,
      okText: '下一步',
      on: {
        submit() {
          methods.emitUpdated(undefined, true);
        },
      },
    });
    onMounted(() => {
      methods.reload();
    });
    const dialogLiveToolImportProduct = useDialog({
      component: liveToolImportProduct,
      title: '导入商品',
      width: 400,
      okText: '确定',
      on: {
        submit() {
          methods.emitUpdated(undefined, true);
        },
      },
    });
    return {
      total,
      project_id,
      // reqUpload,
      reqList,
      pagerForm,
      dialogSelectionLib,
      dialogLiveToolImportProduct,
      ...methods,
    };
  },
  render() {
    const { pagerForm, reqList, dialogSelectionLib } = this;
    return (
      <div class="tg-plugin-goods-list-page-container">
        <section class="header-field">
          <div class="header">
            <span class="title">插件商品库（{this.total || 0}）</span>
            <div style="display: flex;">
              {/*<tg-upload*/}
              {/*  show-file-list={false}*/}
              {/*  action="/api/resources/upload_file"*/}
              {/*  data={{ type: 'allocated' }}*/}
              {/*  // style="margin-bottom:12px"*/}
              {/*  beforeUpload={FormValidation.ValidationFileUpload({*/}
              {/*    extensions: ['.xls', '.xlsx'],*/}
              {/*    fileSize: 50,*/}
              {/*  })}*/}
              {/*  success={async (res: any) => {*/}
              {/*    if (res.success) {*/}
              {/*      const upRes = await this.reqUpload.runAsync({*/}
              {/*        file_path: res.data.source,*/}
              {/*        project_id: this.project_id,*/}
              {/*      });*/}
              {/*      if (upRes.data.success) {*/}
              {/*        Message.success(upRes.data.message);*/}
              {/*        this.emitUpdated();*/}
              {/*      }*/}
              {/*    } else {*/}
              {/*      Message.error(res.message || '上传失败');*/}
              {/*    }*/}
              {/*  }}*/}
              {/*>*/}
              {/*<tg-button icon="ico-upload-lite">上传文件</tg-button>*/}
              <tg-button onClick={() => this.dialogLiveToolImportProduct.show(this.project_id)}>
                导入商品
              </tg-button>
              {/*</tg-upload>*/}
              <tg-button type="primary" onClick={() => dialogSelectionLib.show()}>
                智能商品库
              </tg-button>
            </div>
          </div>
        </section>
        <div
          v-loading={reqList.loading}
          style="flex: 1;display: flex; flex-direction: column;overflow: hidden; margin-top: 12px; background-color: white; align-items: center; justify-content: center;"
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
                    isStored={true}
                    class="goods-item"
                    data={el}
                    showOtherInfo={true}
                    // sortType={queryForm?.order_by_type}
                    key={el}
                    onUpdated={(type: LiveToolProductUpdateType) => {
                      this.emitUpdated(type);
                    }}
                  ></shopItem>
                ))}
              </section>
              <section class="pagination-field">
                <el-pagination
                  page-sizes={[10, 20, 50, 100]}
                  page-size={pagerForm.num}
                  current-page={pagerForm.page_num}
                  layout="total, prev, pager, next, sizes"
                  total={this.total}
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
                ></el-pagination>
              </section>
            </fragments>
          )}
        </div>
      </div>
    );
  },
});
