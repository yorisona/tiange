import { defineComponent, inject } from '@vue/composition-api';
import ListView from './list.vue';
import EditView from './edit.vue';
import { usePermission } from '@/use/permission';
import { useTarget } from './useTarget';
import { Select } from '@gm/component';
import { useRouter } from '@/use/vue-router';
import { useProjectBaseInfo } from '@/modules/settlement/use/project';
import { RouterNameProjectManage } from '@/const/router';

export default defineComponent({
  props: {},
  components: {
    ListView,
    EditView,
  },
  setup(props, ctx) {
    const router = useRouter();
    const project_id = parseInt(
      router.currentRoute.params.id || router.currentRoute.query.id + '',
      10,
    );
    /** 本地生活 */
    const { isFromLocalLife, isFromSupplyChain, isFromLiveDouyin } = useProjectBaseInfo();
    if (isFromLocalLife.value || isFromLiveDouyin.value) {
      const routes = [
        {
          name: isFromLocalLife.value
            ? RouterNameProjectManage.localLife.project.list
            : RouterNameProjectManage.live.project.list,
          title: '项目管理',
        },
        {
          // path: '/projectManage/localLife/project/' + project_id + '/projectInfo/calendar',
          name: isFromLocalLife.value
            ? RouterNameProjectManage.localLife.detail.info
            : RouterNameProjectManage.tiktokLive.project.detail.info,
          params: {
            id: project_id,
            tab: 'projectInfo',
            liveType: 'calendar',
          },
          title: '项目详情',
        },
        {
          path: '',
          title: '目标设置',
        },
      ];
      const showBackTitleHandle = inject('showBackTitleHandle') as Function;
      showBackTitleHandle(routes);
    }
    const { business_type: project_business_type } = useProjectBaseInfo();
    const target = useTarget(Number(router.currentRoute.params.id), project_business_type.value);
    const permission = usePermission();
    const newdata: any = null;

    // 未审核通过的描述信息
    return {
      isFromSupplyChain,
      isFromLocalLife,
      permission,
      newdata,
      target,
    };
  },
  render() {
    const { target, permission, isFromLocalLife, isFromSupplyChain } = this;
    const target_shop_edit = isFromSupplyChain
      ? permission.supply_edit_anchor_goal || permission.supply_edit_shop_goal
      : isFromLocalLife
      ? permission.local_life_project_target_anchor_edit ||
        permission.local_life_project_target_shop_edit
      : permission.live_project_target_anchor_edit || permission.live_project_target_shop_edit;
    return (
      <div class="page-container">
        {target.yearData.comment && (
          <div class="status-tips" v-show={false}>
            <tg-icon name="ico-common-tishi-areality" />
            <div>{target.yearData.comment}</div>
          </div>
        )}

        {target.isEdit === null && (
          <div class="operation">
            <div class="left">
              <div class="calendar-date-range">
                <Select
                  clearable={false}
                  size="mini"
                  style="width:108px"
                  value={target.currentYear}
                  onInput={async (year: string) => {
                    target.changeYear(Number(year));
                  }}
                  placeholder="请选择"
                  options={target.currentYearOptions}
                />
              </div>
              <div class="tips">
                <i
                  class="el-icon-warning-outline"
                  style="color: var(--warning-color); height: 22px; line-height: 22px; font-size: 16px;margin-right:4px;"
                />
                统计说明：年度和月度GMV目标数据同步于预算目标，不需手动维护，只需维护日GMV目标，GMV和GMV完成度由系统自动生成，年度、月度和日浄销额目标需要手动维护，双击单元格即可以维护相应数据。
              </div>
            </div>
            {target_shop_edit && (
              <div class="right">
                {/* <tg-button
                  class="mgr-12"
                  onClick={target.startEditYear}
                  style="text-align:center;width:96px;border-radius: 4px;display: inline-block;padding:0px;margin-top:3px"
                >
                  年目标管理
                </tg-button>
                <tg-button
                  class="mgr-12"
                  disabled={target.yearData.status !== TargetStatus.approved}
                  onClick={target.startEditMonth}
                  style="text-align:center;width:96px;border-radius: 4px;display: inline-block;padding:0px;margin-top:3px"
                >
                  月目标管理
                </tg-button>*/}
                <tg-button
                  onClick={target.startEditDay}
                  style="text-align:center;width:96px;border-radius: 4px;display: inline-block;padding:0px;margin-top:3px"
                >
                  日目标管理
                </tg-button>
              </div>
            )}
          </div>
        )}
        {/*@ts-ignore*/}
        {target.isEdit === null && <ListView />}
        {/*@ts-ignore*/}
        {target.isEdit !== null && (
          //@ts-ignore
          <EditView style="display:flex;flex-direction: column;flex-grow: 1;height: 100%;" />
        )}
      </div>
    );
  },
});
