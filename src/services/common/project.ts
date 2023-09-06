/**
 * 通用业务 / 项目管理 services
 * @author  wuyou <wuyou@goumee.com>
 * @since   2021-05-06 14:43:5345
 */

import { HttpResponse, ListResponse } from '@/types/base/http';

import { ObjectFilterEmpty } from '@/utils/func';
import { Delete, Get, Post } from '@/utils/request';
/** 新建预收 */
export const SaveProjectPrePayInfo = (
  payload: {
    contract_id: number | string | undefined;
    gather_way: number | undefined;
    register_amount: number | undefined | string;
    project_uid: number | string | undefined;
    revenue_flow_id: number | undefined;
    project_id: number | string | undefined;
    is_received: number | undefined;
    remark: string;
    company_id: number | undefined | string;
  },
  business_type: number = 3,
): Promise<HttpResponse<undefined>> => {
  if (business_type === 5) {
    return Post('/api/deposit_received/common/project/save', ObjectFilterEmpty(payload));
  }
  if (business_type === 7) {
    return Post('/api/deposit_received/local_life/project/save', ObjectFilterEmpty(payload));
  }
  if (business_type === 9) {
    return Post('/api/deposit_received/supply_chain/project/save', ObjectFilterEmpty(payload));
  }
  return Post('/api/deposit_received/shop_live/project/save', ObjectFilterEmpty(payload));
};
/**  项目预收列表 */
export const GetProjectPrePayList = async (
  payload: {
    num: number | undefined;
    page_num: number | undefined;
    status: number | undefined;
    project_uid: number | string | undefined;
    is_hide_reverse_data: number | undefined;
    company_name: string | undefined;
  },
  business_type: number = 3,
): Promise<HttpResponse<any>> => {
  if (business_type === 5) {
    return Get('/api/deposit_received/common/project/list', {
      params: {
        ...ObjectFilterEmpty(payload),
      },
    });
  }
  if (business_type === 7) {
    return Get('/api/deposit_received/local_life/project/list', {
      params: {
        ...ObjectFilterEmpty(payload),
      },
    });
  }
  if (business_type === 9) {
    return Get('/api/deposit_received/supply_chain/project/list', {
      params: {
        ...ObjectFilterEmpty(payload),
      },
    });
  }
  return Get('/api/deposit_received/shop_live/project/list', {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });
};
/** 预收开票 */
export const SaveProjectPrePayApply = (payload: {
  address: string;
  attachment: string;
  bank_card_number: string;
  bank_of_deposit: string;
  company_id: number;
  content_type_other: string;
  department_id: number;
  invoice_amount: string;
  invoice_send_type: number;
  invoice_type: number;
  is_received: number;
  phone: string;
  received_date: string;
  record_id: number;
  remark: string | undefined;
  tax_number: string;
  contract_id: number | string | undefined;
  seller?: string;
  invoice_remark?: string;
}): Promise<HttpResponse<undefined>> =>
  Post(
    `/api/deposit_received/project/invoice/apply/${payload.record_id}`,
    ObjectFilterEmpty(payload),
  );

/** 预收收款 */
export const SaveProjectPrePayAchievement = (
  payload: {
    contract_id: number;
    gather_amount: number;
    gather_type: number;
    gather_way: number;
    record_id: number | undefined;
    revenue_flow_id: number;
  },
  business_type: number = 3,
): Promise<HttpResponse<undefined>> => {
  if (business_type === 5) {
    return Post(
      `/api/deposit_received/common/project/achievement/${payload.record_id}`,
      ObjectFilterEmpty(payload),
    );
  }
  if (business_type === 7) {
    return Post(
      `/api/deposit_received/local_life/project/achievement/${payload.record_id}`,
      ObjectFilterEmpty(payload),
    );
  }
  if (business_type === 9) {
    return Post(
      `/api/deposit_received/supply_chain/project/achievement/${payload.record_id}`,
      ObjectFilterEmpty(payload),
    );
  }
  return Post(
    `/api/deposit_received/shop_live/project/achievement/${payload.record_id}`,
    ObjectFilterEmpty(payload),
  );
};

/** 预收退款 */
export const SaveProjectPrePayRefundApply = (payload: any): Promise<HttpResponse<undefined>> =>
  Post(`/api/deposit_received/project/refund/${payload.record_id}`, ObjectFilterEmpty(payload));

/** 删除预收 */
export const DeletePrePayInfo = async (
  payload: {
    record_id: number;
  },
  business_type: number = 3,
): Promise<HttpResponse<undefined>> => {
  if (business_type === 5) {
    return Delete(`/api/deposit_received/common/project/remove/${payload.record_id}`);
  }
  if (business_type === 7) {
    return Delete(`/api/deposit_received/local_life/project/remove/${payload.record_id}`);
  }
  if (business_type === 9) {
    return Delete(`/api/deposit_received/supply_chain/project/remove/${payload.record_id}`);
  }
  return Delete(`/api/deposit_received/shop_live/project/remove/${payload.record_id}`);
};

/** 预收冲销 */
export const SaveProjectPrePayReverseApply = (
  payload: {
    record_id: number | string;
    reverse_reason: string;
  },
  business_type: number = 3,
): Promise<HttpResponse<undefined>> => {
  if (business_type === 5) {
    return Post(
      `/api/deposit_received/common/project/reverse/create/${payload.record_id}`,
      ObjectFilterEmpty(payload),
    );
  }
  if (business_type === 7) {
    return Post(
      `/api/deposit_received/local_life/project/reverse/create/${payload.record_id}`,
      ObjectFilterEmpty(payload),
    );
  }
  if (business_type === 9) {
    return Post(
      `/api/deposit_received/supply_chain/project/reverse/create/${payload.record_id}`,
      ObjectFilterEmpty(payload),
    );
  }
  return Post(
    `/api/deposit_received/shop_live/project/reverse/create/${payload.record_id}`,
    ObjectFilterEmpty(payload),
  );
};
/**  公司查询项目预收列表 */
export const GetProjectPrePayDepositReceviedList = async (payload: {
  num: number | undefined;
  page_num: number | undefined;
  customer_company_name: string | undefined;
}): Promise<ListResponse<any>> =>
  Get('/api/deposit_received/project/query_deposit_recevied', {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });
