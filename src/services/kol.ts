/**
 * KOL
 * @author  Jerry <jerry.hz.china@gmail.com>
 * @since   2021-04-17 00:53:31
 */
import { Get, Post } from '@/utils/request';
import { ObjectFilterEmpty } from '@/utils/func';
import type { ListResponse } from '@/types/base/http';
import type { KOLQueryParams } from '@/types/tiange/kol';

export const GetKOLList = async (payload: KOLQueryParams): Promise<ListResponse<any>> =>
  Get('/api/kol/query_kol', {
    params: { ...ObjectFilterEmpty(payload) },
  });
export const GetCategories = async (): Promise<any> => Get('/api/anchor/good_at_categories');
export const GetAnchorTags = async (): Promise<any> => Get('/api/anchor/anchor_tags');
export const UpdateKolPlatform = async (payload: any): Promise<any> =>
  Post('/api/kol/update_kol_platform', payload);
