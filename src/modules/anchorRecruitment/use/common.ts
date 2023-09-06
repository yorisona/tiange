import { BusinessType } from '@/const/common';
import { BusinessTypeMap } from '@/types/tiange/common';
import { CommonBusinessProject } from '@/types/tiange/commonBusiness/project';

export const projectLabelDisplay = (project: CommonBusinessProject) => {
  if (project.business_type === BusinessType.locallife) {
    return `${project.project_name} (本地生活)`;
  }
  return `${project.project_name} (${BusinessTypeMap.get(project.business_type)})`;
};

export const recruitmentStatusColor = (status: E.supplier.RecruitmentStatus | undefined) => {
  // 待确认 fb8500
  // 已完成 20bf55
  if (status === E.supplier.RecruitmentStatus.WAITING_CONFIRM) {
    return '#fb8500';
  } else if (status === E.supplier.RecruitmentStatus.COMPLETE) {
    return '#20bf55';
  } else {
    return '#19232d';
  }
};
