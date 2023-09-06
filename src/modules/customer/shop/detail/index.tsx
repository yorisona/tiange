/**
 * 客户管理 - 店铺管理 - 新增/编辑(抽屉)
 * @author  huci <huci@goumee.com>
 * @since   2021-09-26 15:35:49
 */
// import type { PropType } from '@vue/composition-api';
import { defineComponent, inject, ref, watch } from '@vue/composition-api';
import { BusinessTypeMap, CustomerCategoryMAP } from '@/types/tiange/common';
import { companyTypeList } from '@/utils/format';
import { areaStr as filterAreaStr } from '@/utils/filter';
import { shopTypeFormat } from '@/utils/format';
import { ShopTypeMap } from '@/types/tiange/customer.enum';

export default defineComponent({
  name: 'ShopDetail',
  props: {
    data: {
      type: Object,
      default: undefined,
    },
  },
  setup(props, ctx) {
    const shopFormModalTitle = '店铺详情';
    const shopDrawerVisible = ref(false);
    const shopDetailVisible: any = inject('shopDetailVisible');
    const rowDetail = ref<any>({
      shop_id: '',
      shop_name: '',
      category: '',
      shop_type: '',
      brand_name: '',
      company_type: '',
      companies: [],
      business_type: [],
    });
    const closeDrawer = () => {
      shopDetailVisible.value = false;
    };
    watch(
      () => props.data,
      val => {
        if (val) {
          const company_names = val.companies.map((company: any) => company.company_name);
          const business_types = val.business_type.map((business_type: any) =>
            BusinessTypeMap.get(business_type),
          );
          const company_type = companyTypeList.find(
            companyType => companyType.type === val?.company_type,
          )?.value;
          rowDetail.value = {
            shop_id: val.shop_id,
            shop_name: val.shop_name,
            category: CustomerCategoryMAP.get(val.category),
            shop_type: ShopTypeMap.get(val.shop_type),
            brand_id: val.brand_id,
            brand_name: val.brand_name,
            company_type: company_type || '--',
            companies: company_names,
            business_type: business_types,
          };
        }
      },
      {
        deep: true,
      },
    );
    return {
      props,
      shopDrawerVisible,
      shopFormModalTitle,
      rowDetail,
      filterAreaStr,
      shopTypeFormat,
      BusinessTypeMap,
      shopDetailVisible,
      closeDrawer,
    };
  },
  render() {
    return (
      <el-drawer
        title={this.shopFormModalTitle}
        height="100vh"
        size="500px"
        visible={this.shopDetailVisible}
        wrapperClosable={true}
        onClose={this.closeDrawer}
      >
        <div class="shop-drawer-content">
          <div class="tg-shop-info base-grid cols">
            <div class="base-grid-item col-1-2">
              <span class="base-grid-item-lbl title">店铺名称：</span>
              <span class="base-grid-item-content">{this.rowDetail.shop_name}</span>
            </div>
            <div class="base-grid-item col-1-2">
              <span class="base-grid-item-lbl title">店铺类目：</span>
              <span class="base-grid-item-content">{this.rowDetail.category}</span>
            </div>
            <div class="base-grid-item col-1-2">
              <span class="base-grid-item-lbl title">店铺类型：</span>
              <span class="base-grid-item-content">{this.rowDetail.shop_type}</span>
            </div>
            <div class="base-grid-item col-1-2">
              <span class="base-grid-item-lbl title">店铺品牌：</span>
              <span class="base-grid-item-content">{this.rowDetail.brand_name}</span>
            </div>
            <div class="base-grid-item col-1-2">
              <span class="base-grid-item-lbl title">客户类型：</span>
              <span class="base-grid-item-content">
                {this.rowDetail.company_type ? this.rowDetail.company_type : '--'}
              </span>
            </div>
            <div class="base-grid-item col-1-2">
              <span class="base-grid-item-lbl title">业务类型：</span>
              {this.rowDetail.business_type.map((business_type: any) => (
                <span class="base-grid-item-content item-business-type">{business_type}</span>
              ))}
            </div>
            <div class="base-grid-item col-1-2">
              <span class="base-grid-item-lbl title">关联公司：</span>
              {this.rowDetail.companies.map((company: any) => (
                <span class="base-grid-item-content item-business-type">{company}</span>
              ))}
            </div>
          </div>
        </div>
      </el-drawer>
    );
  },
});
