import { computed, defineComponent, PropType } from '@vue/composition-api';
import { AnchorKeyType, IAnchorInfo } from '@/types/tiange/supplier';
import utils from '@/utils';
import InvoiceImg from '@/modules/live/project/dialog/invoice';
import { getToken } from '@/utils/token';
import { AnchorKeyViewStatus, anchor_key_view_status } from '../../common/utils/utils';
import { GetAnchorKeyInfo } from '@/services/supplier';
import Vue from 'vue';
export default defineComponent({
  props: {
    info: Object as PropType<IAnchorInfo>,
  },
  setup(props, ctx) {
    const showImg = (url: string | undefined) => {
      if (url) {
        InvoiceImg.showDetail(url + '?Authorization=' + getToken());
      }
    };
    const anchorInfo = computed(() => props.info);
    const collection_phone = computed(() => anchorInfo.value?.collection_phone);

    const handleShowCollectionPhoneClick = () => {
      if (collection_phone.value || collection_phone.value === '') {
        return;
      }
      getAnchorKeyInfo();
    };
    const collectionPhoneShowStatus = anchor_key_view_status(anchorInfo, collection_phone);

    const getAnchorKeyInfo = async () => {
      const res = await GetAnchorKeyInfo({
        id: anchorInfo.value?.id,
        search_type: AnchorKeyType.Phone,
      });
      if (res.data.success) {
        if (anchorInfo.value) {
          if ('collection_phone' in anchorInfo.value) {
            anchorInfo.value.collection_phone = res.data.data.collection_phone;
          } else {
            Vue.set(anchorInfo.value, 'collection_phone', res.data.data.collection_phone);
          }
        }
      } else {
        ctx.root.$message.error(res.data.message);
      }
    };
    return {
      showImg,
      collection_phone,
      handleShowCollectionPhoneClick,
      collectionPhoneShowStatus,
    };
  },
  render() {
    return (
      <div class="other-info">
        <div class="columns structure-left-right">
          <div class="column ">
            <h1>基本信息</h1>
            <div class="block ">
              <span class="label">主播类型：</span>
              <div class="text">{this.info?.anchor_platform_label ?? '--'}</div>
              <span class="label">归属机构：</span>
              <div class="text">{this.info?.settlement_company_name ?? '--'}</div>
            </div>
          </div>
          <div class="column">
            <h1>期望薪资</h1>
            <div class="block experience">
              <span class="label">期望时薪：</span>
              <div class="text">{this.info?.hourly_wage_label ?? '--'}</div>
              <span class="label">综合薪资：</span>
              <div class="text">{this.info?.salary ?? '--'}</div>
            </div>
          </div>
        </div>

        <div class="division" />
        <div class="columns ">
          <div class="column structure-left-right">
            <h1>收款信息</h1>
            <div class="block ">
              <span class="label">账户姓名：</span>
              <div class="text">{this.info?.collection_bank_account ?? '--'}</div>
              <span class="label">开户支行：</span>
              <div class="text">{this.info?.collection_bank_name ?? '--'}</div>
              <span class="label">银行卡号：</span>
              <div class="text">{this.info?.collection_bank_no ?? '--'}</div>
              <span class="label">手机号：</span>
              {/* <div class="text">{this.info?.collection_phone ?? '--'}</div> */}
              <div class="text">
                {((this.collectionPhoneShowStatus === AnchorKeyViewStatus.ViewDirectly ||
                  this.collectionPhoneShowStatus === AnchorKeyViewStatus.ViewWithoutMask) &&
                  (this.collection_phone ? this.collection_phone : '--')) ||
                  ((this.collectionPhoneShowStatus === AnchorKeyViewStatus.ViewMask ||
                    this.collectionPhoneShowStatus === AnchorKeyViewStatus.None) &&
                    '*****')}
                {(this.collectionPhoneShowStatus === AnchorKeyViewStatus.ViewMask ||
                  this.collectionPhoneShowStatus === AnchorKeyViewStatus.ViewWithoutMask) && (
                  <tg-button
                    class="mgl-12"
                    type="link"
                    onclick={this.handleShowCollectionPhoneClick}
                  >
                    显示
                  </tg-button>
                )}
                {(this.collectionPhoneShowStatus === AnchorKeyViewStatus.ViewMask ||
                  this.collectionPhoneShowStatus === AnchorKeyViewStatus.ViewWithoutMask) && (
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
                      style="cursor: pointer; color: #a4b2c2;"
                    ></tg-icon>
                  </el-popover>
                )}
              </div>
            </div>
          </div>
          <div class="column imgs">
            <tg-image
              class={this.info?.bank_card_front ? 'show-img' : ''}
              src={this.info?.bank_card_front}
              onClick={() => this.showImg(this.info?.bank_card_front)}
            />
            <tg-image
              class={this.info?.bank_card_back ? 'show-img' : ''}
              src={this.info?.bank_card_back}
              onClick={() => this.showImg(this.info?.bank_card_back)}
            />
          </div>
        </div>
        <div class="division" />
        <div class="columns ">
          <div class="column structure-left-right">
            <h1>实名信息</h1>
            <div class="block ">
              <span class="label">身份证号：</span>
              <div class="text">{this.info?.id_card ?? '--'}</div>
            </div>
          </div>
          <div class="column imgs id-card">
            <tg-image
              class={this.info?.id_card_front ? 'show-img' : ''}
              src={this.info?.id_card_front}
              onClick={() => this.showImg(this.info?.id_card_front)}
            />
            <tg-image
              class={this.info?.id_card_back ? 'show-img' : ''}
              src={this.info?.id_card_back}
              onClick={() => this.showImg(this.info?.id_card_back)}
            />
          </div>
        </div>
        <div class="division " />
        <h1>合同</h1>
        <div class="block resume">
          {this.info?.contracts?.map((item, key) => {
            return (
              <fragments key={key}>
                <tg-icon name="ico-pdf" />
                <div class="text">{utils.basename(item)}</div>
                <a class="view" href={`${item}?Authorization=${getToken()}`} target="_blank">
                  下载
                </a>
                <div></div>
              </fragments>
            );
          })}
          {(this.info?.contracts?.length === 0 || !this.info?.contracts) && (
            <p style="color: var(--text-third-color)">暂无合同</p>
          )}
        </div>
      </div>
    );
  },
});
