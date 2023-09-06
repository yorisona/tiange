import { defineComponent, ref, computed, UnwrapRef, inject } from '@vue/composition-api';
import { RouterNameSupplier } from '@/const/router';
import { useParamsRouteTabs } from '@/use/tab';
import liveExperience from './liveExperience/index.vue';
import liveCase from '@/modules/supplier/playerManager/detail/liveExperience/liveCase.vue';
import otherInfo from './otherInfo/index.vue';
import cooperationInfo from './cooperationInfo/index.vue';
import supplierService, { GetAnchorKeyInfo } from '@/services/supplier';
import { useRouter } from '@/use/vue-router';
import { AnchorKeyType, IAnchorInfo, ICase } from '@/types/tiange/supplier';
import dialogImageView from '../common/dialogImageView/index.vue';
import maintainer from '../common/maintainer/index.vue';
import { MaintainerType } from '@/modules/supplier/playerManager/common/maintainer/index';
import { usePermission } from '@/use/permission';
import {
  AnchorKeyViewStatus,
  anchor_key_view_status,
  is_creator_maintainer,
  supplier_permission_info,
} from '../common/utils/utils';
import Vue from 'vue';
import anchorAgreementDialog from '@/modules/customer/contract/form/anchorAgreementDialog.vue';
import { Tab } from '@/types/components/tabs';
export default defineComponent({
  components: {
    liveExperience,
    otherInfo,
    cooperationInfo,
    liveCase,
    dialogImageView,
    maintainer,
    anchorAgreementDialog,
  },
  setup(props, ctx) {
    const router = useRouter();
    const anchorInfo = ref<IAnchorInfo | undefined>();
    const dialogImageViewRef = ref<{ show: (...args: any) => void }>();
    const addAnchorTemplateContractRef = ref<UnwrapRef<{ show: (...args: any) => void }> | null>(
      null,
    );
    const currentShowTabRef = ref<any>(null);
    const anchor_id = router.currentRoute.params.id;
    const showCase = ref<ICase>({
      description: '',
      images: [],
      videos: [],
      title: '',
    });

    const caseVisible = ref(false);
    const brands = computed(() => {
      const list: any[] = [];
      if (anchorInfo.value && anchorInfo.value.brands.length > 0) {
        list.push(...anchorInfo.value.brands);
      }
      return list;
    });
    const cooperationsInfo = ref('');
    const anchorAvatar = ref('');
    const permission = usePermission();
    const tabs = useParamsRouteTabs(
      [
        permission.supplier_anchor_view_experience && {
          label: '基本信息',
          value: 'liveExperience',
        },

        permission.supplier_anchor_other_base && {
          label: '结算信息',
          value: 'otherInfo',
        },
        permission.supplier_anchor_cooperation && {
          label: '合作信息',
          value: 'cooperationInfo',
        },
      ].filter(Boolean) as any,
      permission.supplier_anchor_view_experience
        ? 'liveExperience'
        : permission.supplier_anchor_other_base
        ? 'otherInfo'
        : permission.supplier_anchor_cooperation
        ? 'cooperationInfo'
        : '',
    );

    const reload = () => {
      supplierService.GetAnchorDetail(anchor_id).then((res: any) => {
        anchorInfo.value = res;
        const index = res.cooperations.findIndex((item: any) => item.cooperation_status === 1);
        cooperationsInfo.value = index === -1 ? '未合作' : '合作中';
        if (res.images.length > 0) {
          anchorAvatar.value = res.images[0];
        }
      });
    };

    reload();

    const onDialogCloseHandler = () => {
      caseVisible.value = false;
    };

    const onCaseOpenHandler = (_case: ICase) => {
      caseVisible.value = true;
      showCase.value = _case;
    };

    const showTrialBroad = (personalSign = false) => {
      if (!supplier_permission_info.supplier_kol_sign_contract) {
        ctx.root.$message.error('您没有发起正式签约权限');
        return;
      }
      if (anchorInfo.value?.verify_status !== 2) {
        ctx.root.$message.error('主播信息未通过审核，暂不允许签约');
        return;
      }
      addAnchorTemplateContractRef.value?.show(anchorInfo.value, undefined, {
        personalSign,
      });
    };
    const showImages = () => {
      dialogImageViewRef.value?.show('查看照片', anchorInfo.value?.images);
    };
    const handleDelete = async () => {
      const result = await new Promise(resolve => {
        ctx.root.$TDialog({
          title: '你确定删除吗',
          onConfirm: () => {
            resolve(true);
          },
          onCancel: () => {
            resolve(false);
          },
        });
      });
      if (!result) {
        return;
      }
      supplierService.GetAnchorDelete(anchor_id).then((res: any) => {
        if (res.data.success) {
          ctx.root.$message.success('删除成功，即将返回主播列表');
          setTimeout(() => {
            ctx.root.$router.push({ name: RouterNameSupplier.player });
          }, 2000);
        } else {
          ctx.root.$message.error(res.data.message);
        }
      });
    };
    const operation = {
      showTrialBroad,
      add() {
        showTrialBroad(true);
      },
    };
    const handleEditClick = () => {
      ctx.root.$router.push({
        name: RouterNameSupplier.player_modify,
        params: {
          id: anchorInfo.value?.id + '',
          verify_status: anchorInfo.value?.verify_status + '',
          verify: 'success',
        },
      });
    };

    const maintainerRef = ref<{ show: (maintainer: MaintainerType) => void } | undefined>(
      undefined,
    );
    const handleMaintainClick = () => {
      maintainerRef.value?.show({
        anchor_id: anchorInfo.value?.id,
        maintainer_id: anchorInfo.value?.maintainer_id,
        maintainer_name: anchorInfo.value?.maintainer,
      });
    };

    const handleShowWechatClick = () => {
      if (wechat.value || wechat.value === '') {
        return;
      }
      getAnchorKeyInfo();
    };

    const wechat = computed(() => anchorInfo.value?.wechat);

    const wechatShowStatus = anchor_key_view_status(anchorInfo, wechat);

    const getAnchorKeyInfo = async () => {
      const res = await GetAnchorKeyInfo({
        id: anchorInfo.value?.id,
        search_type: AnchorKeyType.Wechat,
      });
      if (res.data.success) {
        if (anchorInfo.value) {
          if ('wechat' in anchorInfo.value) {
            anchorInfo.value.wechat = res.data.data.wechat;
          } else {
            Vue.set(anchorInfo.value, 'wechat', res.data.data.wechat);
          }
        }
      } else {
        ctx.root.$message.error(res.data.message);
      }
    };

    const isCreatorMaintainer = is_creator_maintainer(anchorInfo);
    const routes = [{ title: '主播管理', name: RouterNameSupplier.player }, { title: '主播详情' }];
    const showBackTitleHandle = inject('showBackTitleHandle') as Function;
    showBackTitleHandle(routes);
    const onTabChange = async (sub_tab: Tab<string>) => {
      await tabs.onTabChange(sub_tab);
      showBackTitleHandle(routes);
    };
    return {
      ...tabs,
      onTabChange,
      permission,
      anchor_id,
      operation,
      brands,
      anchorInfo,
      cooperationsInfo,
      anchorAvatar,
      showCase,
      onDialogCloseHandler,
      onCaseOpenHandler,
      caseVisible,
      showTrialBroad,
      showImages,
      handleDelete,
      addAnchorTemplateContractRef,
      dialogImageViewRef,
      currentShowTabRef,
      handleEditClick,
      handleMaintainClick,
      maintainerRef,
      handleShowWechatClick,
      wechat,
      wechatShowStatus,
      reload,
      isCreatorMaintainer,
    };
  },
  render() {
    const { anchorInfo } = this;
    return (
      <div class="player-detail-page tg-page-container flex-auto">
        <div class="page-container ">
          <article class="page-side">
            <div class="player-status">
              <div class="avatar">
                <tg-image src={this.anchorAvatar} />
              </div>
              <div class="info">
                <div class="flower">
                  <span class="flower-name">{anchorInfo?.flower_name}</span>
                  {anchorInfo?.verify_status === 2 && this.isCreatorMaintainer && (
                    <tg-icon name="ico-edit" class="case-edit" onClick={this.handleEditClick} />
                  )}
                </div>
                <span>{anchorInfo?.real_name}</span>
              </div>
              {this.cooperationsInfo === '合作中' && (
                <div class="status">{this.cooperationsInfo}</div>
              )}
            </div>
            <div class="player-info">
              <span class="merge-col">
                类型：{' '}
                <span class="tag">{anchorInfo?.anchor_type === 1 ? '网络营销师' : '练习生'}</span>
              </span>
              <span class="merge-col">
                微信号：
                <span class="text">
                  {((this.wechatShowStatus === AnchorKeyViewStatus.ViewDirectly ||
                    this.wechatShowStatus === AnchorKeyViewStatus.ViewWithoutMask) &&
                    (this.wechat ? this.wechat : '--')) ||
                    ((this.wechatShowStatus === AnchorKeyViewStatus.None ||
                      this.wechatShowStatus === AnchorKeyViewStatus.ViewMask) &&
                      '*****')}
                </span>
                {(this.wechatShowStatus === AnchorKeyViewStatus.ViewMask ||
                  this.wechatShowStatus === AnchorKeyViewStatus.ViewWithoutMask) && (
                  <tg-button class="mgl-12" type="link" onclick={this.handleShowWechatClick}>
                    显示
                  </tg-button>
                )}
                {(this.wechatShowStatus === AnchorKeyViewStatus.ViewMask ||
                  this.wechatShowStatus === AnchorKeyViewStatus.ViewWithoutMask) && (
                  <el-popover
                    placement="top"
                    title=""
                    trigger="hover"
                    content="点击后，系统将记录行为"
                  >
                    <tg-icon
                      slot="reference"
                      class="mgl-8"
                      name="ico-question"
                      style="cursor: pointer;"
                    ></tg-icon>
                  </el-popover>
                )}
              </span>
              <span>
                性别：<span class="text">{anchorInfo?.gender === 1 ? '男' : '女'}</span>
              </span>
              <span>
                身高：<span class="text">{anchorInfo?.height}CM</span>
              </span>
              <span>
                体重：<span class="text">{anchorInfo?.weight}KG</span>
              </span>
              <span>
                鞋码：
                <span class="text">{anchorInfo?.shoes_size}</span>
              </span>
              <div class="merge-col more-box">
                <div class="btn-box">
                  <tg-button
                    onclick={this.showImages}
                    icon="ico-a-gengduozhaopian2x"
                    type="primary"
                  >
                    更多照片
                  </tg-button>
                  <tg-button
                    onclick={() => this.showTrialBroad(false)}
                    icon="ico-a-shenqinghezuo2x"
                    type="primary"
                  >
                    正式签约
                  </tg-button>
                  {/*{this.permission.supplier_anchor_delete && (*/}
                  {/*  <tg-button onclick={this.handleDelete} icon="ico-a-shenqinghezuo2x">*/}
                  {/*    删除主播*/}
                  {/*  </tg-button>*/}
                  {/*)}*/}
                </div>
              </div>
            </div>
            <div class="add-by-info">
              <h3 class="info-title">创建及审核信息</h3>
              <div class="line-add-by">
                <span class="label-name">审核状态：</span>
                <p class="label-value">
                  {anchorInfo?.verify_status === 0
                    ? '基础信息已完善'
                    : anchorInfo?.verify_status === 1
                    ? '审核中'
                    : anchorInfo?.verify_status === 2
                    ? '审核通过'
                    : '审核不通过'}
                </p>
              </div>
              <div class="line-add-by">
                <span class="label-name">创建人：</span>
                <p class="label-value">{anchorInfo?.add_by ? anchorInfo?.add_by : '--'}</p>
              </div>
              <div class="line-add-by">
                <span class="label-name">维护人：</span>
                <p class="label-value">{anchorInfo?.maintainer ? anchorInfo?.maintainer : '--'}</p>
                {this.permission.save_anchor_maintainer && (
                  <tg-button class="mgl-12" type="link" onclick={this.handleMaintainClick}>
                    {anchorInfo?.maintainer_id ? '变更' : '新增'}
                  </tg-button>
                )}
              </div>
              <div class="line-add-by">
                <span class="label-name">创建时间：</span>
                <p class="label-value">
                  {anchorInfo?.gmt_create ? anchorInfo?.gmt_create.replace(/-/g, '.') : '--'}
                </p>
              </div>
              <div class="line-add-by">
                <span class="label-name">审核人：</span>
                <p class="label-value">{anchorInfo?.verify_by ? anchorInfo?.verify_by : '--'}</p>
              </div>
              <div class="line-add-by">
                <span class="label-name">审核时间：</span>
                <p class="label-value">
                  {anchorInfo?.verify_time ? anchorInfo?.verify_time.replace(/-/g, '.') : '--'}
                </p>
              </div>
            </div>
          </article>
          {this.tabs.length > 0 && (
            <div class="page-content">
              <tg-tabs
                class="tab-box"
                tabs={this.tabs}
                v-model={this.checkedTab}
                onChange={this.onTabChange}
              />
              <div class="page-content-container">
                {this.checkedTab === 'liveExperience' ? (
                  <liveExperience info={this.anchorInfo} onCaseOpen={this.onCaseOpenHandler} />
                ) : (
                  <this.checkedTab
                    operation={this.operation}
                    info={this.anchorInfo}
                    ref="currentShowTabRef"
                  />
                )}
              </div>
            </div>
          )}
          {this.tabs.length === 0 && (
            <empty-common
              style="line-height: 100%;text-align: center;width: 100%;padding-top: 20%;background: white;"
              detail-text={'暂无权限查看'}
            ></empty-common>
          )}
        </div>
        <live-case
          visible={this.caseVisible}
          liveCase={this.showCase}
          onDialogClose={this.onDialogCloseHandler}
        />
        <maintainer ref="maintainerRef" onsave={this.reload}></maintainer>
        <dialogImageView ref="dialogImageViewRef" />
        <anchorAgreementDialog ref="addAnchorTemplateContractRef" onAdded={() => this.reload()} />
      </div>
    );
  },
});
