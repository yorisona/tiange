import { Get, Post } from '@/utils/request';
import { ObjectFilterEmpty } from '@/utils/func';
import * as APIs from '@/apis/public';
import { ListResponse, HttpResponse } from '@/types/base/http';
import { CommodityQueryParams, CommodityItem } from '@/types/tiange/public';
import { BankAccount } from '@/types/tiange/finance/finance';

export const GetCommodityList = async (
  payload: CommodityQueryParams,
): Promise<ListResponse<CommodityItem>> =>
  Get(APIs.QUERY_TIANGE_ITEM_INFORMATION, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

export const GetQueryDouyinReportProjects = async (payload: {
  project_name: string;
}): Promise<HttpResponse<any>> =>
  Get(APIs.QUERY_DOUYIN_REPORT_PROJECTS, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

export const GetCategories = async (): Promise<HttpResponse<any>> =>
  Get(APIs.QUERY_TIANGE_CATEGORIES);

export const UpdateCommodity = async (data: {
  id: number | '';
  project_id: number | '';
  item_id: string;
  item_sn: string;
  year: string;
  season: number | string;
  first_tiange_cat_id: number | '';
  third_tiange_cat_id: number | '';
}): Promise<HttpResponse<any>> =>
  Post(APIs.UPDATE_TIANGE_ITEM_INFORMATION, ObjectFilterEmpty(data));

export const DeleteCommodity = async (id: number): Promise<HttpResponse<any>> =>
  Post(APIs.DELETE_TIANGE_ITEM_INFORMATION, { id });

export const CreateBankAccount = async (
  payload: Partial<BankAccount>,
): Promise<HttpResponse<any>> =>
  Post(APIs.CREATE_BANK_ACCOUNT, {
    ...ObjectFilterEmpty(payload),
  });

export const UpdateBankAccount = async (
  payload: Partial<BankAccount>,
): Promise<HttpResponse<any>> =>
  Post(APIs.UPDATE_BANK_ACCOUNT, {
    ...ObjectFilterEmpty(payload),
  });
