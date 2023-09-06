import { RouterNameProjectManage } from '@/const/router';
import { RawLocation } from 'vue-router';
import { BusinessTypeEnum } from '@/types/tiange/common';
import { LiveProject } from '@/types/tiange/live.project';
import { useRouter } from '@/use/vue-router';
import { MarketingProject, MarketingProjectDetail } from '@/types/tiange/marketing/project';
import { CommonBusinessProjectDetail } from '@/types/tiange/commonBusiness/project';

export type TabType =
  | 'projectInfo'
  | 'live'
  | 'localLife'
  | 'income'
  | 'cost'
  | 'contract'
  | 'dailyData'
  | string;
export type LiveType = 'calendar' | 'list' | 'SupplyChainDetail';

export interface JumpProjectDetailarams {
  /** 项目id */
  project_id: number | string;
  /** 当前展示的tab页 */
  tab?: TabType;
  /** 排期展示类型 */
  liveType?: LiveType;
  /** 是否开启新的窗口 */
  newWindow?: boolean;
  /** 跳转页面 */
  pathName?: string;
  business_type?: string;
  project?: LiveProject | MarketingProject | MarketingProjectDetail | CommonBusinessProjectDetail;
  is_from_project?: string;
}

export interface JumpLiveDetailParams extends JumpProjectDetailarams {
  /** 场次id, 跳转场次详情时传入 */
  live_id?: number | string | undefined;
}
export const usePageJump = () => {
  const router = useRouter();
  const jumpMethods = {
    //  跳转项目详情
    // <<<<<<< HEAD
    //     jumpProjectDetail: (payload: JumpProjectDetailarams) => {
    //       if (payload.businessType === BusinessTypeEnum.douyin) {
    //         const jumpParams: RawLocation = {
    //           name: RouterNameProjectManage.tiktokLive.project.detail.template,
    //           params: {
    //             id: `${payload.project_id}`,
    //             tab: payload.tab ?? 'projectInfo',
    //             liveType: payload.liveType ?? 'calendar',
    //           },
    //         };
    //         const newWindow = payload.newWindow ?? false;
    //         jumpMethods.jump(jumpParams, newWindow);
    //         return;
    //       }
    // =======
    jumpProjectDetail: (business_type: number | undefined, payload: JumpProjectDetailarams) => {
      if (
        business_type === BusinessTypeEnum.taobaopick ||
        business_type === BusinessTypeEnum.taobao ||
        business_type === BusinessTypeEnum.douyin
      ) {
        jumpMethods.jumpLiveProjectDetail(business_type, payload);
      } else if (business_type === BusinessTypeEnum.supplyChain) {
        jumpMethods.jumpSupplyChainDetail({
          ...payload,
          pathName:
            payload.tab === 'display'
              ? RouterNameProjectManage.supplyChain.details.display
              : payload.tab === 'income'
              ? RouterNameProjectManage.supplyChain.details.income
              : payload.tab === 'cost'
              ? RouterNameProjectManage.supplyChain.details.cost
              : payload.tab === 'contract'
              ? RouterNameProjectManage.supplyChain.details.contract
              : payload.tab === 'data'
              ? RouterNameProjectManage.supplyChain.details.data
              : payload.tab === 'target'
              ? RouterNameProjectManage.supplyChain.details.target
              : payload.tab === 'setting'
              ? RouterNameProjectManage.supplyChain.details.setting
              : '',
        });
      } else if (business_type === BusinessTypeEnum.locallife) {
        jumpMethods.jumpLocalLifeDetail({
          ...payload,
          pathName:
            payload.tab === 'display'
              ? RouterNameProjectManage.localLife.detail.display
              : payload.tab === 'income'
              ? RouterNameProjectManage.localLife.detail.income
              : payload.tab === 'cost'
              ? RouterNameProjectManage.localLife.detail.cost
              : payload.tab === 'contract'
              ? RouterNameProjectManage.localLife.detail.contract
              : payload.tab === 'data'
              ? RouterNameProjectManage.localLife.detail.data
              : payload.tab === 'target'
              ? RouterNameProjectManage.localLife.detail.target
              : payload.tab === 'setting'
              ? RouterNameProjectManage.localLife.detail.setting
              : RouterNameProjectManage.localLife.detail.info,
        });
      } else if (business_type === BusinessTypeEnum.marketing) {
        jumpMethods.jumpMarketingProjectDetail(payload);
      } else {
        jumpMethods.jumpCommonBusinessProjectDetail(payload);
      }
    },
    //  跳转项目详情
    jumpLiveProjectDetail: (business_type: number | undefined, payload: JumpProjectDetailarams) => {
      if (business_type === BusinessTypeEnum.douyin) {
        const jumpParams: RawLocation = {
          name:
            payload.tab === 'display'
              ? RouterNameProjectManage.tiktokLive.project.detail.display
              : payload.tab === 'income'
              ? RouterNameProjectManage.tiktokLive.project.detail.income
              : payload.tab === 'cost'
              ? RouterNameProjectManage.tiktokLive.project.detail.cost
              : payload.tab === 'contract'
              ? RouterNameProjectManage.tiktokLive.project.detail.contract
              : payload.tab === 'data'
              ? RouterNameProjectManage.tiktokLive.project.detail.data
              : payload.tab === 'target'
              ? RouterNameProjectManage.tiktokLive.project.detail.target
              : payload.tab === 'setting'
              ? RouterNameProjectManage.tiktokLive.project.detail.setting
              : payload.tab === 'liveTool'
              ? RouterNameProjectManage.tiktokLive.project.detail.liveTool
              : RouterNameProjectManage.tiktokLive.project.detail.template,
          params: {
            id: `${payload.project_id}`,
            tab: payload.tab ?? 'projectInfo',
            liveType: payload.liveType ?? 'calendar',
          },
        };
        const newWindow = payload.newWindow ?? false;
        jumpMethods.jump(jumpParams, newWindow);
        return;
      }
      // >>>>>>> master
      const jumpParams: RawLocation = {
        name: RouterNameProjectManage.live.project.detail,
        params: {
          id: `${payload.project_id}`,
          tab: payload.tab ?? 'projectInfo',
          liveType: payload.liveType ?? 'calendar',
        },
      };
      const newWindow = payload.newWindow ?? false;
      jumpMethods.jump(jumpParams, newWindow);
    },
    //  跳转项目详情
    jumpMarketingProjectDetail: (payload: JumpProjectDetailarams) => {
      const jumpParams: RawLocation = {
        name: RouterNameProjectManage.marketing.project.detail,
        params: {
          id: `${payload.project_id}`,
          tab: payload.tab ?? 'info',
          liveType: payload.liveType ?? '',
        },
      };
      const newWindow = payload.newWindow ?? false;
      jumpMethods.jump(jumpParams, newWindow);
    },
    //  跳转项目详情
    jumpCommonBusinessProjectDetail: (payload: JumpProjectDetailarams) => {
      const jumpParams: RawLocation = {
        name: RouterNameProjectManage.commonBusiness.project.detail,
        params: {
          id: `${payload.project_id}`,
          tab: payload.tab ?? 'info',
          liveType: payload.liveType ?? 'calendar',
        },
      };
      const newWindow = payload.newWindow ?? false;
      jumpMethods.jump(jumpParams, newWindow);
    },
    //  跳转场次详情
    jumpLiveDisplayDetail: (payload: JumpLiveDetailParams, isFromTiktok: boolean = false) => {
      const jumpParams: RawLocation = {
        name: isFromTiktok
          ? RouterNameProjectManage.tiktokLive.project.detail.displayDetail
          : RouterNameProjectManage.live.display.detail,
        params: {
          id: `${payload.project_id}`,
          liveId: `${payload.live_id}`,
          tab: 'live',
          liveType: payload.liveType ?? 'calendar',
        },
      };
      const newWindow = payload.newWindow ?? false;
      jumpMethods.jump(jumpParams, newWindow);
    },
    //  跳转本地生活详情
    jumpLocalLifeDetail: (payload: JumpLiveDetailParams) => {
      const jumpParams: RawLocation = {
        name: payload.pathName || RouterNameProjectManage.localLife.detail.info,
        params: {
          id: `${payload.project_id}`,
          liveId: `${payload.live_id}`,
          tab: 'localLife',
          liveType: payload.liveType ?? 'calendar',
          business_type: payload.business_type + '',
          is_from_project: '1',
        },
      };
      const newWindow = payload.newWindow ?? false;
      jumpMethods.jump(jumpParams, newWindow);
    },
    //  跳转供应链场次详情
    jumpSupplyLifeDetail: (payload: JumpLiveDetailParams) => {
      const jumpParams: RawLocation = {
        name: payload.pathName || RouterNameProjectManage.supplyChain.details.display,
        params: {
          id: `${payload.project_id}`,
          liveId: `${payload.live_id}`,
          tab: 'supply_chain',
          liveType: payload.liveType ?? 'calendar',
          business_type: 9 + '',
          is_from_project: '1',
        },
      };
      const newWindow = payload.newWindow ?? false;
      jumpMethods.jump(jumpParams, newWindow);
    },
    //  跳转供应链
    jumpSupplyChainDetail: (payload: JumpProjectDetailarams) => {
      console.log('payload', payload, RouterNameProjectManage.supplyChain.detail);
      const jumpParams: RawLocation = {
        name: payload.pathName || RouterNameProjectManage.supplyChain.detail,
        params: {
          id: `${payload.project_id}`,
          tab: payload.tab ?? 'projectInfo',
          liveType: payload.liveType ?? 'calendar',
          business_type: 9 + '',
          is_from_project: '1',
        },
      };
      const newWindow = payload.newWindow ?? false;
      jumpMethods.jump(jumpParams, newWindow);
    },
    //  跳转
    jump: (payload: RawLocation, newWindow = false) => {
      if (newWindow) {
        const { href } = router.resolve(payload);
        window.open(href, '_blank');
      } else {
        router.push(payload);
      }
    },
  };

  return {
    ...jumpMethods,
  };
};
