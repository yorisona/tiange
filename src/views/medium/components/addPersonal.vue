<!--
 * @Description: file content
 * @Author: 尽夏
 * @Date: 2019-09-29 15:22:06
 * @LastEditTime: 2021-08-31 15:59:44
 * @LastEditors: 肖槿
 -->
<template>
  <div id="add-personal" class="tg-dialog-vcenter">
    <el-dialog
      :visible="visible"
      v-if="visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="990px"
      top="70px"
      @close="resetForm"
    >
      <template #title>
        <div :class="['kol-header', { edited: type === 'edit' }]">
          <span
            v-if="type !== 'edit'"
            :class="{ active: type === 'add' }"
            @click="handleDialogType('add')"
            >新增KOL</span
          >
          <span v-if="type === 'edit'" :class="{ active: type === 'edit' }">编辑KOL</span>
          <span
            v-if="type !== 'edit'"
            :class="{ active: type === 'import' }"
            @click="handleDialogType('import')"
            >批量导入</span
          >
        </div>
      </template>
      <el-form v-show="type !== 'import'" ref="kolForm" :model="kolform" label-width="120px">
        <div class="dialog-content">
          <div class="kol-info-container" v-for="(item, key) in kolComponents" :key="key">
            <component
              :is="item.components"
              :ref="item.components"
              :editForm="item.form"
              :title="item.title"
            />
          </div>

          <div class="box4">
            <div class="content-header">
              KOL 擅长平台 <i class="change-one">(至少选择一个平台)</i>
            </div>
            <div class="content-kol-info">
              <span>
                提示：保存平台所填数据前，请先确认是否已
                <span class="plantform">【勾选该平台】</span>，否则将不会保留该平台数据。
              </span>
            </div>
            <div class="content-body" style="width: 866px">
              <el-tabs type="border-card" v-model="platActive">
                <el-tab-pane v-for="plat in platformComponents" :key="plat.key">
                  <template #label>
                    <span>
                      <el-checkbox class="mr10" v-model="plat.checked"></el-checkbox>
                      {{ plat.name }}
                    </span>
                  </template>
                  <component
                    class="plants-class"
                    :is="plat.components"
                    :ref="plat.components"
                    :editForm="plat.form"
                  />
                </el-tab-pane>
              </el-tabs>
            </div>
          </div>
        </div>
      </el-form>
      <star-import-file
        v-show="type === 'import'"
        uploadText="KOL"
        uploadKey="kol"
        downloadSrc="/template/kol_upload_template.xlsx"
      />
      <div v-show="type !== 'import'" class="footer">
        <tg-button size="small" class="big-button close-btn" @click="resetForm">取消</tg-button>
        <tg-button
          type="primary"
          class="save-btn btn-blue big-button"
          size="small"
          @click="handleSubmitSave"
          >保存</tg-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { saveKol, getCompanyNameAndId } from '@/api/medium'; // updateKol
import { platformData, areaType } from '@/const/kolConst';
import { getToken } from '@/utils/token';
import { deepClone } from '@/utils/tools';
import {
  taobao,
  douyin,
  xhs,
  kuaishou,
  weibo,
  yizhibo,
  bili,
  wechat,
  kolBaseInfo,
  kolContact,
  kolBank,
  kolAli,
  kolPublic,
} from '@/views/medium/components/platform';

// 定义kol表单类
class Kolform {
  constructor() {
    this.kol_name = '';
    this.kol_tag = undefined;
    this.areas = []; // 擅长类目
    this.special_ticket = '';
    this.case = []; // kol案例
    this.contacts = '';
    this.contact_phone = '';
    this.contact_wechat = '';
    this.cooperation_brand = []; // 合作品牌
    this.bank_info = {
      // 银行卡信息
      bank_card_num: '',
      bank_name: '',
      real_name: '',
      id_number: '',
      phone: '',
      bank_card_pic: '',
      id_card_pic: '',
    };
    this.platforms = {}; // 平台信息
    // 给每个平台添加字段
    this.addField = function () {
      const platforms = {};
      platformData.forEach(function (plat) {
        platforms[plat.platformKey] = {};
        // 基础信息部分添加字段
        plat.baseInfo.forEach(info => {
          platforms[plat.platformKey][info.key] = '';
        });
        // 媒体信息添加字段
        plat.mediumTypeInfo.forEach(function (medium) {
          medium.info.forEach(function (info) {
            platforms[plat.platformKey][info.key] = '';
          });
          if (medium?.otherInfo) {
            medium.otherInfo.forEach(function (info) {
              platforms[plat.platformKey][info.key] = '';
            });
          }
        });
      });
      this.platforms = platforms;
    };
    this.addField();
  }
}

export default {
  name: 'AddPersonal',
  components: {
    taobao,
    douyin,
    xhs,
    kuaishou,
    weibo,
    yizhibo,
    bili,
    wechat,
    kolBaseInfo,
    kolContact,
    kolBank,
    kolAli,
    kolPublic,
  },

  data() {
    return {
      platformData: JSON.parse(JSON.stringify(platformData)),
      type: 'add',
      visible: false,
      platformComponents: [
        {
          name: '淘宝',
          key: 'tb',
          components: 'taobao',
          form: null,
          checked: true,
        },
        {
          name: '抖音',
          key: 'douyin',
          form: null,
          components: 'douyin',
          checked: false,
        },
        {
          name: '小红书',
          key: 'xhs',
          form: null,
          components: 'xhs',
          checked: false,
        },
        {
          name: '快手',
          key: 'kuaishou',
          form: null,
          components: 'kuaishou',
          checked: false,
        },
        {
          name: '微博',
          key: 'weibo',
          form: null,
          components: 'weibo',
          checked: false,
        },
        {
          name: '一直播',
          key: 'yizhibo',
          form: null,
          components: 'yizhibo',
          checked: false,
        },
        {
          name: '哔哩哔哩',
          key: 'bili',
          form: null,
          components: 'bili',
          checked: false,
        },
        {
          name: '微信公众号',
          key: 'wechat',
          form: null,
          components: 'wechat',
          checked: false,
        },
      ],
      kolComponents: [
        {
          title: 'KOL 基础信息',
          form: null,
          components: 'kolBaseInfo',
        },
        {
          title: '联系方式',
          form: null,
          components: 'kolContact',
        },
        {
          title: 'KOL 收款银行卡信息',
          form: null,
          components: 'kolBank',
        },
        {
          title: 'KOL 收款支付宝信息',
          form: null,
          components: 'kolAli',
        },
        {
          title: 'KOL 收款对公打款信息',
          form: null,
          components: 'kolPublic',
        },
      ],
      areas: areaType,
      categorySelection: {
        checkAll: false,
        isIndeterminate: false,
      },
      areasForm: [],
      // 提交后端的数据
      kolform: new Kolform(),
      // 允许修改淘宝直播
      tbliveCantBeModify: false,
      loading: false,
      platSelected: '',
      platActive: '',
      descriptionAccepts: ['docx', 'pdf', 'jpg', 'xlsx'],
      imageAccepts: ['jpg', 'jpeg'],
      // 机构下拉选项
      companyNameAndIdOption: [],
      platformTBIsSelect: false, // 淘宝平台是否选中
    };
  },
  methods: {
    getToken,
    // 切换弹窗面板
    handleDialogType(type) {
      this.type = type;
    },
    // 显示新增弹窗，供父组件调用，勿删
    show(kolInfo) {
      // const vm = this;

      // 传入详情，修改
      // debugger
      // 获取所属机构的选项
      this.getCompanyNameOptions();

      if (kolInfo) {
        kolInfo = deepClone(kolInfo);
        this.type = 'edit';
        // 赋值基本信息
        const kolform = JSON.parse(JSON.stringify(kolInfo.kol_info));
        if (kolform.areas === '') {
          kolform.areas = [];
        } else {
          const areasNameArr = kolform.areas.split('、');
          kolform.areas = areasNameArr.map(item => {
            if (this.areas.find(el => el.value === item)) {
              return this.areas.find(el => el.value === item).key;
            }
          });
        }
        kolform.case = kolform.case === '' ? [] : kolform.case.split(',');
        const { province, city, county } = kolform;
        kolform.areaObj = {
          province: province,
          city: city,
          county: county,
        };

        this.kolComponents.forEach((item, index) => {
          item.form = kolform;
          switch (index) {
            case 1:
              item.form = {
                contacts: kolform.contacts,
                contact_phone: kolform.contact_phone,
                contact_wechat: kolform.contact_wechat,
                contact_qq: kolform.contact_qq,
                areaObj: kolform.areaObj,
              };
              break;
            case 2:
              item.form = { ...kolform.bank_info };
              break;
            case 3:
              item.form = { ...kolform.alipay_info };
              break;
            case 4:
              item.form = { ...kolform.account_info };
              break;
            default:
              break;
          }
        });

        // 擅长平台
        this.platformComponents.forEach(el => {
          if (kolform.platforms.includes(el.key)) {
            this.$set(el, 'form', kolInfo[`kol_${el.key}_info`]);
            el.checked = true;
          } else {
            el.checked = false;
          }
        });
        if (kolInfo.kol_douyin_info) {
          const _dy = kolInfo.kol_douyin_info.douyin_type;
          if (kolInfo.kol_douyin_info && !Array.isArray(_dy)) {
            this.$set(kolInfo.kol_douyin_info, 'douyin_type', _dy ? _dy.split(',').sort() : []);
            kolInfo.kol_douyin_info.douyin_type.forEach((el, index) => {
              kolInfo.kol_douyin_info.douyin_type[index] = Number(el);
            });
          }
        }

        // 赋值活跃平台
        this.platformData.forEach((val, index) => {
          if (kolform.platforms.indexOf(val.platformKey) > -1) {
            if (val.platformKey === 'tb') {
              this.platformTBIsSelect = true;
            }
            val.platSelected = true;
            // 设置擅长平台中的第一个为激活状态
            if (this.platActive === '') {
              this.platActive = index.toString();
            }
          } else {
            val.platSelected = false;
          }
        });
      } else {
        this.type = 'add';
        if (this.type !== 'edit') {
          // document
          //   .getElementsByClassName('el-dialog__headerbtn')[0]
          //   .querySelector('i').style.position = 'absolute';
        }
      }
      this.visible = true;
    },

    // 提交保存
    async handleSubmitSave() {
      // 检测主播基础信息、联系方式、kol收款银行卡信息
      const baseForm = {};
      this.kolComponents
        .map(el => el.components)
        .forEach(el => {
          baseForm[el] = this.$refs[el][0].validate();
        });
      const kolResults = await Promise.all(Object.values(baseForm));

      const kolData = {};
      kolResults.forEach(el => {
        Object.assign(kolData, deepClone(el));
      });

      // 检测平台信息
      const prims = {};
      const platsResult = {};
      const plats = this.platformComponents.filter(el => el.checked); // 过滤已选平台
      if (plats.length === 0) {
        this.$message.warning('至少选择一个平台');
        return;
      }
      plats.forEach(el => {
        // 遍历已选平台
        prims[el.key] = this.$refs[el.components][0].validate(); // 取所有已校验的promise
        platsResult[el.key] = null; // platsResult['tb'] = null、['douyin'] = null
      });
      const platsData = await Promise.all(Object.values(prims)); // 获取平台内组件数据
      Object.keys(platsResult).forEach((el, index) => {
        platsResult[el] = platsData[index]; // platsResult['douyin'] = platsData[0]
      });
      if (Object.keys(platsResult).length === 0) return;
      kolData.areas = kolData.areas.length > 0 ? kolData.areas.join(',') : '';
      kolData.case = kolData.case.length > 0 ? kolData.case.join(',') : '';
      kolData.platforms = platsResult;
      saveKol(kolData)
        .then(res => {
          this.$message({
            type: res.data.success ? 'success' : 'warning',
            message: res.data.message,
            duration: 2000,
            showClose: true,
          });
          if (res.data.success) {
            this.resetForm();
            // 触发父组件事件
            if (this.type === 'add') {
              this.$emit('added');
            } else {
              this.$emit('edited');
            }
          }
        })
        .catch(err => {
          console.error(err);
        });
    },
    // 重置表单
    resetForm() {
      this.categorySelection.checkAll = false;
      this.categorySelection.isIndeterminate = false;
      this.platformData = JSON.parse(JSON.stringify(platformData));
      this.$refs['kolForm'].resetFields();
      this.kolform = new Kolform();
      this.platActive = '0';
      this.visible = false;
      this.$emit('cancel');

      if (this.type === 'add') {
        this.platformComponents.forEach(el => {
          this.$refs[el.components][0].resetForm();
        });
        this.kolComponents.forEach(el => {
          this.$refs[el.components][0].resetForm();
        });
      }
    },

    /**
     * 获取所属机构的下拉选项
     */
    getCompanyNameOptions() {
      getCompanyNameAndId()
        .then(res => {
          if (res.data.success) {
            this.$set(this, 'companyNameAndIdOption', res.data.data);
            // this.companyNameAndIdOption.unshift({
            //   company_id: 0,
            //   company_name: "请选择机构"
            // });
            this.$store.commit('customer/companyList', res.data.data);
          } else {
            this.$message({
              type: 'warning',
              message: res.data.message,
              duration: 1500,
              showClose: true,
            });
          }
        })
        .catch(err => {
          console.error(err);
        });
    },
  },
};
</script>

<style lang="less">
@charset 'utf-8';
</style>

<style lang="scss" scoped>
::v-deep .el-dialog {
  margin-bottom: 70px;
  // padding-bottom: 0;
}
.upload-btn {
  padding-left: 30px;
}

::v-deep .el-dialog__body {
  background: #f2f6f9;
  padding-bottom: 0;
}
.box1,
.kol-info-container {
  padding-top: 5px;
  background: #fff;
  border-radius: 10px;
  padding-bottom: 10px;
}
.kol-info-container {
  margin-bottom: 10px;
}
.box2 {
  padding-top: 5px;
  margin-top: 10px;
  background: #fff;
  border-radius: 10px;
  padding-bottom: 10px;
}
.box3 {
  padding-top: 5px;
  margin-top: 10px;
  background: #fff;
  border-radius: 10px;
  padding-bottom: 10px;
}
.box4 {
  padding-top: 5px;
  margin-top: 10px;
  background: #fff;
  border-radius: 10px;
  padding-bottom: 20px;
}
::v-deep .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner::after {
  border-color: #fff;
}
::v-deep .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
  background-color: #396fff;
}
::v-deep .el-tabs--border-card > .el-tabs__header {
  background: var(--table-thead-th-bg-color);
}
::v-deep .el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active {
  color: var(--text-color);
}
::v-deep .el-tabs--border-card > .el-tabs__header .el-tabs__item {
  color: var(--text-color);
}
#add-personal {
  ::v-deep .el-dialog__header {
    background-color: #f8f8f8;
    margin: 0;
    padding: 0;
    height: 50px;
    line-height: 50px;
    background: #f8f8f8;
    text-align: left !important;
    .el-dialog__headerbtn i {
      color: var(--text-color);
      top: -6px;
      right: -7px;
      font-size: 27px;
    }
    .kol-header {
      // top: 0;
      // left: 0;
      // width: 100%;
      // z-index: 2;
      height: 50px;
      line-height: 50px;
      background-color: #f2f6f9;
      span {
        display: inline-block;
        width: 120px;
        text-align: center;
        border-bottom: transparent solid 1px;
        cursor: pointer;
        color: var(--text-third-color);
        &.active {
          position: relative;

          &::after {
            display: block;
            content: '';
            width: 80%;
            height: 11px;
            border-radius: 6px;
            background: #ffce36;
            position: absolute;
            left: 10px;
            bottom: 14px;
            z-index: -1;
          }
        }
      }
    }
    span,
    i {
      font-size: 16px;
    }
  }
  ::v-deep .el-dialog__body {
    padding: 0;
    > .el-form {
      overflow: overlay;
      height: 550px;
    }
    .dialog-content {
      // max-height: 550px;
      // overflow-y: auto;
      // padding-bottom: 20px;
      .content-header {
        font-size: 14px;
        font-weight: 600;
        color: var(--text-color);
        height: 40px;
        // line-height: 44px;
        padding-left: 28px;
        padding-top: 11px;
        position: relative;
        span {
          font-weight: 600;
          font-size: 12px;
          span {
            color: red;
            font-weight: 600;
          }
        }
        i.change-one {
          font-style: normal;
          color: red;
          font-size: 12px;
        }
      }
      .content-kol-info {
        margin: 0 0 10px 50px;
        background: #f6f6f6;
        border-radius: 10px;
        width: 610px;
        height: 34px;
        text-align: center;
        line-height: 34px;
        font-size: 14px;
        span.plantform {
          color: red;
        }
      }
      .content-body {
        width: 720px;
        margin: 0 auto;
        .content-line {
          // height: 52px;
          line-height: 52px;
          .content-label {
            color: var(--text-color);
            display: inline-block;
            width: 205px;
            text-align: right;
            vertical-align: top;
            em {
              font-style: normal;
              color: #f26467;
              margin-right: 5px;
            }
          }
          .content-value {
            display: inline-block;
            width: 484px;
            .el-input__inner {
              border-radius: 2px;
            }
            .el-textarea__inner {
              border-radius: 2px;
            }

            // 活跃平台
            .category-name {
              color: #b8babe;
            }
            .platform-price {
              border: #e1e4eb solid 1px;
              .platform-price-title {
                line-height: 40px;
                background: #f6f7f9;
                padding: 0 11px;
                .platform-price-title-icon {
                  float: right;
                  line-height: 40px;
                  color: #c3c6d2;
                }
              }
              .platform-price-content {
                padding: 11px;
                padding-bottom: 0;
                line-height: initial;
                .slot-suffix {
                  line-height: 32px;
                  color: #c9cdd4;
                }
                .el-input__inner {
                  padding: 0;
                  padding-left: 10px;
                }
                .el-input {
                  margin-bottom: 10px;
                  // &:nth-last-child(1) {
                  //   margin: 0;
                  // }
                }
                // .cooperation-input {
                //   margin-bottom: 0;
                // }
              }
            }
            .last-row {
              margin-top: 10px;
            }
          }
        }
        //擅长平台box、
        .el-tabs--border-card {
          box-shadow: none;
          border-radius: 10px;
          .el-tabs__item {
            padding: 0 17px;
            &.is-active2 {
              color: #666;
            }
          }
        }
        .mechanism-warning {
          color: #ff8b3d;
          font-size: 12px;
          margin-left: 30px;
          margin-bottom: 20px;
          position: absolute;
          width: 244px;
          line-height: 1.5;
          top: 40px;
          left: -37px;
        }
        .mechanism-warning {
          color: #ff8b3d;
          font-size: 12px;
          margin-left: 30px;
          margin-bottom: 20px;
          position: absolute;
          width: 244px;
          line-height: 1.5;
          top: 40px;
          left: -37px;
        }
      }
    }
    .el-select {
      width: 237px;
    }
  }
  // ::v-deep .el-dialog__footer {
  //   padding: 20px 20px 10px;
  .footer {
    border-radius: 0 0 10px 10px;
    position: -webkit-sticky;
    position: sticky;
    bottom: 0;
    text-align: center;
    background: #f2f6f9;
    padding: 9px 0;
    z-index: 2020;
    .save-btn {
      margin-left: 18px;
    }
  }
  // }

  ::v-deep .el-form-item {
    margin-bottom: 8px;
    .el-input-group__append {
      padding: 0 6px;
      width: 50px;
      text-align: center;
      color: var(--text-third-color);
    }
  }

  // 擅长类目
  .sale-chance-wrap {
    background-color: #f6f6f6;
    padding: 5px 12px;
    line-height: 26px;
    margin: 10px 0;
    .chance-checkbox {
      margin: 8px 5px 0 0;
      min-width: 110px;
    }
  }
  //附件案例
  .fujian-list {
    display: inline-block;
    float: left;
    margin-right: 20px;
    line-height: 35px;
    i {
      color: var(--text-des-color);
    }
  }
  .height40 {
    height: 40px;
  }
  .line-height25 {
    line-height: 25px;
    width: calc(100% - 70px);
    float: right;
    margin-top: 0;
  }
  .grey-color {
    color: #cdcecf;
  }
  ::v-deep .has-img {
    .el-upload--picture-card {
      // width: 50%;
      border: none;
      background: none;
    }
  }
  ::v-deep .el-tabs--border-card > .el-tabs__content {
    padding: 15px 55px;
  }
  ::v-deep .el-upload--picture-card {
    width: 58px;
    height: 58px;
    line-height: 58px;
    margin-right: 10px;
    position: relative;
    img {
      // width: 100%;
      height: 100%;
    }
    .el-icon-error {
      position: absolute;
      top: -6px;
      right: -6px;
      font-size: 14px;
    }
  }
}
.mr10 {
  // padding-left: 30px;
  position: relative;
  i {
    position: absolute;
    top: 7px;
    left: 8px;
  }
}
::v-deep .el-input-group__append {
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
}
</style>
<style lang="scss">
.info-header {
  font-weight: 600;
  color: var(--text-color);
  height: 44px;
  line-height: 44px;
  border-bottom: #f5f5f5 solid 1px;
  margin: 0 -20px 0px;
  padding-left: 18px;
  position: relative;
}
.info-header:after {
  content: '';
  position: absolute;
  left: 5px;
  top: 14px;
  height: 16px;
  width: 4px;
  background-color: #396fff;
  border-radius: 2px;
}
.plants-class {
  .el-form--label-top {
    .el-form-item__label {
      padding: 0;
    }
  }
}
.kol-content-body form {
  width: 720px;
  margin: 0 auto;
}
.border-dashed {
  border: 1px dashed #d1d5e3;
  text-align: center;
  cursor: pointer;
  line-height: 40px;
  border-radius: 10px;
  color: #396fff;
  i {
    color: #396fff;
    margin-right: 10px;
  }
}
//已合作品牌
.content-value-box {
  &:first-child {
    border-top: 1px solid #ebebeb;
  }

  height: 32px;
  padding: 10px;
  border: 1px solid #ebebeb;
  border-top: none;
  .content-value {
    width: 100%;
    display: block;
    .icon-right {
      float: right;
      width: 70px;
      border-left: 1px solid #ebebeb;
      margin: -10px;
      text-align: center;
      line-height: 50px;
      height: 52px;
      i {
        margin: 10px;
      }
    }
    .el-icon-check {
      color: #09ae6a;
      font-size: 25px;
      cursor: pointer;
    }
  }
  .el-input {
    line-height: 32px;
    display: block;
    width: calc(100% - 71px);
  }
}
</style>
