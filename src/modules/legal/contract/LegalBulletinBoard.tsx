import { ref, defineComponent, h, computed, onMounted } from '@vue/composition-api';
import { BusinessTypeOptions } from '@/types/tiange/common';
import { FeiShuDepartment } from '@/types/tiange/live';
import { GetFeishuDepartmentList } from '@/services/live';
import BulletinBoardPie from '@/modules/legal/contract/charts/BulletinBoardPie';
import ProgressBar from '@/modules/legal/contract/charts/ProgressBar';
import { useLegalBulletinBoardList } from './useList';
import { RouterLegal } from '@/const/router';
import { ElForm } from 'element-ui/types/form';
import { departmentFilterDisabled } from '@/utils/filter';
import { GetContract_overview, PostVerify_contract_scan } from '@/services/contract';
import moment from 'moment';
import { useDialog } from '@/use/dialog';
import toExamineDialog from './dialog/toExamineDialog';
import AnnexDialog from '@/modules/customer/contract/annex.dialog.vue';
export default defineComponent({
  name: '',
  components: {
    BulletinBoardPie,
    ProgressBar,
    AnnexDialog,
  },
  setup(props, ctx) {
    const methods = {
      async getFeishuDepartmentList(_ = false) {
        const res = await GetFeishuDepartmentList({});
        if (res.data.success) {
          const list = res.data.data.data;
          departmentFilterDisabled(list, true, 3);
          feishuDepartmentList.value = list;
        } else {
          ctx.root.$message.error(res.data.message ?? '请求失败，请重试');
        }
      },
      async PostVerify_contract_scan(v: any) {
        v.status = 3;
        const res = await PostVerify_contract_scan(v);
        if (res.data.success) {
          init();
        } else {
          ctx.root.$message.error(res.data.message ?? '请求失败，请重试');
        }
      },
      handleCheckChange: (data: FeiShuDepartment) => {
        department_tree.value?.setCheckedKeys([]);
        if (queryForm.value.department_id === data.id) {
          queryForm.value.department_id = undefined;
          queryForm.value.department_name = undefined;
        } else {
          queryForm.value.department_id = data.id;
          queryForm.value.department_name = data.name;
          queryForm.value.department_level = data.level;
          department_tree.value?.setCheckedKeys([data.id]);
        }
      },
      ondepartmentCleaar(event?: any) {
        department_tree.value?.setCheckedKeys([]);
        queryForm.value.department_id = undefined;
        queryForm.value.department_name = undefined;
        queryForm.value.department_level = undefined;
        if (event) {
          event.stopPropagation();
        }
      },
      // onSubmitHandler() {
      //   // methods.onCloseHandler();
      //   elFormRef.value?.validate(isValid => {
      //     if (isValid) {
      //       console.log('ok');

      //       // methods.submitAccount();
      //     }
      //   });
      // },
      onCloseHandler() {
        rejectVisible.value = false;
        setTimeout(() => {
          // dataForm.value = initForm();
          dataForm.value.reason = '';
          elFormRef.value?.clearValidate();
        }, 500);
      },
      reset() {
        queryForm.value = initQueryForm();
        console.log(queryForm.value);

        methods.ondepartmentCleaar();
        init();
      },
      reload() {
        init();
      },
    };
    const dialogProject = useDialog({
      component: toExamineDialog,
      title: '扫描件审核',
      okText: '驳回',
      width: '400px',
      on: {
        submit: (v: { contract_id: number; message?: string }) => {
          methods.PostVerify_contract_scan(v);
        },
      },
    });
    const {
      saleData,
      loading: tableLoading,
      tableColumn,
      rejectVisible,
      getData,
      total: infoTotal,
      onAnnexDialogClose,
    } = useLegalBulletinBoardList(ctx, { dialogProject, AnnexDialog });
    // 筛选
    const initQueryForm = () => {
      return {
        page_num: 1,
        num: 20,
        date: [],
        // total: undefined,
        business_type: undefined,
        department_name: undefined,
        department_id: undefined,
        department_level: undefined,
      } as any;
    };
    const businessList = computed(() => {
      return [
        {
          label: '全部',
          value: undefined,
        },
        ...BusinessTypeOptions,
      ];
    });
    const chartLoading = ref(false);
    const queryForm = ref(initQueryForm());
    const feishuDepartmentList = ref<FeiShuDepartment[]>([]);
    const department_tree = ref<{ setCheckedKeys: (ids: number[]) => void } | undefined>(undefined);
    onMounted(async () => {
      methods.getFeishuDepartmentList(false);
      init();
      // methods.onQueryHandler();
    });
    // 跳转其他页面
    const toOther = (v: any) => {
      // ctx.root.$router.push({
      //   name: v,
      //   params: { id: `${v.id}` },
      // });
      const $router = ctx.root.$router;
      const routeUrl = $router.resolve({
        name: v,
        query: {
          start_date: queryForm.value.date[0],
          end_date: queryForm.value.date[1],
          business_type: queryForm.value.business_type,
          department_id: queryForm.value.department_id,
          department_level: queryForm.value.department_level,
          department_name: queryForm.value.department_name,
        },
      });
      window.open(routeUrl.href, '_blank');
    };
    // 弹框
    const rejectLoading = ref(false);
    // const rejectVisible = ref(false);
    const elFormRef = ref<ElForm | undefined>(undefined);
    const dataForm = ref({
      reason: '',
    });
    //接口
    const overview = ref();
    const init = () => {
      chartLoading.value = true;
      GetContract_overview({
        business_type: queryForm.value.business_type,
        department_id: queryForm.value.department_id,
        department_level: queryForm.value.department_level,
        start_date: queryForm.value.date[0],
        end_date: queryForm.value.date[1],
      }).then(({ data }) => {
        chartLoading.value = false;
        if (data.success) {
          overview.value = data.data;
        }
      });
      getData({ ...queryForm.value });
    };
    const onCurrentChange = (page_num: number) => {
      queryForm.value.page_num = page_num;
      getData({ ...queryForm.value });
    };
    const handlePageSizeChange = (num: number) => {
      queryForm.value.num = num;
      getData({ ...queryForm.value });
    };
    const handleRowClick = (row: any, column: any) => {
      if (column) {
        if (column.label === '操作') return;
        if (column.label === '扫描件审核') return;
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
    return {
      chartLoading,
      queryForm,
      businessList,
      feishuDepartmentList,
      department_tree,
      saleData,
      tableLoading,
      infoTotal,
      tableColumn,
      rejectLoading,
      toOther,
      rejectVisible,
      dataForm,
      overview,
      handleRowClick,
      onCurrentChange,
      handlePageSizeChange,
      onAnnexDialogClose,
      ...methods,
    };
  },
  render() {
    const treeProps = {
      label: 'name',
      children: 'sons',
    };
    const addBtnProps = {
      on: {
        'dialog:close': () => {
          this.onAnnexDialogClose();
        },
      },
    };
    return (
      <div class="content-main">
        <tg-card padding={[16, 0, 0, 16]} class="mgb-10">
          <el-form
            size="mini"
            // style="height: 32px"
            label-width="60px"
            label-position="left"
            show-message={false}
            inline={true}
          >
            <el-form-item label="时间周期：">
              <el-date-picker
                style="width: 265px;"
                v-model={this.queryForm.date}
                type="daterange"
                range-separator="~"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="yyyy.MM.dd"
                value-format="yyyy-MM-dd"
                pickerOptions={{
                  disabledDate: (date: string) => {
                    const minMoment = moment('2021-08-31').startOf('day');
                    // return currentMoment.value.isSameOrBefore(minMoment, 'day');
                    return (
                      moment().startOf('day').isBefore(date) ||
                      moment(date).isSameOrBefore(minMoment, 'day')
                    );
                  },
                }}
                editable={false}
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="业务类型：">
              <el-select
                popper-class="el-select-popper-mini"
                style="width: 204px;"
                v-model={this.queryForm.business_type}
                clearable
                on-focus={this.selectControlPopoverHide}
              >
                {this.businessList.map(el => (
                  <el-option label={el.label} value={el.value} key={el.value}></el-option>
                ))}
              </el-select>
            </el-form-item>
            <el-form-item label="归属部门：">
              <el-popover
                placement="bottom-start"
                trigger="click"
                width="370"
                popper-class="project-fund-statement-tree-popper el-tree-popper-mini"
              >
                <div
                  slot="reference"
                  class="department-tree-select"
                  style="display: block; cursor: pointer;"
                >
                  {this.queryForm.department_name && (
                    <div class="depart-select-box">
                      <span style="height: 28px; line-height: 28px; font-size: var(--default-font-size)">
                        {this.queryForm.department_name}
                      </span>
                      <i
                        style="margin-top: 7px; color: white; font-size: var(--small-font-size)"
                        class="el-icon-circle-close"
                        onClick={this.ondepartmentCleaar}
                      ></i>
                    </div>
                  )}
                  {!this.queryForm.department_name && (
                    <div class="depart-select-box">
                      <span style="color:var(--disabled-color); height: 28px; line-height: 28px; font-size: var(--default-font-size)">
                        请选择所属部门
                      </span>
                      <i
                        style="margin-top: 7px; color: var(--disabled-color);font-size: var(--small-font-size);width:20px"
                        class="el-icon-arrow-down"
                      ></i>
                    </div>
                  )}
                </div>
                <div class="department-tree">
                  <el-tree
                    ref="department_tree"
                    props={{
                      props: treeProps,
                    }}
                    check-strictly={true}
                    node-key="id"
                    data={this.feishuDepartmentList}
                    show-checkbox
                    check-on-click-node
                    // default-expand-all
                    // default-checked-keys="default_checked_department_ids"
                    default-expanded-keys={
                      this.queryForm.department_id ? [this.queryForm.department_id] : []
                    }
                    on-check={this.handleCheckChange}
                  ></el-tree>
                </div>
              </el-popover>
              <li style="display: none" class="controlPopoverHide"></li>
            </el-form-item>
            <el-form-item class="flex-form-item order-100" style="margin-bottom: 14px">
              <tg-button type="primary" onClick={this.reload}>
                查询
              </tg-button>
              <tg-button class="mgl-8" onClick={this.reset}>
                重置
              </tg-button>
            </el-form-item>
          </el-form>
        </tg-card>
        <tg-card padding={[10, 16, 0, 16]}>
          <div
            class="mgb-10"
            style="color:var(--text-third-color);font-size:12px;display:flex;align-items: center;"
          >
            {/* <tg-icon
              name="ico-icon_tongyong_jinggao_xianxing"
              style="color: var(--warning-color); font-size: 18px; margin-top: 1px"
            ></tg-icon> */}
            <svg
              t="1663825041797"
              class="icon"
              style="color: var(--warning-color); font-size: 18px; margin-top: 1px;margin-right:4px"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="7332"
            >
              <path
                d="M768 261.12C696.32 189.44 609.28 153.6 512 153.6s-184.32 35.84-250.88 107.52S153.6 414.72 153.6 512c0 97.28 35.84 184.32 107.52 256s158.72 102.4 250.88 102.4c97.28 0 184.32-35.84 256-102.4 66.56-66.56 102.4-158.72 102.4-256s-35.84-184.32-102.4-250.88z m-40.96 465.92C670.72 788.48 593.92 819.2 512 819.2s-158.72-30.72-215.04-92.16C235.52 670.72 204.8 593.92 204.8 512s30.72-158.72 92.16-215.04S430.08 204.8 512 204.8s158.72 30.72 215.04 92.16C788.48 353.28 819.2 430.08 819.2 512s-30.72 158.72-92.16 215.04z"
                p-id="7333"
              ></path>
              <path
                d="M517.12 645.12c-20.48 0-35.84 15.36-35.84 35.84s15.36 35.84 35.84 35.84c20.48 0 35.84-15.36 35.84-35.84s-15.36-35.84-35.84-35.84zM517.12 312.32c-15.36 0-30.72 15.36-30.72 30.72v230.4c0 15.36 15.36 30.72 30.72 30.72s30.72-15.36 30.72-30.72V343.04c0-15.36-15.36-30.72-30.72-30.72z"
                p-id="7334"
              ></path>
            </svg>
            只统计2021年9月1号后创建的项目
          </div>
          <div class="chart-box">
            <div class="chart-box-item" v-loading={this.chartLoading}>
              <div style="width:140px;height:140px;" class="mgb-16">
                <BulletinBoardPie
                  id={1}
                  data={[
                    {
                      name: '正常项目',
                      value:
                        (this.overview?.project?.total || 0) -
                        (this.overview?.project?.no_contract || 0),
                    },
                    {
                      name: '无合同项目',
                      value: this.overview?.project?.no_contract || 0,
                    },
                  ]}
                />
                {/* <empty></empty> */}
              </div>
              <div class="nums-box mgb-18">
                <div class="nums-box-item">
                  <div class="nums-title">项目总数</div>
                  <div class="nums-num">{this.overview?.project?.total ?? '--'}</div>
                </div>
                <div class="line"></div>
                <div
                  class="nums-box-item"
                  style="cursor: pointer;"
                  onClick={() => this.toOther(RouterLegal.NoLegalContractProject)}
                >
                  <div class="nums-title">无合同项目</div>
                  <div class="nums-num" style="color:rgba(var(--theme-rgb-color), 1)">
                    {this.overview?.project?.no_contract ?? '--'}
                  </div>
                </div>
              </div>
              <ProgressBar
                class="mgb-12"
                total={this.overview?.project?.total ?? 0}
                percent={
                  (this.overview?.project?.total || 0) - (this.overview?.project?.no_contract || 0)
                }
              ></ProgressBar>
              <ProgressBar
                text="无合同项目"
                color="#FFBF00"
                total={this.overview?.project?.total ?? 0}
                percent={this.overview?.project?.no_contract ?? 0}
              ></ProgressBar>
            </div>
            <div class="chart-box-item" v-loading={this.chartLoading}>
              <div style="width:140px;height:140px;" class="mgb-16">
                <BulletinBoardPie
                  id={2}
                  data={[
                    {
                      name: '执行中',
                      value: this.overview?.contract?.execute || 0,
                    },
                    {
                      name: '已到期',
                      value: this.overview?.contract?.expire || 0,
                    },
                    {
                      name: '已解约',
                      value: this.overview?.contract?.release || 0,
                    },
                  ]}
                />
              </div>
              <div class="nums-box mgb-18">
                <div class="nums-box-item">
                  <div class="nums-title">已签约</div>
                  <div class="nums-num">{this.overview?.contract?.sign ?? '--'}</div>
                </div>
                <div class="line"></div>
                <div
                  class="nums-box-item"
                  style="cursor: pointer;"
                  onClick={() => this.toOther(RouterLegal.ExpiringContract)}
                >
                  <div class="nums-title">将到期</div>
                  <div class="nums-num" style="color:rgba(var(--theme-rgb-color), 1)">
                    {this.overview?.contract?.near ?? '--'}
                  </div>
                </div>
              </div>
              <ProgressBar
                text="执行中"
                class="mgb-12"
                total={this.overview?.contract?.sign ?? 0}
                percent={this.overview?.contract?.execute ?? 0}
              ></ProgressBar>
              <ProgressBar
                text="已到期"
                color="#FFBF00"
                total={this.overview?.contract?.sign ?? 0}
                percent={this.overview?.contract?.expire ?? 0}
              ></ProgressBar>
            </div>
            <div class="chart-box-item" v-loading={this.chartLoading}>
              <div style="width:140px;height:140px;" class="mgb-16">
                <BulletinBoardPie
                  id={3}
                  data={[
                    {
                      name: '已归档',
                      value: this.overview?.contract?.recycled || 0,
                    },
                    {
                      name: '未归档',
                      value: this.overview?.contract?.no_recycled || 0,
                    },
                  ]}
                />
              </div>
              <div class="nums-box mgb-18">
                <div class="nums-box-item">
                  <div class="nums-title">已归档</div>
                  <div class="nums-num">{this.overview?.contract?.recycled ?? '--'}</div>
                </div>
                <div class="line"></div>
                <div class="nums-box-item">
                  <div class="nums-title">未归档</div>
                  <div class="nums-num">{this.overview?.contract?.no_recycled ?? '--'}</div>
                </div>
              </div>
              <ProgressBar
                text="扫描件未传"
                class="mgb-12"
                color="#FF8000"
                total={this.overview?.contract?.sign ?? 0}
                percent={this.overview?.contract?.no_scan ?? 0}
              ></ProgressBar>
              <ProgressBar
                text="扫描件驳回"
                color="var(--error-color)"
                total={this.overview?.contract?.sign ?? 0}
                percent={this.overview?.contract?.scan_failed ?? 0}
              ></ProgressBar>
            </div>
            <div class="chart-box-item" v-loading={this.chartLoading}>
              <div style="width:140px;height:140px;" class="mgb-16">
                <BulletinBoardPie
                  id={4}
                  data={[
                    {
                      name: '正常合同',
                      value: this.overview?.contract?.normal || 0,
                    },
                    {
                      name: '倒签合同',
                      value: this.overview?.contract?.no_normal || 0,
                    },
                  ]}
                />
              </div>
              <div class="nums-box mgb-18">
                <div
                  class="nums-box-item"
                  style="cursor: pointer;"
                  onClick={() => this.toOther(RouterLegal.AbnormalContract)}
                >
                  <div class="nums-title">倒签合同</div>
                  <div class="nums-num" style="color:rgba(var(--theme-rgb-color), 1)">
                    {this.overview?.contract?.no_normal ?? '--'}
                  </div>
                </div>
                <div class="line"></div>
                <div class="nums-box-item">
                  <div class="nums-title">异常率</div>
                  <div class="nums-num">
                    {Number(
                      ((this.overview?.contract?.no_normal || 0) /
                        (this.overview?.contract?.sign || 0)) *
                        100 || 0,
                    ).toFixed(1) + '%' ?? '--'}
                  </div>
                </div>
              </div>
              <ProgressBar
                text="正常合同"
                class="mgb-12"
                total={this.overview?.contract?.sign ?? 0}
                percent={this.overview?.contract?.normal ?? 0}
              ></ProgressBar>
              <ProgressBar
                text="倒签合同"
                color="#FFBF00"
                total={this.overview?.contract?.sign ?? 0}
                percent={this.overview?.contract?.no_normal ?? 0}
              ></ProgressBar>
            </div>
          </div>
          <div class="list-box">
            <tg-table
              stripe
              tooltip-effect="light"
              // height={this.saleData.length > 0 ? 'calc(100vh - 255px)' : 'calc(100vh - 205px)'}
              v-loading={this.tableLoading}
              border
              class="precharge-table"
              data={this.saleData}
              on-row-click={this.handleRowClick}
              row-style={{ cursor: 'pointer' }}
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
                  // prop={v.property}
                  align={v.align}
                  headerAlign={v.headerAlign}
                  minWidth={v.minWidth}
                  formatter={v.formatter}
                />
              ))}
            </tg-table>
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
          </div>
        </tg-card>
        {/* 弹框 */}
        <AnnexDialog {...addBtnProps} />
        {/* <div>
          <el-dialog
            title={'扫描件驳回'}
            class="tg-dialog-classic tg-dialog-vcenter-new tg-public-add-account-container"
            width="400px"
            visible={this.rejectVisible}
            close-on-click-modal={false}
            close-on-press-escape={false}
            onClose={this.onCloseHandler}
          >
            <el-form
              class=" pd-18"
              props={{ model: this.dataForm }}
              ref="elFormRef"
              size="small"
              label-width="0"
            >
              <el-form-item
                label=""
                prop="reason"
                // rules={[{ required: true, message: '请填写意见，限50字', trigger: 'blur' }]}
              >
                <el-input
                  v-model={this.dataForm.reason}
                  type="textarea"
                  style="height: 100px;"
                  rows={5}
                  maxlength={50}
                  placeholder="请填写意见，限50字"
                  // on-input={(val: string) => (this.dataForm.reason = val.trim())}
                ></el-input>
              </el-form-item>
            </el-form>
            <template slot="footer">
              <tg-button type="primary" onClick={this.onSubmitHandler}>
                驳回
              </tg-button>
              <tg-button onClick={this.onCloseHandler}>取消</tg-button>
            </template>
          </el-dialog>
          <tg-mask-loading visible={this.rejectLoading} content="正在保存，请稍候..." />
        </div> */}
      </div>
    );
  },
});
