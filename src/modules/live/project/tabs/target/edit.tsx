import { computed, defineComponent, ref } from '@vue/composition-api';
import CalendarPage from './calendar/index.vue';
import { useRouter } from '@/use/vue-router';
import { HasPermission } from '@/use/permission';
import { RIGHT_CODE } from '@/const/rightCode';
import dailyDetail from '@/modules/live/project/tabs/target/components/dailyDetail/index.vue';
import { Message, MessageBox } from 'element-ui';
import FormValidation from '@/modules/supplier/playerManager/common/FormValidation';
import { downloadFileFromBlob } from '@/utils/func';
import { Select } from '@gm/component';
import { TargetEditType, useTarget } from '@/modules/live/project/tabs/target/useTarget';
import { useDialog } from '@/use/dialog';
import { useProjectBaseInfo } from '@/modules/settlement/use/project';

const splitData = defineComponent({
  setup(props, ctx) {
    const isSplitGoalBtn = ref(false);
    const isSplitSalesBtn = ref(false);
    const show = (splitGoal: boolean, splitSales: boolean) => {
      isSplitGoalBtn.value = splitGoal;
      isSplitSalesBtn.value = splitSales;
    };
    const selectSplitType = ref();
    const dialogSubmit = () => {
      ctx.emit('submit', selectSplitType.value);
      ctx.emit('close');
    };
    return {
      show,
      selectSplitType,
      isSplitGoalBtn,
      isSplitSalesBtn,
      dialogSubmit,
    };
  },
  render() {
    return (
      <div style="margin:12px 8px 12px 8px;text-align: center;">
        <span style="color: var(--text-second-color)">拆分目标：</span>
        <el-select
          popper-class="el-select-popper-mini"
          size="mini"
          filterable
          v-model={this.selectSplitType}
          style="width: 244px"
        >
          <el-option
            label="销售额月目标"
            disabled={!this.isSplitGoalBtn}
            value={'goal_value'}
            key={'2'}
          />
          <el-option
            label="净销额月目标"
            disabled={!this.isSplitSalesBtn}
            value={'net_sales_goal_value'}
            key={'3'}
          />
        </el-select>
        <div style="color:var(--text-third-color);font-size:12px;margin-top:18px">
          确定后，系统将把月目标平均拆分到每天。
        </div>
      </div>
    );
  },
});

export default defineComponent({
  props: {
    year: {
      type: Number,
      default: () => new Date().getFullYear(),
    },
  },
  components: {
    dailyDetail,
    CalendarPage,
  },
  setup(props, ctx) {
    /** 本地生活 */
    const {
      isFromLocalLife,
      isFromSupplyChain,
      business_type: project_business_type,
    } = useProjectBaseInfo();
    const target = useTarget(undefined, project_business_type.value);
    /** 权限管理 */
    const Permission = computed(() => {
      const canPorjectTargetShopEdit = isFromSupplyChain.value
        ? HasPermission(RIGHT_CODE.supply_edit_shop_goal)
        : isFromLocalLife.value
        ? HasPermission(RIGHT_CODE.local_life_project_target_shop_edit)
        : HasPermission(RIGHT_CODE.live_project_target_shop_edit);
      const canPorjectTargetAnchorEdit = isFromSupplyChain.value
        ? HasPermission(RIGHT_CODE.supply_edit_anchor_goal)
        : isFromLocalLife.value
        ? HasPermission(RIGHT_CODE.local_life_project_target_anchor_edit)
        : HasPermission(RIGHT_CODE.live_project_target_anchor_edit);
      return {
        canPorjectTargetShopEdit,
        canPorjectTargetAnchorEdit,
      };
    });
    const router = useRouter();
    const project_id = router.currentRoute.params.id;
    // 快速拆分弹窗控制
    const visible = ref(false);

    const saveMonthData = async () => {
      try {
        await target.Save();
        target.isEdit = null;
        Message.success('保存成功');
      } catch (e: any) {
        Message.error(e.message);
      }
    };

    const onSaveClick = saveMonthData;
    const dialogSplitData = useDialog({
      title: '目标拆分',
      component: splitData,
      width: 400,
      on: {
        submit(field: any) {
          target.SplitMonthData(field);
        },
      },
    });
    const onCancelClick = async () => {
      console.log('hasChangeData', target);
      if (target.hasChangeData) {
        await MessageBox.confirm('你确定退出编辑吗', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          iconClass: 'warning-icon',
        });
      }
      target.cancelEdit();
    };

    const onDownloadTemplate = () => {
      const url =
        'https://tiange-oss.oss-cn-hangzhou.aliyuncs.com/upload_template/project_daily_goal_template.xlsx';
      fetch(url).then(async response => {
        const result = response.clone();
        try {
          const data = await result.json();
          ctx.root.$message.error(data.message);
        } catch {
          if (response.status === 200) {
            const data = await response.blob();
            downloadFileFromBlob(data, 'project_daily_goal_template.xlsx');
          } else {
            ctx.root.$message.error('下载失败');
          }
        }
      });
    };

    const onBeforeUploadHandler = (file: any) => {
      return FormValidation.ValidationFileUpload({
        excel: true,
        fileSize: 30,
        doc: false,
        pdf: false,
      });
    };
    /* 导入每日的数据*/
    const onUploadHandler = async (res: any) => {
      if (!res.success) {
        Message.error(res.message);
        return;
      }
      // artForm.attachment_url = [res.data.source] as any;
      if (res.error_code === 1001) {
        Message.error(res.message ?? '日目标汇总数据小于月目标数据，请校验数据!');
        return;
      }
      Message.success(res.message);
      if (res.data.days) {
        target.importDailyTargetData(res.data.days);
      }
    };

    const downTemplateUrl =
      process.env.VUE_APP_TARGET_ENV !== 'production'
        ? 'http://tiange-oss.goumee.com/dev/upload_template/project_daily_goal_template.xlsx'
        : 'https://tiange-oss.goumee.com/prod/upload_template/project_daily_goal_template.xlsx';

    const splitStatus = computed(() => {
      const monthData = target.monthData[target.currentMonth];
      let isSplit = false;
      let splitGoal = false;
      let splitSales = false;
      if (monthData) {
        if (Number(monthData.goal_value) > 0) {
          isSplit = true;
          splitGoal = true;
        }
        if (Number(monthData.net_sales_goal_value) > 0) {
          isSplit = true;
          splitSales = true;
        }
      }

      return {
        isSplit,
        splitGoal,
        splitSales,
      };
    });

    return {
      isFromLocalLife,
      isFromSupplyChain,
      downTemplateUrl,
      Permission,
      visible,
      project_id,
      onCancelClick,
      onSaveClick,
      onDownloadTemplate,
      onUploadHandler,
      onBeforeUploadHandler,
      target,
      splitStatus,
      dialogSplitData,
    };
  },
  render() {
    const { target, dialogSplitData, splitStatus } = this;
    return (
      <div v-loading={target.reqYear.loading} style="position:relative;height:100%;">
        <div style="padding:18px;zIndex:1111">
          <Select
            options={target.currentYearOptions}
            clearable={false}
            value={target.currentYear}
            disabled={target.isEdit !== TargetEditType.YEAR}
            onInput={(year: string) => {
              target.changeYear(Number(year));
            }}
            placeholder="请选择"
          />
        </div>
        <div class="targetlistdiv">
          {target.isEdit === TargetEditType.DAY && (
            <fragments>
              <tg-button
                type="link"
                disabled={!splitStatus.isSplit}
                onClick={() => dialogSplitData.show(splitStatus.splitGoal, splitStatus.splitSales)}
                style="position: absolute; right: 238px; top: 30px;"
              >
                快速拆分
              </tg-button>
              <tg-button
                type="link"
                download
                href={this.downTemplateUrl}
                style="position: absolute; right: 158px; top: 30px;"
              >
                下载模版
              </tg-button>
              <tg-upload
                show-file-list={false}
                action={
                  this.isFromSupplyChain
                    ? '/api/shop_live/import_project_daily_goal_settings/supply_chain'
                    : this.isFromLocalLife
                    ? '/api/shop_live/import_project_daily_goal_settings/local_life'
                    : '/api/shop_live/import_project_daily_goal_settings'
                }
                style="position: absolute; right: 18px; top: 26px;"
                data={{
                  project_id: target.project_id,
                  year: target.currentYear,
                  month: target.currentMonth + 1,
                  is_enforcement: 0,
                }}
                beforeUpload={this.onBeforeUploadHandler}
                success={this.onUploadHandler}
              >
                <tg-button>导入每日目标</tg-button>
              </tg-upload>
            </fragments>
          )}

          <div style="margin-top:30px">
            <calendar-page />
            <dailyDetail />
          </div>
        </div>
        <div style="height:58px;box-sizing: border-box;box-sizing: border-box;position: absolute;bottom: 0px;width:100%;border: 1px solid rgba(164, 178, 194, 0.3);">
          <div class="filter-form-item-btn" style="margin: 12px auto;">
            <tg-button onClick={() => this.onCancelClick()}>返回</tg-button>
            <tg-button
              v-loading={target.saveLoading}
              type="primary"
              style="margin-left: 12px;"
              onClick={() => this.onSaveClick()}
            >
              保存
            </tg-button>
          </div>
        </div>
      </div>
    );
  },
});
