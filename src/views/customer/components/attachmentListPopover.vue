<style lang="scss" scoped>
@import '@/styles/vars.scss';
$color-primary: var(--theme-color);
#attachment-list-popover {
  ul > li,
  ul > div > li {
    height: 50px;
    line-height: 50px;
    border-bottom: #e8e8e8 dashed 1px;
    &:last-child(1) {
      border: none;
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
      width: 127px;
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
        background-color: $color-primary;
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
}
</style>

<template>
  <div id="attachment-list-popover">
    <ul>
      <!-- v-if="detail.contract_detail && detail.contract_detail.attachment_url" -->
      <div v-if="detail.contract_detail && detail.contract_detail.attachment_url">
        <li v-for="(file, index) in caseFileList()" :key="index">
          <span class="item-name">合同附件：</span>
          <img src="@/assets/img/file_icon.png" />
          <!-- detail.contract_detail.attachment_url -->
          <a
            class="file-link"
            @click.stop="preview(detail.contract_detail.attachment_url_list[index].url)"
            target="_blank"
            >{{ file.fileName }}</a
          >
          <em :class="`status-dot status-dot-${detail.contract_info.contract_status}`"></em>
          <span class="item-status-name">{{ detail.contract_info.contract_status_str }}</span>
          <a
            class="download-link"
            :href="detail.contract_detail.attachment_url_list[index].url"
            target="_blank"
          >
            <i class="el-icon-download"></i>
          </a>
          <a
            class="preview"
            @click.stop="preview(detail.contract_detail.attachment_url_list[index].url)"
          >
            <i class="iconfont icon-yulan"></i>
          </a>
        </li>
      </div>

      <!-- <template v-if="detail.contract_annex_info && detail.contract_annex_info.length > 0"> -->
      <li v-for="(item, index) in annexList" :key="index">
        <span class="item-name">补充附件：</span>
        <img src="@/assets/img/file_icon.png" />
        <a class="file-link" @click.stop="preview2(item.attachment_url)" target="_blank">{{
          item.attachment_url.split('/')[item.attachment_url.split('/').length - 1]
        }}</a>
        <em :class="`status-dot status-dot-${item.contract_annex_status}`"></em>
        <span class="item-status-name">{{ item.contract_annex_status_str }}</span>
        <a class="download-link" :href="item.attachment_url" target="_blank">
          <i class="el-icon-download"></i>
        </a>
        <a class="preview" @click.stop="preview2(item.attachment_url)" target="_blank">
          <i class="iconfont icon-yulan"></i>
        </a>
      </li>
      <!-- </template> -->
    </ul>
  </div>
</template>

<script>
// import { getToken } from '@/utils/token';
import { fixFileToken } from '@/utils/http';
export default {
  name: 'AttachmentListPopover',
  props: {
    detail: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      annexList: [],
    };
  },
  watch: {
    // detail: {
    //   deep: true,
    //   handler: ()
    // }
  },
  mounted() {
    this.handleAttachmentList();
    this.caseFileList();
  },
  methods: {
    // 处理附件数据
    handleAttachmentList() {
      // 由于一些合同附件包含多个附件文件，需单独整理
      this.annexList = [];
      if (this.detail.contract_annex_info && this.detail.contract_annex_info.length > 0) {
        for (let i = 0; i < this.detail.contract_annex_info.length; i++) {
          if (
            this.detail.contract_annex_info[i].attachment_url_list &&
            this.detail.contract_annex_info[i].attachment_url_list.length > 0
          ) {
            for (
              let j = 0;
              j < this.detail.contract_annex_info[i].attachment_url_list.length;
              j++
            ) {
              this.annexList.push({
                // 文件地址
                attachment_url: this.detail.contract_annex_info[i].attachment_url_list[j],
                // 附件审核状态
                contract_annex_status: this.detail.contract_annex_info[i].contract_annex_status,
                // 附件审核状态文字
                contract_annex_status_str:
                  this.detail.contract_annex_info[i].contract_annex_status_str,
              });
            }
          }
        }
      }
    },
    // 合同附件展示
    caseFileList() {
      if (this.detail && this.detail.contract_detail) {
        // console.log(this.detail.kol_info)
        const caseArr = this.detail.contract_detail.attachment_url.split(',');
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
    preview(attachment_url) {
      const url = attachment_url;
      console.log(attachment_url);
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
      console.log(attachment_url);
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
