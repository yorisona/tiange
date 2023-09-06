import { defineComponent, ref, onMounted, h } from '@vue/composition-api';
import createDialog from '../createSettlement/index.vue';
import detailDialog from '../settlementDetail/index';
import { useCostLogic } from '../../useUnite';
import { AsyncConfirm } from '@/use/asyncConfirm';

interface IDialogRef {
  show(...args: any[]): void;
}
const statusMap = [
  {
    label: '全部',
    value: undefined,
  },
  {
    label: '待财务确认',
    value: '1',
  },
  {
    label: '待项目确认',
    value: '4',
  },
  {
    label: '项目不通过',
    value: '5',
  },
  {
    label: '已确认',
    value: '2',
  },
];

export default defineComponent({
  components: {
    createDialog,
    detailDialog,
  },
  setup(props, ctx) {
    const {
      getUniteData,
      queryParams,
      uniteData,
      loading,
      columns,
      deleteUnite,
      total: unityTotal,
    } = useCostLogic(ctx);
    const list: any = [];
    const createDialogRef = ref<IDialogRef | null>(null);
    const detailDialogRef = ref<IDialogRef | null>(null);
    const createUnite = () => {
      createDialogRef.value?.show();
    };
    const monthRange = ref([]);
    const delCost = async (costId: number, title: string) => {
      const result = await AsyncConfirm(ctx, title);
      if (!result) {
        return;
      }
      deleteUnite(costId);
    };
    columns.value.push({
      label: '操作',
      align: 'center',
      headerAlign: 'center',
      minWidth: 120,
      formatter: (unite: any) => {
        const btns = [];
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
                  detailDialogRef.value?.show(unite);
                },
              },
            },
            ['查看'],
          ),
        );
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
                  delCost(unite.id, '是否删除该结算单');
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
      getUniteData(queryParams.value);
    };
    const resetHandler = () => {
      queryParams.value = {
        settlement_date_start: undefined,
        settlement_date_end: undefined,
        status: undefined,
        is_estimate: '1',
        page_num: 1,
        num: 20,
        settlement_kind: 2,
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
    const monthHandle = (val: any) => {
      if (val) {
        queryParams.value.settlement_date_start = val[0];
        queryParams.value.settlement_date_end = val[1];
      } else {
        queryParams.value.settlement_date_start = undefined;
        queryParams.value.settlement_date_end = undefined;
      }
    };
    onMounted(() => {
      queryHandler();
    });
    return {
      queryParams,
      createUnite,
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
      monthHandle,
      createDialogRef,
      detailDialogRef,
      monthRange,
    };
  },
  render() {
    return (
      <div class="investment-automatic">
        <tg-card padding={[16, 16, 4, 16]} class="investment-automatic-filter">
          <el-form
            class="flex-form"
            inline={true}
            size="mini"
            show-message={false}
            label-width="60px"
          >
            <el-form-item label="结算周期：">
              <el-date-picker
                v-model={this.monthRange}
                type="monthrange"
                start-placeholder="开始月份"
                end-placeholder="结束月份"
                style="width: 250px"
                range-separator="~"
                format="yyyy.MM"
                value-format="yyyy-MM-01"
                onChange={this.monthHandle}
              />
            </el-form-item>
            <el-form-item label="状态：" label-width="40px">
              <el-select
                popper-class="el-select-popper-mini"
                v-model={this.queryParams.status}
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
        <tg-card class="mgt-10 investment-automatic-table">
          <tg-button-line class="mgt-12">
            <tg-button
              type="primary"
              icon="ico-btn-add"
              onClick={() => {
                this.createUnite();
              }}
            >
              发起统一结算
            </tg-button>
          </tg-button-line>
          <tg-table
            border
            stripe
            v-loading={this.loading}
            class="mgt-12 investment-automatic-table-content"
            data={this.uniteData}
            height="calc(100vh - 282px)"
          >
            {this.columns.map((col, colIndex) => (
              <el-table-column props={{ ...col }} key={colIndex} />
            ))}
            {this.uniteData.length === 0 && (
              <template slot="empty">
                <empty-common detail-text="暂无项目"></empty-common>
              </template>
            )}
          </tg-table>
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
        <create-dialog
          ref="createDialogRef"
          is_estimate="1"
          settlement_kind="2"
          onSuccess={(unite: any) => {
            this.detailDialogRef?.show(unite);
            this.createHandler();
          }}
        />
        <detail-dialog
          is_estimate="2"
          settlement_kind="2"
          ref="detailDialogRef"
          onSuccess={() => {
            this.createHandler();
          }}
        />
      </div>
    );
  },
});
