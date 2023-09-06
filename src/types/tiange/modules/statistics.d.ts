declare global {
  // 视觉设计统计
  namespace M.visualDesignStatistics {
    // ------------视觉设计统计-------------------------------
    // 指标
    interface ManHour {
      details: Array<{
        content: string;
        end_time: string;
        flag: number;
        gmt_create: string;
        gmt_modified: string;
        id: number;
        man_hour_belong: number;
        man_hour_date: string;
        man_hour_type: number;
        minutes: number;
        remark: string;
        start_time: string;
        target_id: number;
        user_id: number;
        user_name: string;
        target_name: string;
        hours: number;
        connect_id: number;
        connect_name: string;
      }>;
      date: string;
      all_hours: number;
      views: Array<{
        datas: Array<{
          content: string;
          end_time: string;
          flag: number;
          gmt_create: string;
          gmt_modified: string;
          id: number;
          man_hour_belong: number;
          man_hour_date: string;
          man_hour_type: number;
          minutes: number;
          remark: string;
          start_time: string;
          target_id: number;
          project_id: number;
          target_name: string;
          department_id: number;
          user_id: number;
          user_name: string;
          percent: number;
        }>;
        target_name?: string;
        man_hour_type_name: string;
        man_hour_type: number;
      }>;
    }

    type BelongPercent = {
      hours: number;
      man_hour_belong: number;
      man_hour_belong_name: string;
      man_hour_project_type: number;
      man_hour_project_type_name: string;
      man_hour_type: number;
      man_hour_type_name: string;
      percent: number;
      target_id: number;
      target_name: string;
    };

    type Completed = {
      all_hours: number;
      hours: number;
      percent: number;
    };

    type ManHourPercent = {
      man_hour_type: number;
      man_hour_type_name: string;
      percent: number;
    };

    interface UserManHourCardData {
      belong_percent: BelongPercent[];
      completed: Completed;
      man_hour_percent: ManHourPercent[];
    }

    type ManHourCount = {
      hours: number;
      man_hour_type: number;
      man_hour_type_name: string;
      percent: number;
    };

    type ProjectRequirementCount = {
      hours: number;
      percent: number;
      target_name: string;
      designer_data: {
        content: string;
        hours: number;
        percent: number;
        user_id: number;
        user_name: string;
        job_title: string;
      }[];
      views: {
        datas: {
          content: string;
          hours: number;
          percent: number;
          user_id: number;
          user_name: string;
          job_title: string;
        }[];
        man_hour_type: number;
        man_hour_type_name: string;
      }[];
    };

    interface ManHourCountData {
      man_hour_count: ManHourCount[];
      project_requirement_count: ProjectRequirementCount[];
    }

    type DepartmentManHour = {
      all_hours: number;
      department_name: string;
      hours: number;
      percent: number;
      data_source: number;
      son_department_data: {
        all_hours: number;
        department_name: string;
        hours: number;
        percent: number;
        views: Array<{
          designer_data: Array<{
            content: string;
            end_time: string;
            flag: number;
            gmt_create: string;
            gmt_modified: string;
            id: number;
            man_hour_belong: number;
            man_hour_date: string;
            man_hour_type: number;
            minutes: number;
            remark: string;
            start_time: string;
            target_id: number;
            target_name: string;
            department_id: number;
            user_id: number;
            user_name: string;
            percent: number;
          }>;
          target_name?: string;
          man_hour_type_name: string;
          man_hour_type: number;
        }>;
      }[];
    };

    type DesignerManHour = {
      all_hours: number;
      hours: number;
      user_id: number;
      user_name: string;
    };
    /* 统计卡片部门和设计师数据 */
    interface cardDepartmentsAndDesigners {
      department_man_hour: DepartmentManHour[];
      designer_man_hour: DesignerManHour[];
    }

    /* 下单统计项目和部门 */
    interface DesignerData {
      content: string;
      hours: number;
      job_title: string;
      man_hour_belong: number;
      man_hour_type: number;
      minutes: number;
      percent: number;
      target_id: number;
      target_name: string;
      user_id: number;
      user_name: string;
    }

    interface ViewsData {
      content: string;
      hours: number;
      job_title: string;
      man_hour_belong: number;
      man_hour_type: number;
      minutes: number;
      percent: number;
      target_id: number;
      target_name: string;
      user_id: number;
      user_name: string;
    }

    interface ProjectRequirementCountViews {
      datas: ViewsData[];
      man_hour_type: number;
      man_hour_type_name: string;
    }

    interface ProjectRequirementCount {
      designer_data: DesignerData[];
      hours: number;
      man_hour_belong: number;
      man_hour_project_type: number;
      percent: number;
      target_id: number;
      target_name: string;
      views: ProjectRequirementCountViews[];
    }

    interface DepartmentSons {
      department_id: string;
      full_name: string;
      gmt_create: string;
      gmt_modified: string;
      id: number;
      is_deleted: boolean;
      kingdee_id: number;
      leader_user_id: string;
      level: number;
      member_count: number;
      name: string;
      open_department_id: string;
      order: number;
      parent_department_id: string;
      hours: number;
      percent: number;
      project_man_hour_data: any[]; //需要根据实际情况更改
      requirement_man_hour_data: any[]; //需要根据实际情况更改
      sons: any[]; //需要根据实际情况更改
      user_list: any[]; //需要根据实际情况更改
      views: any[]; //需要根据实际情况更改
    }

    interface StatisticalItemsAndDepartmentsUnderOrders {
      department_count: {
        id: null;
        name: string;
        project_man_hour_data: any[]; //需要根据实际情况更改
        requirement_man_hour_data: any[]; //需要根据实际情况更改
        hours: number;
        percent: number;
        sons: DepartmentSons[];
      };
      project_requirement_count: ProjectRequirementCount[];
    }

    /* 下单日历 */
    // interface OrderStatistics {
    //   data: {
    //     details: {
    //       content: string;
    //       end_time: string;
    //       flag: number;
    //       gmt_create: string;
    //       gmt_modified: string;
    //       id: number;
    //       man_hour_belong: number;
    //       man_hour_date: string;
    //       man_hour_project_type: number;
    //       man_hour_type: number;
    //       minutes: number;
    //       remark: string;
    //       start_time: string;
    //       target_id: number;
    //       user_id: number;
    //     }[];
    //     man_hour_date: string;
    //     views: {
    //       datas: {
    //         content: string;
    //         end_time: string;
    //         flag: number;
    //         gmt_create: string;
    //         gmt_modified: string;
    //         id: number;
    //         man_hour_belong: number;
    //         man_hour_date: string;
    //         man_hour_project_type: number;
    //         man_hour_type: number;
    //         minutes: number;
    //         remark: string;
    //         start_time: string;
    //         target_id: number;
    //         user_id: number;
    //       }[];
    //       target_name: string;
    //     }[];
    //   }[];
    //   hours: number;
    //   project_name: string;
    //   user_name: string;
    // }
  }
}
export {};
