import { defineComponent, onActivated, onMounted, provide, ref } from '@vue/composition-api';
// import utils from '@/utils';
import { usePermission } from '@/use/permission';
import { companyTypeList, shopTypeRadio } from '@/utils/format';
import { GetCustomer } from '@/services/customers';
import { CustomerShop } from '@/types/tiange/customer';
import { ShopTypeMap } from '@/types/tiange/customer.enum';
import { BusinessTypeOptions, CustomerCategoryMAP } from '@/types/tiange/common';
import ModifyShop from '@/modules/customer/shop/modify/index.vue';
import ShopDetail from '@/modules/customer/shop/detail/index.vue';

export default defineComponent({
  components: {
    ModifyShop,
    ShopDetail,
  },
  setup() {
    const pagination = ref({
      currentPage: 1,
      pageSize: 20,
      pageSizes: [10, 20, 30],
      total: 100,
    });
    const searchShopParams = ref({
      shop_name: '', // 店铺名称
      shop_type: undefined, //  店铺类型
      num: 20,
      page_num: 1,
    });
    onActivated(() => {
      query();
    });
    const onKeyPress = (event: any) => {
      if (event.which !== 13) return;
      query();
    };
    const addShopFormVisible = ref<boolean>(false);
    const shopDetailVisible = ref<boolean>(false);
    const resetParams = () => {
      searchShopParams.value.shop_name = '';
      searchShopParams.value.shop_type = undefined;
      searchShopParams.value.num = 20;
      searchShopParams.value.page_num = 1;
      query();
    };
    const shops = ref<any[]>([]);
    const originShops = ref<any[]>([]);
    const permission = usePermission();
    const show = ref<boolean>(false);
    const handleFolderClick = () => {
      show.value = !show.value;
    };
    const editShopData = ref<any>(undefined);
    const shopDetailData = ref<any>({
      shop_id: '',
      shop_name: '',
      category: '',
      shop_type: '',
      brand_id: '',
      brand_name: '',
      company_type: '',
      companies: [],
      business_type: [],
    });
    provide('addShopFormVisible', addShopFormVisible);
    provide('shopDetailVisible', shopDetailVisible);
    const queryShop = async () => {
      const res = await GetCustomer(searchShopParams.value);
      if (res.data.success) {
        shops.value = res.data.data.data.map((item: CustomerShop) => {
          const company_names = item.companies.map(company => company.company_name);
          const business_types = BusinessTypeOptions.filter(businessType =>
            item.business_type?.includes(businessType.value),
          ).map(businessType => businessType.label);
          item.business_type;
          return {
            shop_id: item.shop_id,
            shop_name: item.shop_name || '--',
            shop_type: ShopTypeMap.get(item.shop_type) || '--',
            category: CustomerCategoryMAP.get(item.category) || '--',
            brand_name: item.brand_name || '--',
            company_type:
              companyTypeList.find(companyType => companyType.type === item.company_type)?.value ||
              '--',
            business_type: business_types ? business_types.join('、') : '--',
            company_names: company_names,
          };
        });
        originShops.value = res.data.data.data.map((shop: CustomerShop) => {
          return {
            shop_id: shop.shop_id,
            shop_name: shop.shop_name,
            category: shop.category,
            shop_type: shop.shop_type,
            brand_id: shop.brand_id,
            brand_name: shop.brand_name,
            company_type: shop.company_type,
            companies: shop.companies,
            business_type: shop.business_type,
            xd_shop_id: shop.xd_shop_id,
          };
        });
        pagination.value.currentPage = searchShopParams.value.page_num;
        pagination.value.pageSize = searchShopParams.value.num;
        pagination.value.total = res.data.data.total;
      }
    };
    const query = () => {
      queryShop();
    };
    const showAddShopForm = () => {
      editShopData.value = undefined;
      addShopFormVisible.value = true;
    };
    const showEditShopForm = (shopId: any) => {
      editShopData.value = originShops.value.find(item => item.shop_id === shopId);
      addShopFormVisible.value = true;
    };
    const showShopDetail = (shopId: any) => {
      shopDetailData.value = originShops.value.find(item => item.shop_id === shopId);
      shopDetailVisible.value = true;
    };

    const saveSuccess = () => {
      query();
    };

    onMounted(() => {
      query();
    });
    return {
      permission,
      show,
      handleFolderClick,
      searchShopParams,
      shopTypeRadio,
      shops,
      resetParams,
      query,
      pagination,
      onKeyPress,
      addShopFormVisible,
      showAddShopForm,
      showEditShopForm,
      originShops,
      shopDetailVisible,
      showShopDetail,
      shopDetailData,
      saveSuccess,
      editShopData,
    };
  },
  render() {
    const { showEditShopForm } = this;
    return (
      <div class="tg-page-container flex-auto">
        <tg-card padding={[16, 16, 4, 16]}>
          <el-form size="mini" show-message={false} label-width="60px">
            <div class="filter-form-div">
              <div class="filter-form-item">
                <el-form-item label="店铺名称：" nativeOnKeypress={this.onKeyPress}>
                  <el-input
                    placeholder="请输入店铺名称"
                    v-model={this.searchShopParams.shop_name}
                  />
                </el-form-item>
              </div>
              <div class="filter-form-item">
                <el-form-item label="店铺类型：">
                  <el-select
                    popper-class="el-select-popper-mini"
                    style="width: 100%"
                    v-model={this.searchShopParams.shop_type}
                  >
                    <el-option label="全部" value={undefined} />
                    {this.shopTypeRadio.map((item: any) => (
                      <el-option label={item.text} value={item.value} />
                    ))}
                  </el-select>
                </el-form-item>
              </div>
              <div class="filter-form-item">
                <el-form-item label-width="0">
                  <div class="filter-form-item-btn">
                    <tg-button type="primary" onClick={this.query}>
                      查询
                    </tg-button>
                    <tg-button class="mgl-8" onClick={this.resetParams}>
                      重置
                    </tg-button>
                  </div>
                </el-form-item>
              </div>
            </div>
          </el-form>
        </tg-card>
        <div class="mtg-card mgt-10">
          {this.permission.customer_create && (
            <tg-button-line>
              <tg-button icon="ico-btn-add" type="primary" onClick={this.showAddShopForm}>
                新增店铺
              </tg-button>
            </tg-button-line>
          )}
          <div
            class={this.permission.customer_create ? 'table-box mgt-12' : 'table-box mgt-4'}
            ref="tableRef"
          >
            <tg-table
              height={'100%'}
              stripe
              // onrow-click={(row: any) => {
              //   showShopDetail(row.shop_id);
              // }}
              data={this.shops}
            >
              <el-table-column
                label="店铺名称"
                prop="shop_name"
                min-width={220}
                scopedSlots={{
                  default: ({ row }: any) => {
                    if (row.shop_name.length === 0) return <span>--</span>;
                    const strLength = row.shop_name.length;
                    if (strLength <= 12) {
                      return <p class="good-area-line">{row.shop_name}</p>;
                    } else {
                      return (
                        <el-popover
                          placement="bottom"
                          trigger="hover"
                          scopedSlots={{
                            reference: () => {
                              return <p class="good-area-line">{row.shop_name}</p>;
                            },
                          }}
                        >
                          <div class="popover-container">{row.shop_name}</div>
                        </el-popover>
                      );
                    }
                  },
                }}
              />
              <el-table-column label="店铺类目" prop="category" min-width={120} align="center" />
              <el-table-column label="店铺类型" prop="shop_type" min-width={200} align="center" />
              <el-table-column label="店铺品牌" prop="brand_name" min-width={200} />
              <el-table-column label="客户类型" prop="company_type" min-width={150} />
              {/*<el-table-column label="业务类型" prop="business_type" width={250} />*/}
              {/* <el-table-column
                label="关联公司"
                prop="company_names"
                min-width={250}
                scopedSlots={{
                  default: ({ row }: any) => {
                    if (row.company_names.length === 0) return <span>--</span>;
                    const strLength = row.company_names.join('、').length;
                    if (strLength <= 16) {
                      return <p class="good-area-line">{row.company_names.join('、')}</p>;
                    } else {
                      return (
                        <el-popover
                          placement="bottom"
                          trigger="hover"
                          scopedSlots={{
                            reference: () => {
                              return <p class="good-area-line">{row.company_names.join('、')}</p>;
                            },
                          }}
                        >
                          <div class="popover-container">
                            {row.company_names.map((item: string, key: number) => (
                              <span key={key}>{item}</span>
                            ))}
                          </div>
                        </el-popover>
                      );
                    }
                  },
                }}
              /> */}
              <el-table-column
                label="操作"
                prop="name"
                width={100}
                scopedSlots={{
                  default: ({ row }: any) => {
                    return (
                      <div class="operation">
                        {/*<a*/}
                        {/*  onclick={(evt: Event) => {*/}
                        {/*    evt.stopPropagation();*/}
                        {/*    showShopDetail(row.shop_id);*/}
                        {/*  }}*/}
                        {/*>*/}
                        {/*  查看*/}
                        {/*</a>*/}
                        {this.permission.customer_edit && (
                          <a
                            onclick={(evt: Event) => {
                              evt.stopPropagation();
                              showEditShopForm(row.shop_id);
                            }}
                          >
                            编辑
                          </a>
                        )}
                      </div>
                    );
                  },
                }}
              />
              <fragments slot="empty">
                <empty-common detail-text="暂无主播列表"></empty-common>
              </fragments>
            </tg-table>
          </div>
          <div class="block flex-none">
            {this.shops.length > 0 && (
              <el-pagination
                current-page={this.pagination.currentPage}
                page-sizes={this.pagination.pageSizes}
                pageSize={this.pagination.pageSize}
                total={this.pagination.total}
                oncurrent-change={(page_num: number) => {
                  this.searchShopParams.page_num = page_num;
                  this.query();
                }}
                onsize-change={(num: number) => {
                  this.searchShopParams.num = num;
                  this.query();
                }}
                layout="total, prev, pager, next, sizes, jumper"
              />
            )}
          </div>
        </div>
        {/*@ts-ignore*/}
        <ModifyShop close={this.saveSuccess} data={this.editShopData} />
        <shop-detail data={this.shopDetailData} />
      </div>
    );
  },
});
