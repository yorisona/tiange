import { defineComponent, onMounted, ref, computed, inject } from '@vue/composition-api';
import shopGoodsList from './shopGoodsList/index.vue';
import pluginGoodsList from './pluginGoodsList/index.vue';
import { QueryShopProductParams } from '@/types/tiange/live';
import { useRouter } from '@/use/vue-router';
import { useRequest } from '@gm/hooks/ahooks';
import { query_project_tiange_category } from '@/services/live';
import { useProjectBaseInfo } from '@/modules/settlement/use/project';
import { RouterNameProjectManage } from '@/const/router';
import { LiveToolProductUpdateType } from '@/modules/live/project/tabs/liveTool/shopGoodsList/shopItem';

type DataForm = QueryShopProductParams;
export default defineComponent({
  components: {
    shopGoodsList,
    pluginGoodsList,
  },
  setup(props, ctx) {
    const router = useRouter();
    const project_id = router.currentRoute.params.id;
    const initDataForm = () => ({
      product_id: undefined,
      sn: undefined,
      first_cid: undefined,
      third_cid: undefined,
      order_by_type: E.project.LiveToolGoodsSortType.Sales,
      project_id: project_id,
    });
    const pluginRef = ref<{
      reload: (resetPageNum: boolean, type?: LiveToolProductUpdateType) => void;
    }>();
    const shopRef = ref<{ reload: (resetPageNum: boolean) => void }>();
    const formData = ref<DataForm>(initDataForm());
    const reqCategory = useRequest(query_project_tiange_category, { manual: true });
    const methods = {
      reload(all: boolean = true, resetPageNum: boolean = true, type?: LiveToolProductUpdateType) {
        if (all) {
          pluginRef.value?.reload(resetPageNum, type);
        }
        shopRef.value?.reload(resetPageNum);
      },
    };
    const sub_categories = computed(() => {
      if (!formData.value.first_cid) return [];
      return (
        reqCategory.data?.find((el: any) => el.douyin_cat_id === formData.value.first_cid)
          ?.sub_categories || []
      );
    });
    const { isFromLocalLife, isFromLiveDouyin } = useProjectBaseInfo();
    if (isFromLocalLife.value || isFromLiveDouyin.value) {
      const routes = [
        {
          name: isFromLocalLife.value
            ? RouterNameProjectManage.localLife.project.list
            : RouterNameProjectManage.live.project.list,
          title: '项目管理',
        },
        {
          // path: '/projectManage/localLife/project/' + project_id + '/projectInfo/calendar',
          name: isFromLocalLife.value
            ? RouterNameProjectManage.localLife.detail.info
            : RouterNameProjectManage.tiktokLive.project.detail.info,
          params: {
            id: project_id,
            tab: 'projectInfo',
            liveType: 'calendar',
          },
          title: '项目详情',
        },
        {
          path: '',
          title: '直播工具',
        },
      ];
      const showBackTitleHandle = inject('showBackTitleHandle') as Function;
      showBackTitleHandle(routes);
    }
    onMounted(() => {
      reqCategory.run({
        project_id,
      });
    });
    return { pluginRef, shopRef, formData, reqCategory, sub_categories, ...methods };
  },
  render() {
    const { formData, sub_categories, reqCategory } = this;
    return (
      <div class="tg-live-tool-page-container">
        <section class="filter-field">
          <el-form label-width="62px" props={{ model: formData }} size="mini">
            <el-form-item label="商品编码：">
              <el-input
                clearable
                placeholder="请输入商品编码"
                v-model={formData.product_id}
                onInput={this.reload}
                onClear={this.reload}
              ></el-input>
            </el-form-item>
            <el-form-item label="商品款号：">
              <el-input
                clearable
                placeholder="请输入商品款号"
                v-model={formData.sn}
                onInput={this.reload}
                onClear={this.reload}
              ></el-input>
            </el-form-item>
            <el-form-item label="一级类目：">
              <el-select
                clearable
                v-model={formData.first_cid}
                placeholder="请选择"
                loading={reqCategory.loading}
                onChange={() => {
                  formData.third_cid = undefined;
                  this.reload();
                }}
              >
                {reqCategory.data?.map((el: any) => (
                  <el-option
                    label={el.cat_name}
                    value={el.douyin_cat_id}
                    key={el.douyin_cat_id}
                  ></el-option>
                ))}
              </el-select>
            </el-form-item>
            <el-form-item label="三级类目：">
              <el-select
                clearable
                v-model={formData.third_cid}
                placeholder="请选择"
                onChange={this.reload}
              >
                {sub_categories.map((el: any) => (
                  <el-option
                    label={el.cat_name}
                    value={el.douyin_cat_id}
                    key={el.douyin_cat_id}
                  ></el-option>
                ))}
              </el-select>
            </el-form-item>
          </el-form>
        </section>
        <section class="sort-field">
          <span>排序：</span>
          <div class="sort-list">
            {E.project.LiveToolGoodsSortTypeOption.map(el => (
              <span
                active={el.value === formData.order_by_type}
                class="item"
                key={el.value}
                onClick={() => {
                  formData.order_by_type = el.value;
                  this.reload(false);
                }}
              >
                {el.label}
              </span>
            ))}
          </div>
          <div class="tips">
            <tg-icon name="ico-common-shuoming-linear"></tg-icon>
            <span class="desc">当前展示数据为近7日数据情况</span>
          </div>
        </section>
        <section class="list-field">
          <div class="shop-goods-list">
            <shopGoodsList
              ref="shopRef"
              queryForm={formData}
              onUpdated={(type?: LiveToolProductUpdateType) => {
                this.reload(true, false, type);
              }}
            ></shopGoodsList>
          </div>
          <div style="display: flex; align-items: center; justify-content: center;">
            <tg-icon
              style="font-size: 24px; color: #D8D8D8"
              name="ico-common-zhuanrushangpinku-linear"
            ></tg-icon>
          </div>
          <div class="plugin-goods-list">
            <pluginGoodsList
              ref="pluginRef"
              queryForm={formData}
              onUpdated={(type?: LiveToolProductUpdateType, resetPageNum?: boolean) => {
                this.reload(true, resetPageNum, type);
              }}
            ></pluginGoodsList>
          </div>
        </section>
      </div>
    );
  },
});
