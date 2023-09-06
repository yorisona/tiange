export const enum SupplierCompanyVerifyStatusEnum {
  PENDING = 0,
  APPROVED = 1,
  NOT_APPROVED = -1,
}

export const SupplierCompanyVerifyStatus = [
  {
    label: '审核中',
    value: SupplierCompanyVerifyStatusEnum.PENDING,
  },
  {
    label: '已通过',
    value: SupplierCompanyVerifyStatusEnum.APPROVED,
  },
  {
    label: '未通过',
    value: SupplierCompanyVerifyStatusEnum.NOT_APPROVED,
  },
];

export const enum customerCompanyVerifyStatusEnum {
  PENDING = 0,
  APPROVED = 1,
  NOT_APPROVED = -1,
  NOT_COMMIT = 2,
}

export const customerCompanyVerifyStatus = [
  {
    label: '审核中',
    value: customerCompanyVerifyStatusEnum.PENDING,
  },
  {
    label: '已通过',
    value: customerCompanyVerifyStatusEnum.APPROVED,
  },
  {
    label: '未通过',
    value: customerCompanyVerifyStatusEnum.NOT_APPROVED,
  },
  {
    label: '未提交',
    value: customerCompanyVerifyStatusEnum.NOT_COMMIT,
  },
];
