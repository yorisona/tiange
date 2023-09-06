<!--
 * @Description: kol详情弹窗
 * @Author: 白青
 * @Date: 2019-09-29 15:22:06
 * @LastEditTime: 2020-05-06 16:02:41
 * @LastEditors: 肖槿
 -->
<style lang="scss" scoped>
$color-primary: var(--theme-color);
::v-deep .el-dialog__body {
  background: #f2f6f9;
}
#personal-detail {
  min-width: 900px;
  ::v-deep .el-dialog__header {
    background-color: #f2f6f9;
    margin: 0;
    .el-dialog__headerbtn {
      top: 14px;
      right: 12px;
      font-size: 31px;
    }
    .title {
      height: 30px;
      line-height: 30px;
      font-size: 14px;
      color: var(--text-color);
      text-align: left;
      .tip-color {
        margin-left: 12px;
        font-size: 12px;
        color: var(--text-third-color) !important;
      }
      .oprate-btn {
        float: right;
        margin: -10px;
        position: absolute;
        right: 0;
        top: 76px;
        z-index: 2020;
        .icon-bianji:before {
          color: #396fff;
        }
        .icon-shanchu:before {
          color: #f05765;
        }
        .icon-btn {
          display: inline-block;
          width: 30px;
          text-align: center;
        }
      }
    }
  }
  ::v-deep .el-dialog__body {
    padding: 0;
  }
  .head_info {
    padding: 30px;
    border-radius: 10px;
    background-color: #fff;
    .avatar {
      border-radius: 100%;
      width: 90px;
      height: 90px;
      float: left;
      position: relative;
      margin-top: 10px;
      img {
        width: 100%;
        border-radius: 50%;
      }
      .level {
        position: absolute;
        bottom: -6px;
        left: 10px;
        border-radius: 12px;
        background: #ffb423;
        width: 70px;
        height: 24px;
        line-height: 24px;
        color: #fff;
        text-align: center;
        .iconzuanshi {
          margin-right: 5px;
          font-size: 13px;
        }
      }
    }
    .info-box {
      padding-left: 100px;
      .title {
        font-size: 18px;
        color: var(--text-color);
        font-weight: 600;
        line-height: 30px;
      }
      .el-tag {
        line-height: 24px;
        height: 24px;
        margin-right: 5px;
        background: #fff5e9;
        border: 1px solid rgba(255, 166, 123, 1);
        border-radius: 8px;
        color: #ff7d3e;
      }
      .iconyonghu {
        color: #ffa04c;
      }
      .iconshouji-copy {
        color: #4ca4ff;
      }
      .iconweixin {
        color: #52bd33;
      }
      .iconqq {
        color: #4ca4ff;
        font-size: 8px;
      }
      .icondizhi {
        color: #ffa04c;
        font-size: 8px;
      }
      .icon-zhuanpiao1-copy:before {
        content: '\E76D';
        color: #396fff;
        font-size: 12px;
        position: absolute;
        left: 1px;
        top: -7px;
      }
      .info-contact {
        .iconfont {
          margin-right: 5px;
        }

        span {
          margin-right: 10px;
        }
      }
      .special-ticket {
        font-size: 12px;
        position: relative;
        width: 90px;
        height: 24px;
        border-radius: 8px;
        border: 1px solid #d1d8db;
        padding: 3px 6px;
        padding-left: 16px;
        .icon {
          margin-right: 5px;
        }
      }
      .special-ticket2 {
        font-size: 12px;
        position: relative;
        width: 90px;
        height: 24px;
        border-radius: 8px;
        border: 1px solid #d1d8db;
        padding: 3px 6px;
        background: #fff;
        padding-left: 16px;
        color: #b2bbbf;
        .icon-zhuanpiao1-copy:before {
          content: '\E76D';
          color: #b2bbbf;
          font-size: 12px;
          position: absolute;
          left: 1px;
          top: -7px;
        }
        .icon {
          margin-right: 5px;
        }
      }
    }
    .brand-box {
      margin-left: 30px;
      .title {
        font-size: 14px;
        font-weight: 600;
        color: var(--text-color);
      }
      label {
        display: inline-block;
        line-height: 24px;
        height: 24px;
        background: #f2f2f2;
        border-radius: 2px;
        color: #666;
        padding: 0 10px;
        margin: 10px 10px 0 0;
      }
      .no-barnd {
        margin-top: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        img {
          width: 16px;
          height: 16px;
          margin-right: 5px;
        }
        span {
          color: #c2c7cc;
          font-size: 14px;
        }
      }
      .more {
        margin-top: 10px;
        color: $color-primary;
        cursor: pointer;
      }
    }
  }
  .no_case {
    margin: 0 20px;
    height: 150px;
    display: flex;
    flex-direction: column;
    font-size: 14px;
    justify-content: center;
    align-items: center;
    color: #c2c7cc;
    img {
      width: 41px;
      height: 48px;
    }
  }
  .show-label {
    p {
      line-height: 35px;
      color: var(--text-color);
      label {
        color: var(--text-des-color);
      }
    }
    .show-label-item {
      height: 165px;
      position: absolute;
      overflow: hidden;
      top: -20px;
    }
  }
  ::v-deep .el-card__header {
    padding: 10px;
    border-bottom: none;
  }
  ::v-deep .el-card__body {
    padding: 10px;
  }
  ::v-deep .el-card {
    border: none;
  }
  .box-card1 {
    margin-right: 5px;
    padding-bottom: 22px;
  }
  .box-card2 {
    margin-left: 5px;
    & .pay-info {
      display: inline-block;
      margin-right: 10px;
      cursor: pointer;
    }
    & .el-card__header {
      height: 20px !important;
    }
  }
  .box-card {
    margin-top: 10px;
    margin-bottom: 10px;
    border-radius: 10px;
    .list {
      border-bottom: 1px dashed #e8e8e8;
      line-height: 40px;
      cursor: pointer;
      &:last-child {
        border-bottom: none;
      }
      .iconfont {
        color: var(--text-des-color);
      }
    }
  }
  .id-card {
    width: 76px;
    height: 57px;
    margin-bottom: 10px;
    border-radius: 2px;
    position: relative;
    display: block;
    .tip {
      width: 100%;
      background: #000;
      border-radius: 0 0 10px 10px;
      opacity: 0.4;
      line-height: 20px;
      position: absolute;
      bottom: 0;
      color: #fff;
      text-align: center;
      font-size: 12px;
    }
    img {
      width: 100%;
      height: 100%;
      border-radius: 10px;
    }
  }

  .detail-tabs {
    line-height: 50px;
    // box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.04);
    .tabs {
      ul {
        height: 50px;
        &::after {
          content: '';
          display: block;
          clear: both;
        }
        li {
          float: left;
          padding: 0 20px;
          margin-right: 8px;
          background: #fff;
          border-radius: 10px;
          cursor: pointer;
          &.active {
            background: #fff;
            border-right: #efefef solid 1px;
            height: 51px;
            &:hover {
              background: #fff;
            }
            span {
              display: inline-block;
            }
          }
          &:hover {
            background: #f1f1f1;
          }
          span {
            margin-left: 1px;
            // display: none;
          }
          .iconfont {
            vertical-align: middle;
            font-size: 24px;
          }
        }
      }
      .platform-icon {
        display: inline-block;
        width: 28px;
        height: 24px;
        background-image: url(../../assets/img/platform_logo.png);
        background-repeat: no-repeat;
        vertical-align: middle;
        // &.tblive-icon {
        //   height: 22px;
        // }
        &.yizhibo-icon {
          background-position: 0 -24px;
        }
        &.tbvideo-icon {
          background-position: 0 -48px;
        }
        &.douyin-icon {
          background-position: 0 -72px;
        }
        &.bili-icon {
          background-position: 0 -96px;
        }
        &.kuaishou-icon {
          background-position: 0 -120px;
        }
        &.taobao-photo-icon {
          background-position: 0 -144px;
        }
        &.webo-icon {
          background-position: 0 -169px;
        }
        &.xhs-icon {
          background-position: 0 -193px;
        }
        &.wechat-icon {
          background-position: 0 -217px;
        }
      }
    }
    .tab-content {
      line-height: initial;
      .content-wrap {
        overflow: hidden;
        margin: 10px 0;
        border-radius: 10px;
        padding: 20px;
        background: #fff;
        border: 1px solid #f0f0f0;

        .kol-info {
          width: 58px;
          overflow: hidden;
          float: left;
          text-align: center;
          .avatar-wrap {
            vertical-align: middle;
            width: 58px;
            height: 58px;
            float: left;
            img {
              width: 58px;
              height: 58px;
              border-radius: 50%;
            }
          }
        }
      }
      .content-wrap-other {
        display: flex;
        justify-content: space-between;
        text-align: center;
        & .wrap-avatar {
          width: 240px;
          box-shadow: -10px -2px 15px -13px rgba(0, 0, 0, 0.1) inset;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        & .wrap-item {
          flex: 1;
          flex-wrap: wrap;
          border-left: 1px dashed #ebebeb;
          & .wrap-item-col {
            text-align: center;
            width: 226px;
            line-height: 32px;
            & .total {
              color: #396fff;
              font-size: 16px;
              font-weight: 900;
            }
            & .label {
              color: var(--text-third-color);
            }
          }
        }
        & img {
          height: 58px;
          width: 58px;
          border-radius: 50%;
        }
        & .dy_nickname {
          font-size: 16px;
          font-weight: 600;
          color: rgba(51, 51, 51, 1);
          line-height: 35px;
        }
        & .dy_id {
          font-size: 12px;
          font-weight: 400;
          color: rgba(102, 102, 102, 1);
          line-height: 20px;
        }
        & .dy_type {
          background: rgba(255, 85, 105, 0.1);
          padding: 1px 5px;
          font-size: 10px;
          color: rgba(255, 85, 105, 1);
          border: 1px solid rgba(255, 85, 105, 1);
          border-radius: 6px;
          margin-right: 3px;
        }
      }
      .medium-content {
        overflow: hidden;
        .medium-tab {
          background: #fff;
          width: 100%;
          height: 36px;
          border-radius: 10px;
          padding: 10px 0;
          li {
            width: 100px;
            height: 36px;
            line-height: 36px;
            margin-right: 2px;
            color: var(--text-third-color);
            float: left;
            text-align: center;
            cursor: pointer;
            // &.active {
            // }
          }
          .active::after {
            display: block;
            content: '';
            width: 60%;
            height: 11px;
            border-radius: 6px;
            background: #ffce36;
            position: absolute;
            left: 19px;
            bottom: 6px;
            z-index: -1;
          }
        }
        .medium-detail {
          border: 1px solid #f0f0f0;
          padding-bottom: 10px;
          .detail-text {
            padding: 20px 40px;
            background: #fff;
            line-height: 40px;
            margin-top: 10px;
            border-radius: 10px 10px 0 0;
            position: relative;
            .cooperation-tag {
              text-align: center;
              height: 16px;
              position: absolute;
              top: 20px;
              left: 0;
              .iconyihezuo {
                color: #ffb423;
                font-size: 80px;
              }
            }
          }
        }
        .el-rate-custmer div {
          display: inline-block;
          width: calc(100% - 58px);
          line-height: 8px;
        }
      }
      .data-info-wrap {
        float: left;
        width: calc(100% - 58px);
        display: flex;
        .koltag {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          .tagcon {
            margin-left: 15px;
            .tag {
              height: 20px;
              border: 1px solid rgba(180, 180, 180, 1);
              border-radius: 2px;
              text-align: center;
              font-size: 12px;
              font-weight: 400;
              padding: 2px 4px;
              margin-right: 3px;
              color: rgba(153, 153, 153, 1);
            }
            .iswarn {
              border: none;
              color: #fff;
              background: rgba(255, 180, 35, 1);
            }
          }
        }
        .kol-name2 {
          font-size: 16px;
          font-weight: 600;
          color: var(--text-color);
          line-height: 33px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          text-align: left;
          margin-left: 20px;
          width: 158px;
        }
        .kol-name {
          font-size: 16px;
          font-weight: 600;
          color: var(--text-color);
          line-height: 58px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          text-align: left;
          margin-left: 20px;
          width: 158px;
        }
        .tab-info {
          text-align: center;
          flex: 1;
          border-right: #ebebeb dashed 1px;
          &:nth-last-child(1) {
            border-right: none;
          }
          .tab-info-box {
            display: inline-block;
          }
          .info-value {
            font-size: 16px;
            color: #396fff;
            line-height: 30px;
          }
          .info-label {
            font-size: 14px;
            color: var(--text-des-color);
            line-height: 30px;
          }
        }
      }
      .detail-data {
        background: #fff;
        margin-top: 12px;
        .no-data {
          height: 220px;
          text-align: center;
          img {
            margin-top: 50px;
          }
          p {
            color: #a9a6aa;
            margin-top: 10px;
          }
        }
      }
    }
  }
}
.big-card {
  display: flex;
  justify-content: space-between;
}
</style>
<style>
.delete-kol-alert.el-message-box .el-message-box__content {
  height: initial;
}
.delete-kol-alert.el-message-box .el-message-box__content .el-message-box__message {
  top: 0;
}
.delete-kol-alert-red.el-message-box .el-message-box__content {
  height: initial;
}
.delete-kol-alert-red.el-message-box .el-message-box__content .el-message-box__message {
  top: 0;
  color: rgb(242, 100, 103);
}
</style>

<template>
  <div id="personal-detail" v-if="detail">
    <el-dialog
      :visible="visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="990px"
      @close="closeHandle()"
    >
      <template #title>
        <div class="title" style="position: relative">
          <div class="fl">
            <b>KOL详情</b>
            <span class="tip-color">录入人：{{ detail.kol_info.add_by }}</span>
          </div>
          <div v-if="detail" class="oprate-btn">
            <span
              v-if="$store.getters['user/getUserRole'].includes(RIGHT_CODE.update_kol)"
              class="icon-btn"
              @click="handleEditKolClick"
            >
              <i class="iconfont icon-bianji"></i>
            </span>
            <span
              v-if="$store.getters['user/getUserRole'].includes(RIGHT_CODE.del_kol)"
              class="icon-btn"
              @click="handleDeleteKolClick"
            >
              <i class="iconfont icon-shanchu"></i>
            </span>
          </div>
        </div>
      </template>
      <el-row class="head_info">
        <el-col :span="24" class="border-right">
          <div class="avatar">
            <img
              v-if="detail[activePlatformData.detailKey].avatar"
              :src="detail[activePlatformData.detailKey].avatar"
            />
            <img v-else src="/static/img/home_userdisplay_2.3477ced.png" />
            <div class="level">
              <i class="iconfont iconzuanshi"></i>
              {{ kolTag }}
            </div>
          </div>
          <div class="info-box show-label">
            <div class="title">{{ detail.kol_info.kol_name }}</div>
            <p>
              <label>擅长领域：</label>
              <span v-if="detail.kol_info.areas !== ''">
                <el-tag v-for="tag in detail.kol_info.areas.split('、')" :key="tag">{{
                  tag || '--'
                }}</el-tag>
              </span>
              <span v-else>--</span>
            </p>
            <p class="info-contact">
              <span>
                <label>联系方式：</label>
                <span>
                  <i class="iconfont iconyonghu"></i>
                  {{ detail.kol_info.contacts || '--' }}
                </span>
                <span>
                  <i class="iconfont iconshouji-copy"></i>
                  {{ detail.kol_info.contact_phone || '--' }}
                </span>
                <span>
                  <i class="iconfont iconweixin"></i>
                  {{ detail.kol_info.contact_wechat || '--' }}
                </span>
                <span>
                  <gm-icon name="qq" class="iconqq"></gm-icon>
                  {{ detail.kol_info.contact_qq || '--' }}
                </span>
                <span>
                  <gm-icon name="dizhi" class="icondizhi"></gm-icon>
                  {{
                    detail.kol_info.province + detail.kol_info.city + detail.kol_info.county || '--'
                  }}
                </span>
              </span>
              <span>
                <label>专票：</label>
                <span class="special-ticket" v-if="detail.kol_info.special_ticket === 1">
                  <i class="mr5 iconfont icon-zhuanpiao1-copy"></i>提供专票
                </span>
                <span class="special-ticket2" v-else-if="detail.kol_info.special_ticket === 0">
                  <i class="iconfont icon-zhuanpiao1-copy mr5" style="color: #a3a6a9"></i>不提供专票
                </span>
                <span v-else>--</span>
              </span>
            </p>
            <div style="display: flex">
              <label style="display: inline-block; width: 102px; line-height: 35px"
                >已合作品牌:</label
              >
              <div
                style="display: inline-block; white-space: pre-wrap; line-height: 35px"
                v-if="detail.kol_info.cooperation_brand.length > 0"
              >
                <template v-if="isShowAll" style="width: 600px">
                  <label
                    style="margin: 0 10px; line-height: 35px"
                    v-for="brand in detail.kol_info.cooperation_brand"
                    :key="brand"
                    v-show="brand !== ''"
                    >{{ brand }}</label
                  >
                  <!-- <div class="more" v-if="isShowAll" @click="isShowAll = false">
                  查看全部
                  <i class="iconfont iconxiangxia"></i>
                  </div>-->
                </template>
                <template v-else>
                  <label
                    v-for="brand in detail.kol_info.cooperation_brand"
                    :key="brand"
                    v-show="brand !== ''"
                    >{{ brand }}</label
                  >
                  <!-- <div
                  class="more"
                  v-if="!isShowAll && detail.kol_info.cooperation_brand.length > 8"
                  @click="isShowAll = true"
                >
                  收起
                  <img src="@/assets/img/kol/up.png" style="width: 16px; height: 16px;" alt srcset />
                  </div>-->
                </template>
              </div>
              <span v-else class="no-barnd">
                <!-- <img src="@/assets/img/kol/warn_icon.png" alt srcset /> -->
                <span style="line-height: 35px">--</span>
              </span>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row class="big-card">
        <el-col>
          <el-card class="box-card box-card1" shadow="never">
            <template #header>
              <div class="clearfix kol-card-header">
                <svg class="icon" aria-hidden="true">
                  <use xlink:href="#iconanlie" />
                </svg>
                <span class="color-3 font-weight-b">KOL案列</span>
              </div>
            </template>
            <div v-if="caseFileList().length > 0" style="margin: 0 20px; height: 150px">
              <div class="list" v-for="(file, index) in caseFileList()" :key="index">
                <a
                  :href="file.link + '?Authorization=' + getToken()"
                  target="_blank"
                  style="text-decoration: none"
                >
                  <i class="iconfont iconfujian mr5"></i>
                  <span class="brand-color">{{ file.fileName }}</span>
                  <i class="iconfont iconxiazai fr"></i>
                </a>
              </div>
            </div>
            <div v-else class="no_case">
              <img src="@/assets/img/kol/upload_icon.png" alt srcset />
              <p>还没有上传案列</p>
            </div>
          </el-card>
        </el-col>
        <el-col>
          <el-card class="box-card box-card2" shadow="never">
            <template #header>
              <div
                v-for="v in payInfoList"
                :key="v.key"
                class="clearfix kol-card-header pay-info"
                @click="currentPay = v.key"
              >
                <svg v-if="v.icon" class="icon" aria-hidden="true">
                  <use xlink:href="#iconbank" />
                </svg>
                <span :class="currentPay === v.key && 'font-weight-b'" class="color-3">{{
                  v.name
                }}</span>
              </div>
            </template>
            <div class="fr">
              <a
                class="id-card"
                v-if="detail.kol_info.bank_info.bank_card_pic"
                :href="detail.kol_info.bank_info.bank_card_pic + '?Authorization=' + getToken()"
                target="_blank"
              >
                <img
                  :src="detail.kol_info.bank_info.bank_card_pic + '?Authorization=' + getToken()"
                  alt
                />
                <div class="tip">银行卡照片</div>
              </a>
              <span v-else class="id-card">
                <img src="@/assets/img/default_img.png" alt />
                <div class="tip">暂无照片</div>
              </span>
              <a
                class="id-card"
                v-if="detail.kol_info.bank_info.id_card_pic"
                :href="detail.kol_info.bank_info.id_card_pic + '?Authorization=' + getToken()"
                target="_blank"
              >
                <img
                  :src="detail.kol_info.bank_info.id_card_pic + '?Authorization=' + getToken()"
                  alt
                />
                <div class="tip">身份证照片</div>
              </a>
              <span v-else class="id-card">
                <img src="@/assets/img/default_img.png" alt />
                <div class="tip">暂无照片</div>
              </span>
            </div>
            <div class="show-label" style="padding-right: 80px; position: relative; height: 155px">
              <div class="show-label-item" v-show="isBank">
                <p>
                  <label>银行卡号：</label>
                  {{ detail.kol_info.bank_info.bank_card_num || '--' }}
                </p>
                <p>
                  <label>开户行：</label>
                  {{ detail.kol_info.bank_info.bank_name || '--' }}
                </p>
                <p>
                  <label>手机号：</label>
                  {{ detail.kol_info.bank_info.phone || '--' }}
                </p>
                <p>
                  <label>真实姓名：</label>
                  {{ detail.kol_info.bank_info.real_name || '--' }}
                </p>
                <p>
                  <label>身份证号：</label>
                  {{ detail.kol_info.bank_info.id_number || '--' }}
                </p>
              </div>
              <div class="show-label-item" v-show="isAli">
                <p>
                  <label>支付宝姓名：</label>
                  {{
                    detail.kol_info.alipay_info ? detail.kol_info.alipay_info.alipay_account : '--'
                  }}
                </p>
                <p>
                  <label>支付宝账号：</label>
                  {{ detail.kol_info.alipay_info ? detail.kol_info.alipay_info.alipay_name : '--' }}
                </p>
              </div>
              <div class="show-label-item" v-show="isPublish">
                <p>
                  <label>银行卡号：</label>
                  {{
                    detail.kol_info.account_info
                      ? detail.kol_info.account_info.bank_card_number
                      : '--'
                  }}
                </p>
                <p>
                  <label>开户行：</label>
                  {{
                    detail.kol_info.account_info
                      ? detail.kol_info.account_info.bank_of_deposit
                      : '--'
                  }}
                </p>
                <p>
                  <label>公司名称：</label>
                  {{
                    detail.kol_info.account_info
                      ? detail.kol_info.account_info.collecting_company
                      : '--'
                  }}
                </p>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <div
        v-if="detail && detail.kol_info.platforms !== ''"
        v-loading="loading"
        class="detail-tabs"
      >
        <div class="tabs">
          <ul>
            <li
              v-if="detail['kol_tb_info']"
              :class="{ active2: activePlatformKey === 'kol_tb_info' }"
              @click="handlePlatformTabChange('kol_tb_info')"
            >
              <i class="iconfont icontaobao" style="color: #ff6600"></i>
              <span>淘宝</span>
            </li>
            <li
              v-if="detail['kol_douyin_info']"
              :class="{ active2: activePlatformKey === 'kol_douyin_info' }"
              @click="handlePlatformTabChange('kol_douyin_info')"
            >
              <i class="platform-icon douyin-icon"></i>
              <span>抖音</span>
            </li>
            <li
              v-if="detail['kol_xhs_info']"
              :class="{ active2: activePlatformKey === 'kol_xhs_info' }"
              @click="handlePlatformTabChange('kol_xhs_info')"
            >
              <i class="platform-icon xhs-icon"></i>
              <span>小红书</span>
            </li>
            <li
              v-if="detail['kol_kuaishou_info']"
              :class="{ active2: activePlatformKey === 'kol_kuaishou_info' }"
              @click="handlePlatformTabChange('kol_kuaishou_info')"
            >
              <i class="platform-icon kuaishou-icon"></i>
              <span>快手</span>
            </li>
            <li
              v-if="detail['kol_weibo_info']"
              :class="{ active2: activePlatformKey === 'kol_weibo_info' }"
              @click="handlePlatformTabChange('kol_weibo_info')"
            >
              <i class="platform-icon webo-icon"></i>
              <span>微博</span>
            </li>
            <li
              v-if="detail['kol_yizhibo_info']"
              :class="{ active2: activePlatformKey === 'kol_yizhibo_info' }"
              @click="handlePlatformTabChange('kol_yizhibo_info')"
            >
              <i class="platform-icon yizhibo-icon"></i>
              <span>一直播</span>
            </li>
            <li
              v-if="detail['kol_bili_info']"
              :class="{ active2: activePlatformKey === 'kol_bili_info' }"
              @click="handlePlatformTabChange('kol_bili_info')"
            >
              <i class="platform-icon bili-icon"></i>
              <span>哔哩哔哩</span>
            </li>
            <li
              v-if="detail['kol_wechat_info']"
              :class="{ active2: activePlatformKey === 'kol_wechat_info' }"
              @click="handlePlatformTabChange('kol_wechat_info')"
            >
              <i class="platform-icon wechat-icon"></i>
              <span>微信公众号</span>
            </li>
          </ul>
        </div>
        <div
          class="tab-content"
          v-if="detail && activePlatformData && detail[activePlatformData.detailKey]"
        >
          <div
            class="content-wrap clearfix"
            v-if="
              activePlatformData.detailKey !== 'kol_douyin_info' &&
              activePlatformData.detailKey !== 'kol_xhs_info'
            "
          >
            <div class="kol-info">
              <div class="avatar-wrap">
                <img :onerror="defaultImg" :src="detail[activePlatformData.detailKey].avatar" />
              </div>
            </div>
            <div class="data-info-wrap">
              <!-- 基础信息-->
              <div
                class="tab-info"
                v-for="info in activePlatformData.baseInfo"
                :key="info.detailKey"
                :style="{ flex: info.hasOwnProperty('name') ? '0.7' : '1' }"
              >
                <template v-if="info.hasOwnProperty('label')">
                  <template v-if="info.hasOwnProperty('name')">
                    <div
                      :class="{
                        koltag:
                          detail[activePlatformData.detailKey].is_partner === 1 ||
                          detail[activePlatformData.detailKey].is_certification === 1 ||
                          detail[activePlatformData.detailKey].is_original === 1,
                      }"
                    >
                      <div
                        :class="[
                          detail[activePlatformData.detailKey].is_partner === 1 ||
                          detail[activePlatformData.detailKey].is_certification === 1 ||
                          detail[activePlatformData.detailKey].is_original === 1
                            ? 'kol-name2'
                            : 'kol-name',
                        ]"
                      >
                        {{ detail[activePlatformData.detailKey][info.key] || '--' }}
                      </div>
                      <div
                        class="tagcon"
                        v-if="{
                          koltag:
                            detail[activePlatformData.detailKey].is_partner === 1 ||
                            detail[activePlatformData.detailKey].is_certification === 1 ||
                            detail[activePlatformData.detailKey].is_original === 1,
                        }"
                      >
                        <span
                          class="tag iswarn"
                          v-if="detail[activePlatformData.detailKey].is_partner === 1"
                          >品牌合作人</span
                        >
                        <span
                          class="tag iswarn"
                          v-if="detail[activePlatformData.detailKey].is_certification === 1"
                          >已认证</span
                        >
                        <span
                          class="tag"
                          v-if="detail[activePlatformData.detailKey].is_original === 1"
                          >原创</span
                        >
                      </div>
                    </div>
                  </template>
                  <div class="tab-info-box" v-else-if="info.hasOwnProperty('label')">
                    <p class="info-value" v-if="info.key !== 'company_id'">
                      {{
                        detail[activePlatformData.detailKey][info.key] === ''
                          ? '--'
                          : detail[activePlatformData.detailKey][info.key]
                      }}
                    </p>
                    <p class="info-value" v-if="info.key === 'company_id'">
                      <el-popover
                        placement="top-start"
                        trigger="hover"
                        width="150"
                        visible-arrow="false"
                        popper-class="personal-library-active-platform-popover personal-library-public-popover"
                        :disabled="
                          detail[activePlatformData.detailKey]['company_name'].length <= 10
                        "
                      >
                        <div style="text-align: center; width: 100%">
                          <span style="text-align: center">{{
                            detail[activePlatformData.detailKey]['company_name'] || '--'
                          }}</span>
                        </div>
                        <template slot="reference">
                          <span>
                            <template
                              v-if="
                                detail[activePlatformData.detailKey]['company_name'].length > 10
                              "
                              >{{
                                detail[activePlatformData.detailKey]['company_name'].substring(
                                  0,
                                  10,
                                ) + '...'
                              }}</template
                            >

                            <template v-else>{{
                              detail[activePlatformData.detailKey]['company_name'] || '--'
                            }}</template>
                          </span>
                        </template>
                      </el-popover>
                    </p>
                    <p class="info-label">
                      {{ info.label }}
                      <span
                        v-if="
                          info.key === 'company_id' &&
                          !detail[activePlatformData.detailKey]['is_company_exist'] &&
                          detail[activePlatformData.detailKey]['company_name'] !== ''
                        "
                        style="font-size: 12px; color: red; font-weight: 400"
                        >(该机构未录入到公司库)</span
                      >
                    </p>
                  </div>
                </template>
              </div>
            </div>
          </div>
          <div
            class="content-wrap-other content-wrap clearfix"
            v-else-if="activePlatformData.detailKey === 'kol_douyin_info'"
          >
            <div class="wrap-avatar">
              <div>
                <img :onerror="defaultImg" :src="detail[activePlatformData.detailKey].avatar" />
                <p class="dy_nickname">{{ detail[activePlatformData.detailKey].douyin_name }}</p>
                <span class="dy_id"
                  >抖音号：{{ detail[activePlatformData.detailKey].douyin_id }}</span
                >
                <template v-if="detail[activePlatformData.detailKey].douyin_type">
                  <span class="dy_type" v-for="v in douyinTypeList" :key="v">{{
                    filterDouyinType(v)
                  }}</span>
                </template>
                <template v-else>
                  <span class="dy_type">--</span>
                </template>
              </div>
            </div>
            <div class="wrap-item">
              <div class="wrap-item-col">
                <p class="total">{{ detail[activePlatformData.detailKey].fans_number }}W</p>
                <p class="label">粉丝数</p>
              </div>
              <div
                class="wrap-item-col"
                v-if="!(detail[activePlatformData.detailKey].is_shopwindow === 1)"
              >
                <p class="total">
                  {{ filterYesOrno(detail[activePlatformData.detailKey].is_shopwindow) }}
                </p>
                <p class="label">是否可挂商品橱窗</p>
              </div>
              <div class="wrap-item-col" v-else>
                <p class="total">
                  {{ detail[activePlatformData.detailKey].shopwindow_price || '--' }}
                </p>
                <p class="label">商品橱窗上架价格</p>
              </div>
              <div class="wrap-item-col">
                <p class="total">
                  {{
                    detail[activePlatformData.detailKey].short_video_liver_price
                      ? detail[activePlatformData.detailKey].short_video_liver_price + '%'
                      : '--'
                  }}
                </p>
                <p class="label">短视频+直播打包坑位费</p>
              </div>
            </div>
            <div class="wrap-item">
              <div class="wrap-item-col">
                <p class="total">{{ detail[activePlatformData.detailKey].praise_number }}W</p>
                <p class="label">获赞数</p>
              </div>

              <div
                class="wrap-item-col"
                v-if="!(detail[activePlatformData.detailKey].is_pure_commission === 1)"
              >
                <p class="total">
                  {{ filterYesOrno(detail[activePlatformData.detailKey].is_pure_commission) }}
                </p>
                <p class="label">是否接受纯佣</p>
              </div>
              <div class="wrap-item-col" v-else>
                <p class="total">
                  {{ detail[activePlatformData.detailKey].pure_commission_min_percent || '--' }}
                </p>
                <p class="label">纯佣最低佣金比例</p>
              </div>
            </div>
            <div class="wrap-item">
              <div class="wrap-item-col">
                <p class="total">{{ companyOrPersonal }}</p>
                <p class="label">所属机构</p>
              </div>
              <div class="wrap-item-col">
                <p class="total">
                  {{
                    detail[activePlatformData.detailKey].package_price_min_percent
                      ? detail[activePlatformData.detailKey].package_price_min_percent + '%'
                      : '--'
                  }}
                </p>
                <p class="label">打包最低佣金比例</p>
              </div>
            </div>
          </div>
          <div
            class="content-wrap-other content-wrap clearfix"
            v-else-if="activePlatformData.detailKey === 'kol_xhs_info'"
          >
            <div class="wrap-avatar">
              <div>
                <img :onerror="defaultImg" :src="detail[activePlatformData.detailKey].avatar" />
                <p class="dy_nickname">{{ detail[activePlatformData.detailKey].xhs_name }}</p>
                <span class="dy_id"
                  >小红书号：{{ detail[activePlatformData.detailKey].xhs_id }}</span
                >
              </div>
            </div>
            <div class="wrap-item">
              <div class="wrap-item-col">
                <p class="total">{{ detail[activePlatformData.detailKey].fans_number }}W</p>
                <p class="label">粉丝数</p>
              </div>
              <div class="wrap-item-col">
                <p class="total">{{ detail[activePlatformData.detailKey].notes_number }}</p>
                <p class="label">笔记数</p>
              </div>
              <div class="wrap-item-col">
                <p class="total">
                  {{
                    detail[activePlatformData.detailKey].percent_rebate
                      ? detail[activePlatformData.detailKey].percent_rebate + '%'
                      : '--'
                  }}
                </p>
                <p class="label">返点数</p>
              </div>
            </div>
            <div class="wrap-item">
              <div class="wrap-item-col">
                <p class="total">{{ detail[activePlatformData.detailKey].praise_collection }}W</p>
                <p class="label">获赞与收藏</p>
              </div>
              <div class="wrap-item-col">
                <p class="total">
                  {{
                    detail[activePlatformData.detailKey].image_text_percent
                      ? detail[activePlatformData.detailKey].image_text_percent + '%'
                      : '--'
                  }}
                </p>
                <p class="label">近半年发布图文笔记占比</p>
              </div>
              <div class="wrap-item-col">
                <p class="total">
                  {{ filterYesOrno(detail[activePlatformData.detailKey].is_partner) }}
                </p>
                <p class="label">是否品牌合作人</p>
              </div>
            </div>
            <div class="wrap-item">
              <div class="wrap-item-col">
                <p class="total">{{ companyOrPersonal }}</p>
                <p class="label">所属机构</p>
              </div>
              <div class="wrap-item-col">
                <p class="total">
                  {{
                    detail[activePlatformData.detailKey].video_percent
                      ? detail[activePlatformData.detailKey].video_percent + '%'
                      : '--'
                  }}
                </p>
                <p class="label">近半年发布图文笔记占比</p>
              </div>
            </div>
          </div>
          <div class="medium-content">
            <ul class="medium-tab">
              <li
                :class="{ active: activeMediumType === info.mediumName }"
                v-for="info in activePlatformData.mediumTypeInfo"
                @click="mediumHandle(info.mediumName)"
                :key="info.mediumName"
              >
                {{ info.mediumName }}
              </li>
            </ul>
            <div class="medium-detail">
              <el-row class="detail-text clearfix" v-if="activeMediumData">
                <!--已经合作-->
                <p
                  class="cooperation-tag"
                  v-if="
                    activePlatformKey === 'kol_tb_info' &&
                    detail['kol_tb_info'].is_cooperation === 1
                  "
                >
                  <i class="iconfont iconyihezuo"></i>
                </p>
                <!--分成左右模块-->
                <el-col :span="24" v-if="!isDouyin">
                  <el-col :span="6" v-for="medium in activeMediumData.info" :key="medium.key">
                    <template>
                      <span style="color: var(--text-third-color); font-size: 12px"
                        >{{ medium.label }}{{ medium.unit }}:</span
                      >
                      <!--有字典-->
                      <span
                        v-if="medium.dictionary"
                        style="color: var(--text-color); font-weight: 600; font-size: 16px"
                        >{{
                          filterValueToText(
                            detail[activePlatformData.detailKey][medium.key],
                            dictionary[medium.dictionary],
                          )
                        }}</span
                      >
                      <!--其他-->
                      <span
                        v-else
                        style="color: var(--text-color); font-weight: 600; font-size: 16px"
                        >{{
                          !detail[activePlatformData.detailKey][medium.key]
                            ? '--'
                            : detail[activePlatformData.detailKey][medium.key]
                        }}</span
                      >
                    </template>
                  </el-col>
                </el-col>
                <el-col :span="24" v-else-if="isDouyin">
                  <el-col :span="6" v-for="medium in douyinLive" :key="medium.key">
                    <template>
                      <span style="color: var(--text-third-color); font-size: 12px"
                        >{{ medium.label }}:</span
                      >
                      <span
                        v-if="
                          medium.key === 'is_special_commission' ||
                          medium.key === 'is_mix_commission'
                        "
                        style="color: var(--text-color); font-weight: 600; font-size: 16px"
                        >{{
                          detail[activePlatformData.detailKey][medium.key] === 0 ? '否' : '--'
                        }}</span
                      >
                      <span
                        v-else
                        style="color: var(--text-color); font-weight: 600; font-size: 16px"
                        >{{
                          !detail[activePlatformData.detailKey][medium.key]
                            ? '--'
                            : detail[activePlatformData.detailKey][medium.key]
                        }}</span
                      >
                    </template>
                  </el-col>
                </el-col>
                <el-col :span="24" v-if="activeMediumData.otherInfo">
                  <el-col :span="12" v-for="medium in activeMediumData.otherInfo" :key="medium.key">
                    <div
                      v-if="
                        (medium.showCondition &&
                          detail[activePlatformData.detailKey][medium.showCondition]) ||
                        !medium.showCondition
                      "
                    >
                      <span style="color: var(--text-third-color); font-size: 12px"
                        >{{ medium.label }}{{ medium.unit }}:</span
                      >
                      <!--有字典-->
                      <!--评分-->
                      <span v-if="medium.key === 'responsivity'" class="el-rate-custmer">
                        <el-rate
                          v-model="detail[activePlatformData.detailKey][medium.key]"
                          disabled
                        ></el-rate>
                      </span>

                      <!-- 客单价 -->
                      <span
                        v-else-if="medium.key === 'sales_price_period'"
                        style="color: var(--text-color); font-weight: 600; font-size: 16px"
                      >
                        <span v-if="detail[activePlatformData.detailKey][medium.key] === ''"
                          >--</span
                        >
                        <span v-else>{{
                          salesPriceOptions[detail[activePlatformData.detailKey][medium.key]].label
                        }}</span>
                      </span>

                      <!-- 【微博】直发是否原创报价 -->
                      <span
                        v-else-if="medium.key === 'is_direct_original'"
                        style="color: var(--text-color); font-weight: 600; font-size: 16px"
                        >{{
                          renderIsDirectOriginal(detail[activePlatformData.detailKey][medium.key])
                        }}</span
                      >
                      <!--其他-->
                      <span
                        v-else
                        style="color: var(--text-color); font-weight: 600; font-size: 16px"
                        >{{
                          detail[activePlatformData.detailKey][medium.key] === ''
                            ? '--'
                            : detail[activePlatformData.detailKey][medium.key]
                        }}</span
                      >
                    </div>
                  </el-col>
                </el-col>
              </el-row>
              <el-row style="margin-top: -10px">
                <!--淘宝直播界面-->
                <tb-live-detail
                  v-if="activePlatformKey === 'kol_tb_info' && activeMediumType === '直播'"
                  :starName="detail['kol_tb_info'].star_name"
                  :starId="detail['kol_tb_info'].star_id"
                ></tb-live-detail>
                <!--其他视频 图文界面-->
                <div v-else class="detail-data">
                  <div class="no-data">
                    <img src="@/assets/img/mjk_nodata_2.png" />
                    <p>更多数据敬请期待</p>
                  </div>
                </div>
              </el-row>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
    <add-personal ref="editKolDetailDialog" @edited="hanleKolEdited"></add-personal>
  </div>
</template>

<script>
import { queryKolList, deleteKol, getCompanyNameAndId } from '@/api/medium';
import addPersonal from './components/addPersonal';
import tbLiveDetail from './components/tbLiveDetail';
import { RIGHT_CODE } from '@/const/roleCode';
import { salesPriceOptions } from '@/const/options';
import * as dictionary from '@/const/kolConst';
import { getToken } from '@/utils/token';
import { douyinType, yesOrno, valueToText } from '@/utils/filter';

export default {
  name: 'PersonalDetail',
  components: {
    addPersonal,
    tbLiveDetail,
  },
  props: ['detailId'],
  data() {
    return {
      isShowAll: false,
      currentPay: 'bank_info',
      douyinLive1: {
        直播: [
          {
            label: '专场成本价(元/h)',
            key: 'live_special_price',
            isShow: true,
          },
          {
            label: '专场是否需要佣金',
            key: 'is_special_commission',
            isShow: true,
          },
          {
            label: '专场最低佣金比例(%)',
            key: 'special_commission_min_percent',
            isShow: true,
          },
          {
            label: '混播单链接成本价(元/链接)',
            key: 'live_mix_price',
            isShow: true,
          },
          {
            label: '混播场是否需要佣金',
            key: 'is_mix_commission',
            isShow: true,
          },
          {
            label: '混播场最低佣金比例(%)',
            key: 'mix_min_commission_percent',
            isShow: true,
          },
          {
            label: '专场刊例价(元 / h)',
            key: 'live_special_publish_price',
            isShow: true,
          },
          {
            label: '专场最高连接数(条)',
            key: 'special_max_url',
            isShow: true,
          },
          {
            label: '混播单链接刊例价(元/链接)',
            key: 'live_mix_publish_price',
            isShow: true,
          },
        ],
      },
      payInfoList: [
        {
          name: '收款银行卡信息',
          key: 'bank_info',
          icon: true,
        },
        {
          name: '收款支付宝信息',
          key: 'alipay_info',
        },
        {
          name: '收款对公打款信息',
          key: 'account_info',
        },
      ],
      salesPriceOptions,
      defaultImg: 'this.src="' + require('@/assets/img/home_userdisplay_2.png') + '"',
      dictionary: dictionary,
      RIGHT_CODE,
      loading: true,
      detail: null,
      visible: false,
      activePlatformKey: '',
      activePlatformData: null,
      activeMediumType: '',
      activeMediumData: null,
      platformOrder: [
        'kol_tb_info',
        'kol_yizhibo_info',
        'kol_douyin_info',
        'kol_bili_info',
        'kol_kuaishou_info',
        'kol_weibo_info',
        'kol_xhs_info',
        'kol_wechat_info',
      ],
      // 机构列表
      companyNameAndIdList: [],
    };
  },
  mounted() {
    if (this.detailId) {
      this.getPersonalKolDetail();
      this.getCompanyNameAndIdList();
    }
  },
  computed: {
    // 根据 kol_tag 字段，主播，红人，明显
    kolTag() {
      if (this.detail) {
        const kolTag = this.dictionary.kolTagList.find(
          item => item.value === this.detail.kol_info.kol_tag,
        );
        return kolTag ? kolTag.text : '--';
      } else {
        return '--';
      }
    },
    filterName() {
      return this.activePlatformData.baseInfo.filter(v => !v.name);
    },
    companyOrPersonal() {
      if (this.detail[this.activePlatformData.detailKey].is_personal) {
        return '个人';
      } else {
        const cn = this.companyNameAndIdList.find(
          v => v.company_id === this.detail[this.activePlatformData.detailKey].company_id,
        );
        return cn ? cn.company_name : '--';
      }
    },
    douyinTypeList() {
      if (!Array.isArray(this.detail[this.activePlatformData.detailKey].douyin_type)) {
        return this.detail[this.activePlatformData.detailKey].douyin_type.split(',');
      } else {
        return [];
      }
    },
    isAli() {
      return this.currentPay === 'alipay_info';
    },
    isPublish() {
      return this.currentPay === 'account_info';
    },
    isBank() {
      return this.currentPay === 'bank_info';
    },
    douyinLive() {
      // 副作用部分拆到下面两个计算属性和 watch 中去处理
      // 计算属性只计算返回数据，不修改原始数据
      /*
      if (this.detail[this.activePlatformData.detailKey]['is_special_commission'] === 1) {
        this.douyinLive1['直播'][1].isShow = false;
      } else {
        this.douyinLive1['直播'][2].isShow = false;
      }
      if (this.detail[this.activePlatformData.detailKey]['is_mix_commission'] === 1) {
        this.douyinLive1['直播'][4].isShow = false;
      } else {
        this.douyinLive1['直播'][5].isShow = false;
      }
       */
      return this.douyinLive1[this.activeMediumType].filter(v => v.isShow);
    },
    is_special_commission() {
      if (this.activePlatformData?.detailKey === undefined) {
        return false;
      }
      return this.detail[this.activePlatformData.detailKey]['is_special_commission'] === 1;
    },
    is_mix_commission() {
      if (this.activePlatformData?.detailKey === undefined) {
        return false;
      }
      return this.detail[this.activePlatformData.detailKey]['is_mix_commission'] === 1;
    },
    isDouyin() {
      return (
        this.activeMediumType === '直播' && this.activePlatformData.detailKey === 'kol_douyin_info'
      );
    },
  },
  methods: {
    getToken,
    filterDouyinType: douyinType,
    filterYesOrno: yesOrno,
    filterValueToText: valueToText,
    // 获取kol详情
    getPersonalKolDetail() {
      this.loading = true;
      queryKolList({
        kol_id: this.detailId,
      })
        .then(res => {
          if (res.data.success) {
            if (res.data.data.total !== 0) {
              // 赋值详情
              this.$set(this, 'detail', res.data.data.data[0]);
              if (this.detail.star_info) {
                this.detail['kol_tb_info'] = this.detail.star_info;
                //  && this.detail.kol_info.platforms.includes('tb_live')
              }
              // 赋值第一个激活的tab
              for (const str of this.platformOrder) {
                if (this.detail[str] && this.activePlatformKey === '') {
                  // 初始化平台
                  this.handlePlatformTabChange(str);
                  break;
                }
              }
            } else {
              this.$message({
                type: 'warning',
                message: '没有查询到该KOL的详情',
                duration: 2000,
                showClose: true,
              });
            }
          } else {
            this.$message({
              type: 'warning',
              message: res.data.message,
              duration: 2000,
              showClose: true,
            });
          }
          this.loading = false;
        })
        .catch(() => {
          this.$message({
            type: 'warning',
            message: 'KOL详情获取失败，请稍后重试',
            duration: 2000,
            showClose: true,
          });
          this.loading = false;
        });
    },
    // 处理地址信息
    renderAddress(detail) {
      if (
        !detail.kol_info.province &&
        !detail.kol_info.city &&
        !detail.kol_info.county &&
        !detail.kol_info.address
      ) {
        return '--';
      } else {
        return `${detail.kol_info.province}${detail.kol_info.city}${detail.kol_info.county}${detail.kol_info.address}`;
      }
    },
    // 平台tab切换
    handlePlatformTabChange(key) {
      this.activePlatformKey = key;
      this.activePlatformData =
        dictionary.platformData &&
        dictionary.platformData.filter(val => val.detailKey === this.activePlatformKey)[0];
      this.activePlatformData = this.rebindData(this.activePlatformData);
      // 初始化媒介
      this.mediumHandle(this.activePlatformData.mediumTypeInfo[0].mediumName);
    },
    rebindData(activePlatformData) {
      const newData = JSON.parse(JSON.stringify(activePlatformData));
      if (newData.platformKey === 'weibo') {
        const _cindex = newData.baseInfo.findIndex(c => c.key === 'is_partner');
        if (_cindex > -1) {
          newData.baseInfo.splice(_cindex, 1);
          return newData;
        }
      }
      if (newData.platformKey === 'xhs') {
        const _cindex = newData.baseInfo.findIndex(c => c.key === 'is_partner');
        if (_cindex > -1) {
          newData.baseInfo.splice(_cindex, 1);
          return newData;
        }
      }
      if (newData.platformKey === 'wechat') {
        const _cindex1 = newData.baseInfo.findIndex(c => c.key === 'is_original');
        if (_cindex1 > -1) newData.baseInfo.splice(_cindex1, 1);
        const _cindex2 = newData.baseInfo.findIndex(c => c.key === 'is_certification');
        if (_cindex2 > -1) newData.baseInfo.splice(_cindex2, 1);
        return newData;
      }
      return newData;
    },
    // 点击修改按钮
    handleEditKolClick() {
      this.$refs.editKolDetailDialog.show(this.detail);
    },
    // 点击删除按钮
    handleDeleteKolClick() {
      if (!this.detail) return false;
      if (this.detail.kol_info.allow_del === 1) {
        this.$confirm('此操作将删除该KOL, 是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          customClass: 'delete-kol-alert',
          center: true,
        })
          .then(() => {
            deleteKol({
              kol_ids: [this.detail.kol_info.kol_id],
            })
              .then(res => {
                this.$message({
                  type: res.data.success ? 'success' : 'warning',
                  message: res.data.message,
                  duration: 2000,
                  showClose: true,
                });
                if (res.data.success) {
                  this.closeHandle();
                }
              })
              .catch(() => {
                this.$message({
                  type: 'error',
                  message: 'KOL删除失败，稍后重试',
                  duration: 2000,
                  showClose: true,
                });
              });
          })
          .catch(() => {
            /* do nth */
          });
      } else {
        this.$alert('该KOL包含成本安排数据，不允许删除', '提示', {
          cancelButtonText: '取消',
          customClass: 'delete-kol-alert-red',
          center: true,
        }).catch(() => {
          /** do nth */
        });
      }
    },
    // 编辑修改成功之后的事件
    hanleKolEdited() {
      this.getPersonalKolDetail();
    },
    // 标记合作
    handleMarkCooperationClick() {
      /* do nth */
    },
    /**
     * 媒介切换处理
     * @param type
     */
    mediumHandle(type) {
      this.activeMediumType = type;
      this.activeMediumData =
        this.activePlatformData.mediumTypeInfo &&
        this.activePlatformData.mediumTypeInfo.filter(
          val => val.mediumName === this.activeMediumType,
        )[0];
    },
    /**
     *关闭时要把数据清空
     */
    closeHandle() {
      this.detail = null;
      // 触发父组件事件
      this.$emit('closed');
    },
    // kol 案例列表
    caseFileList() {
      if (this.detail && this.detail.kol_info.case) {
        // console.log(this.detail.kol_info)
        const caseArr = this.detail.kol_info.case.split(',');
        const list = caseArr.map(item => {
          const nameArr = item.split('/');
          return {
            fileName: nameArr[nameArr.length - 1],
            link: item,
          };
        });
        return list;
      } else {
        return [];
      }
    },
    // 获取机构列表
    getCompanyNameAndIdList() {
      getCompanyNameAndId()
        .then(res => {
          if (res.data.success) {
            this.companyNameAndIdList = res.data.data;
          } else {
            this.$message({
              type: 'warning',
              message: res.data.message,
              duration: 1500,
              showClose: true,
            });
          }
        })
        .catch(() => {
          /* do nth */
        });
    },
    // 显示【微博】是否直发是否原创报价
    renderIsDirectOriginal(value) {
      if (value === 1) {
        return '是';
      } else if (value === 0) {
        return '否';
      } else {
        return '--';
      }
    },
  },
  watch: {
    'detail.kol_info.cooperation_brand': function (nval) {
      if (nval && nval.length > 8) this.isShowAll = true;
      else this.isShowAll = false;
    },
    is_special_commission(val) {
      if (val === true) {
        this.douyinLive1['直播'][1].isShow = false;
      } else {
        this.douyinLive1['直播'][2].isShow = false;
      }
    },
    is_mix_commission(val) {
      if (val === true) {
        this.douyinLive1['直播'][4].isShow = false;
      } else {
        this.douyinLive1['直播'][5].isShow = false;
      }
    },
  },
};
</script>
