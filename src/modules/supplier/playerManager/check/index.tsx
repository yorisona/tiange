import { defineComponent, ref, computed, UnwrapRef, inject } from '@vue/composition-api';
import { RouterNameSupplier } from '@/const/router';
import { useParamsRouteTabs } from '@/use/tab';
import liveExperience from './liveExperience/index.vue';
import liveCase from '@/modules/supplier/playerManager/detail/liveExperience/liveCase.vue';
import otherInfo from './otherInfo/index.vue';
import supplierService, { GetAnchorKeyInfo } from '@/services/supplier';
import { useRouter } from '@/use/vue-router';
import { AnchorKeyType, IAnchorInfo, ICase } from '@/types/tiange/supplier';
import dialogImageView from '../common/dialogImageView/index.vue';
import dialogCheck from '../common/dialogCheck/index.vue';
import anchorAgreementDialog from '@/modules/customer/contract/form/anchorAgreementDialog.vue';
import { usePermission } from '@/use/permission';
import {
  AnchorKeyViewStatus,
  anchor_key_view_status,
  supplier_permission_info,
} from '../common/utils/utils';
import Vue from 'vue';
import { Tab } from '@/types/components/tabs';
export default defineComponent({
  components: {
    liveExperience,
    otherInfo,
    liveCase,
    dialogImageView,
    dialogCheck,
    anchorAgreementDialog,
  },
  setup(props, ctx) {
    const router = useRouter();
    const anchorInfo = ref<IAnchorInfo | undefined>();
    const dialogImageViewRef = ref<{ show: (...args: any) => void }>();
    const dialogCheckRef = ref<{ show: (...args: any) => void }>();
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
      ].filter(Boolean) as any,
      permission.supplier_anchor_view_experience
        ? 'liveExperience'
        : permission.supplier_anchor_other_base
        ? 'otherInfo'
        : '',
    );

    supplierService.GetAnchorDetail(anchor_id).then((res: any) => {
      anchorInfo.value = res;
      const index = res.cooperations.findIndex((item: any) => item.cooperation_status === 1);
      cooperationsInfo.value = index === -1 ? '未合作' : '合作中';
      if (res.images.length > 0) {
        anchorAvatar.value = res.images[0];
      }
    });

    const onDialogCloseHandler = () => {
      caseVisible.value = false;
    };

    const onCaseOpenHandler = (_case: ICase) => {
      caseVisible.value = true;
      showCase.value = _case;
    };

    const showTrialBroad = () => {
      if (!supplier_permission_info.supplier_kol_sign_contract) {
        ctx.root.$message.error('您没有发起正式签约权限');
        return;
      }
      if (anchorInfo.value?.verify_status !== 2) {
        ctx.root.$message.error('主播信息未通过审核，暂不允许签约');
        return;
      }
      addAnchorTemplateContractRef.value?.show(anchorInfo.value);
    };
    const showImages = () => {
      dialogImageViewRef.value?.show('查看照片', anchorInfo.value?.images);
    };
    const showCheck = () => {
      dialogCheckRef.value?.show();
    };
    const operation = {
      showTrialBroad,
    };

    const tabName = ref<string>('liveExperience');

    const onPreviousPage = () => {
      tabName.value = 'otherInfo';
      tabs.checkedTab.value = 'otherInfo';
    };
    const onNextPage = () => {
      tabName.value = 'liveExperience';
      tabs.checkedTab.value = 'liveExperience';
    };

    const checkPass = (params: {
      anchor_id: number | string;
      verify_status: number;
      verify_message?: string;
    }) => {
      supplierService.PostAnchorVerify(params).then((res: any) => {
        if (res.data.success) {
          ctx.root.$message.success('操作成功，即将返回主播列表');
          setTimeout(() => {
            ctx.root.$router.push({ name: RouterNameSupplier.player });
          }, 2000);
        } else {
          ctx.root.$message.error(res.data.message);
        }
      });
    };

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

    const handleShowWechatClick = () => {
      if (wechat.value || wechat.value === '') {
        return;
      }
      getAnchorKeyInfo();
    };

    const wechat = computed(() => anchorInfo.value?.wechat);

    const wechatShowStatus = anchor_key_view_status(anchorInfo, wechat);
    const routes = [{ title: '主播管理', name: RouterNameSupplier.player }, { title: '信息审核' }];
    const showBackTitleHandle = inject('showBackTitleHandle') as Function;
    showBackTitleHandle(routes);
    const onTabChange = async (sub_tab: Tab<string>) => {
      if (tabName.value === 'liveExperience') {
        tabs.checkedTab.value = 'liveExperience';
      } else {
        tabs.checkedTab.value = 'otherInfo';
      }
      await tabs.onTabChange(sub_tab);
      showBackTitleHandle(routes);
    };
    return {
      ...tabs,
      tabName,
      onTabChange,
      onNextPage,
      onPreviousPage,
      checkPass,
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
      showCheck,
      dialogCheckRef,
      dialogImageViewRef,
      currentShowTabRef,
      wechat,
      wechatShowStatus,
      handleShowWechatClick,
      addAnchorTemplateContractRef,
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
                <span>{anchorInfo?.flower_name}</span>
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
                {/* 微信号： <span class="text">{anchorInfo?.wechat}</span> */}
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
                      class="mgl-12"
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
                    onclick={this.showTrialBroad}
                    icon="ico-a-shenqinghezuo2x"
                    type="primary"
                  >
                    正式签约
                  </tg-button>
                </div>
              </div>
            </div>
          </article>
          <div class="page-content">
            <tg-tabs
              class="tab-box"
              tabs={this.tabs}
              v-model={this.tabName}
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
            <div class="fix-box">
              {this.tabName === 'liveExperience' ? (
                <el-button
                  onClick={() => {
                    this.$router.push({ name: RouterNameSupplier.player });
                  }}
                >
                  返回列表
                </el-button>
              ) : (
                ''
              )}

              {this.tabName === 'liveExperience' ? (
                <el-button type="primary" onClick={this.onPreviousPage}>
                  下一页
                </el-button>
              ) : (
                <el-button type="primary" onClick={this.onNextPage}>
                  上一页
                </el-button>
              )}
              {this.tabName === 'otherInfo' ? (
                <el-button onclick={this.showCheck}>未通过</el-button>
              ) : (
                ''
              )}
              {this.tabName === 'otherInfo' ? (
                <el-button
                  type="primary"
                  onClick={() => this.checkPass({ anchor_id: this.anchor_id, verify_status: 2 })}
                >
                  已通过
                </el-button>
              ) : (
                ''
              )}
            </div>
          </div>
        </div>
        <live-case
          visible={this.caseVisible}
          liveCase={this.showCase}
          onDialogClose={this.onDialogCloseHandler}
        />
        <dialogImageView ref="dialogImageViewRef" />
        <dialogCheck
          ref="dialogCheckRef"
          save={async (val: any) => {
            return Promise.resolve().then(async () => {
              const params = { anchor_id: this.anchor_id, verify_status: -1, ...val };
              return this.checkPass(params);
            });
          }}
        />
        <anchorAgreementDialog
          ref="addAnchorTemplateContractRef"
          onAdded={() => this.currentShowTabRef?.reload()}
        />
      </div>
    );
  },
});
