import { defineComponent, ref, onMounted, h } from '@vue/composition-api';
import { useList } from './use';
import { AsyncConfirm } from '@/use/asyncConfirm';
import { useDialog } from '@/use/dialog';
import DialogEnter from './dialog/dialogEnter/index.vue';
import { WithdrawWriteOffOptions, WithdrawWriteOffTypes } from '@/const/options';
import { formatAmount } from '@/utils/string';
const statusMap = [
  {
    label: '全部',
    value: undefined,
  },
  ...WithdrawWriteOffOptions,
];

export default defineComponent({
  setup(props, ctx) {
    const {
      getUniteData,
      queryParams,
      uniteData,
      loading,
      columns,
      statistics_data,
      deleteUnite,
      total: unityTotal,
      writeOff,
    } = useList(ctx);
    const list: any = [];
    const formModel = ref({
      monthRange: [],
      status: undefined,
    });
    const delCost = async (costId: number, title: string) => {
      const result = await AsyncConfirm(ctx, title);
      if (!result) {
        return;
      }
      deleteUnite(costId);
    };
    const onWriteOff = async (id: number) => {
      const result = await AsyncConfirm(ctx, '是否核销该提现记录');
      if (!result) {
        return;
      }

      await writeOff(id);

      await getUniteData(queryParams.value);
    };
    columns.value.push({
      label: '操作',
      align: 'center',
      headerAlign: 'center',
      minWidth: 120,
      formatter: unite => {
        const btns = [];
        if (
          unite.write_off_status === WithdrawWriteOffTypes.writeoff_no ||
          unite.write_off_status === WithdrawWriteOffTypes.writeoff_partial
        ) {
          btns.push(
            h(
              'tg-button',
              {
                props: {
                  type: 'link',
                },
                class: 'mgr-12',
                on: {
                  click: (event: PointerEvent) => {
                    event.stopPropagation();
                    onWriteOff(unite.id);
                  },
                },
              },
              ['核销'],
            ),
          );
        } else {
          btns.push(
            h(
              'tg-button',
              {
                props: {
                  type: 'link',
                },
                attrs: {
                  style: 'visibility: hidden',
                },
                class: 'mgr-12',
              },
              ['核销'],
            ),
          );
        }

        btns.push(
          h(
            'tg-button',
            {
              props: {
                type: 'link',
              },
              class: 'mgr-12',
              on: {
                click: (event: PointerEvent) => {
                  delCost(unite.id, '是否删除该提现记录');
                  event.stopPropagation();
                },
              },
            },
            ['删除'],
          ),
        );
        return btns;
      },
    });

    const queryHandler = () => {
      queryParams.value = {
        start_time: formModel.value.monthRange[0],
        end_time: formModel.value.monthRange[1],
        write_off_status: formModel.value.status,
        page_num: queryParams.value.page_num,
        num: queryParams.value.num,
      };
      getUniteData(queryParams.value);
    };
    const resetHandler = () => {
      formModel.value = {
        monthRange: [],
        status: undefined,
      };
      queryHandler();
    };
    const createHandler = () => {
      getUniteData(queryParams.value);
    };
    const handleCurrentChange = (v: number) => {
      queryParams.value.page_num = v;
      queryHandler();
    };
    const handlePageSizeChange = (v: number) => {
      queryParams.value.num = v;
      queryHandler();
    };
    const reload = () => {
      getUniteData(queryParams.value);
    };
    onMounted(() => {
      getUniteData(queryParams.value);
    });

    const dialogEnter = useDialog({
      width: '440px',
      component: DialogEnter,
      title: '提现登记',
      on: {
        submit() {
          reload();
        },
      },
    });
    return {
      statistics_data,
      queryParams,
      list,
      loading,
      columns,
      handleCurrentChange,
      handlePageSizeChange,
      queryHandler,
      uniteData,
      resetHandler,
      unityTotal,
      createHandler,
      formModel,
      dialogEnter,
      reload,
    };
  },
  render() {
    return (
      <div class="withdrawal-unite">
        <tg-card padding={[16, 16, 4, 16]} class="withdrawal-filter">
          <el-form
            class="flex-form"
            inline={true}
            size="mini"
            show-message={false}
            label-width="60px"
          >
            <el-form-item label="提现时间：">
              <el-date-picker
                v-model={this.formModel.monthRange}
                value-format={'yyyy-MM-dd'}
                type="daterange"
                range-separator="~"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                size="mini"
                style="width: 240px"
                format="yyyy.MM.DD"
              />
            </el-form-item>
            <el-form-item label="状态：" label-width="40px">
              <el-select
                popper-class="el-select-popper-mini"
                v-model={this.formModel.status}
                clearable
                placeholder="全部"
                style="width: 250px"
              >
                {statusMap.map((item: any) => (
                  <el-option key={item.label} label={item.label} value={item.value} />
                ))}
              </el-select>
            </el-form-item>

            <el-form-item label=" " label-width="0px">
              <tg-button
                type="primary"
                onClick={() => {
                  this.queryHandler();
                }}
              >
                查询
              </tg-button>
              <tg-button
                class="mgl-8"
                onClick={() => {
                  this.resetHandler();
                }}
              >
                重置
              </tg-button>
            </el-form-item>
          </el-form>
        </tg-card>
        <tg-card class="mgt-10 withdrawal-table">
          <div class="total-box mgt-12">
            <tg-button
              type="primary"
              onClick={() => {
                this.dialogEnter.show();
              }}
            >
              提现登记
            </tg-button>
            <div class="total-num">
              <div class="label-value">
                <span class="label">已提现笔数：</span>
                <span class="value">{this.statistics_data.count_withdraw}</span>
              </div>
              <div class="label-value">
                <span class="label">提现金额：</span>
                <span class="value">{formatAmount(this.statistics_data.sum_withdraw_amount)}</span>
              </div>
              <div class="label-value">
                <span class="label">核销金额：</span>
                <span class="value">{formatAmount(this.statistics_data.sum_write_off_amount)}</span>
              </div>
              <div class="label-value">
                <span class="label">未核销金额：</span>
                <span class="value orange">
                  {formatAmount(this.statistics_data.sum_not_write_off_amount)}
                </span>
              </div>
            </div>
          </div>
          <div class="table-full mgt-12">
            <tg-table
              border
              stripe
              v-loading={this.loading}
              data={this.uniteData}
              columns={this.columns}
              height={'100%'}
            >
              {this.uniteData.length === 0 && (
                <template slot="empty">
                  <empty-common detail-text="暂无记录" />
                </template>
              )}
            </tg-table>
          </div>
          {this.uniteData.length > 0 && (
            <el-pagination
              class="flex-none"
              current-page={this.queryParams.page_num}
              page-sizes={[10, 20, 50, 100]}
              page-size={this.queryParams.num}
              total={this.unityTotal}
              layout="total, prev, pager, next, sizes, jumper"
              on-current-change={this.handleCurrentChange}
              on-size-change={this.handlePageSizeChange}
            />
          )}
        </tg-card>
      </div>
    );
  },
});
