/*
 * @Author: 矢车
 * @Date: 2020-11-21 11:46:57
 * @LastEditors: 矢车
 * @LastEditTime: 2021-01-12 11:10:58
 * @Description: 字段枚举
 */

/**
 * @Author: 矢车
 * @Date: 2020-11-21 11:47:54
 * @Description: 发票类型
 * @deprecated
 */
export const enumLevelTwoTypes = (type: number): string => {
  let val = '';
  switch (type) {
    case 1:
      val = '普通发票';
      break;
    case 2:
      val = '专用发票';
      break;
    case 3:
      val = '电子发票';
      break;
    case 4:
      val = '收据';
      break;
  }
  return val;
};

/**
 * @Author: 矢车
 * @Date: 2020-11-23 18:24:50
 * @Description: 合同类型
 */
export const enumContractType = (type: number): string => {
  let val = '';
  switch (type) {
    case 1:
      val = '采买合同';
      break;
    case 2:
      val = '框架合同';
      break;
  }
  return val;
};

/**
 * @Author: 矢车
 * @Date: 2020-11-23 18:24:50
 * @Description: 审批状态
 */
export const enumApproveStatus = (type: number): string => {
  let val = '';
  switch (type) {
    case 1:
      val = '待审批';
      break;
    case 2:
      val = '审批成功';
      break;
    case 3:
      val = '审批失败';
      break;
    case 4:
      val = '审批中';
      break;
    case 5:
      val = '作废';
      break;
  }
  return val;
};

/**
 * @Author: 矢车
 * @Date: 2020-11-23 18:24:50
 * @Description: 结算方式
 */
export const enumSettleWay = (type: number): string => {
  let val = '';
  switch (type) {
    case 1:
      val = '对公银行';
      break;
    case 2:
      val = '支付宝';
      break;
    case 3:
      val = 'V任务';
      break;
    case 4:
      val = '淘宝联盟';
      break;
    case 5:
      val = '巨量百应';
      break;
  }
  return val;
};

/**
 * @Author: 矢车
 * @Date: 2020-11-23 18:24:50
 * @Description: 用章情况
 */
export const enumSealType = (type: number): string => {
  let val = '';
  switch (type) {
    case 1:
      val = '不用印章';
      break;
    case 2:
      val = '公章';
      break;
    case 3:
      val = '合同章';
      break;
  }
  return val;
};

/**
 * @Author: 矢车
 * @Date: 2020-12-28 18:47:43
 * @Description: 业务类型
 */
export const searchEnumBussinessType = (type: number) => {
  const dataList = [
    {
      value: '',
      label: '全部',
    },
    {
      value: 1,
      label: '营销业务',
    },
    {
      value: 3,
      label: '抖音店播',
    },
    {
      value: 2,
      label: '淘宝店播',
    },
  ];

  // 如果传了参数，找出当前参数对应的数据
  if (type) {
    for (const item of dataList) {
      // @ts-ignore
      if (item.value === type) {
        return item;
      }
    }
    return null;
  }
  return dataList;
};

export const enumBussinessType = (type: number) => {
  const dataList = [
    {
      value: 1,
      label: '营销业务',
    },
    {
      value: 3,
      label: '抖音店播',
    },
    {
      value: 2,
      label: '淘宝店播',
    },
  ];

  // 如果传了参数，找出当前参数对应的数据
  if (type) {
    for (const item of dataList) {
      // @ts-ignore
      if (item.value === type) {
        return item;
      }
    }
    return null;
  }
  return dataList;
};

/**
 * @Author: 矢车
 * @Date: 2020-12-29 10:58:31
 * @Description: 系统设置-用户管理-状态
 */
export const searchEnumUserStatus = (type: number) => {
  const dataList = [
    {
      value: '',
      label: '全部',
      img: require('@/assets/img/system/normal.png'),
    },
    {
      value: 1,
      label: '正常',
      img: require('@/assets/img/system/normal.png'),
    },
    {
      value: 2,
      label: '停用',
      img: require('@/assets/img/system/stop.png'),
    },
  ];

  // 如果传了参数，找出当前参数对应的数据
  if (type) {
    for (const item of dataList) {
      // @ts-ignore
      if (item.value === type) {
        return item;
      }
    }
    return null;
  }
  return dataList;
};
export const enumUserStatus = (type: number) => {
  const dataList = [
    {
      value: 1,
      label: '正常',
      img: require('@/assets/img/system/normal.png'),
    },
    {
      value: 2,
      label: '停用',
      img: require('@/assets/img/system/stop.png'),
    },
  ];

  // 如果传了参数，找出当前参数对应的数据
  if (type) {
    for (const item of dataList) {
      // @ts-ignore
      if (item.value === type) {
        return item;
      }
    }
    return null;
  }
  return dataList;
};

/**
 * @Author: 矢车
 * @Date: 2021-01-11 10:43:50
 * @Description: 店铺代播 - 项目完结 - 执行结果
 */
export const enumEndType = (type?: number) => {
  const dataList = [
    {
      value: 3,
      label: '执行结束',
    },
    {
      value: 1,
      label: '正常结束',
    },
    {
      value: 2,
      label: '意外终止',
    },
  ];

  // 如果传了参数，找出当前参数对应的数据
  if (type) {
    for (const item of dataList) {
      // @ts-ignore
      if (item.value === type) {
        return item;
      }
    }
    return null;
  }
  return dataList;
};

/**
 * @Author: 矢车
 * @Date: 2021-01-11 10:43:50
 * @Description: 店铺代播 - 项目完结 - 终止处理
 */
export const enumEndHandleType = (type: number) => {
  const dataList = [
    {
      value: 1,
      label: '退款',
    },
    {
      value: 2,
      label: '其他',
    },
  ];

  // 如果传了参数，找出当前参数对应的数据
  if (type) {
    for (const item of dataList) {
      // @ts-ignore
      if (item.value === type) {
        return item;
      }
    }
    return null;
  }
  return dataList;
};
