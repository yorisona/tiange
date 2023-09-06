import { defineComponent, ref, onMounted, h } from '@vue/composition-api';
import createDialog from '../createSettlement/index.vue';
import detailDialog from '../settlementDetail/index';
import { useAutomatic } from '../../useUnite';
import { AsyncConfirm } from '@/use/asyncConfirm';
import { ValidationFileUpload } from '@/modules/supplier/playerManager/common/FormValidation';
import { PostStatementUnity } from '@/services/investment';

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
    } = useAutomatic(ctx);
    const list: any = [];
    const createDialogRef = ref<IDialogRef | null>(null);
    const detailDialogRef = ref<IDialogRef | null>(null);
    const createUnite = (type = 0) => {
      createDialogRef.value?.show(type);
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
        is_estimate: '0',
        page_num: 1,
        num: 20,
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
      getUniteData(queryParams.value);
    });

    /* 上传对账单 */
    const uploadLoading = ref(false);
    const beforeMerchantUpload = (config: any) => {
      uploadLoading.value = true;
      return ValidationFileUpload({ csv: true, fileSize: 2048 })(config);
    };
    const successMerchantUpload = async (res: { data: any; success: boolean; message: string }) => {
      if (res && res.success) {
        console.log('----', res.data.source);
        try {
          const { data } = await PostStatementUnity({ file_path: res.data.source });
          uploadLoading.value = false;
          if (data.success) {
            ctx.root.$message.success(data.message || '提交成功');
            createHandler();
          } else {
            throw new Error(data.message);
          }
        } catch (_err: any) {
          uploadLoading.value = false;
          ctx.root.$message({
            type: 'warning',
            message: _err || '提交失败，稍后重试',
            duration: 2000,
            showClose: true,
          });
        } finally {
          uploadLoading.value = false;
        }
      } else {
        uploadLoading.value = false;
        ctx.root.$message.error(res.message);
      }
    };

    return {
      uploadLoading,
      beforeMerchantUpload,
      successMerchantUpload,
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
            <tg-button
              type="primary"
              icon="ico-btn-add"
              onClick={() => {
                this.createUnite(1);
              }}
            >
              上传对账单
            </tg-button>
            {/*<tg-upload
              v-loading={this.uploadLoading}
              action="/api/resources/upload_file"
              data={{ type: 'settlement' }}
              beforeUpload={this.beforeMerchantUpload}
              success={this.successMerchantUpload}
              show-file-list={false}
            >
              <tg-button type="primary" icon="ico-btn-upload">
                上传对账单
              </tg-button>
            </tg-upload>*/}
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
          is_estimate="0"
          onSuccess={(unite: any) => {
            this.detailDialogRef?.show(unite, true);
            this.createHandler();
          }}
        />
        <detail-dialog
          is_estimate="0"
          ref="detailDialogRef"
          onSuccess={() => {
            this.createHandler();
          }}
        />
      </div>
    );
  },
});
