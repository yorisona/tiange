<!--
 * @Author: 肖槿
 * @Date: 2022-01-07 11:44:24
 * @Description:
 * @LastEditors: 肖槿
 * @LastEditTime: 2022-01-19 14:25:22
 * @FilePath: \goumee-star-frontend\src\modules\datacenter\competitor\components\competitorDialog.vue
-->
<template>
  <el-dialog
    class="customer-dialog tg-dialog-vcenter-new"
    :visible="visible"
    width="940px"
    custom-class="competitor-add-dialog"
    title="管理竞品店铺"
    :close-on-click-modal="false"
    @close="onClose"
  >
    <div class="team-member-content">
      <el-alert title="添加的店铺为竞品店铺名称" type="warning" show-icon :closable="false" />
      <div class="dialog-competitor-dialog" v-if="shopList.length">
        <div class="shop-item-box" v-for="(item, idx) in shopList" :key="idx">
          <el-input
            class="shop-item"
            size="mini"
            v-model.trim="item.shop_name"
            maxlength="200"
            placeholder="请输入店铺名称"
            @blur="onShopBlur(item, idx)"
          >
            <el-select
              popper-class="el-select-popper-mini"
              slot="prepend"
              v-model="item.style"
              style="width: 104px"
              placeholder="类型"
            >
              <el-option
                v-for="(item, key2) in CompeteShopStyleOptions"
                :key="key2"
                :label="item.label"
                :value="item.value"
              />
              <tg-icon
                v-if="item.style !== undefined"
                slot="prefix"
                class="shop-item-select-prefix"
                :name="
                  item.style === CompeteShopStyle.QuickFashion
                    ? 'ico-icon_leixing_kuaishishang'
                    : item.style === CompeteShopStyle.LightLuxury
                    ? 'ico-icon_leixing_qingshe'
                    : item.style === CompeteShopStyle.Sports
                    ? 'ico-icon_leixing_yundong'
                    : item.style === CompeteShopStyle.Other
                    ? 'ico-icon_leixing_qita'
                    : ''
                "
              />
            </el-select>
          </el-input>
          <tg-icon name="ico-btn-delete" class="close" @click="deleteShop(idx)" />
        </div>
        <div class="shop-item-box">
          <tg-button icon="ico-btn-add" type="primary" @click="addShop">新增竞品</tg-button>
        </div>
      </div>
      <div v-else>
        <div class="dialog-competitor-dialog">
          <div class="shop-item">
            <tg-button icon="ico-btn-add" type="primary" @click="addShop">新增竞品</tg-button>
          </div>
        </div>
        <div class="empty-container-cctv">
          <empty-common detail-text="暂无竞品店铺"></empty-common>
        </div>
      </div>
    </div>
    <template #footer>
      <tg-button @click="onClose">取消</tg-button>
      <tg-button type="primary" @click="onSave" v-loading="postLoading">保存</tg-button>
    </template>
  </el-dialog>
</template>
<script src="./competitorDialog.ts"></script>
<style lang="less">
.dialog-competitor-dialog {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  padding: 18px 0px 18px 30px;
  grid-row-gap: 18px;
  .ico-btn-delete {
    color: var(--text-third-color);
  }
  .el-input-group__prepend {
    background-color: #ffffff;
    .el-input__prefix {
      left: 8px;
      display: flex;
      align-items: center;
      font-size: 14px;
    }
  }

  .shop-item-box {
    display: flex;
    align-items: center;

    .shop-item {
      width: 254px;
      margin-right: 6px;
      .el-input-group__prepend {
        width: 94px;
        .el-select {
          padding-left: 6px;
        }
      }
    }
    .close {
      font-size: 16px;
      cursor: pointer;
    }
  }
}
.empty-container-cctv {
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding: 90px 0 70px 0;
  align-items: center;
  & img {
    width: 240px;
    margin-bottom: 20px;
  }
  & .tac {
    width: 100%;
  }
}
.competitor-add-dialog {
  & .dialog-competitor-dialog {
    max-height: 400px;
    overflow-y: auto;
  }
}
</style>
