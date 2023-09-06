/**
 * 品牌管理 service
 * @author  wuyou <wuyou@goumee.com>
 * @since   2020-12-24 13:24:42
 * @see http://rap2.goumee.com/repository/editor?id=19&mod=144&itf=1467
 *
 *   __________
 *  / ___  ___ \
 * / / @ \/ @ \ \
 * \ \___/\___/ /\
 *  \____\/____/||
 *  /     /\\\\\//
 *  |     |\\\\\\
 *  \      \\\\\\
 *   \______/\\\\
 *    _||_||_
 *     -- --
 *
 *      ┌─┐       ┌─┐ + +
 *   ┌──┘ ┴───────┘ ┴──┐++
 *   │                 │
 *   │       ───       │++ + + +
 *   ███████───███████ │+
 *   │                 │+
 *   │       ─┴─       │
 *   │                 │
 *   └───┐         ┌───┘
 *       │         │
 *       │         │   + +
 *       │         │
 *       │         └──────────────┐
 *       │                        │
 *       │                        ├─┐
 *       │                        ┌─┘
 *       │                        │
 *       └─┐  ┐  ┌───────┬──┐  ┌──┘  + + + +
 *         │ ─┤ ─┤       │ ─┤ ─┤
 *         └──┴──┘       └──┴──┘  + + + +
 *                神兽保佑
 *               代码无BUG!
 */

import { HttpResponse, ListResponse } from '@/types/base/http';
import { Get, Post } from '@/utils/request';
import { ObjectFilterEmpty } from '@/utils/func';

import * as APIs from '@/apis/brand';
import { Brand, BrandForm, BrandQueryParams } from '@/types/tiange/brand';

/**
 * 品牌列表
 * @author  wuyou <wuyou@goumee.com>
 * @since   2020-12-24 13:32:42
 */
export const GetBrandList = async (payload: BrandQueryParams): Promise<ListResponse<Brand>> =>
  Get(APIs.BRAND_LIST_API, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

/**
 * 保存品牌
 * @author  wuyou <wuyou@goumee.com>
 * @since   2020-12-24 13:32:42
 */
export const SaveBrand = async (payload: BrandForm): Promise<HttpResponse<undefined>> =>
  Post(APIs.BRAND_SAVE_API, {
    ...ObjectFilterEmpty(payload),
  });

/**
 * 删除品牌
 * @author  wuyou <wuyou@goumee.com>
 * @since   2020-12-24 13:32:42
 */
export const DeleteBrand = async (id: number): Promise<HttpResponse<undefined>> =>
  Post(APIs.BRAND_DELETE_API.replace(':id', `${id}`));
