<style lang="scss" scoped>
@import '@/styles/vars.scss';
$color-primary: var(--theme-color);
#attachment-list-popover {
  ul > li {
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
      text-decoration: none;
      color: $color-primary;
      display: inline-block;
      width: 200px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      cursor: pointer;
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
      color: #bfc1c8;
      font-size: 20px;
      &:hover {
        color: var(--text-des-color);
      }
    }
  }
  .download-link {
    .el-icon-download {
      color: var(--text-des-color);
      font-size: 20px;
      &:hover {
        color: #396fff;
      }
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
</style>

<template>
  <div id="attachment-list-popover">
    <ul>
      <template v-if="annexList.length > 0">
        <!-- <li v-for="(item, index) in annexList" :key="index">
          <span class="item-name">补充附件：</span>
          <img src="@/assets/img/file_icon.png" />
          <a
            class="file-link"
            :href="item"
            target="_blank"
          >{{item.split('/')[item.split('/').length - 1]}}</a>
          <a class="download-link" :href="item" target="_blank">
            <i class="el-icon-download"></i>
          </a>
         <a class="preview" @click.stop="preview2(item.attachment_url)"  target="_blank">
          <i class="iconfont icon-yulan"></i>
        </a>
        </li> -->
        <li v-for="(item, index) in annexList" :key="index">
          <span class="item-name">补充附件：</span>
          <img src="@/assets/img/file_icon.png" />
          <a class="file-link" @click.stop="preview2(item)" target="_blank">{{
            decodeURIComponent(item.split('/')[item.split('/').length - 1] || '--')
          }}</a>
          <a class="download-link" :href="item" target="_blank">
            <i class="el-icon-download"></i>
          </a>
          <a class="preview" @click.stop="preview2(item)" target="_blank">
            <i class="iconfont icon-yulan"></i>
          </a>
        </li>
      </template>
    </ul>
  </div>
</template>

<script>
// import { getToken } from '@/utils/token';
import { fixFileToken } from '@/utils/http';
export default {
  name: 'AttachmentListPopover',
  props: {
    annexList: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  methods: {
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
