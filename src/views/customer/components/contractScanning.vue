<!--
 * @Description: 合同扫描件
 -->
<style lang="scss" scoped>
@import '@/styles/vars.scss';
@import '@/assets/scss/public.scss';
$color-primary: var(--theme-color);
::-webkit-scrollbar {
  display: none;
}
::-webkit-scrollbar {
  display: none;
}
#contract-scanning {
  max-height: 330px;
  overflow-x: hidden;
  overflow-y: auto;
  padding-bottom: 20px;
  li:last-child {
    border: none !important;
  }
  ul > li,
  ul > div > li {
    text-align: center;
    height: 50px;
    line-height: 50px;
    border-bottom: #e8e8e8 solid 1px;
    display: flex;
    justify-content: space-between;
    &:last-child(1) {
      border: none;
    }
    .item-name {
      width: 90px;
    }
    .item-title {
      width: 180px;
    }
    .item-status {
      width: 76px;
    }
    .item-oparete {
      width: 56px;
      display: flex;
      justify-content: space-evenly;
      a {
        font-size: 14px;
      }
      i {
        color: $color-primary;
        font-size: 14px;
      }
    }
    .item-name,
    img,
    a,
    em,
    .item-status-name {
      vertical-align: middle;
    }
    .file-link {
      cursor: pointer;
      text-decoration: none;
      color: $color-primary;
      display: inline-block;
      width: 170px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .status-dot {
      display: inline-block;
      width: 5px;
      height: 5px;
      border-radius: 50%;
      vertical-align: middle;
      margin-left: 30px;
      &.status-dot-1 {
        background-color: #ff8549;
      }
      &.status-dot-2 {
        background-color: #2877ff;
      }
      &.status-dot-3 {
        background-color: #f34b60;
      }
      &.status-dot-4 {
        background-color: #f34b60;
      }
      &.status-dot-5 {
        background-color: #aaa;
      }
    }
    .item-status-name {
      display: inline-block;
      width: 65px;
    }
    .download-link {
      color: var(--text-des-color);
      font-size: 20px;
      &:hover {
        color: #396fff;
      }
    }
    .preview {
      text-decoration: none;
      color: var(--text-des-color);
      &:hover {
        color: #396fff;
      }
      .icon-yulan {
        font-size: 20px;
        cursor: pointer;
      }
    }
  }
  .xj-header {
    background: #fafafa;
    margin-top: 10px;
    width: 405px;
    line-height: 40px;
    border: none !important;

    & > span {
      display: inline-block;
      line-height: 50px;
    }
  }
  .nodata {
    margin-top: 20px;
    text-align: center;
  }
  .icon {
    font-size: 14px;
  }
}
</style>

<template>
  <div id="contract-scanning" class="xj-scroll sty-status-dot" @click.stop>
    <ul>
      <li class="xj-header">
        <span style="width: 90px">附件类型</span>
        <span style="width: 170px">附件名称</span>
        <span style="width: 86px">状态</span>
        <span style="width: 58px">操作</span>
      </li>
      <div v-if="hasNew">
        <li v-for="(file, index) in detail.contract_detail.attachment_url_list" :key="index">
          <span class="item-name">合同附件</span>
          <div class="item-title">
            <a class="file-link">{{ file.file_name }}</a>
          </div>
          <div class="item-status">
            <span
              class="item-status-name"
              :class="`font-status-dot-${detail.contract_info.contract_status}`"
              >{{ detail.contract_info.contract_status_str }}</span
            >
          </div>
          <div class="item-oparete">
            <a class="download-link" :href="file.url + '?Authorization=' + token" target="_blank">
              <tg-icon name="ico-download"></tg-icon>
            </a>
            <a class="preview" @click.stop="preview(file.url)">
              <tg-icon name="ico-preview"></tg-icon>
            </a>
          </div>
        </li>
      </div>
      <div v-if="hasSupplement">
        <li v-for="(file, index) in multipleSupplement" :key="index">
          <span class="item-name">补充协议</span>
          <div class="item-title">
            <a class="file-link">{{
              file.attachment_url.split('/')[file.attachment_url.split('/').length - 1]
            }}</a>
          </div>
          <div class="item-status">
            <span
              class="item-status-name"
              :class="`font-status-dot-${file.contract_annex_status}`"
              >{{ file.contract_annex_status_str }}</span
            >
          </div>
          <div class="item-oparete">
            <a
              class="download-link"
              :href="file.attachment_url + '?Authorization=' + token"
              target="_blank"
            >
              <tg-icon name="ico-download"></tg-icon>
            </a>
            <a class="preview" @click.stop="preview(file.attachment_url)">
              <tg-icon name="ico-preview"></tg-icon>
            </a>
          </div>
        </li>
      </div>
      <div v-if="hasScanning">
        <li
          v-for="(file, index) in detail.contract_detail.contract_scan_urls"
          :key="index"
          class="contract-item"
        >
          <span class="item-name">合同扫描件</span>
          <div class="item-title">
            <a class="file-link" @click.stop="preview(file.url)" target="_blank">{{
              file.file_name
            }}</a>
          </div>
          <div class="item-status">
            <span
              class="item-status-name"
              :class="`font-status-dot-${detail.contract_info.contract_status}`"
              >{{ detail.contract_info.contract_status_str }}</span
            >
          </div>
          <div class="item-oparete">
            <a class="download-link" :href="file.url + '?Authorization=' + token" target="_blank">
              <tg-icon name="ico-download"></tg-icon>
            </a>
            <a class="preview" @click.stop="preview(file.url)">
              <tg-icon name="ico-preview"></tg-icon>
            </a>
          </div>
        </li>
      </div>
      <div v-if="hasSettlement">
        <li v-for="(file, index) in multipleSupplement" :key="index" class="contract-item">
          <span class="item-name">结算单</span>
          <div class="item-title">
            <a class="file-link" @click.stop="preview(file.attachment_url)" target="_blank">{{
              file.file_name
            }}</a>
          </div>
          <div class="item-status">
            <span
              class="item-status-name"
              :class="`font-status-dot-${file.contract_statements_status}`"
              >{{ file.contract_statements_status_str }}</span
            >
          </div>
          <div class="item-oparete">
            <a
              class="download-link"
              :href="file.attachment_url + '?Authorization=' + token"
              target="_blank"
            >
              <tg-icon name="ico-download"></tg-icon>
            </a>
            <a class="preview" @click.stop="preview(file.attachment_url)">
              <tg-icon name="ico-preview"></tg-icon>
            </a>
          </div>
        </li>
      </div>
      <div class="nodata" v-if="!hasNew && !hasSupplement && !hasScanning">暂无数据</div>
    </ul>
  </div>
</template>

<script>
import { fixFileToken } from '@/utils/http';
import { getToken } from '@/utils/token';
import TgIcon from '@/components/IconFont/tg.vue';

export default {
  name: 'AttachmentListPopover2',
  components: {
    TgIcon,
  },
  props: {
    detail: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  computed: {
    hasNew() {
      // 有合同附件
      if (this.detail && this.detail.contract_detail.attachment_url_list.length) return true;
      return false;
    },
    hasSupplement() {
      // 有补充附件
      if (
        this.detail &&
        this.detail.contract_annex_info.length &&
        this.detail.contract_annex_info[0].attachment_url_list.length
      )
        return true;
      return false;
    },
    hasScanning() {
      // 有扫描附件
      if (this.detail && this.detail.contract_detail.contract_scan_urls.length) return true;
      return false;
    },
    hasSettlement() {
      // 有结算单附件
      if (this.detail && this.multipleSupplement.length) return true;
      return false;
    },
    multipleSupplement() {
      const result = [];
      this.detail.contract_statements_list.forEach(vv => {
        vv.attachment_url_list.forEach(item => {
          result.push({
            attachment_url: item,
            file_name: decodeURIComponent(item.split('/')[item.split('/').length - 1] || '--'),
            contract_statements_status: vv.contract_statements_status,
            contract_statements_status_str: vv.contract_statements_status_str,
          });
        });
      });
      return result;
    },
  },
  data() {
    return {
      annexList: [],
      token: getToken(),
    };
  },
  methods: {
    preview(attachment_url) {
      const url = attachment_url;
      const arr = ['.doc', '.ppt', '.xls'];
      const wrUrl =
        'https://view.officeapps.live.com/op/view.aspx?src=' +
        encodeURIComponent(this.fixFileToken(url, false));
      if (url.includes(arr[0]) || url.includes(arr[1]) || url.includes(arr[2])) {
        window.open(wrUrl);
      } else {
        window.open(this.fixFileToken(url, false));
      }
    },
    preview2(attachment_url) {
      const url = attachment_url;
      const arr = ['.doc', '.ppt', '.xls'];
      const wrUrl =
        'https://view.officeapps.live.com/op/view.aspx?src=' +
        encodeURIComponent(this.fixFileToken(url, false));
      if (url.includes(arr[0]) || url.includes(arr[1]) || url.includes(arr[2])) {
        window.open(wrUrl);
      } else {
        window.open(this.fixFileToken(url, false));
      }
    },
    fixFileToken,
  },
};
</script>
