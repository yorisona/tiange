import { ref, reactive, UnwrapRef } from '@vue/composition-api';
import approvalService from '@/services/approval';
import store from '@/store';
import logo_kaipiaoshenqing from '@/assets/img/workbench/logo_kaipiaoshenqing.png';
// import logo_diankuanshenqing from '@/assets/img/workbench/logo_diankuanshenqing.png';
import logo_zhuangzaoyuyue from '@/assets/img/workbench/logo_zhuangzaoyuyue.png';
import logo_shejixiadan from '@/assets/img/workbench/logo_shejixiadan.png';
// import logo_zichan from '@/assets/img/workbench/logo_zichan.png';
import logo_mb from '@/assets/img/workbench/icon_workbench_mb.png';
// import logo_audition_apply from '@/assets/img/workbench/logo_audition_apply.png';
// import logo_audition_feedback from '@/assets/img/workbench/logo_audition_feedback.png';
import logo_anchor_apply from '@/assets/img/workbench/logo_anchor_apply.png';
import logo_kol_apply from '@/assets/img/workbench/logo_kol_apply.png';
import logo_yongyin from '@/assets/img/workbench/logo_yongyin.png';
import logo_kpi_feedback from '@/assets/img/workbench/kpi.png';
import icon_anchor_recruitment from '@/assets/img/workbench/icon_anchor_recruitment.png';
import icon_design_statistics from '@/assets/img/workbench/icon_design_statistics.png';
import icon_workbench_download_img_project_file from '@/assets/img/workbench/icon_workbench_download_project_file.png';
import icon_workbench_download_img_my_file from '@/assets/img/workbench/icon_workbench_download_my_file.png';
import { HasPermission } from '@/use/permission';

import { IResSchedule } from '../../services/approval';
import { parse } from '@/utils/func';
import { format } from '@/utils/time';
import { RIGHT_CODE } from '@/const/rightCode';

export enum EControlItem {
  yongkuanshenqing = 'yongkuanshenqing',
  tuikuanshenqing = 'tuikuanshenqing',
  diankuanshenqing = 'diankuanshenqing',
  diankuanshenqing1 = 'diankuanshenqing1',
  xiaoshourenwugenjin = 'conversation_count',
  kaipiaoshenqing = 'kaipiaoshenqing',
  xiagnmugenjin = 'shop_project_count',
  zhibopaibang = 'shop_live_count',
  zhiboshujvluru = 'live_data_count',
  hetongshouhui = 'contract_count',
  fukuan = 'cost_count',
  kaipiao = 'invoice_count',
  shoukuanqueren = 'achievement_count',
  kehuzhixing = 'account_execute_count',
  audition_apply = 'pilot_apply_count',
  audition_feedback = 'pilot_feedback_count',
  anchor_approval = 'pending_anchor_count',
  kol_approval = 'pending_kol_count',
  yongyinshenqing = 'yongyinshenqing',
  performance_management_count = 'performance_management_count',
  makeup = 'Makeup',
  design_order = 'design_order',
  myAssets = 'myAssets',
  mine_files = 'mine_files',
  project_files = 'project_files',
  anchor_recruitment_count = 'anchor_recruit_count',
  design_statistics = 'design_statistics',
  mb_redeem = 'mb_redeem',
}

interface CommonResSchedule extends IResSchedule {
  live_times: string[];
}

export interface IControlItem {
  name: string;
  logo: string;
  visibual?: boolean;
  type: EControlItem;
  messageCount?: number;
}

export interface ISchedulingItem {
  week: string;
  day: string;
  data: Record<any, any>[];
}

export default {
  /**
   * 获取审批选项
   */
  useApproval() {
    const ApprovalItems = ref<IControlItem[]>([
      // { name: '用款申请', logo: logo_yongkuanshenqing, type: EControlItem.yongkuanshenqing },
      // { name: '退款申请', logo: logo_tuikuanshenqing, type: EControlItem.tuikuanshenqing },
      // { name: '垫款申请', logo: logo_diankuanshenqing, type: EControlItem.diankuanshenqing },
      // { name: '垫款申请', logo: logo_diankuanshenqing, type: EControlItem.diankuanshenqing1 },
      { name: '开票申请', logo: logo_kaipiaoshenqing, type: EControlItem.kaipiaoshenqing },
      { name: '用印申请', logo: logo_yongyin, type: EControlItem.yongyinshenqing },
    ]);
    // 预约
    //TODO: 5.32工作台logo
    const AppointmentItems = ref<IControlItem[]>([
      { name: '妆造预约', logo: logo_zhuangzaoyuyue, type: EControlItem.makeup },
      { name: '视觉设计', logo: logo_shejixiadan, type: EControlItem.design_order },
      // { name: '我的资产', logo: logo_zichan, type: EControlItem.myAssets },
    ]);
    // 福利
    const Approvalwelfare = ref<IControlItem[]>([
      { name: 'M币兑换', logo: logo_mb, type: EControlItem.mb_redeem },
    ]);
    return {
      ApprovalItems,
      AppointmentItems,
      Approvalwelfare,
    };
  },

  useDownload() {
    const DownloadItems = ref<IControlItem[]>([
      {
        name: '我的文件',
        logo: icon_workbench_download_img_my_file,
        type: EControlItem.mine_files,
      },
      {
        name: '项目清单',
        logo: icon_workbench_download_img_project_file,
        type: EControlItem.project_files,
      },
    ]);
    return {
      DownloadItems,
    };
  },

  /**
   * 获取我的代办
   */
  useAgency() {
    const canKolApproval = HasPermission(RIGHT_CODE.kol_approval);
    const canAnchorApproval = HasPermission(RIGHT_CODE.supplier_anchor_check);
    const canAnchorRecruit = HasPermission(RIGHT_CODE.workbench_anchor_recruit);
    const orderStatistics = HasPermission(RIGHT_CODE.workbench_order_statistics);

    const AgencyMap = {
      [EControlItem.performance_management_count]: {
        name: '我的绩效',
        logo: logo_kpi_feedback,
        type: EControlItem.performance_management_count,
      },
    };

    if (canAnchorApproval) {
      // @ts-ignore
      AgencyMap[[EControlItem.anchor_approval]] = {
        name: '主播审核',
        logo: logo_anchor_apply,
        type: EControlItem.anchor_approval,
      };
    }

    if (canKolApproval) {
      // @ts-ignore
      AgencyMap[[EControlItem.kol_approval]] = {
        name: '达人审核',
        logo: logo_kol_apply,
        type: EControlItem.kol_approval,
      };
    }
    if (canAnchorRecruit) {
      // @ts-ignore
      AgencyMap[[EControlItem.anchor_recruitment_count]] = {
        name: '主播招募',
        logo: icon_anchor_recruitment,
        type: EControlItem.anchor_recruitment_count,
      };
    }
    if (orderStatistics) {
      // @ts-ignore
      AgencyMap[[EControlItem.design_statistics]] = {
        name: '设计统计',
        logo: icon_design_statistics,
        type: EControlItem.design_statistics,
      };
    }

    const list = ref<UnwrapRef<IControlItem[]>>([]);

    const query = () => {
      approvalService.WAITING_SCHEDULES().then(val => {
        const data = val.data.data;
        const newList: IControlItem[] = [];
        let anchorRecruitItem: IControlItem | undefined = undefined;
        Object.keys(data ?? {}).forEach(key => {
          if (
            data[key] === null ||
            key === EControlItem.xiaoshourenwugenjin ||
            key === EControlItem.zhiboshujvluru ||
            key === EControlItem.zhibopaibang ||
            key === EControlItem.xiagnmugenjin ||
            key === EControlItem.kehuzhixing ||
            key === EControlItem.hetongshouhui ||
            key === EControlItem.shoukuanqueren ||
            key === EControlItem.fukuan ||
            key === EControlItem.kaipiao ||
            (key === EControlItem.kol_approval && !canKolApproval) ||
            (key === EControlItem.anchor_approval && !canAnchorApproval) ||
            (key === EControlItem.design_statistics && !orderStatistics) ||
            (key === EControlItem.anchor_recruitment_count && !canAnchorRecruit)
          )
            return;
          const count = data[key];
          const item = {
            // @ts-ignore
            ...AgencyMap[key],
          };
          if (count === 0) {
            item.count = null;
          } else if (count <= 99) {
            item.count = count;
          } else {
            item.count = `99+`;
          }
          if (key === EControlItem.anchor_recruitment_count) {
            anchorRecruitItem = item;
          } else {
            newList.push(item);
          }
        });
        if (orderStatistics) {
          newList.push({
            logo: icon_design_statistics,
            name: '设计统计',
            // count: 0,
            type: EControlItem.design_statistics,
          });
        }
        if (anchorRecruitItem) {
          newList.push(anchorRecruitItem);
        }
        list.value = newList;
      });
    };

    return reactive({
      list,
      query,
    });
  },
  /**
   * 获取我的排班
   */
  useScheduling() {
    const timeStr = (start_time: number, end_time: number) => {
      return [start_time, end_time].map(time => format(new Date(time * 1000), 'HH:ii')).join('~');
    };
    // 是否有权限
    const jurisdiction = ref(false);
    const list = ref(new Array(7));
    const weekCn = '日一二三四五六';
    // const format_time = (val: number) => {
    //   const date = new Date();
    //   date.setTime(val * 1000);
    //   const hour = (date.getHours() + '').padStart(2, '0');
    //   const minutes = (date.getMinutes() + '').padStart(2, '0');
    //   return `${hour}:${minutes}`;
    // };
    const update = () => {
      approvalService.QUERY_OPERATOR_SCHEDULE().then(res => {
        const data = res.data;
        if (data.error_code === 203) {
          jurisdiction.value = false;
          return;
        }
        jurisdiction.value = true;
        if (data.success && data.data) {
          list.value = data.data.map(val => {
            // let commonSchedule: CommonResSchedule | undefined = undefined;
            // const commonScheduleList = val.data_list.map(schedule => {
            //   const { shop_live_id } = schedule;

            //   if (!commonSchedule) {
            //     commonSchedule = parse(schedule) as CommonResSchedule;
            //     commonSchedule.live_times = [timeStr(schedule.start_time, schedule.end_time)];
            //     return commonSchedule;
            //   } else {
            //     if (shop_live_id === commonSchedule.shop_live_id) {
            //       commonSchedule.live_times.push(timeStr(schedule.start_time, schedule.end_time));
            //       return undefined;
            //     } else {
            //       commonSchedule = parse(schedule) as CommonResSchedule;
            //       commonSchedule.live_times = [timeStr(schedule.start_time, schedule.end_time)];
            //       return commonSchedule;
            //     }
            //   }
            // });
            const commonSchedules: CommonResSchedule[] = [];
            val.data_list.forEach(schedule => {
              const { shop_live_id } = schedule;

              let commonSchedule = commonSchedules.filter(
                commonScheduleItem => commonScheduleItem.shop_live_id === shop_live_id,
              )[0];
              if (!commonSchedule) {
                commonSchedule = parse(schedule) as CommonResSchedule;
                commonSchedule.live_times = [timeStr(schedule.start_time, schedule.end_time)];
                commonSchedules.push(commonSchedule);
              } else {
                if (shop_live_id === commonSchedule.shop_live_id) {
                  commonSchedule.live_times.push(timeStr(schedule.start_time, schedule.end_time));
                } else {
                  commonSchedule = parse(schedule) as CommonResSchedule;
                  commonSchedule.live_times = [timeStr(schedule.start_time, schedule.end_time)];
                  commonSchedules.push(commonSchedule);
                }
              }
            });

            const date = new Date(val.date_str);
            return {
              week: `周${weekCn.charAt(date.getDay())}`,
              date: val.date_str,
              day: date.getDate(),
              empty: val.data_list && val.data_list.length === 0,
              data: commonSchedules,
            };
          });
        }
      });
    };
    update();
    return reactive({
      jurisdiction,
      list,
    });
  },
  /** 获取一些弹框的开关....找不到在哪开了,只能先storge用着先,
   * 顺便
   * 合并了原先导出关闭属性,状态属性,现在为一个对象
   * **/
  useModelState(): { [key: string]: boolean } {
    return new Proxy(
      {},
      {
        set(target, name: string, value: boolean): boolean {
          store.dispatch(`workbench/set${name}Visible`, value);
          return true;
        },
      },
    );
  },
};
