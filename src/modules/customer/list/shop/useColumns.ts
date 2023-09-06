import { computed, h, ref } from '@vue/composition-api';
import { CustomerShop } from '@/types/tiange/customer';
import { TableColumn } from '@/types/vendor/column';
import { get_limited_length_string } from '@/utils/string';
import { max_length_of_column } from '@/utils/table';
import { ShopType } from '@/types/tiange/customer.enum';
import { TableColumnRenderReturn } from '@/types/tiange/utils';
import { areaStr as filterAreaStr } from '@/utils/filter';
import { addDateFormat, companyTypeList } from '@/utils/format';
import useVisible from '@/use/visible';

const useCustomerShopListLogic = () => {
  const loading = ref(false);
  const list = ref<CustomerShop[]>([]);
  const total = ref(0);

  const { visible: filterFormVisible, toggleVisible: toggleFilterFormVisible } = useVisible(true);

  /** 店铺名称渲染函数 */
  const shop_name_render = <T extends boolean>(row: CustomerShop, text_only: T) => {
    const { shop_type, shop_name } = row;
    const text = shop_name;

    if (text_only) {
      // 追加字数补丁
      return text + '字数';
    }

    const { is_folded, folded_text } = get_limited_length_string(text, 12);

    const ref_node = h('div', { class: 'shop-name', slot: 'reference' }, [
      h('tg-icon', {
        props: {
          name:
            shop_type === ShopType.Taobao
              ? 'ico-taobao'
              : shop_type === ShopType.Tmall
              ? 'ico-tmall'
              : shop_type === ShopType.wechat_video
              ? 'ico-douyin'
              : 'ico-douyin',
        },
      }),
      h('span', { style: 'margin-left: 6px' }, [folded_text]),
    ]);

    return is_folded
      ? (h(
          'el-popover',
          {
            props: {
              trigger: 'hover',
              placement: 'top',
            },
          },
          [shop_name, ref_node],
        ) as TableColumnRenderReturn<T>)
      : (ref_node as TableColumnRenderReturn<T>);
  };

  /** 店铺名称最大宽度 */
  const shop_name_max_length = max_length_of_column(list, '店铺名称', shop_name_render);

  /** 店铺类目渲染函数 */
  const category_render = (row: CustomerShop) => filterAreaStr(row.category);

  /** 店铺类目最大宽度 */
  const category_max_length = max_length_of_column(list, '店铺类目', category_render);

  /** 客户类型渲染函数 */
  const company_type_render = <T extends boolean>(row: CustomerShop, text_only: T) => {
    const text = companyTypeList[row.company_type].value
      ? companyTypeList[row.company_type].value
      : '--';

    if (text_only) {
      // 年框标志会占用额外空间，所以加上字数补丁来模拟最终宽度
      return text + row.is_year_customer ? '年框字数补丁丁' : '';
    }

    return row.is_year_customer
      ? (h('div', [
          text,
          h('span', { class: 'year-box', style: 'line-height:24px' }, ['年框']),
        ]) as TableColumnRenderReturn<T>)
      : text;
  };

  /** 客户类型最大宽度 */
  const company_type_max_length = max_length_of_column(list, '客户类型', company_type_render);

  /** 公司名称渲染函数 */
  const company_name_render = <T extends boolean>(row: CustomerShop, text_only: T) => {
    const list = row.companies.map(item => {
      return item.company_name;
    });
    let text = '--';
    if (list.length > 0) {
      text = list.join(' ');
    }
    const { is_folded, folded_text } = get_limited_length_string(text, 12);
    return text_only || !is_folded
      ? folded_text
      : (h(
          'el-popover',
          {
            props: {
              trigger: 'hover',
              placement: 'top',
            },
          },
          [text, h('span', { slot: 'reference' }, [folded_text])],
        ) as TableColumnRenderReturn<T>);
  };

  /** 录入人渲染函数 */
  const add_by_render = (row: CustomerShop) => row.add_by;

  /** 录入人最大宽度 */
  const add_by_max_length = max_length_of_column(list, '录入人', add_by_render);

  /** 公司名称最大宽度 */
  const company_name_max_length = max_length_of_column(list, '公司名称', company_name_render);

  /** 录入时间渲染函数 */
  const gmt_create_render = (row: CustomerShop) => addDateFormat(row.gmt_create);

  /** 录入时间最大宽度 */
  const gmt_create_max_length = max_length_of_column(list, '录入时间', gmt_create_render);

  const columns = computed<TableColumn<CustomerShop>[]>(() => [
    {
      type: 'selection',
      fixed: 'left',
      width: 52,
    },
    {
      label: '店铺名称',
      fixed: 'left',
      minWidth: shop_name_max_length.value,
      formatter: row => shop_name_render(row, false),
    },
    {
      label: '店铺类目',
      minWidth: category_max_length.value,
      formatter: category_render,
    },
    {
      label: '客户类型',
      minWidth: company_type_max_length.value,
      formatter: row => company_type_render(row, false),
    },
    {
      label: '公司名称',
      minWidth: company_name_max_length.value,
      formatter: row => company_name_render(row, false),
    },
    {
      label: '录入人',
      minWidth: add_by_max_length.value,
      formatter: add_by_render,
    },
    {
      label: '录入时间',
      minWidth: gmt_create_max_length.value,
      formatter: gmt_create_render,
    },
  ]);

  return {
    loading,
    list,
    total,
    columns,
    filterFormVisible,
    toggleFilterFormVisible,
  };
};

export default useCustomerShopListLogic;
