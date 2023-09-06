<template>
  <div class="medium-detail-wrapper" v-loading="detailLoading">
    <div class="common-block-wrapper">
      <div class="detail-title">
        <i class="el-icon-arrow-left" @click="$router.back()"></i>
        <span class="title-text" @click="$router.back()">公司详情</span>
        <span class="importer">录入人：{{ companyForm.add_by || '--' }}</span>
        <span v-if="Permission.canEdit" class="icon-item" @click="editCompany">
          <el-tooltip content="编辑公司详情" placement="top" effect="light">
            <tg-icon name="ico-edit" style="font-size: 18px" />
          </el-tooltip>
        </span>
        <span v-if="Permission.canDelete" class="icon-item" @click="delCompany">
          <el-tooltip content="删除公司" placement="top" effect="light">
            <tg-icon name="ico-delete" style="font-size: 18px; margin: 0 15px" />
          </el-tooltip>
        </span>
      </div>
      <div class="detail-content">
        <el-row class="content-box">
          <el-col :span="9" class="company-box">
            <div class="logo-box">
              <img
                class="logo"
                v-if="companyForm.logo"
                :src="fixFileToken(companyForm.logo, false)"
                alt=""
              />
              <img class="logo" v-else src="../../assets/img/company_img.png" alt="" />
            </div>
            <div class="text-box">
              <p class="name">{{ companyForm.name }}</p>
              <p class="contact-text">
                <span class="key">联系人：</span>
                <span class="value">
                  {{ companyForm.contact_person || defaultVal }}
                  <template v-if="companyForm.contact_no"
                    >（{{ companyForm.contact_no }} ）</template
                  >
                </span>
                <!-- <span class="value" v-else>{{defaultVal}}</span> -->
              </p>
              <p class="contact-text">
                <span class="key">微信号：</span>
                <span class="value" v-if="companyForm.wechat">{{ companyForm.wechat }}</span>
                <span class="value" v-else>{{ defaultVal }}</span>
              </p>
              <p class="contact-text">
                <span class="key">邮箱：</span>
                <span class="value" v-if="companyForm.contact_email">{{
                  companyForm.contact_email
                }}</span>
                <span class="value" v-else>{{ defaultVal }}</span>
              </p>
              <p class="contact-text">
                <span class="key">地址：</span>
                <span class="value" v-if="addrDetail">{{ addrDetail }}</span>
                <span class="value" v-else>{{ defaultVal }}</span>
              </p>
            </div>
          </el-col>
          <el-col :span="7" class="category-box">
            <p class="category-title">擅长领域</p>
            <ul class="category-list">
              <li class="item" v-for="item in areas" :key="item">{{ item }}</li>
            </ul>
          </el-col>
          <el-col :span="7" class="category-box">
            <div class="category-title">擅长平台</div>
            <ul class="category-list">
              <li class="item" v-for="item in platforms" :key="item">{{ item }}</li>
            </ul>
          </el-col>
        </el-row>
        <div class="file-box">
          <span class="title" v-if="quotationName">报价单：</span>
          <i class="icon-link" v-if="quotationName"></i>
          <span class="file-name" v-if="quotationName" @click="previewFile">{{
            quotationName
          }}</span>
          <i class="icon-ticket" v-if="companyForm.special_ticket"></i>
          <span class="ticket-text" v-if="companyForm.special_ticket">提供专票</span>
          <span class="flex-block"></span>
          <div v-if="quotationName">
            <a
              @click.stop
              :href="fixFileToken(companyForm.quotation, false)"
              download
              target="_blank"
              ><el-button type="primary" size="small">下载报价单</el-button></a
            >
          </div>
        </div>
      </div>
    </div>
    <div class="common-block-wrapper introduction-wrapper">
      <div class="introduction-title">公司介绍</div>
      <div
        class="introduction-content"
        v-if="
          companyForm.description ||
          (companyForm.description_content && companyForm.description_content.length > 0)
        "
      >
        <div
          class="introduction-text"
          v-html="companyForm.description.replace(/\n/g, '<br>')"
        ></div>
        <div
          class="introduction-img"
          style="padding-top: 10px"
          v-if="companyForm.description_content && companyForm.description_content.length > 0"
        >
          <div
            style="padding-bottom: 20px; min-height: 50px"
            v-for="item in companyForm.description_content"
            :key="item"
          >
            <img :src="fixFileToken(item, false)" alt="" loading="lazy" />
          </div>
        </div>
      </div>
      <div
        class="content-loading"
        v-else-if="companyForm.description_file && companyForm.description_content.length === 0"
      >
        数据上传中，请稍后刷新查看
      </div>
      <div class="content-none-data" v-else>
        <div class="img"></div>
        <div class="text">空空如也~</div>
      </div>
    </div>
    <add-company
      v-if="companyVisible"
      @close="close"
      @save="saveCompany"
      :companyForm="companyFormEdit"
      :id="id"
    ></add-company>
  </div>
</template>

<script>
import { companyDetail, deleteCompany } from '@/api/medium';
import { categoryList, cooperationPlatformList } from '@/utils/format';
import { fixFileToken } from '@/utils/http';
import addCompany from './components/addCompany';
import { RouterNameSupplier } from '@/const/router';
import { RIGHT_CODE as NEW_RIGHT_CODE } from '@/const/rightCode';
import { HasPermission } from '@/use/permission';
import { computed } from '@vue/composition-api';

export default {
  name: 'mediumDetail',
  props: {
    id: Number,
  },
  setup(props, ctx) {
    /** 权限检查 */
    const Permission = computed(() => {
      const canEdit = HasPermission(NEW_RIGHT_CODE.company_edit);
      const canDelete = HasPermission(NEW_RIGHT_CODE.company_delete);

      return {
        canEdit,
        canDelete,
      };
    });
    return { Permission };
  },
  data() {
    return {
      detailLoading: false,
      categoryList,
      cooperationPlatformList,
      companyForm: {
        add_by: '',
        name: '',
        areas: '',
        platforms: '',
        logo: '',
        special_ticket: '',
        province: '',
        city: '',
        county: '',
        address: '',
        // 报价单
        quotation: '',
        contact_person: '',
        contact_no: '',
        contact_email: '',
        description_file: '',
        description: '',
      },
      companyFormEdit: null,
      companyVisible: false,
      defaultVal: '--',
    };
  },
  computed: {
    areas() {
      return this.companyForm.areas.split(',').map(item => this.categoryList[item]) || [];
    },
    platforms() {
      // 1,2,3转换成淘宝，抖音,微博
      let ret = [];
      if (this.companyForm.platforms) {
        ret = this.companyForm.platforms.split(',').map(item => {
          const arr = this.cooperationPlatformList.filter(obj => {
            return obj.type === parseInt(item, 10);
          });
          return arr[0].value;
        });
      }
      return ret;
    },
    addrDetail() {
      return (
        this.companyForm.province +
        this.companyForm.city +
        this.companyForm.county +
        this.companyForm.address
      );
    },
    quotationName() {
      const arr = this.companyForm.quotation.split('/');
      return arr[arr.length - 1];
    },
  },
  created() {
    if (this.$route.params.id) {
      this.companyDetail();
    } else {
      console.log(123456);
    }
  },
  methods: {
    companyDetail() {
      this.detailLoading = true;
      const params = {
        companyId: this.id,
      };
      companyDetail(params)
        .then(res => {
          this.detailLoading = false;
          if (res.data.success) {
            const data = res.data.data;
            this.companyForm = data;
          }
        })
        .catch(() => {
          this.detailLoading = false;
        });
    },
    editCompany() {
      this.companyFormEdit = JSON.parse(JSON.stringify(this.companyForm));
      this.companyVisible = true;
    },
    delCompany() {
      this.$confirm('此操作将删除该公司数据, 是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        iconClass: 'warning-icon',
      }).then(() => {
        const params = {
          ids: this.id,
        };
        deleteCompany(params).then(res => {
          if (res.data.success) {
            this.$router.push({
              name: RouterNameSupplier.list,
            });
          } else {
            this.$gmMessage(res.data.message, 'tip');
          }
        });
      });
    },
    close() {
      this.companyVisible = false;
    },
    saveCompany() {
      this.companyVisible = false;
      this.companyDetail();
    },
    previewFile() {
      if (this.companyForm.quotation) {
        const url = this.companyForm.quotation;
        const arr = ['.doc', '.ppt', '.xls'];
        const wrUrl =
          'https://view.officeapps.live.com/op/view.aspx?src=' +
          encodeURIComponent(this.fixFileToken(url, false));
        if (url.includes(arr[0]) || url.includes(arr[1]) || url.includes(arr[2])) {
          if (this.companyForm.quotation_size < 5) {
            window.open(wrUrl);
          } else {
            this.$message({
              message: '该文件过大（超过5M），请下载后查看！',
              type: 'warning',
            });
          }
        } else {
          window.open(this.fixFileToken(url, false));
        }
      }
    },
    downloadQuotation() {
      if (this.companyForm.quotation) {
        window.open(this.fixFileToken(this.companyForm.quotation, false));
      }
    },
    fixFileToken,
  },
  components: {
    addCompany,
  },
};
</script>

<style lang="scss" scoped>
$color-primary: var(--theme-color);
.medium-detail-wrapper {
  min-width: 1014px;
  .detail-title {
    height: 54px;
    border-bottom: 1px solid #f5f5f5;
    padding: 0 0 0 12px;
    background: #fff;
    display: flex;
    .el-icon-arrow-left {
      font-size: 18px;
      margin-top: 19px;
      color: var(--text-des-color);
      cursor: pointer;
    }
    .title-text {
      padding: 19px 0 0 10px;
      line-height: 1.1;
      font-size: 16px;
      color: #666;
      font-weight: 600;
      cursor: pointer;
    }
    .importer {
      margin-left: 30px;
      color: var(--text-des-color);
      font-size: 12px;
      flex: 1;
      line-height: 54px;
    }
    .icon-item {
      // width: 56px;
      line-height: 54px;
      text-align: center;
      i {
        margin-top: 10px;
      }
    }
  }
  .detail-content {
    padding-top: 20px;
    .company-box {
      padding: 0 0 0 20px;
      display: flex;
      box-sizing: border-box;
      height: 127px;
      .logo-box {
        width: 126px;
        height: 126px;
        .logo {
          display: block;
          width: 100%;
          height: 100%;
          border-radius: 2px;
        }
      }
      .text-box {
        margin-left: 16px;
        flex: 1;
        .name {
          color: var(--text-color);
          font-size: 20px;
          line-height: 1;
          margin-bottom: 13px;
        }
        .contact-text {
          font-size: 12px;
          .key {
            color: var(--text-des-color);
          }
          .value {
            color: #666;
            line-height: 28px;
          }
        }
      }
    }
    .category-box {
      padding: 0 0 0 20px;
      box-sizing: border-box;
      border-left: 1px dashed #ebebeb;
      // height: 127px;
      min-height: 140px;
      .category-title {
        color: #666;
        line-height: 1;
      }
      .category-list {
        margin-top: 20px;
        .item {
          display: inline-block;
          background: #f2f2f2;
          height: 24px;
          padding: 0 15px;
          line-height: 24px;
          border-radius: 2px;
          margin-right: 10px;
          margin-bottom: 10px;
          color: #666;
        }
      }
    }
    .file-box {
      margin-top: 20px;
      border-top: 1px solid #f5f5f5;
      padding: 0 20px;
      height: 50px;
      display: flex;
      align-items: center;
      background: #fbfbfb;
      .title {
        color: #666;
      }
      .icon-link {
        margin-left: 14px;
        width: 16px;
        height: 14px;
        background: url('../../assets/img/file_icon.png') no-repeat;
      }
      .file-name {
        cursor: pointer;
        margin-left: 6px;
        color: $color-primary;
      }
      .icon-ticket {
        margin-left: 12px;
        width: 14px;
        height: 11px;
        background: url('../../assets/img/zhuanpiao_icon.png') no-repeat;
      }
      .ticket-text {
        margin-left: 4px;
        color: var(--text-third-color);
        font-size: 12px;
      }
      .flex-block {
        flex: 1;
      }
    }
  }
  .introduction-wrapper {
    margin-top: 12px;
    .introduction-title {
      padding-left: 20px;
      height: 60px;
      line-height: 60px;
      color: var(--text-color);
      font-size: 16px;
      font-weight: 600;
    }
    .introduction-content {
      padding: 0 20px 20px;
      color: #666;
      font-size: 14px;
      line-height: 24px;
    }
    .introduction-img {
      margin-top: 30px;
      img {
        margin: 0 auto;
        display: block;
        max-width: 100%;
      }
    }
  }
  .content-loading {
    padding: 40px 0;
    text-align: center;
    color: #666;
    line-height: 30px;
    font-size: 16px;
  }
  .content-none-data {
    margin-top: 90px;
    padding-bottom: 200px;
    .img {
      margin: 0 auto;
      width: 126px;
      height: 96px;
      background: url('../../assets/img/mjk_nodata.png') no-repeat;
    }
    .text {
      margin: 20px auto 0;
      color: #a9a6aa;
      text-align: center;
    }
  }
}
</style>
