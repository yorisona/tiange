/**
 * 公司管理列表逻辑
 * @author  Jerry <superzcj_001@163.com>
 * @since   2020-10-30 14:10:21
 */
import { computed, h, ref } from '@vue/composition-api';
import type { SetupContext } from '@vue/composition-api';
import { TableColumn } from '@/types/vendor/column';
import { Company, CompanyListQueryParams } from '@/types/tiange/company';
import { GetCompanyList } from '@/services/company';
import { DateStr } from '@/types/base/advanced';
import { CompanyRights } from './useRight';
import { useWindowRect } from '@/use/window';
import { RouterNameCustomer } from '@/const/router';
import moment from 'moment';
import { TableColumnRenderReturn } from '@/types/tiange/utils';
import { get_limited_length_string } from '@/utils/string';
import { usePermission } from '@/use/permission';
import { VNode } from 'vue';
import { customerCompanyVerifyStatus } from '@/const/companyConst';
import { Brand } from '@/types/tiange/brand';

type Col = TableColumn<Company>;

export const useList = (ctx: SetupContext, rights: CompanyRights) => {
  const UseWindowRect = useWindowRect();
  const permission = usePermission();
  const { hasCheckboxRight, hasOnlyDeleteRight } = rights;

  const data = ref<Company[]>([]);
  const loading = ref(false);
  const total = ref(0);
  /** 公司名称渲染函数 */
  const company_name_render = <T extends boolean>(
    row: Company,
    text_only: T,
  ): TableColumnRenderReturn<T> => {
    const { company_name } = row;
    const { is_folded, folded_text } = get_limited_length_string(
      company_name ? company_name : '--',
      12,
    );

    if (text_only) {
      return folded_text;
    }

    // const imgNode = h('img', {
    //   class: ['company-logo', isClassFallback.value ? 'mgr-10' : ''],
    //   domProps: { src: fixFileToken(imgLink) },
    // });

    if (is_folded) {
      return h('div', { class: 'company-name-line' }, [
        h(
          'el-popover',
          {
            props: {
              placement: 'right',
              content: company_name,
              trigger: 'hover',
            },
          },
          [
            <span class="company-name" slot="reference">
              {folded_text}
            </span>,
          ],
        ),
      ]) as TableColumnRenderReturn<T>;
    } else {
      return h('div', { class: 'company-name-line' }, [
        <span class="company-name">{folded_text}</span>,
      ]) as TableColumnRenderReturn<T>;
    }
  };

  const filters = (value: any, arr: any) => {
    return arr.find((item: any) => item.value === value)?.label;
  };

  const columns = computed<Col[]>(() => [
    ...(hasCheckboxRight.value
      ? ([
          {
            type: 'selection',
            align: 'center',
            headerAlign: 'center',
            width: 52,
            selectable: hasOnlyDeleteRight.value
              ? (row: Company) => (row.brands?.length || 0) <= 0
              : () => true,
          },
        ] as Col[])
      : ([] as Col[])),
    {
      label: '公司名称',
      prop: 'company_name',
      minWidth: 300,
      formatter: row => company_name_render(row, false),
    },
    ...(UseWindowRect.isSmallScreen.value
      ? []
      : [
          {
            label: '',
            width: 58,
          },
        ]),
    {
      label: '关联品牌',
      prop: 'brands',
      minWidth: 300,
      headerAlign: 'left',
      align: 'left',
      formatter: (row: Company, column: Col, brands: Brand[]) => {
        const brand_names = brands?.map(el => el.brand_name) || [];
        if (brand_names.length === 0) {
          return '--';
        }

        if (brand_names.length < 5) {
          return <span class="line-clamp-2">{brand_names.join('/')}</span>;
        }

        return h(
          'el-tooltip',
          {
            props: {
              effect: 'light',
              popperClass: 'tg-tooltip-theme',
              placement: 'right',
            },
          },
          [
            h(
              'div',
              { slot: 'content' },
              brand_names.map(name => <div>{name}</div>),
            ),
            <span class="shop-names line-clamp-2">{brand_names.slice(0, 5).join('/')}</span>,
          ],
        );
      },
    },
    {
      label: '录入人',
      prop: 'add_by',
      minWidth: 120,
      align: 'center',
      formatter: (row: Company, column: Col, text: string) => text ?? '--',
    },
    {
      label: '录入日期',
      prop: 'gmt_create',
      minWidth: 220,
      align: 'center',
      formatter: (row: Company, column: Col, text: DateStr): string =>
        moment(text).format('YYYY.MM.DD HH:mm:ss'),
    },
    {
      label: '审核状态',
      prop: 'verify_status',
      minWidth: 120,
      align: 'left',
      formatter: (row: Company, column: Col, text: number): VNode => {
        let class_name = 'point ';

        if (text === -1) {
          class_name += ' block';
        } else if (text === 1) {
          class_name += ' success';
        } else if (text === 2) {
          class_name += ' not-commit';
        } else {
          class_name += ' process';
        }

        return h(
          'div',
          {
            attrs: {
              class: 'co-status',
            },
          },
          [
            h('p', {
              attrs: {
                class: class_name,
              },
            }),
            h('span', {}, filters(text, customerCompanyVerifyStatus)),
          ],
        );
      },
    },
    {
      label: '操作',
      prop: 'add_by',
      minWidth: 120,
      align: 'left',
      formatter: (row: Company) => {
        return (
          <div class="operation">
            <a>查看</a>
            {(row.verify_status === -1 || row.verify_status === 2) && permission.company_edit && (
              <a
                onclick={(evt: Event) => {
                  evt.stopPropagation();
                  ctx.root.$router.push({
                    name: RouterNameCustomer.companyEdit,
                    params: {
                      id: row.id + '',
                    },
                  });
                }}
              >
                编辑
              </a>
            )}
          </div>
        );
      },
    },
  ]);

  /**
   * 加载数据
   * @author  Jerry <superzcj_001@163.com>
   * @since   2020-10-30 14:58:48
   */
  const loadData = async (payload: CompanyListQueryParams) => {
    loading.value = true;
    const { data: response } = await GetCompanyList(payload);
    loading.value = false;

    data.value.splice(0, data.value.length);
    if (response.success) {
      data.value.push(...response.data.data);
      total.value = response.data.total;
    } else {
      total.value = 0;
    }
  };

  // 选中数据
  const selectionList = ref<Company[]>([]);

  // 选中处理
  const onSelectionChange = (ids: Company[]) => {
    selectionList.value = ids;
  };

  // 选中计数
  const selectionCount = computed(() => selectionList.value.length);

  // 行点击跳转详情页
  const onRowClick = (row: Company) => {
    ctx.root.$router.push({
      name: RouterNameCustomer.companyDetail,
      params: { id: `${row.id}` },
    });
  };

  return {
    ...UseWindowRect,
    columns,
    data,
    loading,
    total,
    loadData,
    selectionList,
    onSelectionChange,
    selectionCount,
    onRowClick,
    hasCheckboxRight,
  };
};
