/**
 直播看板
 **/
import { Get, Post } from '@/utils/request';
import { Message } from 'element-ui';
const catchError = (res: any) => {
  if (res.data.success !== true) throw new Error(res.data.message);
  return res.data.data;
};
const toastError = (ex: Error) => {
  Message.error(ex.message || '请求错误');
  throw ex;
};
export const GetLiveAnalyse = async (
  liveId: number,
  business_type: number | undefined = E.project.BusinessType.douyin,
) =>
  Get(
    business_type === E.project.BusinessType.supplyChain
      ? `/api/shop_live/supply_chain/${liveId}/live_analyse`
      : business_type === E.project.BusinessType.locallife
      ? `/api/shop_live/local_life/${liveId}/live_analyse`
      : `/api/shop_live/${liveId}/live_analyse`,
  )
    .then(catchError)
    .catch(toastError);

export const PostContrast = async (liveId: number, contrastLiveId: number) =>
  Post(`/api/shop_live/${liveId}/live_analyse/contrast`, {
    contrast_live_id: contrastLiveId,
  })
    .then(catchError)
    .catch(toastError);

export const PostContrastFeedback = async (liveId: number, data: Record<string, unknown>[]) =>
  Post(`/api/shop_live/${liveId}/live_analyse/feedback`, data).then(catchError).catch(toastError);
