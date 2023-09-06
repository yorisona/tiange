import { ref, defineComponent, onMounted } from '@vue/composition-api';
import { useGeneralContract } from './useList';
import { RouterLegal } from '@/const/router';
import addNewGeneralContract from '@/modules/legal/contract/dialog/addNewGeneralContract.vue';
import { Confirm } from '@/use/asyncConfirm';
import { DeleteContractGeneral } from '@/services/contract';

export default defineComponent({
  components: {
    addNewGeneralContract,
  },
  setup(props, ctx) {
    const {
      saleData,
      loading: tableLoading,
      tableColumn,
      // rejectVisible,
      getData,
      total: infoTotal,
      onAnnexDialogClose,
    } = useGeneralContract(ctx);
    const data = ref();
    const initQueryForm = (): {
      page_num?: number;
      num?: number;
      contract_uid?: string;
      company_name?: string;
    } => {
      return {
        page_num: 1,
        num: 20,
        contract_uid: '',
        company_name: '',
      };
    };
    const queryForm = ref(initQueryForm());
    onMounted(async () => {
      getData(queryForm.value);
    });
    // 查询
    const reset = async () => {
      queryForm.value = {
        page_num: 1,
        num: 20,
        contract_uid: '',
        company_name: '',
      };
      getData(queryForm.value);
    };
    const reload = async () => {
      queryForm.value.page_num = 1;
      getData(queryForm.value);
    };
    const onCurrentChange = (page_num: number) => {
      queryForm.value.page_num = page_num;
      getData(queryForm.value);
    };
    const handlePageSizeChange = (num: number) => {
      queryForm.value.num = num;
      getData(queryForm.value);
    };
    // 点击进入合同详情
    const handleRowClick = (row: any, column: any) => {
      if (column) {
        if (column.label === '操作') return;
        if (column.label === '项目信息' && row.project_infos.length > 0) return;
      }
      if (
        row.contract_info.contract_type === 1 ||
        row.contract_info.contract_type === 2 ||
        row.contract_info.contract_type === 5
      ) {
        // 客户合同
        const routeUrl = ctx.root.$router.resolve({
          name: row.template_info
            ? RouterLegal.contracts.customer.detailTemplate
            : RouterLegal.contracts.customer.detail,
          params: { id: `${row.contract_info.id}` },
        });
        window.open(routeUrl.href, '_blank');
      } else if (
        row.contract_info.contract_type === 3 ||
        row.contract_info.contract_type === 4 ||
        row.contract_info.contract_type === 6
      ) {
        // 供应商
        const routeUrl = ctx.root.$router.resolve({
          name: row.template_info
            ? RouterLegal.contracts.supplier.detailTemplate
            : RouterLegal.contracts.supplier.detail,
          params: { id: `${row.contract_info.id}` },
          query: {
            contract_type: `${row.contract_info.contract_type}`,
          },
        });
        window.open(routeUrl.href, '_blank');
      } else {
        // 主播
        const routeUrl = ctx.root.$router.resolve({
          name: RouterLegal.contracts.anchor.detailTemplate,
          params: { id: `${row.contract_info.id}` },
          query: {
            contract_type: `${row.contract_info.contract_type}`,
          },
        });
        window.open(routeUrl.href, '_blank');
      }
    };

    const addNewGeneralContractRef = ref<{ show: TG.anyFunc }>();
    const editHandle = (row: any | null) => {
      addNewGeneralContractRef.value?.show(
        row
          ? {
              contract_uid: row.contract_uid,
              business_types: row.business_types
                ? row.business_types.split(',').map((item: string) => Number(item))
                : [],
            }
          : null,
      );
    };
    const deleteHandle = async (row: any) => {
      console.log('-----');
      const result = await Confirm('确定删除吗?');
      if (result) {
        DeleteContractGeneral({
          contract_uid: row.contract_uid,
        })
          .then(res => {
            ctx.root.$message({
              type: res.data.success ? 'success' : 'warning',
              message: res.data.message,
              duration: 2000,
            });
            getData(queryForm.value);
          })
          .catch(error => {
            ctx.root.$message({
              type: 'error',
              message: '合同删除失败，稍后重试',
              duration: 2000,
            });
            console.log(error.message);
          });
      }
    };
    return {
      deleteHandle,
      editHandle,
      addNewGeneralContractRef,
      getData,
      data,
      reset,
      reload,
      queryForm,
      tableLoading,
      infoTotal,
      tableColumn,
      saleData,
      handleRowClick,
      onCurrentChange,
      handlePageSizeChange,
      onAnnexDialogClose,
    };
  },
  render() {
    return (
      <div class="tg-contract-page flex-auto">
        <tg-card padding={18}>
          <el-form
            class="filter-form flex-form"
            size="mini"
            // style="height: 28px"
            label-width="65px"
            show-message={false}
            label-position="left"
            inline={true}
          >
            <el-form-item label="合同编号：">
              <el-input
                v-key-enter={this.reload}
                style="width: 204px"
                clearable
                placeholder="请输入合同编号"
                v-model={this.queryForm.contract_uid}
              />
            </el-form-item>
            <el-form-item
              label="公司名称："
              class="flex-form-item form-item-group"
              style="margin-bottom: 12px"
            >
              <el-input
                v-key-enter={this.reload}
                style="width: 204px"
                clearable
                placeholder="请输入公司名称"
                v-model={this.queryForm.company_name}
              />
            </el-form-item>
            <el-form-item class="flex-form-item order-100" style="margin-bottom: 14px">
              <tg-button type="primary" onClick={this.reload}>
                查询
              </tg-button>
              <tg-button class="mgl-12" onClick={this.reset}>
                重置
              </tg-button>
              <tg-button
                class="mgl-12"
                onClick={() => {
                  this.editHandle(null);
                }}
              >
                新增
              </tg-button>
            </el-form-item>
          </el-form>
        </tg-card>
        <section class="table-field">
          <div style="height: 100%;">
            <tg-table
              stripe
              tooltip-effect="light"
              height={'100%'}
              v-loading={this.tableLoading}
              border
              class="precharge-table"
              data={this.saleData}
              // on-row-click={this.handleRowClick}
              // row-style={{ cursor: 'pointer' }}
            >
              <template slot="empty">
                <empty-common
                  style="margin-top:20px"
                  imgHeight="100"
                  imgWidth="200"
                  detail-text="暂无数据"
                ></empty-common>
              </template>
              {this.tableColumn.map(v => (
                <el-table-column
                  show-overflow-tooltip
                  // class-name={v.className}
                  label={v.label}
                  align={v.align}
                  headerAlign={v.headerAlign}
                  minWidth={v.minWidth}
                  formatter={v.formatter}
                  fixed={v.fixed}
                />
              ))}
              <el-table-column
                label="操作"
                minWidth={126}
                align="center"
                fixed="right"
                scopedSlots={{
                  default: ({ row }: any) => {
                    return (
                      <div>
                        <tg-button
                          on-click={() => {
                            this.editHandle(row);
                          }}
                          type="link"
                          class="tg-button mgr-12"
                        >
                          编辑
                        </tg-button>
                        <tg-button
                          type="link"
                          on-click={() => {
                            this.deleteHandle(row);
                          }}
                        >
                          删除
                        </tg-button>
                      </div>
                    );
                  },
                }}
              />
            </tg-table>
          </div>
        </section>
        {this.saleData.length > 0 && (
          <div class="pagination">
            <el-pagination
              class="flex-none"
              current-page={this.queryForm.page_num}
              page-sizes={[10, 20, 30, 50, 100]}
              page-size={this.queryForm.num}
              total={this.infoTotal}
              layout="total, prev, pager, next, sizes, jumper"
              on-current-change={this.onCurrentChange}
              on-size-change={this.handlePageSizeChange}
            />
          </div>
        )}
        <addNewGeneralContract
          ref="addNewGeneralContractRef"
          on-save={() => {
            this.getData(this.queryForm);
          }}
        />
      </div>
    );
  },
});
