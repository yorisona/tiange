import { DefText } from '@/components/DefText/dt';
import { AssociateExistingContractApply, GetNewContractListByType } from '@/services/contract';
import { QueryAllCompany } from '@/services/supplier';
import { Contract, SignTypeMap } from '@/types/tiange/contract';
import { ApprovalStatus } from '@/types/tiange/system';
import { TgTableColumn } from '@/types/vendor/column';
import { Decimal2String } from '@/utils/string';
import { usePagination, useRequest } from '@gm/hooks/ahooks';
import { defineComponent, h, ref, watch } from '@vue/composition-api';
import Decimal from 'decimal.js';
import { Message } from 'element-ui';
// import { removeZeroKolCommission } from '../../list/collection';
interface FormData {
  company_id?: number;
  showOutdate?: boolean;
  type?: string;
  project_uid?: string;
}

type Col = TgTableColumn<Contract>;

export default defineComponent({
  setup: (props, ctx) => {
    const selectedId = ref<number>();
    const formData = ref<FormData>({
      company_id: undefined,
      showOutdate: true,
      type: undefined,
      project_uid: undefined,
    });
    const loading = ref(false);
    const tableLoading = ref(false);
    const methods = {
      // 1 营销，2 店播，3 mcn
      show(config: { type: '1' | '2' | '3' | '4'; project_uid: string }) {
        formData.value.type = config.type;
        formData.value.project_uid = config.project_uid;
      },
      async onSaveBtnClick() {
        if (!selectedId.value) {
          Message.warning('请先选择合同');
          return;
        }
        await submitServe
          .runAsync(
            {
              project_uid: formData.value.project_uid,
              contract_id: selectedId.value,
            },
            formData.value.type,
          )
          .then(() => {
            ctx.emit('submit');
            ctx.emit('close');
          });
      },
      onKeyup(event: KeyboardEvent) {
        if (event.key === 'Enter') {
          // 发起搜索
          // console.log('🚀 ~ file: index.tsx ~ line 32 ~ onKeyup ~ 发起搜索');
          pageServe.reload();
        }
      },
    };

    const columns = ref<Col[]>([
      {
        label: '选择',
        align: 'center',
        minWidth: 50,
        formatter: (row: any) => (
          <el-checkbox
            value={selectedId.value === row.contract_info.id}
            onChange={(val: boolean) => {
              selectedId.value = val ? row.contract_info.id : undefined;
            }}
          ></el-checkbox>
        ),
      },
      {
        label: '客户名称',
        minWidth: 136,
        showOverflowTooltip: true,
        align: 'center',
        formatter: (row: any) => {
          return row.contract_info.contract_type === 1 || row.contract_info.contract_type === 2
            ? row.contract_info.company_name || '--'
            : row.contract_info.contract_type === 5
            ? row.contract_info.company_name || '--'
            : row.template_info && row.template_info.our_info
            ? row.template_info.our_info[0].value || '--'
            : '--';
        },
      },
      {
        label: '供应商名称',
        minWidth: 136,
        showOverflowTooltip: true,
        align: 'center',
        formatter: (row: any) => {
          return row.contract_info.contract_type === 1 || row.contract_info.contract_type === 2
            ? row.contract_info.shop_name || '--'
            : row.contract_info.contract_type === 5
            ? row.template_info && row.template_info.our_info
              ? row.template_info.our_info[0].value || '--'
              : row.contract_info.company_name || '--'
            : row.contract_info.company_name || '--';
        },
      },
      {
        label: '合同类别',
        minWidth: 88,
        formatter: row =>
          row.contract_info.contract_type === 1 ||
          row.contract_info.contract_type === 2 ||
          row.contract_info.contract_type === 5
            ? '客户合同'
            : '供应商合同',
      },
      {
        label: '签约类型',
        minWidth: 80,
        align: 'center',
        formatter: (row: any) => SignTypeMap.get(row?.contract_info?.sign_type) || '--',
      },
      // {
      //   label: '合同金额',
      //   align: 'left',
      //   minWidth: 200,
      //   formatter: row => {
      //     const arr = [];
      //     if (row.contractMoney) {
      //       arr.push(
      //         h('div', [
      //           h(
      //             'span',
      //             {
      //               style: {
      //                 color: 'var(--text-third-color)',
      //               },
      //             },
      //             [row.contractCommission ? '服务费：' : '固定服务费：'],
      //           ),
      //           h(
      //             'span',
      //             {
      //               style: {
      //                 color: '#19232D',
      //               },
      //             },
      //             [row.contractMoney ?? '--'],
      //           ),
      //         ]),
      //       );
      //     }
      //     if (row.contractCommission) {
      //       arr.push(
      //         h('div', [
      //           h(
      //             'span',
      //             {
      //               style: {
      //                 color: '#a4b2c2',
      //               },
      //             },
      //             ['佣金：'],
      //           ),
      //           h(
      //             'span',
      //             {
      //               style: {
      //                 color: '#19232D',
      //               },
      //             },
      //             [removeZeroKolCommission(row.contractCommission) || '--'],
      //           ),
      //         ]),
      //       );
      //     }
      //     if (row.contractOtherMoney) {
      //       arr.push(
      //         h('div', [
      //           h(
      //             'span',
      //             {
      //               style: {
      //                 color: '#19232D',
      //               },
      //             },
      //             [row.contractOtherMoney ?? '--'],
      //           ),
      //         ]),
      //       );
      //     }
      //     return arr.length > 0 ? arr : '--';
      //   },
      // },
      {
        label: '合作期限',
        minWidth: 160,
        align: 'center',
        formatter: ({ contract_info: { coop_start_date, coop_end_date } }) => {
          if (coop_start_date !== null && coop_end_date === null) {
            coop_end_date = '长期有效';
          }
          const arr: any = [coop_start_date, coop_end_date];
          const timestr =
            arr
              .filter((el: any) => el !== null)
              .join('～')
              .replace(/-/g, '.') || DefText();
          return timestr;
        },
      },
      {
        label: '创建时间',
        align: 'center',
        minWidth: 100,
        formatter: row =>
          h(
            'div',
            {
              // style: {
              // paddingLeft: '15px',
              // color: '#a4b2c2',
              // },
            },
            [row.contract_info.create_time_str?.split(' ')?.[0].replace(/-/g, '.') ?? DefText()],
          ),
      },
      {
        label: '创建人',
        align: 'center',
        showOverflowTooltip: true,
        minWidth: 80,
        formatter: row => h('div', {}, [row.contract_info.add_by_name ?? DefText()]),
      },
    ]);

    const companyServe = useRequest(QueryAllCompany, { manual: true });
    const pageServe = usePagination(GetNewContractListByType, {
      manual: true,
      defaultParams: [
        {
          num: 10,
          page_num: 1,
          page_size: 10,
        },
        {},
        formData.value.type,
      ],
      transform(res) {
        return res.data.map(item => {
          const template_info = item.template_info;
          if (template_info) {
            const pay_condition = template_info.pay_condition;
            if (pay_condition) {
              pay_condition.filter((subItem: any) => {
                if (subItem.key === '收费类型') {
                  item.getMoneytype = subItem.value;
                  item.contractMoney = '';
                  item.contractCommission = '';
                  item.contractOtherMoney = '';
                  if (!subItem.value) {
                    item.getMoneytype = '其它';
                  }
                }
                if (item.getMoneytype === '纯佣金') {
                  if (subItem.key === '佣金') {
                    item.contractCommission = subItem.value ? subItem.value + '%' : '';
                  }
                  if (subItem.key === '构美佣金' && Number(subItem.value) !== 0) {
                    const value = subItem.value ? subItem.value + '%(构美)' : '';
                    item.contractCommission = value;
                  }
                  if (subItem.key === '主播佣金') {
                    const value = subItem.value ? subItem.value + '%(主播)' : '';
                    item.contractCommission = item.contractCommission
                      ? value + '+' + item.contractCommission
                      : value;
                  }
                }
                if (
                  item.getMoneytype === '服务费+佣金' ||
                  item.getMoneytype === '固定服务费+佣金'
                ) {
                  item.getMoneytype = '服务费+佣金';
                  if (subItem.key === '固定服务费') {
                    item.contractMoney =
                      subItem.value || Number(subItem.value) === 0
                        ? '￥' + Decimal2String(new Decimal(subItem.value))
                        : '';
                  }
                  if (subItem.key === '构美佣金' && Number(subItem.value) !== 0) {
                    const value = subItem.value ? subItem.value + '%(构美)' : '';
                    item.contractCommission = value;
                  }
                  if (subItem.key === '主播佣金') {
                    const value = subItem.value ? subItem.value + '%(主播)' : '';
                    item.contractCommission = item.contractCommission
                      ? value + '+' + item.contractCommission
                      : value;
                  }
                  if (subItem.key === '佣金') {
                    const value = subItem.value ? subItem.value + '%' : '';
                    item.contractCommission = value;
                  }
                }
                if (item.getMoneytype === '固定服务费') {
                  if (subItem.key === '固定服务费') {
                    item.contractMoney =
                      subItem.value || Number(subItem.value) === 0
                        ? '￥' + Decimal2String(new Decimal(subItem.value))
                        : '';
                  }
                }
                if (item.getMoneytype === '其它') {
                  if (subItem.key === '其它') {
                    item.contractOtherMoney = '--';
                  }
                }
              });
            } else {
              const contract_info = item.contract_info;
              if (contract_info.contract_type === 7) {
                const cooperation_content = template_info.cooperation_content;
                if (cooperation_content) {
                  cooperation_content.filter((subItem: any) => {
                    if (subItem.key === '计算方式') {
                      const computeWayRecords = [
                        { value: 1, label: '小时服务费' },
                        { value: 9, label: '保底服务费' },
                        { value: 4, label: '小时服务费或提点' },
                        { value: 2, label: '保底服务费或提点' },
                        { value: 5, label: '小时服务费或阶梯式提点' },
                        { value: 6, label: '保底服务费或阶梯式提点' },
                        { value: 7, label: '保底服务费A或保底服务费B+提点' },
                        { value: 8, label: '小时服务费或保底服务费+提点' },
                      ];
                      const index = subItem.value;
                      let str = '--';
                      computeWayRecords.map((item: any) => {
                        if (String(item.value) === String(index)) {
                          str = item.label;
                        }
                      });
                      item.getMoneytype = str || '--';
                      item.contractOtherMoney = '--';
                    }
                    if (item.getMoneytype === '保底服务费') {
                      if (subItem.key === '保底服务费') {
                        item.contractOtherMoney =
                          subItem.value || Number(subItem.value) === 0
                            ? '￥' + Decimal2String(new Decimal(subItem.value))
                            : '';
                      }
                    }
                    if (item.getMoneytype === '小时服务费') {
                      if (subItem.key === '小时服务费') {
                        item.contractOtherMoney =
                          subItem.value || Number(subItem.value) === 0
                            ? '￥' + Decimal2String(new Decimal(subItem.value)) + '元/小时'
                            : '';
                      }
                    }
                  });
                }
              } else {
                item.getMoneytype = '--';
                item.contractOtherMoney = item.contract_detail.contract_amount?.length
                  ? '￥' + Decimal2String(new Decimal(item.contract_detail.contract_amount))
                  : '--';
              }
            }
          } else {
            item.getMoneytype = '--';
            item.contractOtherMoney = item.contract_detail.contract_amount?.length
              ? '￥' + Decimal2String(new Decimal(item.contract_detail.contract_amount))
              : '--';
          }
          return item;
        });
      },
    });
    const submitServe = useRequest(AssociateExistingContractApply, { manual: true });

    const onCompanyNameInput = (keyword: string) => {
      if (keyword) {
        companyServe.runAsync({
          num: 1000,
          page_num: 1,
          company_name: keyword,
        });
      }
    };

    watch(
      () => [formData.value.company_id, formData.value.showOutdate],
      () => {
        if (formData.value.company_id) {
          pageServe.runAsync(
            {
              num: pageServe.pagination.num,
              page_num: pageServe.pagination.page_num,
            },
            {
              company_id: formData.value.company_id,
              is_pass_expired: formData.value.showOutdate,
              contract_status: ApprovalStatus.Normal,
              is_pass_associated: true,
            },
            formData.value.type,
          );
        }
      },
    );

    return {
      columns,
      loading,
      tableLoading,
      formData,
      pageServe,
      submitServe,
      companyServe,
      onCompanyNameInput,
      ...methods,
    };
  },
  render() {
    return (
      <div class="related-public-contract-container">
        <section class="tip-field">
          <div class="tip">
            <tg-icon name="ico-icon_tongyong_jinggao_mianxingbeifen-01"></tg-icon>
            <span class="tip-content">
              合同已在其它项目中发起并通过审批的，可搜索并关联至本项目。
            </span>
          </div>
        </section>
        <section class="query-field">
          <div class="company-name" label="公司名称">
            {/* <el-input
              clearable
              style="width: 336px"
              size="mini"
              v-model={this.formData.company_name}
              placeholder="请输入公司名称搜索已签约的合同"
              nativeOnKeyup={this.onKeyup}
            >
              <i slot="prepend" class="el-icon-search"></i>
            </el-input> */}
            <el-select
              v-model={this.formData.company_id}
              clearable
              style="width: 336px"
              filterable
              remote
              reserve-keyword
              size="mini"
              loading={this.companyServe.loading}
              remote-method={this.onCompanyNameInput}
              placeholder="请输入公司名称搜索已签约的合同"
              // nativeOnKeyup={this.onKeyup}
            >
              {(this.companyServe.data?.data ?? []).map((el: any) => {
                return (
                  <el-option
                    label={el.id < 0 ? `${el.company_name} (供应商)` : `${el.company_name} (客户)`}
                    value={el.id}
                    key={el.id}
                  ></el-option>
                );
              })}
              <i slot="prefix" class="el-icon-search"></i>
            </el-select>
          </div>
          <el-checkbox class="mgl-12" v-model={this.formData.showOutdate}>
            剔除已过期合同
          </el-checkbox>
        </section>
        <section
          class="table-field"
          style={(this.pageServe.data?.length || 0) === 0 ? 'margin-bottom: 24px' : ''}
        >
          <tg-table
            stripe
            border
            v-loading={this.pageServe.loading}
            columns={this.columns}
            height="380"
            data={this.pageServe.data || []}
            pagination={this.pageServe.pagination}
          >
            <empty-common slot="empty" detail-text="暂无数据" />
          </tg-table>
        </section>
        <tg-mask-loading
          visible={this.submitServe.loading}
          content="  正在保存，请稍候..."
        ></tg-mask-loading>
      </div>
    );
  },
});
