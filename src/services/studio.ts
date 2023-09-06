/**
 * 直播间 service
 * @author  wuyou <wuyou@goumee.com>
 * @since   2020-12-24 11:48:56
 * @see http://rap2.goumee.com/repository/editor?id=19&mod=145&itf=1470
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

import { Get, Post } from '@/utils/request';
import { ObjectFilterEmpty } from '@/utils/func';
import { HttpResponse, ListResponse } from '@/types/base/http';

import * as APIs from '@/apis/studio';
import { Studio, StudioForm, StudioQueryParams } from '@/types/tiange/studio';

/**
 * 直播间列表
 * @author  wuyou <wuyou@goumee.com>
 * @since   2020-12-24 13:50:34
 */
export const GetStudioList = async (payload: StudioQueryParams): Promise<ListResponse<Studio>> =>
  Get(APIs.STUDIO_LIST_API, {
    params: {
      ...ObjectFilterEmpty(payload),
    },
  });

/**
 * 保存直播间
 * @author  wuyou <wuyou@goumee.com>
 * @since   2020-12-24 13:51:34
 */
export const SaveStudio = async (payload: StudioForm): Promise<HttpResponse<undefined>> =>
  Post(APIs.STUDIO_SAVE_API, {
    ...ObjectFilterEmpty(payload),
  });
