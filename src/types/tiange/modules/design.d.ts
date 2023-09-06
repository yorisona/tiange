/** 形象设计大板块 **/

declare global {
  namespace M.design {
    // 预约单
    interface Reservation {
      id: number;
      // 业务类型
      business_type: E.project.BusinessType;
      // 项目ID
      project_id: number;
      // 项目名称
      project_name: string;
      // 主播类型
      anchor_type: E.supplier.AnchorType;
      // 预约主体
      appointment_subject: E.design.AppointmentSubject;
      // 预约日期列表，里面是date类型
      appointment_date_list: string[];
      // 预约时间
      appointment_time: string;
      // 开播时间
      start_broadcast_time: string;
      // 服务类型
      service_type: E.design.ServiceType;
      // 相关要求
      relevant_requirement: string;
      // 场景图
      scene_graph: string[];
      // 效果借鉴图
      design_sketch: string[];
      // 妆造类型
      image_design_type: E.design.ImageDesignType;
      external_status: number;
      external_status_name: string;
      draft: Reservation;
    }

    interface ReservationQuery extends Reservation {
      // 预约人
      reservation_person_username: string;
      reservation_person_id: number;
      // 预约时间
      appointment_date: string;
      //预约状态
      reservation_status: E.design.AppointmentStatus;
      // 妆造师
      image_design_username: string;
      // 满意度
      satisfaction: string;
      // 评价
      satisfaction_evaluate: string;
      // 效果图片
      effect_drawing: string[];
      image_design_id: number;
    }

    interface DesignSetting {
      //id序号
      id?: number;
      //类型名称
      name?: string;
      // 负责小组名称
      team_name?: string;
      team_id?: number;
      //交接天数
      delivery_days?: string | number;
      addition_content?: any;
      delivery_content?: any;
      fields?: any;
      team_label?: string;
    }

    interface ReservationStatistics {
      // 满意度
      satisfaction_ratio: number;
      // 总退单
      total_chargeback: number;
      // 总结单
      total_closed: number;
      // 总耗时（单位h）
      total_time_consuming: number;
      //平均耗时（单位h)
      avg_time_consuming: number;
      // 总提单
      total_valid: number;
    }

    interface ReservatioonStatisticsPieModel {
      id: number;
      name: string;
      value: number | undefined;
    }

    interface ReservatioonStatisticsSunburstModel {
      code: number;
      key: string;
      count: number | undefined;
      sub_data: ReservatioonStatisticsSunburstModel[] | undefined;
    }
  }
}
export {};
